const output = document.getElementById('output');

// URLからクエリパラメータを取得する関数
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queries = queryString.split("&");
    for (let i = 0; i < queries.length; i++) {
        const pair = queries[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
}

// クエリパラメータを取得
const queryParams = getQueryParams();
let displayText = queryParams.t || ''; // "t"に変更

// [n]を改行に置き換える
displayText = displayText.replace(/\[n\]/g, '\n');

// テキストファイルからランダムなプログラム行を読み込む関数
function fetchRandomCodeLines(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const lines = xhr.responseText.split('\n');
                const shuffledLines = shuffleArray(lines); // ランダムに並び替え
                callback(shuffledLines);
            } else {
                console.error('Failed to fetch random code lines:', xhr.status);
            }
        }
    };
    xhr.open('GET', 'randomCodeLines.txt', true);
    xhr.send();
}

// 配列をランダムに並び替える関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 表示するテキストを行ごとに分割
let codeLines = [];

// ページ読み込み時にテキストファイルからランダムなプログラム行を読み込む
fetchRandomCodeLines(function(lines) {
    codeLines = displayText ? displayText.split('\n') : lines;
});

let currentLine = 0;
let currentChar = 0;

// テキストを出力し、常に一番下にスクロール
function appendTextAndScroll(text) {
    const shouldScroll = output.scrollTop + output.clientHeight === output.scrollHeight;
    output.textContent += text;
    if (shouldScroll) {
        output.scrollTop = output.scrollHeight;
    }
}

document.addEventListener('keydown', (event) => {
    if (currentLine < codeLines.length) {
        const line = codeLines[currentLine];
        const charsToAdd = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < charsToAdd; i++) {
            if (currentChar < line.length) {
                appendTextAndScroll(line[currentChar]);
                currentChar++;
            } else {
                appendTextAndScroll('\n');
                currentChar = 0;
                currentLine++;
                if (!displayText && currentLine >= codeLines.length) {
                    codeLines.push(lines[Math.floor(Math.random() * lines.length)]);
                }
                break;
            }
        }
    }
});
