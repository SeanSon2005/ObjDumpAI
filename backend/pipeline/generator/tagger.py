from transformers import BlipProcessor, BlipForConditionalGeneration
from torch.utils.data import Dataset, DataLoader
import torch
import os
import numpy as np
import cv2
from PIL import Image

class ImageDataset:
    def __init__(self, input):
        self.images = []
        self.image_paths = []
        
        if isinstance(input, str):
            for image_name in os.listdir(input):
                image_path = os.path.join(input, image_name)
                image = cv2.imread(image_path)
                if image is not None:
                    self.images.append(image)
                    self.image_paths.append(image_path)
        else:
            self.images = input

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()

        sample = self.images[idx]
        path = self.image_paths[idx]
        return path, sample

    def __iter__(self):
        for idx in range(len(self.images)):
            yield self[idx]

class Tag_Generator:
    def __init__(self, input_path: str = "data/images", output_path: str = "data"):
        self.input_path = input_path
        self.output_path = output_path
        self.mode = "cuda" if torch.cuda.is_available() else "cpu"
        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(self.mode)

    def tag(self, input_images=None, output: bool = True):
        if input_images:
            image_dataset = ImageDataset(input_images)
        else:
            image_dataset = ImageDataset(self.input_path)
        
        descriptions = []
        for img_path, batch in image_dataset:
            raw_image = Image.fromarray(batch).convert('RGB')
            inputs = self.processor(raw_image, return_tensors="pt").to(self.mode)
            out = self.model.generate(**inputs)
            description = self.processor.decode(out[0], skip_special_tokens=True)
            base_name = os.path.basename(img_path)
            descriptions.append((base_name, description))
        
        if output:
            return descriptions
        else:
            return []
