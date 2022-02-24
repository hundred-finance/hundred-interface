import { ethers, utils, version } from 'ethers';
import { Logger } from '@ethersproject/logger';

const logger = new Logger(version);

const _constructorGuard = {};

export class BigNumber {
    readonly _value: ethers.BigNumber;
    readonly _decimals: number;
    readonly _display: string;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(constructorGuard: any, value: ethers.BigNumber, decimals?: number) {
        if (constructorGuard !== _constructorGuard) {
            logger.throwError(
                'cannot call constructor directly; use BigNumber.from',
                Logger.errors.UNSUPPORTED_OPERATION,
                {
                    operation: 'new (BigNumber)',
                },
            );
        }
        this._value = value;
        decimals ? (this._decimals = decimals) : (this._decimals = 0);
        this._display = value.toString();
    }

    private safeOperation = (num1: BigNumber, num2: BigNumber, operation: string, log?: boolean): BigNumber => {
        const decimals = num1._decimals > num2._decimals ? this._decimals : num2._decimals;
        const tempNum1 = BigNumber.parseValueSafe(
            num1.toString(),
            decimals > 18 ? 18 : decimals,
            decimals > 18 ? true : false,
        );
        const tempNum2 = BigNumber.parseValueSafe(
            num2.toString(),
            decimals > 18 ? 18 : decimals,
            decimals > 18 ? true : false,
        );

        if (log)
            console.log(
                `--------------------\nOperation: ${operation}\nDecimals: ${decimals}\nNum1: ${tempNum1._value}\nNum2: ${tempNum2._value}\n--------------------`,
            );

        switch (operation) {
            case 'add': {
                return tempNum1.add(tempNum2);
            }
            case 'sub': {
                return tempNum1.sub(tempNum2);
            }
            case 'mul': {
                return tempNum1.mul(tempNum2);
            }
            case 'div': {
                return tempNum1.div(tempNum2);
            }
            default:
                return BigNumber.from(0);
        }
    };

    mul = (value: BigNumber): BigNumber => {
        const res = this._value.mul(value._value);
        const decimals = res.eq(0) ? 0 : this._decimals + value._decimals;
        return new BigNumber(_constructorGuard, res, decimals);
    };

    mulSafe = (value: BigNumber): BigNumber => {
        return this.safeOperation(this, value, 'mul');
    };

    div = (value: BigNumber): BigNumber => {
        const res = this._value.div(value._value);
        let decimals = res.eq(0) ? 0 : this._decimals - value._decimals;
        if (decimals < 0) decimals = -1 * decimals;
        return new BigNumber(_constructorGuard, res, decimals);
    };

    divSafe = (value: BigNumber): BigNumber => {
        return this.safeOperation(this, value, 'div');
    };

    sub = (value: BigNumber): BigNumber => {
        const res = this._value.sub(value._value);
        const decimals = this._decimals > value._decimals ? this._decimals : value._decimals;
        return new BigNumber(_constructorGuard, res, decimals);
    };

    subSafe = (value: BigNumber): BigNumber => {
        return this.safeOperation(this, value, 'sub');
    };

    add = (value: BigNumber): BigNumber => {
        const res = this._value.add(value._value);
        const decimals = this._decimals > value._decimals ? this._decimals : value._decimals;
        return new BigNumber(_constructorGuard, res, decimals);
    };

    addSafe = (value: BigNumber): BigNumber => {
        return this.safeOperation(this, value, 'add');
    };

    eq = (value: BigNumber): boolean => {
        return this._value.eq(value._value);
    };

    gt = (value: BigNumber): boolean => {
        return this._value.gt(value._value);
    };

    gte = (value: BigNumber): boolean => {
        return this._value.gte(value._value);
    };

    gteSafe = (value: BigNumber): boolean => {
        const decimals = this._decimals > value._decimals ? this._decimals : value._decimals;
        const tempNum1 = BigNumber.parseValueSafe(
            this.toString(),
            decimals > 18 ? 18 : decimals,
            decimals > 18 ? true : false,
        );
        const tempNum2 = BigNumber.parseValueSafe(
            value.toString(),
            decimals > 18 ? 18 : decimals,
            decimals > 18 ? true : false,
        );
        return tempNum1._value.gte(tempNum2._value);
    };

    lt = (value: BigNumber): boolean => {
        return this._value.lt(value._value);
    };

