async function fetchWeather(lat, lon, cityName = null) {
	try {
		const res = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature`,
		);
		const data = await res.json();

		const suhu = document.getElementById("suhu");
		const kondisi = document.getElementById("kondisi");
		const kelembapan = document.getElementById("kelembapan");
		const namaKota = document.getElementById("city-name");
		const arahAngin = document.getElementById("arah-angin");
		const kecepatanAngin = document.getElementById("kecepatan-angin");
		const feels = document.getElementById("feels-like");

		if (cityName) {
			namaKota.textContent = cityName;
		}

		const kodecuaca = data.current_weather.weathercode;
		const WeatherMap = {
			0: "Cerah",
			1: "Cerah Berawan",
			2: "Cerah Berawan",
			3: "Berawan",
			45: "Kabut",
			61: "Hujan Ringan",
			95: "Badai Petir",
		};

		suhu.textContent = data.current_weather.temperature;
		kecepatanAngin.textContent = data.current_weather.windspeed;
		arahAngin.textContent = data.current_weather.winddirection;
		kondisi.textContent = WeatherMap[kodecuaca] || "Tidak diketahui";

		const humidity = data.hourly.relative_humidity_2m[0];
		const temperatureApparent = data.hourly.apparent_temperature[0];

		kelembapan.textContent = humidity;
		feels.textContent = temperatureApparent;
	} catch (error) {
		console.error("Gagal mengambil data cuaca:", error);
	}
}

const btnLokasi = document.getElementById("btn-lokasi");
btnLokasi.addEventListener("click", () => {
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;

			try {
				const resRev = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
				);
				const dataRev = await resRev.json();

				const name =
					dataRev.address.city ||
					dataRev.address.town ||
					dataRev.address.village ||
					"Lokasi Terdeteksi";

				fetchWeather(lat, lon, name);
			} catch (err) {
				fetchWeather(lat, lon, "Lokasi Saya");
			}
		},
		(error) => {
			alert(
				"Gagal mendapatkan lokasi. Pastikan izin lokasi diizinkan di browser.",
			);
		},
	);
});

const btnCari = document.getElementById("btn-cari");
btnCari.addEventListener("click", async () => {
	const kota = document.getElementById("city-input").value;

	if (kota.trim() === "") {
		alert("Masukkan nama kota terlebih dahulu!");
		return;
	}

	try {
		const resGeo = await fetch(
			`https://geocoding-api.open-meteo.com/v1/search?name=${kota}&count=1&language=id&format=json`,
		);
		const dataGeo = await resGeo.json();

		if (dataGeo.results && dataGeo.results.length > 0) {
			const hasil = dataGeo.results[0];
			document.getElementById("city-name").textContent = hasil.name;
			fetchWeather(hasil.latitude, hasil.longitude, hasil.name);
		} else {
			alert("Kota tidak ditemukan!");
		}
	} catch (error) {
		console.error("Error Geocoding:", error);
	}
});

fetchWeather(-6.4, 106.8, "Depok");
