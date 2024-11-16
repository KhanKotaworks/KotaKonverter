class CssUnitConverter {
    constructor() {
        // 定数
        this.BASE_PX = 16; // 1rem = 16px
        this.PT_TO_PX = 1.333333; // 1pt ≈ 1.333333px

        // DOM要素
        this.valueInput = document.getElementById('value-input');
        this.unitSelect = document.getElementById('unit-select');
        this.viewportWidth = document.getElementById('viewport-width');
        this.resultsBody = document.getElementById('results-body');

        // 単位定義
        this.units = ['px', 'pt', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax'];

        // イベントリスナーの設定
        this.setupEventListeners();

        // 初期変換の実行
        this.updateResults();
    }

    setupEventListeners() {
        // 入力値の変更を監視
        this.valueInput.addEventListener('input', () => this.updateResults());
        this.unitSelect.addEventListener('change', () => this.updateResults());
        this.viewportWidth.addEventListener('input', () => this.updateResults());
    }

    // 基準値（px）への変換
    convertToBase(value, fromUnit) {
        const numValue = parseFloat(value) || 0; // 数値変換し、無効な値は0に
        const vpWidth = parseFloat(this.viewportWidth.value) || 1200; // デフォルト1200px
        const vpHeight = window.innerHeight; // ビューポート高さ

        switch (fromUnit) {
            case 'px': return numValue;
            case 'pt': return numValue * this.PT_TO_PX;
            case 'rem': return numValue * this.BASE_PX;
            case 'em': return numValue * this.BASE_PX;
            case '%': return (numValue / 100) * this.BASE_PX;
            case 'vw': return (numValue / 100) * vpWidth;
            case 'vh': return (numValue / 100) * vpHeight; // 修正: vhは高さ基準
            case 'vmin': return (numValue / 100) * Math.min(vpWidth, vpHeight);
            case 'vmax': return (numValue / 100) * Math.max(vpWidth, vpHeight);
            default: return numValue;
        }
    }


    // 基準値（px）から各単位への変換
    convertFromBase(basePx, toUnit) {
        const vpWidth = parseFloat(this.viewportWidth.value);

        switch (toUnit) {
            case 'px': return basePx;
            case 'pt': return basePx / this.PT_TO_PX;
            case 'rem': return basePx / this.BASE_PX;
            case 'em': return basePx / this.BASE_PX;
            case '%': return (basePx / this.BASE_PX) * 100;
            case 'vw': return (basePx / vpWidth) * 100;
            case 'vh': return (basePx / vpWidth) * 100; // vhもvwと同じ計算
            case 'vmin': return (basePx / vpWidth) * 100;
            case 'vmax': return (basePx / vpWidth) * 100;
            default: return basePx;
        }
    }




    // 結果テーブルの更新
    updateResults() {
        const value = this.valueInput.value;
        const unit = this.unitSelect.value;
        const basePx = this.convertToBase(value, unit);

        // テーブルの内容をクリア
        this.resultsBody.innerHTML = '';

        // 各単位での変換結果を表示
        this.units.forEach(toUnit => {
            const convertedValue = this.convertFromBase(basePx, toUnit);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${toUnit}</td>
                <td>${convertedValue.toFixed(4)}</td>
            `;
            this.resultsBody.appendChild(row);
        });
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new CssUnitConverter();
});