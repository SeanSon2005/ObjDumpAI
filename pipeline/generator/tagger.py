from transformers import BlipProcessor, BlipForConditionalGeneration
from torch.utils.data import Dataset, DataLoader
import torch
import os
import numpy as np
import cv2
from PIL import Image

class ImageDataset:
    """Simple Image Dataset"""

    def __init__(self, input):
        if isinstance(input, str):
            self.images = []
            for image_name in os.listdir(input):
                image_path = os.path.join(input, image_name)
                image = cv2.imread(image_path)
                self.images.append(image)
        else:
            self.images = input

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()

        sample = self.images[idx]
        return sample

    def __iter__(self):
        data_iter = iter(self.images)
        return data_iter
    

class Tag_Generator:
    def __init__(self, input_path: str = "data/images", output_path: str = "data"):
        self.input_path = input_path
        self.output_path = output_path
        self.processor = BlipProcessor.from_pretrained(
            "Salesforce/blip-image-captioning-base")
        self.model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base").to("cuda")
    def tag(self, input_images = None, output: bool = True):
        if input_images:
            image_dataset = ImageDataset(input_images)
        else:
            image_dataset = ImageDataset(self.input_path)
        descriptions = []
        for batch in image_dataset:
            raw_image = Image.fromarray(batch).convert('RGB')
            inputs = self.processor(raw_image, return_tensors="pt").to("cuda")
            out = self.model.generate(**inputs)
            descriptions.append(self.processor.decode(out[0], 
                                                      skip_special_tokens=True))
        if output:
            return descriptions
        else:
            tag_path = os.path.join(self.output_path, 
                                    "tags"+str(idx)+".txt")
            with open(tag_path,'w') as f:
                for idx, desc in enumerate(descriptions):
                    f.write(desc)
                f.close()
                    
