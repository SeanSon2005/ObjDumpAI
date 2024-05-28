from autodistill_grounding_dino import GroundingDINO
from autodistill.detection import CaptionOntology
import os
import cv2
import supervision as sv

DATASET_NAME = "sample"

base_model = GroundingDINO(ontology=CaptionOntology({"shipping container": "container"}))

IMAGE_NAME = "valid/images/image.jpg"

image = os.path.join(DATASET_NAME, IMAGE_NAME)

predictions = base_model.predict(image)

image = cv2.imread(image)

annotator = sv.BoxAnnotator()

annotated_image = annotator.annotate(scene=image, detections=predictions)
