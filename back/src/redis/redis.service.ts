import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from "./redis.provider";
import { IRedisData, IRedisUpgrade, Unit } from "../shared/shared.model";
import { User } from "../user/user.entity";
import {PurchaseError} from "../exceptions/PurchaseError";


@Injectable()
export class RedisService {
    public constructor(
        @Inject('REDIS_CLIENT')
        private readonly client: RedisClient,
    ) {}


    async getUpgrade(userId: number, upgradeId: number): Promise<IRedisUpgrade> {
        return await this.client.hgetall(`${userId}:${upgradeId}`) as unknown as IRedisUpgrade;
    }

    async addUpgrade(userId: number, upgrade: IRedisUpgrade) {
        await this.client.hset(`${userId}:${upgrade.id}`, upgrade);
    }


    async incrUpgradeAmountBought(userId: number, upgradeId: number, amountToIncr: number) {
        return +await this.client.hincrbyfloat(`${userId}:${upgradeId}`, "amountBought", amountToIncr);
    }

    // Méthode pour augmenter l'argent de l'utilisateur
    async incrMoney(userId: number, amountToIncr: number, unit: Unit) {
        // Récupérer l'unité d'argent de l'utilisateur
        let moneyUnit = +await this.getUserMoneyUnit(userId);
        // Calculer la différence d'unité
        let unitDifference = moneyUnit - unit;
        // Si la différence d'unité n'est pas 0, ajuster le montant à augmenter
        let amountIncremented = amountToIncr;
        if (unitDifference != 0) {
             amountIncremented /=  Math.pow(10, unitDifference);
        }
        // Augmenter l'argent de l'utilisateur
        let money = +await this.client.incrbyfloat(`${userId}:MONEY`, amountIncremented);
        let unityToIncrement = 0;
        // Si l'argent de l'utilisateur est supérieur à 1001, ajuster l'unité d'argent
        while (money > 1001) {
            money /= 1000;
            unityToIncrement += 3;
        }
        // Si l'unité à augmenter est supérieure à 0, augmenter l'unité d'argent de l'utilisateur
        if (unityToIncrement > 0) {
            await this.client.incrbyfloat(`${userId}:MONEY_UNIT`, unityToIncrement);
            // Mettre à jour l'argent de l'utilisateur
            await this.client.set(`${userId}:MONEY`, money);
        }

        return { amount: amountToIncr, unit};
    }

    async incrClick(userId: number, amountToIncr: number, unit: Unit): Promise<{ amount: number; unit: number; }> {
        // Récupérer l'unité d'argent de l'utilisateur
        let clickUnit = +await this.getUserClickUnit(userId);
        // Calculer la différence d'unité
        let unitDifference = clickUnit - unit;
        // Si la différence d'unité n'est pas 0, ajuster le montant à augmenter
        let amountIncremented = amountToIncr;
        if (unitDifference != 0) {
             amountIncremented /=  Math.pow(10, unitDifference);
        }
        // Augmenter l'argent de l'utilisateur
        let click = +await this.client.incrbyfloat(`${userId}:CLICK`, amountIncremented);
        let unityToIncrement = 0;
        // Si l'argent de l'utilisateur est supérieur à 1001, ajuster l'unité d'argent
        while (click > 1001) {
            click /= 1000;
            unityToIncrement += 3;
        }
        // Si l'unité à augmenter est supérieure à 0, augmenter l'unité d'argent de l'utilisateur
        if (unityToIncrement > 0) {
            clickUnit = +await this.client.incrbyfloat(`${userId}:CLICK_UNIT`, unityToIncrement);
            // Mettre à jour l'argent de l'utilisateur
            await this.client.set(`${userId}:CLICK`, click);
        }
        console.log(click, clickUnit)
        return { amount: click, unit: clickUnit};
    }

    // Méthode pour augmenter une mise à niveau
    async incrUpgrade(userId: number, upgradeId: number, amountToIncr: number, unit: Unit) {
        // Récupérer l'unité de la mise à niveau
        let upgradeUnit = +await this.client.hget(`${userId}:${upgradeId}`, "amountUnit")
        // Calculer la différence d'unité
        let unitDifference = upgradeUnit - unit;
        // Si la différence d'unité n'est pas 0, ajuster le montant à augmenter
        let amountIncremented = amountToIncr;
        if (unitDifference != 0) {
             amountIncremented /=  Math.pow(10, unitDifference);
        }

        // Augmenter la quantité de la mise à niveau
        let amount = +await this.client.hincrbyfloat(`${userId}:${upgradeId}`, "amount", amountIncremented)
        let unityToIncrement = 0;
        // Si la quantité de la mise à niveau est supérieure à 1001, ajuster l'unité de la mise à niveau
        while (amount > 1001) {
            amount /= 1000;
            unityToIncrement += 3;
        }
        // Si l'unité à augmenter est supérieure à 0, augmenter l'unité de la mise à niveau
        if(unityToIncrement){
            upgradeUnit = +await this.client.hincrbyfloat(`${userId}:${upgradeId}`, "amountUnit", unityToIncrement)
            // Mettre à jour la quantité de la mise à niveau
            await this.client.hset(`${userId}:${upgradeId}`, "amount", amount)
        }
       
        // Retourner la quantité de la mise à niveau
        return { amountGenerated: amountToIncr, generatedUnit : unit};
    }

