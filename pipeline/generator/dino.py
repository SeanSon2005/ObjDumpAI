from autodistill_grounding_dino import GroundingDINO
from autodistill.detection import CaptionOntology
from utils.logger import get_logger
import os
import cv2
import supervision as sv
import numpy as np

class Generator:
    def __init__(self, input_path="data/images", output_path="data/labels"):
        self.output_path = output_path
        self.input_path = input_path
        self.input_path2 = "data/annotated_images"
        self.logger = get_logger(
            name="trainer", verbosity=0
        )
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
    
    def label(self, queries: list[str]):
        self.class_dict = {i: string for i, string in enumerate(queries)}
        model = GroundingDINO(
            ontology=CaptionOntology({string: string for string in queries})
            )
        for image_name in os.listdir(self.input_path):
            try:
                image_path = os.path.join(self.input_path, image_name)
                annotated_image_path = os.path.join(self.input_path2, image_name)
                label_path = os.path.join(self.output_path, image_name[:-3]+"txt")
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