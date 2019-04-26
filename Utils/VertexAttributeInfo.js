class VertexAttributeInfo {

	constructor(data, location, size) {
		this._data = data;
		this._location = location;
		this._size = size;
	}

	get data() {
		return this._data;
	}

	get location() {
		return this._location;
	}

	get size() {
		return this._size;
	}
}