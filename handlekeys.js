// Swipe-only mobile controls. No on-screen buttons or keyboard gameplay controls.
(function () {
  'use strict';
  function quizIsOpen() {
    return typeof powerQuizOpen !== 'undefined' && powerQuizOpen;
  }
  function moveLane(direction) {
    if (quizIsOpen() || typeof player === 'undefined' || !player || !player.pos) return;
    player.pos[0] = Math.max(-6, Math.min(6, player.pos[0] + direction * 6));
    if (typeof police !== 'undefined' && police && police.pos) police.pos[0] = player.pos[0];
  }
  function jump() {
    if (quizIsOpen() || typeof player === 'undefined' || !player) return;
    if (player.pos[1] < -4) player.pos[1] = -4;
    if (!jumping && !ducking) {
      jumping = true; ducking = false; player.speedy = 0.3;
    }
  }
  function slide() {
    if (quizIsOpen() || typeof player === 'undefined' || !player || player.fly_boost) return;
    if (player.pos[1] !== -4) player.pos[1] = -4;
    ducking = true; jumping = false; player.speedy = 0.2;
  }
  document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('glcanvas');
    if (!canvas) return;
    var startX = 0, startY = 0, startAt = 0;
    canvas.addEventListener('pointerdown', function (e) {
      if (quizIsOpen()) return;
      startX = e.clientX; startY = e.clientY; startAt = Date.now();
    }, { passive: true });
    canvas.addEventListener('pointerup', function (e) {
      if (quizIsOpen() || !startAt) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      var distance = Math.max(Math.abs(dx), Math.abs(dy));
      if (distance < 24 || Date.now() - startAt > 700) { startAt = 0; return; }
      if (Math.abs(dx) > Math.abs(dy)) moveLane(dx < 0 ? -1 : 1);
      else if (dy < 0) jump(); else slide();
      startAt = 0;
    }, { passive: true });
    canvas.addEventListener('pointercancel', function () { startAt = 0; }, { passive: true });
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
})();
