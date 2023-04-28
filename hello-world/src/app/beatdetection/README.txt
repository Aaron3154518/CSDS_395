# Beat Detection

Beat detection algoirthm for determining the tempo of songs.

## Usage

```python
import detectbeat as dbeat

# example file 
filepath = "ballroom.wav"

# window size to parse audio
framesize = 256

# window hop size
hop = 128

beat_estimate = dbeat.run_beat_detection(filepath=filepath, framesize=framesize, hop=hop)
```

## Command Line Usage
```bash
python detectbeat.py --path="ballroom.wav" --framesize=256 --hop=128
```