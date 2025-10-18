# helpers for preprocessing / scaling (fill in as needed)
import numpy as np

def scale_features(arr, means=None, stds=None):
    a = np.array(arr, dtype=float)
    if means is not None and stds is not None:
        return (a - means) / stds
    return a
