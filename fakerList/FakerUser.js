import chance from 'chance';
import {enAlphabet, arAlphabet, itAlphabet} from '../hardList/alphabets.js';
import {hardCountries} from '../hardList/countries.js';
import {faker} from '@faker-js/faker';

class FakerList {
	constructor({page, size, seed, error = 0, locale = countries[en]}) {
		this.locale = locale;
		this.error = error;
		this.page = page || 0;
		this.size = size || 10;
		this.seed = seed + (this.size + this.page);

		this.faker = faker;
		this.faker.setLocale(this.locale);
		this.faker.mersenne.seed(this.seed);
		this.chance = new chance(this.seed);
	}
	random() {
		let users = [];
		const seed = this.seed > 0 ? this.seed - 1 : this.seed + 1;

		this.generateFakeUsers(() => {
			let user = {
				id: this.faker.datatype.uuid(),
				fullname: `${this.faker.name.firstName()} ${this.faker.name.lastName()}`,
				address: `${this.faker.address.city()} ${this.faker.address.street()} ${this.faker.address.buildingNumber()}`,
				phone: this.faker.phone.number(),
			};
			if (this.error >= 1) {
				for (let i = 0; i < this.error; i++) {
					user = this.applyRandomTransformer(user);
				}
			}
			users.push(user);
		});

		if (this.error > 0 && this.error < 1) {
			users = this.applyProbabilityError(users);
		}

		return {
			users,
		};
	}

	getLocaleCountry() {
		switch (this.locale) {
			case hardCountries.it: {
				return 'it';
			}
			case hardCountries.ar: {
				return 'ar';
			}
		}
		return 'en';
	}

	generateFakeUsers(func) {
		const start = this.page * this.size;
		const end = start + this.size;
		for (let i = start; i < end; i++) {
			func();
		}
	}
	getRandomLocaleChar() {
		const chars = this.getLocaleChars();
		const idx = this.chance.natural({min: 0, max: chars.length - 1});
		return chars[idx];
	}
	getLocaleChars() {
		switch (this.locale) {
			case hardCountries.it: {
				return itAlphabet;
			}
			case hardCountries.ar: {
				return arAlphabet;
			}
		}
		return enAlphabet;
	}
	applyProbabilityError(users) {
		for (let i = 0; i < users.length; i++) {
			const weights = this.chance.n(() => this.error, users.length);
			let user = this.chance.weighted(users, weights);
			user = this.applyRandomTransformer(user);
		}
		return users;
	}

	applyRandomTransformer(user) {
		const randomKey = this.getRandomObjKey(user);
		return this.randomUserTransform(randomKey, user);
	}

	randomUserTransform(key, user) {
		const transformer = this.randomTransformer();

		if (user[key].length <= 10) {
			user[key] += this.getRandomLocaleWord(1);
		} else if (user[key].length >= 50) {
			return user;
		} else {
			user[key] = this[transformer](user[key]);
		}
		return user;
	}

	randomTransformer() {
		return this.chance.pickone([
			'swapTwoLetters',
			'removeRandomLetter',
			'addRandomLetter',
		]);
	}
	getRandomLocaleWord(length) {
		let word = '';
		for (let i = 0; i < length; i++) {
			word += this.getRandomLocaleChar();
		}
		return word;
	}
	getRandomObjKey(obj) {
		const keys = Object.keys(obj);

		let rngKey = this.chance.pickone(keys);

		return rngKey;
	}
	swapTwoLetters(text) {
		if (text.length <= 1) return this.getRandomLocaleWord(5);

		const first = this.chance.natural({min: 0, max: text.length - 1});
		const second = this.chance.natural({min: 0, max: text.length - 1});

		return text
			.split('')
			.map((t, i) =>
				i === first ? text[second] : i === second ? text[first] : t
			)
			.join('');
	}
	removeRandomLetter(text) {
		if (text.length === 0) return this.getRandomLocaleWord(10);

		let idx = 0;
		if (text.length > 1) {
			idx = this.chance.natural({min: 0, max: text.length - 1});
		}
		return text
			.split('')
			.filter((t, i) => i !== idx)
			.join('');
	}
	addRandomLetter(text) {
		const char = this.getRandomLocaleChar();
		let idx = 0;
		if (text.length > 1) {
			idx = this.chance.natural({min: 0, max: text.length - 1});
		}

		return text
			.split('')
			.map((t, i) => (i === idx ? t + char : t))
			.join('');
	}
}

export default FakerList;
