import {Unit} from "../shared/shared.model";

export interface Money {
    money: number;
    unit: Unit;
}

export interface Foo {
    moneyIncr: number;
    unitIncr: number;
}


export const calculatePaiement = (ownedMoney: Money, neededMoney: Money): Foo => {
    if(!canPay(ownedMoney, neededMoney)) {
        throw new Error("Cant pay");
    }

    // On trouve l'unité parfaite entre les 2 unité données (arrondi au supérieur)
    const sharedUnit = Math.round(((ownedMoney.unit + neededMoney.unit) / 2) / 3) * 3;

    const ownedMoneySharedUnit = changeUnitToMoney(ownedMoney, sharedUnit)
    const neededMoneySharedUnit = changeUnitToMoney(neededMoney, sharedUnit)

    const substractMoneySharedUnit = {
        money: ownedMoneySharedUnit.money - neededMoneySharedUnit.money,
        unit: sharedUnit
    }


    let newUserMoney = changeUnitToMoney(substractMoneySharedUnit, ownedMoney.unit)

    newUserMoney = resynchronizeMoney(newUserMoney)

    console.log('need to remove to user money (incrbyFloat)',newUserMoney.money - ownedMoney.money)
   console.log('need to remove to user unit (incrbyFloat)',newUserMoney.unit - ownedMoney.unit)

    return {
        moneyIncr: newUserMoney.money - ownedMoney.money,
        unitIncr: newUserMoney.unit - ownedMoney.unit
    }
}


/**
 * convert a money to a new unit
 * @param current the current money we need to convert
 * @param newUnit the new unit
 */
const changeUnitToMoney = (current: Money, newUnit: Unit): Money => {
    const differenceUnit = current.unit - newUnit;
    const newMoney = current.money * Math.pow(10, differenceUnit)
    return {unit: newUnit, money:newMoney}
}


/**
 * Resynchronize money with unit
 * @param money
 */
const resynchronizeMoney = (money: Money): Money => {
    if(money.money === 0) {
        return {
            money: 0,
            unit: Unit.UNIT
        }
    }

    let newUnit = money.unit;
    let newAmount = money.money;
    while(newAmount < 1) {
        console.log(newAmount)
        newUnit  -= 3;
        newAmount *= Math.pow(10,3);
    }
    while(newAmount > 1000) {
        newUnit  += 3;
        newAmount /= Math.pow(10,3);
    }

    return {money: newAmount, unit: newUnit}
}



const canPay = (ownedMoney: Money, neededMoney: Money) => {
    if(ownedMoney.unit > neededMoney.unit) return true;
    if(ownedMoney.unit === neededMoney.unit && ownedMoney.money >= neededMoney.money) return true;
    return false;
}