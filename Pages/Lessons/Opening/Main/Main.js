import '../../../../Api/Components/Menu/Menu.js';
import '../../../../Api/Components/Footer/Footer.js';


let clock = document.querySelector('.Clock');
let clock__arrow_hour = document.querySelector('.Clock__arrow_hour');
let clock__arrow_minute = document.querySelector('.Clock__arrow_minute');
let clock__arrow_second = document.querySelector('.Clock__arrow_second');
let clock__template = document.querySelector('template');


function clock__arrow_shadow_refresh(arrow, angle) {
    angle = -angle * Math.PI / 180;

    let angle_cos = Math.cos(angle);
    let angle_sin = Math.sin(angle);
    let x = angle_cos - angle_sin;
    let y = angle_sin + angle_cos;

    arrow.style.setProperty('--Clock__arrow_shadow_x', x);
    arrow.style.setProperty('--Clock__arrow_shadow_y', y);
}

function clock_createPoints() {
    let clock__point = clock__template.content.querySelector('.Clock__point');

    for (let i = 0; i < 60; i++) {
        let clock__point_new = clock__point.cloneNode();

        clock__point_new.style.setProperty('--Clock__point_angle', i * 6);

        clock.prepend(clock__point_new);
    }
}

function clock_refresh() {
    let date = new Date();

    let arrow_hour_angle = date.getHours() * 30 + date.getMinutes() / 2;
    let arrow_minute_angle = date.getMinutes() * 6;
    let arrow_second_angle = date.getSeconds() * 6;

    clock__arrow_hour.style.setProperty('--Clock__arrow_angle', arrow_hour_angle);
    clock__arrow_minute.style.setProperty('--Clock__arrow_angle', arrow_minute_angle);
    clock__arrow_second.style.setProperty('--Clock__arrow_angle', arrow_second_angle);

    clock__arrow_shadow_refresh(clock__arrow_hour, arrow_hour_angle);
    clock__arrow_shadow_refresh(clock__arrow_minute, arrow_minute_angle);
    clock__arrow_shadow_refresh(clock__arrow_second, arrow_second_angle);

    requestAnimationFrame(clock_refresh);
}


clock_createPoints();
clock_refresh();
