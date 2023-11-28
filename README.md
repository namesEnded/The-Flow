# ВВЕДЕНИЕ

Веб-редактор изображений - это инструмент, который позволяет пользователям загружать, редактировать и сохранять изображения прямо в браузере. Они стали неотъемлемой частью современного интернета, где визуальный контент играет ключевую роль в общении и передаче информации. Веб-редакторы изображений используются для создания и редактирования графического контента для веб-сайтов, социальных сетей, блогов и других платформ.

Актуальность проекта веб-редактора изображений, такого как «Flow», неоспорима в современном интернете, где визуальный контент стал основным средством коммуникации и передачи информации. С ростом числа пользователей в сети и увеличением объема графического контента, возникает потребность в удобных и функциональных инструментах для работы с изображениями.

Цель данного курсового проекта - разработка графического веб-редактора изображений под названием «Flow», который будет предлагать пользователям широкий спектр функций для работы с изображениями.

Задачи, выделенные при создании «Flow», включают:

1. Разработка функционала для загрузки изображений пользователем.
2. Реализация инструментов для работы с загруженным изображением, включая кадрирование, добавление текста различными шрифтами и цветами, свободное рисование на изображении.
3. Интеграция библиотек «Rembg» и «Pillow» для отделения основного объекта на изображении от фона.
4. Разработка ролевой модели взаимодействия пользователя с системой, включая авторизацию и регистрацию пользователей.
5. Создание пользовательских профилей с возможностью просмотра списка загруженных изображений и выбора конкретного изображения для дальнейшего редактирования, удаления или экспорта.

# ОПИСАНИЕ РАБОТЫ

# Программные средства

Для реализации описанного выше функционала, в проекте будут использоваться следующие программные средства:

1. Высокоуровневый язык программирования Python;
2. Микро-фреймворк Flask – используется для реализации серверной части проекта;
3. Объектно-реляционная система управления базами «PostgreSQL» – осуществляет хранение текстовой административной информации системы;
4. Документоориентированная система управления базами данных «MongoDB» и, в частности, ее спецификация «GridFS» служат для хранения бинарных данных, в данном случае – изображений;
5. Программная библиотека для работы с реляционными СУБД с применением технологии ORM «SQLAlchemy»;
6. Мультипарадигменный язык программирования «JavaScript»;
7. Язык таблиц каскадных стилей «CSS»;
8. Стандартизированный язык гипертекстовой разметки документов «HTML»;
9. «cropper.js» - Используется для кадрирования изображения;
10. «microtip.css» и «sweetalert2» - Для реализации всплывающих подсказок;
11. «html2canvas.min.js» - Для имплементации экспортирования отредактированного изображения.

## Распределение областей ответственности

1. Афонин Арсений Алексеевич
  - Разработка серверной части проекта. Включает в себя:
    - Взаимодействие с базами данных (PostgreSQL, MongoDB);
    - Ролевая модель;
    - API для реализации принципов работы «клиент-сервер»
      - «CRUD» изображений, созданных в редакторе в системе;
      - Авторизация и регистрация пользователей.
  - Разработка интерактивного прототипа проекта. Для разработки используется ПО «Figma»;
  - Вёрстка страниц.

2. Дмитриев Олег Олегович
  - Разработка функциональных возможностей редактора, описанных выше;
  - Разработка способа адаптации алгоритма отделения целевого объекта изображения от фона при помощи библиотеки «Rembg» и «Pillow»;
  - Создание мокапов страниц, а также разработка UX-дизайна приложения;
  - Вёрстка страниц.