/**
 * A custom HTML element that represents a checkbox-like input that is displayed as a slide toggle.
 * @fires change
 */
export default class SlideToggleElement extends foundry.applications.elements.AbstractFormInputElement {
  constructor(...args) {
    super(...args);
    this._internals.role = "switch";
    this._value = this.getAttribute("value");
    this.#defaultValue = this._value;
    if (this.constructor.useShadowRoot) this.#shadowRoot = this.attachShadow({mode: "closed"});
  }

  /* -------------------------------------------- */

  /** @override */
  static tagName = "slide-toggle";

  /* -------------------------------------------- */

  /** @override */
  static useShadowRoot = false;

  /* -------------------------------------------- */

  /**
   * Controller for removing listeners automatically.
   * @type {AbortController}
   */
  _controller;

  /* -------------------------------------------- */

  /**
   * The shadow root that contains the checkbox elements.
   * @type {ShadowRoot}
   */
  #shadowRoot;

  /* -------------------------------------------- */
  /*  Element Properties                          */
  /* -------------------------------------------- */

  /**
   * The default value as originally specified in the HTML that created this object.
   * @type {string}
   */
  get defaultValue() {
    return this.#defaultValue;
  }

  #defaultValue;

  /* -------------------------------------------- */

  /**
   * The checked state of the checkbox.
   * @type {boolean}
   */
  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(checked) {
    this.toggleAttribute("checked", checked);
    this._refresh();
  }

  /* -------------------------------------------- */

  /** @override */
  get value() {
    return super.value;
  }

  /**
   * Override AbstractFormInputElement#value setter because we want to emit input/change events when the checked state
   * changes, and not when the value changes.
   * @override
   */
  set value(value) {
    this._setValue(value);
  }

  /** @override */
  _getValue() {
    // Workaround for FormElementExtended only checking the value property and not the checked property.
    if (typeof this._value === "string") return this._value;
    return this.checked;
  }

  /* -------------------------------------------- */

  /** @override */
  _activateListeners() {
    const {signal} = this._controller = new AbortController();
    this.addEventListener("click", this._onClick.bind(this), {signal});
    this.addEventListener("keydown", event => event.key === " " ? this._onClick(event) : null, {signal});
  }

  /* -------------------------------------------- */

  /** @override */
  _refresh() {
    super._refresh();
    this._internals.ariaChecked = `${this.hasAttribute("checked")}`;
  }

  /* -------------------------------------------- */

  /** @override */
  _onClick(event) {
    event.preventDefault();
    this.checked = !this.checked;
    this.dispatchEvent(new Event("input", {bubbles: true, cancelable: true}));
    this.dispatchEvent(new Event("change", {bubbles: true, cancelable: true}));
  }

  /* -------------------------------------------- */
  /*  Element Lifecycle                           */
  /* -------------------------------------------- */

  /**
   * Activate the element when it is attached to the DOM.
   * @inheritDoc
   */
  connectedCallback() {
    this.replaceChildren(...this._buildElements());
    this._refresh();
    this._activateListeners();
  }

  /* -------------------------------------------- */

  /** @override */
  disconnectedCallback() {
    this._controller.abort();
  }

  /* -------------------------------------------- */

  /**
   * Create the constituent components of this element.
   * @returns {HTMLElement[]}
   * @protected
   */
  _buildElements() {
    const track = document.createElement("div");
    track.classList.add("slide-toggle-track");
    const thumb = document.createElement("div");
    thumb.classList.add("slide-toggle-thumb");
    track.append(thumb);
    return [track];
  }

}