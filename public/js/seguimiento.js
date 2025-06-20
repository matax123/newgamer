let timeline = document.getElementById('timeline');

let objects = [
    {
        date: '19 de junio de 2025',
        event: 'Preparando orden',
        description: 'La orden está preparandose',
        state: 'finished'
    },
    {
        date: '19 de junio de 2025',
        event: 'Listo para enviar',
        description: 'La orden está lista para enviar',
        state: 'finished'
    },
    {
        date: '19 de junio de 2025',
        event: 'En tránsito',
        description: 'La orden se encuentra viajando',
        state: 'started'
    },
    {
        date: '19 de junio de 2025',
        event: 'Entregado',
        description: 'La orden ha sido entregada',
        state: 'unstarted'
    }
];
createTimeline(timeline, objects)