import FakerList from '../fakerList/FakerUser.js';

export const fakerController = async (req, res) => {
	const {seed, page, size, error = 0, locale = 'en'} = req.query;
	const fakerList = new FakerList({
		page: Number(page),
		size: Number(size),
		seed: Number(seed),
		error: parseFloat(error),
		locale,
	});

	return res.json(fakerList.random());
};
