import axios from 'axios';

const instance = axios.create({
	baseURL: '' // use relative url
});

export default instance;