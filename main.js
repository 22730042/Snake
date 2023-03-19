document.addEventListener('DOMContentLoaded', function () {
    const snakeboard = document.getElementById("gameCanvas");
    let game = new Game(snakeboard, 20, 0, '#eee', '#fff', 'darkblue');
    game.setUpSnake(5, 100, 100).init(1000 / 60);

    document.getElementById('btnGame').addEventListener('click', function () {
        if (this.getAttribute('data-id') == 'start_game' || this.getAttribute('data-id') == 'play_again') {
            if (this.getAttribute('data-id') == 'play_again') {
                game.reset(5, 100, 100, 20, 0);
            }
            const popup = document.getElementById("popup");
            popup.classList.add("popup-show");
        }
        else if (this.getAttribute('data-id') == 'pause_game') {
            game.pauseGame = true;
            this.textContent = 'Continue';
            this.classList.remove('pause');
            this.setAttribute('data-id', 'continue');
        }
        else if (this.getAttribute('data-id') == 'continue') {
            game.pauseGame = false;
            this.textContent = 'Pause';
            this.classList.add('pause');
            this.setAttribute('data-id', 'pause_game');
        }
    });

    document.querySelectorAll('.mode').forEach((v) => {
        v.addEventListener('click', function () {
            const btn = document.getElementById('btnGame');
            btn.textContent = 'Pause';
            btn.classList.add('pause');
            btn.setAttribute('data-id', 'pause_game');

            if (this.getAttribute('data-id') == 'easy_btn')
                game.mode = 1;
            else if (this.getAttribute('data-id') == 'hard_btn')
                game.mode = 2;
            game.startGame = true;
            document.getElementById('close').click();
        });
    })

    document.getElementById('close').addEventListener('click', function () {
        var popup = document.getElementById("popup");
        popup.classList.remove("popup-show");
    })
})