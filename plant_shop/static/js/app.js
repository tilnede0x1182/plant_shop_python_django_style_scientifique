
// # Classe représentant le panier
class Cart {
	// ## Fonctions de stockage

	/**
	 * Récupère le panier depuis le localStorage.
	 * @returns {Object} Panier sous forme d'objet
	 */
	static get() {
		try {
			return JSON.parse(localStorage.getItem("cart") || "{}");
		} catch (jsonError) {
			return {};
		}
	}

	/**
	 * Enregistre le panier dans le localStorage.
	 * @param {Object} cart Panier à sauvegarder
	 */
	static save(cart) {
		localStorage.setItem("cart", JSON.stringify(cart));
	}

	// ## Fonctions de modification

	/**
	 * Ajoute un article dans le panier ou incrémente sa quantité.
	 * @param {number} id Identifiant produit
	 * @param {string} name Nom produit
	 * @param {number} price Prix unitaire
	 * @param {number} stock Quantité maximale disponible
	 */
	static add(id, name, price, stock) {
		const cart = this.get();
		if (cart[id]) {
			if (cart[id].quantity < stock) cart[id].quantity++;
		} else {
			cart[id] = { id, name, price, quantity: 1, stock };
		}
		this.save(cart);
		this.updateNavbarCount();
	}

	/**
	 * Met à jour la quantité d’un produit dans le panier.
	 * @param {number} id Identifiant produit
	 * @param {number} quantityRaw Valeur saisie
	 */
	static update(id, quantityRaw) {
		let quantity = parseInt(quantityRaw);
		if (isNaN(quantity)) return;
		const cart = this.get();
		if (!cart[id]) return;
		const input = document.querySelector(`input[data-cart-id='${id}']`);
		const stock = parseInt(input.dataset.stock || "1");
		quantity = Math.min(Math.max(1, quantity), stock);
		cart[id].quantity = quantity;
		input.value = quantity;
		this.save(cart);
		this.render();
		this.updateNavbarCount();
	}

	/**
	 * Déclenche une mise à jour différée de la quantité.
	 * @param {number} id Identifiant produit
	 * @param {HTMLInputElement} input Champ quantité
	 */
	static delayedUpdate(id, input) {
		clearTimeout(input._cartTimer);
		input._cartTimer = setTimeout(() => {
			Cart.update(id, input.value);
		}, 300);
	}

	/**
	 * Supprime un produit du panier.
	 * @param {number} id Identifiant produit
	 */
	static remove(id) {
		const cart = this.get();
		delete cart[id];
		this.save(cart);
		this.render();
	}

	/**
	 * Vide complètement le panier.
	 */
	static clear() {
		localStorage.removeItem("cart");
		this.render();
		this.updateNavbarCount();
	}

	// ## Fonctions d'affichage simples

	/**
	 * Met à jour le nombre d’articles affiché dans le lien panier.
	 */
	static updateNavbarCount() {
		const cart = this.get();
		let totalQuantity = 0;
		for (const id in cart) totalQuantity += cart[id].quantity;
		const link = document.getElementById("cart-link");
		if (link) {
			link.textContent = "🛒 Panier" + (totalQuantity > 0 ? ` (${totalQuantity})` : "");
		}
	}

	/**
	 * Affiche un tableau récapitulatif de la commande.
	 * @param {string} containerId ID du conteneur HTML
	 * @param {string} inputId ID du champ hidden
	 */
	static renderOrderReview(containerId = "order-review-container", inputId = "order-items-input") {
		const container = document.getElementById(containerId);
		const input = document.getElementById(inputId);
		if (!container || !input) return;
		container.innerHTML = "";
		const cart = this.get();
		if (Object.keys(cart).length === 0) return this._renderEmpty(container, input);
		this._renderOrderTable(container, input, cart);
	}

	/**
	 * Affiche le panier complet dans l’interface.
	 */
	static render() {
		const container = document.getElementById("cart-container");
		if (!container) return;
		container.innerHTML = "";
		const cart = this.get();
		if (Object.keys(cart).length === 0) return this._renderEmpty(container);
		this._renderCartTable(container, cart);
	}

	// ## Fonctions privées de rendu

	/**
	 * Affiche un message de panier vide.
	 * @param {HTMLElement} container Élément DOM cible
	 * @param {HTMLElement|null} input Champ input facultatif
	 */
	static _renderEmpty(container, input = null) {
		const message = document.createElement("p");
		message.className = "alert alert-info";
		message.textContent = "Votre panier est vide.";
		container.appendChild(message);
		if (input) input.value = "";
	}

	/**
	 * Génère l’en-tête d’un tableau HTML.
	 * @param {string[]} headers Titres de colonnes
	 * @returns {HTMLTableSectionElement}
	 */
	static _renderTableHeader(headers) {
		const thead = document.createElement("thead");
		thead.className = "table-dark";
		const row = document.createElement("tr");
		headers.forEach(text => {
			const cell = document.createElement("th");
			cell.textContent = text;
			row.appendChild(cell);
		});
		thead.appendChild(row);
		return thead;
	}

