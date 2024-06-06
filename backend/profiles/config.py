
DEFAULT_CONFIG = {
    'main': {
        'name': 'object_detection',
        'seed': 24,
        'cuda': True,
    },
    'data_loader': {
        'type': 'CustomDataLoader',
        'args': {
            'data_dir': 'data/',
            'batch_size': 1,
            'shuffle': True,
            'validation_split': 0.1,
            'num_workers': 8,
        }
    },
    'arch': {
        'type': 'Yolov8n',
        'args': {},
    },
    'optimizer': {
        'type': 'Adam',
        'args': {
            'lr': 5.e-4,
        }
    },
    'lr_scheduler': {
        'type': 'ExponentialLR',
        'args': {
            'gamma': 0.98,
        }
    },
    'loss': {
        'type': 'YoloLoss',
        'args': {},
        'test': {
            'box': 7.5,
            'cls': 0.5,
            'dfl': 1.5,
        }
    },
    'metrics': [
        'bbox_iou',
    ],
    'trainer': {
        'epochs': 100,
        'log_step': 10,
        'save_dir': 'data/runs/',
        'save_period': 5,
        'monitor': 'min val_loss',
        'early_stop': 10,
    },
    'logger': {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'brief': {
                'format': '%(message)s',
            },
            'precise': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S',
            }
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'DEBUG',
                'formatter': 'brief',
                'stream': 'ext://sys.stdout',
            },
            'file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'INFO',
                'formatter': 'precise',
                'filename': 'info.log',
                'maxBytes': 1.e+6,
                'backupCount': 5,
                'encoding': 'utf8',
            }
        },
        'root': {
            'level': 'INFO',
            'handlers': [
                'console',
                'file',
            ],
        }
    }
}

