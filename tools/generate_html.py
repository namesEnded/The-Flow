import random


def generate_html_page(colors):
    # Вычисляем количество квадратов, не меньше длины списка цветов
    num_squares = max(len(colors), random.randint(5, 10))

    # Генерируем случайные процентные размеры квадратов
    square_sizes = [f'{random.randint(5, 15)}vh' for _ in range(num_squares)]

    # Генерируем случайные координаты для размещения квадратов
    coordinates = []
    x = 0
    y = 0
    for _ in range(num_squares):
        coordinates.append((x, y))
        x += random.randint(10, 30)
        if x > 80:  # Если достигнут предел по ширине, переходим на новую строку
            x = 0
            y += random.randint(10, 30)

    # Генерируем случайный HTML код для квадратов
    squares_html = ''
    for i in range(num_squares):
        color = random.choice(colors)
        coordinates_str = f'{coordinates[i][0]}vw, {coordinates[i][1]}vh'
        square_html = f'<div class="square" style="background-color: {color}; transform: translate({coordinates_str}); width: {square_sizes[i]}; height: {square_sizes[i]}"></div>'
        squares_html += square_html

    # Формируем окончательный HTML код
    html_code = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                margin: 0;
                padding: 0;
            }}

            .square {{
                position: absolute;
            }}
        </style>
    </head>
    <body>
        {squares_html}
    </body>
    </html>
    '''

    return html_code


if __name__ == '__main__':
    colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff']
    html_page = generate_html_page(colors)
    # Сохраняем сгенерированную страницу в файл
    with open('generated_page.html', 'w') as file:
        file.write(html_page)
    print(f"Результирующая страница сохранена в файл result.html.")
