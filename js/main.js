//グローバル変数定義
let save_data
let player
let round
let current_monster

let lvup = false
data1 = null
data2 = null
data3 = null
pm_num = null

//画像設定
// ローカルストレージがある場合冒険の書の色を変更
// 冒険の書１
if (localStorage.getItem("data1")) {
    $("#data1-img").attr("src", "./img/red.png");
    data1 = JSON.parse(localStorage.getItem("data1"))
}
// 冒険の書選択時
$("#data1-img").on("click", function () {
    if (data1) {
        // progressで進捗バー表示
        $(".start-button").html('<p>冒険の書１</p><p>プレイヤー    Lv.' + data1.lv + '</p><p><progress value="' + data1.round + '" max="10"></progress></p><button id="data1s" class="start-button-go">スタート</button><button id="data1d" class="clear-button">削除する</button>');
    } else {
        $(".start-button").html('<p>冒険の書１</p><p>新しく冒険をはじめます</p><div class="start-button"><button id="data1" class="start-button-go">スタート</button></div>');
    }
});
// 冒険の書２
if (localStorage.getItem("data2")) {
    $("#data2-img").attr("src", "./img/blue.png");
    data2 = JSON.parse(localStorage.getItem("data2"))
}
$("#data2-img").on("click", function () {
    if (data2) {
        $(".start-button").html('<p>冒険の書２</p><p>プレイヤー    Lv.' + data2.lv + '</p><p><progress value="' + data2.round + '" max="10"></progress></p><button id="data2s" class="start-button-go">スタート</button><button id="data2d" class="clear-button">削除する</button>');
    } else {
        $(".start-button").html('<p>冒険の書２</p><p>新しく冒険をはじめます</p><div class="start-button"><button id="data2" class="start-button-go">スタート</button></div>');
    }
});
// 冒険の書３
if (localStorage.getItem("data3")) {
    $("#data3-img").attr("src", "./img/green.png");
    data3 = JSON.parse(localStorage.getItem("data3"))
}
$("#data3-img").on("click", function () {
    if (data3) {
        $(".start-button").html('<p>冒険の書３</p><p>プレイヤー    Lv.' + data3.lv + '</p><p><progress value="' + data3.round + '" max="10"></progress></p><button id="data3s" class="start-button-go">スタート</button><button id="data3d" class="clear-button">削除する</button>');
    } else {
        $(".start-button").html('<p>冒険の書３</p><p>新しく冒険をはじめます</p><div class="start-button"><button id="data3" class="start-button-go">スタート</button></div>');
    }
});

//冒険の書選択
$("body").addClass("remove-scrolling");
$(".content").hide();
$(document).on("click", ".start-button-go", function () {
    save_data = $(this).attr("id").slice(0, 5);
    $(".start").fadeOut(1000);
    $(".content").delay(1000).fadeIn(500);
    player_set()
    battle()
    setTimeout(() => {
        $("#attack button").focus();
    }, 1500);

});

//冒険の書削除
$(document).on("click", ".clear-button", function () {
    save_data = $(this).attr("id").slice(0, 5);
    localStorage.removeItem(save_data)
    location.reload()
})

//プレイヤーオブジェクト
function player_set() {
    if (localStorage.getItem(save_data)) {
        // ローカルストレージにデータがある場合、レベルからステータスを取得
        const load_data = JSON.parse(localStorage.getItem(save_data))
        player = {
            lv: load_data.lv,
            hp: load_data.hp,
            atk: levelTable[load_data.lv - 1].atk,
            def: levelTable[load_data.lv - 1].def,
            exp: load_data.exp,
            nextExp: levelTable[load_data.lv - 1].nextExp
        }
        round = load_data.round
    } else {
        // 初期ステータス
        player = {
            lv: 1,
            hp: 25,
            atk: 25,
            def: 15,
            exp: 0,
            nextExp: 20
        }
        round = 1
    }
}

// モンスタークラス
class Monster {
    constructor(no, name, hp, atk, def, exp) {
        this.no = no
        this.name = name
        this.src = "./img/monster/pipo-enemy" + no + ".png"
        this.bgsrc = "./img/background/pipo-battlebg" + no + ".jpg"
        this.hp = hp
        this.atk = atk
        this.def = def
        this.exp = exp
    }
    // モンスター→プレイヤーへの攻撃メソッド
    attack(def) {
        let dmg = Math.floor((this.atk * (Math.random() * (1.25 - 0.95) + 0.95)) - def)
        if (dmg < 0) {
            return 0
        } else if (player.hp != 1 && player.hp < dmg) {
            return player.hp - 1
        } else {
            return dmg
        }
    }
    // プレイヤー→モンスターへの攻撃メソッド
    damage(atk) {
        let dmg = Math.floor((atk * (Math.random() * (1.25 - 0.95) + 0.95)) - this.def)
        if (dmg < Math.floor(atk*0.05)) {
            return Math.floor(atk*0.05)
        } else {
            return dmg
        }
    }
}

