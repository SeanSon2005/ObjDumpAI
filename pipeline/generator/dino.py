from autodistill_grounding_dino import GroundingDINO
from autodistill.detection import CaptionOntology
import logging
import os
import cv2
import supervision as sv
import numpy as np
import zlib

class Generator:
    def __init__(self, logger: logging.Logger, base_path="."):
        self.output_path = os.path.join(base_path, "labels")
        self.input_path = os.path.join(base_path, "images")
        self.input_path2 = os.path.join(base_path, "annotated_images")
        self.logger = logger
        self.conf_threshold = 0.3
        self.class_dict = {}
    def get_class_dict(self):
        return self.class_dict

    def _object_to_yolo(
        self,
        xyxy: np.ndarray,
        class_id: int,
        image_shape: tuple
    ) -> str:
        h, w, _ = image_shape
        xyxy_relative = xyxy / np.array([w, h, w, h], dtype=np.float32)
        x_min, y_min, x_max, y_max = xyxy_relative
        x_center = (x_min + x_max) / 2
        y_center = (y_min + y_max) / 2
        width = x_max - x_min
        height = y_max - y_min
        return f"{int(class_id)} {x_center:.5f} {y_center:.5f} {width:.5f} {height:.5f}"
    
    def label(self, queries: list[str], force: bool = False):
        self.class_dict = {i: string for i, string in enumerate(queries)}
        model = GroundingDINO(
            ontology=CaptionOntology({string: string for string in queries})
            )
        label_names = set(os.listdir(self.output_path))
        label_count = 0

        for image_name in os.listdir(self.input_path):
            try:
                image_path = os.path.join(self.input_path, image_name)
                annotated_image_path = os.path.join(self.input_path2, image_name)
                label_name = str(zlib.adler32(image_name.encode('utf-8'))) + ".txt"

                if (not force and label_name in label_names):
                    continue

                label_count += 1

                label_path = os.path.join(self.output_path, label_name)
                image = cv2.imread(image_path)

                predictions = model.predict(image)
                bbox_annotator = sv.BoundingBoxAnnotator()
                label_annotator = sv.LabelAnnotator()
                annotated_image = bbox_annotator.annotate(scene=image, detections=predictions)
                annotated_image = label_annotator.annotate(scene=annotated_image, detections=predictions)
                cv2.imwrite(annotated_image_path, annotated_image)

                with open(label_path, "w") as f:
                    for index, data in enumerate(zip(predictions.xyxy, 
                                                    predictions.confidence, 
                                                    predictions.class_id)):
                        xyxy, conf, cls = data
                        if conf < self.conf_threshold:
                            continue
                        box_string = self._object_to_yolo(xyxy, cls, image.shape) + "\n"
                        f.write(box_string)
                    f.close()
            except:
                self.logger.info("File not Found: %s", image_path)
        self.logger.info("Number of Generated Labels: %s", label_count)