    lte = (value: BigNumber): boolean => {
        return this._value.lte(value._value);
    };

    toString = (): string => {
        return ethers.utils.formatUnits(this._value, this._decimals);
    };

    toFixed = (places: number): string => {
        const num = ethers.utils.formatUnits(this._value, this._decimals);
        const split = num.split('.');
        if (split.length === 2) {
            if (split[1].length > places) return `${split[0]}.${split[1].substring(0, places)}`;
        }
        return (+num).toFixed(2);
    };

    toRound = (places: number, seperated?: boolean, fixed?: boolean): string => {
        const num = +ethers.utils.formatUnits(this._value, this._decimals);
        const rounded = Math.round((num + Number.EPSILON) * Math.pow(10, places)) / Math.pow(10, places);
        if (seperated) {
            if (fixed) return this.valueSeperated((+rounded.noExponents()).toFixed(places));
            return this.valueSeperated(rounded.noExponents());
        }
        if (fixed) return (+rounded.noExponents()).toFixed(places);
        return rounded.noExponents();
    };

    private valueSeperated = (value: string): string => {
        const parts = value.split('.');
        const temp = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.length === 2 ? temp + '.' + parts[1] : temp;
    };

    toNumber = (): number => {
        return this._value.toNumber();
    };

    toNumeral = (): number => {
        return +this.toString();
    };

    static minimum = (b1: BigNumber, b2: BigNumber): BigNumber => {
        if (+b1.toString() > +b2.toString()) return b2;
        return b1;
    };

    static parseValue = (value: string, decimals?: number): BigNumber => {
        if (value === 'NaN') return BigNumber.from('0');
        const temp = value.split('.');
        if (!decimals) {
            temp.length === 2 ? (decimals = temp[1].length) : (decimals = 0);
        }
        if (temp.length === 2 && temp[1] === '') value = temp[0];
        const num = utils.parseUnits(value, decimals);
        return new BigNumber(_constructorGuard, num, decimals);
    };

    static parseValueLog = (value: string, decimals?: number): BigNumber => {
        const temp = value.split('.');
        if (!decimals) {
            temp.length === 2 ? (decimals = temp[1].length) : (decimals = 0);
        }
        if (temp.length === 2 && temp[1] === '') value = temp[0];
        console.log(`--------------------\nValue: ${value}\nDecimals: ${decimals}\n--------------------\n\n`);
        const num = utils.parseUnits(value, decimals);
        return new BigNumber(_constructorGuard, num, decimals);
    };

    static parseValueSafe = (value: string, decimals: number, round?: boolean): BigNumber => {
        const temp = BigNumber.parseValue(value);
        if (temp._decimals > decimals)
            return BigNumber.parseValue(round ? temp.toRound(decimals) : temp.toFixed(decimals), decimals);
        return BigNumber.parseValue(value, decimals);
    };

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static from = (value: any, decimals?: number): BigNumber => {
        const eth = ethers.BigNumber.from(value);
        return new BigNumber(_constructorGuard, eth, decimals);
    };

    convertToLargeNumberRepresentation = (dp?: number, symbol?: string): string => {
        if (!this._value) {
            return '0';
        }

        const number: number = +this.toRound(2);
        if (number === 0) return number.toPrecision(dp ? dp : 3) + ' ';
        // else if (number >= 1e8){
        //   return `${symbol ? symbol : ""}${(number/1e9).toPrecision(dp ? dp : 4)}B`
        else if (number >= 1e6) {
            return `${symbol ? symbol : ''}${(number / 1e6).toPrecision(dp ? dp : 4)}M`;
        } else if (number >= 1e3) {
            return `${symbol ? symbol : ''}${(number / 1e3).toPrecision(dp ? dp : 4)}K`;
        } else {
            if (number > 0 && number < 0.01) return `<${symbol ? symbol : ''}0.01`;
            else if (number > 0) return `${symbol ? symbol : ''}${number.toPrecision(dp ? dp : 4)}`;
            return number.toPrecision(dp ? 3 : 4) + ' ';
        }
    };
}

declare global {
    interface Number {
        noExponents(): string;
    }
}

Number.prototype.noExponents = function () {
    const data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    let z = '';
    const sign = this < 0 ? '-' : '';
    const str = data[0].replace('.', '');
    let mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
};