// バトル開始時
function battle() {
    $("#player-lv").text("Lv:" + player.lv);
    $("#player-hp").text("HP:" + player.hp);
    $("#player-atk").text("ATK:" + player.atk);
    $("#player-def").text("DEF:" + player.def);

    // ラウンドが３以上であれば出現モンスターの下限を変更
    let round_min = 0
    if (round - 3 > 0) {
        round_min = round - 3
    }

    let m_num = Math.floor(Math.random() * (round - round_min) + round_min)
    while (true) {
        // 逃げる前と同じモンスターの場合再抽選
        if (pm_num == m_num) {
            m_num = Math.floor(Math.random() * (round - round_min) + round_min)
        } else {
            break
        }
    }
    pm_num = m_num
    // 出現モンスターのステータス取得
    current_monster = new Monster(
        monsterList[m_num][0], monsterList[m_num][1], monsterList[m_num][2], monsterList[m_num][3], monsterList[m_num][4], monsterList[m_num][5]
    )
    $(".monster").html('<img src="' + current_monster.src + '">');
    $(".content").css("background", 'url("' + current_monster.bgsrc + '")')
    $(".content").css("background-size", 'cover')
    $("#monster-name").text(current_monster.name);
    $("#monster-hp").text("HP:" + current_monster.hp);
    $("#monster-atk").text("ATK:" + current_monster.atk);
    $("#monster-def").text("DEF:" + current_monster.def);

    $(".command").html(
        '<p>' + current_monster.name + 'があらわれた</p><p><a id="attack"><button>⊳</button>たたかう</a></p><p><a id="heal"><button>⊳</button>かいふく</a></p><p><a id="escape"><button>⊳</button>にげる</a></p>'
    );
    // たたかうボタンに自動フォーカス
    $("#attack button").focus();
}

//経験値処理
function plus_exp() {
    // ２以上レベル上昇時に備え無限ループ
    while (true) {
        if (player.exp >= levelTable[player.lv - 1].nextExp) {
            $(".command").html('<p>プレイヤーはレベルが' + (player.lv + 1) + 'に上がった！</p>');
            player.lv += 1
            // レベルアップしたフラグ
            lvup = true
        } else {
            // すべてのレベル上昇後にステータス増分を表示
            if (lvup) {
                setTimeout(() => {
                    $(".command").append('<p>HPが' + (levelTable[player.lv - 1].hp - player.hp) + 'ふえた</p>');
                    player.hp = levelTable[player.lv - 1].hp
                }, 500);
                setTimeout(() => {
                    $(".command").append('<p>ATKが' + (levelTable[player.lv - 1].atk - player.atk) + 'ふえた</p>');
                    player.atk = levelTable[player.lv - 1].atk
                }, 1000);
                setTimeout(() => {
                    $(".command").append('<p>DEFが' + (levelTable[player.lv - 1].def - player.def) + 'ふえた</p>');
                    player.def = levelTable[player.lv - 1].def
                }, 1500);
                player.nextExp = levelTable[player.lv - 1].nextExp
            }
            lvup = false
            break
        }
    }
}

// 戦闘勝利
function win() {
    setTimeout(() => {
        // モンスターをフェードアウト
        $(".monster").addClass("monster-death");
    }, 500)
    setTimeout(() => {
        $(".monster").css("visibility", "hidden");
        $(".command").html('<p>' + current_monster.name + 'をたおした！</p>');
    }, 1000)
    setTimeout(() => {
        $(".command").append('<p>' + current_monster.exp + 'の経験値を手に入れた</p>');
        player.exp += current_monster.exp
    }, 1500);
    setTimeout(() => {
        plus_exp()
    }, 2000)
    // 戦闘勝利時にステータスをローカルストレージに保存
    setTimeout(() => {
        localStorage.setItem(save_data, JSON.stringify({ "lv": player.lv, "hp": player.hp, "exp": player.exp, "round": round, }));
        $(".monster").removeClass("monster-death");
    }, 3500);
    setTimeout(() => {
        $(".command").append('<p>次のバトルに進みます</p>');
    }, 4500);
    setTimeout(() => {
        battle()
        $(".monster").css("visibility", "inherit");
    }, 5000);
    // ラウンド最上位モンスター撃破時にラウンドを進める
    if (current_monster.no == round) {
        round += 1
    }
}

