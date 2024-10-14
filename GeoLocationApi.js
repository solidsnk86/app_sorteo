class APILocation {
  static async getData() {
    const response = await fetch("https://geolocation.microlink.io");
    const data = await response.json();
    return data;
  }

  static async getIp() {
    const data = await this.getData();
    return data.ip.address;
  }

  static async getCountry() {
    const data = await this.getData();
    return data.country.name;
  }

  static async getCity() {
    const data = await this.getData();
    return data.city.name;
  }
}

const ip = new APILocation();

console.log(await APILocation.getIp());
console.log(await APILocation.getCity());
console.log(await APILocation.getCountry());
