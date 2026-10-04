const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

// Middleware для логирования запросов в консоль
app.use((req, res, next) => {
    console.log(`[${new Date()}] ${req.method} ${req.url}`);
    next();
});

let courses = [
    {
        id: 1,
        title: 'Основы JavaScript',
        duration: 40
    },
    {
        id: 2,
        title: 'Основы Python',
        duration: 50
    },
    {
        id: 3,
        title: 'Web-разработка',
        duration: 60
    }
];

let nextId = 4;

app.get('/items', (req, res) => {
    res.json({
        count: courses.length,
        items: courses
    });
});

app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const course = courses.find(course => course.id === id);

    if (!course) {
        return res.status(404).json({
            error: 'Курс не найден'
        });
    }

    res.json(course);
});


app.post('/items', (req, res) => {
    const { title, duration } = req.body;

    // Проверяем обязательные поля
    if (!title || duration === undefined) {
        return res.status(400).json({
            error: 'Поля title и duration обязательны'
        });
    }

    const newCourse = {
        id: nextId++,
        title: title,
        duration: duration
    };

    courses.push(newCourse);

    res.status(201).json(newCourse);
});


app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = courses.findIndex(course => course.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Курс не найден'
        });
    }

    const { title, duration } = req.body;

    courses[index] = {
        id: id,
        title: title || courses[index].title,
        duration: duration !== undefined
            ? duration
            : courses[index].duration
    };

    res.json(courses[index]);
});

app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = courses.findIndex(course => course.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Курс не найден'
        });
    }

    const deletedCourse = courses.splice(index, 1)[0];

    res.json({
        message: 'Курс удалён',
        deleted: deletedCourse
    });
});


app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден'
    });
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});