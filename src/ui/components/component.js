import DOM from '../dom/dom';
import { Renderers } from '../rendering/const';
import ComponentManager from './componentmanager';

class DataContainer {
  constructor(data) {
    this._state = data;
  }

  set(data) {
    this._state = data;
  }

  update(data) {
    this._state = data;
  }

  get(prop) {
    if (prop === undefined) {
      return this._state;
    }
    return this._state[prop];
  }

  on() {
    return this;
  }

  asJSON() {
    return this._state;
  }
}

class ComponentRegistry {
  constructor() {
    this.components = {

    }
  };

  register(component) {
    this.components[component.type] = component;
  }

  get(type) {
    return this.components[type];
  }
}

export default class Component {
  constructor(type, opts = {}) {
    // Simple facade pattern to enable the user to pass a single object
    // containing all the necessary options and settings
    if (typeof type === 'object') {
      opts = type;
      type = opts.type;
    }

    /**
     * An identifier used to classify the type of component.
     * The component manager uses this information in order to persist and organize components
     * @type {string|ComponentType}
     */
    this._type = this.constructor.name;

    /**
     * A local reference to the parent component, if exists
     * @type {Component}
     */
    this._parent = opts.parent || null;

    /**
     * A container for all the child components
     * @type {Array.Component}
     */
    this._children = [];

    /**
     * The state (data) of the component to be provided to the template for rendering
     * @type {object}
     */
    this._state = new DataContainer(opts.data || {});

    this._childComponents = new ComponentRegistry();

    /**
     * A reference to the DOM node that the component will be appended to when mounted/rendered.
     * @type {HTMLElement}
     */
    if (this._parent === null) {
      this._container = DOM.query(opts.container) || null;
    } else {
      this._container = DOM.query(this._parent._container, opts.container);
    }

    if (this._container === null) {
      throw new Error('Cannot find container DOM node: ' + opts.container);
    }

    /**
     * A custom class to be applied to {this._container} node
     * @type {string}
     */
    this._className = opts.class || 'component';

    /**
     * The template string to use for rendering the component
     * If this is left empty, we lookup the template the base templates using the templateName
     * @type {string}
     */
    this._template = opts.template || null;

    /**
     * The templateName to use for rendering the component.
     * This is only used if _template is empty.
     * @type {string}
     */
    this._templateName = opts.templateName || this.constructor.TemplateName;

    /**
     * A local reference to the {Renderer} that will be used for rendering the template
     * @type {Renderer}
     */
    this._renderer = opts.renderer || Renderers.Handlebars;

    /**
     * An internal state indicating whether or not the component has been mounted to the DOM
     * @type {boolean}
     */
    this._isMounted = false;

    /**
     * The a local reference to the callback that will be invoked when a component is Mounted.
     * @type {function}
     */
    this._onMount = opts.onMount || function () { };
  }

  static get type() {
    return this.name;
  }

  static get TemplateName() {
    return 'default';
  }

  init() {
    DOM.addClass(this._container, this._className);

    this._state.on('update', this._render);

    return this;
  }

  setState(data) {
    this._state.set(data);
    this._propogateState(data);
  }

  _propogateState(data) {
    for (let i = 0; i < this._children.length; i++) {
      this._children[i].setState(data);
    }
  }

  addChild(prop, type) {
    let val = this._state.get(prop),
        Component = this._childComponents.get(type);

    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i ++) {
        this._children.push(new Component({
          parent: this,
          data: val[i]
        }));
      }

      return this;
    }

    this._children.push(new Component().setState(val));
    return this;
  }

  /**
   * Set the renderer for the component
   * @param {RendererType} renderer
   */
  setRenderer(renderer) {
    this._renderer = Renderers[renderer];
  }

  /**
   * Sets the template for the component to use when rendering
   * @param {string} template
   */
  setTemplate(template) {
    this._template = template;
  }

  mount() {
    DOM.append(this._container, this.render(this._state.asJSON()));

    this._isMounted = true;
    this._onMount(this);
    return this;
  }

  /**
   * render the template using the {Renderer} with the current state and template of the component
   * @returns {string}
   */
  render(data) {
    data = data || this._state.get();

    // Render the existing templates as a string
    let html = this._renderer.render({
      template: this._template,
      templateName: this._templateName
    }, data);

    // We create an HTML Document fragment with the rendered string
    // So that we can query it for processing of sub components
    let el = DOM.create(html);

    // Process the DOM to determine if we should create
    // in-memory sub-components for rendering
    // TODO(billy) This should probably return a collection of components
    let component = DOM.query(el, '[data-component]');
    if (this._children.length === 0) {
      if (component !== undefined) {
        let type = component.dataset.component,
            prop = component.dataset.prop;

        this.addChild(prop, type);
      }
    }

    // Render the child components recursively, and inject their result
    // into the proper node of the containing component
    let len = this._children.length;
    if (len > 0) {
      let children = [];
      for (let i = 0; i < len; i ++) {
        children.push(this._children[i].render())
      }

      DOM.append(component, children.join(''));
    }

    return el.innerHTML;
  }

  /**
   * onCreate is triggered when the component is constructed
   * @param {function} the callback to invoke upon emit
   */
  onCreate(cb) {

  }

  /**
   * onUpdate is triggered when the state of the component changes
   * @param {function} the callback to invoke upon emit
   */
  onUpdate(cb) {

  }

  /**
   * onRendered event is triggered when the component is rendered
   * @param {function} the callback to invoke upon emit
   */
  onRendered(cb) {

  }

  /**
   * onMount is triggered when the component is appended to the DOM
   * @param {function} the callback to invoke upon emit
   */
  onMount(cb) {

  }

  /**
   * onUnMount is triggered when the component is removed from the DOM
   * @param {function} the callback to invoke upon emit
   */
  onUnMount(cb) {

  }

  /**
   * onDestroy is triggered when the component is destroyed
   * @param {function} the callback to invoke upon emit
   */
  onDestroy(cb) {

  }
}