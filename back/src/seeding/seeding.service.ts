// seeding.service.ts
import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Upgrade} from 'src/upgrade/upgrade.entity';
import {Unit} from 'src/shared/shared.model';
import {Skin} from "../skin/skin.entity";

@Injectable()
export class SeedingService implements OnModuleInit {
    constructor(
        @InjectRepository(Upgrade)
        private readonly upgradeRepository: Repository<Upgrade>,
        @InjectRepository(Skin)
        private readonly skinRepository: Repository<Skin>,
    ) {
    }

    async onModuleInit() {
        await this.seedUpgrades();
        await this.seedSkins();
    }

    private async seedUpgrades() {

        const count = await this.upgradeRepository.count();

        if (count == 0) {
            const data = [
                {id: 1, name: 'Fan', price: 10, price_unit: Unit.UNIT, ratio: 1, generationUpgradeId: 0, value: 1.0, imagePath: 'test.png'},
                {id: 2, name: 'Daron', price: 1, price_unit: Unit.K, ratio: 1, generationUpgradeId: 1, value: 0.1, imagePath: 'test.png'},
                {id: 3, name: 'Pub', price: 100, price_unit: Unit.K, ratio: 1, generationUpgradeId: 2, value: 0.1, imagePath: 'test.png'},
                {id: 4, name: 'Emission', price: 10, price_unit: Unit.MILLION, ratio: 1, generationUpgradeId: 3, value: 0.1, imagePath: 'test.png'},
                {id: 5, name: 'Marque', price: 1, price_unit: Unit.BILLION, ratio: 1, generationUpgradeId: 4, value: 0.1, imagePath: 'test.png'},
                {id: 6, name: 'Ecurie', price: 100, price_unit: Unit.BILLION, ratio: 1, generationUpgradeId: 5, value: 0.1, imagePath: 'test.png'},
                {id: 7, name: 'Sponsors', price: 10, price_unit: Unit.TRILLION, ratio: 1, generationUpgradeId: 6, value: 0.1, imagePath: 'test.png'},
                {id: 8, name: 'Circuits', price: 1, price_unit: Unit.QUADRILLION, ratio: 1, generationUpgradeId: 7, value: 0.1, imagePath: 'test.png'},
                {id: 9, name: 'Trophés', price: 100, price_unit: Unit.QUADRILLION, ratio: 1, generationUpgradeId: 8, value: 0.1, imagePath: 'test.png'},
                {id: 10, name: 'GP Terrestre', price: 10, price_unit: Unit.QUINTILLION, ratio: 1, generationUpgradeId: 9, value: 0.1, imagePath: 'test.png'},
                {id: 11, name: 'Réacteurs', price: 1, price_unit: Unit.SEXTILLION, ratio: 1, generationUpgradeId: 10, value: 0.1, imagePath: 'test.png'},
                {id: 12, name: 'GP Lunaire', price: 100, price_unit: Unit.SEXTILLION, ratio: 1, generationUpgradeId: 11, value: 0.1, imagePath: 'test.png'},
                {id: 13, name: 'Générateur Oxygène', price: 10, price_unit: Unit.SEPTILLION, ratio: 1, generationUpgradeId: 12, value: 0.1, imagePath: 'test.png'},
                {id: 14, name: 'GP Marsien', price: 1, price_unit: Unit.OCTILLION, ratio: 1, generationUpgradeId: 13, value: 0.1, imagePath: 'test.png'},
                {id: 15, name: 'Bouclier Thermique', price: 100, price_unit: Unit.OCTILLION, ratio: 1, generationUpgradeId: 14, value: 0.1, imagePath: 'test.png'},
                {id: 16, name: 'GP Solaire', price: 10, price_unit: Unit.NONILLION, ratio: 1, generationUpgradeId: 15, value: 0.1, imagePath: 'test.png'},
                {id: 17, name: 'Générateur de Distortions', price: 1, price_unit: Unit.DECILLION, ratio: 1, generationUpgradeId: 16, value: 0.1, imagePath: 'test.png'},
                {id: 18, name: 'GP Trou Noir', price: 100, price_unit: Unit.DECILLION, ratio: 1, generationUpgradeId: 17, value: 0.1, imagePath: 'test.png'},
                {id: 19, name: 'Moteur Subliminique', price: 10, price_unit: Unit.UNDECILLION, ratio: 1, generationUpgradeId: 18, value: 0.1, imagePath: 'test.png'},
                {id: 20, name: 'GP Voie Lactée', price: 1, price_unit: Unit.DUODECILLION, ratio: 1, generationUpgradeId: 19, value: 0.1, imagePath: 'test.png'},
                {id: 21, name: 'Moteur Hyperspatial', price: 100, price_unit: Unit.DUODECILLION, ratio: 1, generationUpgradeId: 20, value: 0.1, imagePath: 'test.png'},
                {id: 22, name: 'GP Galactique', price: 10, price_unit: Unit.TREDECILLION, ratio: 1, generationUpgradeId: 21, value: 0.1, imagePath: 'test.png'},
                {id: 23, name: 'Téléporteur', price: 1, price_unit: Unit.QUATTUORDECILLION, ratio: 1, generationUpgradeId: 22, value: 0.1, imagePath: 'test.png'},
                {id: 24, name: 'GP Universel', price: 100, price_unit: Unit.QUATTUORDECILLION, ratio: 1, generationUpgradeId: 23, value: 0.1, imagePath: 'test.png'},
                {id: 25, name: 'Distrotion Spatiale', price: 10, price_unit: Unit.QUINDECILLION, ratio: 1, generationUpgradeId: 24, value: 0.1, imagePath: 'test.png'},
                {id: 26, name: 'GP Dimentionnel', price: 1, price_unit: Unit.SEXDECILLION, ratio: 1, generationUpgradeId: 25, value: 0.1, imagePath: 'test.png'},
            ];
            await this.upgradeRepository.save(data);
        }
    }

    private async seedSkins() {

        const count = await this.skinRepository.count();

        if (count == 0) {
            const data = [
                {name: 'FIRST', price: 1, priceUnit: Unit.K},
                {name: 'SECOND', price: 10, priceUnit: Unit.K},
                {name: 'THIRD', price: 1, priceUnit: Unit.MILLION},
                {name: 'FOURTH', price: 10, priceUnit: Unit.MILLION},
                {name: 'FIFTH', price: 1, priceUnit: Unit.BILLION},
            ];
            await this.skinRepository.save(data);
        }
    }
}
