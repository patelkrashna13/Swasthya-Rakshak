#!/usr/bin/env python3
"""
RSNA Fracture Dataset Setup Script
Downloads and prepares the RSNA 2022 Cervical Spine Fracture Detection dataset
"""

import os
import pandas as pd
import numpy as np
import pydicom
import cv2
from pathlib import Path
import requests
import zipfile
from tqdm import tqdm
import json
import shutil

class RSNADatasetSetup:
    def __init__(self, data_dir='data'):
        self.data_dir = Path(data_dir)
        self.raw_dir = self.data_dir / 'raw'
        self.processed_dir = self.data_dir / 'train_images'
        self.classes = ['Normal', 'Crack', 'Fracture', 'Hemorrhage']
        
    def create_directories(self):
        """Create required directory structure"""
        print("Creating directory structure...")
        
        # Create main directories
        self.data_dir.mkdir(exist_ok=True)
        self.raw_dir.mkdir(exist_ok=True)
        self.processed_dir.mkdir(exist_ok=True)
        
        # Create class directories
        for class_name in self.classes:
            (self.processed_dir / class_name.lower()).mkdir(exist_ok=True)
        
        print(f"✓ Created directories in {self.data_dir}")
    
    def download_kaggle_dataset(self):
        """Download RSNA dataset from Kaggle"""
        print("\n=== KAGGLE DATASET DOWNLOAD ===")
        print("To download the RSNA dataset, you need to:")
        print("1. Install Kaggle API: pip install kaggle")
        print("2. Set up Kaggle credentials: https://www.kaggle.com/docs/api")
        print("3. Accept competition rules: https://www.kaggle.com/competitions/rsna-2022-cervical-spine-fracture-detection")
        print("\nThen run these commands:")
        print("kaggle competitions download -c rsna-2022-cervical-spine-fracture-detection")
        print("unzip rsna-2022-cervical-spine-fracture-detection.zip -d data/raw/")
        
        # Check if data already exists
        if (self.raw_dir / 'train_images').exists():
            print("✓ Raw dataset found!")
            return True
        else:
            print("❌ Please download the dataset manually using the commands above")
            return False
    
    def convert_dicom_to_jpg(self, dicom_path, output_path, target_size=(224, 224)):
        """Convert DICOM file to JPEG with preprocessing"""
        try:
            # Read DICOM file
            dicom = pydicom.dcmread(dicom_path)
            
            # Get pixel array
            pixel_array = dicom.pixel_array
            
            # Normalize to 0-255
            pixel_array = pixel_array.astype(np.float32)
            pixel_array = (pixel_array - pixel_array.min()) / (pixel_array.max() - pixel_array.min())
            pixel_array = (pixel_array * 255).astype(np.uint8)
            
            # Convert to RGB if grayscale
            if len(pixel_array.shape) == 2:
                pixel_array = cv2.cvtColor(pixel_array, cv2.COLOR_GRAY2RGB)
            
            # Resize
            pixel_array = cv2.resize(pixel_array, target_size)
            
            # Apply CLAHE for better contrast
            lab = cv2.cvtColor(pixel_array, cv2.COLOR_RGB2LAB)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            lab[:,:,0] = clahe.apply(lab[:,:,0])
            pixel_array = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
            
            # Save as JPEG
            cv2.imwrite(str(output_path), cv2.cvtColor(pixel_array, cv2.COLOR_RGB2BGR))
            return True
            
        except Exception as e:
            print(f"Error converting {dicom_path}: {e}")
            return False
    
    def process_rsna_dataset(self):
        """Process RSNA dataset and organize by classes"""
        print("\nProcessing RSNA dataset...")
        
        # Load train labels
        train_csv_path = self.raw_dir / 'train.csv'
        if not train_csv_path.exists():
            print("❌ train.csv not found. Please ensure the dataset is downloaded.")
            return False
        
        df = pd.read_csv(train_csv_path)
        print(f"✓ Loaded {len(df)} training samples")
        
        # Create mapping for fracture types
        processed_data = []
        
        for idx, row in tqdm(df.iterrows(), total=len(df), desc="Processing images"):
            study_id = row['StudyInstanceUID']
            
            # Determine class based on fracture columns
            fracture_cols = [col for col in df.columns if 'fracture' in col.lower()]
            has_fracture = any(row[col] == 1 for col in fracture_cols if col in row)
            
            # Simple classification logic (you may need to adjust based on actual dataset)
            if has_fracture:
                if 'C1' in str(row) or 'C2' in str(row):
                    class_name = 'Fracture'
                else:
                    class_name = 'Crack'
            else:
                class_name = 'Normal'
            
            # Find corresponding DICOM file
            dicom_path = self.raw_dir / 'train_images' / f"{study_id}.dcm"
            if not dicom_path.exists():
                continue
            
            # Output path
            output_filename = f"{study_id}.jpg"
            output_path = self.processed_dir / class_name.lower() / output_filename
            
            # Convert DICOM to JPEG
            if self.convert_dicom_to_jpg(dicom_path, output_path):
                processed_data.append({
                    'image_path': f"train_images/{class_name.lower()}/{output_filename}",
                    'class': class_name,
                    'patient_id': study_id
                })
        
        # Save processed dataset info
        processed_df = pd.DataFrame(processed_data)
        processed_df.to_csv(self.data_dir / 'train.csv', index=False)
        
        print(f"✓ Processed {len(processed_data)} images")
        print(f"✓ Class distribution:")
        print(processed_df['class'].value_counts())
        
        return True
    
    def create_sample_dataset(self):
        """Create a small sample dataset for testing"""
        print("\nCreating sample dataset for testing...")
        
        # Create sample images (placeholder)
        sample_data = []
        
        for class_name in self.classes:
            class_dir = self.processed_dir / class_name.lower()
            
            # Create 10 sample images per class
            for i in range(10):
                # Create a simple synthetic X-ray-like image
                img = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
                
                # Add some structure to make it look more like an X-ray
                if class_name == 'Fracture':
                    # Add a line to simulate fracture
                    cv2.line(img, (50, 50), (150, 150), (255, 255, 255), 3)
                elif class_name == 'Crack':
                    # Add a thin line for crack
                    cv2.line(img, (80, 80), (120, 120), (200, 200, 200), 1)
                
                filename = f"sample_{class_name.lower()}_{i:03d}.jpg"
                filepath = class_dir / filename
                cv2.imwrite(str(filepath), img)
                
                sample_data.append({
                    'image_path': f"train_images/{class_name.lower()}/{filename}",
                    'class': class_name,
                    'patient_id': f"SAMPLE_{i:03d}"
                })
        
        # Save sample dataset CSV
        sample_df = pd.DataFrame(sample_data)
        sample_df.to_csv(self.data_dir / 'train.csv', index=False)
        
        print(f"✓ Created {len(sample_data)} sample images")
        print("✓ This is for testing only. Replace with real RSNA data for production.")
        
        return True

def main():
    """Main setup function"""
    print("=== RSNA Fracture Dataset Setup ===")
    
    setup = RSNADatasetSetup()
    
    # Step 1: Create directories
    setup.create_directories()
    
    # Step 2: Try to download/find RSNA dataset
    if not setup.download_kaggle_dataset():
        print("\nCreating sample dataset for testing...")
        setup.create_sample_dataset()
        print("\n⚠️  Using sample data. Download real RSNA dataset for production use.")
    else:
        # Step 3: Process real dataset
        setup.process_rsna_dataset()
    
    print("\n✅ Dataset setup complete!")
    print(f"Data directory: {setup.data_dir.absolute()}")
    print("\nNext steps:")
    print("1. Install ML dependencies: pip install -r requirements.txt")
    print("2. Train the model: python train_fracture_model.py")

if __name__ == "__main__":
    main()