	/**
	 * Génère le tableau de résumé de commande.
	 * @param {HTMLElement} container Conteneur HTML
	 * @param {HTMLElement} input Champ hidden
	 * @param {Object} cart Panier
	 */
	static _renderOrderTable(container, input, cart) {
		const table = document.createElement("table");
		table.className = "table shadow";
		table.appendChild(this._renderTableHeader(["Plante", "Quantité", "Total"]));
		const tbody = document.createElement("tbody");
		let total = 0;
		const items = [];
		for (const id in cart) {
			const item = cart[id];
			const subtotal = item.price * item.quantity;
			total += subtotal;
			items.push({ plant_id: parseInt(id), quantity: item.quantity });
			tbody.appendChild(this._createReviewRow(item, subtotal));
		}
		table.appendChild(tbody);
		container.appendChild(table);
		this._appendTotal(container, total);
		input.value = JSON.stringify(items);
	}

	/**
	 * Crée une ligne HTML du tableau résumé.
	 * @param {Object} item Article
	 * @param {number} subtotal Total ligne
	 * @returns {HTMLTableRowElement}
	 */
	static _createReviewRow(item, subtotal) {
		const row = document.createElement("tr");
		const link = document.createElement("a");
		link.href = `/plants/${item.id}`;
		link.className = "cart-plant-link confirmed";
		link.textContent = item.name;
		const tdName = document.createElement("td");
		tdName.appendChild(link);
		const tdQty = document.createElement("td");
		tdQty.textContent = item.quantity;
		const tdTotal = document.createElement("td");
		tdTotal.textContent = `${subtotal} €`;
		row.appendChild(tdName);
		row.appendChild(tdQty);
		row.appendChild(tdTotal);
		return row;
	}

	/**
	 * Génère le tableau interactif du panier.
	 * @param {HTMLElement} container Élément DOM
	 * @param {Object} cart Contenu du panier
	 */
	static _renderCartTable(container, cart) {
		const table = document.createElement("table");
		table.className = "table";
		table.appendChild(this._renderTableHeader(["Plante", "Quantité", "Action"]));
		const tbody = document.createElement("tbody");
		let total = 0;
		for (const id in cart) {
			const item = cart[id];
			total += item.price * item.quantity;
			tbody.appendChild(this._createCartRow(id, item));
		}
		table.appendChild(tbody);
		container.appendChild(table);
		this._appendTotal(container, total);
		this._appendControls(container);
	}

	/**
	 * Crée une ligne du tableau panier.
	 * @param {string} id Identifiant article
	 * @param {Object} item Données article
	 * @returns {HTMLTableRowElement}
	 */
	static _createCartRow(id, item) {
		const row = document.createElement("tr");
		const tdName = document.createElement("td");
		const link = document.createElement("a");
		link.href = `/plants/${id}`;
		link.className = "text-decoration-none";
		link.textContent = item.name;
		tdName.appendChild(link);
		const tdQty = document.createElement("td");
		tdQty.appendChild(this._createQtyInput(id, item));
		const tdAction = document.createElement("td");
		const button = document.createElement("button");
		button.className = "btn btn-danger btn-sm";
		button.textContent = "Retirer";
		button.addEventListener("click", () => Cart.remove(id));
		tdAction.appendChild(button);
		row.appendChild(tdName);
		row.appendChild(tdQty);
		row.appendChild(tdAction);
		return row;
	}

	/**
	 * Crée le champ quantité interactif.
	 * @param {string} id Identifiant article
	 * @param {Object} item Données article
	 * @returns {HTMLInputElement}
	 */
	static _createQtyInput(id, item) {
		const input = document.createElement("input");
		input.type = "number";
		input.min = "1";
		input.className = "form-control form-control-sm";
		input.style.maxWidth = "70px";
		input.value = item.quantity;
		input.dataset.cartId = id;
		input.dataset.stock = item.stock;
		input.addEventListener("input", () => Cart.delayedUpdate(id, input));
		input.addEventListener("blur", () => Cart.update(id, input.value));
		return input;
	}

	/**
	 * Affiche le total en bas du tableau.
	 * @param {HTMLElement} container Conteneur
	 * @param {number} total Somme totale
	 */
	static _appendTotal(container, total) {
		const paragraph = document.createElement("p");
		paragraph.className = "text-end fw-bold";
		paragraph.textContent = `Total : ${total} €`;
		container.appendChild(paragraph);
	}

	/**
	 * Affiche les boutons de contrôle panier.
	 * @param {HTMLElement} container Conteneur HTML
	 */
	static _appendControls(container) {
		const controls = document.createElement("div");
		controls.className = "d-flex justify-content-between";
		const clearButton = document.createElement("button");
		clearButton.className = "btn btn-outline-secondary btn-sm";
		clearButton.textContent = "Vider le panier";
		clearButton.addEventListener("click", () => Cart.clear());
		const orderLink = document.createElement("a");
		orderLink.href = "/orders/new";
		orderLink.className = "btn btn-primary";
		orderLink.textContent = "Passer la commande";
		controls.appendChild(clearButton);
		controls.appendChild(orderLink);
		container.appendChild(controls);
	}
}

// # Initialisation interface

/**
 * Initialise le menu déroulant admin.
 */
function initDropdown() {
	const toggle = document.querySelector(".dropdown-toggle");
	const menu = document.querySelector(".dropdown-menu");
	if (toggle && menu) {
		toggle.addEventListener("click", event => {
			event.preventDefault();
			menu.classList.toggle("show");
		});
		document.addEventListener("click", event => {
			if (!event.target.closest(".dropdown")) {
				menu.classList.remove("show");
			}
		});
	}
}

// # Lancement du programme

/**
 * Fonction principale appelée à la fin du chargement DOM.
 */
function main() {
	document.addEventListener("DOMContentLoaded", () => {
		initDropdown();
		Cart.renderOrderReview();
		Cart.updateNavbarCount();
		Cart.render();
	});
}

main();
