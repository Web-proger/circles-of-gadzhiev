const fakeData = [
  { num: 0, count: 0, color: '#50c605', task: 'Купить молоко' },
  { num: 0, count: 1, color: '#28cdc1', task: 'Вырастить сына' },
  { num: 0, count: 2, color: '#ba799f', task: 'Посадить дерево' },
  { num: 0, count: 4, color: '#ced056', task: 'Построить дом' },
];

// Высота сектора
const SECTOR_HEIGHT = 30;

let app =new Vue({
  el: '#app',
  data: {
    rows: [{
      num: 0,
      count: '',
      color: '',
      task: ''
    }],
    visible: false,
    elements: [],
    SECTOR_HEIGHT,
    dataArray: []
  },
  methods: {
    addNewNode() {
      this.rows.push({num: '', count: '', color: '', task: ''});
    },
    deleteTask(i) {
      this.rows.splice(i, 1);
    },
    getRandomColor() {
      this.rows.forEach(item => {
        item.color = '#' + Math.random().toString(16).slice(2, 8);
      })
    },
    fakeData() {
      this.rows = fakeData;
    },
    preview() {
      this.visible = true;
      this.elements = this.rows.slice();
      this.onload();
    },
    onload() {
      function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
        return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
        };
      }
      function describeArc(x, y, radius, startAngle, endAngle){
        const p = app.$data.SECTOR_HEIGHT;
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const start10 = polarToCartesian(x, y, radius - p, endAngle);
        const end10 = polarToCartesian(x, y, radius - p, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        const d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
          "L", end10.x, end10.y,
          "A", radius-p, radius-p, 0, largeArcFlag, 1, start10.x, start10.y,
          "Z"
        ].join(" ");

        return d;
      }
      //paint(количествоДелений, s, радиус) - рисуем подкруги и сектора в них
      /**
       * @param {object} item - данные для отрисовки круга
       * @param {object} item.num - порядковый номер сектора
       * @param {number} item.count - количество секторов
       * @param {string} item.color - цвет сектора
       * @param {string} item.task - текст задачи
       * @param {number} s - под каким углом будет первое разделение сектора
       * @param {number} radius - радиус
       */
      function paint(item, s, radius) {
        let startAngle, endAngle;
        const p = 360/item.count;
        for (let i = 0; i < item.count; i++) {
          startAngle = s + (i * p);
          endAngle = s + ((i+1) * p);
          app.$data.dataArray.push({
            id: 'arc' + item.num + '-' + i,
            color: item.color,
            d: describeArc(cX, cY, radius, startAngle, endAngle)
          })
        }
      }

      const cX = 200, cY = 200;
      let startSectorCoord = 0;  // Стартовый градус отрисовки разделителя секторов
      const SHIFT_SECTOR = 20;  // Сдвиг отрисовки сектора
      let radius = this.SECTOR_HEIGHT; // Стартовый радиус
      this.dataArray = [];
      this.elements.forEach((item) => {
        paint(item, startSectorCoord, radius);
        startSectorCoord = startSectorCoord + SHIFT_SECTOR;
        radius = radius + this.SECTOR_HEIGHT;
      });
    }
  }
});
