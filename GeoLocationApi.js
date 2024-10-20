class APILocation {
  async getData() {
    const response = await fetch("https://geolocation.microlink.io");
    const data = await response.json();
    return data;
  }

  async getIp() {
    const data = await this.getData();
    return data.ip.address;
  }

  async getCountry() {
    const data = await this.getData();
    return data.country.name;
  }

  async getCity() {
    const data = await this.getData();
    return data.city.name;
  }
}

const apiLocation = new APILocation();

console.log(await apiLocation.getCountry());