// 戦闘敗北
function lose() {
    // だんだん画面が暗くなる処理
    $(".content").fadeOut(5000);
    setTimeout(() => {
        $(".command").html('<p>プレイヤーはやられた...</p>');
    }, 500)
    // 敗北時にレベルを３、ラウンドを１下げる
    setTimeout(() => {
        $(".command").append('<p>ステータスが下がった...</p>');
        player.lv -= 3
        if (player.lv < 1) {
            player.lv = 1
        }
        round -= 1
        if (round < 1) {
            round = 1
        }
        player.hp = levelTable[player.lv - 1].hp
        player.atk = levelTable[player.lv - 1].atk
        player.def = levelTable[player.lv - 1].def
        player.exp = 0
        if (player.lv != 1) {
            player.exp = levelTable[player.lv - 2].nextExp
        }
        player.nextExp = levelTable[player.lv - 1].nextExp
        $("#player-lv").text("Lv:" + player.lv);
        $("#player-hp").text("HP:" + player.hp);
        $("#player-atk").text("ATK:" + player.atk);
        $("#player-def").text("DEF:" + player.def);
    }, 1000);
    setTimeout(() => {
        $(".command").append('<p>レベル上げをしっかりして挑もう！</p>');
    }, 1500)
    setTimeout(() => {
        localStorage.setItem(save_data, JSON.stringify({ "lv": player.lv, "hp": player.hp, "exp": player.exp, "round": round, }));
    }, 2500);
    // 冒険の書選択まで戻す
    setTimeout(() => {
        location.reload()
    }, 5000);
}

function monster_turn() {
    $(".command").html('<p>' + current_monster.name + 'の攻撃！</p>');
    const dmg = current_monster.attack(player.def)
    $(".monster").addClass("monster-attack")
    setTimeout(() => {
        $(".command").append('<p>' + dmg + ' のダメージ</p>')
        if (player.hp - dmg < 0) {
            player.hp = 0
        } else {
            player.hp -= dmg
        }
        $("#player-hp").text("HP:" + player.hp)
        $(".monster").removeClass("monster-attack");
    }, 500)
    setTimeout(() => {
        if (player.hp <= 0) {
            lose()
        } else {
            $(".command").html('<p>プレイヤーのターン</p><p><a id="attack"><button>⊳</button>たたかう</a></p><p><a id="heal"><button>⊳</button>かいふく</a></p><p><a id="escape"><button>⊳</button>にげる</a></p>');
            $("#attack button").focus();
        }
    }, 1000)
}

// キーボード操作
$(document).on("keydown", "#attack button", function (e) {
    if (e.key === "ArrowDown") {
        $("#heal button").focus()
        return
    }
}
)
$(document).on("keydown", "#heal button", function (e) {
    if (e.key === "ArrowUp") {
        $("#attack button").focus()
        return
    }
    if (e.key === "ArrowDown") {
        $("#escape button").focus()
        return
    }
}
)
$(document).on("keydown", "#escape button", function (e) {
    if (e.key === "ArrowUp") {
        $("#heal button").focus()
        return
    }
}
)

//たたかうコマンド
$(document).on("click", "#attack", function () {
    $(".command").html('<p>プレイヤーの攻撃！</p>');
    const dmg = current_monster.damage(player.atk)
    setTimeout(() => {
        $(".command").append('<p>' + dmg + ' のダメージ</p>')
        $(".monster").addClass("monster-damage")
        if (current_monster.hp - dmg < 0) {
            current_monster.hp = 0
        } else {
            current_monster.hp -= dmg
        }
        $("#monster-hp").text("HP:" + current_monster.hp)
    }, 500)
    setTimeout(() => {
        $(".monster").removeClass("monster-damage");
        if (current_monster.hp == 0) {
            win()
        } else {
            monster_turn()
        }
    }, 1000)
});

//かいふくコマンド
$(document).on("click", "#heal", function () {
    $(".command").html('<p>プレイヤーの回復！</p>');
    let heal = Math.floor(levelTable[player.lv - 1].hp * (Math.random() * (0.5 - 0.3) + 0.3))
    if (player.hp + heal > levelTable[player.lv - 1].hp) {
        heal = levelTable[player.lv - 1].hp - player.hp
    } else if (heal < 10) {
        heal = 10
    }
    setTimeout(() => {
        $(".command").append('<p>HPが ' + heal + ' 回復した</p>')
        player.hp += heal
        $("#player-hp").text("HP:" + player.hp)
    }, 500)
    setTimeout(() => {
        monster_turn()
    }, 1000);
});

//にげるコマンド
$(document).on("click", "#escape", function () {
    $(".command").html('<p>次のバトルに進みます</p>');
    localStorage.setItem(save_data, JSON.stringify({ "lv": player.lv, "hp": player.hp, "exp": player.exp, "round": round, }));
    setTimeout(() => {
        battle()
    }, 1000);
});