    async getUserMoney(userId: number) {
        return +await this.client.get(`${userId}:MONEY`);
    }

    async getUserMoneyUnit(userId: number): Promise<string> {
        return await this.client.get(`${userId}:MONEY_UNIT`);
    }

    async getUserClick(userId: number) {
        return +await this.client.get(`${userId}:CLICK`);
    }

    async getUserClickUnit(userId: number): Promise<string> {
        return await this.client.get(`${userId}:CLICK_UNIT`);
    }


    // Méthode pour payer un montant spécifique
    async pay(userId: number, amount: { value: number, unit: Unit }): Promise<boolean> {
        let userMoney = await this.getUserMoney(userId);
        let userMoneyUnit = +await this.getUserMoneyUnit(userId);
        // Vérifier si l'unité d'argent de l'utilisateur est supérieure ou égale à l'unité du montant à payer
        if (userMoneyUnit >= amount.unit) {
            let differenceUnite = userMoneyUnit - amount.unit;
            let valueToDecrement = amount.value
            // Si la différence d'unité est supérieure à 0, ajuster la valeur à décrémenter
            if (differenceUnite > 0) {
                valueToDecrement /= Math.pow(10, differenceUnite);
            }
            // Si l'argent de l'utilisateur est supérieur ou égal à la valeur à décrémenter
            if (userMoney >= valueToDecrement) {
                // Décrémenter l'argent de l'utilisateur
                userMoney = +await this.client.incrbyfloat(`${userId}:MONEY`, -valueToDecrement);
                let unityToDecrement = 0;
                // Si l'argent de l'utilisateur est inférieur à 1, ajuster l'unité d'argent
                while (userMoney < 1 && (userMoneyUnit - unityToDecrement > 0)) {
                    userMoney = userMoney * 1000;
                    unityToDecrement += 3;
                }
                // Si l'unité à décrémenter est supérieure à 0, décrémenter l'unité d'argent de l'utilisateur
                if (unityToDecrement > 0) {
                    userMoneyUnit = await this.client.decrby(`${userId}:MONEY_UNIT`, unityToDecrement);
                    // Mettre à jour l'argent de l'utilisateur
                    await this.client.set(`${userId}:MONEY`, userMoney);
                }
                // Retourner vrai si le paiement est réussi
                return true;
            }
        }
        // Retourner faux si le paiement a échoué
        throw new PurchaseError(userMoney.toString(), amount.value.toString());
    }

    public async loadUserInRedis(user: User) {
        // USER MONEY : {USER_ID}:MONEY
        // USER MONEY UNIT : {USER_ID}:MONEY_UNIT
        // USER UPGRADES : {USER_ID}:{UPGRADE_ID}
        const chain
            = this.client.multi()
                .set(`${user.id}:MONEY`, user.money, "EX", 3600)
                .set(`${user.id}:MONEY_UNIT`, user.money_unite, "EX", 3600)
                .set(`${user.id}:CLICK`, user.click, "EX", 3600)
                .set(`${user.id}:CLICK_UNIT`, user.click_unite, "EX", 3600)
        for (const e of user.userUpgrade) {
            // TODO: Faire une méthode typée pour l'enregistrment redis des upgrades
            this.addUpgrade(user.id, {
                id: e.upgrade.id,
                amount: e.amount,
                amountUnit: e.amountUnit,
                amountBought: e.amountBought,
                value: e.upgrade.value,
                generationUpgradeId: e.upgrade.generationUpgradeId
            })
        }
        await chain.exec()
    }

    public async getUserData(user: User) {
        const upgrades: IRedisUpgrade[] = [];
        let i = 0;
        let end = false;
        while (!end) {
            i++;
            let userUpgrade = await this.client.hgetall(`${user.id}:${i}`);
            if (Object.keys(userUpgrade).length === 0) {
                end = true;
            } else {
                upgrades.push(userUpgrade as unknown as IRedisUpgrade);
            }
        }
        const data: IRedisData = {
            userId: user.id,
            money: +await this.client.get(`${user.id}:MONEY`),
            moneyUnit: +await this.getUserMoneyUnit(user.id),
            click: +await this.client.get(`${user.id}:CLICK`),
            clickUnit:  +await this.getUserClickUnit(user.id),
            upgrades
        }
        return data;
    }

    public async updateUserData(user: User, data: IRedisData) {
        let moneyData = await this.incrMoney(user.id,data.money,data.moneyUnit)
        const upgradesData = [];
        for (const e of data.upgrades) {
            let realTimeData = await this.incrUpgrade(user.id,e.id, e.amount, e.amountUnit);

            upgradesData.push({
                upgrade : await this.getUpgrade(user.id, e.id),
                amountGenerated : realTimeData.amountGenerated,
                generatedUnit : realTimeData.generatedUnit,
            })
        }
        return {moneyData, upgradesData};
    }

}