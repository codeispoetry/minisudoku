import os
from PIL import Image, ImageDraw, ImageFont
import io

def create_sudoku_icon(size):
    # Erstelle ein neues Bild mit transparentem Hintergrund
    img = Image.new('RGBA', (size, size), (33, 150, 243, 255))  # Blauer Hintergrund
    draw = ImageDraw.Draw(img)
    
    # Zeichne ein 6x6 Gitter
    grid_size = int(size * 0.7)
    offset = (size - grid_size) // 2
    cell_size = grid_size // 6
    
    # Zeichne Gitterlinien
    for i in range(7):
        x = offset + i * cell_size
        # Vertikale Linien
        width = 3 if i % 3 == 0 else 1
        draw.line([(x, offset), (x, offset + grid_size)], fill='white', width=width)
        
        y = offset + i * cell_size
        # Horizontale Linien  
        width = 3 if i % 2 == 0 else 1
        draw.line([(offset, y), (offset + grid_size, y)], fill='white', width=width)
    
    # Füge einige Zahlen hinzu
    try:
        font_size = max(12, size // 20)
        font = ImageFont.load_default()
    except:
        font = None
    
    numbers = ['1', '4', '2', '6', '3', '5']
    positions = [(0,0), (1,1), (2,2), (3,3), (4,4), (5,5)]
    
    for i, (row, col) in enumerate(positions):
        if i < len(numbers):
            x = offset + col * cell_size + cell_size // 2
            y = offset + row * cell_size + cell_size // 2
            
            # Text zentrieren
            if font:
                bbox = draw.textbbox((0, 0), numbers[i], font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                draw.text((x - text_width//2, y - text_height//2), numbers[i], 
                         fill='white', font=font)
            else:
                draw.text((x-5, y-8), numbers[i], fill='white')
    
    return img

# Erstelle Icons
icon_192 = create_sudoku_icon(192)
icon_512 = create_sudoku_icon(512)

# Speichere als PNG
icon_192.save('icon-192x192.png')
icon_512.save('icon-512x512.png')

print("Icons erfolgreich erstellt!")
