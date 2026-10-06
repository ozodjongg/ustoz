from pathlib import Path

HERE = Path(__file__).resolve().parent
parts = sorted(HERE.glob('generate_data.part*.txt'), key=lambda p: int(p.stem.split('part')[-1]))
source = ''.join(p.read_text(encoding='utf-8') for p in parts)
exec(compile(source, str(HERE / 'generate_data.generated.py'), 'exec'))
