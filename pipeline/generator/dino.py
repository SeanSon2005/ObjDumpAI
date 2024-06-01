from autodistill_grounding_dino import GroundingDINO
from autodistill.detection import CaptionOntology
from utils.logger import get_logger

class Generator:
    def __init__(self, output_path="data/labels"):
        self.model = GroundingDINO(
            ontology=CaptionOntology({"shipping container": "container"})
            )
        self.output_path = output_path
        self.logger = get_logger(
            name="trainer", verbosity=2
        )
    def label(self, path: str):
        try:
            self.model.label(input_folder = path, 
                             output_folder = self.output_path)
        except:
            self.logger.info("File not Found: ", path)