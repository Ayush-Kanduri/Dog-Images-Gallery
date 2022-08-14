const breedDropdown = document.getElementById("dog-breeds");
const button = document.querySelector("button");
const imageDiv = document.getElementById("breed-image");
let breedsList = [];
let subBreedExists = false;

//--------------------------------------------------------------
//FUNCTION: Shows or Removes Sub Breeds Dropdown//
const showSubBreeds = (breed) => {
	const subBreedsDropdown = document.getElementById("dog-sub-breeds");
	//If the sub breeds dropdown does not exists, create-show it
	if (subBreedsDropdown === null) {
		const select = document.createElement("select");
		select.id = "dog-sub-breeds";
		for (let subBreed of breedsList[breed]) {
			const option = document.createElement("option");
			option.value = subBreed;
			option.textContent = subBreed;
			select.appendChild(option);
		}
		breedDropdown.after(select);
	} else {
		//If the sub breeds dropdown exists, remove it
		subBreedsDropdown.remove();
		//Call the function again to create-show the new dropdown
		showSubBreeds(breed);
	}
};
//--------------------------------------------------------------
//FUNCTION: Hide Sub Breeds Dropdown//
const hideSubBreeds = () => {
	const subBreedsDropdown = document.getElementById("dog-sub-breeds");
	//If the sub breeds dropdown exists, remove it
	if (subBreedsDropdown !== null) {
		subBreedsDropdown.remove();
	}
};
//--------------------------------------------------------------
//WELCOME ASYNC FUNCTION: Fetch the Breeds & Sub Breeds Data using Await Fetch() API//
const fetchData = (async (url = "https://dog.ceo/api/breeds/list/all") => {
	try {
		const response = await fetch(url);
		const data = await response.json();
		breedsList = data.message;
		console.log(breedsList);
		//Loop through the breedsList object and create-show the dropdown options
		for (let breed in breedsList) {
			const option = document.createElement("option");
			option.value = breed;
			option.textContent = breed;
			breedDropdown.appendChild(option);
		}
	} catch (err) {
		console.log(err);
	}
})();
//--------------------------------------------------------------
//FUNCTION: Fetch the Images based on the URL using Fetch() API//
const fetchImages = (url) => {
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data = data.message;
			//Remove the previous images if it exists
			imageDiv.querySelectorAll("img").forEach((img) => img.remove());
			//Loop through the images and create-show the images
			for (let image of data) {
				const img = document.createElement("img");
				img.src = image;
				img.alt = "dog";
				imageDiv.appendChild(img);
			}
		})
		.catch((error) => console.log(error));
};
//--------------------------------------------------------------
//FUNCTION: SetTimeout executes after Fetching the Breeds & Sub Breeds Data using the Promise//
setTimeout(() => {
	//FUNCTION: On changing the Breeds Dropdown value//
	breedDropdown.onchange = function (event) {
		event.stopPropagation();
		const breed = breedDropdown.value;
		console.log(breed);
		//If the breed has sub-breeds, show the sub-breeds dropdown, else hide it
		breedsList[breed].length > 0 ? showSubBreeds(breed) : hideSubBreeds();
	};
	//FUNCTION: On clicking the Submit Button//
	button.onclick = function (event) {
		event.stopPropagation();
		event.preventDefault();
		const breed = breedDropdown.value;
		//If the breed has sub-breeds, subBreed Exists, else subBreed does not exist
		subBreedExists = breedsList[breed].length > 0 ? true : false;
		//If the subBreed Exists, get the sub-breed value from the dropdown
		const subBreed = subBreedExists
			? document.getElementById("dog-sub-breeds").value
			: "";
		//If the breed has sub-breeds, fetch the images based on the sub-breed, else fetch the images based on the breed
		let url =
			subBreed !== ""
				? `https://dog.ceo/api/breed/${breed}/${subBreed}/`
				: `https://dog.ceo/api/breed/${breed}/`;
		url += "images";
		//Fetch the images based on the URL
		fetchImages(url);
	};
}, 0);
