import numpy as np

NUM_IMGS = 10

empty_images = np.zeros((NUM_IMGS,640,640,3), dtype=np.float32)
empty_labels = np.zeros((NUM_IMGS,5), dtype=np.float32)

np.save("pipeline/data/images.npy", empty_images)
np.save("pipeline/data/labels.npy",empty_labels)