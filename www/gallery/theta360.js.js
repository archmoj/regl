(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const regl = require('../regl')()
const mat4 = require('gl-mat4')
const bunny = require('bunny')
const normals = require('angle-normals')

const setupEnvMap = regl({
  frag: `
  precision mediump float;
  uniform sampler2D envmap;
  varying vec3 reflectDir;

  #define PI ${Math.PI}

  vec4 lookupEnv (vec3 dir) {
    float lat = atan(dir.z, dir.x);
    float lon = acos(dir.y / length(dir));
    return texture2D(envmap, vec2(
      0.5 + lat / (2.0 * PI),
      lon / PI));
  }

  void main () {
    gl_FragColor = lookupEnv(reflectDir);
  }`,

  vert: `
  precision mediump float;
  varying vec3 reflectDir;
  void main() { gl_Position = vec4(0,0,0,0); }
  `,

  uniforms: {
    envmap: regl.texture('assets/ogd-oregon-360.jpg'),

    view: regl.prop('view'),

    projection: (args, batchId, {width, heigth}) =>
      mat4.perspective([],
        Math.PI / 4,
        regl.stats.width / regl.stats.height,
        0.01,
        1000),

    invView: ({view}) => mat4.invert([], view)
  }
})

const drawBackground = regl({
  vert: `
  precision mediump float;
  attribute vec2 position;
  uniform mat4 view;
  varying vec3 reflectDir;
  void main() {
    reflectDir = (view * vec4(position, 1, 0)).xyz;
    gl_Position = vec4(position, 0, 1);
  }`,

  attributes: {
    position: regl.buffer([
      -4, -4,
      -4, 4,
      8, 0])
  },

  depth: {
    mask: false,
    enable: false
  },

  count: 3
})

const drawBunny = regl({
  vert: `
  precision mediump float;
  attribute vec3 position, normal;
  uniform mat4 projection, view, invView;
  varying vec3 reflectDir;
  void main() {
    vec4 eye = invView * vec4(0, 0, 0, 1);
    reflectDir = reflect(
      normalize(position.xyz - eye.xyz / eye.w),
      normal);
    gl_Position = projection * view * vec4(position, 1);
  }`,

  attributes: {
    position: regl.buffer(bunny.positions),
    normal: regl.buffer(normals(bunny.cells, bunny.positions))
  },

  elements: regl.elements(bunny.cells)
})

regl.frame(() => {
  const t = 0.01 * regl.stats.count

  setupEnvMap({
    view: mat4.lookAt([],
      [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
      [0, 2.5, 0],
      [0, 1, 0])
  }, () => {
    drawBackground()
    drawBunny()
  })
})

},{"../regl":58,"angle-normals":32,"bunny":33,"gl-mat4":43}],2:[function(require,module,exports){
var glTypes = require('./constants/dtypes.json')

var GL_FLOAT = 5126

function AttributeRecord () {
  this.pointer = false

  this.x = 0.0
  this.y = 0.0
  this.z = 0.0
  this.w = 0.0

  this.buffer = null
  this.size = 0
  this.normalized = false
  this.type = GL_FLOAT
  this.offset = 0
  this.stride = 0
  this.divisor = 0
}

Object.assign(AttributeRecord.prototype, {
  equals: function (other, size) {
    if (!this.pointer) {
      return !other.pointer &&
        this.x === other.x &&
        this.y === other.y &&
        this.z === other.z &&
        this.w === other.w
    } else {
      return other.pointer &&
        this.buffer === other.buffer &&
        this.size === size &&
        this.normalized === other.normalized &&
        this.type === other.type &&
        this.offset === other.offset &&
        this.stride === other.stride &&
        this.divisor === other.divisor
    }
  },

  set: function (other, size) {
    var pointer = this.pointer = other.pointer
    if (pointer) {
      this.buffer = other.buffer
      this.size = size
      this.normalized = other.normalized
      this.type = other.type
      this.offset = other.offset
      this.stride = other.stride
      this.divisor = other.divisor
    } else {
      this.x = other.x
      this.y = other.y
      this.z = other.z
      this.w = other.w
    }
  }
})

module.exports = function wrapAttributeState (gl, extensions, limits, bufferState) {
  var attributeState = {}

  var NUM_ATTRIBUTES = limits.maxAttributes
  var attributeBindings = new Array(NUM_ATTRIBUTES)
  for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
    attributeBindings[i] = new AttributeRecord()
  }

  function AttributeStack () {
    var records = new Array(16)
    for (var i = 0; i < 16; ++i) {
      records[i] = new AttributeRecord()
    }
    this.records = records
    this.top = 0
  }

  function pushAttributeStack (stack) {
    var records = stack.records
    var top = stack.top

    while (records.length - 1 <= top) {
      records.push(new AttributeRecord())
    }

    return records[++stack.top]
  }

  Object.assign(AttributeStack.prototype, {
    pushVec: function (x, y, z, w) {
      var head = pushAttributeStack(this)
      head.pointer = false
      head.x = x
      head.y = y
      head.z = z
      head.w = w
    },

    pushPtr: function (
      buffer,
      size,
      offset,
      stride,
      divisor,
      normalized,
      type) {
      var head = pushAttributeStack(this)
      head.pointer = true
      head.buffer = buffer
      head.size = size
      head.offset = offset
      head.stride = stride
      head.divisor = divisor
      head.normalized = normalized
      head.type = type
    },

    pushDyn: function (data) {
      if (typeof data === 'number') {
        this.pushVec(data, 0, 0, 0)
      } else if (Array.isArray(data)) {
        this.pushVec(data[0], data[1], data[2], data[3])
      } else {
        var buffer = bufferState.getBuffer(data)
        var size = 0
        var stride = 0
        var offset = 0
        var divisor = 0
        var normalized = false
        var type = GL_FLOAT
        if (!buffer) {
          buffer = bufferState.getBuffer(data.buffer)
          size = data.size || 0
          stride = data.stride || 0
          offset = data.offset || 0
          divisor = data.divisor || 0
          normalized = data.normalized || false
          type = buffer.dtype
          if ('type' in data) {
            type = glTypes[data.type]
          }
        } else {
          type = buffer.dtype
        }
        this.pushPtr(buffer, size, offset, stride, divisor, normalized, type)
      }
    },

    pop: function () {
      this.top -= 1
    }
  })

  // ===================================================
  // BIND AN ATTRIBUTE
  // ===================================================
  function bindAttribute (index, current, next, size) {
    size = next.size || size
    if (current.equals(next, size)) {
      return
    }
    if (!next.pointer) {
      if (current.pointer) {
        gl.disableVertexAttribArray(index)
      }
      gl.vertexAttrib4f(index, next.x, next.y, next.z, next.w)
    } else {
      if (!current.pointer) {
        gl.enableVertexAttribArray(index)
      }
      if (current.buffer !== next.buffer) {
        next.buffer.bind()
      }
      gl.vertexAttribPointer(
        index,
        size,
        next.type,
        next.normalized,
        next.stride,
        next.offset)
      var extInstancing = extensions.angle_instanced_arrays
      if (extInstancing) {
        extInstancing.vertexAttribDivisorANGLE(index, next.divisor)
      }
    }
    current.set(next, size)
  }

  // ===================================================
  // DEFINE A NEW ATTRIBUTE
  // ===================================================
  function defAttribute (name) {
    if (name in attributeState) {
      return
    }
    attributeState[name] = new AttributeStack()
  }

  return {
    bindings: attributeBindings,
    attributes: attributeState,
    bind: bindAttribute,
    def: defAttribute
  }
}

},{"./constants/dtypes.json":9}],3:[function(require,module,exports){
// Array and element buffer creation
var check = require('./check')
var isTypedArray = require('./is-typed-array')
var isNDArrayLike = require('./is-ndarray')
var arrayTypes = require('./constants/arraytypes.json')
var bufferTypes = require('./constants/dtypes.json')
var values = require('./values')

var GL_STATIC_DRAW = 35044

var GL_BYTE = 5120
var GL_UNSIGNED_BYTE = 5121
var GL_SHORT = 5122
var GL_UNSIGNED_SHORT = 5123
var GL_INT = 5124
var GL_UNSIGNED_INT = 5125
var GL_FLOAT = 5126

var usageTypes = {
  'static': 35044,
  'dynamic': 35048,
  'stream': 35040
}

function typedArrayCode (data) {
  return arrayTypes[Object.prototype.toString.call(data)] | 0
}

function makeTypedArray (dtype, args) {
  switch (dtype) {
    case GL_UNSIGNED_BYTE:
      return new Uint8Array(args)
    case GL_UNSIGNED_SHORT:
      return new Uint16Array(args)
    case GL_UNSIGNED_INT:
      return new Uint32Array(args)
    case GL_BYTE:
      return new Int8Array(args)
    case GL_SHORT:
      return new Int16Array(args)
    case GL_INT:
      return new Int32Array(args)
    case GL_FLOAT:
      return new Float32Array(args)
    default:
      return null
  }
}

function flatten (result, data, dimension) {
  var ptr = 0
  for (var i = 0; i < data.length; ++i) {
    var v = data[i]
    for (var j = 0; j < dimension; ++j) {
      result[ptr++] = v[j]
    }
  }
}

function transpose (result, data, shapeX, shapeY, strideX, strideY, offset) {
  var ptr = 0
  for (var i = 0; i < shapeX; ++i) {
    for (var j = 0; j < shapeY; ++j) {
      result[ptr++] = data[strideX * i + strideY * j + offset]
    }
  }
  return result
}

module.exports = function wrapBufferState (gl) {
  var bufferCount = 0
  var bufferSet = {}

  function REGLBuffer (buffer, type) {
    this.id = bufferCount++
    this.buffer = buffer
    this.type = type
    this.usage = GL_STATIC_DRAW
    this.byteLength = 0
    this.dimension = 1
    this.data = null
    this.dtype = GL_UNSIGNED_BYTE
  }

  REGLBuffer.prototype.bind = function () {
    gl.bindBuffer(this.type, this.buffer)
  }

  function refresh (buffer) {
    if (!gl.isBuffer(buffer.buffer)) {
      buffer.buffer = gl.createBuffer()
    }
    buffer.bind()
    gl.bufferData(buffer.type, buffer.data || buffer.byteLength, buffer.usage)
  }

  function destroy (buffer) {
    var handle = buffer.buffer
    check(handle, 'buffer must not be deleted already')
    if (gl.isBuffer(handle)) {
      gl.deleteBuffer(handle)
    }
    buffer.buffer = null
    delete bufferSet[buffer.id]
  }

  function createBuffer (options, type, deferInit) {
    var handle = gl.createBuffer()

    var buffer = new REGLBuffer(handle, type)
    bufferSet[buffer.id] = buffer

    function reglBuffer (input) {
      var options = input || {}
      if (Array.isArray(options) ||
          isTypedArray(options) ||
          isNDArrayLike(options)) {
        options = {
          data: options
        }
      } else if (typeof options === 'number') {
        options = {
          length: options | 0
        }
      } else if (options === null || options === void 0) {
        options = {}
      }

      check.type(
        options, 'object',
        'buffer arguments must be an object, a number or an array')

      if ('usage' in options) {
        var usage = options.usage
        check.parameter(usage, usageTypes, 'invalid buffer usage')
        buffer.usage = usageTypes[options.usage]
      } else {
        buffer.usage = GL_STATIC_DRAW
      }

      var dtype = 0
      if ('type' in options) {
        check.parameter(options.type, bufferTypes, 'invalid buffer type')
        dtype = bufferTypes[options.type]
      }

      var dimension = (options.dimension | 0) || 1
      var byteLength = 0
      var data = null
      if ('data' in options) {
        data = options.data
        if (data === null) {
          byteLength = options.length | 0
        } else {
          if (isNDArrayLike(data)) {
            var shape = data.shape
            var stride = data.stride
            var offset = data.offset

            var shapeX = 0
            var shapeY = 0
            var strideX = 0
            var strideY = 0
            if (shape.length === 1) {
              shapeX = shape[0]
              shapeY = 1
              strideX = stride[0]
              strideY = 0
            } else if (shape.length === 2) {
              shapeX = shape[0]
              shapeY = shape[1]
              strideX = stride[0]
              strideY = stride[1]
            } else {
              check.raise('invalid shape')
            }

            dtype = dtype || typedArrayCode(data) || GL_FLOAT
            dimension = shapeY
            data = transpose(
              makeTypedArray(dtype, shapeX * shapeY),
              data.data,
              shapeX, shapeY,
              strideX, strideY,
              offset)
          } else if (Array.isArray(data)) {
            if (data.length > 0 && Array.isArray(data[0])) {
              dimension = data[0].length
              dtype = dtype || GL_FLOAT
              var result = makeTypedArray(dtype, data.length * dimension)
              data = flatten(result, data, dimension)
              data = result
            } else {
              dtype = dtype || GL_FLOAT
              data = makeTypedArray(dtype, data)
            }
          } else {
            check.isTypedArray(data, 'invalid data type buffer data')
            dtype = dtype || typedArrayCode(data)
          }
          byteLength = data.byteLength
        }
      } else if ('length' in options) {
        byteLength = options.length | 0
        check.nni(byteLength, 'buffer length must be a nonnegative integer')
      }

      buffer.data = data
      buffer.dtype = dtype || GL_UNSIGNED_BYTE
      buffer.byteLength = byteLength
      buffer.dimension = dimension

      refresh(buffer)

      return reglBuffer
    }

    if (!deferInit) {
      reglBuffer(options)
    }

    reglBuffer._reglType = 'buffer'
    reglBuffer._buffer = buffer
    reglBuffer.destroy = function () { destroy(buffer) }

    return reglBuffer
  }

  return {
    create: createBuffer,

    clear: function () {
      values(bufferSet).forEach(destroy)
    },

    refresh: function () {
      values(bufferSet).forEach(refresh)
    },

    getBuffer: function (wrapper) {
      if (wrapper && wrapper._buffer instanceof REGLBuffer) {
        return wrapper._buffer
      }
      return null
    }
  }
}

},{"./check":4,"./constants/arraytypes.json":8,"./constants/dtypes.json":9,"./is-ndarray":17,"./is-typed-array":18,"./values":31}],4:[function(require,module,exports){
// Error checking and parameter validation
var isTypedArray = require('./is-typed-array')

function raise (message) {
  var error = new Error('(regl) ' + message)
  console.error(error)
  throw error
}

function check (pred, message) {
  if (!pred) {
    raise(message)
  }
}

function encolon (message) {
  if (message) {
    return ': ' + message
  }
  return ''
}

function checkParameter (param, possibilities, message) {
  if (!(param in possibilities)) {
    raise('unknown parameter (' + param + ')' + encolon(message) +
          '. possible values: ' + Object.keys(possibilities).join())
  }
}

function checkIsTypedArray (data, message) {
  if (!isTypedArray(data)) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. must be a typed array')
  }
}

function checkTypeOf (value, type, message) {
  if (typeof value !== type) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. expected ' + type + ', got ' + (typeof value))
  }
}

function checkNonNegativeInt (value, message) {
  if (!((value >= 0) &&
        ((value | 0) === value))) {
    raise('invalid parameter type, (' + value + ')' + encolon(message) +
          '. must be a nonnegative integer')
  }
}

function checkOneOf (value, list, message) {
  if (list.indexOf(value) < 0) {
    raise('invalid value' + encolon(message) + '. must be one of: ' + list)
  }
}

module.exports = Object.assign(check, {
  raise: raise,
  parameter: checkParameter,
  type: checkTypeOf,
  isTypedArray: checkIsTypedArray,
  nni: checkNonNegativeInt,
  oneOf: checkOneOf
})

},{"./is-typed-array":18}],5:[function(require,module,exports){
/* globals performance */
module.exports =
  (typeof performance !== 'undefined' && performance.now)
  ? function () { return performance.now() }
  : function () { return +(new Date()) }

},{}],6:[function(require,module,exports){
function slice (x) {
  return Array.prototype.slice.call(x)
}

module.exports = function createEnvironment () {
  // Unique variable id counter
  var varCounter = 0

  // Linked values are passed from this scope into the generated code block
  // Calling link() passes a value into the generated scope and returns
  // the variable name which it is bound to
  var linkedNames = []
  var linkedValues = []
  function link (value) {
    var name = 'g' + (varCounter++)
    linkedNames.push(name)
    linkedValues.push(value)
    return name
  }

  // create a code block
  function block () {
    var code = []
    function push () {
      code.push.apply(code, slice(arguments))
    }

    var vars = []
    function def () {
      var name = 'v' + (varCounter++)
      vars.push(name)

      if (arguments.length > 0) {
        code.push(name, '=')
        code.push.apply(code, slice(arguments))
        code.push(';')
      }

      return name
    }

    return Object.assign(push, {
      def: def,
      toString: function () {
        return [
          (vars.length > 0 ? 'var ' + vars + ';' : ''),
          code.join('')
        ].join('')
      }
    })
  }

  // procedure list
  var procedures = {}
  function proc (name) {
    var args = []
    function arg () {
      var name = 'a' + (varCounter++)
      args.push(name)
      return name
    }

    var body = block()
    var bodyToString = body.toString

    var result = procedures[name] = Object.assign(body, {
      arg: arg,
      toString: function () {
        return [
          'function(', args.join(), '){',
          bodyToString(),
          '}'
        ].join('')
      }
    })

    return result
  }

  function compile () {
    var code = ['"use strict";return {']
    Object.keys(procedures).forEach(function (name) {
      code.push('"', name, '":', procedures[name].toString(), ',')
    })
    code.push('}')
    var proc = Function.apply(null, linkedNames.concat([code.join('')]))
    return proc.apply(null, linkedValues)
  }

  return {
    link: link,
    block: block,
    proc: proc,
    compile: compile
  }
}

},{}],7:[function(require,module,exports){
var check = require('./check')
var createEnvironment = require('./codegen')

var primTypes = require('./constants/primitives.json')
var glTypes = require('./constants/dtypes.json')

var GL_ELEMENT_ARRAY_BUFFER = 34963

var GL_FLOAT = 5126
var GL_FLOAT_VEC2 = 35664
var GL_FLOAT_VEC3 = 35665
var GL_FLOAT_VEC4 = 35666
var GL_INT = 5124
var GL_INT_VEC2 = 35667
var GL_INT_VEC3 = 35668
var GL_INT_VEC4 = 35669
var GL_BOOL = 35670
var GL_BOOL_VEC2 = 35671
var GL_BOOL_VEC3 = 35672
var GL_BOOL_VEC4 = 35673
var GL_FLOAT_MAT2 = 35674
var GL_FLOAT_MAT3 = 35675
var GL_FLOAT_MAT4 = 35676
var GL_SAMPLER_2D = 35678
var GL_SAMPLER_CUBE = 35680

var GL_TRIANGLES = 4

var GL_CULL_FACE = 0x0B44
var GL_BLEND = 0x0BE2
var GL_DITHER = 0x0BD0
var GL_STENCIL_TEST = 0x0B90
var GL_DEPTH_TEST = 0x0B71
var GL_SCISSOR_TEST = 0x0C11
var GL_POLYGON_OFFSET_FILL = 0x8037
var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E
var GL_SAMPLE_COVERAGE = 0x80A0

var GL_FRONT = 1028
var GL_BACK = 1029

var GL_CW = 0x0900
var GL_CCW = 0x0901

var GL_MIN_EXT = 0x8007
var GL_MAX_EXT = 0x8008

var blendFuncs = {
  '0': 0,
  '1': 1,
  'zero': 0,
  'one': 1,
  'src color': 768,
  'one minus src color': 769,
  'src alpha': 770,
  'one minus src alpha': 771,
  'dst color': 774,
  'one minus dst color': 775,
  'dst alpha': 772,
  'one minus dst alpha': 773,
  'constant color': 32769,
  'one minus constant color': 32770,
  'constant alpha': 32771,
  'one minus constant alpha': 32772,
  'src alpha saturate': 776
}

var compareFuncs = {
  'never': 512,
  'less': 513,
  '<': 513,
  'equal': 514,
  '=': 514,
  '==': 514,
  '===': 514,
  'lequal': 515,
  '<=': 515,
  'greater': 516,
  '>': 516,
  'notequal': 517,
  '!=': 517,
  '!==': 517,
  'gequal': 518,
  '>=': 518,
  'always': 519
}

var stencilOps = {
  '0': 0,
  'zero': 0,
  'keep': 7680,
  'replace': 7681,
  'increment': 7682,
  'decrement': 7683,
  'increment wrap': 34055,
  'decrement wrap': 34056,
  'invert': 5386
}

function typeLength (x) {
  switch (x) {
    case GL_FLOAT_VEC2:
    case GL_INT_VEC2:
    case GL_BOOL_VEC2:
      return 2
    case GL_FLOAT_VEC3:
    case GL_INT_VEC3:
    case GL_BOOL_VEC3:
      return 3
    case GL_FLOAT_VEC4:
    case GL_INT_VEC4:
    case GL_BOOL_VEC4:
      return 4
    default:
      return 1
  }
}

function setUniformString (gl, type, location, value) {
  var infix
  var separator = ','
  switch (type) {
    case GL_FLOAT:
      infix = '1f'
      break
    case GL_FLOAT_VEC2:
      infix = '2fv'
      break
    case GL_FLOAT_VEC3:
      infix = '3fv'
      break
    case GL_FLOAT_VEC4:
      infix = '4fv'
      break
    case GL_BOOL:
    case GL_INT:
      infix = '1i'
      break
    case GL_BOOL_VEC2:
    case GL_INT_VEC2:
      infix = '2iv'
      break
    case GL_BOOL_VEC3:
    case GL_INT_VEC3:
      infix = '3iv'
      break
    case GL_BOOL_VEC4:
    case GL_INT_VEC4:
      infix = '4iv'
      break
    case GL_FLOAT_MAT2:
      infix = 'Matrix2fv'
      separator = ',false,'
      break
    case GL_FLOAT_MAT3:
      infix = 'Matrix3fv'
      separator = ',false,'
      break
    case GL_FLOAT_MAT4:
      infix = 'Matrix4fv'
      separator = ',false,'
      break
    default:
      check.raise('unsupported uniform type')
  }
  return gl + '.uniform' + infix + '(' + location + separator + value + ');'
}

function stackTop (x) {
  return x + '[' + x + '.length-1]'
}

// Need to process framebuffer first in options list
function optionPriority (a, b) {
  if (a === 'framebuffer') {
    return -1
  }
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  }
  return 0
}

module.exports = function reglCompiler (
  gl,
  extensions,
  limits,
  bufferState,
  elementState,
  textureState,
  framebufferState,
  glState,
  uniformState,
  attributeState,
  shaderState,
  drawState,
  frameState,
  reglPoll) {
  var contextState = glState.contextState

  var blendEquations = {
    'add': 32774,
    'subtract': 32778,
    'reverse subtract': 32779
  }
  if (extensions.ext_blend_minmax) {
    blendEquations.min = GL_MIN_EXT
    blendEquations.max = GL_MAX_EXT
  }

  var drawCallCounter = 0

  // ===================================================
  // ===================================================
  // SHADER SINGLE DRAW OPERATION
  // ===================================================
  // ===================================================
  function compileShaderDraw (program) {
    var env = createEnvironment()
    var link = env.link
    var draw = env.proc('draw')
    var def = draw.def

    var GL = link(gl)
    var PROGRAM = link(program.program)
    var BIND_ATTRIBUTE = link(attributeState.bind)
    var DRAW_STATE = {
      count: link(drawState.count),
      offset: link(drawState.offset),
      instances: link(drawState.instances),
      primitive: link(drawState.primitive)
    }
    var ELEMENT_STATE = link(elementState.elements)
    var TEXTURE_UNIFORMS = []

    // bind the program
    draw(GL, '.useProgram(', PROGRAM, ');')

    // set up attribute state
    program.attributes.forEach(function (attribute) {
      var STACK = link(attributeState.attributes[attribute.name])
      draw(BIND_ATTRIBUTE, '(',
        attribute.location, ',',
        link(attributeState.bindings[attribute.location]), ',',
        STACK, '.records[', STACK, '.top]', ',',
        typeLength(attribute.info.type), ');')
    })

    // set up uniforms
    program.uniforms.forEach(function (uniform) {
      var LOCATION = link(uniform.location)
      var STACK = link(uniformState.uniforms[uniform.name])
      var TOP = STACK + '[' + STACK + '.length-1]'
      if (uniform.info.type === GL_SAMPLER_2D ||
        uniform.info.type === GL_SAMPLER_CUBE) {
        var TEX_VALUE = def(TOP + '._texture')
        TEXTURE_UNIFORMS.push(TEX_VALUE)
        draw(setUniformString(GL, GL_INT, LOCATION, TEX_VALUE + '.bind()'))
      } else {
        draw(setUniformString(GL, uniform.info.type, LOCATION, TOP))
      }
    })

    // unbind textures immediately
    TEXTURE_UNIFORMS.forEach(function (TEX_VALUE) {
      draw(TEX_VALUE, '.unbind();')
    })

    // Execute draw command
    var CUR_PRIMITIVE = def(stackTop(DRAW_STATE.primitive))
    var CUR_COUNT = def(stackTop(DRAW_STATE.count))
    var CUR_OFFSET = def(stackTop(DRAW_STATE.offset))
    var CUR_ELEMENTS = def(stackTop(ELEMENT_STATE))

    // Only execute draw command if number elements is > 0
    draw('if(', CUR_COUNT, '){')

    var instancing = extensions.angle_instanced_arrays
    if (instancing) {
      var CUR_INSTANCES = def(stackTop(DRAW_STATE.instances))
      var INSTANCE_EXT = link(instancing)
      draw(
        'if(', CUR_ELEMENTS, '){',
        CUR_ELEMENTS, '.bind();',
        'if(', CUR_INSTANCES, '>0){',
        INSTANCE_EXT, '.drawElementsInstancedANGLE(',
        CUR_PRIMITIVE, ',',
        CUR_COUNT, ',',
        CUR_ELEMENTS, '.type,',
        CUR_OFFSET, ',',
        CUR_INSTANCES, ');}else{',
        GL, '.drawElements(',
        CUR_PRIMITIVE, ',',
        CUR_COUNT, ',',
        CUR_ELEMENTS, '.type,',
        CUR_OFFSET, ');}',
        '}else if(', CUR_INSTANCES, '>0){',
        INSTANCE_EXT, '.drawArraysInstancedANGLE(',
        CUR_PRIMITIVE, ',',
        CUR_OFFSET, ',',
        CUR_COUNT, ',',
        CUR_INSTANCES, ');}else{',
        GL, '.drawArrays(',
        CUR_PRIMITIVE, ',',
        CUR_OFFSET, ',',
        CUR_COUNT, ');}}')
    } else {
      draw(
        'if(', CUR_ELEMENTS, '){',
        GL, '.drawElements(',
        CUR_PRIMITIVE, ',',
        CUR_COUNT, ',',
        CUR_ELEMENTS, '.type,',
        CUR_OFFSET, ');}',
        '}else{',
        GL, '.drawArrays(',
        CUR_PRIMITIVE, ',',
        CUR_OFFSET, ',',
        CUR_COUNT, ');}')
    }

    return env.compile().draw
  }

  // ===================================================
  // ===================================================
  // BATCH DRAW OPERATION
  // ===================================================
  // ===================================================
  function compileBatch (
    program, options, uniforms, attributes, staticOptions) {
    // -------------------------------
    // code generation helpers
    // -------------------------------
    var env = createEnvironment()
    var link = env.link
    var batch = env.proc('batch')
    var exit = env.block()
    var def = batch.def
    var arg = batch.arg

    // -------------------------------
    // regl state
    // -------------------------------
    var GL = link(gl)
    var PROGRAM = link(program.program)
    var BIND_ATTRIBUTE = link(attributeState.bind)
    var FRAME_STATE = link(frameState)
    var FRAMEBUFFER_STATE = link(framebufferState)
    var DRAW_STATE = {
      count: link(drawState.count),
      offset: link(drawState.offset),
      instances: link(drawState.instances),
      primitive: link(drawState.primitive)
    }
    var CONTEXT_STATE = {}
    var ELEMENTS = link(elementState.elements)
    var CUR_COUNT = def(stackTop(DRAW_STATE.count))
    var CUR_OFFSET = def(stackTop(DRAW_STATE.offset))
    var CUR_PRIMITIVE = def(stackTop(DRAW_STATE.primitive))
    var CUR_ELEMENTS = def(stackTop(ELEMENTS))
    var CUR_INSTANCES
    var INSTANCE_EXT
    var instancing = extensions.angle_instanced_arrays
    if (instancing) {
      CUR_INSTANCES = def(stackTop(DRAW_STATE.instances))
      INSTANCE_EXT = link(instancing)
    }
    var hasDynamicElements = 'elements' in options

    function linkContext (x) {
      var result = CONTEXT_STATE[x]
      if (result) {
        return result
      }
      result = CONTEXT_STATE[x] = link(contextState[x])
      return result
    }

    // -------------------------------
    // batch/argument vars
    // -------------------------------
    var NUM_ARGS = arg()
    var ARGS = arg()
    var ARG = def()
    var BATCH_ID = def()

    // -------------------------------
    // load a dynamic variable
    // -------------------------------
    var dynamicVars = {}
    function dyn (x) {
      var id = x.id
      var result = dynamicVars[id]
      if (result) {
        return result
      }
      if (x.func) {
        result = batch.def(
          link(x.data), '(', ARG, ',', BATCH_ID, ',', FRAME_STATE, ')')
      } else {
        result = batch.def(ARG, '.', x.data)
      }
      dynamicVars[id] = result
      return result
    }

    // -------------------------------
    // retrieves the first name-matching record from an ActiveInfo list
    // -------------------------------
    function findInfo (list, name) {
      return list.find(function (item) {
        return item.name === name
      })
    }

    // -------------------------------
    // bind shader
    // -------------------------------
    batch(GL, '.useProgram(', PROGRAM, ');')

    // -------------------------------
    // set static uniforms
    // -------------------------------
    program.uniforms.forEach(function (uniform) {
      if (uniform.name in uniforms) {
        return
      }
      var LOCATION = link(uniform.location)
      var STACK = link(uniformState.uniforms[uniform.name])
      var TOP = STACK + '[' + STACK + '.length-1]'
      if (uniform.info.type === GL_SAMPLER_2D ||
        uniform.info.type === GL_SAMPLER_CUBE) {
        var TEX_VALUE = def(TOP + '._texture')
        batch(setUniformString(GL, GL_INT, LOCATION, TEX_VALUE + '.bind()'))
        exit(TEX_VALUE, '.unbind();')
      } else {
        batch(setUniformString(GL, uniform.info.type, LOCATION, TOP))
      }
    })

    // -------------------------------
    // set static attributes
    // -------------------------------
    program.attributes.forEach(function (attribute) {
      if (attributes.name in attributes) {
        return
      }
      var STACK = link(attributeState.attributes[attribute.name])
      batch(BIND_ATTRIBUTE, '(',
        attribute.location, ',',
        link(attributeState.bindings[attribute.location]), ',',
        STACK, '.records[', STACK, '.top]', ',',
        typeLength(attribute.info.type), ');')
    })

    // -------------------------------
    // set static element buffer
    // -------------------------------
    if (!hasDynamicElements) {
      batch(
        'if(', CUR_ELEMENTS, '){',
        GL, '.bindBuffer(', GL_ELEMENT_ARRAY_BUFFER, ',', CUR_ELEMENTS, '.buffer.buffer);',
        '}else{',
        GL, '.bindBuffer(', GL_ELEMENT_ARRAY_BUFFER, ',null);',
        '}')
    }

    // -------------------------------
    // loop over all arguments
    // -------------------------------
    batch(
      'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_ARGS, ';++', BATCH_ID, '){',
      ARG, '=', ARGS, '[', BATCH_ID, '];')

    // -------------------------------
    // set dynamic flags
    // -------------------------------
    Object.keys(options).sort(optionPriority).forEach(function (option) {
      var VALUE = dyn(options[option])

      function setCap (flag) {
        batch(
          'if(', VALUE, '){',
          GL, '.enable(', flag, ');}else{',
          GL, '.disable(', flag, ');}')
      }

      switch (option) {
        case 'framebuffer':
          var VIEWPORT_STATE = linkContext('viewport')
          var SCISSOR_STATE = linkContext('scissor.box')
          batch(
            'if(', FRAMEBUFFER_STATE, '.push(',
            VALUE, '&&', VALUE, '._framebuffer)){',
            FRAMEBUFFER_STATE, '.poll();',
            VIEWPORT_STATE, '.setDirty();',
            SCISSOR_STATE, '.setDirty();',
            '}')
          break

        // Caps
        case 'cull.enable':
          setCap(GL_CULL_FACE)
          break
        case 'blend.enable':
          setCap(GL_BLEND)
          break
        case 'dither':
          setCap(GL_DITHER)
          break
        case 'stencil.enable':
          setCap(GL_STENCIL_TEST)
          break
        case 'depth.enable':
          setCap(GL_DEPTH_TEST)
          break
        case 'scissor.enable':
          setCap(GL_SCISSOR_TEST)
          break
        case 'polygonOffset.enable':
          setCap(GL_POLYGON_OFFSET_FILL)
          break
        case 'sample.alpha':
          setCap(GL_SAMPLE_ALPHA_TO_COVERAGE)
          break
        case 'sample.enable':
          setCap(GL_SAMPLE_COVERAGE)
          break

        case 'depth.mask':
          batch(GL, '.depthMask(', VALUE, ');')
          break

        case 'depth.func':
          var DEPTH_FUNCS = link(compareFuncs)
          batch(GL, '.depthFunc(', DEPTH_FUNCS, '[', VALUE, ']);')
          break

        case 'depth.range':
          batch(GL, '.depthRange(', VALUE, '[0],', VALUE, '[1]);')
          break

        case 'blend.color':
          batch(GL, '.blendColor(',
            VALUE, '[0],',
            VALUE, '[1],',
            VALUE, '[2],',
            VALUE, '[3]);')
          break

        case 'blend.equation':
          var BLEND_EQUATIONS = link(blendEquations)
          batch(
            'if(typeof ', VALUE, '==="string"){',
            GL, '.blendEquation(', BLEND_EQUATIONS, '[', VALUE, ']);',
            '}else{',
            GL, '.blendEquationSeparate(',
            BLEND_EQUATIONS, '[', VALUE, '.rgb],',
            BLEND_EQUATIONS, '[', VALUE, '.alpha]);',
            '}')
          break

        case 'blend.func':
          var BLEND_FUNCS = link(blendFuncs)
          batch(
            GL, '.blendFuncSeparate(',
            BLEND_FUNCS,
            '["srcRGB" in ', VALUE, '?', VALUE, '.srcRGB:', VALUE, '.src],',
            BLEND_FUNCS,
            '["dstRGB" in ', VALUE, '?', VALUE, '.dstRGB:', VALUE, '.dst],',
            BLEND_FUNCS,
            '["srcAlpha" in ', VALUE, '?', VALUE, '.srcAlpha:', VALUE, '.src],',
            BLEND_FUNCS,
            '["dstAlpha" in ', VALUE, '?', VALUE, '.dstAlpha:', VALUE, '.dst]);')
          break

        case 'stencil.mask':
          batch(GL, '.stencilMask(', VALUE, ');')
          break

        case 'stencil.func':
          var STENCIL_FUNCS = link(compareFuncs)
          batch(GL, '.stencilFunc(',
            STENCIL_FUNCS, '[', VALUE, '.cmp||"always"],',
            VALUE, '.ref|0,',
            '"mask" in ', VALUE, '?', VALUE, '.mask:-1);')
          break

        case 'stencil.opFront':
        case 'stencil.opBack':
          var STENCIL_OPS = link(stencilOps)
          batch(GL, '.stencilOpSeparate(',
            option === 'stencil.opFront' ? GL_FRONT : GL_BACK, ',',
            STENCIL_OPS, '[', VALUE, '.fail||"keep"],',
            STENCIL_OPS, '[', VALUE, '.zfail||"keep"],',
            STENCIL_OPS, '[', VALUE, '.pass||"keep"]);')
          break

        case 'polygonOffset.offset':
          batch(GL, '.polygonOffset(',
            VALUE, '.factor||0,',
            VALUE, '.units||0);')
          break

        case 'cull.face':
          batch(GL, '.cullFace(',
            VALUE, '==="front"?', GL_FRONT, ':', GL_BACK, ');')
          break

        case 'lineWidth':
          batch(GL, '.lineWidth(', VALUE, ');')
          break

        case 'frontFace':
          batch(GL, '.frontFace(',
            VALUE, '==="cw"?', GL_CW, ':', GL_CCW, ');')
          break

        case 'colorMask':
          batch(GL, '.colorMask(',
            VALUE, '[0],',
            VALUE, '[1],',
            VALUE, '[2],',
            VALUE, '[3]);')
          break

        case 'sample.coverage':
          batch(GL, '.sampleCoverage(',
            VALUE, '.value,',
            VALUE, '.invert);')
          break

        case 'scissor.box':
        case 'viewport':
          var BOX_STATE = linkContext(option)
          batch(BOX_STATE, '.push(',
            VALUE, '.x||0,',
            VALUE, '.y||0,',
            VALUE, '.w||-1,',
            VALUE, '.h||-1);')
          break

        case 'primitives':
        case 'offset':
        case 'count':
        case 'elements':
          break

        default:
          check.raise('unsupported option for batch', option)
      }
    })

    // update viewport/scissor box state and restore framebuffer
    if ('viewport' in options || 'framebuffer' in options) {
      batch(linkContext('viewport'), '.poll();')
    }
    if ('scissor.box' in options || 'framebuffer' in options) {
      batch(linkContext('scissor.box'), '.poll();')
    }
    if ('framebuffer' in options) {
      batch(FRAMEBUFFER_STATE, '.pop();')
    }

    // -------------------------------
    // set dynamic uniforms
    // -------------------------------
    var programUniforms = program.uniforms
    var DYNAMIC_TEXTURES = []
    Object.keys(uniforms).forEach(function (uniform) {
      var data = findInfo(programUniforms, uniform)
      if (!data) {
        return
      }
      var TYPE = data.info.type
      var LOCATION = link(data.location)
      var VALUE = dyn(uniforms[uniform])
      if (data.info.type === GL_SAMPLER_2D ||
          data.info.type === GL_SAMPLER_CUBE) {
        var TEX_VALUE = def(VALUE + '._texture')
        DYNAMIC_TEXTURES.push(TEX_VALUE)
        batch(setUniformString(GL, GL_INT, LOCATION, TEX_VALUE + '.bind()'))
      } else {
        batch(setUniformString(GL, TYPE, LOCATION, VALUE))
      }
    })
    DYNAMIC_TEXTURES.forEach(function (VALUE) {
      batch(VALUE, '.unbind();')
    })

    // -------------------------------
    // set dynamic attributes
    // -------------------------------
    var programAttributes = program.attributes
    Object.keys(attributes).forEach(function (attribute) {
      var data = findInfo(programAttributes, attribute)
      if (!data) {
        return
      }
      batch(BIND_ATTRIBUTE, '(',
        data.location, ',',
        link(attribute.bindings[data.location]), ',',
        dyn(attributes[attribute]), ',',
        typeLength(data.info.type), ');')
    })

    // -------------------------------
    // set dynamic attributes
    // -------------------------------

    if (options.count) {
      batch(CUR_COUNT, '=', dyn(options.count), ';')
    } else if (!useElementOption('count')) {
      batch('if(', CUR_COUNT, '){')
    }
    if (options.offset) {
      batch(CUR_OFFSET, '=', dyn(options.offset), ';')
    }
    if (options.primitive) {
      var PRIM_TYPES = link(primTypes)
      batch(CUR_PRIMITIVE, '=', PRIM_TYPES, '[', dyn(options.primitive), '];')
    }

    function useElementOption (x) {
      return hasDynamicElements && !(x in options || x in staticOptions)
    }
    if (hasDynamicElements) {
      var dynElements = dyn(options.elements)
      batch(CUR_ELEMENTS, '=',
        dynElements, '?', dynElements, '._elements:null;')
    }
    if (useElementOption('offset')) {
      batch(CUR_OFFSET, '=0;')
    }

    // Emit draw command
    batch('if(', CUR_ELEMENTS, '){')
    if (useElementOption('count')) {
      batch(CUR_COUNT, '=', CUR_ELEMENTS, '.vertCount;',
        'if(', CUR_COUNT, '>0){')
    }
    if (useElementOption('primitive')) {
      batch(CUR_PRIMITIVE, '=', CUR_ELEMENTS, '.primType;')
    }
    if (hasDynamicElements) {
      batch(
        GL,
        '.bindBuffer(',
        GL_ELEMENT_ARRAY_BUFFER, ',',
        CUR_ELEMENTS, '.buffer.buffer);')
    }
    if (instancing) {
      if (options.instances) {
        batch(CUR_INSTANCES, '=', dyn(options.instances), ';')
      }
      batch(
        'if(', CUR_INSTANCES, '>0){',
        INSTANCE_EXT, '.drawElementsInstancedANGLE(',
        CUR_PRIMITIVE, ',',
        CUR_COUNT, ',',
        CUR_ELEMENTS, '.type,',
        CUR_OFFSET, ',',
        CUR_INSTANCES, ');}else{')
    }
    batch(
      GL, '.drawElements(',
      CUR_PRIMITIVE, ',',
      CUR_COUNT, ',',
      CUR_ELEMENTS, '.type,',
      CUR_OFFSET, ');')
    if (instancing) {
      batch('}')
    }
    if (useElementOption('count')) {
      batch('}')
    }
    batch('}else{')
    if (!useElementOption('count')) {
      if (useElementOption('primitive')) {
        batch(CUR_PRIMITIVE, '=', GL_TRIANGLES, ';')
      }
      if (instancing) {
        batch(
          'if(', CUR_INSTANCES, '>0){',
          INSTANCE_EXT, '.drawArraysInstancedANGLE(',
          CUR_PRIMITIVE, ',',
          CUR_OFFSET, ',',
          CUR_COUNT, ',',
          CUR_INSTANCES, ');}else{')
      }
      batch(
        GL, '.drawArrays(',
        CUR_PRIMITIVE, ',',
        CUR_OFFSET, ',',
        CUR_COUNT, ');}')
      if (instancing) {
        batch('}')
      }
    }
    batch('}}', exit)

    // -------------------------------
    // compile and return
    // -------------------------------
    return env.compile().batch
  }

  // ===================================================
  // ===================================================
  // MAIN DRAW COMMAND
  // ===================================================
  // ===================================================
  function compileCommand (
    staticOptions, staticUniforms, staticAttributes,
    dynamicOptions, dynamicUniforms, dynamicAttributes,
    hasDynamic) {
    // Create code generation environment
    var env = createEnvironment()
    var link = env.link
    var block = env.block
    var proc = env.proc

    var callId = drawCallCounter++

    // -------------------------------
    // Common state variables
    // -------------------------------
    var GL_POLL = link(reglPoll)
    var FRAG_SHADER_STATE = link(shaderState.fragShaders)
    var VERT_SHADER_STATE = link(shaderState.vertShaders)
    var PROGRAM_STATE = link(shaderState.programs)
    var FRAMEBUFFER_STATE = link(framebufferState)
    var DRAW_STATE = {
      count: link(drawState.count),
      offset: link(drawState.offset),
      instances: link(drawState.instances),
      primitive: link(drawState.primitive)
    }
    var ELEMENT_STATE = link(elementState.elements)
    var PRIM_TYPES = link(primTypes)
    var COMPARE_FUNCS = link(compareFuncs)
    var STENCIL_OPS = link(stencilOps)

    var CONTEXT_STATE = {}
    function linkContext (x) {
      var result = CONTEXT_STATE[x]
      if (result) {
        return result
      }
      result = CONTEXT_STATE[x] = link(contextState[x])
      return result
    }

    // ==========================================================
    // STATIC STATE
    // ==========================================================
    // Code blocks for the static sections
    var entry = block()
    var exit = block()

    // -------------------------------
    // update default context state variables
    // -------------------------------
    function handleStaticOption (param, value) {
      var STATE_STACK = linkContext(param)
      entry(STATE_STACK, '.push(', value, ');')
      exit(STATE_STACK, '.pop();')
    }

    var hasShader = false
    Object.keys(staticOptions).sort(optionPriority).forEach(function (param) {
      var value = staticOptions[param]
      switch (param) {
        case 'frag':
          hasShader = true
          entry(FRAG_SHADER_STATE, '.push(', link(value), ');')
          exit(FRAG_SHADER_STATE, '.pop();')
          break

        case 'vert':
          hasShader = true
          entry(VERT_SHADER_STATE, '.push(', link(value), ');')
          exit(VERT_SHADER_STATE, '.pop();')
          break

        case 'framebuffer':
          var fbo = framebufferState.getFramebuffer(value)
          check(value === null || fbo, 'invalid framebuffer object')
          var VIEWPORT_STATE = linkContext('viewport')
          var SCISSOR_STATE = linkContext('scissor.box')
          entry('if(', FRAMEBUFFER_STATE, '.push(', link(
            value && value._framebuffer), ')){',
            VIEWPORT_STATE, '.setDirty();',
            SCISSOR_STATE, '.setDirty();',
            '}')
          exit('if(', FRAMEBUFFER_STATE, '.pop()){',
            VIEWPORT_STATE, '.setDirty();',
            SCISSOR_STATE, '.setDirty();',
            '}')
          break

        // Update draw state
        case 'count':
        case 'offset':
        case 'instances':
          check.nni(value, param)
          entry(DRAW_STATE[param], '.push(', value, ');')
          exit(DRAW_STATE[param], '.pop();')
          break

        // Update primitive type
        case 'primitive':
          check.parameter(value, primTypes, 'not a valid drawing primitive')
          var primType = primTypes[value]
          entry(DRAW_STATE.primitive, '.push(', primType, ');')
          exit(DRAW_STATE.primitive, '.pop();')
          break

        // Update element buffer
        case 'elements':
          var elements = elementState.getElements(value)
          var hasPrimitive = !('primitive' in staticOptions)
          var hasCount = !('count' in staticOptions)
          if (elements) {
            var ELEMENTS = link(elements)
            entry(ELEMENT_STATE, '.push(', ELEMENTS, ');')
            if (hasPrimitive) {
              entry(DRAW_STATE.primitive, '.push(', ELEMENTS, '.primType);')
            }
            if (hasCount) {
              entry(DRAW_STATE.count, '.push(', ELEMENTS, '.vertCount);')
            }
          } else {
            entry(ELEMENT_STATE, '.push(null);')
            if (hasPrimitive) {
              entry(DRAW_STATE.primitive, '.push(', GL_TRIANGLES, ');')
            }
            if (hasCount) {
              entry(DRAW_STATE.count, '.push(0);')
            }
          }
          if (hasPrimitive) {
            exit(DRAW_STATE.primitive, '.pop();')
          }
          if (hasCount) {
            exit(DRAW_STATE.count, '.pop();')
          }
          if (!('offset' in staticOptions)) {
            entry(DRAW_STATE.offset, '.push(0);')
            exit(DRAW_STATE.offset, '.pop();')
          }
          exit(ELEMENT_STATE, '.pop();')
          break

        case 'cull.enable':
        case 'blend.enable':
        case 'dither':
        case 'stencil.enable':
        case 'depth.enable':
        case 'scissor.enable':
        case 'polygonOffset.enable':
        case 'sample.alpha':
        case 'sample.enable':
        case 'depth.mask':
          check.type(value, 'boolean', param)
          handleStaticOption(param, value)
          break

        case 'depth.func':
          check.parameter(value, compareFuncs, param)
          handleStaticOption(param, compareFuncs[value])
          break

        case 'depth.range':
          check(
            Array.isArray(value) &&
            value.length === 2 &&
            value[0] <= value[1],
            'depth range is 2d array')
          var DEPTH_RANGE_STACK = linkContext(param)
          entry(DEPTH_RANGE_STACK, '.push(', value[0], ',', value[1], ');')
          exit(DEPTH_RANGE_STACK, '.pop();')
          break

        case 'blend.func':
          var BLEND_FUNC_STACK = linkContext(param)
          check.type(value, 'object', 'blend func must be an object')
          var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src)
          var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src)
          var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst)
          var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst)
          check.parameter(srcRGB, blendFuncs)
          check.parameter(srcAlpha, blendFuncs)
          check.parameter(dstRGB, blendFuncs)
          check.parameter(dstAlpha, blendFuncs)
          entry(BLEND_FUNC_STACK, '.push(',
            blendFuncs[srcRGB], ',',
            blendFuncs[dstRGB], ',',
            blendFuncs[srcAlpha], ',',
            blendFuncs[dstAlpha], ');')
          exit(BLEND_FUNC_STACK, '.pop();')
          break

        case 'blend.equation':
          var BLEND_EQUATION_STACK = linkContext(param)
          if (typeof value === 'string') {
            check.parameter(value, blendEquations, 'invalid blend equation')
            entry(BLEND_EQUATION_STACK,
              '.push(',
              blendEquations[value], ',',
              blendEquations[value], ');')
          } else if (typeof value === 'object') {
            check.parameter(
              value.rgb, blendEquations, 'invalid blend equation rgb')
            check.parameter(
              value.alpha, blendEquations, 'invalid blend equation alpha')
            entry(BLEND_EQUATION_STACK,
              '.push(',
              blendEquations[value.rgb], ',',
              blendEquations[value.alpha], ');')
          } else {
            check.raise('invalid blend equation')
          }
          exit(BLEND_EQUATION_STACK, '.pop();')
          break

        case 'blend.color':
          check(
            Array.isArray(value) &&
            value.length === 4,
            'blend color is a 4d array')
          var BLEND_COLOR_STACK = linkContext(param)
          entry(BLEND_COLOR_STACK,
            '.push(',
            value[0], ',',
            value[1], ',',
            value[2], ',',
            value[3], ');')
          exit(BLEND_COLOR_STACK, '.pop();')
          break

        case 'stencil.mask':
          check.type(value, 'number', 'stencil mask must be an integer')
          var STENCIL_MASK_STACK = linkContext(param)
          entry(STENCIL_MASK_STACK, '.push(', value, ');')
          exit(STENCIL_MASK_STACK, '.pop();')
          break

        case 'stencil.func':
          check.type(value, 'object', 'stencil func must be an object')
          var cmp = value.cmp || 'keep'
          var ref = value.ref || 0
          var mask = 'mask' in value ? value.mask : -1
          check.parameter(cmp, compareFuncs, 'invalid stencil func cmp')
          check.type(ref, 'number', 'stencil func ref')
          check.type(mask, 'number', 'stencil func mask')
          var STENCIL_FUNC_STACK = linkContext(param)
          entry(STENCIL_FUNC_STACK, '.push(',
            compareFuncs[cmp], ',',
            ref, ',',
            mask, ');')
          exit(STENCIL_FUNC_STACK, '.pop();')
          break

        case 'stencil.opFront':
        case 'stencil.opBack':
          check.type(value, 'object', param)
          var fail = value.fail || 'keep'
          var zfail = value.zfail || 'keep'
          var pass = value.pass || 'keep'
          check.parameter(fail, stencilOps, param)
          check.parameter(zfail, stencilOps, param)
          check.parameter(pass, stencilOps, param)
          var STENCIL_OP_STACK = linkContext(param)
          entry(STENCIL_OP_STACK, '.push(',
            stencilOps[fail], ',',
            stencilOps[zfail], ',',
            stencilOps[pass], ');')
          exit(STENCIL_OP_STACK, '.pop();')
          break

        case 'polygonOffset.offset':
          check.type(value, 'object', param)
          var factor = value.factor || 0
          var units = value.units || 0
          check.type(factor, 'number', 'offset.factor')
          check.type(units, 'number', 'offset.units')
          var POLYGON_OFFSET_STACK = linkContext(param)
          entry(POLYGON_OFFSET_STACK, '.push(',
            factor, ',', units, ');')
          exit(POLYGON_OFFSET_STACK, '.pop();')
          break

        case 'cull.face':
          var face = 0
          if (value === 'front') {
            face = GL_FRONT
          } else if (value === 'back') {
            face = GL_BACK
          }
          check(!!face, 'cull.face')
          var CULL_FACE_STACK = linkContext(param)
          entry(CULL_FACE_STACK, '.push(', face, ');')
          exit(CULL_FACE_STACK, '.pop();')
          break

        case 'lineWidth':
          var lineWidthDims = limits.lineWidthDims
          check(
            typeof value === 'number' &&
            value >= lineWidthDims[0] &&
            value <= lineWidthDims[1],
            'invalid line width, must positive number between ' +
            lineWidthDims[0] + ' and ' + lineWidthDims[1])
          handleStaticOption(param, value)
          break

        case 'frontFace':
          var orientation = 0
          if (value === 'cw') {
            orientation = GL_CW
          } else if (value === 'ccw') {
            orientation = GL_CCW
          }
          check(!!orientation, 'frontFace')
          var FRONT_FACE_STACK = linkContext(param)
          entry(FRONT_FACE_STACK, '.push(', orientation, ');')
          exit(FRONT_FACE_STACK, '.pop();')
          break

        case 'colorMask':
          check(Array.isArray(value) && value.length === 4, 'color mask must be length 4 array')
          var COLOR_MASK_STACK = linkContext(param)
          entry(COLOR_MASK_STACK, '.push(',
            value.map(function (v) { return !!v }).join(),
            ');')
          exit(COLOR_MASK_STACK, '.pop();')
          break

        case 'sample.coverage':
          check.type(value, 'object', param)
          var sampleValue = 'value' in value ? value.value : 1
          var sampleInvert = !!value.invert
          check(
            typeof sampleValue === 'number' &&
            sampleValue >= 0 && sampleValue <= 1,
            'sample value')
          var SAMPLE_COVERAGE_STACK = linkContext(param)
          entry(SAMPLE_COVERAGE_STACK, '.push(',
            sampleValue, ',', sampleInvert, ');')
          exit(SAMPLE_COVERAGE_STACK, '.pop();')
          break

        case 'viewport':
        case 'scissor.box':
          check(typeof value === 'object' && value, param + ' is an object')
          var X = value.x || 0
          var Y = value.y || 0
          var W = -1
          var H = -1
          check(typeof X === 'number' && X >= 0, param + '.x must be a positive int')
          check(typeof Y === 'number' && Y >= 0, param + '.y must be a positive int')
          if ('w' in value) {
            W = value.w
            check(typeof W === 'number' && W >= 0, param + '.w must be a positive int')
          }
          if ('h' in value) {
            H = value.h
            check(typeof H === 'number' && H >= 0, param + '.h must be a positive int')
          }
          var BOX_STACK = linkContext(param)
          entry(BOX_STACK, '.push(', X, ',', Y, ',', W, ',', H, ');')
          exit(BOX_STACK, '.pop();')
          break

        default:
          // TODO Should this just be a warning instead?
          check.raise('unsupported parameter ' + param)
          break
      }
    })

    // -------------------------------
    // update shader program
    // -------------------------------
    if (hasShader) {
      if (staticOptions.frag && staticOptions.vert) {
        var fragSrc = staticOptions.frag
        var vertSrc = staticOptions.vert
        entry(PROGRAM_STATE, '.push(',
          link(shaderState.create(vertSrc, fragSrc)), ');')
      } else {
        var FRAG_SRC = entry.def(
          FRAG_SHADER_STATE, '[', FRAG_SHADER_STATE, '.length-1]')
        var VERT_SRC = entry.def(
          VERT_SHADER_STATE, '[', VERT_SHADER_STATE, '.length-1]')
        var LINK_PROG = link(shaderState.create)
        entry(
          PROGRAM_STATE, '.push(',
          LINK_PROG, '(', VERT_SRC, ',', FRAG_SRC, '));')
      }
      exit(PROGRAM_STATE, '.pop();')
    }

    // -------------------------------
    // update static uniforms
    // -------------------------------
    Object.keys(staticUniforms).forEach(function (uniform) {
      uniformState.def(uniform)
      var STACK = link(uniformState.uniforms[uniform])
      var VALUE
      var value = staticUniforms[uniform]
      if (typeof value === 'function' && value._reglType) {
        VALUE = link(value)
      } else if (Array.isArray(value)) {
        VALUE = link(value.slice())
      } else {
        VALUE = +value
      }
      entry(STACK, '.push(', VALUE, ');')
      exit(STACK, '.pop();')
    })

    // -------------------------------
    // update default attributes
    // -------------------------------
    Object.keys(staticAttributes).forEach(function (attribute) {
      attributeState.def(attribute)
      var ATTRIBUTE = link(attributeState.attributes[attribute])

      var data = staticAttributes[attribute]
      if (typeof data === 'number') {
        entry(ATTRIBUTE, '.pushVec(', +data, ',0,0,0);')
      } else {
        check(!!data, 'invalid attribute: ' + attribute)

        if (Array.isArray(data)) {
          entry(
            ATTRIBUTE, '.pushVec(',
            [data[0] || 0, data[1] || 0, data[2] || 0, data[3] || 0], ');')
        } else {
          var buffer = bufferState.getBuffer(data)
          var size = 0
          var stride = 0
          var offset = 0
          var divisor = 0
          var normalized = false
          var type = GL_FLOAT

          if (!buffer) {
            check.type(data, 'object', 'invalid attribute "' + attribute + '"')

            buffer = bufferState.getBuffer(data.buffer)
            size = data.size || 0
            stride = data.stride || 0
            offset = data.offset || 0
            divisor = data.divisor || 0
            normalized = data.normalized || false

            check(!!buffer, 'invalid attribute ' + attribute + '.buffer')

            // Check for user defined type overloading
            type = buffer.dtype
            if ('type' in data) {
              check.parameter(data.type, glTypes, 'attribute type')
              type = glTypes[data.type]
            }
          } else {
            type = buffer.dtype
          }

          check(!!buffer, 'invalid attribute ' + attribute + '.buffer')
          check.nni(stride, attribute + '.stride')
          check.nni(offset, attribute + '.offset')
          check.nni(divisor, attribute + '.divisor')
          check.type(normalized, 'boolean', attribute + '.normalized')
          check.oneOf(size, [0, 1, 2, 3, 4], attribute + '.size')

          entry(
            ATTRIBUTE, '.pushPtr(', [
              link(buffer), size, offset, stride,
              divisor, normalized, type
            ].join(), ');')
        }
      }
      exit(ATTRIBUTE, '.pop();')
    })

    // ==========================================================
    // DYNAMIC STATE (for scope and draw)
    // ==========================================================
    // Generated code blocks for dynamic state flags
    var dynamicEntry = env.block()
    var dynamicExit = env.block()

    var FRAMESTATE
    var DYNARGS
    if (hasDynamic) {
      FRAMESTATE = link(frameState)
      DYNARGS = entry.def()
    }

    var dynamicVars = {}
    function dyn (x) {
      var id = x.id
      var result = dynamicVars[id]
      if (result) {
        return result
      }
      if (x.func) {
        result = dynamicEntry.def(
          link(x.data), '(', DYNARGS, ',0,', FRAMESTATE, ')')
      } else {
        result = dynamicEntry.def(DYNARGS, '.', x.data)
      }
      dynamicVars[id] = result
      return result
    }

    // -------------------------------
    // dynamic context state variables
    // -------------------------------
    Object.keys(dynamicOptions).sort(optionPriority).forEach(function (param) {
      // Link in dynamic variable
      var variable = dyn(dynamicOptions[param])

      switch (param) {
        case 'framebuffer':
          var VIEWPORT_STATE = linkContext('viewport')
          var SCISSOR_STATE = linkContext('scissor.box')
          dynamicEntry('if(',
            FRAMEBUFFER_STATE, '.push(',
            variable, '&&', variable, '._framebuffer)){',
            VIEWPORT_STATE, '.setDirty();',
            SCISSOR_STATE, '.setDirty();',
            '}')
          dynamicExit('if(',
            FRAMEBUFFER_STATE, '.pop()){',
            VIEWPORT_STATE, '.setDirty();',
            SCISSOR_STATE, '.setDirty();',
            '}')
          break

        case 'cull.enable':
        case 'blend.enable':
        case 'dither':
        case 'stencil.enable':
        case 'depth.enable':
        case 'scissor.enable':
        case 'polygonOffset.enable':
        case 'sample.alpha':
        case 'sample.enable':
        case 'lineWidth':
        case 'depth.mask':
          var STATE_STACK = linkContext(param)
          dynamicEntry(STATE_STACK, '.push(', variable, ');')
          dynamicExit(STATE_STACK, '.pop();')
          break

        // Draw calls
        case 'count':
        case 'offset':
        case 'instances':
          var DRAW_STACK = DRAW_STATE[param]
          dynamicEntry(DRAW_STACK, '.push(', variable, ');')
          dynamicExit(DRAW_STACK, '.pop();')
          break

        case 'primitive':
          var PRIM_STACK = DRAW_STATE.primitive
          dynamicEntry(PRIM_STACK, '.push(', PRIM_TYPES, '[', variable, ']);')
          dynamicExit(PRIM_STACK, '.pop();')
          break

        case 'depth.func':
          var DEPTH_FUNC_STACK = linkContext(param)
          dynamicEntry(DEPTH_FUNC_STACK, '.push(', COMPARE_FUNCS, '[', variable, ']);')
          dynamicExit(DEPTH_FUNC_STACK, '.pop();')
          break

        case 'blend.func':
          var BLEND_FUNC_STACK = linkContext(param)
          var BLEND_FUNCS = link(blendFuncs)
          dynamicEntry(
            BLEND_FUNC_STACK, '.push(',
            BLEND_FUNCS,
            '["srcRGB" in ', variable, '?', variable, '.srcRGB:', variable, '.src],',
            BLEND_FUNCS,
            '["dstRGB" in ', variable, '?', variable, '.dstRGB:', variable, '.dst],',
            BLEND_FUNCS,
            '["srcAlpha" in ', variable, '?', variable, '.srcAlpha:', variable, '.src],',
            BLEND_FUNCS,
            '["dstAlpha" in ', variable, '?', variable, '.dstAlpha:', variable, '.dst]);')
          dynamicExit(BLEND_FUNC_STACK, '.pop();')
          break

        case 'blend.equation':
          var BLEND_EQUATION_STACK = linkContext(param)
          var BLEND_EQUATIONS = link(blendEquations)
          dynamicEntry(
            'if(typeof ', variable, '==="string"){',
            BLEND_EQUATION_STACK, '.push(',
            BLEND_EQUATIONS, '[', variable, '],',
            BLEND_EQUATIONS, '[', variable, ']);',
            '}else{',
            BLEND_EQUATION_STACK, '.push(',
            BLEND_EQUATIONS, '[', variable, '.rgb],',
            BLEND_EQUATIONS, '[', variable, '.alpha]);',
            '}')
          dynamicExit(BLEND_EQUATION_STACK, '.pop();')
          break

        case 'blend.color':
          var BLEND_COLOR_STACK = linkContext(param)
          dynamicEntry(BLEND_COLOR_STACK, '.push(',
            variable, '[0],',
            variable, '[1],',
            variable, '[2],',
            variable, '[3]);')
          dynamicExit(BLEND_COLOR_STACK, '.pop();')
          break

        case 'stencil.mask':
          var STENCIL_MASK_STACK = linkContext(param)
          dynamicEntry(STENCIL_MASK_STACK, '.push(', variable, ');')
          dynamicExit(STENCIL_MASK_STACK, '.pop();')
          break

        case 'stencil.func':
          var STENCIL_FUNC_STACK = linkContext(param)
          dynamicEntry(STENCIL_FUNC_STACK, '.push(',
            COMPARE_FUNCS, '[', variable, '.cmp],',
            variable, '.ref|0,',
            '"mask" in ', variable, '?', variable, '.mask:-1);')
          dynamicExit(STENCIL_FUNC_STACK, '.pop();')
          break

        case 'stencil.opFront':
        case 'stencil.opBack':
          var STENCIL_OP_STACK = linkContext(param)
          dynamicEntry(STENCIL_OP_STACK, '.push(',
            STENCIL_OPS, '[', variable, '.fail||"keep"],',
            STENCIL_OPS, '[', variable, '.zfail||"keep"],',
            STENCIL_OPS, '[', variable, '.pass||"keep"]);')
          dynamicExit(STENCIL_OP_STACK, '.pop();')
          break

        case 'polygonOffset.offset':
          var POLYGON_OFFSET_STACK = linkContext(param)
          dynamicEntry(POLYGON_OFFSET_STACK, '.push(',
            variable, '.factor||0,',
            variable, '.units||0);')
          dynamicExit(POLYGON_OFFSET_STACK, '.pop();')
          break

        case 'cull.face':
          var CULL_FACE_STACK = linkContext(param)
          dynamicEntry(CULL_FACE_STACK, '.push(',
            variable, '==="front"?', GL_FRONT, ':', GL_BACK, ');')
          dynamicExit(CULL_FACE_STACK, '.pop();')
          break

        case 'frontFace':
          var FRONT_FACE_STACK = linkContext(param)
          dynamicEntry(FRONT_FACE_STACK, '.push(',
            variable, '==="cw"?', GL_CW, ':', GL_CCW, ');')
          dynamicExit(FRONT_FACE_STACK, '.pop();')
          break

        case 'colorMask':
          var COLOR_MASK_STACK = linkContext(param)
          dynamicEntry(COLOR_MASK_STACK, '.push(',
            variable, '[0],',
            variable, '[1],',
            variable, '[2],',
            variable, '[3]);')
          dynamicExit(COLOR_MASK_STACK, '.pop();')
          break

        case 'sample.coverage':
          var SAMPLE_COVERAGE_STACK = linkContext(param)
          dynamicEntry(SAMPLE_COVERAGE_STACK, '.push(',
            variable, '.value,',
            variable, '.invert);')
          dynamicExit(SAMPLE_COVERAGE_STACK, '.pop();')
          break

        case 'scissor.box':
        case 'viewport':
          var BOX_STACK = linkContext(param)
          dynamicEntry(BOX_STACK, '.push(',
            variable, '.x||0,',
            variable, '.y||0,',
            '"w" in ', variable, '?', variable, '.w:-1,',
            '"h" in ', variable, '?', variable, '.h:-1);')
          dynamicExit(BOX_STACK, '.pop();')
          break

        case 'elements':
          var hasPrimitive =
          !('primitive' in dynamicOptions) &&
            !('primitive' in staticOptions)
          var hasCount =
          !('count' in dynamicOptions) &&
            !('count' in staticOptions)
          var hasOffset =
          !('offset' in dynamicOptions) &&
            !('offset' in staticOptions)
          var ELEMENTS = dynamicEntry.def()
          dynamicEntry(
            'if(', variable, '){',
            ELEMENTS, '=', variable, '._elements;',
            ELEMENT_STATE, '.push(', ELEMENTS, ');',
            !hasPrimitive ? ''
              : DRAW_STATE.primitive + '.push(' + ELEMENTS + '.primType);',
            !hasCount ? ''
              : DRAW_STATE.count + '.push(' + ELEMENTS + '.vertCount);',
            !hasOffset ? ''
              : DRAW_STATE.offset + '.push(' + ELEMENTS + '.offset);',
            '}else{',
            ELEMENT_STATE, '.push(null);',
            '}')
          dynamicExit(
            ELEMENT_STATE, '.pop();',
            'if(', variable, '){',
            hasPrimitive ? DRAW_STATE.primitive + '.pop();' : '',
            hasCount ? DRAW_STATE.count + '.pop();' : '',
            hasOffset ? DRAW_STATE.offset + '.pop();' : '',
            '}')
          break

        default:
          check.raise('unsupported dynamic option: ' + param)
      }
    })

    // -------------------------------
    // dynamic uniforms
    // -------------------------------
    Object.keys(dynamicUniforms).forEach(function (uniform) {
      uniformState.def(uniform)
      var STACK = link(uniformState.uniforms[uniform])
      var VALUE = dyn(dynamicUniforms[uniform])
      dynamicEntry(STACK, '.push(', VALUE, ');')
      dynamicExit(STACK, '.pop();')
    })

    // -------------------------------
    // dynamic attributes
    // -------------------------------
    Object.keys(dynamicAttributes).forEach(function (attribute) {
      attributeState.def(attribute)
      var ATTRIBUTE = link(attributeState.attributes[attribute])
      var VALUE = dyn(dynamicAttributes[attribute])
      dynamicEntry(ATTRIBUTE, '.pushDyn(', VALUE, ');')
      dynamicExit(ATTRIBUTE, '.pop();')
    })

    // ==========================================================
    // SCOPE PROCEDURE
    // ==========================================================
    var scope = proc('scope')
    var SCOPE_ARGS = scope.arg()
    var SCOPE_BODY = scope.arg()
    scope(entry)
    if (hasDynamic) {
      scope(
        DYNARGS, '=', SCOPE_ARGS, ';',
        dynamicEntry)
    }
    scope(
      SCOPE_BODY, '();',
      hasDynamic ? dynamicExit : '',
      exit)

    // ==========================================================
    // DRAW PROCEDURE
    // ==========================================================
    var draw = proc('draw')
    draw(entry)
    if (hasDynamic) {
      draw(
        DYNARGS, '=', draw.arg(), ';',
        dynamicEntry)
    }
    var CURRENT_SHADER = stackTop(PROGRAM_STATE)
    draw(
      GL_POLL, '();',
      'if(', CURRENT_SHADER, ')',
      CURRENT_SHADER, '.draw(', hasDynamic ? DYNARGS : '', ');',
      hasDynamic ? dynamicExit : '',
      exit)

    // ==========================================================
    // BATCH DRAW
    // ==========================================================
    var batch = proc('batch')
    batch(entry)
    var CUR_SHADER = batch.def(stackTop(PROGRAM_STATE))
    var EXEC_BATCH = link(function (program, count, args) {
      var proc = program.batchCache[callId]
      if (!proc) {
        proc = program.batchCache[callId] = compileBatch(
          program, dynamicOptions, dynamicUniforms, dynamicAttributes,
          staticOptions)
      }
      return proc(count, args)
    })
    batch(
      'if(', CUR_SHADER, '){',
      GL_POLL, '();',
      EXEC_BATCH, '(',
      CUR_SHADER, ',',
      batch.arg(), ',',
      batch.arg(), ');')
    // Set dirty on all dynamic flags
    Object.keys(dynamicOptions).forEach(function (option) {
      var STATE = CONTEXT_STATE[option]
      if (STATE) {
        batch(STATE, '.setDirty();')
      }
    })
    batch('}', exit)

    // -------------------------------
    // eval and bind
    // -------------------------------
    return env.compile()
  }

  return {
    draw: compileShaderDraw,
    command: compileCommand
  }
}

},{"./check":4,"./codegen":6,"./constants/dtypes.json":9,"./constants/primitives.json":10}],8:[function(require,module,exports){
module.exports={
  "[object Int8Array]": 5120
, "[object Int16Array]": 5122
, "[object Int32Array]": 5124
, "[object Uint8Array]": 5121
, "[object Uint8ClampedArray]": 5121
, "[object Uint16Array]": 5123
, "[object Uint32Array]": 5125
, "[object Float32Array]": 5126
, "[object Float64Array]": 5121
, "[object ArrayBuffer]": 5121
}

},{}],9:[function(require,module,exports){
module.exports={
  "int8": 5120
, "int16": 5122
, "int32": 5124
, "uint8": 5121
, "uint16": 5123
, "uint32": 5125
, "float": 5126
}

},{}],10:[function(require,module,exports){
module.exports={
  "points": 0,
  "lines": 1,
  "line loop": 2,
  "line strip": 3,
  "triangles": 4,
  "triangle strip": 5,
  "triangle fan": 6
}

},{}],11:[function(require,module,exports){
// Context and canvas creation helper functions
/*globals HTMLElement,WebGLRenderingContext*/

var check = require('./check')

function createCanvas (element, options) {
  var canvas = document.createElement('canvas')
  var args = getContext(canvas, options)

  Object.assign(canvas.style, {
    border: 0,
    margin: 0,
    padding: 0,
    top: 0,
    left: 0
  })
  element.appendChild(canvas)

  if (element === document.body) {
    canvas.style.position = 'absolute'
    Object.assign(element.style, {
      margin: 0,
      padding: 0
    })
  }

  var scale = +args.options.pixelRatio
  function resize () {
    var w = window.innerWidth
    var h = window.innerHeight
    if (element !== document.body) {
      var bounds = element.getBoundingClientRect()
      w = bounds.right - bounds.left
      h = bounds.top - bounds.bottom
    }
    canvas.width = scale * w
    canvas.height = scale * h
    Object.assign(canvas.style, {
      width: w + 'px',
      height: h + 'px'
    })
  }

  window.addEventListener('resize', resize, false)

  var prevDestroy = args.options.onDestroy
  args.options = Object.assign({}, args.options, {
    onDestroy: function () {
      window.removeEventListener('resize', resize)
      element.removeChild(canvas)
      prevDestroy && prevDestroy()
    }
  })

  resize()

  return args
}

function getContext (canvas, options) {
  var glOptions = options.glOptions || {}

  function get (name) {
    try {
      return canvas.getContext(name, glOptions)
    } catch (e) {
      return null
    }
  }

  var gl = get('webgl') ||
           get('experimental-webgl') ||
           get('webgl-experimental')

  check(gl, 'webgl not supported')

  return {
    gl: gl,
    options: Object.assign({
      pixelRatio: window.devicePixelRatio
    }, options)
  }
}

module.exports = function parseArgs (args) {
  if (typeof document === 'undefined' ||
      typeof HTMLElement === 'undefined') {
    return {
      gl: args[0],
      options: args[1] || {}
    }
  }

  var element = document.body
  var options = args[1] || {}

  if (typeof args[0] === 'string') {
    element = document.querySelector(args[0]) || document.body
  } else if (typeof args[0] === 'object') {
    if (args[0] instanceof HTMLElement) {
      element = args[0]
    } else if (args[0] instanceof WebGLRenderingContext) {
      return {
        gl: args[0],
        options: Object.assign({
          pixelRatio: 1
        }, options)
      }
    } else {
      options = args[0]
    }
  }

  if (element.nodeName && element.nodeName.toUpperCase() === 'CANVAS') {
    return getContext(element, options)
  } else {
    return createCanvas(element, options)
  }
}

},{"./check":4}],12:[function(require,module,exports){
var GL_TRIANGLES = 4

module.exports = function wrapDrawState (gl) {
  var primitive = [ GL_TRIANGLES ]
  var count = [ 0 ]
  var offset = [ 0 ]
  var instances = [ 0 ]

  return {
    primitive: primitive,
    count: count,
    offset: offset,
    instances: instances
  }
}

},{}],13:[function(require,module,exports){
var VARIABLE_COUNTER = 0

function DynamicVariable (isFunc, data) {
  this.id = (VARIABLE_COUNTER++)
  this.func = isFunc
  this.data = data
}

function defineDynamic (data, path) {
  switch (typeof data) {
    case 'boolean':
    case 'number':
    case 'string':
      return new DynamicVariable(false, data)
    case 'function':
      return new DynamicVariable(true, data)
    default:
      return defineDynamic
  }
}

function isDynamic (x) {
  return (typeof x === 'function' && !x._reglType) ||
         x instanceof DynamicVariable
}

function unbox (x, path) {
  if (x instanceof DynamicVariable) {
    return x
  } else if (typeof x === 'function' &&
             x !== defineDynamic) {
    return new DynamicVariable(true, x)
  }
  return new DynamicVariable(false, path)
}

module.exports = {
  define: defineDynamic,
  isDynamic: isDynamic,
  unbox: unbox
}

},{}],14:[function(require,module,exports){
var check = require('./check')
var isTypedArray = require('./is-typed-array')
var isNDArrayLike = require('./is-ndarray')
var primTypes = require('./constants/primitives.json')

var GL_POINTS = 0
var GL_LINES = 1
var GL_TRIANGLES = 4

var GL_BYTE = 5120
var GL_UNSIGNED_BYTE = 5121
var GL_SHORT = 5122
var GL_UNSIGNED_SHORT = 5123
var GL_INT = 5124
var GL_UNSIGNED_INT = 5125

var GL_ELEMENT_ARRAY_BUFFER = 34963

module.exports = function wrapElementsState (gl, extensions, bufferState) {
  var elements = [ null ]

  function REGLElementBuffer () {
    this.buffer = null
    this.primType = GL_TRIANGLES
    this.vertCount = 0
    this.type = 0
  }

  REGLElementBuffer.prototype.bind = function () {
    this.buffer.bind()
  }

  function createElements (options) {
    var elements = new REGLElementBuffer()
    var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true)
    elements.buffer = buffer._buffer

    function reglElements (input) {
      var options = input
      var ext32bit = extensions.oes_element_index_uint

      // Upload data to vertex buffer
      if (!options) {
        buffer()
      } else if (typeof options === 'number') {
        buffer(options)
      } else {
        var data = null
        var usage = 'static'
        var byteLength = 0
        if (
          Array.isArray(options) ||
          isTypedArray(options) ||
          isNDArrayLike(options)) {
          data = options
        } else {
          check.type(options, 'object', 'invalid arguments for elements')
          if ('data' in options) {
            data = options.data
          }
          if ('usage' in options) {
            usage = options.usage
          }
          if ('length' in options) {
            byteLength = options.length
          }
        }
        if (Array.isArray(data) ||
            (isNDArrayLike(data) && data.dtype === 'array') ||
            'type' in options) {
          buffer({
            type: options.type ||
              (ext32bit
                ? 'uint32'
                : 'uint16'),
            usage: usage,
            data: data,
            length: byteLength
          })
        } else {
          buffer({
            usage: usage,
            data: data,
            length: byteLength
          })
        }
        if (Array.isArray(data) || isTypedArray(data)) {
          buffer.dimension = 3
        }
      }

      // try to guess default primitive type and arguments
      var vertCount = elements.buffer.byteLength
      var type = 0
      switch (elements.buffer.dtype) {
        case GL_UNSIGNED_BYTE:
        case GL_BYTE:
          type = GL_UNSIGNED_BYTE
          break

        case GL_UNSIGNED_SHORT:
        case GL_SHORT:
          type = GL_UNSIGNED_SHORT
          vertCount >>= 1
          break

        case GL_UNSIGNED_INT:
        case GL_INT:
          check(ext32bit, '32 bit element buffers not supported')
          type = GL_UNSIGNED_INT
          vertCount >>= 2
          break

        default:
          check.raise('invalid element buffer type')
      }

      // try to guess primitive type from cell dimension
      var primType = GL_TRIANGLES
      var dimension = elements.buffer.dimension
      if (dimension === 1) primType = GL_POINTS
      if (dimension === 2) primType = GL_LINES
      if (dimension === 3) primType = GL_TRIANGLES

      // if manual override present, use that
      if (typeof options === 'object') {
        if ('primitive' in options) {
          var primitive = options.primitive
          check.parameter(primitive, primTypes)
          primType = primTypes[primitive]
        }

        if ('count' in options) {
          vertCount = options.vertCount | 0
        }
      }

      // update properties for element buffer
      elements.primType = primType
      elements.vertCount = vertCount
      elements.type = type

      return reglElements
    }

    reglElements(options)

    Object.assign(reglElements, {
      _reglType: 'elements',
      _elements: elements,
      destroy: function () {
        check(elements.buffer !== null, 'must not double destroy elements')
        buffer.destroy()
        elements.buffer = null
      }
    })

    return reglElements
  }

  return {
    create: createElements,
    elements: elements,
    getElements: function (elements) {
      if (elements && elements._elements instanceof REGLElementBuffer) {
        return elements._elements
      }
      return null
    }
  }
}

},{"./check":4,"./constants/primitives.json":10,"./is-ndarray":17,"./is-typed-array":18}],15:[function(require,module,exports){
module.exports = function createExtensionCache (gl) {
  var extensions = {}

  function refreshExtensions () {
    [
      'oes_texture_float',
      'oes_texture_float_linear',
      'oes_texture_half_float',
      'oes_texture_half_float_linear',
      'oes_standard_derivatives',
      'oes_element_index_uint',
      'oes_fbo_render_mipmap',

      'webgl_depth_texture',
      'webgl_draw_buffers',
      'webgl_color_buffer_float',

      'ext_texture_filter_anisotropic',
      'ext_frag_depth',
      'ext_blend_minmax',
      'ext_shader_texture_lod',
      'ext_color_buffer_half_float',
      'ext_srgb',

      'angle_instanced_arrays',

      'webgl_compressed_texture_s3tc',
      'webgl_compressed_texture_atc',
      'webgl_compressed_texture_pvrtc',
      'webgl_compressed_texture_etc1'
    ].forEach(function (ext) {
      try {
        extensions[ext] = gl.getExtension(ext)
      } catch (e) {}
    })
  }

  refreshExtensions()

  return {
    extensions: extensions,
    refresh: refreshExtensions
  }
}

},{}],16:[function(require,module,exports){
var check = require('./check')
var values = require('./values')

// We store these constants so that the minifier can inline them
var GL_FRAMEBUFFER = 0x8D40
var GL_RENDERBUFFER = 0x8D41

var GL_TEXTURE_2D = 0x0DE1
var GL_TEXTURE_CUBE_MAP = 0x8513
var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515

var GL_COLOR_ATTACHMENT0 = 0x8CE0
var GL_DEPTH_ATTACHMENT = 0x8D00
var GL_STENCIL_ATTACHMENT = 0x8D20
var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A

var GL_UNSIGNED_BYTE = 0x1401
var GL_FLOAT = 0x1406

var GL_HALF_FLOAT_OES = 0x8D61

var GL_ALPHA = 0x1906
var GL_LUMINANCE = 0x1909
var GL_LUMINANCE_ALPHA = 0x190A
var GL_RGB = 0x1907
var GL_RGBA = 0x1908

var GL_RGBA4 = 0x8056
var GL_RGB5_A1 = 0x8057
var GL_RGB565 = 0x8D62
var GL_DEPTH_COMPONENT16 = 0x81A5
var GL_STENCIL_INDEX8 = 0x8D48

var GL_DEPTH_COMPONENT = 0x1902
var GL_DEPTH_STENCIL = 0x84F9

var GL_SRGB8_ALPHA8_EXT = 0x8C43

var GL_RGBA32F_EXT = 0x8814

var GL_RGBA16F_EXT = 0x881A
var GL_RGB16F_EXT = 0x881B

var GL_FRAMEBUFFER_COMPLETE = 0x8CD5
var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6
var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7
var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9
var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD

var GL_BACK = 1029

var BACK_BUFFER = [GL_BACK]

module.exports = function wrapFBOState (
  gl,
  extensions,
  limits,
  textureState,
  renderbufferState) {
  var statusCode = {}
  statusCode[GL_FRAMEBUFFER_COMPLETE] = 'complete'
  statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment'
  statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions'
  statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment'
  statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported'

  var colorTextureFormats = {
    'rgba': GL_RGBA
  }

  var colorRenderbufferFormats = {
    'rgba4': GL_RGBA4,
    'rgb565': GL_RGB565,
    'rgb5 a1': GL_RGB5_A1
  }

  if (extensions.ext_srgb) {
    colorRenderbufferFormats['srgba'] = GL_SRGB8_ALPHA8_EXT
  }

  if (extensions.ext_color_buffer_half_float) {
    colorRenderbufferFormats['rgba16f'] = GL_RGBA16F_EXT
    colorRenderbufferFormats['rgb16f'] = GL_RGB16F_EXT
  }

  if (extensions.webgl_color_buffer_float) {
    colorRenderbufferFormats['rgba32f'] = GL_RGBA32F_EXT
  }

  var depthRenderbufferFormatEnums = [GL_DEPTH_COMPONENT16]
  var stencilRenderbufferFormatEnums = [GL_STENCIL_INDEX8]
  var depthStencilRenderbufferFormatEnums = [GL_DEPTH_STENCIL]

  var depthTextureFormatEnums = []
  var stencilTextureFormatEnums = []
  var depthStencilTextureFormatEnums = []

  if (extensions.webgl_depth_texture) {
    depthTextureFormatEnums.push(GL_DEPTH_COMPONENT)
    depthStencilTextureFormatEnums.push(GL_DEPTH_STENCIL)
  }

  var colorFormats = Object.assign({},
    colorTextureFormats,
    colorRenderbufferFormats)

  var colorTextureFormatEnums = values(colorTextureFormats)
  var colorRenderbufferFormatEnums = values(colorRenderbufferFormats)

  var highestPrecision = GL_UNSIGNED_BYTE
  var colorTypes = {
    'uint8': GL_UNSIGNED_BYTE
  }
  if (extensions.oes_texture_half_float) {
    highestPrecision = colorTypes['half float'] = GL_HALF_FLOAT_OES
  }
  if (extensions.oes_texture_float) {
    highestPrecision = colorTypes.float = GL_FLOAT
  }
  colorTypes.best = highestPrecision

  var DRAW_BUFFERS = (function () {
    var result = new Array(limits.maxDrawbuffers)
    for (var i = 0; i <= limits.maxDrawbuffers; ++i) {
      var row = result[i] = new Array(i)
      for (var j = 0; j < i; ++j) {
        row[j] = GL_COLOR_ATTACHMENT0 + j
      }
    }
    return result
  })()

  function FramebufferAttachment (target, level, texture, renderbuffer) {
    this.target = target
    this.level = level
    this.texture = texture
    this.renderbuffer = renderbuffer
  }

  function decRef (attachment) {
    if (attachment) {
      if (attachment.texture) {
        attachment.texture._texture.decRef()
      }
      if (attachment.renderbuffer) {
        attachment.renderbuffer._renderbuffer.decRef()
      }
    }
  }

  function checkFormat (attachment, texFormats, rbFormats) {
    if (attachment.texture) {
      check.oneOf(attachment.texture._texture.params.internalformat, texFormats,
        'unsupported texture format for attachment')
    } else {
      check.oneOf(attachment.renderbuffer._renderbuffer.format, rbFormats,
        'unsupported renderbuffer format for attachment')
    }
  }

  function incRefAndCheckShape (attachment, framebuffer) {
    var width = framebuffer.width
    var height = framebuffer.height
    if (attachment.texture) {
      var texture = attachment.texture._texture
      var tw = Math.max(1, texture.params.width >> attachment.level)
      var th = Math.max(1, texture.params.height >> attachment.level)
      width = width || tw
      height = height || th
      check(tw === width && th === height,
        'inconsistent width/height for supplied texture')
      check(texture.pollId < 0,
        'polling fbo textures not supported')
      texture.refCount += 1
    } else {
      var renderbuffer = attachment.renderbuffer._renderbuffer
      width = width || renderbuffer.width
      height = height || renderbuffer.height
      check(
        renderbuffer.width === width && renderbuffer.height === height,
        'inconsistent width/height for renderbuffer')
      check(
        colorRenderbufferFormatEnums.indexOf(renderbuffer.format) >= 0,
        'renderbuffer format not compatible with color channels')
      renderbuffer.refCount += 1
    }
    framebuffer.width = width
    framebuffer.height = height
  }

  function attach (location, attachment) {
    if (attachment) {
      if (attachment.texture) {
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER,
          location,
          attachment.target,
          attachment.texture._texture.texture,
          attachment.level)
      } else {
        gl.framebufferRenderbuffer(
          GL_FRAMEBUFFER,
          location,
          GL_RENDERBUFFER,
          attachment.renderbuffer._renderbuffer.renderbuffer)
      }
    } else {
      gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        location,
        GL_TEXTURE_2D,
        null,
        0)
    }
  }

  function tryUpdateAttachment (
    attachment,
    isTexture,
    format,
    type,
    width,
    height) {
    if (attachment.texture) {
      var texture = attachment.texture
      if (isTexture) {
        texture({
          format: format,
          type: type,
          width: width,
          height: height
        })
        texture._texture.refCount += 1
        return true
      }
    } else {
      var renderbuffer = attachment.renderbuffer
      if (!isTexture) {
        renderbuffer({
          format: format,
          width: width,
          height: height
        })
        renderbuffer._renderbuffer.refCount += 1
        return true
      }
    }
    decRef(attachment)
    return false
  }

  function parseAttachment (attachment) {
    var target = GL_TEXTURE_2D
    var level = 0
    var texture = null
    var renderbuffer = null

    var data = attachment
    if (typeof attachment === 'object') {
      data = attachment.data
      if ('level' in attachment) {
        level = attachment.level | 0
      }
      if ('target' in attachment) {
        target = attachment.target | 0
      }
    }

    check.type(data, 'function', 'invalid attachment data')

    var type = attachment._reglType
    if (type === 'texture') {
      texture = attachment
      if (texture._texture.target === GL_TEXTURE_CUBE_MAP) {
        check(
          target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X &&
          target < GL_TEXTURE_CUBE_MAP_POSITIVE_X + 6,
          'invalid cube map target')
      } else {
        check(target === GL_TEXTURE_2D)
      }
      // TODO check miplevel is consistent
    } else if (type === 'renderbuffer') {
      renderbuffer = attachment
      target = GL_RENDERBUFFER
      level = 0
    } else {
      check.raise('invalid regl object for attachment')
    }

    return new FramebufferAttachment(target, level, texture, renderbuffer)
  }

  function unwrapAttachment (attachment) {
    return attachment && (attachment.texture || attachment.renderbuffer)
  }

  var framebufferCount = 0
  var framebufferSet = {}
  var framebufferStack = [null]
  var framebufferDirty = true

  function REGLFramebuffer () {
    this.id = framebufferCount++
    framebufferSet[this.id] = this

    this.framebuffer = null
    this.width = 0
    this.height = 0

    this.colorAttachments = []
    this.depthAttachment = null
    this.stencilAttachment = null
    this.depthStencilAttachment = null

    this.ownsColor = false
    this.ownsDepthStencil = false
  }

  function refresh (framebuffer) {
    if (!gl.isFramebuffer(framebuffer.framebuffer)) {
      framebuffer.framebuffer = gl.createFramebuffer()
    }
    framebufferDirty = true
    gl.bindFramebuffer(GL_FRAMEBUFFER, framebuffer.framebuffer)

    var colorAttachments = framebuffer.colorAttachments
    for (var i = 0; i < colorAttachments.length; ++i) {
      attach(GL_COLOR_ATTACHMENT0 + i, colorAttachments[i])
    }
    for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
      attach(GL_COLOR_ATTACHMENT0 + i, null)
    }
    attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment)
    attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment)
    attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment)

    if (extensions.webgl_draw_buffers) {
      extensions.webgl_draw_buffers.drawBuffersWEBGL(
        DRAW_BUFFERS[colorAttachments.length])
    }

    // Check status code
    var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER)
    if (status !== GL_FRAMEBUFFER_COMPLETE) {
      check.raise('framebuffer configuration not supported, status = ' +
        statusCode[status])
    }
  }

  function decFBORefs (framebuffer) {
    framebuffer.colorAttachments.forEach(decRef)
    decRef(framebuffer.depthAttachment)
    decRef(framebuffer.stencilAttachment)
    decRef(framebuffer.depthStencilAttachment)
  }

  function destroy (framebuffer) {
    var handle = framebuffer.framebuffer
    check(handle, 'must not double destroy framebuffer')
    if (gl.isFramebuffer(handle)) {
      gl.deleteFramebuffer(handle)
    }
  }

  function createFBO (options) {
    var framebuffer = new REGLFramebuffer()

    function reglFramebuffer (input) {
      var i
      var options = input || {}

      var extDrawBuffers = extensions.webgl_draw_buffers

      var width = 0
      var height = 0
      if ('shape' in options) {
        var shape = options.shape
        check(Array.isArray(shape) && shape.length >= 2,
          'invalid shape for framebuffer')
        width = shape[0]
        height = shape[1]
      } else {
        if ('radius' in options) {
          width = height = options.radius
        }
        if ('width' in options) {
          width = options.width
        }
        if ('height' in options) {
          height = options.height
        }
      }

      // colorType, numColors
      var colorBuffers = null
      var ownsColor = false
      if ('colorBuffers' in options || 'colorBuffer' in options) {
        var colorInputs = options.colorBuffers || options.colorBuffer
        if (!Array.isArray(colorInputs)) {
          colorInputs = [colorInputs]
        }

        framebuffer.width = width
        framebuffer.height = height

        if (colorInputs.length > 1) {
          check(extDrawBuffers, 'multiple render targets not supported')
        }
        check(colorInputs.length >= 0,
          'must specify at least one color attachment')

        // Wrap color attachments
        colorBuffers = colorInputs.map(parseAttachment)

        // Check head node
        for (i = 0; i < colorBuffers.length; ++i) {
          var colorAttachment = colorBuffers[i]
          checkFormat(
            colorAttachment,
            colorTextureFormatEnums,
            colorRenderbufferFormatEnums)
          incRefAndCheckShape(
            colorAttachment,
            framebuffer)
        }

        width = framebuffer.width
        height = framebuffer.height
      } else {
        var colorTexture = true
        var colorFormat = 'rgba'
        var colorType = 'uint8'
        var colorCount = 1
        ownsColor = true

        framebuffer.width = width || gl.drawingBufferWidth
        framebuffer.height = height || gl.drawingBufferHeight

        if ('format' in options) {
          colorFormat = options.format
          check.parameter(colorFormat, colorFormats, 'invalid color format')
          colorTexture = colorFormat in colorTextureFormats
        }

        if ('type' in options) {
          check(colorTexture,
            'colorType can not be set for renderbuffer targets')
          colorType = options.type
          check.parameter(colorType, colorTypes, 'invalid color type')
        }

        if ('colorCount' in options) {
          colorCount = options.colorCount | 0
          check(colorCount >= 0, 'color count must be positive')
        }

        // Reuse color buffer array if we own it
        if (framebuffer.ownsColor) {
          colorBuffers = framebuffer.colorAttachments
          while (colorBuffers.length > colorCount) {
            decRef(colorBuffers.pop())
          }
        } else {
          colorBuffers = []
        }

        // update buffers in place, remove incompatible buffers
        for (i = 0; i < colorBuffers.length; ++i) {
          if (!tryUpdateAttachment(
              colorBuffers[i],
              colorTexture,
              colorFormat,
              colorType,
              width,
              height)) {
            colorBuffers[i--] = colorBuffers[colorBuffers.length - 1]
            colorBuffers.pop()
          }
        }

        // Then append new buffers
        while (colorBuffers.length < colorCount) {
          if (colorTexture) {
            colorBuffers.push(new FramebufferAttachment(
              GL_TEXTURE_2D,
              0,
              textureState.create({
                format: colorFormat,
                type: colorType,
                width: width,
                height: height
              }, GL_TEXTURE_2D),
              null))
          } else {
            colorBuffers.push(new FramebufferAttachment(
              GL_RENDERBUFFER,
              0,
              null,
              renderbufferState.create({
                format: colorFormat,
                width: width,
                height: height
              })))
          }
        }
      }

      check(colorBuffers.length > 0, 'must specify at least one color buffer')

      framebuffer.width = width
      framebuffer.height = height

      var depthBuffer = null
      var stencilBuffer = null
      var depthStencilBuffer = null
      var ownsDepthStencil = false
      var depthStencilCount = 0

      if ('depthBuffer' in options) {
        depthBuffer = parseAttachment(options.depthBuffer)
        checkFormat(
          depthBuffer,
          depthTextureFormatEnums,
          depthRenderbufferFormatEnums)
        depthStencilCount += 1
      }
      if ('stencilBuffer' in options) {
        stencilBuffer = parseAttachment(options.stencilBuffer)
        checkFormat(
          stencilBuffer,
          stencilTextureFormatEnums,
          stencilRenderbufferFormatEnums)
        depthStencilCount += 1
      }
      if ('depthStencilBuffer' in options) {
        depthStencilBuffer = parseAttachment(options.depthStencilBuffer)
        checkFormat(
          depthStencilBuffer,
          depthStencilTextureFormatEnums,
          depthStencilRenderbufferFormatEnums)
        depthStencilCount += 1
      }

      if (!(depthBuffer || stencilBuffer || depthStencilBuffer)) {
        var depth = true
        var stencil = false
        var useTexture = false

        if ('depth' in options) {
          depth = !!options.depth
        }
        if ('stencil' in options) {
          stencil = !!options.stencil
        }
        if ('depthTexture' in options) {
          useTexture = !!options.depthTexture
        }

        var curDepthStencil =
          framebuffer.depthAttachment ||
          framebuffer.stencilAttachment ||
          framebuffer.depthStencilAttachment
        var nextDepthStencil = null

        if (depth || stencil) {
          ownsDepthStencil = true

          if (useTexture) {
            check(extensions.webgl_depth_texture,
              'depth texture extension not supported')
            var depthTextureFormat
            check(depth, 'stencil only textures not supported')
            if (stencil) {
              depthTextureFormat = 'depth stencil'
            } else {
              depthTextureFormat = 'depth'
            }
            if (framebuffer.ownsDepthStencil && curDepthStencil.texture) {
              curDepthStencil.texture({
                format: depthTextureFormat,
                width: width,
                height: height
              })
              curDepthStencil.texture._texture.refCount += 1
              nextDepthStencil = curDepthStencil
            } else {
              nextDepthStencil = new FramebufferAttachment(
                GL_TEXTURE_2D,
                0,
                textureState.create({
                  format: depthTextureFormat,
                  width: width,
                  height: height
                }, GL_TEXTURE_2D),
                null)
            }
          } else {
            var depthRenderbufferFormat
            if (depth) {
              if (stencil) {
                depthRenderbufferFormat = 'depth stencil'
              } else {
                depthRenderbufferFormat = 'depth'
              }
            } else {
              depthRenderbufferFormat = 'stencil'
            }
            if (framebuffer.ownsDepthStencil && curDepthStencil.renderbuffer) {
              curDepthStencil.renderbuffer({
                format: depthRenderbufferFormat,
                width: width,
                height: height
              })
              curDepthStencil.renderbuffer._renderbuffer.refCount += 1
              nextDepthStencil = curDepthStencil
            } else {
              nextDepthStencil = new FramebufferAttachment(
                GL_RENDERBUFFER,
                0,
                null,
                renderbufferState.create({
                  format: depthRenderbufferFormat,
                  width: width,
                  height: height
                }))
            }
          }

          if (depth) {
            if (stencil) {
              depthStencilBuffer = nextDepthStencil
            } else {
              depthBuffer = nextDepthStencil
            }
          } else {
            stencilBuffer = nextDepthStencil
          }
        }
      } else {
        check(depthStencilCount === 1,
          'can specify only one of depth, stencil or depthStencil attachment')

        incRefAndCheckShape(
          depthBuffer ||
          stencilBuffer ||
          depthStencilBuffer,
          framebuffer)
      }

      decFBORefs(framebuffer)

      framebuffer.colorAttachments = colorBuffers
      framebuffer.depthAttachment = depthBuffer
      framebuffer.stencilAttachment = stencilBuffer
      framebuffer.depthStencilAttachment = depthStencilBuffer
      framebuffer.ownsColor = ownsColor
      framebuffer.ownsDepthStencil = ownsDepthStencil

      reglFramebuffer.color = colorBuffers.map(unwrapAttachment)
      reglFramebuffer.depth = unwrapAttachment(depthBuffer)
      reglFramebuffer.stencil = unwrapAttachment(stencilBuffer)
      reglFramebuffer.depthStencil = unwrapAttachment(depthStencilBuffer)

      refresh(framebuffer)

      reglFramebuffer.width = framebuffer.width
      reglFramebuffer.height = framebuffer.height

      return reglFramebuffer
    }

    reglFramebuffer(options)

    Object.assign(reglFramebuffer, {
      _reglType: 'framebuffer',
      _framebuffer: framebuffer,
      destroy: function () {
        destroy(framebuffer)
      }
    })

    return reglFramebuffer
  }

  function refreshCache () {
    values(framebufferSet).forEach(refresh)
  }

  function clearCache () {
    values(framebufferSet).forEach(destroy)
  }

  function poll () {
    if (framebufferDirty) {
      var top = framebufferStack[framebufferStack.length - 1]
      var ext_drawbuffers = extensions.webgl_draw_buffers

      if (top) {
        gl.bindFramebuffer(GL_FRAMEBUFFER, top.framebuffer)
        if (ext_drawbuffers) {
          ext_drawbuffers.drawBuffersWEBGL(DRAW_BUFFERS[top.colorAttachments.length])
        }
      } else {
        gl.bindFramebuffer(GL_FRAMEBUFFER, null)
        if (ext_drawbuffers) {
          ext_drawbuffers.drawBuffersWEBGL(BACK_BUFFER)
        }
      }

      framebufferDirty = false
    }
  }

  function currentFramebuffer () {
    return framebufferStack[framebufferStack.length - 1]
  }

  return {
    top: currentFramebuffer,
    dirty: function () {
      return framebufferDirty
    },
    push: function (next_) {
      var next = next_ || null
      framebufferDirty = framebufferDirty || (next !== currentFramebuffer())
      framebufferStack.push(next)
      return framebufferDirty
    },
    pop: function () {
      var prev = currentFramebuffer()
      framebufferStack.pop()
      framebufferDirty = framebufferDirty || (prev !== currentFramebuffer())
      return framebufferDirty
    },
    getFramebuffer: function (object) {
      if (typeof object === 'function' && object._reglType === 'framebuffer') {
        var fbo = object._framebuffer
        if (fbo instanceof REGLFramebuffer) {
          return fbo
        }
      }
      return null
    },
    poll: poll,
    create: createFBO,
    clear: clearCache,
    refresh: refreshCache
  }
}

},{"./check":4,"./values":31}],17:[function(require,module,exports){
var isTypedArray = require('./is-typed-array')

module.exports = function isNDArrayLike (obj) {
  return (
    typeof obj === 'object' &&
    Array.isArray(obj.shape) &&
    Array.isArray(obj.stride) &&
    typeof obj.offset === 'number' &&
    obj.shape.length === obj.stride.length &&
    (Array.isArray(obj.data) ||
      isTypedArray(obj.data)))
}

},{"./is-typed-array":18}],18:[function(require,module,exports){
var dtypes = require('./constants/arraytypes.json')
module.exports = function (x) {
  return Object.prototype.toString.call(x) in dtypes
}

},{"./constants/arraytypes.json":8}],19:[function(require,module,exports){
var GL_SUBPIXEL_BITS = 0x0D50
var GL_RED_BITS = 0x0D52
var GL_GREEN_BITS = 0x0D53
var GL_BLUE_BITS = 0x0D54
var GL_ALPHA_BITS = 0x0D55
var GL_DEPTH_BITS = 0x0D56
var GL_STENCIL_BITS = 0x0D57

var GL_ALIASED_POINT_SIZE_RANGE = 0x846D
var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E

var GL_MAX_TEXTURE_SIZE = 0x0D33
var GL_MAX_VIEWPORT_DIMS = 0x0D3A
var GL_MAX_VERTEX_ATTRIBS = 0x8869
var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB
var GL_MAX_VARYING_VECTORS = 0x8DFC
var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D
var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C
var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872
var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD
var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C
var GL_MAX_RENDERBUFFER_SIZE = 0x84E8

var GL_VENDOR = 0x1F00
var GL_RENDERER = 0x1F01
var GL_VERSION = 0x1F02
var GL_SHADING_LANGUAGE_VERSION = 0x8B8C

var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF

var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF
var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824

module.exports = function (gl, extensions) {
  var maxAnisotropic = 1
  if (extensions.ext_texture_filter_anisotropic) {
    maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT)
  }

  var maxDrawbuffers = 1
  var maxColorAttachments = 1
  if (extensions.webgl_draw_buffers) {
    maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL)
    maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL)
  }

  return {
    // drawing buffer bit depth
    colorBits: [
      gl.getParameter(GL_RED_BITS),
      gl.getParameter(GL_GREEN_BITS),
      gl.getParameter(GL_BLUE_BITS),
      gl.getParameter(GL_ALPHA_BITS)
    ],
    depthBits: gl.getParameter(GL_DEPTH_BITS),
    stencilBits: gl.getParameter(GL_STENCIL_BITS),
    subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

    // supported extensions
    extensions: Object.keys(extensions).filter(function (ext) {
      return !!extensions[ext]
    }),

    // max aniso samples
    maxAnisotropic: maxAnisotropic,

    // max draw buffers
    maxDrawbuffers: maxDrawbuffers,
    maxColorAttachments: maxColorAttachments,

    // point and line size ranges
    pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
    lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
    maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
    maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
    maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
    maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
    maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
    maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
    maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
    maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
    maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
    maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

    // vendor info
    glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
    renderer: gl.getParameter(GL_RENDERER),
    vendor: gl.getParameter(GL_VENDOR),
    version: gl.getParameter(GL_VERSION)
  }
}

},{}],20:[function(require,module,exports){
/* globals document, Image, XMLHttpRequest */

module.exports = loadTexture

function getExtension (url) {
  var parts = /\.(\w+)(\?.*)?$/.exec(url)
  if (parts && parts[1]) {
    return parts[1].toLowerCase()
  }
}

function isVideoExtension (url) {
  return [
    'avi',
    'asf',
    'gifv',
    'mov',
    'qt',
    'yuv',
    'mpg',
    'mpeg',
    'm2v',
    'mp4',
    'm4p',
    'm4v',
    'ogg',
    'ogv',
    'vob',
    'webm',
    'wmv'
  ].indexOf(url) >= 0
}

function isCompressedExtension (url) {
  return [
    'dds'
  ].indexOf(url) >= 0
}

function loadVideo (url, crossOrigin) {
  var video = document.createElement('video')
  video.autoplay = true
  video.loop = true
  if (crossOrigin) {
    video.crossOrigin = crossOrigin
  }
  video.src = url
  return video
}

function loadCompressedTexture (url, ext, crossOrigin) {
  var xhr = new XMLHttpRequest()
  xhr.responseType = 'arraybuffer'
  xhr.open('GET', url, true)
  xhr.send()
  return xhr
}

function loadImage (url, crossOrigin) {
  var image = new Image()
  if (crossOrigin) {
    image.crossOrigin = crossOrigin
  }
  image.src = url
  return image
}

// Currently this stuff only works in a DOM environment
function loadTexture (url, crossOrigin) {
  if (typeof document !== 'undefined') {
    var ext = getExtension(url)
    if (isVideoExtension(ext)) {
      return loadVideo(url, crossOrigin)
    }
    if (isCompressedExtension(ext)) {
      return loadCompressedTexture(url, ext, crossOrigin)
    }
    return loadImage(url, crossOrigin)
  }
  return null
}

},{}],21:[function(require,module,exports){
// References:
//
// http://msdn.microsoft.com/en-us/library/bb943991.aspx/
// http://blog.tojicode.com/2011/12/compressed-textures-in-webgl.html
//
var check = require('./check')

module.exports = parseDDS

var DDS_MAGIC = 0x20534444

var GL_TEXTURE_2D = 0x0DE1
var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515

var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0
var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1
var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2
var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3

var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64

var GL_UNSIGNED_BYTE = 0x1401
// var GL_HALF_FLOAT_OES = 0x8D61
// var GL_FLOAT = 0x1406

var DDSD_MIPMAPCOUNT = 0x20000

var DDSCAPS2_CUBEMAP = 0x200
var DDSCAPS2_CUBEMAP_POSITIVEX = 0x400
var DDSCAPS2_CUBEMAP_NEGATIVEX = 0x800
var DDSCAPS2_CUBEMAP_POSITIVEY = 0x1000
var DDSCAPS2_CUBEMAP_NEGATIVEY = 0x2000
var DDSCAPS2_CUBEMAP_POSITIVEZ = 0x4000
var DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x8000

var CUBEMAP_COMPLETE_FACES = (
  DDSCAPS2_CUBEMAP_POSITIVEX |
  DDSCAPS2_CUBEMAP_NEGATIVEX |
  DDSCAPS2_CUBEMAP_POSITIVEY |
  DDSCAPS2_CUBEMAP_NEGATIVEY |
  DDSCAPS2_CUBEMAP_POSITIVEZ |
  DDSCAPS2_CUBEMAP_NEGATIVEZ)

var DDPF_FOURCC = 0x4
var DDPF_RGB = 0x40

var FOURCC_DXT1 = 0x31545844
var FOURCC_DXT3 = 0x33545844
var FOURCC_DXT5 = 0x35545844
var FOURCC_ETC1 = 0x31435445

// DDS_HEADER {
var OFF_SIZE = 1        // int32 dwSize
var OFF_FLAGS = 2       // int32 dwFlags
var OFF_HEIGHT = 3      // int32 dwHeight
var OFF_WIDTH = 4       // int32 dwWidth
// var OFF_PITCH = 5       // int32 dwPitchOrLinearSize
// var OFF_DEPTH = 6       // int32 dwDepth
var OFF_MIPMAP = 7      // int32 dwMipMapCount; // offset: 7
// int32[11] dwReserved1
// DDS_PIXELFORMAT {
// var OFF_PF_SIZE = 19    // int32 dwSize; // offset: 19
var OFF_PF_FLAGS = 20   // int32 dwFlags
var OFF_FOURCC = 21     // char[4] dwFourCC
// var OFF_RGBA_BITS = 22  // int32 dwRGBBitCount
// var OFF_RED_MASK = 23   // int32 dwRBitMask
// var OFF_GREEN_MASK = 24 // int32 dwGBitMask
// var OFF_BLUE_MASK = 25  // int32 dwBBitMask
// var OFF_ALPHA_MASK = 26 // int32 dwABitMask; // offset: 26
// }
// var OFF_CAPS = 27       // int32 dwCaps; // offset: 27
var OFF_CAPS2 = 28      // int32 dwCaps2
// var OFF_CAPS3 = 29      // int32 dwCaps3
// var OFF_CAPS4 = 30      // int32 dwCaps4
// int32 dwReserved2 // offset 31

function parseDDS (arrayBuffer) {
  var header = new Int32Array(arrayBuffer)
  check(header[0] === DDS_MAGIC,
    'invalid magic number for dds header')

  var flags = header[OFF_FLAGS]
  check(flags & DDPF_FOURCC,
    'unsupported dds format')

  var width = header[OFF_WIDTH]
  var height = header[OFF_HEIGHT]

  var type = GL_UNSIGNED_BYTE
  var format = 0
  var blockBytes = 0
  var channels = 4
  switch (header[OFF_FOURCC]) {
    case FOURCC_DXT1:
      blockBytes = 8
      if (flags & DDPF_RGB) {
        channels = 3
        format = GL_COMPRESSED_RGB_S3TC_DXT1_EXT
      } else {
        format = GL_COMPRESSED_RGBA_S3TC_DXT1_EXT
      }
      break

    case FOURCC_DXT3:
      blockBytes = 16
      format = GL_COMPRESSED_RGBA_S3TC_DXT3_EXT
      break

    case FOURCC_DXT5:
      blockBytes = 16
      format = GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
      break

    case FOURCC_ETC1:
      blockBytes = 8
      format = GL_COMPRESSED_RGB_ETC1_WEBGL
      break

    // TODO: Implement hdr and uncompressed textures

    default:
      // Handle uncompressed data here
      check.raise('unsupported dds texture format')
  }

  var pixelFlags = header[OFF_PF_FLAGS]

  var mipmapCount = 1
  if (pixelFlags & DDSD_MIPMAPCOUNT) {
    mipmapCount = Math.max(1, header[OFF_MIPMAP])
  }

  var ptr = header[OFF_SIZE] + 4

  var result = {
    width: width,
    height: height,
    channels: channels,
    format: format,
    type: type,
    compressed: true,
    cube: false,
    pixels: []
  }

  function parseMips (target) {
    var mipWidth = width
    var mipHeight = height

    for (var i = 0; i < mipmapCount; ++i) {
      var size =
        Math.max(1, (mipWidth + 3) >> 2) *
        Math.max(1, (mipHeight + 3) >> 2) *
        blockBytes
      result.pixels.push({
        target: target,
        miplevel: i,
        width: mipWidth,
        height: mipHeight,
        data: new Uint8Array(arrayBuffer, ptr, size)
      })
      ptr += size
      mipWidth >>= 1
      mipHeight >>= 1
    }
  }

  var caps2 = header[OFF_CAPS2]
  var cubemap = !!(caps2 & DDSCAPS2_CUBEMAP)
  if (cubemap) {
    check(
      (caps2 & CUBEMAP_COMPLETE_FACES) === CUBEMAP_COMPLETE_FACES,
      'missing cubemap faces')
    result.cube = true
    for (var i = 0; i < 6; ++i) {
      parseMips(GL_TEXTURE_CUBE_MAP_POSITIVE_X + i)
    }
  } else {
    parseMips(GL_TEXTURE_2D)
  }

  return result
}

},{"./check":4}],22:[function(require,module,exports){
/* globals requestAnimationFrame, cancelAnimationFrame */
if (typeof requestAnimationFrame === 'function' &&
    typeof cancelAnimationFrame === 'function') {
  module.exports = {
    next: function (x) { return requestAnimationFrame(x) },
    cancel: function (x) { return cancelAnimationFrame(x) }
  }
} else {
  module.exports = {
    next: function (cb) {
      setTimeout(cb, 30)
    },
    cancel: clearTimeout
  }
}

},{}],23:[function(require,module,exports){
var check = require('./check')
var isTypedArray = require('./is-typed-array')

var GL_RGBA = 6408
var GL_UNSIGNED_BYTE = 5121
var GL_PACK_ALIGNMENT = 0x0D05

module.exports = function wrapReadPixels (gl, reglPoll, viewportState) {
  function readPixels (input) {
    var options = input || {}
    if (isTypedArray(input)) {
      options = {
        data: options
      }
    } else if (arguments.length === 2) {
      options = {
        width: arguments[0] | 0,
        height: arguments[1] | 0
      }
    } else if (typeof input !== 'object') {
      options = {}
    }

    // Update WebGL state
    reglPoll()

    // Read viewport state
    var x = options.x || 0
    var y = options.y || 0
    var width = options.width || viewportState.width
    var height = options.height || viewportState.height

    // Compute size
    var size = width * height * 4

    // Allocate data
    var data = options.data || new Uint8Array(size)

    // Type check
    check.isTypedArray(data)
    check(data.byteLength >= size, 'data buffer too small')

    // Run read pixels
    gl.pixelStorei(GL_PACK_ALIGNMENT, 4)
    gl.readPixels(x, y, width, height, GL_RGBA, GL_UNSIGNED_BYTE, data)

    return data
  }

  return readPixels
}

},{"./check":4,"./is-typed-array":18}],24:[function(require,module,exports){
var check = require('./check')
var values = require('./values')

var GL_RENDERBUFFER = 0x8D41

var GL_RGBA4 = 0x8056
var GL_RGB5_A1 = 0x8057
var GL_RGB565 = 0x8D62
var GL_DEPTH_COMPONENT16 = 0x81A5
var GL_STENCIL_INDEX8 = 0x8D48
var GL_DEPTH_STENCIL = 0x84F9

var GL_SRGB8_ALPHA8_EXT = 0x8C43

var GL_RGBA32F_EXT = 0x8814

var GL_RGBA16F_EXT = 0x881A
var GL_RGB16F_EXT = 0x881B

module.exports = function (gl, extensions, limits) {
  var formatTypes = {
    'rgba4': GL_RGBA4,
    'rgb565': GL_RGB565,
    'rgb5 a1': GL_RGB5_A1,
    'depth': GL_DEPTH_COMPONENT16,
    'stencil': GL_STENCIL_INDEX8,
    'depth stencil': GL_DEPTH_STENCIL
  }

  if (extensions.ext_srgb) {
    formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT
  }

  if (extensions.ext_color_buffer_half_float) {
    formatTypes['rgba16f'] = GL_RGBA16F_EXT
    formatTypes['rgb16f'] = GL_RGB16F_EXT
  }

  if (extensions.webgl_color_buffer_float) {
    formatTypes['rgba32f'] = GL_RGBA32F_EXT
  }

  var renderbufferCount = 0
  var renderbufferSet = {}

  function REGLRenderbuffer () {
    this.id = renderbufferCount++
    this.refCount = 1

    this.renderbuffer = null

    this.format = GL_RGBA4
    this.width = 0
    this.height = 0
  }

  REGLRenderbuffer.prototype.decRef = function () {
    if (--this.refCount === 0) {
      destroy(this)
    }
  }

  function refresh (rb) {
    if (!gl.isRenderbuffer(rb.renderbuffer)) {
      rb.renderbuffer = gl.createRenderbuffer()
    }
    gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer)
    gl.renderbufferStorage(
      GL_RENDERBUFFER,
      rb.format,
      rb.width,
      rb.height)
  }

  function destroy (rb) {
    var handle = rb.renderbuffer
    check(handle, 'must not double destroy renderbuffer')
    gl.bindRenderbuffer(GL_RENDERBUFFER, null)
    if (gl.isRenderbuffer(handle)) {
      gl.deleteRenderbuffer(handle)
    }
    rb.renderbuffer = null
    rb.refCount = 0
    delete renderbufferSet[rb.id]
  }

  function createRenderbuffer (input) {
    var renderbuffer = new REGLRenderbuffer()
    renderbufferSet[renderbuffer.id] = renderbuffer

    function reglRenderbuffer (input) {
      var options = input || {}

      var w = 0
      var h = 0
      if ('shape' in options) {
        var shape = options.shape
        check(Array.isArray(shape) && shape.length >= 2,
          'invalid renderbuffer shape')
        w = shape[0] | 0
        h = shape[1] | 0
      } else {
        if ('radius' in options) {
          w = h = options.radius | 0
        }
        if ('width' in options) {
          w = options.width | 0
        }
        if ('height' in options) {
          h = options.height | 0
        }
      }
      var s = limits.maxRenderbufferSize
      check(w >= 0 && h >= 0 && w <= s && h <= s,
        'invalid renderbuffer size')
      reglRenderbuffer.width = renderbuffer.width = Math.max(w, 1)
      reglRenderbuffer.height = renderbuffer.height = Math.max(h, 1)

      renderbuffer.format = GL_RGBA4
      if ('format' in options) {
        var format = options.format
        check.parameter(format, formatTypes, 'invalid render buffer format')
        renderbuffer.format = formatTypes[format]
      }

      refresh(renderbuffer)

      return reglRenderbuffer
    }

    reglRenderbuffer(input)

    Object.assign(reglRenderbuffer, {
      _reglType: 'renderbuffer',
      _renderbuffer: renderbuffer,
      destroy: function () {
        renderbuffer.decRef()
      }
    })

    return reglRenderbuffer
  }

  function refreshRenderbuffers () {
    values(renderbufferSet).forEach(refresh)
  }

  function destroyRenderbuffers () {
    values(renderbufferSet).forEach(destroy)
  }

  return {
    create: createRenderbuffer,
    refresh: refreshRenderbuffers,
    clear: destroyRenderbuffers
  }
}

},{"./check":4,"./values":31}],25:[function(require,module,exports){
var check = require('./check')

var DEFAULT_FRAG_SHADER = 'void main(){gl_FragColor=vec4(0,0,0,0);}'
var DEFAULT_VERT_SHADER = 'void main(){gl_Position=vec4(0,0,0,0);}'

var GL_FRAGMENT_SHADER = 35632
var GL_VERTEX_SHADER = 35633

function ActiveInfo (name, location, info) {
  this.name = name
  this.location = location
  this.info = info
}

module.exports = function wrapShaderState (
  gl,
  attributeState,
  uniformState,
  compileShaderDraw) {
  // ===================================================
  // glsl compilation and linking
  // ===================================================
  var shaders = {}

  var fragShaders = [DEFAULT_FRAG_SHADER]
  var vertShaders = [DEFAULT_VERT_SHADER]

  function getShader (type, source) {
    var cache = shaders[type]
    var shader = cache[source]

    if (!shader) {
      shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var errLog = gl.getShaderInfoLog(shader)
        check.raise('Error compiling shader:\n' + errLog)
      }
      cache[source] = shader
    }

    return shader
  }

  function refreshShaders () {
    shaders[GL_FRAGMENT_SHADER] = {}
    shaders[GL_VERTEX_SHADER] = {}
  }

  function clearShaders () {
    Object.keys(shaders).forEach(function (type) {
      Object.keys(shaders[type]).forEach(function (shader) {
        gl.deleteShader(shaders[type][shader])
      })
    })
    shaders[GL_FRAGMENT_SHADER] = {}
    shaders[GL_VERTEX_SHADER] = {}
  }

  // ===================================================
  // program linking
  // ===================================================
  var programCache = {}
  var programList = []

  function REGLProgram (fragSrc, vertSrc) {
    this.fragSrc = fragSrc
    this.vertSrc = vertSrc
    this.program = null
    this.uniforms = []
    this.attributes = []
    this.draw = function () {}
    this.batchCache = {}
  }

  Object.assign(REGLProgram.prototype, {
    link: function () {
      var i, info

      // -------------------------------
      // compile & link
      // -------------------------------
      var fragShader = getShader(gl.FRAGMENT_SHADER, this.fragSrc)
      var vertShader = getShader(gl.VERTEX_SHADER, this.vertSrc)

      var program = this.program = gl.createProgram()
      gl.attachShader(program, fragShader)
      gl.attachShader(program, vertShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var errLog = gl.getProgramInfoLog(program)
        check.raise('Error linking program:\n' + errLog)
      }

      // -------------------------------
      // grab uniforms
      // -------------------------------
      var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
      var uniforms = this.uniforms = []
      for (i = 0; i < numUniforms; ++i) {
        info = gl.getActiveUniform(program, i)
        if (info) {
          if (info.size > 1) {
            for (var j = 0; j < info.size; ++j) {
              var name = info.name.replace('[0]', '[' + j + ']')
              uniforms.push(new ActiveInfo(
                name,
                gl.getUniformLocation(program, name),
                info))
              uniformState.def(name)
            }
          } else {
            uniforms.push(new ActiveInfo(
              info.name,
              gl.getUniformLocation(program, info.name),
              info))
            uniformState.def(info.name)
          }
        }
      }

      // -------------------------------
      // grab attributes
      // -------------------------------
      var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
      var attributes = this.attributes = []
      for (i = 0; i < numAttributes; ++i) {
        info = gl.getActiveAttrib(program, i)
        if (info) {
          attributes.push(new ActiveInfo(
            info.name,
            gl.getAttribLocation(program, info.name),
            info))
          attributeState.def(info.name)
        }
      }

      // -------------------------------
      // clear cached rendering methods
      // -------------------------------
      this.draw = compileShaderDraw(this)
      this.batchCache = {}
    },

    destroy: function () {
      gl.deleteProgram(this.program)
    }
  })

  function getProgram (vertSource, fragSource) {
    var cache = programCache[fragSource]
    if (!cache) {
      cache = programCache[fragSource] = {}
    }
    var program = cache[vertSource]
    if (!program) {
      program = new REGLProgram(fragSource, vertSource)
      program.link()
      cache[vertSource] = program
      programList.push(program)
    }
    return program
  }

  function clearPrograms () {
    programList.forEach(function (program) {
      program.destroy()
    })
    programList.length = 0
    programCache = {}
  }

  function refreshPrograms () {
    programList.forEach(function (program) {
      program.link()
    })
  }

  // ===================================================
  // program state
  // ===================================================
  var programState = [null]

  // ===================================================
  // context management
  // ===================================================
  function clear () {
    clearShaders()
    clearPrograms()
  }

  function refresh () {
    refreshShaders()
    refreshPrograms()
  }

  // We call clear once to initialize all data structures
  clear()

  return {
    create: getProgram,
    clear: clear,
    refresh: refresh,
    programs: programState,
    fragShaders: fragShaders,
    vertShaders: vertShaders
  }
}

},{"./check":4}],26:[function(require,module,exports){
// A stack for managing the state of a scalar/vector parameter

module.exports = function createStack (init, onChange) {
  var n = init.length
  var stack = init.slice()
  var current = init.slice()
  var dirty = false
  var forceDirty = true

  function poll () {
    var ptr = stack.length - n
    if (dirty || forceDirty) {
      switch (n) {
        case 1:
          onChange(stack[ptr])
          break
        case 2:
          onChange(stack[ptr], stack[ptr + 1])
          break
        case 3:
          onChange(stack[ptr], stack[ptr + 1], stack[ptr + 2])
          break
        case 4:
          onChange(stack[ptr], stack[ptr + 1], stack[ptr + 2], stack[ptr + 3])
          break
        case 5:
          onChange(stack[ptr], stack[ptr + 1], stack[ptr + 2], stack[ptr + 3], stack[ptr + 4])
          break
        case 6:
          onChange(stack[ptr], stack[ptr + 1], stack[ptr + 2], stack[ptr + 3], stack[ptr + 4], stack[ptr + 5])
          break
        default:
          onChange.apply(null, stack.slice(ptr, stack.length))
      }
      for (var i = 0; i < n; ++i) {
        current[i] = stack[ptr + i]
      }
      forceDirty = dirty = false
    }
  }

  return {
    push: function () {
      dirty = false
      for (var i = 0; i < n; ++i) {
        var x = arguments[i]
        dirty = dirty || (x !== current[i])
        stack.push(x)
      }
    },

    pop: function () {
      dirty = false
      stack.length -= n
      for (var i = 0; i < n; ++i) {
        dirty = dirty || (stack[stack.length - n + i] !== current[i])
      }
    },

    poll: poll,

    setDirty: function () {
      forceDirty = true
    }
  }
}

},{}],27:[function(require,module,exports){
var createStack = require('./stack')
var createEnvironment = require('./codegen')

// WebGL constants
var GL_CULL_FACE = 0x0B44
var GL_BLEND = 0x0BE2
var GL_DITHER = 0x0BD0
var GL_STENCIL_TEST = 0x0B90
var GL_DEPTH_TEST = 0x0B71
var GL_SCISSOR_TEST = 0x0C11
var GL_POLYGON_OFFSET_FILL = 0x8037
var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E
var GL_SAMPLE_COVERAGE = 0x80A0
var GL_FUNC_ADD = 0x8006
var GL_ZERO = 0
var GL_ONE = 1
var GL_FRONT = 1028
var GL_BACK = 1029
var GL_LESS = 513
var GL_CCW = 2305
var GL_ALWAYS = 519
var GL_KEEP = 7680

module.exports = function wrapContextState (gl, framebufferState, viewportState) {
  function capStack (cap, dflt) {
    var result = createStack([!!dflt], function (flag) {
      if (flag) {
        gl.enable(cap)
      } else {
        gl.disable(cap)
      }
    })
    result.flag = cap
    return result
  }

  // Caps, flags and other random WebGL context state
  var contextState = {
    // Dithering
    'dither': capStack(GL_DITHER),

    // Blending
    'blend.enable': capStack(GL_BLEND),
    'blend.color': createStack([0, 0, 0, 0], function (r, g, b, a) {
      gl.blendColor(r, g, b, a)
    }),
    'blend.equation': createStack([GL_FUNC_ADD, GL_FUNC_ADD], function (rgb, a) {
      gl.blendEquationSeparate(rgb, a)
    }),
    'blend.func': createStack([
      GL_ONE, GL_ZERO, GL_ONE, GL_ZERO
    ], function (srcRGB, dstRGB, srcAlpha, dstAlpha) {
      gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha)
    }),

    // Depth
    'depth.enable': capStack(GL_DEPTH_TEST, true),
    'depth.func': createStack([GL_LESS], function (func) {
      gl.depthFunc(func)
    }),
    'depth.range': createStack([0, 1], function (near, far) {
      gl.depthRange(near, far)
    }),
    'depth.mask': createStack([true], function (m) {
      gl.depthMask(m)
    }),

    // Face culling
    'cull.enable': capStack(GL_CULL_FACE),
    'cull.face': createStack([GL_BACK], function (mode) {
      gl.cullFace(mode)
    }),

    // Front face orientation
    'frontFace': createStack([GL_CCW], function (mode) {
      gl.frontFace(mode)
    }),

    // Write masks
    'colorMask': createStack([true, true, true, true], function (r, g, b, a) {
      gl.colorMask(r, g, b, a)
    }),

    // Line width
    'lineWidth': createStack([1], function (w) {
      gl.lineWidth(w)
    }),

    // Polygon offset
    'polygonOffset.enable': capStack(GL_POLYGON_OFFSET_FILL),
    'polygonOffset.offset': createStack([0, 0], function (factor, units) {
      gl.polygonOffset(factor, units)
    }),

    // Sample coverage
    'sample.alpha': capStack(GL_SAMPLE_ALPHA_TO_COVERAGE),
    'sample.enable': capStack(GL_SAMPLE_COVERAGE),
    'sample.coverage': createStack([1, false], function (value, invert) {
      gl.sampleCoverage(value, invert)
    }),

    // Stencil
    'stencil.enable': capStack(GL_STENCIL_TEST),
    'stencil.mask': createStack([-1], function (mask) {
      gl.stencilMask(mask)
    }),
    'stencil.func': createStack([
      GL_ALWAYS, 0, -1
    ], function (func, ref, mask) {
      gl.stencilFunc(func, ref, mask)
    }),
    'stencil.opFront': createStack([
      GL_KEEP, GL_KEEP, GL_KEEP
    ], function (fail, zfail, pass) {
      gl.stencilOpSeparate(GL_FRONT, fail, zfail, pass)
    }),
    'stencil.opBack': createStack([
      GL_KEEP, GL_KEEP, GL_KEEP
    ], function (fail, zfail, pass) {
      gl.stencilOpSeparate(GL_BACK, fail, zfail, pass)
    }),

    // Scissor
    'scissor.enable': capStack(GL_SCISSOR_TEST),
    'scissor.box': createStack([0, 0, -1, -1], function (x, y, w, h) {
      var w_ = w
      var fbo = framebufferState.top()
      if (w < 0) {
        if (fbo) {
          w_ = fbo.width - x
        } else {
          w_ = gl.drawingBufferWidth - x
        }
      }
      var h_ = h
      if (h < 0) {
        if (fbo) {
          h_ = fbo.height - y
        } else {
          h_ = gl.drawingBufferHeight - y
        }
      }
      gl.scissor(x, y, w_, h_)
    }),

    // Viewport
    'viewport': createStack([0, 0, -1, -1], function (x, y, w, h) {
      var w_ = w
      var fbo = framebufferState.top()
      if (w < 0) {
        if (fbo) {
          w_ = fbo.width - x
        } else {
          w_ = gl.drawingBufferWidth - x
        }
      }
      var h_ = h
      if (h < 0) {
        if (fbo) {
          h_ = fbo.height - y
        } else {
          h_ = gl.drawingBufferHeight - y
        }
      }
      gl.viewport(x, y, w_, h_)
      viewportState.width = w_
      viewportState.height = h_
    })
  }

  var env = createEnvironment()
  var poll = env.proc('poll')
  var refresh = env.proc('refresh')
  Object.keys(contextState).forEach(function (prop) {
    var STACK = env.link(contextState[prop])
    poll(STACK, '.poll();')
    refresh(STACK, '.setDirty();')
  })

  var procs = env.compile()

  return {
    contextState: contextState,
    viewport: viewportState,
    poll: procs.poll,
    refresh: procs.refresh,

    notifyViewportChanged: function () {
      contextState.viewport.setDirty()
      contextState['scissor.box'].setDirty()
    }
  }
}

},{"./codegen":6,"./stack":26}],28:[function(require,module,exports){
var check = require('./check')
var values = require('./values')
var isTypedArray = require('./is-typed-array')
var isNDArrayLike = require('./is-ndarray')
var loadTexture = require('./load-texture')
var convertToHalfFloat = require('./to-half-float')
var parseDDS = require('./parse-dds')

var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3

var GL_TEXTURE_2D = 0x0DE1
var GL_TEXTURE_CUBE_MAP = 0x8513
var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515

var GL_RGBA = 0x1908
var GL_ALPHA = 0x1906
var GL_RGB = 0x1907
var GL_LUMINANCE = 0x1909
var GL_LUMINANCE_ALPHA = 0x190A

var GL_RGBA4 = 0x8056
var GL_RGB5_A1 = 0x8057
var GL_RGB565 = 0x8D62

var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033
var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034
var GL_UNSIGNED_SHORT_5_6_5 = 0x8363
var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA

var GL_DEPTH_COMPONENT = 0x1902
var GL_DEPTH_STENCIL = 0x84F9

var GL_SRGB_EXT = 0x8C40
var GL_SRGB_ALPHA_EXT = 0x8C42

var GL_HALF_FLOAT_OES = 0x8D61

var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0
var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1
var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2
var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3

var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92
var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93
var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE

var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00
var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01
var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02
var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03

var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64

var GL_UNSIGNED_BYTE = 0x1401
var GL_UNSIGNED_SHORT = 0x1403
var GL_UNSIGNED_INT = 0x1405
var GL_FLOAT = 0x1406

var GL_TEXTURE_WRAP_S = 0x2802
var GL_TEXTURE_WRAP_T = 0x2803

var GL_REPEAT = 0x2901
var GL_CLAMP_TO_EDGE = 0x812F
var GL_MIRRORED_REPEAT = 0x8370

var GL_TEXTURE_MAG_FILTER = 0x2800
var GL_TEXTURE_MIN_FILTER = 0x2801

var GL_NEAREST = 0x2600
var GL_LINEAR = 0x2601
var GL_NEAREST_MIPMAP_NEAREST = 0x2700
var GL_LINEAR_MIPMAP_NEAREST = 0x2701
var GL_NEAREST_MIPMAP_LINEAR = 0x2702
var GL_LINEAR_MIPMAP_LINEAR = 0x2703

var GL_GENERATE_MIPMAP_HINT = 0x8192
var GL_DONT_CARE = 0x1100
var GL_FASTEST = 0x1101
var GL_NICEST = 0x1102

var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE

var GL_UNPACK_ALIGNMENT = 0x0CF5
var GL_UNPACK_FLIP_Y_WEBGL = 0x9240
var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241
var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243

var GL_BROWSER_DEFAULT_WEBGL = 0x9244

var GL_TEXTURE0 = 0x84C0

var MIPMAP_FILTERS = [
  GL_NEAREST_MIPMAP_NEAREST,
  GL_NEAREST_MIPMAP_LINEAR,
  GL_LINEAR_MIPMAP_NEAREST,
  GL_LINEAR_MIPMAP_LINEAR
]

function isPow2 (v) {
  return !(v & (v - 1)) && (!!v)
}

function isNumericArray (arr) {
  return (
    Array.isArray(arr) &&
    (arr.length === 0 ||
    typeof arr[0] === 'number'))
}

function isRectArray (arr) {
  if (!Array.isArray(arr)) {
    return false
  }

  var width = arr.length
  if (width === 0 || !Array.isArray(arr[0])) {
    return false
  }

  var height = arr[0].length
  for (var i = 1; i < width; ++i) {
    if (!Array.isArray(arr[i]) || arr[i].length !== height) {
      return false
    }
  }
  return true
}

function classString (x) {
  return Object.prototype.toString.call(x)
}

function isCanvasElement (object) {
  return classString(object) === '[object HTMLCanvasElement]'
}

function isContext2D (object) {
  return classString(object) === '[object CanvasRenderingContext2D]'
}

function isImageElement (object) {
  return classString(object) === '[object HTMLImageElement]'
}

function isVideoElement (object) {
  return classString(object) === '[object HTMLVideoElement]'
}

function isPendingXHR (object) {
  return classString(object) === '[object XMLHttpRequest]'
}

function isPixelData (object) {
  return (
    typeof object === 'string' ||
    (!!object && (
      isTypedArray(object) ||
      isNumericArray(object) ||
      isNDArrayLike(object) ||
      isCanvasElement(object) ||
      isContext2D(object) ||
      isImageElement(object) ||
      isVideoElement(object) ||
      isRectArray(object))))
}

// Transpose an array of pixels
function transposePixels (data, nx, ny, nc, sx, sy, sc, off) {
  var result = new data.constructor(nx * ny * nc)
  var ptr = 0
  for (var i = 0; i < ny; ++i) {
    for (var j = 0; j < nx; ++j) {
      for (var k = 0; k < nc; ++k) {
        result[ptr++] = data[sy * i + sx * j + sc * k + off]
      }
    }
  }
  return result
}

module.exports = function createTextureSet (gl, extensions, limits, reglPoll, viewportState) {
  var mipmapHint = {
    "don't care": GL_DONT_CARE,
    'dont care': GL_DONT_CARE,
    'nice': GL_NICEST,
    'fast': GL_FASTEST
  }

  var wrapModes = {
    'repeat': GL_REPEAT,
    'clamp': GL_CLAMP_TO_EDGE,
    'mirror': GL_MIRRORED_REPEAT
  }

  var magFilters = {
    'nearest': GL_NEAREST,
    'linear': GL_LINEAR
  }

  var minFilters = Object.assign({
    'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST,
    'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST,
    'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR,
    'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR,
    'mipmap': GL_LINEAR_MIPMAP_LINEAR
  }, magFilters)

  var colorSpace = {
    'none': 0,
    'browser': GL_BROWSER_DEFAULT_WEBGL
  }

  var textureTypes = {
    'uint8': GL_UNSIGNED_BYTE,
    'rgba4': GL_UNSIGNED_SHORT_4_4_4_4,
    'rgb565': GL_UNSIGNED_SHORT_5_6_5,
    'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1
  }

  var textureFormats = {
    'alpha': GL_ALPHA,
    'luminance': GL_LUMINANCE,
    'luminance alpha': GL_LUMINANCE_ALPHA,
    'rgb': GL_RGB,
    'rgba': GL_RGBA,
    'rgba4': GL_RGBA4,
    'rgb5 a1': GL_RGB5_A1,
    'rgb565': GL_RGB565
  }

  var compressedTextureFormats = {}

  if (extensions.ext_srgb) {
    textureFormats.srgb = GL_SRGB_EXT
    textureFormats.srgba = GL_SRGB_ALPHA_EXT
  }

  if (extensions.oes_texture_float) {
    textureTypes.float = GL_FLOAT
  }

  if (extensions.oes_texture_half_float) {
    textureTypes['half float'] = GL_HALF_FLOAT_OES
  }

  if (extensions.webgl_depth_texture) {
    Object.assign(textureFormats, {
      'depth': GL_DEPTH_COMPONENT,
      'depth stencil': GL_DEPTH_STENCIL
    })

    Object.assign(textureTypes, {
      'uint16': GL_UNSIGNED_SHORT,
      'uint32': GL_UNSIGNED_INT,
      'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL
    })
  }

  if (extensions.webgl_compressed_texture_s3tc) {
    Object.assign(compressedTextureFormats, {
      'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
      'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
      'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
      'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
    })
  }

  if (extensions.webgl_compressed_texture_atc) {
    Object.assign(compressedTextureFormats, {
      'rgb arc': GL_COMPRESSED_RGB_ATC_WEBGL,
      'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
      'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
    })
  }

  if (extensions.webgl_compressed_texture_pvrtc) {
    Object.assign(compressedTextureFormats, {
      'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
      'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
      'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
      'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
    })
  }

  if (extensions.webgl_compressed_texture_etc1) {
    compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL
  }

  // Copy over all texture formats
  var supportedCompressedFormats = Array.prototype.slice.call(
    gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS))
  Object.keys(compressedTextureFormats).forEach(function (name) {
    var format = compressedTextureFormats[name]
    if (supportedCompressedFormats.indexOf(format) >= 0) {
      textureFormats[name] = format
    }
  })

  var supportedFormats = Object.keys(textureFormats)
  limits.textureFormats = supportedFormats

  var colorFormats = supportedFormats.reduce(function (color, key) {
    var glenum = textureFormats[key]
    if (glenum === GL_LUMINANCE ||
        glenum === GL_ALPHA ||
        glenum === GL_LUMINANCE ||
        glenum === GL_LUMINANCE_ALPHA ||
        glenum === GL_DEPTH_COMPONENT ||
        glenum === GL_DEPTH_STENCIL) {
      color[glenum] = glenum
    } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
      color[glenum] = GL_RGBA
    } else {
      color[glenum] = GL_RGB
    }
    return color
  }, {})

  // Pixel storage parsing
  function PixelInfo (target) {
    // tex target
    this.target = target

    // pixelStorei info
    this.flipY = false
    this.premultiplyAlpha = false
    this.unpackAlignment = 1
    this.colorSpace = 0

    // shape
    this.width = 0
    this.height = 0
    this.channels = 0

    // format and type
    this.format = 0
    this.internalformat = 0
    this.type = 0
    this.compressed = false

    // mip level
    this.miplevel = 0

    // ndarray-like parameters
    this.strideX = 0
    this.strideY = 0
    this.strideC = 0
    this.offset = 0

    // copy pixels info
    this.x = 0
    this.y = 0
    this.copy = false

    // data sources
    this.data = null
    this.image = null
    this.video = null
    this.canvas = null
    this.xhr = null

    // CORS
    this.crossOrigin = null

    // horrible state flags
    this.needsPoll = false
    this.needsListeners = false
  }

  Object.assign(PixelInfo.prototype, {
    parseFlags: function (options) {
      if (typeof options !== 'object' || !options) {
        return
      }

      if ('premultiplyAlpha' in options) {
        check.type(options.premultiplyAlpha, 'boolean',
          'invalid premultiplyAlpha')
        this.premultiplyAlpha = options.premultiplyAlpha
      }

      if ('flipY' in options) {
        check.type(options.flipY, 'boolean',
          'invalid texture flip')
        this.flipY = options.flipY
      }

      if ('alignment' in options) {
        check.oneOf(options.alignment, [1, 2, 4, 8],
          'invalid texture unpack alignment')
        this.unpackAlignment = options.alignment
      }

      if ('colorSpace' in options) {
        check.parameter(options.colorSpace, colorSpace,
          'invalid colorSpace')
        this.colorSpace = colorSpace[options.colorSpace]
      }

      if ('format' in options) {
        var format = options.format
        check.parameter(format, textureFormats,
          'invalid texture format')
        this.internalformat = textureFormats[format]
        if (format in textureTypes) {
          this.type = textureTypes[format]
        }
        if (format in compressedTextureFormats) {
          this.compressed = true
        }
      }

      if ('type' in options) {
        var type = options.type
        check.parameter(type, textureTypes,
          'invalid texture type')
        this.type = textureTypes[type]
      }

      var w = this.width
      var h = this.height
      var c = this.channels
      if ('shape' in options) {
        check(Array.isArray(options.shape) && options.shape.length >= 2,
          'shape must be an array')
        w = options.shape[0]
        h = options.shape[1]
        if (options.shape.length === 3) {
          c = options.shape[2]
        }
      } else {
        if ('radius' in options) {
          w = h = options.radius
        }
        if ('width' in options) {
          w = options.width
        }
        if ('height' in options) {
          h = options.height
        }
        if ('channels' in options) {
          c = options.channels
        }
      }
      this.width = w | 0
      this.height = h | 0
      this.channels = c | 0

      if ('stride' in options) {
        var stride = options.stride
        check(Array.isArray(stride) && stride.length >= 2,
          'invalid stride vector')
        this.strideX = stride[0]
        this.strideY = stride[1]
        if (stride.length === 3) {
          this.strideC = stride[2]
        } else {
          this.strideC = 1
        }
        this.needsTranspose = true
      } else {
        this.strideC = 1
        this.strideX = this.strideC * c
        this.strideY = this.strideX * w
      }

      if ('offset' in options) {
        this.offset = options.offset | 0
        this.needsTranspose = true
      }

      if ('crossOrigin' in options) {
        this.crossOrigin = options.crossOrigin
      }
    },
    parse: function (options, miplevel) {
      this.miplevel = miplevel
      this.width = this.width >> miplevel
      this.height = this.height >> miplevel

      var data = options
      switch (typeof options) {
        case 'string':
          break
        case 'object':
          if (!options) {
            return
          }
          this.parseFlags(options)
          if (isPixelData(options.data)) {
            data = options.data
          }
          break
        case 'undefined':
          return
        default:
          check.raise('invalid pixel data type')
      }

      if (typeof data === 'string') {
        data = loadTexture(data, this.crossOrigin)
      }

      var array = null
      var needsConvert = false

      if (this.compressed) {
        check(data instanceof Uint8Array || isPendingXHR(data),
          'compressed texture data must be stored in a uint8array')
      }

      if (data === null) {
        // TODO
      } else if (isTypedArray(data)) {
        this.data = data
      } else if (isNumericArray(data)) {
        array = data
        needsConvert = true
      } else if (isNDArrayLike(data)) {
        if (Array.isArray(data.data)) {
          array = data.data
          needsConvert = true
        } else {
          this.data = data.data
        }
        var shape = data.shape
        this.width = shape[0]
        this.height = shape[1]
        if (shape.length === 3) {
          this.channels = shape[2]
        } else {
          this.channels = 1
        }
        var stride = data.stride
        this.strideX = data.stride[0]
        this.strideY = data.stride[1]
        if (stride.length === 3) {
          this.strideC = data.stride[2]
        } else {
          this.strideC = 1
        }
        this.offset = data.offset
        this.needsTranspose = true
      } else if (isCanvasElement(data) || isContext2D(data)) {
        if (isCanvasElement(data)) {
          this.canvas = data
        } else {
          this.canvas = data.canvas
        }
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.setDefaultFormat()
      } else if (isImageElement(data)) {
        this.image = data
        if (!data.complete) {
          this.width = this.width || data.naturalWidth
          this.height = this.height || data.naturalHeight
          this.needsListeners = true
        } else {
          this.width = data.naturalWidth
          this.height = data.naturalHeight
        }
        this.setDefaultFormat()
      } else if (isVideoElement(data)) {
        this.video = data
        if (data.readyState > 1) {
          this.width = data.width
          this.height = data.height
        } else {
          this.width = this.width || data.width
          this.height = this.height || data.height
          this.needsListeners = true
        }
        this.needsPoll = true
        this.setDefaultFormat()
      } else if (isPendingXHR(data)) {
        this.xhr = data
        this.needsListeners = true
      } else if (isRectArray(data)) {
        var w = data.length
        var h = data[0].length
        var c = 1
        var i, j, k, p
        if (Array.isArray(data[0][0])) {
          c = data[0][0].length
          check(c >= 0 && c <= 4, 'invalid number of channels for image data')
          array = Array(w * h * c)
          p = 0
          for (j = 0; j < h; ++j) {
            for (i = 0; i < w; ++i) {
              for (k = 0; k < c; ++k) {
                array[p++] = data[i][j][k]
              }
            }
          }
        } else {
          array = Array(w * h)
          p = 0
          for (j = 0; j < h; ++j) {
            for (i = 0; i < w; ++i) {
              array[p++] = data[i][j]
            }
          }
        }
        this.width = w
        this.height = h
        this.channels = c
        needsConvert = true
      } else if (options.copy) {
        this.copy = true
        this.x = this.x | 0
        this.y = this.y | 0
        this.width = (this.width || viewportState.width) | 0
        this.height = (this.height || viewportState.height) | 0
        this.setDefaultFormat()
      }

      // Fix up missing type info for typed arrays
      if (!this.type && this.data) {
        if (this.format === GL_DEPTH_COMPONENT) {
          if (this.data instanceof Uint16Array) {
            this.type = GL_UNSIGNED_SHORT
          } else if (this.data instanceof Uint32Array) {
            this.type = GL_UNSIGNED_INT
          }
        } else if (this.data instanceof Float32Array) {
          this.type = GL_FLOAT
        }
      }

      // Infer default format
      if (!this.internalformat) {
        var channels = this.channels = this.channels || 4
        this.internalformat = [
          GL_LUMINANCE,
          GL_LUMINANCE_ALPHA,
          GL_RGB,
          GL_RGBA][channels - 1]
        check(this.internalformat, 'invalid number of channels')
      }

      var format = this.internalformat
      if (format === GL_DEPTH_COMPONENT || format === GL_DEPTH_STENCIL) {
        check(extensions.webgl_depth_texture,
          'depth/stencil texture not supported')
        if (format === GL_DEPTH_COMPONENT) {
          check(this.type === GL_UNSIGNED_SHORT || GL_UNSIGNED_INT,
            'depth texture type must be uint16 or uint32')
        }
        if (format === GL_DEPTH_STENCIL) {
          check(this.type === GL_UNSIGNED_INT_24_8_WEBGL,
            'depth stencil texture format must match type')
        }
        check(
          !this.data && !array && !this.image && !this.video && !this.canvas,
          'depth/stencil textures are for rendering only')
      }

      // Compute color format and number of channels
      var colorFormat = this.format = colorFormats[format]
      if (!this.channels) {
        switch (colorFormat) {
          case GL_LUMINANCE:
          case GL_ALPHA:
          case GL_DEPTH_COMPONENT:
            this.channels = 1
            break

          case GL_DEPTH_STENCIL:
          case GL_LUMINANCE_ALPHA:
            this.channels = 2
            break

          case GL_RGB:
            this.channels = 3
            break

          default:
            this.channels = 4
        }
      }

      // Check that texture type is supported
      var type = this.type
      if (type === GL_FLOAT) {
        check(extensions.oes_texture_float,
          'float texture not supported')
      } else if (type === GL_HALF_FLOAT_OES) {
        check(extensions.oes_texture_half_float,
          'half float texture not supported')
      } else if (!type) {
        if (format === GL_DEPTH_COMPONENT) {
          type = GL_UNSIGNED_INT
        } else {
          type = GL_UNSIGNED_BYTE
        }
      }
      this.type = type

      // apply conversion
      if (needsConvert) {
        switch (type) {
          case GL_UNSIGNED_BYTE:
            this.data = new Uint8Array(array)
            break
          case GL_UNSIGNED_SHORT:
            this.data = new Uint16Array(array)
            break
          case GL_UNSIGNED_INT:
            this.data = new Uint32Array(array)
            break
          case GL_FLOAT:
            this.data = new Float32Array(array)
            break
          case GL_HALF_FLOAT_OES:
            this.data = convertToHalfFloat(array)
            break

          case GL_UNSIGNED_SHORT_5_6_5:
          case GL_UNSIGNED_SHORT_5_5_5_1:
          case GL_UNSIGNED_SHORT_4_4_4_4:
          case GL_UNSIGNED_INT_24_8_WEBGL:
            check.raise('unsupported format for automatic conversion')
            break

          default:
            check.raise('unsupported type conversion')
        }
      }

      if (this.data) {
        // apply transpose
        if (this.needsTranspose) {
          this.data = transposePixels(
            this.data,
            this.width,
            this.height,
            this.channels,
            this.strideX,
            this.strideY,
            this.strideC,
            this.offset)
        }
        // check data type
        switch (type) {
          case GL_UNSIGNED_BYTE:
            check(this.data instanceof Uint8Array ||
                  this.data instanceof Uint8ClampedArray,
                  'incompatible pixel type')
            break
          case GL_UNSIGNED_SHORT_5_6_5:
          case GL_UNSIGNED_SHORT_5_5_5_1:
          case GL_UNSIGNED_SHORT_4_4_4_4:
          case GL_UNSIGNED_SHORT:
          case GL_HALF_FLOAT_OES:
            check(this.data instanceof Uint16Array,
                  'incompatible pixel type')
            break
          case GL_UNSIGNED_INT:
            check(this.data instanceof Uint32Array,
                  'incompatible pixel type')
            break

          case GL_FLOAT:
            check(this.data instanceof Float32Array,
                  'incompatible pixel type')
            break

          default:
            check.raise('bad or missing pixel type')
        }
      }

      this.needsTranspose = false
    },

    setDefaultFormat: function () {
      this.format = this.internalformat = GL_RGBA
      this.type = GL_UNSIGNED_BYTE
      this.channels = 4
      this.compressed = false
    },

    upload: function (params) {
      gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, this.flipY)
      gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha)
      gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, this.colorSpace)
      gl.pixelStorei(GL_UNPACK_ALIGNMENT, this.unpackAlignment)

      var target = this.target
      var miplevel = this.miplevel
      var image = this.image
      var canvas = this.canvas
      var video = this.video
      var data = this.data
      var internalformat = this.internalformat
      var format = this.format
      var type = this.type
      var width = this.width || Math.max(1, params.width >> miplevel)
      var height = this.height || Math.max(1, params.height >> miplevel)
      if (video && video.readyState > 2) {
        gl.texImage2D(target, miplevel, format, format, type, video)
      } else if (image && image.complete) {
        gl.texImage2D(target, miplevel, format, format, type, image)
      } else if (canvas) {
        gl.texImage2D(target, miplevel, format, format, type, canvas)
      } else if (this.compressed) {
        gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data)
      } else if (this.copy) {
        reglPoll()
        gl.copyTexImage2D(target, miplevel, format, this.x, this.y, width, height, 0)
      } else if (data) {
        gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data)
      } else {
        gl.texImage2D(target, miplevel, format, width || 1, height || 1, 0, format, type, null)
      }
    }
  })

  function TexParams (target) {
    this.target = target

    // Default image shape info
    this.width = 0
    this.height = 0
    this.format = 0
    this.internalformat = 0
    this.type = 0

    // wrap mode
    this.wrapS = GL_CLAMP_TO_EDGE
    this.wrapT = GL_CLAMP_TO_EDGE

    // filtering
    this.minFilter = 0
    this.magFilter = GL_NEAREST
    this.anisotropic = 1

    // mipmaps
    this.genMipmaps = false
    this.mipmapHint = GL_DONT_CARE
  }

  Object.assign(TexParams.prototype, {
    parse: function (options) {
      if (typeof options !== 'object' || !options) {
        return
      }

      if ('min' in options) {
        var minFilter = options.min
        check.parameter(minFilter, minFilters)
        this.minFilter = minFilters[minFilter]
      }

      if ('mag' in options) {
        var magFilter = options.mag
        check.parameter(magFilter, magFilters)
        this.magFilter = magFilters[magFilter]
      }

      var wrapS = this.wrapS
      var wrapT = this.wrapT
      if ('wrap' in options) {
        var wrap = options.wrap
        if (typeof wrap === 'string') {
          check.parameter(wrap, wrapModes)
          wrapS = wrapT = wrapModes[wrap]
        } else if (Array.isArray(wrap)) {
          check.parameter(wrap[0], wrapModes)
          check.parameter(wrap[1], wrapModes)
          wrapS = wrapModes[wrap[0]]
          wrapT = wrapModes[wrap[1]]
        }
      } else {
        if ('wrapS' in options) {
          var optWrapS = options.wrapS
          check.parameter(optWrapS, wrapModes)
          wrapS = wrapModes[optWrapS]
        }
        if ('wrapT' in options) {
          var optWrapT = options.wrapT
          check.parameter(optWrapT, wrapModes)
          wrapT = wrapModes[optWrapT]
        }
      }
      this.wrapS = wrapS
      this.wrapT = wrapT

      if ('anisotropic' in options) {
        var anisotropic = options.anisotropic
        check(typeof anisotropic === 'number' &&
           anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
          'aniso samples must be between 1 and ')
        this.anisotropic = options.anisotropic
      }

      if ('mipmap' in options) {
        var mipmap = options.mipmap
        switch (typeof mipmap) {
          case 'string':
            check.parameter(mipmap, mipmapHint,
              'invalid mipmap hint')
            this.mipmapHint = mipmapHint[mipmap]
            this.genMipmaps = true
            break

          case 'boolean':
            this.genMipmaps = !!mipmap
            break

          case 'object':
            break

          default:
            check.raise('invalid mipmap type')
        }
      }
    },

    upload: function () {
      var target = this.target
      gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, this.minFilter)
      gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, this.magFilter)
      gl.texParameteri(target, GL_TEXTURE_WRAP_S, this.wrapS)
      gl.texParameteri(target, GL_TEXTURE_WRAP_T, this.wrapT)
      if (extensions.ext_texture_filter_anisotropic) {
        gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropic)
      }
      if (this.genMipmaps) {
        gl.hint(GL_GENERATE_MIPMAP_HINT, this.mipmapHint)
        gl.generateMipmap(target)
      }
    }
  })

  // Final pass to merge params and pixel data
  function checkTextureComplete (params, pixels) {
    var i, pixmap

    var type = 0
    var format = 0
    var internalformat = 0
    var width = 0
    var height = 0
    var channels = 0
    var compressed = false
    var needsPoll = false
    var needsListeners = false
    var mipMask2D = 0
    var mipMaskCube = [0, 0, 0, 0, 0, 0]
    var cubeMask = 0
    var hasMip = false
    for (i = 0; i < pixels.length; ++i) {
      pixmap = pixels[i]
      width = width || (pixmap.width << pixmap.miplevel)
      height = height || (pixmap.height << pixmap.miplevel)
      type = type || pixmap.type
      format = format || pixmap.format
      internalformat = internalformat || pixmap.internalformat
      channels = channels || pixmap.channels
      needsPoll = needsPoll || pixmap.needsPoll
      needsListeners = needsListeners || pixmap.needsListeners
      compressed = compressed || pixmap.compressed

      var miplevel = pixmap.miplevel
      var target = pixmap.target
      hasMip = hasMip || (miplevel > 0)
      if (target === GL_TEXTURE_2D) {
        mipMask2D |= (1 << miplevel)
      } else {
        var face = target - GL_TEXTURE_CUBE_MAP_POSITIVE_X
        mipMaskCube[face] |= (1 << miplevel)
        cubeMask |= (1 << face)
      }
    }

    params.needsPoll = needsPoll
    params.needsListeners = needsListeners
    params.width = width
    params.height = height
    params.format = format
    params.internalformat = internalformat
    params.type = type

    var mipMask = hasMip ? (width << 1) - 1 : 1
    if (params.target === GL_TEXTURE_2D) {
      check(cubeMask === 0,
        'pixmap type must not contain cubemap faces')
      check(mipMask2D === mipMask, 'missing mip map data')
    } else {
      check(cubeMask === ((1 << 6) - 1), 'missing cubemap faces')
      for (i = 0; i < 6; ++i) {
        check(mipMaskCube[i] === mipMask, 'missing mip map data')
      }
    }

    var mipFilter = (MIPMAP_FILTERS.indexOf(params.minFilter) >= 0)
    params.genMipmaps = !hasMip && (params.genMipmaps || mipFilter)
    var useMipmaps = hasMip || params.genMipmaps

    if (!params.minFilter) {
      params.minFilter = useMipmaps
        ? GL_LINEAR_MIPMAP_LINEAR
        : GL_NEAREST
    } else {
      check(useMipmaps === mipFilter,
        'min filter inconsistent with mipmap data')
    }

    if (useMipmaps) {
      check(width === height && isPow2(width),
        'must be a square power of 2 to support mipmaps')
    }

    if (params.genMipmaps) {
      check(!compressed, 'mipmap generation not supported for compressed textures')
    }

    params.wrapS = params.wrapS || GL_CLAMP_TO_EDGE
    params.wrapT = params.wrapT || GL_CLAMP_TO_EDGE
    if (params.wrapS !== GL_CLAMP_TO_EDGE ||
        params.wrapT !== GL_CLAMP_TO_EDGE) {
      check(isPow2(width) && isPow2(height) && !cubeMask,
        'incompatible size for wrap mode, image must be a power of 2')
    }

    if ((type === GL_FLOAT && !extensions.oes_texture_float_linear) ||
        (type === GL_HALF_FLOAT_OES &&
          !extensions.oes_texture_half_float_linear)) {
      check(this.magFilter === GL_NEAREST && this.minFilter === GL_NEAREST,
        'unsupported filter mode for float texture')
    }

    for (i = 0; i < pixels.length; ++i) {
      pixmap = pixels[i]
      var level = pixmap.miplevel
      if (pixmap.width) {
        check(pixmap.width << level === width, 'inconsistent width')
      }
      if (pixmap.height) {
        check(pixmap.height << level === height, 'inconsistent width')
      }
      if (pixmap.channels) {
        check(pixmap.channels === channels, 'inconsistent channels')
      } else {
        pixmap.channels = channels
      }
      if (pixmap.format) {
        check(pixmap.format === format, 'inconsistent format')
      } else {
        pixmap.format = format
      }
      if (pixmap.internalformat) {
        check(pixmap.internalformat === internalformat, 'inconsistent internalformat')
      } else {
        pixmap.internalformat = internalformat
      }
      if (pixmap.type) {
        check(pixmap.type === type, 'inconsistent type')
      } else {
        pixmap.type = type
      }
      if (pixmap.copy) {
        check(pixmap.type === GL_UNSIGNED_BYTE &&
          pixmap.internalformat === GL_RGBA,
          'incompatible format/type for copyTexImage2D')
      }
    }
  }

  var activeTexture = 0
  var textureCount = 0
  var textureSet = {}
  var pollSet = []
  var numTexUnits = limits.maxTextureUnits
  var textureUnits = Array(numTexUnits).map(function () {
    return null
  })

  function REGLTexture (target) {
    this.id = textureCount++
    this.refCount = 1

    this.target = target
    this.texture = null

    this.pollId = -1

    this.unit = -1
    this.bindCount = 0

    // cancels all pending callbacks
    this.cancelPending = null

    // parsed user inputs
    this.params = new TexParams(target)
    this.pixels = []
  }

  function update (texture, options) {
    var i
    clearListeners(texture)

    // Clear parameters and pixel data
    var params = texture.params
    TexParams.call(params, texture.target)
    var pixels = texture.pixels
    pixels.length = 0

    // parse parameters
    params.parse(options)

    // parse pixel data
    function parseMip (target, data) {
      var mipmap = data.mipmap
      var pixmap
      if (Array.isArray(mipmap)) {
        for (var i = 0; i < mipmap.length; ++i) {
          pixmap = new PixelInfo(target)
          pixmap.parseFlags(options)
          pixmap.parseFlags(data)
          pixmap.parse(mipmap[i], i)
          pixels.push(pixmap)
        }
      } else {
        pixmap = new PixelInfo(target)
        pixmap.parseFlags(options)
        pixmap.parse(data, 0)
        pixels.push(pixmap)
      }
    }
    if (texture.target === GL_TEXTURE_2D) {
      parseMip(GL_TEXTURE_2D, options)
    } else {
      var faces = options.faces || options
      if (Array.isArray(faces)) {
        check(faces.length === 6,
          'invalid number of faces in cube map')
        for (i = 0; i < 6; ++i) {
          parseMip(GL_TEXTURE_CUBE_MAP_POSITIVE_X + i, faces[i])
        }
      } else if (typeof faces === 'string') {
        // TODO Read dds
      } else {
        // Initialize to all empty textures
        for (i = 0; i < 6; ++i) {
          parseMip(GL_TEXTURE_CUBE_MAP_POSITIVE_X + i, {})
        }
      }
    }

    // do a second pass to reconcile defaults
    checkTextureComplete(params, pixels)

    if (params.needsListeners) {
      hookListeners(texture)
    }

    if (params.needsPoll) {
      texture.pollId = pollSet.length
      pollSet.push(texture)
    }

    refresh(texture)
  }

  function refresh (texture) {
    if (!gl.isTexture(texture.texture)) {
      texture.texture = gl.createTexture()
    }

    // Lazy bind
    var target = texture.target
    var unit = texture.unit
    if (unit >= 0) {
      gl.activeTexture(GL_TEXTURE0 + unit)
      activeTexture = unit
    } else {
      gl.bindTexture(target, texture.texture)
    }

    // Upload
    var pixels = texture.pixels
    var params = texture.params
    for (var i = 0; i < pixels.length; ++i) {
      pixels[i].upload(params)
    }
    params.upload()

    // Lazy unbind
    if (unit < 0) {
      var active = textureUnits[activeTexture]
      if (active) {
        // restore binding state
        gl.bindTexture(active.target, active.texture)
      } else {
        // otherwise become new active
        texture.unit = activeTexture
        textureUnits[activeTexture] = texture
      }
    }
  }

  function hookListeners (texture) {
    var params = texture.params
    var pixels = texture.pixels

    // Appends all the texture data from the buffer to the current
    function appendDDS (target, miplevel, buffer) {
      var dds = parseDDS(buffer)

      check(dds.format in colorFormats, 'unsupported dds texture format')

      if (dds.cube) {
        check(texture.target === GL_TEXTURE_CUBE_MAP)

        // TODO handle cube map DDS
        check.raise('cube map DDS not yet implemented')
      } else {
        check(texture.target === GL_TEXTURE_2D)
      }

      if (miplevel) {
        check(dds.pixels.length === 1, 'number of mip levels inconsistent')
      }

      dds.pixels.forEach(function (pixmap) {
        var info = new PixelInfo(dds.cube ? pixmap.target : target)

        info.channels = dds.channels
        info.compressed = dds.compressed
        info.type = dds.type
        info.internalformat = dds.format
        info.format = colorFormats[dds.format]

        info.width = pixmap.width
        info.height = pixmap.height
        info.miplevel = pixmap.miplevel || miplevel
        info.data = pixmap.data

        pixels.push(info)
      })
    }

    function onData () {
      // Update size of any newly loaded pixels
      for (var i = 0; i < pixels.length; ++i) {
        var pixelData = pixels[i]
        var image = pixelData.image
        var video = pixelData.video
        var xhr = pixelData.xhr
        if (image && image.complete) {
          pixelData.width = image.naturalWidth
          pixelData.height = image.naturalHeight
        } else if (video && video.readyState > 2) {
          pixelData.width = video.width
          pixelData.height = video.height
        } else if (xhr && xhr.readyState === 4) {
          pixels[i] = pixels[pixels.length - 1]
          pixels.pop()
          xhr.removeEventListener('readystatechange', refresh)
          appendDDS(pixelData.target, pixelData.miplevel, xhr.response)
        }
      }
      checkTextureComplete(params, pixels)
      refresh(texture)
    }

    pixels.forEach(function (pixelData) {
      if (pixelData.image && !pixelData.image.complete) {
        pixelData.image.addEventListener('load', onData)
      } else if (pixelData.video && pixelData.readyState < 1) {
        pixelData.video.addEventListener('progress', onData)
      } else if (pixelData.xhr) {
        pixelData.xhr.addEventListener('readystatechange', onData)
      }
    })

    texture.cancelPending = function detachListeners () {
      pixels.forEach(function (pixelData) {
        if (pixelData.image) {
          pixelData.image.removeEventListener('load', onData)
        } else if (pixelData.video) {
          pixelData.video.removeEventListener('progress', onData)
        } else if (pixelData.xhr) {
          pixelData.xhr.removeEventListener('readystatechange', onData)
          pixelData.xhr.abort()
        }
      })
    }
  }

  function clearListeners (texture) {
    var cancelPending = texture.cancelPending
    if (cancelPending) {
      cancelPending()
      texture.cancelPending = null
    }
    var id = texture.pollId
    if (id >= 0) {
      var other = pollSet[id] = pollSet[pollSet.length - 1]
      other.id = id
      pollSet.pop()
      texture.pollId = -1
    }
  }

  function destroy (texture) {
    var handle = texture.texture
    check(handle, 'must not double destroy texture')
    var unit = texture.unit
    var target = texture.target
    if (unit >= 0) {
      gl.activeTexture(GL_TEXTURE0 + unit)
      activeTexture = unit
      gl.bindTexture(target, null)
      textureUnits[unit] = null
    }
    clearListeners(texture)
    if (gl.isTexture(handle)) {
      gl.deleteTexture(handle)
    }
    texture.texture = null
    texture.params = null
    texture.pixels = null
    texture.refCount = 0
    delete textureSet[texture.id]
  }

  Object.assign(REGLTexture.prototype, {
    bind: function () {
      var texture = this
      texture.bindCount += 1
      var unit = texture.unit
      if (unit < 0) {
        for (var i = 0; i < numTexUnits; ++i) {
          var other = textureUnits[i]
          if (other) {
            if (other.bindCount > 0) {
              continue
            }
            other.unit = -1
          }
          textureUnits[i] = texture
          unit = i
          break
        }
        if (unit >= numTexUnits) {
          check.raise('insufficient number of texture units')
        }
        texture.unit = unit
        gl.activeTexture(GL_TEXTURE0 + unit)
        gl.bindTexture(texture.target, texture.texture)
        activeTexture = unit
      }
      return unit
    },

    unbind: function () {
      this.bindCount -= 1
    },

    decRef: function () {
      if (--this.refCount === 0) {
        destroy(this)
      }
    }
  })

  function createTexture (options, target) {
    var texture = new REGLTexture(target)
    textureSet[texture.id] = texture

    function reglTexture (a0, a1, a2, a3, a4, a5) {
      var options = a0 || {}
      if (target === GL_TEXTURE_CUBE_MAP && arguments.length === 6) {
        options = [a0, a1, a2, a3, a4, a5]
      }
      update(texture, options)
      reglTexture.width = texture.params.width
      reglTexture.height = texture.params.height
      return reglTexture
    }

    reglTexture(options)

    Object.assign(reglTexture, {
      _reglType: 'texture',
      _texture: texture,
      destroy: function () {
        texture.decRef()
      }
    })

    return reglTexture
  }

  // Called after context restore
  function refreshTextures () {
    values(textureSet).forEach(refresh)
    for (var i = 0; i < numTexUnits; ++i) {
      textureUnits[i] = null
    }
    activeTexture = 0
    gl.activeTexture(GL_TEXTURE0)
  }

  // Called when regl is destroyed
  function destroyTextures () {
    for (var i = 0; i < numTexUnits; ++i) {
      gl.activeTexture(GL_TEXTURE0 + i)
      gl.bindTexture(GL_TEXTURE_2D, null)
      textureUnits[i] = null
    }
    gl.activeTexture(GL_TEXTURE0)
    activeTexture = 0
    values(textureSet).forEach(destroy)
  }

  // Called once per raf, updates video textures
  function pollTextures () {
    pollSet.forEach(refresh)
  }

  return {
    create: createTexture,
    refresh: refreshTextures,
    clear: destroyTextures,
    poll: pollTextures,
    getTexture: function (wrapper) {
      return null
    }
  }
}

},{"./check":4,"./is-ndarray":17,"./is-typed-array":18,"./load-texture":20,"./parse-dds":21,"./to-half-float":29,"./values":31}],29:[function(require,module,exports){
module.exports = function convertToHalfFloat (array) {
  var floats = new Float32Array(array)
  var uints = new Uint32Array(floats.buffer)
  var ushorts = new Uint16Array(array.length)

  for (var i = 0; i < array.length; ++i) {
    if (isNaN(array[i])) {
      ushorts[i] = 0xffff
    } else if (array[i] === Infinity) {
      ushorts[i] = 0x7c00
    } else if (array[i] === -Infinity) {
      ushorts[i] = 0xfc00
    } else {
      var x = uints[i]

      var sgn = (x >>> 31) << 15
      var exp = ((x << 1) >>> 24) - 127
      var frac = (x >> 13) & ((1 << 10) - 1)

      if (exp < -24) {
        // round non-representable denormals to 0
        ushorts[i] = sgn
      } else if (exp < -14) {
        // handle denormals
        var s = -14 - exp
        ushorts[i] = sgn + ((frac + (1 << 10)) >> s)
      } else if (exp > 15) {
        // round overflow to +/- Infinity
        ushorts[i] = sgn + 0x7c00
      } else {
        // otherwise convert directly
        ushorts[i] = sgn + ((exp + 15) << 10) + frac
      }
    }
  }

  return ushorts
}

},{}],30:[function(require,module,exports){
module.exports = function wrapUniformState () {
  var uniformState = {}

  function defUniform (name) {
    if (name in uniformState) {
      return
    }
    uniformState[name] = [ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ]
  }

  return {
    uniforms: uniformState,
    def: defUniform
  }
}

},{}],31:[function(require,module,exports){
module.exports = function (obj) {
  return Object.keys(obj).map(function (key) { return obj[key] })
}

},{}],32:[function(require,module,exports){
'use strict'

module.exports = angleNormals

function hypot(x, y, z) {
  return Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2))
}

function weight(s, r, a) {
  return Math.atan2(r, (s - a))
}

function mulAdd(dest, s, x, y, z) {
  dest[0] += s * x
  dest[1] += s * y
  dest[2] += s * z
}

function angleNormals(cells, positions) {
  var numVerts = positions.length
  var numCells = cells.length

  //Allocate normal array
  var normals = new Array(numVerts)
  for(var i=0; i<numVerts; ++i) {
    normals[i] = [0,0,0]
  }

  //Scan cells, and
  for(var i=0; i<numCells; ++i) {
    var cell = cells[i]
    var a = positions[cell[0]]
    var b = positions[cell[1]]
    var c = positions[cell[2]]

    var abx = a[0] - b[0]
    var aby = a[1] - b[1]
    var abz = a[2] - b[2]
    var ab = hypot(abx, aby, abz)

    var bcx = b[0] - c[0]
    var bcy = b[1] - c[1]
    var bcz = b[2] - c[2]
    var bc = hypot(bcx, bcy, bcz)

    var cax = c[0] - a[0]
    var cay = c[1] - a[1]
    var caz = c[2] - a[2]
    var ca = hypot(cax, cay, caz)

    if(Math.min(ab, bc, ca) < 1e-6) {
      continue
    }

    var s = 0.5 * (ab + bc + ca)
    var r = Math.sqrt((s - ab)*(s - bc)*(s - ca)/s)

    var nx = aby * bcz - abz * bcy
    var ny = abz * bcx - abx * bcz
    var nz = abx * bcy - aby * bcx
    var nl = hypot(nx, ny, nz)
    nx /= nl
    ny /= nl
    nz /= nl

    mulAdd(normals[cell[0]], weight(s, r, bc), nx, ny, nz)
    mulAdd(normals[cell[1]], weight(s, r, ca), nx, ny, nz)
    mulAdd(normals[cell[2]], weight(s, r, ab), nx, ny, nz)
  }

  //Normalize all the normals
  for(var i=0; i<numVerts; ++i) {
    var n = normals[i]
    var l = Math.sqrt(
      Math.pow(n[0], 2) +
      Math.pow(n[1], 2) +
      Math.pow(n[2], 2))
    if(l < 1e-8) {
      n[0] = 1
      n[1] = 0
      n[2] = 0
      continue
    }
    n[0] /= l
    n[1] /= l
    n[2] /= l
  }

  return normals
}

},{}],33:[function(require,module,exports){
exports.positions=[[1.301895,0.122622,2.550061],[1.045326,0.139058,2.835156],[0.569251,0.155925,2.805125],[0.251886,0.144145,2.82928],[0.063033,0.131726,3.01408],[-0.277753,0.135892,3.10716],[-0.441048,0.277064,2.594331],[-1.010956,0.095285,2.668983],[-1.317639,0.069897,2.325448],[-0.751691,0.264681,2.381496],[0.684137,0.31134,2.364574],[1.347931,0.302882,2.201434],[-1.736903,0.029894,1.724111],[-1.319986,0.11998,0.912925],[1.538077,0.157372,0.481711],[1.951975,0.081742,1.1641],[1.834768,0.095832,1.602682],[2.446122,0.091817,1.37558],[2.617615,0.078644,0.742801],[-1.609748,0.04973,-0.238721],[-1.281973,0.230984,-0.180916],[-1.074501,0.248204,0.034007],[-1.201734,0.058499,0.402234],[-1.444454,0.054783,0.149579],[-4.694605,5.075882,1.043427],[-3.95963,7.767394,0.758447],[-4.753339,5.339817,0.665061],[-1.150325,9.133327,-0.368552],[-4.316107,2.893611,0.44399],[-0.809202,9.312575,-0.466061],[0.085626,5.963693,1.685666],[-1.314853,9.00142,-0.1339],[-4.364182,3.072556,1.436712],[-2.022074,7.323396,0.678657],[1.990887,6.13023,0.479643],[-3.295525,7.878917,1.409353],[0.571308,6.197569,0.670657],[0.89661,6.20018,0.337056],[0.331851,6.162372,1.186371],[-4.840066,5.599874,2.296069],[2.138989,6.031291,0.228335],[0.678923,6.026173,1.894052],[-0.781682,5.601573,1.836738],[1.181315,6.239007,0.393293],[-3.606308,7.376476,2.661452],[-0.579059,4.042511,-1.540883],[-3.064069,8.630253,-2.597539],[-2.157271,6.837012,0.300191],[-2.966013,7.821581,-1.13697],[-2.34426,8.122965,0.409043],[-0.951684,5.874251,1.415119],[-2.834853,7.748319,0.182406],[-3.242493,7.820096,0.373674],[-0.208532,5.992846,1.252084],[-3.048085,8.431527,-2.129795],[1.413245,5.806324,2.243906],[-0.051222,6.064901,0.696093],[-4.204306,2.700062,0.713875],[-4.610997,6.343405,0.344272],[-3.291336,9.30531,-3.340445],[-3.27211,7.559239,-2.324016],[-4.23882,6.498344,3.18452],[-3.945317,6.377804,3.38625],[-4.906378,5.472265,1.315193],[-3.580131,7.846717,0.709666],[-1.995504,6.645459,0.688487],[-2.595651,7.86054,0.793351],[-0.008849,0.305871,0.184484],[-0.029011,0.314116,-0.257312],[-2.522424,7.565392,1.804212],[-1.022993,8.650826,-0.855609],[-3.831265,6.595426,3.266783],[-4.042525,6.855724,3.060663],[-4.17126,7.404742,2.391387],[3.904526,3.767693,0.092179],[0.268076,6.086802,1.469223],[-3.320456,8.753222,-2.08969],[1.203048,6.26925,0.612407],[-4.406479,2.985974,0.853691],[-3.226889,6.615215,-0.404243],[0.346326,1.60211,3.509858],[-3.955476,7.253323,2.722392],[-1.23204,0.068935,1.68794],[0.625436,6.196455,1.333156],[4.469132,2.165298,1.70525],[0.950053,6.262899,0.922441],[-2.980404,5.25474,-0.663155],[-4.859043,6.28741,1.537081],[-3.077453,4.641475,-0.892167],[-0.44002,8.222503,-0.771454],[-4.034112,7.639786,0.389935],[-3.696045,6.242042,3.394679],[-1.221806,7.783617,0.196451],[0.71461,6.149895,1.656636],[-4.713539,6.163154,0.495369],[-1.509869,0.913044,-0.832413],[-1.547249,2.066753,-0.852669],[-3.757734,5.793742,3.455794],[-0.831911,0.199296,1.718536],[-3.062763,7.52718,-1.550559],[0.938688,6.103354,1.820958],[-4.037033,2.412311,0.988026],[-4.130746,2.571806,1.101689],[-0.693664,9.174283,-0.952323],[-1.286742,1.079679,-0.751219],[1.543185,1.408925,3.483132],[1.535973,2.047979,3.655029],[0.93844,5.84101,2.195219],[-0.684401,5.918492,1.20109],[1.28844,2.008676,3.710781],[-3.586722,7.435506,-1.454737],[-0.129975,4.384192,2.930593],[-1.030531,0.281374,3.214273],[-3.058751,8.137238,-3.227714],[3.649524,4.592226,1.340021],[-3.354828,7.322425,-1.412086],[0.936449,6.209237,1.512693],[-1.001832,3.590411,-1.545892],[-3.770486,4.593242,2.477056],[-0.971925,0.067797,0.921384],[-4.639832,6.865407,2.311791],[-0.441014,8.093595,-0.595999],[-2.004852,6.37142,1.635383],[4.759591,1.92818,0.328328],[3.748064,1.224074,2.140484],[-0.703601,5.285476,2.251988],[0.59532,6.21893,0.981004],[0.980799,6.257026,1.24223],[1.574697,6.204981,0.381628],[1.149594,6.173608,1.660763],[-3.501963,5.895989,3.456576],[1.071122,5.424198,2.588717],[-0.774693,8.473335,-0.276957],[3.849959,4.15542,0.396742],[-0.801715,4.973149,-1.068582],[-2.927676,0.625112,2.326393],[2.669682,4.045542,2.971184],[-4.391324,4.74086,0.343463],[1.520129,6.270031,0.775471],[1.837586,6.084731,0.109188],[1.271475,5.975024,2.032355],[-3.487968,4.513249,2.605871],[-1.32234,1.517264,-0.691879],[-1.080301,1.648226,-0.805526],[-3.365703,6.910166,-0.454902],[1.36034,0.432238,3.075004],[-3.305013,5.774685,3.39142],[3.88432,0.654141,0.12574],[3.57254,0.377934,0.302501],[4.196136,0.807999,0.212229],[3.932997,0.543123,0.380579],[4.023704,3.286125,0.537597],[1.864455,4.916544,2.691677],[-4.775427,6.499498,1.440153],[-3.464928,3.68234,2.766356],[3.648972,1.751262,2.157485],[1.179111,3.238846,3.774796],[-0.171164,0.299126,-0.592669],[-4.502912,3.316656,0.875188],[-0.948454,9.214025,-0.679508],[1.237665,6.288593,1.046],[1.523423,6.268963,1.139544],[1.436519,6.140608,1.739316],[3.723607,1.504355,2.136762],[2.009495,4.045514,3.22053],[-1.921944,7.249905,0.213973],[1.254068,1.205518,3.474709],[-0.317087,5.996269,0.525872],[-2.996914,3.934607,2.900178],[-3.316873,4.028154,2.785696],[-3.400267,4.280157,2.689268],[-3.134842,4.564875,2.697192],[1.480563,4.692567,2.834068],[0.873682,1.315452,3.541585],[1.599355,0.91622,3.246769],[-3.292102,7.125914,2.768515],[3.74296,4.511299,0.616539],[4.698935,1.55336,0.26921],[-3.274387,3.299421,2.823946],[-2.88809,3.410699,2.955248],[1.171407,1.76905,3.688472],[1.430276,3.92483,3.473666],[3.916941,2.553308,0.018941],[0.701632,2.442372,3.778639],[1.562657,2.302778,3.660957],[4.476622,1.152407,0.182131],[-0.61136,5.761367,1.598838],[-3.102154,3.691687,2.903738],[1.816012,5.546167,2.380308],[3.853928,4.25066,0.750017],[1.234681,3.581665,3.673723],[1.862271,1.361863,3.355209],[1.346844,4.146995,3.327877],[1.70672,4.080043,3.274307],[0.897242,1.908983,3.6969],[-0.587022,9.191132,-0.565301],[-0.217426,5.674606,2.019968],[0.278925,6.120777,0.485403],[1.463328,3.578742,-2.001464],[-3.072985,4.264581,2.789502],[3.62353,4.673843,0.383452],[-3.053491,8.752377,-2.908434],[-2.628687,4.505072,2.755601],[0.891047,5.113781,2.748272],[-2.923732,3.06515,2.866368],[0.848008,4.754252,2.896972],[-3.319184,8.811641,-2.327412],[0.12864,8.814781,-1.334456],[1.549501,4.549331,-1.28243],[1.647161,3.738973,3.507719],[1.250888,0.945599,3.348739],[3.809662,4.038822,0.053142],[1.483166,0.673327,3.09156],[0.829726,3.635921,3.713103],[1.352914,5.226651,2.668113],[2.237352,4.37414,3.016386],[4.507929,0.889447,0.744249],[4.57304,1.010981,0.496588],[3.931422,1.720989,2.088175],[-0.463177,5.989835,0.834346],[-2.811236,3.745023,2.969587],[-2.805135,4.219721,2.841108],[-2.836842,4.802543,2.60826],[1.776716,2.084611,3.568638],[4.046881,1.463478,2.106273],[0.316265,5.944313,1.892785],[-2.86347,2.776049,2.77242],[-2.673644,3.116508,2.907104],[-2.621149,4.018502,2.903409],[-2.573447,5.198013,2.477481],[1.104039,2.278985,3.722469],[-4.602743,4.306413,0.902296],[-2.684878,1.510731,0.535039],[0.092036,8.473269,-0.99413],[-1.280472,5.602393,1.928105],[-1.0279,4.121582,-1.403103],[-2.461081,3.304477,2.957317],[-2.375929,3.659383,2.953233],[1.417579,2.715389,3.718767],[0.819727,2.948823,3.810639],[1.329962,0.761779,3.203724],[1.73952,5.295229,2.537725],[0.952523,3.945016,3.548229],[-2.569498,0.633669,2.84818],[-2.276676,0.757013,2.780717],[-2.013147,7.354429,-0.003202],[0.93143,1.565913,3.600325],[1.249014,1.550556,3.585842],[2.287252,4.072353,3.124544],[-4.7349,7.006244,1.690653],[-3.500602,8.80386,-2.009196],[-0.582629,5.549138,2.000923],[-1.865297,6.356066,1.313593],[-3.212154,2.376143,-0.565593],[2.092889,3.493536,-1.727931],[-2.528501,2.784531,2.833758],[-2.565697,4.893154,2.559605],[-2.153366,5.04584,2.465215],[1.631311,2.568241,3.681445],[2.150193,4.699227,2.807505],[0.507599,5.01813,2.775892],[4.129862,1.863698,2.015101],[3.578279,4.50766,-0.009598],[3.491023,4.806749,1.549265],[0.619485,1.625336,3.605125],[1.107499,2.932557,3.790061],[-2.082292,6.99321,0.742601],[4.839909,1.379279,0.945274],[3.591328,4.322645,-0.259497],[1.055245,0.710686,3.16553],[-3.026494,7.842227,1.624553],[0.146569,6.119214,0.981673],[-2.043687,2.614509,2.785526],[-2.302242,3.047775,2.936355],[-2.245686,4.100424,2.87794],[2.116148,5.063507,2.572204],[-1.448406,7.64559,0.251692],[2.550717,4.9268,2.517526],[-2.955456,7.80293,-1.782407],[1.882995,4.637167,2.895436],[-2.014924,3.398262,2.954896],[-2.273654,4.771227,2.611418],[-2.162723,7.876761,0.702473],[-0.198659,5.823062,1.739272],[-1.280908,2.133189,-0.921241],[2.039932,4.251568,3.136579],[1.477815,4.354333,3.108325],[0.560504,3.744128,3.6913],[-2.234018,1.054373,2.352782],[-3.189156,7.686661,-2.514955],[-3.744736,7.69963,2.116973],[-2.283366,2.878365,2.87882],[-2.153786,4.457481,2.743529],[4.933978,1.677287,0.713773],[3.502146,0.535336,1.752511],[1.825169,4.419253,3.081198],[3.072331,0.280979,0.106534],[-0.508381,1.220392,2.878049],[-3.138824,8.445394,-1.659711],[-2.056425,2.954815,2.897241],[-2.035343,5.398477,2.215842],[-3.239915,7.126798,-0.712547],[-1.867923,7.989805,0.526518],[1.23405,6.248973,1.387189],[-0.216492,8.320933,-0.862495],[-2.079659,3.755709,2.928563],[-1.78595,4.300374,2.805295],[-1.856589,5.10678,2.386572],[-1.714362,5.544778,2.004623],[1.722403,4.200291,-1.408161],[0.195386,0.086928,-1.318006],[1.393693,3.013404,3.710686],[-0.415307,8.508471,-0.996883],[-1.853777,0.755635,2.757275],[-1.724057,3.64533,2.884251],[-1.884511,4.927802,2.530885],[-1.017174,7.783908,-0.227078],[-1.7798,2.342513,2.741749],[-1.841329,3.943996,2.88436],[1.430388,5.468067,2.503467],[-2.030296,0.940028,2.611088],[-1.677028,1.215666,2.607771],[-1.74092,2.832564,2.827295],[4.144673,0.631374,0.503358],[4.238811,0.653992,0.762436],[-1.847016,2.082815,2.642674],[4.045764,3.194073,0.852117],[-1.563989,8.112739,0.303102],[-1.781627,1.794836,2.602338],[-1.493749,2.533799,2.797251],[-1.934496,4.690689,2.658999],[-1.499174,5.777946,1.747498],[-2.387409,0.851291,1.500524],[-1.872211,8.269987,0.392533],[-4.647726,6.765771,0.833653],[-3.157482,0.341958,-0.20671],[-1.725766,3.24703,2.883579],[-1.458199,4.079031,2.836325],[-1.621548,4.515869,2.719266],[-1.607292,4.918914,2.505881],[-1.494661,5.556239,1.991599],[-1.727269,7.423769,0.012337],[-1.382497,1.161322,2.640222],[-1.52129,4.681714,2.615467],[-4.247127,2.792812,1.250843],[-1.576338,0.742947,2.769799],[-1.499257,2.172763,2.743142],[-1.480392,3.103261,2.862262],[1.049137,2.625836,3.775384],[-1.368063,1.791587,2.695516],[-1.307839,2.344534,2.767575],[-1.336758,5.092221,2.355225],[-1.5617,5.301749,2.21625],[-1.483362,8.537704,0.196752],[-1.517348,8.773614,0.074053],[-1.474302,1.492731,2.641433],[2.48718,0.644247,-0.920226],[0.818091,0.422682,3.171218],[-3.623398,6.930094,3.033045],[1.676333,3.531039,3.591591],[1.199939,5.683873,2.365623],[-1.223851,8.841201,0.025414],[-1.286307,3.847643,2.918044],[-1.25857,4.810831,2.543605],[2.603662,5.572146,1.991854],[0.138984,5.779724,2.077834],[-1.267039,3.175169,2.890889],[-1.293616,3.454612,2.911774],[-2.60112,1.277184,0.07724],[2.552779,3.649877,3.163643],[-1.038983,1.248011,2.605933],[-1.288709,4.390967,2.761214],[-1.034218,5.485963,2.011467],[-1.185576,1.464842,2.624335],[-1.045682,2.54896,2.761102],[4.259176,1.660627,2.018096],[-0.961707,1.717183,2.598342],[-1.044603,3.147464,2.855335],[-0.891998,4.685429,2.669696],[-1.027561,5.081672,2.377939],[4.386506,0.832434,0.510074],[-1.014225,9.064991,-0.175352],[-1.218752,2.895443,2.823785],[-0.972075,4.432669,2.788005],[-2.714986,0.52425,1.509798],[-0.699248,1.517219,2.645738],[-1.161581,2.078852,2.722795],[-0.845249,3.286247,2.996471],[1.068329,4.443444,2.993863],[3.98132,3.715557,1.027775],[1.658097,3.982428,-1.651688],[-4.053701,2.449888,0.734746],[-0.910935,2.214149,2.702393],[0.087824,3.96165,3.439344],[-0.779714,3.724134,2.993429],[-1.051093,3.810797,2.941957],[-0.644941,4.3859,2.870863],[-2.98403,8.666895,-3.691888],[-0.754304,2.508325,2.812999],[-4.635524,3.662891,0.913005],[-0.983299,4.125978,2.915378],[4.916497,1.905209,0.621315],[4.874983,1.728429,0.468521],[2.33127,5.181957,2.441697],[-0.653711,2.253387,2.7949],[-3.623744,8.978795,-2.46192],[-4.555927,6.160279,0.215755],[-4.940628,5.806712,1.18383],[3.308506,2.40326,-0.910776],[0.58835,5.251928,-0.992886],[2.152215,5.449733,2.331679],[-0.712755,0.766765,3.280375],[-0.741771,1.9716,2.657235],[-4.828957,5.566946,2.635623],[-3.474788,8.696771,-1.776121],[1.770417,6.205561,1.331627],[-0.620626,4.064721,2.968972],[-1.499187,2.307735,-0.978901],[4.098793,2.330245,1.667951],[1.940444,6.167057,0.935904],[-2.314436,1.104995,1.681277],[-2.733629,7.742793,1.7705],[-0.452248,4.719868,2.740834],[-0.649143,4.951713,2.541296],[-0.479417,9.43959,-0.676324],[-2.251853,6.559275,0.046819],[0.033531,8.316907,-0.789939],[-0.513125,0.995673,3.125462],[-2.637602,1.039747,0.602434],[1.527513,6.230089,1.430903],[4.036124,2.609846,1.506498],[-3.559828,7.877892,1.228076],[-4.570736,4.960193,0.838201],[-0.432121,5.157731,2.467518],[-1.206735,4.562511,-1.237054],[-0.823768,3.788746,-1.567481],[-3.095544,7.353613,-1.024577],[-4.056088,7.631119,2.062001],[-0.289385,5.382261,2.329421],[1.69752,6.136483,1.667037],[-0.168758,5.061138,2.617453],[2.853576,1.605528,-1.229958],[-4.514319,6.586675,0.352756],[-2.558081,7.741151,1.29295],[1.61116,5.92358,2.071534],[3.936921,3.354857,0.091755],[-0.1633,1.119272,3.147975],[0.067551,1.593475,3.38212],[-1.303239,2.328184,-1.011672],[-0.438093,0.73423,3.398384],[-4.62767,3.898187,0.849573],[0.286853,4.165281,3.284834],[-2.968052,8.492812,-3.493693],[-0.111896,3.696111,3.53791],[-3.808245,8.451731,-1.574742],[0.053416,5.558764,2.31107],[3.956269,3.012071,0.11121],[-0.710956,8.106561,-0.665154],[0.234725,2.717326,3.722379],[-0.031594,2.76411,3.657347],[-0.017371,4.700633,2.81911],[0.215064,5.034859,2.721426],[-0.111151,8.480333,-0.649399],[3.97942,3.575478,0.362219],[0.392962,4.735392,2.874321],[4.17015,2.085087,1.865999],[0.169054,1.244786,3.337709],[0.020049,3.165818,3.721736],[0.248212,3.595518,3.698376],[0.130706,5.295541,2.540034],[-4.541357,4.798332,1.026866],[-1.277485,1.289518,-0.667272],[3.892133,3.54263,-0.078056],[4.057379,3.03669,0.997913],[0.287719,0.884758,3.251787],[0.535771,1.144701,3.400096],[0.585303,1.399362,3.505353],[0.191551,2.076246,3.549355],[0.328656,2.394576,3.649623],[0.413124,3.240728,3.771515],[0.630361,4.501549,2.963623],[0.529441,5.854392,2.120225],[3.805796,3.769958,-0.162079],[3.447279,4.344846,-0.467276],[0.377618,5.551116,2.426017],[0.409355,1.821269,3.606333],[0.719959,2.194726,3.703851],[0.495922,3.501519,3.755661],[0.603408,5.354097,2.603088],[-4.605056,7.531978,1.19579],[0.907972,0.973128,3.356513],[0.750134,3.356137,3.765847],[0.4496,3.993244,3.504544],[-3.030738,7.48947,-1.259169],[0.707505,5.602005,2.43476],[0.668944,0.654891,3.213797],[0.593244,2.700978,3.791427],[1.467759,3.30327,3.71035],[3.316249,2.436388,2.581175],[3.26138,1.724425,2.539028],[-1.231292,7.968263,0.281414],[-0.108773,8.712307,-0.790607],[4.445684,1.819442,1.896988],[1.998959,2.281499,3.49447],[2.162269,2.113817,3.365449],[4.363397,1.406731,1.922714],[4.808,2.225842,0.611127],[2.735919,0.771812,-0.701142],[1.897735,2.878428,3.583482],[-3.31616,5.331985,3.212394],[-3.3314,6.018137,3.313018],[-3.503183,6.480103,3.222216],[-1.904453,5.750392,1.913324],[-1.339735,3.559592,-1.421817],[-1.044242,8.22539,0.037414],[1.643492,3.110676,3.647424],[3.992832,3.686244,0.710946],[1.774207,1.71842,3.475768],[-3.438842,5.5713,3.427818],[4.602447,1.2583,1.619528],[-0.925516,7.930042,0.072336],[-1.252093,3.846565,-1.420761],[-3.426857,5.072419,2.97806],[-3.160408,6.152629,3.061869],[3.739931,3.367082,2.041273],[1.027419,4.235891,3.251253],[4.777703,1.887452,1.560409],[-3.318528,6.733796,2.982968],[2.929265,4.962579,2.271079],[3.449761,2.838629,2.474576],[-3.280159,5.029875,2.787514],[4.068939,2.993629,0.741567],[0.303312,8.70927,-1.121972],[0.229852,8.981322,-1.186075],[-0.011045,9.148156,-1.047057],[-2.942683,5.579613,2.929297],[-3.145409,5.698727,3.205778],[-3.019089,6.30887,2.794323],[-3.217135,6.468191,2.970032],[-3.048298,6.993641,2.623378],[-3.07429,6.660982,2.702434],[3.612011,2.5574,2.25349],[2.54516,4.553967,2.75884],[-1.683759,7.400787,0.250868],[-1.756066,7.463557,0.448031],[-3.023761,5.149697,2.673539],[3.112376,2.677218,2.782378],[2.835327,4.581196,2.567146],[-2.973799,7.225458,2.506988],[-0.591645,8.740662,-0.505845],[3.782861,2.04337,2.03066],[3.331604,3.36343,2.605047],[2.966866,1.205497,2.537432],[0.002669,9.654748,-1.355559],[2.632801,0.58497,2.540311],[-2.819398,5.087372,2.521098],[2.616193,5.332961,2.194288],[-3.193973,4.925634,2.607924],[-3.12618,5.27524,2.944544],[-0.426003,8.516354,-0.501528],[2.802717,1.387643,2.751649],[-3.120597,7.889111,-2.75431],[2.636648,1.71702,2.991302],[-2.853151,6.711792,2.430276],[-2.843836,6.962865,2.400842],[1.9696,3.199023,3.504514],[-2.461751,0.386352,3.008994],[1.64127,0.495758,3.02958],[-4.330472,5.409831,0.025287],[-2.912387,5.980416,2.844261],[-2.490069,0.211078,2.985391],[3.581816,4.809118,0.733728],[2.693199,2.647213,3.126709],[-0.182964,8.184108,-0.638459],[-2.226855,0.444711,2.946552],[-0.720175,8.115055,0.017689],[2.645302,4.316212,2.850139],[-0.232764,9.329503,-0.918639],[4.852365,1.471901,0.65275],[2.76229,2.014994,2.957755],[-2.808374,5.354301,2.644695],[-2.790967,6.406963,2.547985],[-1.342684,0.418488,-1.669183],[2.690675,5.593587,-0.041236],[4.660146,1.6318,1.713314],[2.775667,3.007229,3.111332],[-0.396696,8.963432,-0.706202],[2.446707,2.740617,3.321433],[-4.803209,5.884634,2.603672],[-2.652003,1.6541,1.5078],[3.932327,3.972874,0.831924],[2.135906,0.955587,2.986608],[2.486131,2.053802,3.124115],[-0.386706,8.115753,-0.37565],[-2.720727,7.325044,2.224878],[-1.396946,7.638016,-0.16486],[-0.62083,7.989771,-0.144413],[-2.653272,5.729684,2.667679],[3.038188,4.65835,2.364142],[2.381721,0.739472,2.788992],[-2.345829,5.474929,2.380633],[-2.518983,6.080562,2.479383],[-2.615793,6.839622,2.186116],[-2.286566,0.143752,2.766848],[-4.771219,6.508766,1.070797],[3.717308,2.905019,2.097994],[2.50521,3.016743,3.295898],[2.208448,1.56029,3.216806],[3.346783,1.01254,2.119951],[2.653503,3.26122,3.175738],[-2.359636,5.827519,2.402297],[-1.952693,0.558102,2.853307],[-0.321562,9.414885,-1.187501],[3.138923,1.405072,2.520765],[1.493728,1.780051,3.621969],[3.01817,0.907291,2.336909],[3.183548,1.185297,2.352175],[1.608619,5.006753,2.695131],[-4.723919,6.836107,1.095288],[-1.017586,8.865429,-0.149328],[4.730762,1.214014,0.64008],[-2.135182,6.647907,1.495471],[-2.420382,6.546114,2.108209],[-2.458053,7.186346,1.896623],[3.437124,0.275798,1.138203],[0.095925,8.725832,-0.926481],[2.417376,2.429869,3.287659],[2.279951,1.200317,3.049994],[2.674753,2.326926,3.044059],[-2.328123,6.849164,1.75751],[-3.418616,7.853407,0.126248],[-3.151587,7.77543,-0.110889],[2.349144,5.653242,2.05869],[-2.273236,6.085631,2.242888],[-4.560601,4.525342,1.261241],[2.866334,3.796067,2.934717],[-2.17493,6.505518,1.791367],[3.12059,3.283157,2.818869],[3.037703,3.562356,2.866653],[0.066233,9.488418,-1.248237],[2.749941,0.975018,2.573371],[-2.155749,5.801033,2.204009],[-2.162778,6.261889,2.028596],[1.936874,0.459142,2.956718],[3.176249,4.335541,2.440447],[4.356599,1.029423,1.700589],[3.873502,3.082678,1.80431],[2.895489,4.243034,2.735259],[-0.095774,9.468195,-1.07451],[-1.124982,7.886808,-0.480851],[3.032304,3.065454,2.897927],[3.692687,4.5961,0.957858],[-3.013045,3.807235,-1.098381],[-0.790012,8.92912,-0.367572],[1.905793,0.73179,2.996728],[3.530396,3.426233,2.356583],[2.12299,0.624933,2.929167],[-2.069196,6.039284,2.01251],[-3.565623,7.182525,2.850039],[2.959264,2.376337,2.829242],[2.949071,1.822483,2.793933],[4.036142,0.763803,1.703744],[-1.993527,6.180318,1.804936],[-0.030987,0.766389,3.344766],[-0.549683,8.225193,-0.189341],[-0.765469,8.272246,-0.127174],[-2.947047,7.541648,-0.414113],[-3.050327,9.10114,-3.435619],[3.488566,2.231807,2.399836],[3.352283,4.727851,1.946438],[4.741011,2.162773,1.499574],[-1.815093,6.072079,1.580722],[-3.720969,8.267927,-0.984713],[1.932826,3.714052,3.427488],[3.323617,4.438961,2.20732],[0.254111,9.26364,-1.373244],[-1.493384,7.868585,-0.450051],[-0.841901,0.776135,-1.619467],[0.243537,6.027668,0.091687],[0.303057,0.313022,-0.531105],[-0.435273,0.474098,3.481552],[2.121507,2.622389,3.486293],[1.96194,1.101753,3.159584],[3.937991,3.407551,1.551392],[0.070906,0.295753,1.377185],[-1.93588,7.631764,0.651674],[-2.523531,0.744818,-0.30985],[2.891496,3.319875,2.983079],[4.781765,1.547061,1.523129],[-2.256064,7.571251,0.973716],[3.244861,3.058249,2.724392],[-0.145855,0.437775,3.433662],[1.586296,5.658538,2.358487],[3.658336,3.774921,2.071837],[2.840463,4.817098,2.46376],[-1.219464,8.122542,-0.672808],[-2.520906,2.664486,-1.034346],[-1.315417,8.471365,-0.709557],[3.429165,3.74686,2.446169],[3.074579,3.840758,2.767409],[3.569443,3.166337,2.333647],[2.294337,3.280051,3.359346],[2.21816,3.66578,3.269222],[2.158662,4.151444,-1.357919],[1.13862,4.380986,-1.404565],[3.388382,2.749931,-0.840949],[3.059892,5.084848,2.026066],[3.204739,2.075145,2.640706],[3.387065,1.42617,2.305275],[3.910398,2.670742,1.750179],[3.471512,1.945821,2.395881],[4.08082,1.070654,1.960171],[-1.057861,0.133036,2.146707],[-0.151749,5.53551,-0.624323],[3.233099,4.003778,2.571172],[2.611726,5.319199,-0.499388],[2.682909,1.094499,-1.206247],[-1.22823,7.656887,0.041409],[-2.293247,7.259189,0.013844],[0.081315,0.202174,3.286381],[-1.002038,5.794454,-0.187194],[3.448856,4.08091,2.258325],[0.287883,9.006888,-1.550641],[-3.851019,4.059839,-0.646922],[3.610966,4.205438,1.913129],[2.239042,2.950872,3.449959],[0.216305,0.442843,3.328052],[1.87141,2.470745,3.574559],[3.811378,2.768718,-0.228364],[2.511081,1.362724,2.969349],[-1.59813,7.866506,0.440184],[-3.307975,2.851072,-0.894978],[-0.107011,8.90573,-0.884399],[-3.855315,2.842597,-0.434541],[2.517853,1.090768,2.799687],[3.791709,2.36685,2.002703],[4.06294,2.773922,0.452723],[-2.973289,7.61703,-0.623653],[-2.95509,8.924462,-3.446319],[2.861402,0.562592,2.184397],[-1.109725,8.594206,-0.076812],[-0.725722,7.924485,-0.381133],[-1.485587,1.329994,-0.654405],[-4.342113,3.233735,1.752922],[-2.968049,7.955519,-2.09405],[-3.130948,0.446196,0.85287],[-4.958475,5.757329,1.447055],[-3.086547,7.615193,-1.953168],[-3.751923,5.412821,3.373373],[-4.599645,7.480953,1.677134],[1.133992,0.274871,0.032249],[-2.956512,8.126905,-1.785461],[-0.960645,4.73065,-1.191786],[-2.871064,0.875559,0.424881],[-4.932114,5.99614,1.483845],[-2.981761,8.124612,-1.387276],[0.362298,8.978545,-1.368024],[-4.408375,3.046271,0.602373],[2.865841,2.322263,-1.344625],[-4.7848,5.620895,0.594432],[-2.88322,0.338931,1.67231],[-4.688101,6.772931,1.872318],[-4.903948,6.164698,1.27135],[2.85663,1.005647,-0.906843],[2.691286,0.209811,0.050512],[-4.693636,6.477556,0.665796],[-4.472331,6.861067,0.477318],[0.883065,0.204907,3.073933],[-0.995867,8.048729,-0.653897],[-0.794663,5.670397,-0.390119],[3.313153,1.638006,-0.722289],[-4.856459,5.394758,1.032591],[-3.005448,7.783023,-0.819641],[3.11891,2.036974,-1.08689],[-2.364319,2.408419,2.63419],[-2.927132,8.75435,-3.537159],[-3.296222,7.964629,-3.134625],[-1.642041,4.13417,-1.301665],[2.030759,0.176372,-1.030923],[-4.559069,3.751053,0.548453],[3.438385,4.59454,-0.243215],[-2.561769,7.93935,0.177696],[2.990593,1.335314,-0.943177],[1.2808,0.276396,-0.49072],[-0.318889,0.290684,0.211143],[3.54614,3.342635,-0.767878],[-3.073372,7.780018,-2.357807],[-4.455388,4.387245,0.361038],[-4.659393,6.276064,2.767014],[0.636799,4.482223,-1.426284],[-2.987681,8.072969,-2.45245],[-2.610445,0.763554,1.792054],[3.358241,2.006707,-0.802973],[-0.498347,0.251594,0.962885],[3.1322,0.683312,2.038777],[-4.389801,7.493776,0.690247],[0.431467,4.22119,-1.614215],[-4.376181,3.213141,0.273255],[-4.872319,5.715645,0.829714],[-4.826893,6.195334,0.849912],[3.516562,2.23732,-0.677597],[3.131656,1.698841,-0.975761],[-4.754925,5.411666,1.989303],[-2.987299,7.320765,-0.629479],[-3.757635,3.274862,-0.744022],[3.487044,2.541999,-0.699933],[-4.53274,4.649505,0.77093],[-1.424192,0.099423,2.633327],[3.090867,2.476975,-1.146957],[-2.713256,0.815622,2.17311],[3.348121,3.254167,-0.984896],[-3.031379,0.16453,-0.309937],[-0.949757,4.518137,-1.309172],[-0.889509,0.095256,1.288803],[3.539594,1.966105,-0.553965],[-4.60612,7.127749,0.811958],[-2.332953,1.444713,1.624548],[3.136293,2.95805,-1.138272],[3.540808,3.069058,-0.735285],[3.678852,2.362375,-0.452543],[-4.648898,7.37438,0.954791],[-0.646871,0.19037,3.344746],[2.2825,0.29343,-0.826273],[-4.422291,7.183959,0.557517],[-4.694668,5.246103,2.541768],[-4.583691,4.145486,0.600207],[-2.934854,7.912513,-1.539269],[-3.067861,7.817472,-0.546501],[3.825095,3.229512,-0.237547],[2.532494,0.323059,2.387105],[-2.514583,0.692857,1.23597],[-4.736805,7.214384,1.259421],[-2.98071,8.409903,-2.468199],[2.621468,1.385844,-1.406355],[3.811447,3.560855,1.847828],[3.432925,1.497205,-0.489784],[3.746609,3.631538,-0.39067],[3.594909,2.832257,-0.576012],[-0.404192,5.300188,-0.856561],[-4.762996,6.483774,1.702648],[-4.756612,6.786223,1.43682],[-2.965309,8.437217,-2.785495],[2.863867,0.74087,-0.429684],[4.02503,2.968753,1.392419],[3.669036,1.833858,-0.304971],[-2.888864,0.720537,0.778057],[-2.36982,0.979443,1.054447],[-2.959259,8.222303,-2.659724],[-3.467825,7.545739,-2.333445],[2.153426,0.446256,-1.20523],[-3.229807,9.189699,-3.596609],[-3.72486,8.773707,-2.046671],[3.687218,3.297751,-0.523746],[1.381025,0.08815,-1.185668],[-2.796828,7.205622,-0.208783],[3.647194,4.066232,-0.291507],[-4.578376,3.885556,1.52546],[-2.840262,0.63094,1.89499],[-2.429514,0.922118,1.820781],[-4.675079,6.573925,2.423363],[2.806207,4.320188,-1.027372],[-1.289608,0.097241,1.321661],[-3.010731,8.141334,-2.866148],[3.202291,1.235617,-0.549025],[4.094792,2.477519,0.304581],[2.948403,0.966873,-0.664857],[-4.83297,5.920587,2.095461],[-2.169693,7.257277,0.946184],[-1.335807,3.057597,-1.303166],[-1.037877,0.64151,-1.685271],[2.627919,0.089814,0.439074],[3.815794,3.808102,1.730493],[-2.973455,8.433141,-3.08872],[-2.391558,7.331428,1.658264],[-4.333107,4.529978,1.850516],[-4.640293,3.767107,1.168841],[3.600716,4.46931,1.734024],[3.880803,1.730158,-0.172736],[3.814183,4.262372,1.167042],[4.37325,0.829542,1.413729],[2.490447,5.75111,0.011492],[3.460003,4.962436,1.188971],[3.918419,3.814234,1.358271],[-0.807595,8.840504,-0.953711],[3.752855,4.20577,1.57177],[-2.991085,8.816501,-3.244595],[-2.333196,7.128889,1.551985],[3.977718,3.570941,1.25937],[4.360071,0.755579,1.079916],[4.637579,1.027973,1.032567],[-2.317,7.421066,1.329589],[-1.013404,8.293662,-0.7823],[4.548023,1.020644,1.420462],[4.763258,1.266798,1.296203],[4.896,2.073084,1.255213],[4.015005,3.325226,1.093879],[4.94885,1.860936,0.894463],[-2.189645,6.954634,1.270077],[4.887442,1.720992,1.288526],[-3.184068,7.871802,0.956189],[-1.274318,0.839887,-1.224389],[-2.919521,7.84432,0.541629],[-2.994586,7.766102,1.96867],[-3.417504,9.241714,-3.093201],[-3.174563,7.466456,2.473617],[-3.263067,9.069412,-3.003459],[-2.841592,0.529833,2.693434],[-3.611069,9.158804,-2.829871],[-4.642828,5.927526,0.320549],[-3.809308,9.051035,-2.692749],[-2.837582,7.487987,-0.106206],[4.773025,2.330442,1.213899],[4.897435,2.209906,0.966657],[-3.067637,8.164062,-1.12661],[-3.122129,8.08074,-0.899194],[4.571019,2.358113,1.462054],[4.584884,2.454418,0.709466],[-3.661093,7.146581,-0.475948],[4.735131,2.415859,0.933939],[4.207556,2.540018,1.218293],[-3.607595,7.89161,-0.121172],[-1.527952,0.775564,-1.061903],[4.53874,2.503273,1.099583],[-3.938837,7.587988,0.082449],[-4.853582,6.152409,1.787943],[-4.752214,6.247234,2.296873],[4.602935,2.363955,0.488901],[-1.81638,6.365879,0.868272],[0.595467,4.744074,-1.32483],[1.87635,3.511986,-1.842924],[4.330947,2.534326,0.720503],[4.108736,2.750805,0.904552],[-1.890939,8.492628,-0.290768],[-3.504309,6.173058,-0.422804],[-1.611992,6.196732,0.648736],[-3.899149,7.826123,1.088845],[-3.078303,3.008813,-1.035784],[-2.798999,7.844899,1.340061],[-1.248839,5.959105,0.041761],[0.767779,4.337318,3.090817],[-3.831177,7.515605,2.432261],[-1.667528,6.156208,0.365267],[-1.726078,6.237384,1.100059],[-3.972037,4.520832,-0.370756],[-4.40449,7.636357,1.520425],[-1.34506,6.004054,1.293159],[-1.233556,6.049933,0.500651],[-3.696869,7.79732,0.37979],[-3.307798,8.949964,-2.698113],[-1.997295,6.615056,1.103691],[-3.219222,8.336394,-1.150614],[-3.452623,8.31866,-0.9417],[-3.94641,2.990494,2.212592],[-3.250025,8.030414,-0.596097],[-2.02375,1.571333,2.397939],[-3.190358,7.665013,2.268183],[-2.811918,7.618526,2.145587],[-1.005265,5.892303,0.072158],[-0.93721,5.974148,0.906669],[-4.646072,7.492193,1.45312],[-0.252931,1.797654,3.140638],[-1.076064,5.738433,1.695953],[-3.980534,7.744391,1.735791],[-0.721187,5.939396,0.526032],[-0.42818,5.919755,0.229001],[-1.43429,6.11622,0.93863],[-0.985638,5.939683,0.290636],[-4.433836,7.461372,1.966437],[-3.696398,7.844859,1.547325],[-3.390772,7.820186,1.812204],[-2.916787,7.864019,0.804341],[-3.715952,8.037269,-0.591341],[-4.204634,7.72919,1.119866],[-4.592233,5.592883,0.246264],[3.307299,5.061701,1.622917],[-3.515159,7.601467,2.368914],[-3.435742,8.533457,-1.37916],[-0.269421,4.545635,-1.366445],[-2.542124,3.768736,-1.258512],[-3.034003,7.873773,1.256854],[-2.801399,7.856028,1.080137],[3.29354,5.220894,1.081767],[-2.35109,1.299486,1.01206],[-3.232213,7.768136,2.047563],[3.290415,5.217525,0.68019],[-3.415109,7.731034,2.144326],[3.440357,4.962463,0.373387],[3.147346,5.352121,1.386923],[2.847252,5.469051,1.831981],[3.137682,5.410222,1.050188],[3.102694,5.310456,1.676434],[-3.044601,0.39515,1.994084],[2.903647,5.561338,1.518598],[-3.810148,8.093598,-0.889131],[4.234835,0.803054,1.593271],[3.240165,5.228747,0.325955],[3.037452,5.509825,0.817137],[2.635031,5.795187,1.439724],[3.071607,5.318303,0.080142],[2.909167,5.611751,1.155874],[3.044889,5.465928,0.486566],[2.502256,5.770673,1.740054],[-0.067497,0.086416,-1.190239],[2.33326,5.906051,0.138295],[0.65096,4.205423,3.308767],[-2.671137,7.936535,0.432731],[2.14463,5.879214,1.866047],[-4.776469,5.890689,0.561986],[2.72432,5.655145,0.211951],[2.730488,5.751455,0.695894],[2.572682,5.869295,1.152663],[1.906776,5.739123,2.196551],[2.344414,5.999961,0.772922],[-3.377905,7.448708,-1.863251],[2.285149,5.968156,1.459258],[2.385989,5.928974,0.3689],[2.192111,6.087516,0.959901],[2.36372,6.001101,1.074346],[1.972022,6.079603,1.591175],[1.87615,5.976698,1.91554],[-3.824761,9.05372,-2.928615],[2.044704,6.129704,1.263111],[-2.583046,0.849537,2.497344],[-0.078825,2.342205,3.520322],[-0.704686,0.537165,3.397194],[-0.257449,3.235334,3.647545],[-0.332064,1.448284,3.022583],[-2.200146,0.898284,-0.447212],[-2.497508,1.745446,1.829167],[0.30702,4.416315,2.978956],[-3.205197,3.479307,-1.040582],[0.110069,9.347725,-1.563686],[-0.82754,0.883886,3.065838],[-2.017103,1.244785,2.42512],[-0.421091,2.309929,3.153898],[-0.491604,3.796072,3.16245],[2.786955,3.501241,-1.340214],[-3.229055,4.380713,-0.899241],[3.730768,0.76845,1.90312],[-0.561079,2.652382,3.152463],[-3.461471,3.086496,2.662505],[-0.661405,3.446009,3.179939],[-0.915351,0.636755,3.243708],[-2.992964,8.915628,-3.729833],[-0.439627,3.502104,3.42665],[-1.154217,0.883181,2.800835],[-1.736193,1.465474,2.595489],[-0.423928,3.24435,3.548277],[-0.511153,2.871046,3.379749],[-0.675722,2.991756,3.143262],[-1.092602,0.599103,3.090639],[-0.89821,2.836952,2.840023],[-2.658412,0.781376,0.960575],[-2.271455,1.222857,1.330478],[-0.877861,1.111222,2.72263],[-0.306959,2.876987,3.556044],[-3.839274,7.84138,-0.918404],[-0.172094,4.083799,3.141708],[-1.548332,0.2529,2.864655],[-0.217353,4.873911,-1.223104],[-3.384242,3.181056,-0.95579],[-2.731704,0.382421,2.895502],[-1.285037,0.551267,2.947675],[0.077224,4.246579,3.066738],[-0.479979,1.77955,2.860011],[-0.716375,1.224694,2.666751],[-0.54622,3.138255,3.393457],[-2.33413,1.821222,2.124883],[-0.50653,2.037147,2.897465],[2.451291,1.211389,-1.466589],[-3.160047,2.894081,2.724286],[-4.137258,5.433431,3.21201],[0.462896,0.320456,-0.174837],[-0.37458,2.609447,3.379253],[-3.095244,0.256205,2.196446],[-4.197985,5.732991,3.262924],[-0.729747,0.246036,0.497036],[-2.356189,5.062,-0.965619],[-1.609036,0.25962,-1.487367],[-4.074381,6.074061,3.409459],[-3.619304,4.0022,2.65705],[-0.543393,8.742896,-1.056622],[-4.30356,6.858934,2.879642],[-0.716688,2.901831,-2.11202],[1.547362,0.083189,1.138764],[-0.250916,0.275268,1.201344],[-3.778035,3.13624,2.466177],[-4.594316,5.771342,3.01694],[-3.717706,3.442887,2.603344],[-4.311163,5.224669,3.019373],[-0.610389,2.095161,-1.923515],[-3.040086,6.196918,-0.429149],[-3.802695,3.768247,2.545523],[-0.159541,2.043362,3.328549],[-3.744329,4.31785,2.491889],[-3.047939,0.214155,1.873639],[-4.41685,6.113058,3.166774],[-1.165133,0.460692,-1.742134],[-1.371289,4.249996,-1.317935],[-3.447883,0.3521,0.466205],[-4.495555,6.465548,2.944147],[-3.455335,0.171653,0.390816],[-3.964028,4.017196,2.376009],[-1.323595,1.763126,-0.750772],[-3.971142,5.277524,-0.19496],[-3.222052,0.237723,0.872229],[-4.403784,3.89107,1.872077],[-3.333311,0.342997,0.661016],[-4.495871,4.29606,1.63608],[-3.636081,2.760711,2.361949],[-4.487235,3.559608,1.66737],[-4.719787,7.26888,1.658722],[-1.086143,9.035741,-0.707144],[-2.339693,1.600485,-0.404817],[-4.642011,7.123829,1.990987],[-1.498077,3.854035,-1.369787],[-4.188372,4.729363,2.02983],[-3.116344,5.882284,-0.468884],[-4.305236,4.246417,1.976991],[-3.022509,0.22819,1.065688],[-2.799916,0.52022,1.128319],[-4.262823,3.534409,2.020383],[-4.221533,3.947676,2.11735],[-3.744353,4.391712,-0.6193],[-1.272905,0.156694,-1.741753],[-3.62491,2.669825,-0.549664],[-4.180756,3.096179,1.987215],[-4.059276,4.305313,2.232924],[-2.812753,0.183226,1.370267],[-4.032437,3.512234,2.309985],[-0.03787,0.28188,0.530391],[-4.711562,5.468653,2.822838],[-4.500636,6.953314,2.564445],[-4.479433,7.216991,2.270682],[3.990562,0.50522,0.716309],[-2.512229,6.863447,-0.100658],[-2.968058,6.956639,-0.37061],[2.550375,3.142683,-1.54068],[-2.320059,3.521605,-1.279397],[-4.556319,6.64662,2.745363],[-4.281091,7.108116,2.667598],[-2.050095,8.411689,0.121353],[-2.44854,1.135487,0.851875],[3.121815,0.699943,-0.277167],[-4.69877,6.00376,2.843035],[-1.360599,8.824742,-0.595597],[1.128437,0.171611,0.301691],[-4.360146,6.289423,0.042233],[1.400795,4.088829,-1.620409],[-3.193462,8.460137,-3.559446],[-3.168771,8.878431,-3.635795],[-3.434275,9.304302,-3.460878],[-3.349993,8.808093,-3.38179],[-3.304823,8.323865,-3.325905],[-3.572607,9.308843,-3.207672],[-3.166393,8.201215,-3.43014],[-3.451638,9.05331,-3.351345],[-3.309591,8.549758,-3.375055],[-3.527992,8.793926,-3.100376],[-3.6287,8.981677,-3.076319],[-3.445505,8.001887,-2.8273],[-3.408011,8.221014,-3.039237],[-3.65928,8.740382,-2.808856],[-3.878019,8.797295,-2.462866],[-3.515132,8.232341,-2.747739],[-3.460331,8.51524,-3.06818],[-3.403703,7.658628,-2.648789],[-3.507113,8.00159,-2.582275],[-3.607373,8.174737,-2.401723],[-3.749043,8.378084,-2.226959],[-3.648514,8.502213,-2.6138],[-2.534199,0.904753,2.021148],[1.4083,5.744252,-0.571402],[-3.852536,8.571009,-2.352358],[2.868255,5.373126,-0.163705],[2.224363,4.669891,-1.061586],[-4.528281,4.885838,1.340274],[1.30817,4.609629,-1.28762],[-4.519698,3.422501,1.354826],[-3.549955,7.783228,-2.332859],[1.12313,6.120856,0.045115],[-3.620324,7.57716,-2.033423],[-0.798833,2.624133,-1.992682],[-3.617587,7.783148,-2.051383],[-3.669293,8.103776,-2.10227],[-3.892417,8.667436,-2.167288],[-0.537435,0.285345,-0.176267],[-0.841522,3.299866,-1.887861],[-0.761547,3.647082,-1.798953],[-3.661544,7.85708,-1.867924],[-3.886763,8.551783,-1.889171],[-0.591244,1.549749,-1.714784],[-0.775276,1.908218,-1.597609],[-0.961458,2.573273,-1.695549],[-2.215672,1.335009,2.143031],[-4.622674,4.130242,1.220683],[1.07344,0.290099,1.584734],[-0.976906,2.92171,-1.76667],[-1.13696,3.194401,-1.513455],[-3.743262,7.99949,-1.629286],[-2.876359,4.900986,-0.879556],[0.550835,3.905557,-2.031372],[0.777647,4.992314,-1.215703],[1.445881,4.266201,-1.414663],[1.274222,5.510543,-0.824495],[-0.864685,2.318581,-1.702389],[-0.627458,3.820722,-1.743153],[-3.867699,8.30866,-1.850066],[1.635287,5.45587,-0.83844],[-1.037876,2.538589,-1.513504],[-4.38993,4.73926,1.699639],[0.048709,4.765232,-1.279506],[-0.626548,1.339887,-1.595114],[-3.682827,7.643453,-1.723398],[-3.868783,8.180191,-1.511743],[-0.76988,1.508373,-1.419599],[-1.138374,2.766765,-1.448163],[1.699883,5.780752,-0.475361],[1.214305,0.308517,1.866405],[-1.713642,0.373461,-1.265204],[-1.582388,0.58294,-1.267977],[-0.879549,1.821581,-1.313787],[0.519057,5.858757,-0.381397],[-3.770989,2.449208,-0.132655],[0.087576,0.156713,-1.53616],[-0.942622,2.146534,-1.421494],[-1.026192,1.022164,-1.145423],[-0.964079,1.645473,-1.067631],[-1.109128,2.458789,-1.29106],[-1.037478,0.209489,-1.805424],[-3.724391,7.599686,-1.273458],[-3.787898,7.951792,-1.304794],[3.821677,2.165581,-0.181535],[-2.39467,0.304606,-0.570375],[-2.352928,1.0439,2.079369],[-0.288899,9.640684,-1.006079],[-3.472118,7.263001,-1.080326],[-1.240769,0.972352,-0.976446],[-1.845253,0.356801,-0.995574],[-2.32279,7.915361,-0.057477],[-1.08092,2.179315,-1.168821],[4.598833,2.156768,0.280264],[-4.725417,6.442373,2.056809],[-0.490347,9.46429,-0.981092],[-1.99652,0.09737,-0.765828],[-1.137793,1.888846,-0.894165],[-0.37247,4.29661,-1.465199],[-0.184631,5.692946,-0.421398],[-3.751694,7.742231,-1.086908],[-1.001416,1.298225,-0.904674],[-3.536884,7.190777,-0.788609],[-3.737597,7.511281,-0.940052],[-1.766651,0.669388,-0.873054],[3.112245,3.474345,-1.129672],[-0.175504,3.81298,-2.0479],[-3.766762,7.412514,-0.681569],[-0.63375,9.439424,-0.785128],[-0.518199,4.768982,-1.258625],[0.790619,4.212759,-1.610218],[-3.761951,3.742528,-0.756283],[0.897483,5.679808,-0.612423],[2.221126,4.427468,-1.252155],[-0.728577,5.846457,0.062702],[0.194451,9.503908,-1.482461],[-0.099243,9.385459,-1.39564],[0.643185,3.636855,-2.180247],[0.894522,5.900601,-0.356935],[2.595516,4.75731,-0.893245],[1.108497,3.936893,-1.905098],[1.989894,5.789726,-0.343268],[-3.802345,7.655508,-0.613817],[2.339353,4.96257,-0.90308],[0.12564,4.013324,-1.879236],[-4.078965,3.683254,-0.445439],[2.092899,5.256128,-0.831607],[0.427571,0.291769,1.272964],[2.335549,3.480056,-1.581949],[-0.15687,0.324827,-1.648922],[-0.536522,5.760786,-0.203535],[1.507082,0.078251,-0.923109],[-1.854742,0.134826,2.698774],[-3.939827,3.168498,-0.526144],[-3.98461,3.39869,-0.533212],[-3.961738,4.217132,-0.489147],[4.273789,2.181164,0.153786],[-0.470498,5.645664,-0.439079],[-0.414539,5.488017,-0.673379],[-0.097462,5.062739,-1.114863],[1.198092,5.882232,-0.391699],[2.855834,5.085022,-0.498678],[1.037998,4.129757,-1.701811],[1.728091,5.068444,-1.063761],[-3.832258,2.625141,-0.311384],[-4.078526,3.070256,-0.284362],[-4.080365,3.954243,-0.440471],[-0.152578,5.276267,-0.929815],[-1.489635,8.928082,-0.295891],[0.759294,5.15585,-1.087374],[-4.000338,2.801647,-0.235135],[-4.290801,3.823209,-0.19374],[-4.221493,4.25618,-0.189894],[-4.066195,4.71916,-0.201724],[-0.155386,4.076396,-1.662865],[3.054571,4.414305,-0.825985],[-1.652919,8.726499,-0.388504],[-3.042753,0.560068,-0.126425],[-2.434456,1.118088,-0.213563],[-2.623502,1.845062,-0.283697],[-4.233371,3.43941,-0.202918],[2.726702,3.82071,-1.280097],[0.184199,4.14639,-1.673653],[-1.289203,0.624562,-1.560929],[-3.823676,7.382458,-0.407223],[0.476667,5.064419,-1.143742],[-3.873651,4.955112,-0.269389],[1.349666,5.312227,-1.000274],[-2.043776,8.434488,-0.108891],[-2.763964,0.733395,-0.129294],[-4.380505,3.664409,-0.024546],[-0.71211,5.341811,-0.803281],[-3.960858,7.183112,-0.118407],[-3.822277,7.712853,-0.263221],[-2.346808,8.108588,0.063244],[-1.841731,8.642999,-0.142496],[-2.600055,0.985604,-0.043595],[-3.513057,2.213243,-0.044151],[-3.963492,2.603055,-0.080898],[-4.258066,3.14537,-0.027046],[-4.261572,5.00334,0.13004],[0.795464,3.99873,-1.905688],[-3.300873,0.384761,0.013271],[-2.770244,0.881942,0.077313],[-3.456227,1.993871,0.301054],[-4.441987,3.914144,0.177867],[-4.367075,6.611414,0.165312],[-3.201767,0.576292,0.105769],[-3.174354,0.645009,0.440373],[-2.996576,0.74262,0.161325],[-2.724979,1.656497,0.092983],[-3.261757,2.017742,-0.070763],[-4.280173,4.518235,-0.002999],[-4.471073,5.945358,0.05202],[-3.877137,2.40743,0.274928],[-4.371219,4.252758,0.078039],[-3.400914,0.40983,0.238599],[-4.44293,3.523242,0.146339],[-4.574528,5.279761,0.353923],[-4.226643,7.191282,0.269256],[-4.16361,2.843204,0.097727],[-4.528506,5.011661,0.536625],[0.35514,5.664802,-0.572814],[2.508711,5.580976,-0.266636],[2.556226,3.633779,-1.426362],[1.878456,4.533714,-1.223744],[2.460709,4.440241,-1.1395],[2.218589,5.514603,-0.560066],[2.263712,5.737023,-0.250694],[2.964981,3.814858,-1.139927],[0.991384,5.304131,-0.999867],[2.81187,4.547292,-0.916025],[2.918089,4.768382,-0.702808],[3.262403,4.414286,-0.657935],[0.652136,6.089113,0.069089],[3.361389,3.5052,-0.946123],[2.613042,5.037192,-0.697153],[0.094339,4.36858,-1.451238],[3.290862,4.155716,-0.732318],[2.658063,4.073614,-1.217455],[3.260349,3.753257,-0.946819],[1.124268,4.862463,-1.207855],[3.35158,4.899247,-0.027586],[3.194057,4.691257,-0.524566],[3.090119,5.116085,-0.23255],[2.418965,3.811753,-1.419399],[2.191789,3.877038,-1.47023],[4.043166,2.034188,0.015477],[-1.026966,0.86766,-1.410912],[1.937563,3.860005,-1.617465],[2.98904,4.101806,-0.998132],[-0.142611,5.865305,-0.100872],[3.972673,2.292069,0.089463],[3.23349,3.959925,-0.849829],[0.16304,5.857276,-0.216704],[4.122964,1.770061,-0.114906],[2.099057,4.978374,-0.98449],[3.502411,3.76181,-0.667502],[2.079484,5.939614,-0.036205],[-0.084568,3.525193,-2.253506],[0.423859,4.06095,-1.845327],[1.6013,6.006466,-0.153429],[0.271701,3.844964,-2.078748],[0.273577,5.218904,-0.994711],[-0.410578,3.92165,-1.773635],[1.941954,5.60041,-0.621569],[0.100825,5.462131,-0.774256],[-0.53016,3.619892,-2.027451],[-0.822371,5.517453,-0.605747],[-2.474925,7.670892,-0.020174],[4.01571,0.830194,-0.013793],[-0.400092,5.094112,-1.041992],[-2.887284,5.581246,-0.525324],[-1.559841,6.050972,0.079301],[-0.469317,3.291673,-2.235211],[0.337397,3.467926,-2.295458],[-2.632074,5.573701,-0.582717],[-0.030318,6.011395,0.276616],[-0.934373,0.388987,-1.780523],[-2.661263,5.844838,-0.425966],[0.549353,5.489646,-0.807268],[-2.194355,6.197491,-0.109322],[-2.289618,5.664813,-0.581098],[1.583583,3.796366,-1.844498],[0.855295,0.215979,-1.425557],[-2.627569,5.300236,-0.767174],[4.333347,2.384332,0.399129],[-1.880401,5.583843,-0.696561],[-2.172346,5.324859,-0.846246],[-2.27058,5.906265,-0.388373],[-1.960049,5.889346,-0.397593],[0.965756,3.67547,-2.105671],[-2.014066,6.431125,0.287254],[-1.776173,5.287097,-0.89091],[-2.025852,5.089562,-0.980218],[-1.886418,6.108358,-0.000667],[-1.600803,5.785347,-0.491069],[-1.66188,4.968053,-1.042535],[-1.600621,5.962818,-0.188044],[-1.588831,5.615418,-0.665456],[4.46901,1.880138,0.057248],[-1.978845,0.927399,-0.554856],[-1.408074,5.325266,-0.83967],[1.923123,4.843955,-1.101389],[-2.87378,0.117106,-0.412735],[-1.222193,5.62638,-0.539981],[-2.632537,0.166349,-0.489218],[-1.370865,5.838832,-0.341026],[-1.067742,5.448874,-0.692701],[-1.073798,5.220878,-0.908779],[-1.147562,4.950417,-1.079727],[-2.789115,4.531047,-1.042713],[-3.550826,4.170487,-0.806058],[-3.331694,4.798177,-0.69568],[-3.689404,4.688543,-0.534317],[-3.511509,5.106246,-0.483632],[1.796344,0.076137,0.080455],[-3.306354,5.473605,-0.478764],[-2.692503,3.346604,-1.20959],[-3.963056,5.187462,3.113156],[-3.901231,6.391477,-0.246984],[4.484234,1.518638,-0.001617],[4.308829,1.657716,-0.119275],[4.290045,1.339528,-0.110626],[-3.514938,3.524974,-0.909109],[-2.1943,2.12163,-0.71966],[4.108206,1.091087,-0.11416],[3.785312,1.392435,-0.28588],[4.092886,1.480476,-0.210655],[-2.965937,6.469006,-0.379085],[-3.708581,2.962974,-0.63979],[-3.297971,2.218917,-0.299872],[3.806949,0.804703,-0.11438],[3.747957,1.059258,-0.273069],[-3.101827,4.111444,-1.006255],[-1.536445,4.658913,-1.195049],[-3.549826,2.450555,-0.375694],[-3.676495,2.108366,0.534323],[-3.674738,5.925075,-0.400011],[-2.250115,2.848335,-1.121174],[-3.698062,5.667567,-0.381396],[3.468966,0.734643,-0.190624],[-3.97972,5.670078,-0.26874],[-3.002087,4.337837,-1.033421],[-3.356392,2.608308,-0.713323],[-1.833016,3.359983,-1.28775],[-1.989069,3.632416,-1.305607],[3.591254,0.542371,0.026146],[3.364927,1.082572,-0.342613],[-3.393759,3.866801,-0.937266],[-4.124865,5.549529,-0.161729],[-4.423423,5.687223,0.000103],[-1.496881,2.601785,-1.114328],[-2.642297,6.496932,-0.264175],[-3.684236,6.819423,-0.320233],[-2.286996,3.167067,-1.246651],[-1.624896,8.44848,-0.530014],[-3.666787,2.159266,0.268149],[-2.402625,2.011243,-0.56446],[-2.736166,2.259839,-0.6943],[-2.168611,3.89078,-1.292206],[-2.065956,3.345708,-1.281346],[-2.778147,2.675605,-0.995706],[-3.507431,4.513272,-0.71829],[-2.301184,4.293911,-1.238182],[3.205808,0.211078,0.394349],[-2.129936,4.870577,-1.080781],[-2.287977,2.496593,-0.934069],[-2.701833,2.931814,-1.114509],[3.294795,0.50631,-0.081062],[-2.552829,7.468771,-0.021541],[3.06721,0.944066,-0.43074],[-2.86086,1.973622,-0.303132],[-3.598818,5.419613,-0.401645],[-1.524381,0.080156,-1.61662],[-1.907291,2.646274,-1.039438],[2.950783,0.407562,-0.105407],[-1.663048,1.655038,-0.689787],[-1.728102,1.110064,-0.635963],[-2.085823,7.686296,-0.159745],[2.883518,3.157009,-1.30858],[-2.724116,0.417169,-0.389719],[-1.788636,7.862672,-0.346413],[-2.186418,1.249609,-0.434583],[-3.092434,2.606657,-0.860002],[-1.737314,3.874201,-1.330986],[2.564522,0.422967,-0.390903],[1.670782,3.538432,-1.924753],[-2.338131,4.02578,-1.286673],[-1.916516,4.054121,-1.301788],[2.87159,2.034949,-1.267139],[-1.931518,3.062883,-1.197227],[-0.816602,0.135682,3.104104],[0.469392,0.213916,-1.489608],[2.574055,1.950091,-1.514427],[2.733595,2.682546,-1.461213],[-1.915407,4.693647,-1.151721],[-3.412883,5.867094,-0.450528],[2.28822,0.120432,-0.04102],[2.244477,0.14424,-0.376933],[-1.676198,3.570698,-1.328031],[-1.821193,4.366982,-1.266271],[-1.552208,8.099221,-0.53262],[-1.727419,2.39097,-0.989456],[-2.468226,4.711663,-1.069766],[-2.451669,6.113319,-0.273788],[2.635447,2.295842,-1.518361],[-2.020809,8.150253,-0.246714],[2.292455,0.805596,-1.3042],[2.641556,1.65665,-1.466962],[2.409062,2.842538,-1.635025],[2.456682,1.459484,-1.57543],[-1.691047,3.173582,-1.247082],[-1.865642,1.957608,-0.768683],[-3.401579,0.20407,0.100932],[2.301981,1.7102,-1.650461],[2.342929,2.611944,-1.690713],[-1.676111,2.923894,-1.17835],[-2.992039,3.547631,-1.118945],[-3.571677,6.504634,-0.375455],[2.141764,1.460869,-1.702464],[-3.221958,5.146049,-0.615632],[2.19238,2.949367,-1.747242],[2.320791,2.232971,-1.706842],[2.088678,2.585235,-1.813159],[-2.196404,0.592218,-0.569709],[-2.120811,1.836483,-0.62338],[-1.949935,2.271249,-0.874128],[2.235901,1.110183,-1.510719],[2.020157,3.241128,-1.803917],[2.054336,1.949394,-1.792332],[-3.094117,4.996595,-0.740238],[2.038063,0.635949,-1.402041],[1.980644,1.684408,-1.76778],[1.587432,3.306542,-1.991131],[1.935322,0.976267,-1.602208],[1.922621,1.235522,-1.698813],[1.712495,1.911874,-1.903234],[1.912802,2.259273,-1.888698],[1.884367,0.355453,-1.312633],[1.676427,0.76283,-1.539455],[1.78453,2.83662,-1.943035],[1.697312,0.120281,-1.150324],[1.648318,2.484973,-1.999505],[-4.051804,5.958472,-0.231731],[-1.964823,1.464607,-0.58115],[1.55996,2.183486,-1.971378],[1.628125,1.045912,-1.707832],[1.701684,1.540428,-1.827156],[1.567475,4.869481,-1.184665],[1.432492,0.843779,-1.648083],[1.173837,2.978983,-2.156687],[1.235287,3.37975,-2.09515],[1.252589,1.525293,-1.949205],[1.159334,2.336379,-2.105361],[1.49061,2.695263,-2.083216],[-4.122486,6.782604,-0.02545],[1.173388,0.279193,-1.423418],[1.505684,0.380815,-1.414395],[1.391423,1.343031,-1.843557],[1.263449,2.73225,-2.144961],[1.295858,0.597122,-1.515628],[1.245851,3.729126,-1.993015],[-2.761439,6.23717,-0.365856],[0.978887,1.664888,-2.046633],[1.219542,0.982729,-1.785486],[1.315915,1.91748,-2.02788],[-3.052746,2.127222,-0.369082],[0.977656,1.36223,-1.944119],[0.936122,3.39447,-2.203007],[-2.740036,4.184702,-1.122849],[0.853581,2.864694,-2.260847],[0.719569,0.818762,-1.763618],[0.839115,1.159359,-1.907943],[0.932069,1.94559,-2.117962],[0.579321,3.326747,-2.299369],[0.86324,0.597822,-1.565106],[0.574567,1.158452,-1.943123],[0.525138,2.137252,-2.213867],[0.779941,2.342019,-2.206157],[0.915255,2.618102,-2.209041],[0.526426,3.02241,-2.321826],[0.495431,2.521396,-2.295905],[0.80799,3.156817,-2.286432],[0.273556,1.304936,-2.012509],[0.664326,1.530024,-2.048722],[0.219173,2.32907,-2.323212],[0.405324,0.695359,-1.704884],[0.398827,0.946649,-1.843899],[0.345109,1.608829,-2.100174],[-2.356743,0.062032,-0.4947],[-3.001084,0.27146,2.560034],[-2.064663,0.303055,-0.697324],[0.221271,3.174023,-2.374399],[0.195842,0.437865,-1.621473],[-0.385613,0.297763,1.960096],[1.999609,0.108928,-0.79125],[0.351698,9.227494,-1.57565],[0.021477,2.191913,-2.309353],[0.246381,2.836575,-2.356365],[1.543281,0.237539,1.901906],[0.031881,9.147022,-1.454203],[-0.001881,1.648503,-2.108044],[0.333423,1.907088,-2.204533],[0.044063,2.634032,-2.368412],[-0.028148,3.053684,-2.390082],[0.02413,3.34297,-2.36544],[-0.272645,9.02879,-1.238685],[-0.006348,0.832044,-1.758222],[-0.321105,1.458754,-1.886313],[-0.153948,8.618809,-1.105353],[-0.409303,1.137783,-1.720556],[-0.410054,1.742789,-1.957989],[-0.287905,2.380404,-2.294509],[-0.261375,2.646629,-2.356322],[-0.221986,3.215303,-2.345844],[-0.31608,0.687581,-1.71901],[-0.537705,0.855802,-1.648585],[-0.142834,1.193053,-1.87371],[-0.24371,2.044435,-2.176958],[-0.437999,2.959748,-2.299698],[-0.78895,0.176226,-1.729046],[-0.608509,0.546932,-1.734032],[-0.693698,4.478782,-1.369372],[-0.669153,8.469645,-0.911149],[-0.741857,1.082705,-1.458474],[-0.554059,2.440325,-2.141785],[2.09261,0.153182,2.57581],[1.792547,0.111794,2.563777],[1.855787,0.189541,2.835089],[1.492601,0.232246,2.987681],[-0.284918,0.236687,3.429738],[2.604841,0.11997,1.01506],[0.331271,0.168113,3.124031],[0.280606,0.308368,2.495937],[0.544591,0.325711,2.081274],[0.193145,0.19154,-0.977556],[3.810099,0.42324,1.032202],[3.54622,0.379245,1.392814],[0.61402,0.276328,0.849356],[-1.198628,0.144953,2.911457],[4.17199,0.68037,1.391526],[0.88279,0.321339,2.059129],[1.93035,0.109992,2.054154],[1.620331,0.121986,2.37203],[2.374812,0.10921,1.734876],[-0.031227,0.294412,2.593687],[4.075018,0.561914,1.038065],[-0.570366,0.126583,2.975558],[0.950052,0.318463,1.804012],[1.130034,0.117125,0.98385],[2.123049,0.08946,1.665911],[2.087572,0.068621,0.335013],[2.927337,0.167117,0.289611],[0.528876,0.313434,3.205969],[1.174911,0.162744,1.328262],[-4.88844,5.59535,1.661134],[-4.709607,5.165338,1.324082],[0.871199,0.277021,1.263831],[-3.910877,2.349318,1.272269],[1.56824,0.118605,2.768112],[1.179176,0.152617,-0.858003],[1.634629,0.247872,2.128625],[-4.627425,5.126935,1.617836],[3.845542,0.54907,1.45601],[2.654006,0.165508,1.637169],[-0.678324,0.26488,1.974741],[2.451139,0.100377,0.213768],[0.633199,0.286719,0.403357],[-0.533042,0.2524,1.373267],[0.99317,0.171106,0.624966],[-0.100063,0.306466,2.170225],[1.245943,0.092351,0.661031],[1.390414,0.198996,-0.0864],[-4.457265,5.030531,2.138242],[2.89776,0.146575,1.297468],[1.802703,0.088824,-0.490405],[1.055447,0.309261,2.392437],[2.300436,0.142429,2.104254],[2.33399,0.187756,2.416935],[2.325183,0.134349,0.574063],[2.410924,0.370971,2.637115],[1.132924,0.290511,3.061],[1.764028,0.070212,-0.80535],[2.156994,0.397657,2.844061],[0.920711,0.225527,-0.882456],[-4.552135,5.24096,2.85514],[0.210016,0.309396,2.064296],[0.612067,0.136815,-1.086002],[3.150236,0.426757,1.802703],[-0.24824,0.282258,1.470997],[0.974269,0.301311,-0.640898],[-4.401413,5.03966,2.535553],[0.644319,0.274006,-0.817806],[0.332922,0.309077,0.108474],[3.610001,0.317447,0.689353],[3.335681,0.358195,0.118477],[0.623544,0.318983,-0.4193],[-0.11012,0.307747,1.831331],[-0.407528,0.291044,2.282935],[0.069783,0.285095,0.950289],[0.970135,0.310392,-0.283742],[0.840564,0.306898,0.098854],[-0.541827,0.267753,1.683795],[-3.956082,4.55713,2.297164],[-4.161036,2.834481,1.64183],[-4.093952,4.977551,2.747747],[2.661819,0.261867,1.926145],[-3.749926,2.161875,0.895238],[-2.497776,1.3629,0.791855],[0.691482,0.304968,1.582939],[-4.013193,4.830963,2.4769],[-3.639585,2.091265,1.304415],[-3.9767,2.563053,1.6284],[-3.979915,2.788616,1.977977],[0.388782,0.312656,1.709168],[-3.40873,1.877324,0.851652],[-3.671637,5.136974,3.170734],[-3.12964,1.852012,0.157682],[-3.629687,4.852698,2.686837],[-3.196164,1.793459,0.452804],[-3.746338,2.31357,1.648551],[2.992192,0.125251,0.575976],[-3.254051,0.054431,0.314152],[-3.474644,1.925288,1.134116],[-3.418372,2.022882,1.578901],[-2.920955,1.705403,0.29842],[-3.57229,2.152022,1.607572],[-3.251259,0.09013,-0.106174],[-3.299952,1.877781,1.348623],[-3.666819,2.441459,2.004838],[-2.912646,1.824748,-0.045348],[-3.399511,2.479484,2.340393],[-3.009754,0.015286,0.075567],[-3.381443,2.316937,2.156923],[-3.352801,2.133341,1.857366],[-3.01788,1.687685,0.645867],[-2.931857,1.678712,1.158472],[-3.301008,0.08836,0.591001],[1.358025,0.19795,1.599144],[-2.999565,1.845016,1.618396],[-2.767957,0.028397,-0.196436],[-2.93962,2.078779,2.140593],[-3.346648,2.674056,2.518097],[3.324322,0.20822,0.628605],[3.091677,0.137202,0.9345],[-2.881807,0.009952,0.318439],[-2.764946,1.786619,1.693439],[-2.905542,1.932343,1.900002],[-3.140854,2.271384,2.274946],[-2.88995,2.487856,2.574759],[-2.367194,-0.000943,-0.15576],[-3.050738,0.068703,0.742988],[-2.759525,1.55679,0.877782],[-3.151775,2.48054,2.482749],[-2.578618,-0.002885,0.165716],[-2.651618,1.877246,1.981189],[-2.933973,0.133731,1.631023],[1.047628,0.100284,-1.085248],[-1.585123,0.062083,-1.394896],[-2.287917,-0.002671,0.214434],[-2.524899,0.007481,0.471788],[-2.815492,2.188198,2.343294],[-2.095142,-0.003149,-0.094574],[-2.172686,-0.000133,0.47963],[-2.732704,0.074306,1.742079],[-2.49653,2.145668,2.42691],[-1.343683,0.047721,-1.506391],[-2.581185,0.048703,0.975528],[-2.905101,0.083158,2.010052],[-2.601514,2.007801,2.223089],[-2.339464,0.02634,1.484304],[-2.907873,0.10367,2.378149],[-1.368796,0.062516,-1.049125],[-1.93244,0.02443,-0.427603],[-2.705081,0.060513,2.303802],[3.372155,0.206274,0.892293],[-1.761827,0.093202,-1.037404],[-1.700667,0.0397,-0.614221],[-1.872291,0.011979,-0.135753],[-1.929257,0.074005,0.728999],[-2.520128,0.049665,1.99054],[-2.699411,0.10092,2.603116],[3.211701,0.27302,1.423357],[-1.445362,0.1371,-0.626491],[2.921332,0.259112,1.645525],[-0.993242,0.058686,-1.408916],[-0.944986,0.157541,-1.097665],[-2.154301,0.032749,1.882001],[-2.108789,1.988557,2.442673],[-1.015659,0.25497,-0.416665],[-1.898411,0.015872,0.16715],[-1.585517,0.027121,0.453445],[-2.311105,0.061264,2.327061],[-2.637042,0.152224,2.832201],[-2.087515,2.292972,2.617585],[-0.750611,0.056697,-1.504516],[-0.472029,0.075654,-1.360203],[-0.710798,0.139244,-1.183863],[-0.97755,0.26052,-0.831167],[-0.655814,0.260843,-0.880068],[-0.897513,0.275537,-0.133042],[-2.049194,0.084947,2.455422],[-0.177837,0.076362,-1.449009],[-0.553393,0.279083,-0.59573],[-1.788636,0.06163,2.231198],[-0.34761,0.255578,-0.999614],[-1.398589,0.036482,0.65871],[-1.133918,0.05617,0.69473],[-1.43369,0.058226,1.977865],[-2.505459,1.492266,1.19295]]
exports.cells=[[2,1661,3],[1676,7,6],[712,1694,9],[3,1674,1662],[11,1672,0],[1705,0,1],[5,6,1674],[4,5,1674],[7,8,712],[2,1662,10],[1,10,1705],[11,1690,1672],[1705,11,0],[5,1676,6],[7,9,6],[7,712,9],[2,3,1662],[3,4,1674],[1,2,10],[12,82,1837],[1808,12,1799],[1808,1799,1796],[12,861,82],[861,1808,13],[1808,861,12],[1799,12,1816],[1680,14,1444],[15,17,16],[14,1678,1700],[16,17,1679],[15,1660,17],[14,1084,1678],[15,1708,18],[15,18,1660],[1680,1084,14],[1680,15,1084],[15,1680,1708],[793,813,119],[1076,793,119],[1076,1836,22],[23,19,20],[21,1076,22],[21,22,23],[23,20,21],[1076,119,1836],[806,634,470],[432,1349,806],[251,42,125],[809,1171,791],[953,631,827],[634,1210,1176],[157,1832,1834],[56,219,53],[126,38,83],[37,85,43],[59,1151,1154],[83,75,41],[77,85,138],[201,948,46],[1362,36,37],[452,775,885],[1237,95,104],[966,963,1262],[85,77,43],[36,85,37],[1018,439,1019],[41,225,481],[85,83,127],[93,83,41],[935,972,962],[116,93,100],[98,82,813],[41,75,225],[298,751,54],[1021,415,1018],[77,138,128],[766,823,1347],[593,121,573],[905,885,667],[786,744,747],[100,41,107],[604,334,765],[779,450,825],[968,962,969],[225,365,481],[365,283,196],[161,160,303],[875,399,158],[328,1817,954],[62,61,1079],[358,81,72],[74,211,133],[160,161,138],[91,62,1079],[167,56,1405],[56,167,219],[913,914,48],[344,57,102],[43,77,128],[1075,97,1079],[389,882,887],[219,108,53],[1242,859,120],[604,840,618],[754,87,762],[197,36,1362],[1439,88,1200],[1652,304,89],[81,44,940],[445,463,151],[717,520,92],[129,116,100],[1666,1811,624],[1079,97,91],[62,91,71],[688,898,526],[463,74,133],[278,826,99],[961,372,42],[799,94,1007],[100,93,41],[1314,943,1301],[184,230,109],[875,1195,231],[133,176,189],[751,755,826],[101,102,57],[1198,513,117],[748,518,97],[1145,1484,1304],[358,658,81],[971,672,993],[445,151,456],[252,621,122],[36,271,126],[85,36,126],[116,83,93],[141,171,1747],[1081,883,103],[1398,1454,149],[457,121,593],[127,116,303],[697,70,891],[457,891,1652],[1058,1668,112],[518,130,97],[214,319,131],[185,1451,1449],[463,133,516],[1428,123,177],[113,862,561],[215,248,136],[186,42,251],[127,83,116],[160,85,127],[162,129,140],[154,169,1080],[169,170,1080],[210,174,166],[1529,1492,1524],[450,875,231],[399,875,450],[171,141,170],[113,1155,452],[131,319,360],[44,175,904],[452,872,113],[746,754,407],[147,149,150],[309,390,1148],[53,186,283],[757,158,797],[303,129,162],[429,303,162],[154,168,169],[673,164,193],[38,271,75],[320,288,1022],[246,476,173],[175,548,904],[182,728,456],[199,170,169],[168,199,169],[199,171,170],[184,238,230],[246,247,180],[1496,1483,1467],[147,150,148],[828,472,445],[53,108,186],[56,53,271],[186,961,42],[1342,391,57],[1664,157,1834],[1070,204,178],[178,204,179],[285,215,295],[692,55,360],[192,193,286],[359,673,209],[586,195,653],[121,89,573],[202,171,199],[238,515,311],[174,210,240],[174,105,166],[717,276,595],[1155,1149,452],[1405,56,197],[53,283,30],[75,53,30],[45,235,1651],[210,166,490],[181,193,192],[185,620,217],[26,798,759],[1070,226,204],[220,187,179],[220,168,187],[202,222,171],[359,209,181],[182,456,736],[964,167,1405],[76,250,414],[807,1280,1833],[70,883,1652],[227,179,204],[221,199,168],[221,202,199],[360,494,131],[214,241,319],[105,247,166],[205,203,260],[388,480,939],[482,855,211],[8,807,1833],[226,255,204],[228,221,168],[166,173,490],[701,369,702],[211,855,262],[631,920,630],[1448,1147,1584],[255,227,204],[237,220,179],[228,168,220],[222,256,555],[215,259,279],[126,271,38],[108,50,186],[227,236,179],[236,237,179],[220,237,228],[228,202,221],[256,222,202],[555,256,229],[259,152,279],[27,1296,31],[186,50,961],[961,234,372],[1651,235,812],[1572,1147,1448],[255,226,1778],[255,236,227],[256,257,229],[106,184,109],[241,410,188],[177,578,620],[209,673,181],[1136,1457,79],[1507,245,718],[255,273,236],[275,410,241],[206,851,250],[1459,253,1595],[1406,677,1650],[228,274,202],[202,281,256],[348,239,496],[205,172,203],[369,248,702],[261,550,218],[261,465,550],[574,243,566],[921,900,1220],[291,273,255],[348,238,265],[109,230,194],[149,380,323],[443,270,421],[272,291,255],[274,228,237],[274,292,202],[281,257,256],[276,543,341],[152,259,275],[1111,831,249],[632,556,364],[299,273,291],[299,236,273],[280,237,236],[202,292,281],[247,246,173],[282,49,66],[1620,1233,1553],[299,280,236],[280,305,237],[237,305,274],[306,292,274],[330,257,281],[246,194,264],[166,247,173],[912,894,896],[611,320,244],[1154,1020,907],[969,962,290],[272,299,291],[305,318,274],[145,212,240],[164,248,285],[259,277,275],[193,164,295],[269,240,210],[1033,288,320],[46,948,206],[336,280,299],[330,281,292],[257,307,300],[369,136,248],[145,240,269],[502,84,465],[193,295,286],[164,285,295],[282,302,49],[161,303,429],[318,306,274],[306,330,292],[315,257,330],[315,307,257],[307,352,300],[300,352,308],[275,277,403],[353,1141,333],[1420,425,47],[611,313,320],[85,126,83],[128,1180,43],[303,116,129],[280,314,305],[314,318,305],[190,181,242],[203,214,131],[820,795,815],[322,299,272],[322,336,299],[315,339,307],[172,152,617],[172,214,203],[321,1033,320],[1401,941,946],[85,160,138],[976,454,951],[747,60,786],[317,322,272],[339,352,307],[266,33,867],[163,224,218],[247,614,180],[648,639,553],[388,172,205],[611,345,313],[313,345,320],[160,127,303],[454,672,951],[317,329,322],[314,280,336],[306,338,330],[330,339,315],[1236,115,436],[342,321,320],[1046,355,328],[328,346,325],[325,346,317],[367,314,336],[314,337,318],[337,306,318],[338,343,330],[342,320,345],[355,349,328],[346,329,317],[347,336,322],[314,362,337],[330,343,339],[340,308,352],[135,906,1022],[239,156,491],[194,230,486],[40,1015,1003],[321,355,1046],[329,382,322],[382,347,322],[347,367,336],[337,371,306],[306,371,338],[1681,296,1493],[286,172,388],[230,348,486],[348,183,486],[384,332,830],[328,349,346],[367,362,314],[371,343,338],[339,351,352],[57,344,78],[342,355,321],[386,346,349],[386,350,346],[346,350,329],[347,366,367],[343,363,339],[323,380,324],[152,275,241],[345,1045,342],[350,374,329],[339,363,351],[234,340,352],[353,361,354],[40,34,1015],[373,355,342],[373,349,355],[374,382,329],[366,347,382],[371,363,343],[351,379,352],[379,372,352],[372,234,352],[156,190,491],[319,241,692],[354,361,31],[366,377,367],[363,379,351],[133,590,516],[197,56,271],[1045,370,342],[370,373,342],[374,350,386],[377,366,382],[367,395,362],[400,337,362],[400,371,337],[378,363,371],[106,109,614],[181,673,193],[953,920,631],[376,349,373],[376,386,349],[378,379,363],[224,375,218],[279,152,172],[361,619,381],[1347,823,795],[760,857,384],[392,374,386],[394,395,367],[383,371,400],[383,378,371],[218,375,261],[197,271,36],[414,454,976],[385,376,373],[1051,382,374],[387,394,367],[377,387,367],[395,400,362],[279,172,295],[30,365,225],[450,231,825],[385,373,370],[398,374,392],[1051,377,382],[396,378,383],[348,496,183],[295,172,286],[357,269,495],[1148,390,1411],[75,30,225],[206,76,54],[412,386,376],[412,392,386],[396,383,400],[651,114,878],[123,1241,506],[238,311,265],[381,653,29],[618,815,334],[427,1032,411],[298,414,976],[791,332,384],[129,100,140],[412,404,392],[392,404,398],[140,107,360],[395,394,400],[423,379,378],[385,412,376],[406,94,58],[419,415,1021],[422,423,378],[423,125,379],[258,508,238],[311,156,265],[213,287,491],[449,411,1024],[412,1068,404],[55,140,360],[76,414,54],[394,416,400],[400,416,396],[422,378,396],[1258,796,789],[427,411,449],[427,297,1032],[1385,1366,483],[417,448,284],[1507,341,245],[162,140,444],[658,44,81],[433,125,423],[438,251,125],[429,162,439],[1342,57,1348],[765,766,442],[697,891,695],[1057,396,416],[440,423,422],[440,433,423],[433,438,125],[438,196,251],[74,482,211],[1136,79,144],[29,195,424],[242,1004,492],[57,757,28],[414,298,54],[238,348,230],[224,163,124],[295,215,279],[495,269,490],[449,446,427],[446,297,427],[1020,1163,909],[128,138,419],[66,980,443],[415,439,1018],[111,396,1057],[111,422,396],[840,249,831],[593,664,596],[218,550,155],[109,194,180],[483,268,855],[161,415,419],[1737,232,428],[360,107,494],[1006,1011,410],[444,140,55],[919,843,430],[190,242,213],[275,403,410],[131,494,488],[449,663,446],[138,161,419],[128,419,34],[439,162,444],[460,440,422],[440,438,433],[472,74,445],[491,190,213],[238,508,515],[46,206,54],[972,944,962],[1241,1428,1284],[111,460,422],[470,432,806],[248,164,702],[1025,467,453],[553,1235,648],[263,114,881],[267,293,896],[469,438,440],[455,196,438],[287,242,492],[239,265,156],[213,242,287],[1684,746,63],[663,474,446],[415,161,429],[140,100,107],[1055,459,467],[469,455,438],[259,542,277],[446,474,466],[446,466,447],[439,444,1019],[614,109,180],[190,359,181],[156,497,190],[726,474,663],[1023,458,459],[461,440,460],[269,210,490],[246,180,194],[590,133,189],[163,218,155],[467,468,453],[1063,1029,111],[111,1029,460],[1029,464,460],[461,469,440],[150,149,323],[828,445,456],[375,502,261],[474,475,466],[573,426,462],[478,1023,477],[478,458,1023],[458,479,467],[459,458,467],[468,393,453],[464,461,460],[484,365,455],[1232,182,1380],[172,617,214],[547,694,277],[542,547,277],[184,258,238],[261,502,465],[467,479,468],[484,455,469],[1380,182,864],[475,476,466],[80,447,476],[466,476,447],[415,429,439],[479,487,468],[487,287,468],[492,393,468],[260,469,461],[481,365,484],[531,473,931],[692,360,319],[726,495,474],[468,287,492],[480,464,1029],[260,461,464],[494,481,484],[74,472,482],[174,240,212],[223,106,614],[486,477,485],[478,496,458],[491,487,479],[123,402,177],[488,469,260],[488,484,469],[265,239,348],[248,215,285],[474,490,475],[477,486,478],[458,496,479],[239,491,479],[1584,1147,1334],[488,494,484],[401,123,506],[495,490,474],[490,173,475],[80,476,264],[491,287,487],[480,1029,1004],[480,205,464],[173,476,475],[485,194,486],[486,183,478],[478,183,496],[496,239,479],[848,1166,60],[268,262,855],[205,260,464],[260,203,488],[203,131,488],[246,264,476],[194,485,264],[1002,310,1664],[311,515,497],[515,359,497],[565,359,515],[1250,1236,301],[736,456,151],[654,174,567],[577,534,648],[519,505,645],[725,565,508],[150,1723,148],[584,502,505],[584,526,502],[502,526,84],[607,191,682],[560,499,660],[607,517,191],[1038,711,124],[951,672,971],[716,507,356],[868,513,1198],[615,794,608],[682,191,174],[1313,928,1211],[617,241,214],[511,71,91],[408,800,792],[192,286,525],[80,485,447],[91,97,130],[1675,324,888],[207,756,532],[582,1097,1124],[311,497,156],[510,130,146],[523,511,510],[608,708,616],[546,690,650],[511,527,358],[536,146,518],[465,418,550],[418,709,735],[520,514,500],[584,505,519],[536,518,509],[146,536,510],[538,527,511],[876,263,669],[646,524,605],[510,536,523],[527,175,358],[724,876,669],[721,724,674],[524,683,834],[558,509,522],[558,536,509],[523,538,511],[611,243,574],[528,706,556],[668,541,498],[523,537,538],[527,540,175],[532,756,533],[1013,60,747],[551,698,699],[92,520,500],[535,536,558],[536,569,523],[538,540,527],[539,548,175],[567,212,145],[401,896,293],[534,675,639],[1510,595,1507],[557,545,530],[569,536,535],[537,540,538],[540,539,175],[569,537,523],[1135,718,47],[587,681,626],[580,535,558],[99,747,278],[701,565,725],[665,132,514],[665,514,575],[132,549,653],[176,651,189],[65,47,266],[597,569,535],[569,581,537],[537,581,540],[563,539,540],[539,564,548],[1509,1233,1434],[132,653,740],[550,710,155],[714,721,644],[410,1011,188],[732,534,586],[560,562,729],[555,557,222],[580,558,545],[597,535,580],[581,563,540],[5,821,1676],[576,215,136],[649,457,741],[564,539,563],[124,711,224],[550,668,710],[550,541,668],[565,701,673],[560,613,499],[233,532,625],[545,555,580],[601,581,569],[594,904,548],[1463,1425,434],[185,149,1454],[721,674,644],[185,380,149],[577,424,586],[462,586,559],[597,601,569],[594,548,564],[566,603,574],[165,543,544],[457,89,121],[586,424,195],[725,587,606],[1078,582,1124],[588,925,866],[462,559,593],[189,878,590],[555,229,580],[602,563,581],[904,594,956],[434,1425,1438],[1024,112,821],[572,587,626],[600,597,580],[599,591,656],[600,580,229],[601,622,581],[581,622,602],[602,564,563],[602,594,564],[603,611,574],[498,529,546],[697,1145,70],[592,628,626],[610,597,600],[597,610,601],[222,557,171],[604,765,799],[573,462,593],[133,200,176],[729,607,627],[1011,692,188],[518,146,130],[585,687,609],[682,627,607],[1712,599,656],[562,592,607],[643,656,654],[257,600,229],[601,633,622],[623,594,602],[174,212,567],[725,606,701],[609,701,606],[610,633,601],[633,642,622],[380,216,324],[142,143,1249],[501,732,586],[534,577,586],[648,1235,577],[610,641,633],[310,1002,1831],[618,334,604],[1710,145,269],[707,498,659],[501,586,462],[625,501,462],[726,663,691],[300,600,257],[641,610,600],[622,629,602],[602,629,623],[55,692,444],[518,748,509],[929,1515,1411],[620,578,267],[71,511,358],[707,668,498],[650,687,585],[600,300,641],[641,657,633],[1675,888,1669],[622,636,629],[505,502,375],[541,529,498],[332,420,1053],[637,551,638],[534,639,648],[69,623,873],[300,512,641],[633,657,642],[562,660,579],[687,637,638],[709,646,605],[775,738,885],[559,549,132],[646,683,524],[641,512,657],[266,897,949],[1712,643,1657],[184,727,258],[674,724,669],[699,714,647],[628,659,572],[657,662,642],[571,881,651],[517,607,504],[598,706,528],[598,694,547],[640,552,560],[655,693,698],[698,693,721],[91,510,511],[144,301,1136],[324,216,888],[870,764,1681],[575,514,520],[276,544,543],[658,175,44],[645,505,711],[659,546,572],[700,524,655],[605,700,529],[266,867,897],[1695,1526,764],[579,659,628],[654,591,682],[586,549,559],[698,721,714],[896,401,506],[640,734,599],[664,665,575],[621,629,636],[1712,656,643],[547,644,598],[710,668,707],[640,560,734],[655,698,551],[694,528,277],[512,662,657],[504,592,626],[688,584,519],[152,241,617],[587,725,681],[598,669,706],[526,670,84],[598,528,694],[710,707,499],[579,592,562],[660,659,579],[323,324,1134],[326,895,473],[195,29,653],[84,670,915],[560,660,562],[504,626,681],[711,505,224],[651,881,114],[216,620,889],[1362,678,197],[493,99,48],[1659,691,680],[529,690,546],[430,843,709],[655,524,693],[174,191,105],[674,669,598],[98,712,82],[572,546,585],[72,61,71],[912,911,894],[106,223,184],[664,132,665],[843,646,709],[635,699,136],[699,698,714],[593,132,664],[688,526,584],[185,177,620],[533,675,534],[687,638,635],[1652,89,457],[896,506,912],[132,740,514],[689,685,282],[691,449,680],[48,436,493],[136,699,647],[739,640,554],[549,586,653],[532,533,625],[1530,695,649],[653,381,619],[736,151,531],[188,692,241],[177,402,578],[33,689,867],[689,33,685],[593,559,132],[949,65,266],[711,1038,661],[939,480,1004],[609,369,701],[616,552,615],[619,361,740],[151,463,516],[513,521,117],[691,663,449],[186,251,196],[333,302,327],[613,560,552],[616,613,552],[690,551,637],[660,707,659],[704,208,1203],[418,735,550],[163,708,124],[524,834,693],[554,640,599],[245,341,165],[565,673,359],[155,710,708],[105,191,517],[1515,198,1411],[1709,554,599],[60,289,786],[838,1295,1399],[533,534,625],[710,499,708],[556,632,410],[217,620,216],[591,627,682],[504,503,223],[643,654,567],[690,637,650],[545,557,555],[174,654,682],[719,691,1659],[727,681,508],[645,711,661],[794,615,739],[565,515,508],[282,685,302],[1150,397,1149],[638,699,635],[544,685,33],[719,726,691],[1742,1126,1733],[1724,1475,148],[556,410,403],[185,217,380],[503,504,681],[277,556,403],[32,1178,158],[1712,1709,599],[605,529,541],[635,136,369],[687,635,369],[529,700,690],[700,551,690],[89,304,573],[625,534,732],[730,302,685],[503,681,727],[702,673,701],[730,327,302],[327,353,333],[596,664,575],[660,499,707],[585,546,650],[560,729,734],[700,655,551],[176,571,651],[517,504,223],[730,685,544],[1661,1682,726],[1682,495,726],[1250,301,917],[605,524,700],[609,687,369],[516,389,895],[1553,686,1027],[673,702,164],[656,591,654],[520,596,575],[402,123,401],[828,456,728],[1645,677,1653],[528,556,277],[638,551,699],[190,497,359],[276,730,544],[1117,1525,933],[1027,686,1306],[155,708,163],[709,605,541],[647,644,547],[650,637,687],[599,734,591],[578,293,267],[1682,357,495],[510,91,130],[734,729,627],[576,542,215],[709,541,735],[735,541,550],[276,500,730],[500,327,730],[653,619,740],[414,851,454],[734,627,591],[729,562,607],[615,552,640],[525,181,192],[308,512,300],[223,503,727],[266,165,33],[92,500,276],[321,1046,1033],[585,609,606],[1200,1559,86],[628,572,626],[301,436,803],[714,644,647],[708,499,613],[721,693,724],[514,353,327],[353,740,361],[344,158,78],[708,613,616],[615,640,739],[500,514,327],[514,740,353],[1449,177,185],[462,233,625],[851,405,1163],[608,616,615],[647,542,576],[625,732,501],[1097,582,1311],[1235,424,577],[579,628,592],[607,592,504],[24,432,470],[105,614,247],[104,742,471],[542,259,215],[365,196,455],[1420,47,65],[223,727,184],[547,542,647],[572,585,606],[587,572,606],[262,780,1370],[647,576,136],[644,674,598],[271,53,75],[727,508,258],[471,742,142],[505,375,224],[357,1710,269],[725,508,681],[659,498,546],[743,1178,32],[1195,634,231],[1176,24,470],[743,1110,1178],[135,809,857],[63,746,407],[634,1176,470],[159,1112,27],[1176,1685,24],[399,450,779],[1178,856,875],[751,744,54],[436,48,772],[634,1108,1210],[769,1285,1286],[751,298,755],[746,1684,754],[754,924,87],[722,1625,756],[87,839,153],[489,795,820],[758,808,1518],[839,840,153],[831,1111,959],[1111,749,959],[810,1253,1363],[1247,1394,713],[1388,1329,1201],[1242,120,761],[857,791,384],[758,1523,808],[296,764,1504],[70,1652,891],[207,233,1638],[1348,57,28],[858,420,332],[964,1379,1278],[420,1194,816],[784,1076,1186],[1076,21,1186],[1710,767,1],[849,822,778],[806,137,787],[786,790,744],[790,54,744],[771,63,407],[785,852,818],[774,1823,272],[895,151,516],[135,1022,809],[99,826,48],[48,826,755],[808,705,408],[833,441,716],[1733,743,32],[1385,836,852],[772,827,737],[1005,49,781],[793,1697,813],[1518,441,1537],[1139,1132,859],[782,801,770],[1510,1530,676],[770,814,835],[231,787,825],[207,722,756],[26,771,798],[782,863,865],[832,54,790],[865,842,507],[799,765,94],[1175,1261,1353],[800,408,805],[262,986,200],[792,800,814],[801,792,770],[704,1203,1148],[356,1514,822],[165,544,33],[561,776,113],[1043,738,775],[815,831,820],[773,792,801],[772,48,914],[772,737,803],[436,772,803],[808,817,705],[1624,822,1527],[588,1144,788],[799,762,604],[821,1520,1676],[854,803,666],[828,482,472],[445,74,463],[831,489,820],[828,836,482],[716,782,763],[334,815,766],[815,823,766],[334,766,765],[819,805,837],[1716,1521,1412],[1684,924,754],[800,805,819],[1709,829,554],[806,1349,137],[99,1013,747],[341,595,276],[817,810,818],[1176,1691,1685],[763,782,865],[830,846,1052],[865,1499,842],[982,846,1053],[847,832,790],[1178,875,158],[817,818,705],[1302,1392,45],[96,417,284],[223,614,517],[356,507,1514],[1166,848,1179],[1349,432,26],[717,92,276],[770,835,863],[522,509,1745],[847,841,832],[832,841,46],[829,739,554],[802,824,39],[397,1043,775],[1567,849,778],[1385,483,855],[1349,26,1346],[441,801,782],[402,401,293],[1043,667,738],[759,798,1007],[819,837,728],[728,837,828],[837,852,828],[1537,441,833],[148,1475,147],[805,705,837],[716,441,782],[483,1371,780],[814,819,844],[845,753,1336],[1661,719,4],[862,847,790],[737,827,666],[201,46,841],[810,785,818],[408,705,805],[1560,1536,849],[1585,853,1786],[7,1668,807],[7,807,8],[822,1514,1527],[800,819,814],[847,862,841],[991,857,760],[705,818,837],[808,408,773],[402,293,578],[791,858,332],[1480,1228,1240],[814,844,835],[785,1385,852],[1132,120,859],[1743,1726,684],[1704,783,1279],[1623,1694,1731],[959,489,831],[1518,808,773],[862,872,841],[441,773,801],[331,512,308],[380,217,216],[841,872,201],[818,852,837],[448,1480,1240],[856,1108,1195],[1527,1514,1526],[819,182,1232],[871,724,693],[852,836,828],[770,792,814],[803,737,666],[751,826,278],[1674,1727,1699],[849,356,822],[871,693,834],[507,842,1514],[1406,1097,869],[1328,1349,1346],[823,815,795],[744,751,278],[1110,856,1178],[520,717,316],[871,834,683],[884,876,724],[165,266,47],[716,763,507],[216,889,888],[853,1585,1570],[1536,716,356],[886,873,623],[782,770,863],[432,24,26],[683,882,871],[884,724,871],[114,876,884],[516,590,389],[11,1218,1628],[862,113,872],[886,623,629],[830,1052,1120],[762,153,604],[773,408,792],[763,865,507],[153,840,604],[882,884,871],[531,151,326],[886,890,873],[133,262,200],[819,1232,844],[621,636,122],[645,892,519],[1130,1076,784],[114,263,876],[1670,10,1663],[911,670,894],[452,885,872],[872,885,201],[887,882,683],[878,884,882],[590,878,882],[890,867,689],[897,629,621],[897,886,629],[819,728,182],[519,893,688],[894,670,526],[898,894,526],[1536,356,849],[810,1363,785],[878,114,884],[879,888,892],[892,889,893],[893,898,688],[895,683,843],[895,887,683],[889,620,267],[590,882,389],[418,465,84],[949,897,621],[897,890,886],[889,267,893],[898,267,896],[531,326,473],[189,651,878],[843,683,646],[897,867,890],[888,889,892],[893,267,898],[896,894,898],[473,895,843],[895,389,887],[974,706,669],[513,1115,521],[326,151,895],[809,791,857],[211,262,133],[920,923,947],[923,90,947],[90,25,947],[25,972,935],[64,431,899],[52,899,901],[903,905,59],[437,967,73],[839,1242,761],[904,975,44],[917,301,144],[915,670,911],[905,201,885],[1684,63,1685],[1033,1194,288],[950,913,755],[912,918,911],[950,914,913],[506,918,912],[922,919,915],[911,922,915],[1004,451,492],[1263,553,639],[922,911,918],[630,920,947],[916,506,926],[916,918,506],[521,1115,1098],[916,922,918],[919,418,915],[83,38,75],[24,1685,771],[110,1230,1213],[712,8,1837],[922,930,919],[919,430,418],[1395,1402,1187],[930,922,916],[594,623,69],[35,431,968],[35,968,969],[866,924,1684],[1625,1263,675],[631,630,52],[930,931,919],[430,709,418],[302,333,49],[1446,978,1138],[799,1007,798],[931,843,919],[947,25,64],[885,738,667],[1262,963,964],[899,970,901],[1401,946,938],[1117,933,1091],[1685,63,771],[905,948,201],[979,937,980],[951,953,950],[937,270,443],[1154,903,59],[1194,954,1067],[909,405,907],[850,1151,59],[1769,811,1432],[76,206,250],[938,946,966],[965,927,942],[938,966,957],[955,975,904],[927,965,934],[52,51,631],[59,905,667],[431,935,968],[786,289,561],[252,122,671],[481,494,107],[954,1817,1067],[795,25,90],[958,965,945],[795,972,25],[902,983,955],[972,489,944],[1256,29,424],[671,331,945],[946,958,963],[956,955,904],[902,955,956],[671,512,331],[945,331,961],[662,671,122],[671,662,512],[934,65,927],[630,947,52],[666,631,910],[850,59,667],[961,331,234],[1024,411,1042],[890,69,873],[252,671,945],[975,290,940],[283,186,196],[30,283,365],[950,755,298],[946,965,958],[985,290,975],[969,290,985],[405,851,206],[935,431,64],[941,1423,1420],[964,963,167],[942,252,945],[78,757,57],[49,1005,66],[937,979,270],[631,666,827],[980,937,443],[66,689,282],[421,902,956],[947,64,52],[35,979,899],[951,971,953],[762,87,153],[27,31,381],[924,839,87],[946,963,966],[331,308,340],[957,966,1262],[473,843,931],[953,971,920],[270,969,902],[935,962,968],[51,1005,781],[969,983,902],[437,73,940],[69,421,956],[761,249,840],[263,974,669],[962,944,967],[962,437,290],[985,975,955],[907,405,948],[720,957,1262],[25,935,64],[176,200,571],[108,945,50],[250,851,414],[200,986,571],[881,974,263],[827,772,953],[970,899,980],[29,159,27],[234,331,340],[948,405,206],[980,899,979],[986,984,571],[571,984,881],[990,706,974],[946,934,965],[970,980,66],[1113,1486,1554],[984,981,881],[881,987,974],[689,66,443],[1005,901,66],[983,985,955],[165,47,718],[987,990,974],[1370,986,262],[901,970,66],[51,901,1005],[981,987,881],[988,706,990],[942,945,965],[290,437,940],[64,899,52],[988,556,706],[941,934,946],[431,35,899],[996,989,984],[984,989,981],[981,989,987],[35,969,270],[1370,995,986],[986,995,984],[989,999,987],[987,992,990],[992,988,990],[962,967,437],[951,950,976],[979,35,270],[421,270,902],[998,995,1370],[987,999,992],[988,364,556],[969,985,983],[689,443,890],[995,1000,984],[219,958,108],[998,1000,995],[999,997,992],[914,953,772],[845,1336,745],[806,787,231],[1000,996,984],[989,996,999],[50,945,961],[443,421,69],[797,158,779],[1098,1463,434],[996,1009,999],[1001,988,992],[1001,364,988],[903,907,905],[26,759,973],[997,1001,992],[632,364,1001],[1346,26,973],[998,1008,1000],[1000,1009,996],[531,931,736],[252,949,621],[286,388,525],[1174,1008,998],[1009,1010,999],[999,1010,997],[1014,1001,997],[614,105,517],[958,945,108],[525,1004,242],[963,958,219],[233,426,304],[1000,1008,1009],[1010,1014,997],[1001,1006,632],[824,413,39],[642,636,622],[480,388,205],[28,757,797],[1014,1006,1001],[1006,410,632],[975,940,44],[1234,420,858],[54,832,46],[1009,1012,1010],[167,963,219],[41,481,107],[1017,1010,1012],[122,636,662],[939,525,388],[525,939,1004],[950,953,914],[829,1735,739],[1008,880,1015],[1008,1015,1009],[1263,639,675],[956,594,69],[795,90,1347],[1179,848,1013],[759,1007,973],[1009,1015,1012],[1012,1016,1017],[1017,1014,1010],[1019,1011,1006],[927,65,949],[649,316,595],[913,48,755],[976,950,298],[1003,1015,880],[1018,1006,1014],[1021,1018,1014],[444,692,1011],[451,1029,1063],[1185,851,1163],[29,27,381],[181,525,242],[1021,1014,1017],[1016,1021,1017],[1018,1019,1006],[1019,444,1011],[927,949,942],[451,393,492],[903,1154,907],[391,101,57],[94,765,58],[419,1016,1012],[949,252,942],[907,1020,909],[765,442,58],[94,406,908],[1007,94,908],[34,1012,1015],[34,419,1012],[419,1021,1016],[451,1057,393],[907,948,905],[1034,1073,1039],[1061,906,1619],[1068,960,1034],[471,1249,104],[112,1024,1042],[372,379,125],[341,543,165],[141,1094,170],[566,243,1061],[398,1034,1039],[325,317,1823],[1493,296,1724],[850,667,1043],[1054,297,1065],[1619,135,1074],[1061,243,906],[680,1024,821],[1103,96,1245],[1440,1123,1491],[1047,1025,1044],[672,454,1231],[1484,697,1530],[993,672,1231],[178,154,1088],[1044,1041,1066],[112,1062,1058],[1530,649,676],[178,1088,1040],[1046,328,954],[243,244,1022],[954,1194,1033],[1042,411,1032],[971,993,1056],[960,1093,1034],[1754,1338,232],[385,1064,412],[1057,1063,111],[748,1071,1447],[1530,697,695],[971,1056,1270],[977,1059,1211],[649,741,316],[1060,1452,1030],[353,354,1323],[695,768,649],[398,404,1034],[596,316,741],[1836,119,13],[1513,1115,1528],[883,1081,1652],[1039,1073,1048],[462,426,233],[31,1296,354],[1055,1047,1066],[1032,1054,1045],[1521,310,1224],[119,861,13],[1194,1234,288],[1109,1771,1070],[1166,1160,776],[1044,1035,1041],[1026,960,1064],[1050,1032,1045],[1049,1041,387],[115,1013,99],[1046,954,1033],[1321,920,971],[611,1058,345],[1048,1066,1049],[1023,1055,1073],[1029,451,1004],[118,1094,141],[1094,1080,170],[1042,1032,1050],[1026,1064,385],[15,16,1084],[1096,1079,61],[1075,1071,748],[325,1817,328],[909,1163,405],[1022,1234,809],[374,398,1051],[1082,72,81],[1023,1034,1093],[1817,1794,1067],[86,1445,1400],[1507,1535,1510],[1079,1096,1075],[568,1478,1104],[1070,178,1040],[1034,1023,1073],[776,1155,113],[1103,143,142],[1140,81,73],[1082,81,1140],[1060,1030,936],[1040,1086,1109],[370,1065,385],[61,72,1082],[1087,1096,1144],[1040,1088,1086],[1651,812,752],[1062,1050,1045],[187,154,178],[179,187,178],[1099,1344,1101],[1668,1058,807],[1073,1055,1048],[1099,1336,1344],[1283,943,1123],[1049,387,1051],[1024,680,449],[61,1082,1100],[967,749,1111],[1439,1037,88],[742,1505,142],[398,1039,1051],[1107,1336,1099],[1344,1542,1101],[142,1505,1103],[477,1093,447],[477,1023,1093],[471,142,1249],[1041,1035,394],[1328,568,1104],[61,1100,1096],[154,1092,1088],[112,1042,1050],[154,187,168],[435,235,45],[1075,1096,1087],[97,1075,748],[1049,1066,1041],[816,1067,1028],[846,982,1142],[1245,96,284],[1092,154,1080],[1057,451,1063],[387,377,1051],[1055,1025,1047],[1075,1087,1089],[1106,1108,856],[1068,1034,404],[1480,1545,868],[906,135,1619],[1074,991,1095],[570,566,1061],[1025,453,1044],[745,1336,1107],[1035,1057,416],[1092,1102,1129],[1074,135,991],[1105,745,1107],[447,1026,446],[394,387,1041],[73,81,940],[1118,1108,1106],[1210,1108,874],[243,1022,906],[412,1064,1068],[1280,611,603],[960,447,1093],[1051,1039,1049],[1040,1109,1070],[1471,1037,1439],[69,890,443],[1377,703,1374],[1092,1080,1102],[1096,1100,788],[1096,788,1144],[1114,967,1111],[446,1026,297],[70,1112,883],[453,393,1057],[1118,874,1108],[1054,370,1045],[1080,1094,1102],[1039,1048,1049],[428,753,845],[1047,1044,1066],[1044,453,1035],[1472,731,1512],[1126,1121,743],[743,1121,1110],[1032,297,1054],[1480,868,1216],[71,358,72],[1133,967,1114],[1105,1119,745],[1035,453,1057],[1026,447,960],[454,851,1190],[1030,1477,652],[589,816,1028],[1110,1121,1106],[1122,1118,1106],[1116,874,1118],[1048,1055,1066],[1194,1067,816],[744,278,747],[745,1120,845],[845,1052,428],[1105,1780,1119],[1065,297,385],[1098,1529,1463],[731,1060,936],[235,434,812],[1445,1525,1117],[1106,1121,1122],[1122,1127,1118],[1127,1116,1118],[1094,118,1732],[1119,1120,745],[1406,1124,1097],[435,117,235],[1462,1440,1037],[1126,1129,1121],[1088,1092,1129],[1133,73,967],[1120,1052,845],[812,434,752],[1441,1559,1200],[1131,588,413],[1054,1065,370],[235,1098,434],[1052,1142,428],[1737,428,1142],[1496,1446,1483],[1182,1083,1654],[1121,1129,1122],[1732,1116,1127],[768,457,649],[761,1114,249],[1064,960,1068],[1135,1481,1136],[1126,952,1129],[1087,588,1131],[1087,1144,588],[859,788,1139],[1140,1133,1132],[1133,1140,73],[1822,570,1061],[394,1035,416],[1055,1023,459],[80,264,485],[1119,1128,1120],[145,1658,567],[695,891,768],[1129,1102,1122],[1122,1102,1127],[1416,1077,1413],[297,1026,385],[1052,846,1142],[1445,1117,1400],[952,1086,1129],[1714,1089,1131],[1131,1089,1087],[1100,1139,788],[112,1050,1062],[1323,354,1296],[49,333,1141],[1142,982,1737],[79,1457,1091],[1088,1129,1086],[1102,1094,1127],[1127,1094,1732],[1100,1082,1139],[1082,1132,1139],[1082,1140,1132],[1150,1043,397],[60,1166,289],[1696,1146,1698],[1297,1202,1313],[409,1297,1313],[1234,1194,420],[1408,1391,1394],[424,1235,1243],[1203,309,1148],[485,477,447],[1152,1156,850],[1153,1149,1155],[1153,1157,1149],[1149,1152,1150],[1156,1154,1151],[776,1153,1155],[1157,1152,1149],[1217,1393,1208],[1156,1159,1154],[1153,1165,1157],[1165,1152,1157],[1159,1020,1154],[1161,1153,776],[1161,1165,1153],[1165,1158,1152],[1152,1158,1156],[1158,1159,1156],[1166,776,561],[1160,1161,776],[1161,1164,1165],[1161,1160,1164],[1158,1162,1159],[1159,1162,1020],[1270,1321,971],[1164,1170,1165],[1165,1162,1158],[1162,1163,1020],[588,788,925],[1166,1167,1160],[1165,1170,1162],[1160,1167,1164],[1162,1170,1163],[1179,1167,1166],[1167,1168,1164],[1164,1168,1170],[1168,1169,1170],[1234,1022,288],[802,39,866],[1179,1168,1167],[1169,1173,1170],[1170,1173,1163],[1173,1185,1163],[1360,1267,1364],[1169,1185,1173],[611,244,243],[900,1226,1376],[1260,1408,1350],[618,840,831],[1181,1183,1179],[1179,1184,1168],[1208,1274,1291],[1183,1184,1179],[1168,1184,1169],[1387,1395,1254],[1208,1204,1172],[1182,1197,1083],[1187,1083,1197],[1213,1183,1181],[1169,1207,1185],[135,857,991],[1013,1213,1181],[1189,1183,1213],[1183,1189,1184],[1169,1184,1207],[1207,1190,1185],[1180,1389,1288],[1191,1192,1640],[1640,1192,1090],[1090,1205,1654],[1654,1205,1182],[1188,1395,1187],[1126,743,1733],[788,859,925],[809,1234,1171],[1193,1197,1182],[1189,1199,1184],[1639,1191,1637],[1639,1212,1191],[1205,1193,1182],[1198,1187,1197],[1199,1207,1184],[332,1053,846],[1090,1192,1205],[117,1188,1187],[435,1188,117],[435,1206,1188],[1199,1189,1213],[420,816,1053],[1212,1215,1191],[117,1187,1198],[45,1206,435],[120,1132,1133],[874,1116,1210],[1191,1215,1192],[1193,1216,1197],[1216,1198,1197],[1199,1214,1207],[117,521,235],[1220,1311,1078],[1220,900,1311],[1653,1215,1212],[1192,1225,1205],[1205,1209,1193],[1209,1216,1193],[1389,1217,1172],[1207,1214,454],[171,557,1747],[1805,1078,1787],[1805,1219,1078],[1198,1216,868],[666,910,854],[1230,1231,1213],[1213,1231,1199],[1199,1231,1214],[1219,1220,1078],[1215,1221,1192],[1192,1221,1225],[1225,1228,1205],[1205,1228,1209],[1209,1228,1216],[1464,1325,1223],[1215,1227,1221],[1228,1480,1216],[1226,1653,1376],[1653,1249,1215],[1221,1240,1225],[1225,1240,1228],[839,761,840],[1238,1219,1805],[1238,1220,1219],[1232,1380,1375],[1226,1249,1653],[1221,1227,1240],[233,207,532],[110,1236,1230],[1248,1231,1230],[1231,454,1214],[1249,1227,1215],[1248,1056,1231],[489,959,944],[448,1240,284],[925,859,1242],[1805,1244,1238],[1252,1220,1238],[1252,921,1220],[1236,1251,1230],[1230,1251,1248],[1056,993,1231],[1031,1264,1263],[68,1186,157],[1227,1245,1240],[1103,1245,143],[1243,1235,612],[1252,95,921],[1249,1226,1237],[1390,1387,1254],[1120,384,830],[830,332,846],[1227,143,1245],[1315,1369,1358],[1356,1269,1386],[972,795,489],[1831,1224,310],[1250,1255,1251],[1251,1056,1248],[1256,1243,103],[658,358,175],[1620,1238,1244],[1620,1252,1238],[1506,95,1252],[104,1249,1237],[1249,143,1227],[1268,1419,1329],[634,806,231],[618,831,815],[924,1242,839],[1255,1270,1251],[1251,1270,1056],[866,925,1242],[103,29,1256],[424,1243,1256],[134,1651,752],[1250,917,1255],[1172,1204,1260],[1352,1036,1276],[1265,1201,1329],[804,1282,1259],[1259,1294,723],[335,1330,1305],[407,762,799],[875,856,1195],[32,158,344],[967,944,749],[372,125,42],[1175,1354,1261],[553,612,1235],[1259,1273,1294],[1294,1283,723],[757,78,158],[407,799,798],[901,51,52],[139,1386,1389],[1386,1269,1389],[1389,1269,1217],[1148,1590,1268],[1428,1449,1450],[804,1281,1282],[1273,1259,1282],[158,399,779],[771,407,798],[521,1098,235],[917,1312,1255],[1312,1270,1255],[1217,1269,1393],[1195,1108,634],[1110,1106,856],[1210,1691,1176],[27,1112,1145],[1296,27,1145],[1171,858,791],[704,1148,1290],[1430,1436,1437],[1282,1308,1273],[1300,943,1283],[1393,1355,1274],[720,1278,769],[1287,1059,1399],[1310,1388,1272],[1312,1321,1270],[851,1185,1190],[1296,1145,1304],[26,24,771],[51,910,631],[1329,1290,1268],[1290,1148,1268],[1298,1293,733],[1281,1293,1282],[1282,1293,1308],[1308,1299,1273],[1300,1283,1294],[1340,943,1300],[1340,1301,943],[407,754,762],[1287,1399,1295],[34,139,128],[1288,1172,1260],[120,1133,1114],[1306,1113,1511],[1464,1223,1292],[1299,1294,1273],[1299,1300,1294],[1286,1295,838],[1285,1247,1286],[1247,713,1286],[1201,1265,1390],[1378,1368,1357],[1482,1320,917],[917,1320,1312],[850,1156,1151],[588,39,413],[1324,1306,686],[789,1365,928],[1223,1326,1292],[1292,1326,1298],[869,1097,1311],[790,786,561],[1323,1304,932],[1323,1296,1304],[1317,1324,686],[1306,368,1113],[1325,1342,1223],[1326,1348,1298],[1293,1327,1308],[1308,1318,1299],[704,1290,1258],[1320,1321,1312],[761,120,1114],[1684,802,866],[1674,6,1727],[1316,1323,932],[1335,1337,1305],[1348,1327,1293],[1298,1348,1293],[1333,1300,1299],[1333,1343,1300],[1328,1301,1340],[1328,1314,1301],[838,1399,1319],[921,1237,900],[409,1391,1408],[1376,1653,677],[1281,804,1458],[1331,1324,1317],[1324,368,1306],[368,1338,1307],[1327,797,1308],[797,1345,1308],[1308,1345,1318],[1318,1333,1299],[1341,1147,1572],[923,1321,1320],[923,920,1321],[39,588,866],[1141,1323,1316],[1330,1335,1305],[1337,1335,1336],[1339,1332,1325],[1223,1342,1326],[1342,1348,1326],[1348,797,1327],[1345,1333,1318],[1343,1340,1300],[1419,1265,1329],[1347,1320,1584],[1535,1141,1316],[1078,1311,582],[1344,1335,1330],[753,1331,1337],[368,1324,1331],[753,368,1331],[1332,1485,1325],[1325,1485,1342],[787,1343,1333],[137,1328,1340],[973,1341,1479],[406,1147,1341],[1171,1234,858],[1141,1535,1322],[49,1141,1322],[1344,1336,1335],[973,908,1341],[766,1347,1584],[1347,923,1320],[781,49,1322],[368,232,1338],[787,1340,1343],[787,137,1340],[568,1346,973],[58,1147,406],[442,1334,1147],[58,442,1147],[442,766,1334],[90,923,1347],[428,368,753],[779,1333,1345],[825,787,1333],[137,1349,1328],[1328,1346,568],[908,406,1341],[924,866,1242],[1336,753,1337],[428,232,368],[1115,777,1098],[1348,28,797],[797,779,1345],[779,825,1333],[1007,908,973],[583,1351,880],[1365,1246,977],[1658,145,1710],[1310,796,1388],[718,245,165],[1302,1272,1254],[1174,1351,583],[1174,715,1351],[1358,1260,1204],[1374,1373,1276],[1377,1374,1276],[678,1362,1382],[1377,1276,254],[139,34,40],[1008,1174,583],[1396,1286,1319],[768,891,457],[1316,932,1535],[1289,1371,1360],[182,736,864],[1355,1364,1274],[860,1367,1354],[1362,1222,1382],[1376,869,1311],[1590,1411,198],[1232,1375,877],[1394,1295,1286],[880,1356,1386],[880,1351,1356],[1211,1059,1287],[197,678,1405],[880,1386,1003],[1368,1253,1357],[1357,1253,1036],[715,1289,1364],[1354,1367,703],[1383,877,1375],[1266,1288,1260],[1373,1374,703],[1372,1289,1174],[1303,1366,1378],[1351,715,1355],[1665,1666,624],[1309,1357,1036],[900,1237,1226],[1174,1289,715],[1337,1331,1317],[1360,1303,1359],[1267,1354,1175],[1241,1284,1414],[1377,254,929],[1385,855,836],[1396,1319,1436],[1361,1366,1303],[1381,1368,1378],[1313,1211,1391],[1368,1385,1363],[813,82,861],[1058,1280,807],[893,519,892],[1359,1303,860],[1382,1350,1247],[1371,1303,1360],[1267,1175,1271],[769,1286,1396],[712,1837,82],[1366,1385,1381],[1365,796,1310],[1003,1386,40],[780,1371,1370],[561,862,790],[1284,1380,864],[1449,1428,177],[611,1280,1058],[1284,1375,1380],[926,506,1241],[1305,1337,1317],[309,1203,208],[1388,1201,1390],[1309,1036,1352],[1377,929,1411],[1399,1059,1257],[1112,70,1145],[289,1166,561],[1288,1389,1172],[1362,37,1180],[713,1394,1286],[1355,1393,1269],[1401,1423,941],[1274,1271,1384],[860,1378,1367],[715,1364,1355],[677,1406,869],[1297,1358,1202],[1388,1258,1329],[1180,1288,1266],[1008,583,880],[1524,1425,1463],[1390,1403,1387],[1278,1379,1247],[1278,1247,1285],[964,1278,1262],[1358,1369,1202],[1715,1699,1726],[926,1241,1414],[1341,1572,1479],[926,930,916],[1397,51,781],[409,1358,1297],[1236,436,301],[1376,677,869],[1351,1355,1356],[758,1534,1523],[1378,1357,1367],[977,1211,1365],[1135,1136,854],[1394,1391,1295],[1266,1260,1222],[1365,1302,1246],[1232,877,844],[736,930,864],[1408,1358,409],[1508,817,1523],[1381,1385,1368],[718,854,910],[854,718,1135],[1382,1222,1350],[1391,1211,1287],[1391,1287,1295],[1257,1651,134],[1414,1284,864],[1291,1369,1315],[1202,928,1313],[86,1400,1413],[1413,1200,86],[1263,1625,1031],[1413,1400,1404],[1002,1664,1834],[930,926,1414],[1399,1257,134],[520,316,596],[1393,1274,1208],[1657,1655,1712],[1407,1404,1400],[1404,1410,1413],[1649,1229,1406],[1362,1266,1222],[1384,1271,1175],[900,1376,1311],[1274,1384,1291],[1291,1384,1431],[1433,1396,1436],[1267,1359,1354],[309,1353,703],[838,1319,1286],[1407,1410,1404],[441,1518,773],[1241,123,1428],[1622,1521,1224],[1217,1208,1172],[1130,793,1076],[425,1409,1481],[1481,1409,1533],[1303,1378,860],[1350,1408,1394],[1246,1651,977],[1289,1360,1364],[1727,1694,1623],[1417,1407,1533],[1417,1410,1407],[1406,1650,1649],[1319,134,1437],[1414,864,930],[1406,1229,1124],[1354,1359,860],[1433,769,1396],[1417,1533,1409],[1416,1413,1410],[1415,1416,1410],[95,1237,921],[1392,1254,1395],[1360,1359,1267],[1258,1290,1329],[1180,128,1389],[1420,1409,425],[1417,1418,1410],[1418,1415,1410],[1422,1077,1416],[1247,1350,1394],[37,43,1180],[1204,1315,1358],[1428,1383,1375],[1356,1355,1269],[1409,1418,1417],[1302,45,1246],[1421,1416,1415],[1421,1422,1416],[1422,1494,1077],[957,720,938],[1423,1409,1420],[1423,1418,1409],[752,434,1438],[1260,1358,1408],[1363,1385,785],[1423,1426,1418],[1426,1424,1418],[1229,1649,1124],[1222,1260,1350],[1508,1523,1137],[1278,1285,769],[1482,917,144],[1418,1424,1415],[1425,1422,1421],[1425,1524,1422],[1272,1388,1390],[1391,409,1313],[1378,1366,1381],[1371,483,1361],[720,1262,1278],[29,103,159],[1271,1364,1267],[1424,1427,1415],[1537,1522,1518],[134,752,1438],[1420,934,941],[1428,1375,1284],[1277,1224,1831],[1362,1180,1266],[1401,1426,1423],[1577,1369,1291],[268,483,262],[1383,1450,1456],[1384,1175,1431],[1430,1415,1427],[1430,1421,1415],[1430,1425,1421],[1379,1382,1247],[1252,1553,1429],[1206,1392,1395],[1433,1430,1427],[309,208,1353],[1272,1390,1254],[1361,483,1366],[1523,817,808],[1302,1254,1392],[1371,1361,1303],[1426,1435,1424],[1435,1433,1424],[1433,1427,1424],[720,769,1433],[796,1258,1388],[1590,1419,1268],[1289,1372,1371],[1305,1317,1509],[998,1372,1174],[40,1386,139],[1261,1354,703],[1364,1271,1274],[134,1438,1437],[1436,1319,1437],[1317,686,1509],[1484,932,1304],[1434,1432,1509],[1420,65,934],[931,930,736],[1367,1357,1309],[1372,1370,1371],[1204,1208,1315],[1426,938,1435],[1368,1363,1253],[1207,454,1190],[1302,1310,1272],[309,1377,390],[390,1377,1411],[1370,1372,998],[1411,1590,1148],[720,1433,1435],[1450,1383,1428],[1379,678,1382],[1405,678,1379],[1208,1291,1315],[1399,134,1319],[1367,1309,1373],[1373,1352,1276],[596,741,593],[553,1264,612],[1433,1436,1430],[1437,1438,1430],[964,1405,1379],[1373,1309,1352],[1265,1403,1390],[1233,1618,1434],[1365,1310,1302],[789,796,1365],[720,1435,938],[128,139,1389],[1466,933,1525],[1191,1640,1637],[1314,1442,943],[1141,353,1323],[1489,1138,1474],[1462,1477,1440],[1474,1138,1488],[1442,1314,1443],[1446,1030,1546],[1484,1145,697],[1549,1443,1445],[1470,1572,1468],[1397,1239,1507],[1649,1825,1824],[1259,1440,1477],[1451,1450,1449],[978,1446,652],[1454,1456,1451],[1451,1456,1450],[341,1507,595],[933,1547,79],[804,1452,1060],[1454,1455,1456],[1398,1460,1454],[1455,877,1456],[1277,1831,1825],[804,1060,1458],[1339,1459,1595],[1314,1104,1443],[933,1448,1547],[147,1460,1398],[1460,1461,1454],[1454,1461,1455],[1292,1125,1464],[417,1531,1480],[1459,1339,1325],[811,1756,335],[1512,936,1490],[777,1529,1098],[147,1475,1460],[1464,253,1459],[836,855,482],[1487,1486,1307],[1104,1501,1443],[1439,1200,1532],[1475,1469,1460],[1460,1469,1461],[1325,1464,1459],[1277,1825,1649],[1532,1200,1077],[844,877,1455],[1572,933,1466],[1479,568,973],[1509,335,1305],[1339,1595,1759],[1469,1476,1461],[1461,1476,1455],[1104,1470,1468],[1464,1472,253],[1117,1091,1407],[1756,1542,335],[1206,1395,1188],[335,1542,1330],[835,844,1455],[1471,1598,1462],[1491,1442,1441],[835,1455,1476],[1441,1442,1443],[1489,1474,1473],[1251,1236,1250],[1030,1452,1477],[1598,1439,1532],[978,1598,1492],[1426,1401,938],[1448,1584,1482],[1724,1497,1475],[1475,1497,1469],[1484,1535,932],[1307,1486,1113],[1487,696,1495],[1037,1491,1441],[1030,1446,936],[1453,1487,1495],[696,1467,1495],[1138,1489,1483],[1497,1143,1469],[1469,1143,1476],[652,1598,978],[850,1043,1150],[1482,1584,1320],[1731,98,1697],[1113,1554,1573],[1524,1532,1494],[1496,1467,696],[1452,1259,1477],[296,1504,1497],[1504,1143,1497],[1143,1499,1476],[718,910,1498],[868,1540,1528],[817,1253,810],[1490,696,1487],[1440,1491,1037],[1510,676,595],[1488,1492,1517],[781,1239,1397],[1467,1519,1503],[1500,1307,1759],[1149,397,452],[1504,1514,1143],[1514,842,1143],[1125,733,1458],[1503,1531,1555],[1276,1036,1137],[1440,723,1123],[1036,1508,1137],[817,1508,1253],[103,883,1112],[1458,731,1472],[1512,1490,1487],[1487,1453,1486],[1138,978,1488],[1036,1253,1508],[1398,149,147],[1474,1517,1513],[1125,1458,1472],[1486,1453,1554],[1518,1534,758],[345,1058,1062],[928,1202,1369],[1554,1541,1505],[1464,1125,1472],[1504,764,1514],[304,426,573],[1505,742,1506],[1479,1572,1478],[1519,1483,1489],[833,716,1069],[1522,1534,1518],[1115,1513,777],[811,335,1432],[1591,1533,1407],[777,1517,1529],[1513,1517,777],[1498,910,1397],[1069,1539,833],[833,1539,1537],[1522,1551,1534],[1534,1551,1523],[1538,1137,1523],[910,51,1397],[1367,1373,703],[1466,1525,1468],[157,1186,1832],[1429,1511,1506],[1573,1505,1506],[1259,1452,804],[1503,1495,1467],[262,483,780],[1572,1466,1468],[1536,1556,716],[716,1556,1069],[1544,1523,1551],[1544,1538,1523],[1511,1573,1506],[933,1572,1448],[1543,1537,1539],[1537,1543,1522],[1091,933,79],[1519,1540,1545],[1549,1445,86],[1069,1548,1539],[1548,1543,1539],[1543,1551,1522],[1500,1487,1307],[68,784,1186],[1552,1544,1551],[1550,1538,1544],[1538,1550,1137],[1519,1473,1540],[1547,1448,1482],[1560,1563,1536],[1536,1563,1556],[1556,1548,1069],[1543,1558,1551],[1137,1550,1276],[1453,1495,1555],[1561,1543,1548],[1543,1561,1558],[1558,1566,1551],[1552,1550,1544],[1569,1557,1550],[1557,1276,1550],[1276,1557,254],[1531,1503,1480],[1535,1530,1510],[1545,1503,1519],[1547,1482,79],[1566,1552,1551],[1552,1569,1550],[1503,1545,1480],[703,1377,309],[1625,675,756],[1037,1441,88],[929,254,1557],[849,1567,1560],[1556,1564,1548],[1492,1529,1517],[1252,1429,1506],[1553,1027,1429],[1453,1555,1541],[1554,1453,1541],[1233,686,1553],[1328,1104,1314],[1564,1576,1548],[1548,1576,1561],[1557,1562,929],[1520,112,1668],[1483,1446,1138],[778,1570,1567],[1563,1564,1556],[1561,1565,1558],[1565,1566,1558],[1569,1552,1566],[1562,1557,1569],[1530,1535,1484],[1387,1402,1395],[1621,1634,1387],[1567,1568,1560],[1560,1568,1563],[1571,1569,1566],[1344,1330,1542],[1577,1431,1353],[1638,233,304],[1524,1463,1529],[1353,1431,1175],[1077,1200,1413],[1478,1470,1104],[1568,1575,1563],[1563,1575,1564],[1575,1576,1564],[1561,1576,1565],[1565,1574,1566],[1562,1515,929],[1555,96,1541],[1531,417,96],[1555,1531,96],[1246,45,1651],[208,1577,1353],[1586,1568,1567],[1574,1571,1566],[1571,1583,1569],[1474,1513,1528],[1239,1322,1535],[1478,1572,1470],[1570,1586,1567],[1488,1517,1474],[8,1833,1837],[1123,1442,1491],[1589,1568,1586],[1576,1594,1565],[1565,1594,1574],[1562,198,1515],[1559,1441,1549],[1441,1443,1549],[1135,425,1481],[1239,1535,1507],[1595,1487,1500],[1570,1585,1586],[1589,1578,1568],[1568,1578,1575],[1579,1569,1583],[1177,1577,208],[115,1236,110],[1578,1593,1575],[1587,1576,1575],[1576,1581,1594],[1571,1582,1583],[1588,1579,1583],[1579,1580,1562],[1569,1579,1562],[1562,1580,198],[1027,1511,1429],[1589,1593,1578],[1587,1581,1576],[1582,1574,1594],[1574,1582,1571],[1575,1593,1587],[1583,1582,1588],[1580,1590,198],[1587,1593,1581],[1505,1541,96],[1369,1577,1177],[1573,1554,1505],[1479,1478,568],[1585,1589,1586],[1369,1177,704],[766,1584,1334],[977,1257,1059],[1091,1591,1407],[1591,1091,1457],[1585,1604,1589],[1581,1592,1594],[1602,1582,1594],[1582,1608,1588],[1608,1579,1588],[1579,1597,1580],[1419,1590,1580],[1597,1419,1580],[1431,1577,1291],[1589,1604,1593],[1601,1596,1593],[1593,1596,1581],[1306,1511,1027],[1511,1113,1573],[1786,1412,1585],[1412,1604,1585],[1581,1596,1592],[1592,1602,1594],[1608,1599,1579],[1599,1611,1579],[1579,1611,1597],[1512,1487,253],[1519,1489,1473],[1545,1540,868],[1083,1187,1402],[1117,1407,1400],[1292,733,1125],[284,1240,1245],[1604,1600,1593],[1600,1601,1593],[1582,1607,1608],[789,1369,704],[1467,1483,1519],[1601,1613,1596],[1596,1613,1592],[1602,1607,1582],[1620,1553,1252],[1601,1605,1613],[1592,1613,1602],[1602,1606,1607],[1608,1609,1599],[1599,1609,1611],[1603,1597,1611],[1265,1419,1597],[1603,1265,1597],[1392,1206,45],[928,1369,789],[1474,1528,1473],[1104,1468,1501],[1412,1521,1604],[1613,1631,1602],[1607,1610,1608],[1608,1610,1609],[1476,863,835],[1495,1503,1555],[1498,1397,718],[1520,1668,7],[1604,1615,1600],[1605,1601,1600],[1602,1631,1606],[1606,1610,1607],[1759,1595,1500],[1292,1298,733],[1615,1604,1521],[1609,1603,1611],[652,1462,1598],[1468,1525,1445],[1443,1501,1445],[1134,1723,150],[1521,1622,1615],[1615,1616,1600],[1616,1605,1600],[1605,1616,1612],[1605,1612,1613],[1612,1617,1613],[1613,1617,1631],[1606,1614,1610],[1265,1603,1403],[448,417,1480],[1595,253,1487],[1501,1468,1445],[1383,1456,877],[1490,1496,696],[1610,1627,1609],[1627,1621,1609],[1591,1481,1533],[1598,1471,1439],[1353,1261,703],[1606,1631,1614],[1609,1621,1403],[1532,1077,1494],[1528,1115,513],[1546,652,1446],[1211,928,1365],[1540,1473,1528],[1078,1502,1787],[1425,1430,1438],[1617,1630,1631],[959,749,944],[566,570,603],[1716,310,1521],[775,452,397],[1615,1636,1616],[1616,1636,1612],[1610,1632,1627],[789,704,1258],[1457,1481,1591],[1769,1756,811],[207,1629,722],[1629,1625,722],[1224,1277,1622],[1622,1636,1615],[1636,1646,1612],[1612,1630,1617],[1631,1626,1614],[1614,1632,1610],[1506,104,95],[1481,1457,1136],[1123,943,1442],[936,1446,1496],[1499,863,1476],[1629,1031,1625],[1233,1509,686],[1633,1634,1621],[1621,1387,1403],[1472,1512,253],[1177,208,704],[1277,1636,1622],[1626,1632,1614],[1627,1633,1621],[936,1496,1490],[185,1454,1451],[731,936,1512],[1638,1635,207],[553,1263,1264],[1653,1212,1639],[1633,1627,1632],[1633,1387,1634],[1458,1060,731],[368,1307,1113],[1264,1031,1629],[1152,850,1150],[1277,1644,1636],[1646,1637,1612],[1637,1630,1612],[1647,1631,1630],[1647,1626,1631],[1422,1524,1494],[1030,652,1546],[1635,1629,207],[1635,1264,1629],[1639,1646,1636],[1637,1640,1630],[1641,1632,1626],[1632,1642,1633],[1633,1643,1387],[842,1499,1143],[865,863,1499],[1516,978,1492],[67,1130,784],[1103,1505,96],[88,1441,1200],[1644,1639,1636],[1640,1647,1630],[1647,1641,1626],[1633,1648,1643],[1492,1532,1524],[1488,1516,1492],[1037,1471,1462],[612,1264,1635],[1502,1078,1124],[1641,1642,1632],[1648,1633,1642],[1528,513,868],[1492,1598,1532],[1095,991,760],[679,157,1664],[760,1128,1785],[1277,1650,1644],[320,1022,244],[1559,1549,86],[1676,1520,7],[1488,978,1516],[1095,760,1785],[1128,384,1120],[304,312,1638],[1081,1638,312],[1081,1635,1638],[103,612,1635],[652,1477,1462],[1650,1645,1644],[1645,1639,1644],[1639,1637,1646],[1640,1090,1647],[1654,1641,1647],[1654,1642,1641],[1654,1648,1642],[1643,1402,1387],[1432,335,1509],[384,1128,760],[1652,312,304],[103,1243,612],[1277,1649,1650],[1090,1654,1647],[1643,1648,1402],[1134,324,1675],[679,68,157],[1652,1081,312],[1136,301,803],[1653,1639,1645],[723,1440,1259],[803,854,1136],[104,1506,742],[1112,159,103],[1654,1083,1648],[977,1651,1257],[1397,1507,718],[1081,103,1635],[1650,677,1645],[1083,1402,1648],[1706,1655,1671],[1624,1704,1711],[767,2,1],[608,794,294],[1678,1683,1686],[767,1682,2],[1669,1692,1675],[296,1681,764],[1671,1656,1672],[17,1673,1679],[1706,1671,1673],[1662,1674,1699],[1655,1657,1656],[418,84,915],[1526,1514,764],[1658,1657,567],[870,1695,764],[813,1697,98],[1659,821,5],[60,1013,848],[1013,110,1213],[661,1038,1692],[1660,1703,17],[1693,1673,17],[1663,1715,1743],[1013,115,110],[344,1733,32],[1670,1663,1743],[1670,1743,1738],[1677,1670,1738],[1661,4,3],[1084,1683,1678],[1728,793,1130],[1683,1767,1196],[1677,1738,1196],[1279,1786,853],[294,1038,608],[1279,1689,1786],[870,18,1708],[870,1680,1695],[1705,10,1670],[1084,1767,1683],[1196,1738,1686],[1750,870,1681],[1750,18,870],[1773,1703,1660],[1135,47,425],[150,323,1134],[1707,1655,1706],[1741,344,1687],[1685,1691,1684],[1684,1691,802],[1672,1656,0],[1038,124,608],[1671,1672,1690],[1628,1218,1767],[1686,1275,1667],[1493,1750,1681],[1773,18,1750],[1773,1660,18],[1679,1671,16],[1735,1706,1673],[1667,1678,1686],[1688,1658,1],[1656,1688,0],[1293,1281,1458],[1698,1678,1667],[1696,1130,1722],[1698,1667,1696],[1715,1662,1699],[1692,1038,294],[1682,767,357],[1669,661,1692],[802,1702,824],[1028,1067,1784],[822,1624,778],[119,813,861],[1218,1670,1677],[1703,1693,17],[1658,1710,1],[750,1730,1729],[1701,750,1729],[1693,1735,1673],[1731,1694,98],[1691,1702,802],[783,1729,1719],[1680,870,1708],[1707,1709,1655],[533,756,675],[1691,1210,1702],[11,1705,1670],[1767,1218,1196],[1218,1677,1196],[1664,1716,1721],[1729,1725,1719],[1729,1072,1725],[1210,1116,1702],[1702,1720,824],[1682,1661,2],[1713,1719,1721],[1716,1786,1713],[1730,1722,1072],[294,1717,1811],[1692,294,1666],[1659,680,821],[824,1720,1714],[1726,1731,1718],[345,1062,1045],[1738,1743,1275],[1075,1089,1071],[783,1719,1689],[1275,684,1728],[1692,1666,1665],[1675,1692,1665],[294,1811,1666],[1716,1664,310],[1678,1698,1700],[6,9,1727],[676,649,595],[381,31,361],[1723,1804,1772],[1727,9,1694],[1720,1089,1714],[1786,1716,1412],[1683,1196,1686],[1718,1697,1085],[1116,1739,1702],[1739,1734,1720],[1702,1739,1720],[1089,1720,1734],[509,748,1745],[1743,1715,1726],[1717,294,794],[1116,1732,1739],[1718,1731,1697],[1696,1667,1130],[1134,1665,1723],[1694,712,98],[101,1687,102],[391,1736,101],[662,636,642],[1734,1447,1089],[1089,1447,1071],[436,99,493],[1689,1279,783],[1485,1465,1342],[1736,1687,101],[344,1741,1733],[1741,1742,1733],[1735,829,1706],[829,1707,1706],[1485,1332,1465],[952,1126,1742],[1747,1447,1734],[879,892,645],[1730,1146,1696],[829,1709,1707],[1709,1712,1655],[118,1739,1732],[1332,1744,1465],[1687,1749,1741],[1741,1758,1742],[679,1072,68],[1072,1722,68],[118,1747,1739],[1747,1734,1739],[1465,1744,1736],[1736,1740,1687],[1704,1701,783],[1665,624,1723],[1722,1130,67],[1025,1055,467],[1444,14,1701],[558,522,530],[1657,1658,1688],[1339,1746,1332],[1332,1748,1744],[1687,1740,1749],[1741,1749,1758],[1109,952,1742],[1747,118,141],[1671,1690,1628],[1671,1628,16],[1657,1688,1656],[1745,748,1447],[357,767,1710],[1746,1748,1332],[1146,1700,1698],[1759,1307,1338],[1239,781,1322],[1745,1447,1747],[522,1745,1747],[316,717,595],[148,1493,1724],[1758,1109,1742],[1725,1072,679],[726,719,1661],[1695,1680,1526],[1772,1750,1493],[148,1772,1493],[1542,1751,1101],[952,1109,1086],[1744,1752,1736],[1736,1752,1740],[1753,1755,1740],[391,1342,1736],[821,112,1520],[557,530,1747],[530,522,1747],[994,879,645],[1542,1756,1751],[1813,1693,1703],[1746,1754,1748],[1748,1764,1744],[1752,1757,1740],[1740,1757,1753],[1749,1740,1755],[1755,1763,1749],[1763,1758,1749],[1275,1743,684],[1813,1735,1693],[1107,1099,1101],[1723,624,1804],[1403,1603,1609],[1748,1754,1764],[1744,1757,1752],[1760,1109,1758],[1465,1736,1342],[436,115,99],[1686,1738,1275],[1751,1766,1101],[1759,1754,1746],[1755,1753,1763],[1570,1279,853],[1701,1146,750],[1655,1656,1671],[11,1670,1218],[1761,1751,1756],[1766,1107,1101],[1726,1623,1731],[1711,1704,1279],[67,784,68],[558,530,545],[1620,1618,1233],[1769,1761,1756],[102,1687,344],[1338,1754,1759],[1754,232,1764],[1744,1765,1757],[1757,1763,1753],[1762,1760,1758],[1760,1771,1109],[1339,1759,1746],[1675,1665,1134],[1730,1696,1722],[1774,1751,1761],[1766,1780,1107],[1780,1105,1107],[1764,1765,1744],[1763,1762,1758],[1772,1773,1750],[1811,1813,1703],[1434,1769,1432],[1780,1766,1751],[232,1781,1764],[1711,1279,1570],[1688,1,0],[1774,1780,1751],[1764,1781,1765],[1765,1768,1757],[1757,1768,1763],[1777,1782,1760],[1762,1777,1760],[1769,1774,1761],[1763,1777,1762],[1760,1782,1771],[232,1737,1781],[1768,1776,1763],[272,255,774],[1669,994,661],[1618,1769,1434],[1765,589,1768],[1770,1777,1763],[1701,1729,783],[1783,1774,1769],[1789,1780,1774],[589,1775,1768],[1776,1770,1763],[1782,1778,1771],[1771,1778,1070],[624,1703,1773],[624,1811,1703],[1620,1244,1618],[1779,1769,1618],[1779,1783,1769],[739,1735,1813],[1775,1776,1768],[1790,1777,1770],[1777,1778,1782],[1725,679,1721],[733,1293,1458],[1802,1618,1244],[1802,1779,1618],[1788,1783,1779],[1789,1774,1783],[1796,1780,1789],[1796,1119,1780],[1823,1817,325],[1699,1727,1623],[750,1146,1730],[1497,1724,296],[1128,1119,1796],[61,62,71],[1131,413,824],[1114,1111,249],[1784,1776,1775],[1123,723,1283],[1791,1788,1779],[1788,1789,1783],[1095,1797,1074],[1028,1784,1775],[1784,1770,1776],[1777,1790,1778],[1793,1797,1095],[1797,1800,1074],[1798,1790,1770],[1805,1802,1244],[1802,1791,1779],[1792,1789,1788],[1793,1785,1128],[1793,1095,1785],[1074,1800,1619],[741,457,593],[1798,1770,1784],[1798,1794,1790],[1786,1689,1713],[684,1726,1718],[1728,1085,793],[1795,1787,1502],[1806,1802,1805],[1819,1788,1791],[1067,1798,1784],[1790,1794,1778],[1795,1502,1124],[1801,1805,1787],[1807,1791,1802],[1807,1819,1791],[1819,1792,1788],[1799,1128,1796],[994,645,661],[684,1085,1728],[684,1718,1085],[1699,1623,1726],[1801,1787,1795],[1808,1789,1792],[1808,1796,1789],[1799,1793,1128],[1809,1797,1793],[1809,1803,1797],[1803,1800,1797],[1067,1794,1798],[774,255,1778],[1673,1671,1679],[879,1669,888],[19,1807,1802],[1810,1619,1800],[879,994,1669],[1794,774,1778],[1723,1772,148],[1804,1773,1772],[1814,1795,1124],[1649,1814,1124],[1814,1801,1795],[1812,1806,1805],[19,1802,1806],[19,1819,1807],[1810,1800,1803],[1804,624,1773],[1714,1131,824],[1801,1812,1805],[1812,19,1806],[1808,1792,1819],[1799,1809,1793],[1821,1810,1803],[1717,739,1813],[1061,1619,1822],[1794,1817,774],[79,1482,144],[1815,1801,1814],[23,1819,19],[589,1028,1775],[1817,1823,774],[1689,1719,1713],[1824,1814,1649],[1827,1818,1801],[1818,1812,1801],[1818,19,1812],[1818,20,19],[1816,1809,1799],[1821,1803,1809],[1822,1619,1810],[124,708,608],[1663,10,1715],[1815,1827,1801],[1820,1808,1819],[23,1820,1819],[603,1810,1821],[603,1822,1810],[1085,1697,793],[1628,1690,11],[1527,1704,1624],[1730,1072,1729],[1526,1444,1704],[1526,1680,1444],[1704,1444,1701],[1816,1821,1809],[1722,67,68],[317,272,1823],[1716,1713,1721],[16,1628,1767],[1527,1526,1704],[1824,1826,1814],[1814,1826,1815],[1818,21,20],[1835,1808,1820],[603,570,1822],[226,1070,1778],[1013,1181,1179],[1721,679,1664],[1717,1813,1811],[1828,1827,1815],[22,1820,23],[22,1835,1820],[1830,603,1821],[719,1659,5],[643,567,1657],[1717,794,739],[1825,1826,1824],[1828,1815,1826],[1829,21,1818],[1808,1835,13],[4,719,5],[10,1662,1715],[1828,1832,1827],[1832,1818,1827],[12,1833,1816],[1833,1821,1816],[1833,1830,1821],[14,1146,1701],[1186,1829,1818],[1280,603,1830],[14,1700,1146],[1667,1728,1130],[1825,1834,1826],[1834,1828,1826],[1832,1186,1818],[1836,13,1835],[1624,1711,1570],[778,1624,1570],[1719,1725,1721],[1002,1825,1831],[1002,1834,1825],[1834,1832,1828],[1186,21,1829],[1836,1835,22],[1837,1833,12],[1280,1830,1833],[1667,1275,1728],[16,1767,1084],[589,1765,1838],[1765,1781,1838],[1781,1737,1838],[1737,982,1838],[982,1053,1838],[1053,816,1838],[816,589,1838]]

},{}],34:[function(require,module,exports){
module.exports = adjoint;

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};
},{}],35:[function(require,module,exports){
module.exports = clone;

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
    var out = new Float32Array(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],36:[function(require,module,exports){
module.exports = copy;

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],37:[function(require,module,exports){
module.exports = create;

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
    var out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],38:[function(require,module,exports){
module.exports = determinant;

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};
},{}],39:[function(require,module,exports){
module.exports = fromQuat;

/**
 * Creates a matrix from a quaternion rotation.
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @returns {mat4} out
 */
function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};
},{}],40:[function(require,module,exports){
module.exports = fromRotationTranslation;

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};
},{}],41:[function(require,module,exports){
module.exports = frustum;

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};
},{}],42:[function(require,module,exports){
module.exports = identity;

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],43:[function(require,module,exports){
module.exports = {
  create: require('./create')
  , clone: require('./clone')
  , copy: require('./copy')
  , identity: require('./identity')
  , transpose: require('./transpose')
  , invert: require('./invert')
  , adjoint: require('./adjoint')
  , determinant: require('./determinant')
  , multiply: require('./multiply')
  , translate: require('./translate')
  , scale: require('./scale')
  , rotate: require('./rotate')
  , rotateX: require('./rotateX')
  , rotateY: require('./rotateY')
  , rotateZ: require('./rotateZ')
  , fromRotationTranslation: require('./fromRotationTranslation')
  , fromQuat: require('./fromQuat')
  , frustum: require('./frustum')
  , perspective: require('./perspective')
  , perspectiveFromFieldOfView: require('./perspectiveFromFieldOfView')
  , ortho: require('./ortho')
  , lookAt: require('./lookAt')
  , str: require('./str')
}
},{"./adjoint":34,"./clone":35,"./copy":36,"./create":37,"./determinant":38,"./fromQuat":39,"./fromRotationTranslation":40,"./frustum":41,"./identity":42,"./invert":44,"./lookAt":45,"./multiply":46,"./ortho":47,"./perspective":48,"./perspectiveFromFieldOfView":49,"./rotate":50,"./rotateX":51,"./rotateY":52,"./rotateZ":53,"./scale":54,"./str":55,"./translate":56,"./transpose":57}],44:[function(require,module,exports){
module.exports = invert;

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};
},{}],45:[function(require,module,exports){
var identity = require('./identity');

module.exports = lookAt;

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < 0.000001 &&
        Math.abs(eyey - centery) < 0.000001 &&
        Math.abs(eyez - centerz) < 0.000001) {
        return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};
},{"./identity":42}],46:[function(require,module,exports){
module.exports = multiply;

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};
},{}],47:[function(require,module,exports){
module.exports = ortho;

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};
},{}],48:[function(require,module,exports){
module.exports = perspective;

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
},{}],49:[function(require,module,exports){
module.exports = perspectiveFromFieldOfView;

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}


},{}],50:[function(require,module,exports){
module.exports = rotate;

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < 0.000001) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};
},{}],51:[function(require,module,exports){
module.exports = rotateX;

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};
},{}],52:[function(require,module,exports){
module.exports = rotateY;

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};
},{}],53:[function(require,module,exports){
module.exports = rotateZ;

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};
},{}],54:[function(require,module,exports){
module.exports = scale;

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],55:[function(require,module,exports){
module.exports = str;

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};
},{}],56:[function(require,module,exports){
module.exports = translate;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};
},{}],57:[function(require,module,exports){
module.exports = transpose;

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};
},{}],58:[function(require,module,exports){
var check = require('./lib/check')
var getContext = require('./lib/context')
var wrapExtensions = require('./lib/extension')
var wrapLimits = require('./lib/limits')
var wrapBuffers = require('./lib/buffer')
var wrapElements = require('./lib/elements')
var wrapTextures = require('./lib/texture')
var wrapRenderbuffers = require('./lib/renderbuffer')
var wrapFramebuffers = require('./lib/framebuffer')
var wrapUniforms = require('./lib/uniform')
var wrapAttributes = require('./lib/attribute')
var wrapShaders = require('./lib/shader')
var wrapDraw = require('./lib/draw')
var wrapContext = require('./lib/state')
var createCompiler = require('./lib/compile')
var wrapRead = require('./lib/read')
var dynamic = require('./lib/dynamic')
var raf = require('./lib/raf')
var clock = require('./lib/clock')

var GL_COLOR_BUFFER_BIT = 16384
var GL_DEPTH_BUFFER_BIT = 256
var GL_STENCIL_BUFFER_BIT = 1024

var GL_ARRAY_BUFFER = 34962
var GL_TEXTURE_2D = 0x0DE1
var GL_TEXTURE_CUBE_MAP = 0x8513

var CONTEXT_LOST_EVENT = 'webglcontextlost'
var CONTEXT_RESTORED_EVENT = 'webglcontextrestored'

module.exports = function wrapREGL () {
  var args = getContext(Array.prototype.slice.call(arguments))
  var gl = args.gl
  var options = args.options

  var extensionState = wrapExtensions(gl)
  var extensions = extensionState.extensions

  var viewportState = {
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight
  }

  var limits = wrapLimits(
    gl,
    extensions)

  var bufferState = wrapBuffers(gl)

  var elementState = wrapElements(
    gl,
    extensions,
    bufferState)

  var uniformState = wrapUniforms()

  var attributeState = wrapAttributes(
    gl,
    extensions,
    limits,
    bufferState)

  var shaderState = wrapShaders(
    gl,
    attributeState,
    uniformState,
    function (program) {
      return compiler.draw(program)
    })

  var drawState = wrapDraw(
    gl,
    extensions,
    bufferState)

  var textureState = wrapTextures(
    gl,
    extensions,
    limits,
    poll,
    viewportState)

  var renderbufferState = wrapRenderbuffers(
    gl,
    extensions,
    limits)

  var framebufferState = wrapFramebuffers(
    gl,
    extensions,
    limits,
    textureState,
    renderbufferState)

  var frameState = {
    count: 0,
    start: clock(),
    dt: 0,
    t: clock(),
    renderTime: 0,
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight,
    pixelRatio: options.pixelRatio
  }

  var glState = wrapContext(
    gl,
    framebufferState,
    viewportState)

  var readPixels = wrapRead(gl, poll, viewportState)

  var compiler = createCompiler(
    gl,
    extensions,
    limits,
    bufferState,
    elementState,
    textureState,
    framebufferState,
    glState,
    uniformState,
    attributeState,
    shaderState,
    drawState,
    frameState,
    poll)

  var canvas = gl.canvas

  // raf stuff
  var rafCallbacks = []
  var activeRAF = 0
  function handleRAF () {
    activeRAF = raf.next(handleRAF)
    frameState.count += 1

    if (frameState.width !== gl.drawingBufferWidth ||
        frameState.height !== gl.drawingBufferHeight) {
      frameState.width = gl.drawingBufferWidth
      frameState.height = gl.drawingBufferHeight
      glState.notifyViewportChanged()
    }

    var now = clock()
    frameState.dt = now - frameState.t
    frameState.t = now

    textureState.poll()

    for (var i = 0; i < rafCallbacks.length; ++i) {
      var cb = rafCallbacks[i]
      cb(frameState.count, frameState.t, frameState.dt)
    }
    frameState.renderTime = clock() - now
  }

  function startRAF () {
    if (!activeRAF && rafCallbacks.length > 0) {
      handleRAF()
    }
  }

  function stopRAF () {
    if (activeRAF) {
      raf.cancel(handleRAF)
      activeRAF = 0
    }
  }

  function handleContextLoss (event) {
    stopRAF()
    event.preventDefault()
    if (options.onContextLost) {
      options.onContextLost()
    }
  }

  function handleContextRestored (event) {
    gl.getError()
    extensionState.refresh()
    bufferState.refresh()
    textureState.refresh()
    renderbufferState.refresh()
    framebufferState.refresh()
    shaderState.refresh()
    glState.refresh()
    if (options.onContextRestored) {
      options.onContextRestored()
    }
    handleRAF()
  }

  if (canvas) {
    canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false)
    canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false)
  }

  // Resource destructuion
  function destroy () {
    stopRAF()

    if (canvas) {
      canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss)
      canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored)
    }

    shaderState.clear()
    framebufferState.clear()
    renderbufferState.clear()
    textureState.clear()
    bufferState.clear()

    if (options.onDestroy) {
      options.onDestroy()
    }
  }

  function compileProcedure (options) {
    check(!!options, 'invalid args to regl({...})')
    check.type(options, 'object', 'invalid args to regl({...})')

    var hasDynamic = false

    function flattenNestedOptions (options) {
      var result = Object.assign({}, options)
      delete result.uniforms
      delete result.attributes

      function merge (name) {
        if (name in result) {
          var child = result[name]
          delete result[name]
          Object.keys(child).forEach(function (prop) {
            result[name + '.' + prop] = child[prop]
          })
        }
      }
      merge('blend')
      merge('depth')
      merge('cull')
      merge('stencil')
      merge('polygonOffset')
      merge('scissor')
      merge('sample')

      return result
    }

    // First we separate the options into static and dynamic components
    function separateDynamic (object) {
      var staticItems = {}
      var dynamicItems = {}
      Object.keys(object).forEach(function (option) {
        var value = object[option]
        if (dynamic.isDynamic(value)) {
          hasDynamic = true
          dynamicItems[option] = dynamic.unbox(value, option)
        } else {
          staticItems[option] = value
        }
      })
      return {
        dynamic: dynamicItems,
        static: staticItems
      }
    }

    var uniforms = separateDynamic(options.uniforms || {})
    var attributes = separateDynamic(options.attributes || {})
    var opts = separateDynamic(flattenNestedOptions(options))

    var compiled = compiler.command(
      opts.static, uniforms.static, attributes.static,
      opts.dynamic, uniforms.dynamic, attributes.dynamic,
      hasDynamic)

    var draw = compiled.draw
    var batch = compiled.batch
    var scope = compiled.scope

    var EMPTY_ARRAY = []
    function reserve (count) {
      while (EMPTY_ARRAY.length < count) {
        EMPTY_ARRAY.push(null)
      }
      return EMPTY_ARRAY
    }

    function REGLCommand (args, body) {
      if (typeof args === 'number') {
        return batch(args | 0, reserve(args | 0))
      } else if (Array.isArray(args)) {
        return batch(args.length, args)
      } else if (typeof args === 'function') {
        return scope(null, args)
      } else if (typeof body === 'function') {
        return scope(args, body)
      }
      return draw(args)
    }

    return REGLCommand
  }

  function poll () {
    framebufferState.poll()
    glState.poll()
  }

  function clear (options) {
    var clearFlags = 0

    // Update context state
    poll()

    var c = options.color
    if (c) {
      gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0)
      clearFlags |= GL_COLOR_BUFFER_BIT
    }
    if ('depth' in options) {
      gl.clearDepth(+options.depth)
      clearFlags |= GL_DEPTH_BUFFER_BIT
    }
    if ('stencil' in options) {
      gl.clearStencil(options.stencil | 0)
      clearFlags |= GL_STENCIL_BUFFER_BIT
    }

    check(!!clearFlags, 'called regl.clear with no buffer specified')
    gl.clear(clearFlags)
  }

  // Registers another requestAnimationFrame callback
  function frame (cb) {
    rafCallbacks.push(cb)

    function cancel () {
      var index = rafCallbacks.find(function (item) {
        return item === cb
      })
      if (index < 0) {
        return
      }
      rafCallbacks.splice(index, 1)
      if (rafCallbacks.length <= 0) {
        stopRAF()
      }
    }

    startRAF()

    return {
      cancel: cancel
    }
  }

  return Object.assign(compileProcedure, {
    // Clear current FBO
    clear: clear,

    // Short cut for prop binding
    prop: dynamic.define,

    // executes an empty draw command
    draw: compileProcedure({}),

    // Resources
    elements: function (options) {
      return elementState.create(options)
    },
    buffer: function (options) {
      return bufferState.create(options, GL_ARRAY_BUFFER)
    },
    texture: function (options) {
      return textureState.create(options, GL_TEXTURE_2D)
    },
    cube: function (options) {
      if (arguments.length === 6) {
        return textureState.create(
          Array.prototype.slice.call(arguments),
          GL_TEXTURE_CUBE_MAP)
      } else {
        return textureState.create(options, GL_TEXTURE_CUBE_MAP)
      }
    },
    renderbuffer: function (options) {
      return renderbufferState.create(options)
    },
    framebuffer: function (options) {
      return framebufferState.create(options)
    },
    framebufferCube: function (options) {
      check.raise('framebuffer cube not yet implemented')
    },

    // Frame rendering
    frame: frame,
    stats: frameState,

    // System limits
    limits: limits,

    // Read pixels
    read: readPixels,

    // Destroy regl and all associated resources
    destroy: destroy
  })
}

},{"./lib/attribute":2,"./lib/buffer":3,"./lib/check":4,"./lib/clock":5,"./lib/compile":7,"./lib/context":11,"./lib/draw":12,"./lib/dynamic":13,"./lib/elements":14,"./lib/extension":15,"./lib/framebuffer":16,"./lib/limits":19,"./lib/raf":22,"./lib/read":23,"./lib/renderbuffer":24,"./lib/shader":25,"./lib/state":27,"./lib/texture":28,"./lib/uniform":30}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3RoZXRhMzYwLmpzIiwibGliL2F0dHJpYnV0ZS5qcyIsImxpYi9idWZmZXIuanMiLCJsaWIvY2hlY2suanMiLCJsaWIvY2xvY2suanMiLCJsaWIvY29kZWdlbi5qcyIsImxpYi9jb21waWxlLmpzIiwibGliL2NvbnN0YW50cy9hcnJheXR5cGVzLmpzb24iLCJsaWIvY29uc3RhbnRzL2R0eXBlcy5qc29uIiwibGliL2NvbnN0YW50cy9wcmltaXRpdmVzLmpzb24iLCJsaWIvY29udGV4dC5qcyIsImxpYi9kcmF3LmpzIiwibGliL2R5bmFtaWMuanMiLCJsaWIvZWxlbWVudHMuanMiLCJsaWIvZXh0ZW5zaW9uLmpzIiwibGliL2ZyYW1lYnVmZmVyLmpzIiwibGliL2lzLW5kYXJyYXkuanMiLCJsaWIvaXMtdHlwZWQtYXJyYXkuanMiLCJsaWIvbGltaXRzLmpzIiwibGliL2xvYWQtdGV4dHVyZS5qcyIsImxpYi9wYXJzZS1kZHMuanMiLCJsaWIvcmFmLmpzIiwibGliL3JlYWQuanMiLCJsaWIvcmVuZGVyYnVmZmVyLmpzIiwibGliL3NoYWRlci5qcyIsImxpYi9zdGFjay5qcyIsImxpYi9zdGF0ZS5qcyIsImxpYi90ZXh0dXJlLmpzIiwibGliL3RvLWhhbGYtZmxvYXQuanMiLCJsaWIvdW5pZm9ybS5qcyIsImxpYi92YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvYW5nbGUtbm9ybWFscy9hbmdsZS1ub3JtYWxzLmpzIiwibm9kZV9tb2R1bGVzL2J1bm55L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvYWRqb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L2Nsb25lLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvY29weS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L2RldGVybWluYW50LmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvZnJvbVF1YXQuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9mcm9tUm90YXRpb25UcmFuc2xhdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L2ZydXN0dW0uanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvaW52ZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvbG9va0F0LmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvbXVsdGlwbHkuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9vcnRoby5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L3BlcnNwZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvcGVyc3BlY3RpdmVGcm9tRmllbGRPZlZpZXcuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9yb3RhdGUuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9yb3RhdGVYLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvcm90YXRlWS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L3JvdGF0ZVouanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9zY2FsZS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L3N0ci5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L3RyYW5zbGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXQ0L3RyYW5zcG9zZS5qcyIsInJlZ2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RtREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IHJlZ2wgPSByZXF1aXJlKCcuLi9yZWdsJykoKVxuY29uc3QgbWF0NCA9IHJlcXVpcmUoJ2dsLW1hdDQnKVxuY29uc3QgYnVubnkgPSByZXF1aXJlKCdidW5ueScpXG5jb25zdCBub3JtYWxzID0gcmVxdWlyZSgnYW5nbGUtbm9ybWFscycpXG5cbmNvbnN0IHNldHVwRW52TWFwID0gcmVnbCh7XG4gIGZyYWc6IGBcbiAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gIHVuaWZvcm0gc2FtcGxlcjJEIGVudm1hcDtcbiAgdmFyeWluZyB2ZWMzIHJlZmxlY3REaXI7XG5cbiAgI2RlZmluZSBQSSAke01hdGguUEl9XG5cbiAgdmVjNCBsb29rdXBFbnYgKHZlYzMgZGlyKSB7XG4gICAgZmxvYXQgbGF0ID0gYXRhbihkaXIueiwgZGlyLngpO1xuICAgIGZsb2F0IGxvbiA9IGFjb3MoZGlyLnkgLyBsZW5ndGgoZGlyKSk7XG4gICAgcmV0dXJuIHRleHR1cmUyRChlbnZtYXAsIHZlYzIoXG4gICAgICAwLjUgKyBsYXQgLyAoMi4wICogUEkpLFxuICAgICAgbG9uIC8gUEkpKTtcbiAgfVxuXG4gIHZvaWQgbWFpbiAoKSB7XG4gICAgZ2xfRnJhZ0NvbG9yID0gbG9va3VwRW52KHJlZmxlY3REaXIpO1xuICB9YCxcblxuICB2ZXJ0OiBgXG4gIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgdm9pZCBtYWluKCkgeyBnbF9Qb3NpdGlvbiA9IHZlYzQoMCwwLDAsMCk7IH1cbiAgYCxcblxuICB1bmlmb3Jtczoge1xuICAgIGVudm1hcDogcmVnbC50ZXh0dXJlKCdhc3NldHMvb2dkLW9yZWdvbi0zNjAuanBnJyksXG5cbiAgICB2aWV3OiByZWdsLnByb3AoJ3ZpZXcnKSxcblxuICAgIHByb2plY3Rpb246IChhcmdzLCBiYXRjaElkLCB7d2lkdGgsIGhlaWd0aH0pID0+XG4gICAgICBtYXQ0LnBlcnNwZWN0aXZlKFtdLFxuICAgICAgICBNYXRoLlBJIC8gNCxcbiAgICAgICAgcmVnbC5zdGF0cy53aWR0aCAvIHJlZ2wuc3RhdHMuaGVpZ2h0LFxuICAgICAgICAwLjAxLFxuICAgICAgICAxMDAwKSxcblxuICAgIGludlZpZXc6ICh7dmlld30pID0+IG1hdDQuaW52ZXJ0KFtdLCB2aWV3KVxuICB9XG59KVxuXG5jb25zdCBkcmF3QmFja2dyb3VuZCA9IHJlZ2woe1xuICB2ZXJ0OiBgXG4gIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICBhdHRyaWJ1dGUgdmVjMiBwb3NpdGlvbjtcbiAgdW5pZm9ybSBtYXQ0IHZpZXc7XG4gIHZhcnlpbmcgdmVjMyByZWZsZWN0RGlyO1xuICB2b2lkIG1haW4oKSB7XG4gICAgcmVmbGVjdERpciA9ICh2aWV3ICogdmVjNChwb3NpdGlvbiwgMSwgMCkpLnh5ejtcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xuICB9YCxcblxuICBhdHRyaWJ1dGVzOiB7XG4gICAgcG9zaXRpb246IHJlZ2wuYnVmZmVyKFtcbiAgICAgIC00LCAtNCxcbiAgICAgIC00LCA0LFxuICAgICAgOCwgMF0pXG4gIH0sXG5cbiAgZGVwdGg6IHtcbiAgICBtYXNrOiBmYWxzZSxcbiAgICBlbmFibGU6IGZhbHNlXG4gIH0sXG5cbiAgY291bnQ6IDNcbn0pXG5cbmNvbnN0IGRyYXdCdW5ueSA9IHJlZ2woe1xuICB2ZXJ0OiBgXG4gIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICBhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbiwgbm9ybWFsO1xuICB1bmlmb3JtIG1hdDQgcHJvamVjdGlvbiwgdmlldywgaW52VmlldztcbiAgdmFyeWluZyB2ZWMzIHJlZmxlY3REaXI7XG4gIHZvaWQgbWFpbigpIHtcbiAgICB2ZWM0IGV5ZSA9IGludlZpZXcgKiB2ZWM0KDAsIDAsIDAsIDEpO1xuICAgIHJlZmxlY3REaXIgPSByZWZsZWN0KFxuICAgICAgbm9ybWFsaXplKHBvc2l0aW9uLnh5eiAtIGV5ZS54eXogLyBleWUudyksXG4gICAgICBub3JtYWwpO1xuICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbiAqIHZpZXcgKiB2ZWM0KHBvc2l0aW9uLCAxKTtcbiAgfWAsXG5cbiAgYXR0cmlidXRlczoge1xuICAgIHBvc2l0aW9uOiByZWdsLmJ1ZmZlcihidW5ueS5wb3NpdGlvbnMpLFxuICAgIG5vcm1hbDogcmVnbC5idWZmZXIobm9ybWFscyhidW5ueS5jZWxscywgYnVubnkucG9zaXRpb25zKSlcbiAgfSxcblxuICBlbGVtZW50czogcmVnbC5lbGVtZW50cyhidW5ueS5jZWxscylcbn0pXG5cbnJlZ2wuZnJhbWUoKCkgPT4ge1xuICBjb25zdCB0ID0gMC4wMSAqIHJlZ2wuc3RhdHMuY291bnRcblxuICBzZXR1cEVudk1hcCh7XG4gICAgdmlldzogbWF0NC5sb29rQXQoW10sXG4gICAgICBbMzAgKiBNYXRoLmNvcyh0KSwgMi41LCAzMCAqIE1hdGguc2luKHQpXSxcbiAgICAgIFswLCAyLjUsIDBdLFxuICAgICAgWzAsIDEsIDBdKVxuICB9LCAoKSA9PiB7XG4gICAgZHJhd0JhY2tncm91bmQoKVxuICAgIGRyYXdCdW5ueSgpXG4gIH0pXG59KVxuIiwidmFyIGdsVHlwZXMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy9kdHlwZXMuanNvbicpXG5cbnZhciBHTF9GTE9BVCA9IDUxMjZcblxuZnVuY3Rpb24gQXR0cmlidXRlUmVjb3JkICgpIHtcbiAgdGhpcy5wb2ludGVyID0gZmFsc2VcblxuICB0aGlzLnggPSAwLjBcbiAgdGhpcy55ID0gMC4wXG4gIHRoaXMueiA9IDAuMFxuICB0aGlzLncgPSAwLjBcblxuICB0aGlzLmJ1ZmZlciA9IG51bGxcbiAgdGhpcy5zaXplID0gMFxuICB0aGlzLm5vcm1hbGl6ZWQgPSBmYWxzZVxuICB0aGlzLnR5cGUgPSBHTF9GTE9BVFxuICB0aGlzLm9mZnNldCA9IDBcbiAgdGhpcy5zdHJpZGUgPSAwXG4gIHRoaXMuZGl2aXNvciA9IDBcbn1cblxuT2JqZWN0LmFzc2lnbihBdHRyaWJ1dGVSZWNvcmQucHJvdG90eXBlLCB7XG4gIGVxdWFsczogZnVuY3Rpb24gKG90aGVyLCBzaXplKSB7XG4gICAgaWYgKCF0aGlzLnBvaW50ZXIpIHtcbiAgICAgIHJldHVybiAhb3RoZXIucG9pbnRlciAmJlxuICAgICAgICB0aGlzLnggPT09IG90aGVyLnggJiZcbiAgICAgICAgdGhpcy55ID09PSBvdGhlci55ICYmXG4gICAgICAgIHRoaXMueiA9PT0gb3RoZXIueiAmJlxuICAgICAgICB0aGlzLncgPT09IG90aGVyLndcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG90aGVyLnBvaW50ZXIgJiZcbiAgICAgICAgdGhpcy5idWZmZXIgPT09IG90aGVyLmJ1ZmZlciAmJlxuICAgICAgICB0aGlzLnNpemUgPT09IHNpemUgJiZcbiAgICAgICAgdGhpcy5ub3JtYWxpemVkID09PSBvdGhlci5ub3JtYWxpemVkICYmXG4gICAgICAgIHRoaXMudHlwZSA9PT0gb3RoZXIudHlwZSAmJlxuICAgICAgICB0aGlzLm9mZnNldCA9PT0gb3RoZXIub2Zmc2V0ICYmXG4gICAgICAgIHRoaXMuc3RyaWRlID09PSBvdGhlci5zdHJpZGUgJiZcbiAgICAgICAgdGhpcy5kaXZpc29yID09PSBvdGhlci5kaXZpc29yXG4gICAgfVxuICB9LFxuXG4gIHNldDogZnVuY3Rpb24gKG90aGVyLCBzaXplKSB7XG4gICAgdmFyIHBvaW50ZXIgPSB0aGlzLnBvaW50ZXIgPSBvdGhlci5wb2ludGVyXG4gICAgaWYgKHBvaW50ZXIpIHtcbiAgICAgIHRoaXMuYnVmZmVyID0gb3RoZXIuYnVmZmVyXG4gICAgICB0aGlzLnNpemUgPSBzaXplXG4gICAgICB0aGlzLm5vcm1hbGl6ZWQgPSBvdGhlci5ub3JtYWxpemVkXG4gICAgICB0aGlzLnR5cGUgPSBvdGhlci50eXBlXG4gICAgICB0aGlzLm9mZnNldCA9IG90aGVyLm9mZnNldFxuICAgICAgdGhpcy5zdHJpZGUgPSBvdGhlci5zdHJpZGVcbiAgICAgIHRoaXMuZGl2aXNvciA9IG90aGVyLmRpdmlzb3JcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54ID0gb3RoZXIueFxuICAgICAgdGhpcy55ID0gb3RoZXIueVxuICAgICAgdGhpcy56ID0gb3RoZXIuelxuICAgICAgdGhpcy53ID0gb3RoZXIud1xuICAgIH1cbiAgfVxufSlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3cmFwQXR0cmlidXRlU3RhdGUgKGdsLCBleHRlbnNpb25zLCBsaW1pdHMsIGJ1ZmZlclN0YXRlKSB7XG4gIHZhciBhdHRyaWJ1dGVTdGF0ZSA9IHt9XG5cbiAgdmFyIE5VTV9BVFRSSUJVVEVTID0gbGltaXRzLm1heEF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZUJpbmRpbmdzID0gbmV3IEFycmF5KE5VTV9BVFRSSUJVVEVTKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IE5VTV9BVFRSSUJVVEVTOyArK2kpIHtcbiAgICBhdHRyaWJ1dGVCaW5kaW5nc1tpXSA9IG5ldyBBdHRyaWJ1dGVSZWNvcmQoKVxuICB9XG5cbiAgZnVuY3Rpb24gQXR0cmlidXRlU3RhY2sgKCkge1xuICAgIHZhciByZWNvcmRzID0gbmV3IEFycmF5KDE2KVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgcmVjb3Jkc1tpXSA9IG5ldyBBdHRyaWJ1dGVSZWNvcmQoKVxuICAgIH1cbiAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzXG4gICAgdGhpcy50b3AgPSAwXG4gIH1cblxuICBmdW5jdGlvbiBwdXNoQXR0cmlidXRlU3RhY2sgKHN0YWNrKSB7XG4gICAgdmFyIHJlY29yZHMgPSBzdGFjay5yZWNvcmRzXG4gICAgdmFyIHRvcCA9IHN0YWNrLnRvcFxuXG4gICAgd2hpbGUgKHJlY29yZHMubGVuZ3RoIC0gMSA8PSB0b3ApIHtcbiAgICAgIHJlY29yZHMucHVzaChuZXcgQXR0cmlidXRlUmVjb3JkKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlY29yZHNbKytzdGFjay50b3BdXG4gIH1cblxuICBPYmplY3QuYXNzaWduKEF0dHJpYnV0ZVN0YWNrLnByb3RvdHlwZSwge1xuICAgIHB1c2hWZWM6IGZ1bmN0aW9uICh4LCB5LCB6LCB3KSB7XG4gICAgICB2YXIgaGVhZCA9IHB1c2hBdHRyaWJ1dGVTdGFjayh0aGlzKVxuICAgICAgaGVhZC5wb2ludGVyID0gZmFsc2VcbiAgICAgIGhlYWQueCA9IHhcbiAgICAgIGhlYWQueSA9IHlcbiAgICAgIGhlYWQueiA9IHpcbiAgICAgIGhlYWQudyA9IHdcbiAgICB9LFxuXG4gICAgcHVzaFB0cjogZnVuY3Rpb24gKFxuICAgICAgYnVmZmVyLFxuICAgICAgc2l6ZSxcbiAgICAgIG9mZnNldCxcbiAgICAgIHN0cmlkZSxcbiAgICAgIGRpdmlzb3IsXG4gICAgICBub3JtYWxpemVkLFxuICAgICAgdHlwZSkge1xuICAgICAgdmFyIGhlYWQgPSBwdXNoQXR0cmlidXRlU3RhY2sodGhpcylcbiAgICAgIGhlYWQucG9pbnRlciA9IHRydWVcbiAgICAgIGhlYWQuYnVmZmVyID0gYnVmZmVyXG4gICAgICBoZWFkLnNpemUgPSBzaXplXG4gICAgICBoZWFkLm9mZnNldCA9IG9mZnNldFxuICAgICAgaGVhZC5zdHJpZGUgPSBzdHJpZGVcbiAgICAgIGhlYWQuZGl2aXNvciA9IGRpdmlzb3JcbiAgICAgIGhlYWQubm9ybWFsaXplZCA9IG5vcm1hbGl6ZWRcbiAgICAgIGhlYWQudHlwZSA9IHR5cGVcbiAgICB9LFxuXG4gICAgcHVzaER5bjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhpcy5wdXNoVmVjKGRhdGEsIDAsIDAsIDApXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgdGhpcy5wdXNoVmVjKGRhdGFbMF0sIGRhdGFbMV0sIGRhdGFbMl0sIGRhdGFbM10pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYnVmZmVyID0gYnVmZmVyU3RhdGUuZ2V0QnVmZmVyKGRhdGEpXG4gICAgICAgIHZhciBzaXplID0gMFxuICAgICAgICB2YXIgc3RyaWRlID0gMFxuICAgICAgICB2YXIgb2Zmc2V0ID0gMFxuICAgICAgICB2YXIgZGl2aXNvciA9IDBcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWQgPSBmYWxzZVxuICAgICAgICB2YXIgdHlwZSA9IEdMX0ZMT0FUXG4gICAgICAgIGlmICghYnVmZmVyKSB7XG4gICAgICAgICAgYnVmZmVyID0gYnVmZmVyU3RhdGUuZ2V0QnVmZmVyKGRhdGEuYnVmZmVyKVxuICAgICAgICAgIHNpemUgPSBkYXRhLnNpemUgfHwgMFxuICAgICAgICAgIHN0cmlkZSA9IGRhdGEuc3RyaWRlIHx8IDBcbiAgICAgICAgICBvZmZzZXQgPSBkYXRhLm9mZnNldCB8fCAwXG4gICAgICAgICAgZGl2aXNvciA9IGRhdGEuZGl2aXNvciB8fCAwXG4gICAgICAgICAgbm9ybWFsaXplZCA9IGRhdGEubm9ybWFsaXplZCB8fCBmYWxzZVxuICAgICAgICAgIHR5cGUgPSBidWZmZXIuZHR5cGVcbiAgICAgICAgICBpZiAoJ3R5cGUnIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHR5cGUgPSBnbFR5cGVzW2RhdGEudHlwZV1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHlwZSA9IGJ1ZmZlci5kdHlwZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHVzaFB0cihidWZmZXIsIHNpemUsIG9mZnNldCwgc3RyaWRlLCBkaXZpc29yLCBub3JtYWxpemVkLCB0eXBlKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBwb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudG9wIC09IDFcbiAgICB9XG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEJJTkQgQU4gQVRUUklCVVRFXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBmdW5jdGlvbiBiaW5kQXR0cmlidXRlIChpbmRleCwgY3VycmVudCwgbmV4dCwgc2l6ZSkge1xuICAgIHNpemUgPSBuZXh0LnNpemUgfHwgc2l6ZVxuICAgIGlmIChjdXJyZW50LmVxdWFscyhuZXh0LCBzaXplKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghbmV4dC5wb2ludGVyKSB7XG4gICAgICBpZiAoY3VycmVudC5wb2ludGVyKSB7XG4gICAgICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShpbmRleClcbiAgICAgIH1cbiAgICAgIGdsLnZlcnRleEF0dHJpYjRmKGluZGV4LCBuZXh0LngsIG5leHQueSwgbmV4dC56LCBuZXh0LncpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY3VycmVudC5wb2ludGVyKSB7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGluZGV4KVxuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQuYnVmZmVyICE9PSBuZXh0LmJ1ZmZlcikge1xuICAgICAgICBuZXh0LmJ1ZmZlci5iaW5kKClcbiAgICAgIH1cbiAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXG4gICAgICAgIGluZGV4LFxuICAgICAgICBzaXplLFxuICAgICAgICBuZXh0LnR5cGUsXG4gICAgICAgIG5leHQubm9ybWFsaXplZCxcbiAgICAgICAgbmV4dC5zdHJpZGUsXG4gICAgICAgIG5leHQub2Zmc2V0KVxuICAgICAgdmFyIGV4dEluc3RhbmNpbmcgPSBleHRlbnNpb25zLmFuZ2xlX2luc3RhbmNlZF9hcnJheXNcbiAgICAgIGlmIChleHRJbnN0YW5jaW5nKSB7XG4gICAgICAgIGV4dEluc3RhbmNpbmcudmVydGV4QXR0cmliRGl2aXNvckFOR0xFKGluZGV4LCBuZXh0LmRpdmlzb3IpXG4gICAgICB9XG4gICAgfVxuICAgIGN1cnJlbnQuc2V0KG5leHQsIHNpemUpXG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gREVGSU5FIEEgTkVXIEFUVFJJQlVURVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZnVuY3Rpb24gZGVmQXR0cmlidXRlIChuYW1lKSB7XG4gICAgaWYgKG5hbWUgaW4gYXR0cmlidXRlU3RhdGUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBhdHRyaWJ1dGVTdGF0ZVtuYW1lXSA9IG5ldyBBdHRyaWJ1dGVTdGFjaygpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJpbmRpbmdzOiBhdHRyaWJ1dGVCaW5kaW5ncyxcbiAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVTdGF0ZSxcbiAgICBiaW5kOiBiaW5kQXR0cmlidXRlLFxuICAgIGRlZjogZGVmQXR0cmlidXRlXG4gIH1cbn1cbiIsIi8vIEFycmF5IGFuZCBlbGVtZW50IGJ1ZmZlciBjcmVhdGlvblxudmFyIGNoZWNrID0gcmVxdWlyZSgnLi9jaGVjaycpXG52YXIgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pcy10eXBlZC1hcnJheScpXG52YXIgaXNOREFycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXMtbmRhcnJheScpXG52YXIgYXJyYXlUeXBlcyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzL2FycmF5dHlwZXMuanNvbicpXG52YXIgYnVmZmVyVHlwZXMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy9kdHlwZXMuanNvbicpXG52YXIgdmFsdWVzID0gcmVxdWlyZSgnLi92YWx1ZXMnKVxuXG52YXIgR0xfU1RBVElDX0RSQVcgPSAzNTA0NFxuXG52YXIgR0xfQllURSA9IDUxMjBcbnZhciBHTF9VTlNJR05FRF9CWVRFID0gNTEyMVxudmFyIEdMX1NIT1JUID0gNTEyMlxudmFyIEdMX1VOU0lHTkVEX1NIT1JUID0gNTEyM1xudmFyIEdMX0lOVCA9IDUxMjRcbnZhciBHTF9VTlNJR05FRF9JTlQgPSA1MTI1XG52YXIgR0xfRkxPQVQgPSA1MTI2XG5cbnZhciB1c2FnZVR5cGVzID0ge1xuICAnc3RhdGljJzogMzUwNDQsXG4gICdkeW5hbWljJzogMzUwNDgsXG4gICdzdHJlYW0nOiAzNTA0MFxufVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5Q29kZSAoZGF0YSkge1xuICByZXR1cm4gYXJyYXlUeXBlc1tPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSldIHwgMFxufVxuXG5mdW5jdGlvbiBtYWtlVHlwZWRBcnJheSAoZHR5cGUsIGFyZ3MpIHtcbiAgc3dpdGNoIChkdHlwZSkge1xuICAgIGNhc2UgR0xfVU5TSUdORURfQllURTpcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShhcmdzKVxuICAgIGNhc2UgR0xfVU5TSUdORURfU0hPUlQ6XG4gICAgICByZXR1cm4gbmV3IFVpbnQxNkFycmF5KGFyZ3MpXG4gICAgY2FzZSBHTF9VTlNJR05FRF9JTlQ6XG4gICAgICByZXR1cm4gbmV3IFVpbnQzMkFycmF5KGFyZ3MpXG4gICAgY2FzZSBHTF9CWVRFOlxuICAgICAgcmV0dXJuIG5ldyBJbnQ4QXJyYXkoYXJncylcbiAgICBjYXNlIEdMX1NIT1JUOlxuICAgICAgcmV0dXJuIG5ldyBJbnQxNkFycmF5KGFyZ3MpXG4gICAgY2FzZSBHTF9JTlQ6XG4gICAgICByZXR1cm4gbmV3IEludDMyQXJyYXkoYXJncylcbiAgICBjYXNlIEdMX0ZMT0FUOlxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoYXJncylcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuIChyZXN1bHQsIGRhdGEsIGRpbWVuc2lvbikge1xuICB2YXIgcHRyID0gMFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgdiA9IGRhdGFbaV1cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRpbWVuc2lvbjsgKytqKSB7XG4gICAgICByZXN1bHRbcHRyKytdID0gdltqXVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc3Bvc2UgKHJlc3VsdCwgZGF0YSwgc2hhcGVYLCBzaGFwZVksIHN0cmlkZVgsIHN0cmlkZVksIG9mZnNldCkge1xuICB2YXIgcHRyID0gMFxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNoYXBlWDsgKytpKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaGFwZVk7ICsraikge1xuICAgICAgcmVzdWx0W3B0cisrXSA9IGRhdGFbc3RyaWRlWCAqIGkgKyBzdHJpZGVZICogaiArIG9mZnNldF1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdyYXBCdWZmZXJTdGF0ZSAoZ2wpIHtcbiAgdmFyIGJ1ZmZlckNvdW50ID0gMFxuICB2YXIgYnVmZmVyU2V0ID0ge31cblxuICBmdW5jdGlvbiBSRUdMQnVmZmVyIChidWZmZXIsIHR5cGUpIHtcbiAgICB0aGlzLmlkID0gYnVmZmVyQ291bnQrK1xuICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICAgIHRoaXMudXNhZ2UgPSBHTF9TVEFUSUNfRFJBV1xuICAgIHRoaXMuYnl0ZUxlbmd0aCA9IDBcbiAgICB0aGlzLmRpbWVuc2lvbiA9IDFcbiAgICB0aGlzLmRhdGEgPSBudWxsXG4gICAgdGhpcy5kdHlwZSA9IEdMX1VOU0lHTkVEX0JZVEVcbiAgfVxuXG4gIFJFR0xCdWZmZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2wuYmluZEJ1ZmZlcih0aGlzLnR5cGUsIHRoaXMuYnVmZmVyKVxuICB9XG5cbiAgZnVuY3Rpb24gcmVmcmVzaCAoYnVmZmVyKSB7XG4gICAgaWYgKCFnbC5pc0J1ZmZlcihidWZmZXIuYnVmZmVyKSkge1xuICAgICAgYnVmZmVyLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpXG4gICAgfVxuICAgIGJ1ZmZlci5iaW5kKClcbiAgICBnbC5idWZmZXJEYXRhKGJ1ZmZlci50eXBlLCBidWZmZXIuZGF0YSB8fCBidWZmZXIuYnl0ZUxlbmd0aCwgYnVmZmVyLnVzYWdlKVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSAoYnVmZmVyKSB7XG4gICAgdmFyIGhhbmRsZSA9IGJ1ZmZlci5idWZmZXJcbiAgICBjaGVjayhoYW5kbGUsICdidWZmZXIgbXVzdCBub3QgYmUgZGVsZXRlZCBhbHJlYWR5JylcbiAgICBpZiAoZ2wuaXNCdWZmZXIoaGFuZGxlKSkge1xuICAgICAgZ2wuZGVsZXRlQnVmZmVyKGhhbmRsZSlcbiAgICB9XG4gICAgYnVmZmVyLmJ1ZmZlciA9IG51bGxcbiAgICBkZWxldGUgYnVmZmVyU2V0W2J1ZmZlci5pZF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAob3B0aW9ucywgdHlwZSwgZGVmZXJJbml0KSB7XG4gICAgdmFyIGhhbmRsZSA9IGdsLmNyZWF0ZUJ1ZmZlcigpXG5cbiAgICB2YXIgYnVmZmVyID0gbmV3IFJFR0xCdWZmZXIoaGFuZGxlLCB0eXBlKVxuICAgIGJ1ZmZlclNldFtidWZmZXIuaWRdID0gYnVmZmVyXG5cbiAgICBmdW5jdGlvbiByZWdsQnVmZmVyIChpbnB1dCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBpbnB1dCB8fCB7fVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucykgfHxcbiAgICAgICAgICBpc1R5cGVkQXJyYXkob3B0aW9ucykgfHxcbiAgICAgICAgICBpc05EQXJyYXlMaWtlKG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgZGF0YTogb3B0aW9uc1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJykge1xuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgIGxlbmd0aDogb3B0aW9ucyB8IDBcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgICBvcHRpb25zID0ge31cbiAgICAgIH1cblxuICAgICAgY2hlY2sudHlwZShcbiAgICAgICAgb3B0aW9ucywgJ29iamVjdCcsXG4gICAgICAgICdidWZmZXIgYXJndW1lbnRzIG11c3QgYmUgYW4gb2JqZWN0LCBhIG51bWJlciBvciBhbiBhcnJheScpXG5cbiAgICAgIGlmICgndXNhZ2UnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHVzYWdlID0gb3B0aW9ucy51c2FnZVxuICAgICAgICBjaGVjay5wYXJhbWV0ZXIodXNhZ2UsIHVzYWdlVHlwZXMsICdpbnZhbGlkIGJ1ZmZlciB1c2FnZScpXG4gICAgICAgIGJ1ZmZlci51c2FnZSA9IHVzYWdlVHlwZXNbb3B0aW9ucy51c2FnZV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZmZlci51c2FnZSA9IEdMX1NUQVRJQ19EUkFXXG4gICAgICB9XG5cbiAgICAgIHZhciBkdHlwZSA9IDBcbiAgICAgIGlmICgndHlwZScgaW4gb3B0aW9ucykge1xuICAgICAgICBjaGVjay5wYXJhbWV0ZXIob3B0aW9ucy50eXBlLCBidWZmZXJUeXBlcywgJ2ludmFsaWQgYnVmZmVyIHR5cGUnKVxuICAgICAgICBkdHlwZSA9IGJ1ZmZlclR5cGVzW29wdGlvbnMudHlwZV1cbiAgICAgIH1cblxuICAgICAgdmFyIGRpbWVuc2lvbiA9IChvcHRpb25zLmRpbWVuc2lvbiB8IDApIHx8IDFcbiAgICAgIHZhciBieXRlTGVuZ3RoID0gMFxuICAgICAgdmFyIGRhdGEgPSBudWxsXG4gICAgICBpZiAoJ2RhdGEnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGF0YSA9IG9wdGlvbnMuZGF0YVxuICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgIGJ5dGVMZW5ndGggPSBvcHRpb25zLmxlbmd0aCB8IDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNOREFycmF5TGlrZShkYXRhKSkge1xuICAgICAgICAgICAgdmFyIHNoYXBlID0gZGF0YS5zaGFwZVxuICAgICAgICAgICAgdmFyIHN0cmlkZSA9IGRhdGEuc3RyaWRlXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gZGF0YS5vZmZzZXRcblxuICAgICAgICAgICAgdmFyIHNoYXBlWCA9IDBcbiAgICAgICAgICAgIHZhciBzaGFwZVkgPSAwXG4gICAgICAgICAgICB2YXIgc3RyaWRlWCA9IDBcbiAgICAgICAgICAgIHZhciBzdHJpZGVZID0gMFxuICAgICAgICAgICAgaWYgKHNoYXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICBzaGFwZVggPSBzaGFwZVswXVxuICAgICAgICAgICAgICBzaGFwZVkgPSAxXG4gICAgICAgICAgICAgIHN0cmlkZVggPSBzdHJpZGVbMF1cbiAgICAgICAgICAgICAgc3RyaWRlWSA9IDBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgIHNoYXBlWCA9IHNoYXBlWzBdXG4gICAgICAgICAgICAgIHNoYXBlWSA9IHNoYXBlWzFdXG4gICAgICAgICAgICAgIHN0cmlkZVggPSBzdHJpZGVbMF1cbiAgICAgICAgICAgICAgc3RyaWRlWSA9IHN0cmlkZVsxXVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2hlY2sucmFpc2UoJ2ludmFsaWQgc2hhcGUnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkdHlwZSA9IGR0eXBlIHx8IHR5cGVkQXJyYXlDb2RlKGRhdGEpIHx8IEdMX0ZMT0FUXG4gICAgICAgICAgICBkaW1lbnNpb24gPSBzaGFwZVlcbiAgICAgICAgICAgIGRhdGEgPSB0cmFuc3Bvc2UoXG4gICAgICAgICAgICAgIG1ha2VUeXBlZEFycmF5KGR0eXBlLCBzaGFwZVggKiBzaGFwZVkpLFxuICAgICAgICAgICAgICBkYXRhLmRhdGEsXG4gICAgICAgICAgICAgIHNoYXBlWCwgc2hhcGVZLFxuICAgICAgICAgICAgICBzdHJpZGVYLCBzdHJpZGVZLFxuICAgICAgICAgICAgICBvZmZzZXQpXG4gICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAwICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICAgICAgICAgICAgZGltZW5zaW9uID0gZGF0YVswXS5sZW5ndGhcbiAgICAgICAgICAgICAgZHR5cGUgPSBkdHlwZSB8fCBHTF9GTE9BVFxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWFrZVR5cGVkQXJyYXkoZHR5cGUsIGRhdGEubGVuZ3RoICogZGltZW5zaW9uKVxuICAgICAgICAgICAgICBkYXRhID0gZmxhdHRlbihyZXN1bHQsIGRhdGEsIGRpbWVuc2lvbilcbiAgICAgICAgICAgICAgZGF0YSA9IHJlc3VsdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZHR5cGUgPSBkdHlwZSB8fCBHTF9GTE9BVFxuICAgICAgICAgICAgICBkYXRhID0gbWFrZVR5cGVkQXJyYXkoZHR5cGUsIGRhdGEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrLmlzVHlwZWRBcnJheShkYXRhLCAnaW52YWxpZCBkYXRhIHR5cGUgYnVmZmVyIGRhdGEnKVxuICAgICAgICAgICAgZHR5cGUgPSBkdHlwZSB8fCB0eXBlZEFycmF5Q29kZShkYXRhKVxuICAgICAgICAgIH1cbiAgICAgICAgICBieXRlTGVuZ3RoID0gZGF0YS5ieXRlTGVuZ3RoXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoJ2xlbmd0aCcgaW4gb3B0aW9ucykge1xuICAgICAgICBieXRlTGVuZ3RoID0gb3B0aW9ucy5sZW5ndGggfCAwXG4gICAgICAgIGNoZWNrLm5uaShieXRlTGVuZ3RoLCAnYnVmZmVyIGxlbmd0aCBtdXN0IGJlIGEgbm9ubmVnYXRpdmUgaW50ZWdlcicpXG4gICAgICB9XG5cbiAgICAgIGJ1ZmZlci5kYXRhID0gZGF0YVxuICAgICAgYnVmZmVyLmR0eXBlID0gZHR5cGUgfHwgR0xfVU5TSUdORURfQllURVxuICAgICAgYnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG4gICAgICBidWZmZXIuZGltZW5zaW9uID0gZGltZW5zaW9uXG5cbiAgICAgIHJlZnJlc2goYnVmZmVyKVxuXG4gICAgICByZXR1cm4gcmVnbEJ1ZmZlclxuICAgIH1cblxuICAgIGlmICghZGVmZXJJbml0KSB7XG4gICAgICByZWdsQnVmZmVyKG9wdGlvbnMpXG4gICAgfVxuXG4gICAgcmVnbEJ1ZmZlci5fcmVnbFR5cGUgPSAnYnVmZmVyJ1xuICAgIHJlZ2xCdWZmZXIuX2J1ZmZlciA9IGJ1ZmZlclxuICAgIHJlZ2xCdWZmZXIuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgZGVzdHJveShidWZmZXIpIH1cblxuICAgIHJldHVybiByZWdsQnVmZmVyXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZTogY3JlYXRlQnVmZmVyLFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhbHVlcyhidWZmZXJTZXQpLmZvckVhY2goZGVzdHJveSlcbiAgICB9LFxuXG4gICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFsdWVzKGJ1ZmZlclNldCkuZm9yRWFjaChyZWZyZXNoKVxuICAgIH0sXG5cbiAgICBnZXRCdWZmZXI6IGZ1bmN0aW9uICh3cmFwcGVyKSB7XG4gICAgICBpZiAod3JhcHBlciAmJiB3cmFwcGVyLl9idWZmZXIgaW5zdGFuY2VvZiBSRUdMQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiB3cmFwcGVyLl9idWZmZXJcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG4iLCIvLyBFcnJvciBjaGVja2luZyBhbmQgcGFyYW1ldGVyIHZhbGlkYXRpb25cbnZhciBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzLXR5cGVkLWFycmF5JylcblxuZnVuY3Rpb24gcmFpc2UgKG1lc3NhZ2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKCcocmVnbCkgJyArIG1lc3NhZ2UpXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIHRocm93IGVycm9yXG59XG5cbmZ1bmN0aW9uIGNoZWNrIChwcmVkLCBtZXNzYWdlKSB7XG4gIGlmICghcHJlZCkge1xuICAgIHJhaXNlKG1lc3NhZ2UpXG4gIH1cbn1cblxuZnVuY3Rpb24gZW5jb2xvbiAobWVzc2FnZSkge1xuICBpZiAobWVzc2FnZSkge1xuICAgIHJldHVybiAnOiAnICsgbWVzc2FnZVxuICB9XG4gIHJldHVybiAnJ1xufVxuXG5mdW5jdGlvbiBjaGVja1BhcmFtZXRlciAocGFyYW0sIHBvc3NpYmlsaXRpZXMsIG1lc3NhZ2UpIHtcbiAgaWYgKCEocGFyYW0gaW4gcG9zc2liaWxpdGllcykpIHtcbiAgICByYWlzZSgndW5rbm93biBwYXJhbWV0ZXIgKCcgKyBwYXJhbSArICcpJyArIGVuY29sb24obWVzc2FnZSkgK1xuICAgICAgICAgICcuIHBvc3NpYmxlIHZhbHVlczogJyArIE9iamVjdC5rZXlzKHBvc3NpYmlsaXRpZXMpLmpvaW4oKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0lzVHlwZWRBcnJheSAoZGF0YSwgbWVzc2FnZSkge1xuICBpZiAoIWlzVHlwZWRBcnJheShkYXRhKSkge1xuICAgIHJhaXNlKFxuICAgICAgJ2ludmFsaWQgcGFyYW1ldGVyIHR5cGUnICsgZW5jb2xvbihtZXNzYWdlKSArXG4gICAgICAnLiBtdXN0IGJlIGEgdHlwZWQgYXJyYXknKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrVHlwZU9mICh2YWx1ZSwgdHlwZSwgbWVzc2FnZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XG4gICAgcmFpc2UoXG4gICAgICAnaW52YWxpZCBwYXJhbWV0ZXIgdHlwZScgKyBlbmNvbG9uKG1lc3NhZ2UpICtcbiAgICAgICcuIGV4cGVjdGVkICcgKyB0eXBlICsgJywgZ290ICcgKyAodHlwZW9mIHZhbHVlKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja05vbk5lZ2F0aXZlSW50ICh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoISgodmFsdWUgPj0gMCkgJiZcbiAgICAgICAgKCh2YWx1ZSB8IDApID09PSB2YWx1ZSkpKSB7XG4gICAgcmFpc2UoJ2ludmFsaWQgcGFyYW1ldGVyIHR5cGUsICgnICsgdmFsdWUgKyAnKScgKyBlbmNvbG9uKG1lc3NhZ2UpICtcbiAgICAgICAgICAnLiBtdXN0IGJlIGEgbm9ubmVnYXRpdmUgaW50ZWdlcicpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tPbmVPZiAodmFsdWUsIGxpc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKGxpc3QuaW5kZXhPZih2YWx1ZSkgPCAwKSB7XG4gICAgcmFpc2UoJ2ludmFsaWQgdmFsdWUnICsgZW5jb2xvbihtZXNzYWdlKSArICcuIG11c3QgYmUgb25lIG9mOiAnICsgbGlzdClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oY2hlY2ssIHtcbiAgcmFpc2U6IHJhaXNlLFxuICBwYXJhbWV0ZXI6IGNoZWNrUGFyYW1ldGVyLFxuICB0eXBlOiBjaGVja1R5cGVPZixcbiAgaXNUeXBlZEFycmF5OiBjaGVja0lzVHlwZWRBcnJheSxcbiAgbm5pOiBjaGVja05vbk5lZ2F0aXZlSW50LFxuICBvbmVPZjogY2hlY2tPbmVPZlxufSlcbiIsIi8qIGdsb2JhbHMgcGVyZm9ybWFuY2UgKi9cbm1vZHVsZS5leHBvcnRzID1cbiAgKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGVyZm9ybWFuY2Uubm93KVxuICA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpIH1cbiAgOiBmdW5jdGlvbiAoKSB7IHJldHVybiArKG5ldyBEYXRlKCkpIH1cbiIsImZ1bmN0aW9uIHNsaWNlICh4KSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh4KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVudmlyb25tZW50ICgpIHtcbiAgLy8gVW5pcXVlIHZhcmlhYmxlIGlkIGNvdW50ZXJcbiAgdmFyIHZhckNvdW50ZXIgPSAwXG5cbiAgLy8gTGlua2VkIHZhbHVlcyBhcmUgcGFzc2VkIGZyb20gdGhpcyBzY29wZSBpbnRvIHRoZSBnZW5lcmF0ZWQgY29kZSBibG9ja1xuICAvLyBDYWxsaW5nIGxpbmsoKSBwYXNzZXMgYSB2YWx1ZSBpbnRvIHRoZSBnZW5lcmF0ZWQgc2NvcGUgYW5kIHJldHVybnNcbiAgLy8gdGhlIHZhcmlhYmxlIG5hbWUgd2hpY2ggaXQgaXMgYm91bmQgdG9cbiAgdmFyIGxpbmtlZE5hbWVzID0gW11cbiAgdmFyIGxpbmtlZFZhbHVlcyA9IFtdXG4gIGZ1bmN0aW9uIGxpbmsgKHZhbHVlKSB7XG4gICAgdmFyIG5hbWUgPSAnZycgKyAodmFyQ291bnRlcisrKVxuICAgIGxpbmtlZE5hbWVzLnB1c2gobmFtZSlcbiAgICBsaW5rZWRWYWx1ZXMucHVzaCh2YWx1ZSlcbiAgICByZXR1cm4gbmFtZVxuICB9XG5cbiAgLy8gY3JlYXRlIGEgY29kZSBibG9ja1xuICBmdW5jdGlvbiBibG9jayAoKSB7XG4gICAgdmFyIGNvZGUgPSBbXVxuICAgIGZ1bmN0aW9uIHB1c2ggKCkge1xuICAgICAgY29kZS5wdXNoLmFwcGx5KGNvZGUsIHNsaWNlKGFyZ3VtZW50cykpXG4gICAgfVxuXG4gICAgdmFyIHZhcnMgPSBbXVxuICAgIGZ1bmN0aW9uIGRlZiAoKSB7XG4gICAgICB2YXIgbmFtZSA9ICd2JyArICh2YXJDb3VudGVyKyspXG4gICAgICB2YXJzLnB1c2gobmFtZSlcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvZGUucHVzaChuYW1lLCAnPScpXG4gICAgICAgIGNvZGUucHVzaC5hcHBseShjb2RlLCBzbGljZShhcmd1bWVudHMpKVxuICAgICAgICBjb2RlLnB1c2goJzsnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmFtZVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHB1c2gsIHtcbiAgICAgIGRlZjogZGVmLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAodmFycy5sZW5ndGggPiAwID8gJ3ZhciAnICsgdmFycyArICc7JyA6ICcnKSxcbiAgICAgICAgICBjb2RlLmpvaW4oJycpXG4gICAgICAgIF0uam9pbignJylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gcHJvY2VkdXJlIGxpc3RcbiAgdmFyIHByb2NlZHVyZXMgPSB7fVxuICBmdW5jdGlvbiBwcm9jIChuYW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBbXVxuICAgIGZ1bmN0aW9uIGFyZyAoKSB7XG4gICAgICB2YXIgbmFtZSA9ICdhJyArICh2YXJDb3VudGVyKyspXG4gICAgICBhcmdzLnB1c2gobmFtZSlcbiAgICAgIHJldHVybiBuYW1lXG4gICAgfVxuXG4gICAgdmFyIGJvZHkgPSBibG9jaygpXG4gICAgdmFyIGJvZHlUb1N0cmluZyA9IGJvZHkudG9TdHJpbmdcblxuICAgIHZhciByZXN1bHQgPSBwcm9jZWR1cmVzW25hbWVdID0gT2JqZWN0LmFzc2lnbihib2R5LCB7XG4gICAgICBhcmc6IGFyZyxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgJ2Z1bmN0aW9uKCcsIGFyZ3Muam9pbigpLCAnKXsnLFxuICAgICAgICAgIGJvZHlUb1N0cmluZygpLFxuICAgICAgICAgICd9J1xuICAgICAgICBdLmpvaW4oJycpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBpbGUgKCkge1xuICAgIHZhciBjb2RlID0gWydcInVzZSBzdHJpY3RcIjtyZXR1cm4geyddXG4gICAgT2JqZWN0LmtleXMocHJvY2VkdXJlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgY29kZS5wdXNoKCdcIicsIG5hbWUsICdcIjonLCBwcm9jZWR1cmVzW25hbWVdLnRvU3RyaW5nKCksICcsJylcbiAgICB9KVxuICAgIGNvZGUucHVzaCgnfScpXG4gICAgdmFyIHByb2MgPSBGdW5jdGlvbi5hcHBseShudWxsLCBsaW5rZWROYW1lcy5jb25jYXQoW2NvZGUuam9pbignJyldKSlcbiAgICByZXR1cm4gcHJvYy5hcHBseShudWxsLCBsaW5rZWRWYWx1ZXMpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxpbms6IGxpbmssXG4gICAgYmxvY2s6IGJsb2NrLFxuICAgIHByb2M6IHByb2MsXG4gICAgY29tcGlsZTogY29tcGlsZVxuICB9XG59XG4iLCJ2YXIgY2hlY2sgPSByZXF1aXJlKCcuL2NoZWNrJylcbnZhciBjcmVhdGVFbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vY29kZWdlbicpXG5cbnZhciBwcmltVHlwZXMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy9wcmltaXRpdmVzLmpzb24nKVxudmFyIGdsVHlwZXMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy9kdHlwZXMuanNvbicpXG5cbnZhciBHTF9FTEVNRU5UX0FSUkFZX0JVRkZFUiA9IDM0OTYzXG5cbnZhciBHTF9GTE9BVCA9IDUxMjZcbnZhciBHTF9GTE9BVF9WRUMyID0gMzU2NjRcbnZhciBHTF9GTE9BVF9WRUMzID0gMzU2NjVcbnZhciBHTF9GTE9BVF9WRUM0ID0gMzU2NjZcbnZhciBHTF9JTlQgPSA1MTI0XG52YXIgR0xfSU5UX1ZFQzIgPSAzNTY2N1xudmFyIEdMX0lOVF9WRUMzID0gMzU2NjhcbnZhciBHTF9JTlRfVkVDNCA9IDM1NjY5XG52YXIgR0xfQk9PTCA9IDM1NjcwXG52YXIgR0xfQk9PTF9WRUMyID0gMzU2NzFcbnZhciBHTF9CT09MX1ZFQzMgPSAzNTY3MlxudmFyIEdMX0JPT0xfVkVDNCA9IDM1NjczXG52YXIgR0xfRkxPQVRfTUFUMiA9IDM1Njc0XG52YXIgR0xfRkxPQVRfTUFUMyA9IDM1Njc1XG52YXIgR0xfRkxPQVRfTUFUNCA9IDM1Njc2XG52YXIgR0xfU0FNUExFUl8yRCA9IDM1Njc4XG52YXIgR0xfU0FNUExFUl9DVUJFID0gMzU2ODBcblxudmFyIEdMX1RSSUFOR0xFUyA9IDRcblxudmFyIEdMX0NVTExfRkFDRSA9IDB4MEI0NFxudmFyIEdMX0JMRU5EID0gMHgwQkUyXG52YXIgR0xfRElUSEVSID0gMHgwQkQwXG52YXIgR0xfU1RFTkNJTF9URVNUID0gMHgwQjkwXG52YXIgR0xfREVQVEhfVEVTVCA9IDB4MEI3MVxudmFyIEdMX1NDSVNTT1JfVEVTVCA9IDB4MEMxMVxudmFyIEdMX1BPTFlHT05fT0ZGU0VUX0ZJTEwgPSAweDgwMzdcbnZhciBHTF9TQU1QTEVfQUxQSEFfVE9fQ09WRVJBR0UgPSAweDgwOUVcbnZhciBHTF9TQU1QTEVfQ09WRVJBR0UgPSAweDgwQTBcblxudmFyIEdMX0ZST05UID0gMTAyOFxudmFyIEdMX0JBQ0sgPSAxMDI5XG5cbnZhciBHTF9DVyA9IDB4MDkwMFxudmFyIEdMX0NDVyA9IDB4MDkwMVxuXG52YXIgR0xfTUlOX0VYVCA9IDB4ODAwN1xudmFyIEdMX01BWF9FWFQgPSAweDgwMDhcblxudmFyIGJsZW5kRnVuY3MgPSB7XG4gICcwJzogMCxcbiAgJzEnOiAxLFxuICAnemVybyc6IDAsXG4gICdvbmUnOiAxLFxuICAnc3JjIGNvbG9yJzogNzY4LFxuICAnb25lIG1pbnVzIHNyYyBjb2xvcic6IDc2OSxcbiAgJ3NyYyBhbHBoYSc6IDc3MCxcbiAgJ29uZSBtaW51cyBzcmMgYWxwaGEnOiA3NzEsXG4gICdkc3QgY29sb3InOiA3NzQsXG4gICdvbmUgbWludXMgZHN0IGNvbG9yJzogNzc1LFxuICAnZHN0IGFscGhhJzogNzcyLFxuICAnb25lIG1pbnVzIGRzdCBhbHBoYSc6IDc3MyxcbiAgJ2NvbnN0YW50IGNvbG9yJzogMzI3NjksXG4gICdvbmUgbWludXMgY29uc3RhbnQgY29sb3InOiAzMjc3MCxcbiAgJ2NvbnN0YW50IGFscGhhJzogMzI3NzEsXG4gICdvbmUgbWludXMgY29uc3RhbnQgYWxwaGEnOiAzMjc3MixcbiAgJ3NyYyBhbHBoYSBzYXR1cmF0ZSc6IDc3NlxufVxuXG52YXIgY29tcGFyZUZ1bmNzID0ge1xuICAnbmV2ZXInOiA1MTIsXG4gICdsZXNzJzogNTEzLFxuICAnPCc6IDUxMyxcbiAgJ2VxdWFsJzogNTE0LFxuICAnPSc6IDUxNCxcbiAgJz09JzogNTE0LFxuICAnPT09JzogNTE0LFxuICAnbGVxdWFsJzogNTE1LFxuICAnPD0nOiA1MTUsXG4gICdncmVhdGVyJzogNTE2LFxuICAnPic6IDUxNixcbiAgJ25vdGVxdWFsJzogNTE3LFxuICAnIT0nOiA1MTcsXG4gICchPT0nOiA1MTcsXG4gICdnZXF1YWwnOiA1MTgsXG4gICc+PSc6IDUxOCxcbiAgJ2Fsd2F5cyc6IDUxOVxufVxuXG52YXIgc3RlbmNpbE9wcyA9IHtcbiAgJzAnOiAwLFxuICAnemVybyc6IDAsXG4gICdrZWVwJzogNzY4MCxcbiAgJ3JlcGxhY2UnOiA3NjgxLFxuICAnaW5jcmVtZW50JzogNzY4MixcbiAgJ2RlY3JlbWVudCc6IDc2ODMsXG4gICdpbmNyZW1lbnQgd3JhcCc6IDM0MDU1LFxuICAnZGVjcmVtZW50IHdyYXAnOiAzNDA1NixcbiAgJ2ludmVydCc6IDUzODZcbn1cblxuZnVuY3Rpb24gdHlwZUxlbmd0aCAoeCkge1xuICBzd2l0Y2ggKHgpIHtcbiAgICBjYXNlIEdMX0ZMT0FUX1ZFQzI6XG4gICAgY2FzZSBHTF9JTlRfVkVDMjpcbiAgICBjYXNlIEdMX0JPT0xfVkVDMjpcbiAgICAgIHJldHVybiAyXG4gICAgY2FzZSBHTF9GTE9BVF9WRUMzOlxuICAgIGNhc2UgR0xfSU5UX1ZFQzM6XG4gICAgY2FzZSBHTF9CT09MX1ZFQzM6XG4gICAgICByZXR1cm4gM1xuICAgIGNhc2UgR0xfRkxPQVRfVkVDNDpcbiAgICBjYXNlIEdMX0lOVF9WRUM0OlxuICAgIGNhc2UgR0xfQk9PTF9WRUM0OlxuICAgICAgcmV0dXJuIDRcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIDFcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVbmlmb3JtU3RyaW5nIChnbCwgdHlwZSwgbG9jYXRpb24sIHZhbHVlKSB7XG4gIHZhciBpbmZpeFxuICB2YXIgc2VwYXJhdG9yID0gJywnXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgR0xfRkxPQVQ6XG4gICAgICBpbmZpeCA9ICcxZidcbiAgICAgIGJyZWFrXG4gICAgY2FzZSBHTF9GTE9BVF9WRUMyOlxuICAgICAgaW5maXggPSAnMmZ2J1xuICAgICAgYnJlYWtcbiAgICBjYXNlIEdMX0ZMT0FUX1ZFQzM6XG4gICAgICBpbmZpeCA9ICczZnYnXG4gICAgICBicmVha1xuICAgIGNhc2UgR0xfRkxPQVRfVkVDNDpcbiAgICAgIGluZml4ID0gJzRmdidcbiAgICAgIGJyZWFrXG4gICAgY2FzZSBHTF9CT09MOlxuICAgIGNhc2UgR0xfSU5UOlxuICAgICAgaW5maXggPSAnMWknXG4gICAgICBicmVha1xuICAgIGNhc2UgR0xfQk9PTF9WRUMyOlxuICAgIGNhc2UgR0xfSU5UX1ZFQzI6XG4gICAgICBpbmZpeCA9ICcyaXYnXG4gICAgICBicmVha1xuICAgIGNhc2UgR0xfQk9PTF9WRUMzOlxuICAgIGNhc2UgR0xfSU5UX1ZFQzM6XG4gICAgICBpbmZpeCA9ICczaXYnXG4gICAgICBicmVha1xuICAgIGNhc2UgR0xfQk9PTF9WRUM0OlxuICAgIGNhc2UgR0xfSU5UX1ZFQzQ6XG4gICAgICBpbmZpeCA9ICc0aXYnXG4gICAgICBicmVha1xuICAgIGNhc2UgR0xfRkxPQVRfTUFUMjpcbiAgICAgIGluZml4ID0gJ01hdHJpeDJmdidcbiAgICAgIHNlcGFyYXRvciA9ICcsZmFsc2UsJ1xuICAgICAgYnJlYWtcbiAgICBjYXNlIEdMX0ZMT0FUX01BVDM6XG4gICAgICBpbmZpeCA9ICdNYXRyaXgzZnYnXG4gICAgICBzZXBhcmF0b3IgPSAnLGZhbHNlLCdcbiAgICAgIGJyZWFrXG4gICAgY2FzZSBHTF9GTE9BVF9NQVQ0OlxuICAgICAgaW5maXggPSAnTWF0cml4NGZ2J1xuICAgICAgc2VwYXJhdG9yID0gJyxmYWxzZSwnXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICBjaGVjay5yYWlzZSgndW5zdXBwb3J0ZWQgdW5pZm9ybSB0eXBlJylcbiAgfVxuICByZXR1cm4gZ2wgKyAnLnVuaWZvcm0nICsgaW5maXggKyAnKCcgKyBsb2NhdGlvbiArIHNlcGFyYXRvciArIHZhbHVlICsgJyk7J1xufVxuXG5mdW5jdGlvbiBzdGFja1RvcCAoeCkge1xuICByZXR1cm4geCArICdbJyArIHggKyAnLmxlbmd0aC0xXSdcbn1cblxuLy8gTmVlZCB0byBwcm9jZXNzIGZyYW1lYnVmZmVyIGZpcnN0IGluIG9wdGlvbnMgbGlzdFxuZnVuY3Rpb24gb3B0aW9uUHJpb3JpdHkgKGEsIGIpIHtcbiAgaWYgKGEgPT09ICdmcmFtZWJ1ZmZlcicpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoYSA8IGIpIHtcbiAgICByZXR1cm4gLTFcbiAgfSBlbHNlIGlmIChhID4gYikge1xuICAgIHJldHVybiAxXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZWdsQ29tcGlsZXIgKFxuICBnbCxcbiAgZXh0ZW5zaW9ucyxcbiAgbGltaXRzLFxuICBidWZmZXJTdGF0ZSxcbiAgZWxlbWVudFN0YXRlLFxuICB0ZXh0dXJlU3RhdGUsXG4gIGZyYW1lYnVmZmVyU3RhdGUsXG4gIGdsU3RhdGUsXG4gIHVuaWZvcm1TdGF0ZSxcbiAgYXR0cmlidXRlU3RhdGUsXG4gIHNoYWRlclN0YXRlLFxuICBkcmF3U3RhdGUsXG4gIGZyYW1lU3RhdGUsXG4gIHJlZ2xQb2xsKSB7XG4gIHZhciBjb250ZXh0U3RhdGUgPSBnbFN0YXRlLmNvbnRleHRTdGF0ZVxuXG4gIHZhciBibGVuZEVxdWF0aW9ucyA9IHtcbiAgICAnYWRkJzogMzI3NzQsXG4gICAgJ3N1YnRyYWN0JzogMzI3NzgsXG4gICAgJ3JldmVyc2Ugc3VidHJhY3QnOiAzMjc3OVxuICB9XG4gIGlmIChleHRlbnNpb25zLmV4dF9ibGVuZF9taW5tYXgpIHtcbiAgICBibGVuZEVxdWF0aW9ucy5taW4gPSBHTF9NSU5fRVhUXG4gICAgYmxlbmRFcXVhdGlvbnMubWF4ID0gR0xfTUFYX0VYVFxuICB9XG5cbiAgdmFyIGRyYXdDYWxsQ291bnRlciA9IDBcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFNIQURFUiBTSU5HTEUgRFJBVyBPUEVSQVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBmdW5jdGlvbiBjb21waWxlU2hhZGVyRHJhdyAocHJvZ3JhbSkge1xuICAgIHZhciBlbnYgPSBjcmVhdGVFbnZpcm9ubWVudCgpXG4gICAgdmFyIGxpbmsgPSBlbnYubGlua1xuICAgIHZhciBkcmF3ID0gZW52LnByb2MoJ2RyYXcnKVxuICAgIHZhciBkZWYgPSBkcmF3LmRlZlxuXG4gICAgdmFyIEdMID0gbGluayhnbClcbiAgICB2YXIgUFJPR1JBTSA9IGxpbmsocHJvZ3JhbS5wcm9ncmFtKVxuICAgIHZhciBCSU5EX0FUVFJJQlVURSA9IGxpbmsoYXR0cmlidXRlU3RhdGUuYmluZClcbiAgICB2YXIgRFJBV19TVEFURSA9IHtcbiAgICAgIGNvdW50OiBsaW5rKGRyYXdTdGF0ZS5jb3VudCksXG4gICAgICBvZmZzZXQ6IGxpbmsoZHJhd1N0YXRlLm9mZnNldCksXG4gICAgICBpbnN0YW5jZXM6IGxpbmsoZHJhd1N0YXRlLmluc3RhbmNlcyksXG4gICAgICBwcmltaXRpdmU6IGxpbmsoZHJhd1N0YXRlLnByaW1pdGl2ZSlcbiAgICB9XG4gICAgdmFyIEVMRU1FTlRfU1RBVEUgPSBsaW5rKGVsZW1lbnRTdGF0ZS5lbGVtZW50cylcbiAgICB2YXIgVEVYVFVSRV9VTklGT1JNUyA9IFtdXG5cbiAgICAvLyBiaW5kIHRoZSBwcm9ncmFtXG4gICAgZHJhdyhHTCwgJy51c2VQcm9ncmFtKCcsIFBST0dSQU0sICcpOycpXG5cbiAgICAvLyBzZXQgdXAgYXR0cmlidXRlIHN0YXRlXG4gICAgcHJvZ3JhbS5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgdmFyIFNUQUNLID0gbGluayhhdHRyaWJ1dGVTdGF0ZS5hdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSlcbiAgICAgIGRyYXcoQklORF9BVFRSSUJVVEUsICcoJyxcbiAgICAgICAgYXR0cmlidXRlLmxvY2F0aW9uLCAnLCcsXG4gICAgICAgIGxpbmsoYXR0cmlidXRlU3RhdGUuYmluZGluZ3NbYXR0cmlidXRlLmxvY2F0aW9uXSksICcsJyxcbiAgICAgICAgU1RBQ0ssICcucmVjb3Jkc1snLCBTVEFDSywgJy50b3BdJywgJywnLFxuICAgICAgICB0eXBlTGVuZ3RoKGF0dHJpYnV0ZS5pbmZvLnR5cGUpLCAnKTsnKVxuICAgIH0pXG5cbiAgICAvLyBzZXQgdXAgdW5pZm9ybXNcbiAgICBwcm9ncmFtLnVuaWZvcm1zLmZvckVhY2goZnVuY3Rpb24gKHVuaWZvcm0pIHtcbiAgICAgIHZhciBMT0NBVElPTiA9IGxpbmsodW5pZm9ybS5sb2NhdGlvbilcbiAgICAgIHZhciBTVEFDSyA9IGxpbmsodW5pZm9ybVN0YXRlLnVuaWZvcm1zW3VuaWZvcm0ubmFtZV0pXG4gICAgICB2YXIgVE9QID0gU1RBQ0sgKyAnWycgKyBTVEFDSyArICcubGVuZ3RoLTFdJ1xuICAgICAgaWYgKHVuaWZvcm0uaW5mby50eXBlID09PSBHTF9TQU1QTEVSXzJEIHx8XG4gICAgICAgIHVuaWZvcm0uaW5mby50eXBlID09PSBHTF9TQU1QTEVSX0NVQkUpIHtcbiAgICAgICAgdmFyIFRFWF9WQUxVRSA9IGRlZihUT1AgKyAnLl90ZXh0dXJlJylcbiAgICAgICAgVEVYVFVSRV9VTklGT1JNUy5wdXNoKFRFWF9WQUxVRSlcbiAgICAgICAgZHJhdyhzZXRVbmlmb3JtU3RyaW5nKEdMLCBHTF9JTlQsIExPQ0FUSU9OLCBURVhfVkFMVUUgKyAnLmJpbmQoKScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJhdyhzZXRVbmlmb3JtU3RyaW5nKEdMLCB1bmlmb3JtLmluZm8udHlwZSwgTE9DQVRJT04sIFRPUCkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIHVuYmluZCB0ZXh0dXJlcyBpbW1lZGlhdGVseVxuICAgIFRFWFRVUkVfVU5JRk9STVMuZm9yRWFjaChmdW5jdGlvbiAoVEVYX1ZBTFVFKSB7XG4gICAgICBkcmF3KFRFWF9WQUxVRSwgJy51bmJpbmQoKTsnKVxuICAgIH0pXG5cbiAgICAvLyBFeGVjdXRlIGRyYXcgY29tbWFuZFxuICAgIHZhciBDVVJfUFJJTUlUSVZFID0gZGVmKHN0YWNrVG9wKERSQVdfU1RBVEUucHJpbWl0aXZlKSlcbiAgICB2YXIgQ1VSX0NPVU5UID0gZGVmKHN0YWNrVG9wKERSQVdfU1RBVEUuY291bnQpKVxuICAgIHZhciBDVVJfT0ZGU0VUID0gZGVmKHN0YWNrVG9wKERSQVdfU1RBVEUub2Zmc2V0KSlcbiAgICB2YXIgQ1VSX0VMRU1FTlRTID0gZGVmKHN0YWNrVG9wKEVMRU1FTlRfU1RBVEUpKVxuXG4gICAgLy8gT25seSBleGVjdXRlIGRyYXcgY29tbWFuZCBpZiBudW1iZXIgZWxlbWVudHMgaXMgPiAwXG4gICAgZHJhdygnaWYoJywgQ1VSX0NPVU5ULCAnKXsnKVxuXG4gICAgdmFyIGluc3RhbmNpbmcgPSBleHRlbnNpb25zLmFuZ2xlX2luc3RhbmNlZF9hcnJheXNcbiAgICBpZiAoaW5zdGFuY2luZykge1xuICAgICAgdmFyIENVUl9JTlNUQU5DRVMgPSBkZWYoc3RhY2tUb3AoRFJBV19TVEFURS5pbnN0YW5jZXMpKVxuICAgICAgdmFyIElOU1RBTkNFX0VYVCA9IGxpbmsoaW5zdGFuY2luZylcbiAgICAgIGRyYXcoXG4gICAgICAgICdpZignLCBDVVJfRUxFTUVOVFMsICcpeycsXG4gICAgICAgIENVUl9FTEVNRU5UUywgJy5iaW5kKCk7JyxcbiAgICAgICAgJ2lmKCcsIENVUl9JTlNUQU5DRVMsICc+MCl7JyxcbiAgICAgICAgSU5TVEFOQ0VfRVhULCAnLmRyYXdFbGVtZW50c0luc3RhbmNlZEFOR0xFKCcsXG4gICAgICAgIENVUl9QUklNSVRJVkUsICcsJyxcbiAgICAgICAgQ1VSX0NPVU5ULCAnLCcsXG4gICAgICAgIENVUl9FTEVNRU5UUywgJy50eXBlLCcsXG4gICAgICAgIENVUl9PRkZTRVQsICcsJyxcbiAgICAgICAgQ1VSX0lOU1RBTkNFUywgJyk7fWVsc2V7JyxcbiAgICAgICAgR0wsICcuZHJhd0VsZW1lbnRzKCcsXG4gICAgICAgIENVUl9QUklNSVRJVkUsICcsJyxcbiAgICAgICAgQ1VSX0NPVU5ULCAnLCcsXG4gICAgICAgIENVUl9FTEVNRU5UUywgJy50eXBlLCcsXG4gICAgICAgIENVUl9PRkZTRVQsICcpO30nLFxuICAgICAgICAnfWVsc2UgaWYoJywgQ1VSX0lOU1RBTkNFUywgJz4wKXsnLFxuICAgICAgICBJTlNUQU5DRV9FWFQsICcuZHJhd0FycmF5c0luc3RhbmNlZEFOR0xFKCcsXG4gICAgICAgIENVUl9QUklNSVRJVkUsICcsJyxcbiAgICAgICAgQ1VSX09GRlNFVCwgJywnLFxuICAgICAgICBDVVJfQ09VTlQsICcsJyxcbiAgICAgICAgQ1VSX0lOU1RBTkNFUywgJyk7fWVsc2V7JyxcbiAgICAgICAgR0wsICcuZHJhd0FycmF5cygnLFxuICAgICAgICBDVVJfUFJJTUlUSVZFLCAnLCcsXG4gICAgICAgIENVUl9PRkZTRVQsICcsJyxcbiAgICAgICAgQ1VSX0NPVU5ULCAnKTt9fScpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRyYXcoXG4gICAgICAgICdpZignLCBDVVJfRUxFTUVOVFMsICcpeycsXG4gICAgICAgIEdMLCAnLmRyYXdFbGVtZW50cygnLFxuICAgICAgICBDVVJfUFJJTUlUSVZFLCAnLCcsXG4gICAgICAgIENVUl9DT1VOVCwgJywnLFxuICAgICAgICBDVVJfRUxFTUVOVFMsICcudHlwZSwnLFxuICAgICAgICBDVVJfT0ZGU0VULCAnKTt9JyxcbiAgICAgICAgJ31lbHNleycsXG4gICAgICAgIEdMLCAnLmRyYXdBcnJheXMoJyxcbiAgICAgICAgQ1VSX1BSSU1JVElWRSwgJywnLFxuICAgICAgICBDVVJfT0ZGU0VULCAnLCcsXG4gICAgICAgIENVUl9DT1VOVCwgJyk7fScpXG4gICAgfVxuXG4gICAgcmV0dXJuIGVudi5jb21waWxlKCkuZHJhd1xuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCQVRDSCBEUkFXIE9QRVJBVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGZ1bmN0aW9uIGNvbXBpbGVCYXRjaCAoXG4gICAgcHJvZ3JhbSwgb3B0aW9ucywgdW5pZm9ybXMsIGF0dHJpYnV0ZXMsIHN0YXRpY09wdGlvbnMpIHtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY29kZSBnZW5lcmF0aW9uIGhlbHBlcnNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdmFyIGVudiA9IGNyZWF0ZUVudmlyb25tZW50KClcbiAgICB2YXIgbGluayA9IGVudi5saW5rXG4gICAgdmFyIGJhdGNoID0gZW52LnByb2MoJ2JhdGNoJylcbiAgICB2YXIgZXhpdCA9IGVudi5ibG9jaygpXG4gICAgdmFyIGRlZiA9IGJhdGNoLmRlZlxuICAgIHZhciBhcmcgPSBiYXRjaC5hcmdcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyByZWdsIHN0YXRlXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHZhciBHTCA9IGxpbmsoZ2wpXG4gICAgdmFyIFBST0dSQU0gPSBsaW5rKHByb2dyYW0ucHJvZ3JhbSlcbiAgICB2YXIgQklORF9BVFRSSUJVVEUgPSBsaW5rKGF0dHJpYnV0ZVN0YXRlLmJpbmQpXG4gICAgdmFyIEZSQU1FX1NUQVRFID0gbGluayhmcmFtZVN0YXRlKVxuICAgIHZhciBGUkFNRUJVRkZFUl9TVEFURSA9IGxpbmsoZnJhbWVidWZmZXJTdGF0ZSlcbiAgICB2YXIgRFJBV19TVEFURSA9IHtcbiAgICAgIGNvdW50OiBsaW5rKGRyYXdTdGF0ZS5jb3VudCksXG4gICAgICBvZmZzZXQ6IGxpbmsoZHJhd1N0YXRlLm9mZnNldCksXG4gICAgICBpbnN0YW5jZXM6IGxpbmsoZHJhd1N0YXRlLmluc3RhbmNlcyksXG4gICAgICBwcmltaXRpdmU6IGxpbmsoZHJhd1N0YXRlLnByaW1pdGl2ZSlcbiAgICB9XG4gICAgdmFyIENPTlRFWFRfU1RBVEUgPSB7fVxuICAgIHZhciBFTEVNRU5UUyA9IGxpbmsoZWxlbWVudFN0YXRlLmVsZW1lbnRzKVxuICAgIHZhciBDVVJfQ09VTlQgPSBkZWYoc3RhY2tUb3AoRFJBV19TVEFURS5jb3VudCkpXG4gICAgdmFyIENVUl9PRkZTRVQgPSBkZWYoc3RhY2tUb3AoRFJBV19TVEFURS5vZmZzZXQpKVxuICAgIHZhciBDVVJfUFJJTUlUSVZFID0gZGVmKHN0YWNrVG9wKERSQVdfU1RBVEUucHJpbWl0aXZlKSlcbiAgICB2YXIgQ1VSX0VMRU1FTlRTID0gZGVmKHN0YWNrVG9wKEVMRU1FTlRTKSlcbiAgICB2YXIgQ1VSX0lOU1RBTkNFU1xuICAgIHZhciBJTlNUQU5DRV9FWFRcbiAgICB2YXIgaW5zdGFuY2luZyA9IGV4dGVuc2lvbnMuYW5nbGVfaW5zdGFuY2VkX2FycmF5c1xuICAgIGlmIChpbnN0YW5jaW5nKSB7XG4gICAgICBDVVJfSU5TVEFOQ0VTID0gZGVmKHN0YWNrVG9wKERSQVdfU1RBVEUuaW5zdGFuY2VzKSlcbiAgICAgIElOU1RBTkNFX0VYVCA9IGxpbmsoaW5zdGFuY2luZylcbiAgICB9XG4gICAgdmFyIGhhc0R5bmFtaWNFbGVtZW50cyA9ICdlbGVtZW50cycgaW4gb3B0aW9uc1xuXG4gICAgZnVuY3Rpb24gbGlua0NvbnRleHQgKHgpIHtcbiAgICAgIHZhciByZXN1bHQgPSBDT05URVhUX1NUQVRFW3hdXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IENPTlRFWFRfU1RBVEVbeF0gPSBsaW5rKGNvbnRleHRTdGF0ZVt4XSlcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gYmF0Y2gvYXJndW1lbnQgdmFyc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB2YXIgTlVNX0FSR1MgPSBhcmcoKVxuICAgIHZhciBBUkdTID0gYXJnKClcbiAgICB2YXIgQVJHID0gZGVmKClcbiAgICB2YXIgQkFUQ0hfSUQgPSBkZWYoKVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGxvYWQgYSBkeW5hbWljIHZhcmlhYmxlXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHZhciBkeW5hbWljVmFycyA9IHt9XG4gICAgZnVuY3Rpb24gZHluICh4KSB7XG4gICAgICB2YXIgaWQgPSB4LmlkXG4gICAgICB2YXIgcmVzdWx0ID0gZHluYW1pY1ZhcnNbaWRdXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICAgIGlmICh4LmZ1bmMpIHtcbiAgICAgICAgcmVzdWx0ID0gYmF0Y2guZGVmKFxuICAgICAgICAgIGxpbmsoeC5kYXRhKSwgJygnLCBBUkcsICcsJywgQkFUQ0hfSUQsICcsJywgRlJBTUVfU1RBVEUsICcpJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGJhdGNoLmRlZihBUkcsICcuJywgeC5kYXRhKVxuICAgICAgfVxuICAgICAgZHluYW1pY1ZhcnNbaWRdID0gcmVzdWx0XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHJldHJpZXZlcyB0aGUgZmlyc3QgbmFtZS1tYXRjaGluZyByZWNvcmQgZnJvbSBhbiBBY3RpdmVJbmZvIGxpc3RcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZnVuY3Rpb24gZmluZEluZm8gKGxpc3QsIG5hbWUpIHtcbiAgICAgIHJldHVybiBsaXN0LmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0ubmFtZSA9PT0gbmFtZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gYmluZCBzaGFkZXJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYmF0Y2goR0wsICcudXNlUHJvZ3JhbSgnLCBQUk9HUkFNLCAnKTsnKVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHNldCBzdGF0aWMgdW5pZm9ybXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJvZ3JhbS51bmlmb3Jtcy5mb3JFYWNoKGZ1bmN0aW9uICh1bmlmb3JtKSB7XG4gICAgICBpZiAodW5pZm9ybS5uYW1lIGluIHVuaWZvcm1zKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdmFyIExPQ0FUSU9OID0gbGluayh1bmlmb3JtLmxvY2F0aW9uKVxuICAgICAgdmFyIFNUQUNLID0gbGluayh1bmlmb3JtU3RhdGUudW5pZm9ybXNbdW5pZm9ybS5uYW1lXSlcbiAgICAgIHZhciBUT1AgPSBTVEFDSyArICdbJyArIFNUQUNLICsgJy5sZW5ndGgtMV0nXG4gICAgICBpZiAodW5pZm9ybS5pbmZvLnR5cGUgPT09IEdMX1NBTVBMRVJfMkQgfHxcbiAgICAgICAgdW5pZm9ybS5pbmZvLnR5cGUgPT09IEdMX1NBTVBMRVJfQ1VCRSkge1xuICAgICAgICB2YXIgVEVYX1ZBTFVFID0gZGVmKFRPUCArICcuX3RleHR1cmUnKVxuICAgICAgICBiYXRjaChzZXRVbmlmb3JtU3RyaW5nKEdMLCBHTF9JTlQsIExPQ0FUSU9OLCBURVhfVkFMVUUgKyAnLmJpbmQoKScpKVxuICAgICAgICBleGl0KFRFWF9WQUxVRSwgJy51bmJpbmQoKTsnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmF0Y2goc2V0VW5pZm9ybVN0cmluZyhHTCwgdW5pZm9ybS5pbmZvLnR5cGUsIExPQ0FUSU9OLCBUT1ApKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gc2V0IHN0YXRpYyBhdHRyaWJ1dGVzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2dyYW0uYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzLm5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHZhciBTVEFDSyA9IGxpbmsoYXR0cmlidXRlU3RhdGUuYXR0cmlidXRlc1thdHRyaWJ1dGUubmFtZV0pXG4gICAgICBiYXRjaChCSU5EX0FUVFJJQlVURSwgJygnLFxuICAgICAgICBhdHRyaWJ1dGUubG9jYXRpb24sICcsJyxcbiAgICAgICAgbGluayhhdHRyaWJ1dGVTdGF0ZS5iaW5kaW5nc1thdHRyaWJ1dGUubG9jYXRpb25dKSwgJywnLFxuICAgICAgICBTVEFDSywgJy5yZWNvcmRzWycsIFNUQUNLLCAnLnRvcF0nLCAnLCcsXG4gICAgICAgIHR5cGVMZW5ndGgoYXR0cmlidXRlLmluZm8udHlwZSksICcpOycpXG4gICAgfSlcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBzZXQgc3RhdGljIGVsZW1lbnQgYnVmZmVyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmICghaGFzRHluYW1pY0VsZW1lbnRzKSB7XG4gICAgICBiYXRjaChcbiAgICAgICAgJ2lmKCcsIENVUl9FTEVNRU5UUywgJyl7JyxcbiAgICAgICAgR0wsICcuYmluZEJ1ZmZlcignLCBHTF9FTEVNRU5UX0FSUkFZX0JVRkZFUiwgJywnLCBDVVJfRUxFTUVOVFMsICcuYnVmZmVyLmJ1ZmZlcik7JyxcbiAgICAgICAgJ31lbHNleycsXG4gICAgICAgIEdMLCAnLmJpbmRCdWZmZXIoJywgR0xfRUxFTUVOVF9BUlJBWV9CVUZGRVIsICcsbnVsbCk7JyxcbiAgICAgICAgJ30nKVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBsb29wIG92ZXIgYWxsIGFyZ3VtZW50c1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYXRjaChcbiAgICAgICdmb3IoJywgQkFUQ0hfSUQsICc9MDsnLCBCQVRDSF9JRCwgJzwnLCBOVU1fQVJHUywgJzsrKycsIEJBVENIX0lELCAnKXsnLFxuICAgICAgQVJHLCAnPScsIEFSR1MsICdbJywgQkFUQ0hfSUQsICddOycpXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gc2V0IGR5bmFtaWMgZmxhZ3NcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgT2JqZWN0LmtleXMob3B0aW9ucykuc29ydChvcHRpb25Qcmlvcml0eSkuZm9yRWFjaChmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICB2YXIgVkFMVUUgPSBkeW4ob3B0aW9uc1tvcHRpb25dKVxuXG4gICAgICBmdW5jdGlvbiBzZXRDYXAgKGZsYWcpIHtcbiAgICAgICAgYmF0Y2goXG4gICAgICAgICAgJ2lmKCcsIFZBTFVFLCAnKXsnLFxuICAgICAgICAgIEdMLCAnLmVuYWJsZSgnLCBmbGFnLCAnKTt9ZWxzZXsnLFxuICAgICAgICAgIEdMLCAnLmRpc2FibGUoJywgZmxhZywgJyk7fScpXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAob3B0aW9uKSB7XG4gICAgICAgIGNhc2UgJ2ZyYW1lYnVmZmVyJzpcbiAgICAgICAgICB2YXIgVklFV1BPUlRfU1RBVEUgPSBsaW5rQ29udGV4dCgndmlld3BvcnQnKVxuICAgICAgICAgIHZhciBTQ0lTU09SX1NUQVRFID0gbGlua0NvbnRleHQoJ3NjaXNzb3IuYm94JylcbiAgICAgICAgICBiYXRjaChcbiAgICAgICAgICAgICdpZignLCBGUkFNRUJVRkZFUl9TVEFURSwgJy5wdXNoKCcsXG4gICAgICAgICAgICBWQUxVRSwgJyYmJywgVkFMVUUsICcuX2ZyYW1lYnVmZmVyKSl7JyxcbiAgICAgICAgICAgIEZSQU1FQlVGRkVSX1NUQVRFLCAnLnBvbGwoKTsnLFxuICAgICAgICAgICAgVklFV1BPUlRfU1RBVEUsICcuc2V0RGlydHkoKTsnLFxuICAgICAgICAgICAgU0NJU1NPUl9TVEFURSwgJy5zZXREaXJ0eSgpOycsXG4gICAgICAgICAgICAnfScpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICAvLyBDYXBzXG4gICAgICAgIGNhc2UgJ2N1bGwuZW5hYmxlJzpcbiAgICAgICAgICBzZXRDYXAoR0xfQ1VMTF9GQUNFKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2JsZW5kLmVuYWJsZSc6XG4gICAgICAgICAgc2V0Q2FwKEdMX0JMRU5EKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2RpdGhlcic6XG4gICAgICAgICAgc2V0Q2FwKEdMX0RJVEhFUilcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdzdGVuY2lsLmVuYWJsZSc6XG4gICAgICAgICAgc2V0Q2FwKEdMX1NURU5DSUxfVEVTVClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdkZXB0aC5lbmFibGUnOlxuICAgICAgICAgIHNldENhcChHTF9ERVBUSF9URVNUKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3NjaXNzb3IuZW5hYmxlJzpcbiAgICAgICAgICBzZXRDYXAoR0xfU0NJU1NPUl9URVNUKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3BvbHlnb25PZmZzZXQuZW5hYmxlJzpcbiAgICAgICAgICBzZXRDYXAoR0xfUE9MWUdPTl9PRkZTRVRfRklMTClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdzYW1wbGUuYWxwaGEnOlxuICAgICAgICAgIHNldENhcChHTF9TQU1QTEVfQUxQSEFfVE9fQ09WRVJBR0UpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnc2FtcGxlLmVuYWJsZSc6XG4gICAgICAgICAgc2V0Q2FwKEdMX1NBTVBMRV9DT1ZFUkFHRSlcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2RlcHRoLm1hc2snOlxuICAgICAgICAgIGJhdGNoKEdMLCAnLmRlcHRoTWFzaygnLCBWQUxVRSwgJyk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2RlcHRoLmZ1bmMnOlxuICAgICAgICAgIHZhciBERVBUSF9GVU5DUyA9IGxpbmsoY29tcGFyZUZ1bmNzKVxuICAgICAgICAgIGJhdGNoKEdMLCAnLmRlcHRoRnVuYygnLCBERVBUSF9GVU5DUywgJ1snLCBWQUxVRSwgJ10pOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdkZXB0aC5yYW5nZSc6XG4gICAgICAgICAgYmF0Y2goR0wsICcuZGVwdGhSYW5nZSgnLCBWQUxVRSwgJ1swXSwnLCBWQUxVRSwgJ1sxXSk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2JsZW5kLmNvbG9yJzpcbiAgICAgICAgICBiYXRjaChHTCwgJy5ibGVuZENvbG9yKCcsXG4gICAgICAgICAgICBWQUxVRSwgJ1swXSwnLFxuICAgICAgICAgICAgVkFMVUUsICdbMV0sJyxcbiAgICAgICAgICAgIFZBTFVFLCAnWzJdLCcsXG4gICAgICAgICAgICBWQUxVRSwgJ1szXSk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2JsZW5kLmVxdWF0aW9uJzpcbiAgICAgICAgICB2YXIgQkxFTkRfRVFVQVRJT05TID0gbGluayhibGVuZEVxdWF0aW9ucylcbiAgICAgICAgICBiYXRjaChcbiAgICAgICAgICAgICdpZih0eXBlb2YgJywgVkFMVUUsICc9PT1cInN0cmluZ1wiKXsnLFxuICAgICAgICAgICAgR0wsICcuYmxlbmRFcXVhdGlvbignLCBCTEVORF9FUVVBVElPTlMsICdbJywgVkFMVUUsICddKTsnLFxuICAgICAgICAgICAgJ31lbHNleycsXG4gICAgICAgICAgICBHTCwgJy5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoJyxcbiAgICAgICAgICAgIEJMRU5EX0VRVUFUSU9OUywgJ1snLCBWQUxVRSwgJy5yZ2JdLCcsXG4gICAgICAgICAgICBCTEVORF9FUVVBVElPTlMsICdbJywgVkFMVUUsICcuYWxwaGFdKTsnLFxuICAgICAgICAgICAgJ30nKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnYmxlbmQuZnVuYyc6XG4gICAgICAgICAgdmFyIEJMRU5EX0ZVTkNTID0gbGluayhibGVuZEZ1bmNzKVxuICAgICAgICAgIGJhdGNoKFxuICAgICAgICAgICAgR0wsICcuYmxlbmRGdW5jU2VwYXJhdGUoJyxcbiAgICAgICAgICAgIEJMRU5EX0ZVTkNTLFxuICAgICAgICAgICAgJ1tcInNyY1JHQlwiIGluICcsIFZBTFVFLCAnPycsIFZBTFVFLCAnLnNyY1JHQjonLCBWQUxVRSwgJy5zcmNdLCcsXG4gICAgICAgICAgICBCTEVORF9GVU5DUyxcbiAgICAgICAgICAgICdbXCJkc3RSR0JcIiBpbiAnLCBWQUxVRSwgJz8nLCBWQUxVRSwgJy5kc3RSR0I6JywgVkFMVUUsICcuZHN0XSwnLFxuICAgICAgICAgICAgQkxFTkRfRlVOQ1MsXG4gICAgICAgICAgICAnW1wic3JjQWxwaGFcIiBpbiAnLCBWQUxVRSwgJz8nLCBWQUxVRSwgJy5zcmNBbHBoYTonLCBWQUxVRSwgJy5zcmNdLCcsXG4gICAgICAgICAgICBCTEVORF9GVU5DUyxcbiAgICAgICAgICAgICdbXCJkc3RBbHBoYVwiIGluICcsIFZBTFVFLCAnPycsIFZBTFVFLCAnLmRzdEFscGhhOicsIFZBTFVFLCAnLmRzdF0pOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdzdGVuY2lsLm1hc2snOlxuICAgICAgICAgIGJhdGNoKEdMLCAnLnN0ZW5jaWxNYXNrKCcsIFZBTFVFLCAnKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnc3RlbmNpbC5mdW5jJzpcbiAgICAgICAgICB2YXIgU1RFTkNJTF9GVU5DUyA9IGxpbmsoY29tcGFyZUZ1bmNzKVxuICAgICAgICAgIGJhdGNoKEdMLCAnLnN0ZW5jaWxGdW5jKCcsXG4gICAgICAgICAgICBTVEVOQ0lMX0ZVTkNTLCAnWycsIFZBTFVFLCAnLmNtcHx8XCJhbHdheXNcIl0sJyxcbiAgICAgICAgICAgIFZBTFVFLCAnLnJlZnwwLCcsXG4gICAgICAgICAgICAnXCJtYXNrXCIgaW4gJywgVkFMVUUsICc/JywgVkFMVUUsICcubWFzazotMSk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3N0ZW5jaWwub3BGcm9udCc6XG4gICAgICAgIGNhc2UgJ3N0ZW5jaWwub3BCYWNrJzpcbiAgICAgICAgICB2YXIgU1RFTkNJTF9PUFMgPSBsaW5rKHN0ZW5jaWxPcHMpXG4gICAgICAgICAgYmF0Y2goR0wsICcuc3RlbmNpbE9wU2VwYXJhdGUoJyxcbiAgICAgICAgICAgIG9wdGlvbiA9PT0gJ3N0ZW5jaWwub3BGcm9udCcgPyBHTF9GUk9OVCA6IEdMX0JBQ0ssICcsJyxcbiAgICAgICAgICAgIFNURU5DSUxfT1BTLCAnWycsIFZBTFVFLCAnLmZhaWx8fFwia2VlcFwiXSwnLFxuICAgICAgICAgICAgU1RFTkNJTF9PUFMsICdbJywgVkFMVUUsICcuemZhaWx8fFwia2VlcFwiXSwnLFxuICAgICAgICAgICAgU1RFTkNJTF9PUFMsICdbJywgVkFMVUUsICcucGFzc3x8XCJrZWVwXCJdKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAncG9seWdvbk9mZnNldC5vZmZzZXQnOlxuICAgICAgICAgIGJhdGNoKEdMLCAnLnBvbHlnb25PZmZzZXQoJyxcbiAgICAgICAgICAgIFZBTFVFLCAnLmZhY3Rvcnx8MCwnLFxuICAgICAgICAgICAgVkFMVUUsICcudW5pdHN8fDApOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdjdWxsLmZhY2UnOlxuICAgICAgICAgIGJhdGNoKEdMLCAnLmN1bGxGYWNlKCcsXG4gICAgICAgICAgICBWQUxVRSwgJz09PVwiZnJvbnRcIj8nLCBHTF9GUk9OVCwgJzonLCBHTF9CQUNLLCAnKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnbGluZVdpZHRoJzpcbiAgICAgICAgICBiYXRjaChHTCwgJy5saW5lV2lkdGgoJywgVkFMVUUsICcpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdmcm9udEZhY2UnOlxuICAgICAgICAgIGJhdGNoKEdMLCAnLmZyb250RmFjZSgnLFxuICAgICAgICAgICAgVkFMVUUsICc9PT1cImN3XCI/JywgR0xfQ1csICc6JywgR0xfQ0NXLCAnKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnY29sb3JNYXNrJzpcbiAgICAgICAgICBiYXRjaChHTCwgJy5jb2xvck1hc2soJyxcbiAgICAgICAgICAgIFZBTFVFLCAnWzBdLCcsXG4gICAgICAgICAgICBWQUxVRSwgJ1sxXSwnLFxuICAgICAgICAgICAgVkFMVUUsICdbMl0sJyxcbiAgICAgICAgICAgIFZBTFVFLCAnWzNdKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnc2FtcGxlLmNvdmVyYWdlJzpcbiAgICAgICAgICBiYXRjaChHTCwgJy5zYW1wbGVDb3ZlcmFnZSgnLFxuICAgICAgICAgICAgVkFMVUUsICcudmFsdWUsJyxcbiAgICAgICAgICAgIFZBTFVFLCAnLmludmVydCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3NjaXNzb3IuYm94JzpcbiAgICAgICAgY2FzZSAndmlld3BvcnQnOlxuICAgICAgICAgIHZhciBCT1hfU1RBVEUgPSBsaW5rQ29udGV4dChvcHRpb24pXG4gICAgICAgICAgYmF0Y2goQk9YX1NUQVRFLCAnLnB1c2goJyxcbiAgICAgICAgICAgIFZBTFVFLCAnLnh8fDAsJyxcbiAgICAgICAgICAgIFZBTFVFLCAnLnl8fDAsJyxcbiAgICAgICAgICAgIFZBTFVFLCAnLnd8fC0xLCcsXG4gICAgICAgICAgICBWQUxVRSwgJy5ofHwtMSk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3ByaW1pdGl2ZXMnOlxuICAgICAgICBjYXNlICdvZmZzZXQnOlxuICAgICAgICBjYXNlICdjb3VudCc6XG4gICAgICAgIGNhc2UgJ2VsZW1lbnRzJzpcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY2hlY2sucmFpc2UoJ3Vuc3VwcG9ydGVkIG9wdGlvbiBmb3IgYmF0Y2gnLCBvcHRpb24pXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIHVwZGF0ZSB2aWV3cG9ydC9zY2lzc29yIGJveCBzdGF0ZSBhbmQgcmVzdG9yZSBmcmFtZWJ1ZmZlclxuICAgIGlmICgndmlld3BvcnQnIGluIG9wdGlvbnMgfHwgJ2ZyYW1lYnVmZmVyJyBpbiBvcHRpb25zKSB7XG4gICAgICBiYXRjaChsaW5rQ29udGV4dCgndmlld3BvcnQnKSwgJy5wb2xsKCk7JylcbiAgICB9XG4gICAgaWYgKCdzY2lzc29yLmJveCcgaW4gb3B0aW9ucyB8fCAnZnJhbWVidWZmZXInIGluIG9wdGlvbnMpIHtcbiAgICAgIGJhdGNoKGxpbmtDb250ZXh0KCdzY2lzc29yLmJveCcpLCAnLnBvbGwoKTsnKVxuICAgIH1cbiAgICBpZiAoJ2ZyYW1lYnVmZmVyJyBpbiBvcHRpb25zKSB7XG4gICAgICBiYXRjaChGUkFNRUJVRkZFUl9TVEFURSwgJy5wb3AoKTsnKVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBzZXQgZHluYW1pYyB1bmlmb3Jtc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB2YXIgcHJvZ3JhbVVuaWZvcm1zID0gcHJvZ3JhbS51bmlmb3Jtc1xuICAgIHZhciBEWU5BTUlDX1RFWFRVUkVTID0gW11cbiAgICBPYmplY3Qua2V5cyh1bmlmb3JtcykuZm9yRWFjaChmdW5jdGlvbiAodW5pZm9ybSkge1xuICAgICAgdmFyIGRhdGEgPSBmaW5kSW5mbyhwcm9ncmFtVW5pZm9ybXMsIHVuaWZvcm0pXG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB2YXIgVFlQRSA9IGRhdGEuaW5mby50eXBlXG4gICAgICB2YXIgTE9DQVRJT04gPSBsaW5rKGRhdGEubG9jYXRpb24pXG4gICAgICB2YXIgVkFMVUUgPSBkeW4odW5pZm9ybXNbdW5pZm9ybV0pXG4gICAgICBpZiAoZGF0YS5pbmZvLnR5cGUgPT09IEdMX1NBTVBMRVJfMkQgfHxcbiAgICAgICAgICBkYXRhLmluZm8udHlwZSA9PT0gR0xfU0FNUExFUl9DVUJFKSB7XG4gICAgICAgIHZhciBURVhfVkFMVUUgPSBkZWYoVkFMVUUgKyAnLl90ZXh0dXJlJylcbiAgICAgICAgRFlOQU1JQ19URVhUVVJFUy5wdXNoKFRFWF9WQUxVRSlcbiAgICAgICAgYmF0Y2goc2V0VW5pZm9ybVN0cmluZyhHTCwgR0xfSU5ULCBMT0NBVElPTiwgVEVYX1ZBTFVFICsgJy5iaW5kKCknKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhdGNoKHNldFVuaWZvcm1TdHJpbmcoR0wsIFRZUEUsIExPQ0FUSU9OLCBWQUxVRSkpXG4gICAgICB9XG4gICAgfSlcbiAgICBEWU5BTUlDX1RFWFRVUkVTLmZvckVhY2goZnVuY3Rpb24gKFZBTFVFKSB7XG4gICAgICBiYXRjaChWQUxVRSwgJy51bmJpbmQoKTsnKVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gc2V0IGR5bmFtaWMgYXR0cmlidXRlc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB2YXIgcHJvZ3JhbUF0dHJpYnV0ZXMgPSBwcm9ncmFtLmF0dHJpYnV0ZXNcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBkYXRhID0gZmluZEluZm8ocHJvZ3JhbUF0dHJpYnV0ZXMsIGF0dHJpYnV0ZSlcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGJhdGNoKEJJTkRfQVRUUklCVVRFLCAnKCcsXG4gICAgICAgIGRhdGEubG9jYXRpb24sICcsJyxcbiAgICAgICAgbGluayhhdHRyaWJ1dGUuYmluZGluZ3NbZGF0YS5sb2NhdGlvbl0pLCAnLCcsXG4gICAgICAgIGR5bihhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pLCAnLCcsXG4gICAgICAgIHR5cGVMZW5ndGgoZGF0YS5pbmZvLnR5cGUpLCAnKTsnKVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gc2V0IGR5bmFtaWMgYXR0cmlidXRlc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGlmIChvcHRpb25zLmNvdW50KSB7XG4gICAgICBiYXRjaChDVVJfQ09VTlQsICc9JywgZHluKG9wdGlvbnMuY291bnQpLCAnOycpXG4gICAgfSBlbHNlIGlmICghdXNlRWxlbWVudE9wdGlvbignY291bnQnKSkge1xuICAgICAgYmF0Y2goJ2lmKCcsIENVUl9DT1VOVCwgJyl7JylcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMub2Zmc2V0KSB7XG4gICAgICBiYXRjaChDVVJfT0ZGU0VULCAnPScsIGR5bihvcHRpb25zLm9mZnNldCksICc7JylcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucHJpbWl0aXZlKSB7XG4gICAgICB2YXIgUFJJTV9UWVBFUyA9IGxpbmsocHJpbVR5cGVzKVxuICAgICAgYmF0Y2goQ1VSX1BSSU1JVElWRSwgJz0nLCBQUklNX1RZUEVTLCAnWycsIGR5bihvcHRpb25zLnByaW1pdGl2ZSksICddOycpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXNlRWxlbWVudE9wdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIGhhc0R5bmFtaWNFbGVtZW50cyAmJiAhKHggaW4gb3B0aW9ucyB8fCB4IGluIHN0YXRpY09wdGlvbnMpXG4gICAgfVxuICAgIGlmIChoYXNEeW5hbWljRWxlbWVudHMpIHtcbiAgICAgIHZhciBkeW5FbGVtZW50cyA9IGR5bihvcHRpb25zLmVsZW1lbnRzKVxuICAgICAgYmF0Y2goQ1VSX0VMRU1FTlRTLCAnPScsXG4gICAgICAgIGR5bkVsZW1lbnRzLCAnPycsIGR5bkVsZW1lbnRzLCAnLl9lbGVtZW50czpudWxsOycpXG4gICAgfVxuICAgIGlmICh1c2VFbGVtZW50T3B0aW9uKCdvZmZzZXQnKSkge1xuICAgICAgYmF0Y2goQ1VSX09GRlNFVCwgJz0wOycpXG4gICAgfVxuXG4gICAgLy8gRW1pdCBkcmF3IGNvbW1hbmRcbiAgICBiYXRjaCgnaWYoJywgQ1VSX0VMRU1FTlRTLCAnKXsnKVxuICAgIGlmICh1c2VFbGVtZW50T3B0aW9uKCdjb3VudCcpKSB7XG4gICAgICBiYXRjaChDVVJfQ09VTlQsICc9JywgQ1VSX0VMRU1FTlRTLCAnLnZlcnRDb3VudDsnLFxuICAgICAgICAnaWYoJywgQ1VSX0NPVU5ULCAnPjApeycpXG4gICAgfVxuICAgIGlmICh1c2VFbGVtZW50T3B0aW9uKCdwcmltaXRpdmUnKSkge1xuICAgICAgYmF0Y2goQ1VSX1BSSU1JVElWRSwgJz0nLCBDVVJfRUxFTUVOVFMsICcucHJpbVR5cGU7JylcbiAgICB9XG4gICAgaWYgKGhhc0R5bmFtaWNFbGVtZW50cykge1xuICAgICAgYmF0Y2goXG4gICAgICAgIEdMLFxuICAgICAgICAnLmJpbmRCdWZmZXIoJyxcbiAgICAgICAgR0xfRUxFTUVOVF9BUlJBWV9CVUZGRVIsICcsJyxcbiAgICAgICAgQ1VSX0VMRU1FTlRTLCAnLmJ1ZmZlci5idWZmZXIpOycpXG4gICAgfVxuICAgIGlmIChpbnN0YW5jaW5nKSB7XG4gICAgICBpZiAob3B0aW9ucy5pbnN0YW5jZXMpIHtcbiAgICAgICAgYmF0Y2goQ1VSX0lOU1RBTkNFUywgJz0nLCBkeW4ob3B0aW9ucy5pbnN0YW5jZXMpLCAnOycpXG4gICAgICB9XG4gICAgICBiYXRjaChcbiAgICAgICAgJ2lmKCcsIENVUl9JTlNUQU5DRVMsICc+MCl7JyxcbiAgICAgICAgSU5TVEFOQ0VfRVhULCAnLmRyYXdFbGVtZW50c0luc3RhbmNlZEFOR0xFKCcsXG4gICAgICAgIENVUl9QUklNSVRJVkUsICcsJyxcbiAgICAgICAgQ1VSX0NPVU5ULCAnLCcsXG4gICAgICAgIENVUl9FTEVNRU5UUywgJy50eXBlLCcsXG4gICAgICAgIENVUl9PRkZTRVQsICcsJyxcbiAgICAgICAgQ1VSX0lOU1RBTkNFUywgJyk7fWVsc2V7JylcbiAgICB9XG4gICAgYmF0Y2goXG4gICAgICBHTCwgJy5kcmF3RWxlbWVudHMoJyxcbiAgICAgIENVUl9QUklNSVRJVkUsICcsJyxcbiAgICAgIENVUl9DT1VOVCwgJywnLFxuICAgICAgQ1VSX0VMRU1FTlRTLCAnLnR5cGUsJyxcbiAgICAgIENVUl9PRkZTRVQsICcpOycpXG4gICAgaWYgKGluc3RhbmNpbmcpIHtcbiAgICAgIGJhdGNoKCd9JylcbiAgICB9XG4gICAgaWYgKHVzZUVsZW1lbnRPcHRpb24oJ2NvdW50JykpIHtcbiAgICAgIGJhdGNoKCd9JylcbiAgICB9XG4gICAgYmF0Y2goJ31lbHNleycpXG4gICAgaWYgKCF1c2VFbGVtZW50T3B0aW9uKCdjb3VudCcpKSB7XG4gICAgICBpZiAodXNlRWxlbWVudE9wdGlvbigncHJpbWl0aXZlJykpIHtcbiAgICAgICAgYmF0Y2goQ1VSX1BSSU1JVElWRSwgJz0nLCBHTF9UUklBTkdMRVMsICc7JylcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jaW5nKSB7XG4gICAgICAgIGJhdGNoKFxuICAgICAgICAgICdpZignLCBDVVJfSU5TVEFOQ0VTLCAnPjApeycsXG4gICAgICAgICAgSU5TVEFOQ0VfRVhULCAnLmRyYXdBcnJheXNJbnN0YW5jZWRBTkdMRSgnLFxuICAgICAgICAgIENVUl9QUklNSVRJVkUsICcsJyxcbiAgICAgICAgICBDVVJfT0ZGU0VULCAnLCcsXG4gICAgICAgICAgQ1VSX0NPVU5ULCAnLCcsXG4gICAgICAgICAgQ1VSX0lOU1RBTkNFUywgJyk7fWVsc2V7JylcbiAgICAgIH1cbiAgICAgIGJhdGNoKFxuICAgICAgICBHTCwgJy5kcmF3QXJyYXlzKCcsXG4gICAgICAgIENVUl9QUklNSVRJVkUsICcsJyxcbiAgICAgICAgQ1VSX09GRlNFVCwgJywnLFxuICAgICAgICBDVVJfQ09VTlQsICcpO30nKVxuICAgICAgaWYgKGluc3RhbmNpbmcpIHtcbiAgICAgICAgYmF0Y2goJ30nKVxuICAgICAgfVxuICAgIH1cbiAgICBiYXRjaCgnfX0nLCBleGl0KVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGNvbXBpbGUgYW5kIHJldHVyblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXR1cm4gZW52LmNvbXBpbGUoKS5iYXRjaFxuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNQUlOIERSQVcgQ09NTUFORFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGZ1bmN0aW9uIGNvbXBpbGVDb21tYW5kIChcbiAgICBzdGF0aWNPcHRpb25zLCBzdGF0aWNVbmlmb3Jtcywgc3RhdGljQXR0cmlidXRlcyxcbiAgICBkeW5hbWljT3B0aW9ucywgZHluYW1pY1VuaWZvcm1zLCBkeW5hbWljQXR0cmlidXRlcyxcbiAgICBoYXNEeW5hbWljKSB7XG4gICAgLy8gQ3JlYXRlIGNvZGUgZ2VuZXJhdGlvbiBlbnZpcm9ubWVudFxuICAgIHZhciBlbnYgPSBjcmVhdGVFbnZpcm9ubWVudCgpXG4gICAgdmFyIGxpbmsgPSBlbnYubGlua1xuICAgIHZhciBibG9jayA9IGVudi5ibG9ja1xuICAgIHZhciBwcm9jID0gZW52LnByb2NcblxuICAgIHZhciBjYWxsSWQgPSBkcmF3Q2FsbENvdW50ZXIrK1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbW1vbiBzdGF0ZSB2YXJpYWJsZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdmFyIEdMX1BPTEwgPSBsaW5rKHJlZ2xQb2xsKVxuICAgIHZhciBGUkFHX1NIQURFUl9TVEFURSA9IGxpbmsoc2hhZGVyU3RhdGUuZnJhZ1NoYWRlcnMpXG4gICAgdmFyIFZFUlRfU0hBREVSX1NUQVRFID0gbGluayhzaGFkZXJTdGF0ZS52ZXJ0U2hhZGVycylcbiAgICB2YXIgUFJPR1JBTV9TVEFURSA9IGxpbmsoc2hhZGVyU3RhdGUucHJvZ3JhbXMpXG4gICAgdmFyIEZSQU1FQlVGRkVSX1NUQVRFID0gbGluayhmcmFtZWJ1ZmZlclN0YXRlKVxuICAgIHZhciBEUkFXX1NUQVRFID0ge1xuICAgICAgY291bnQ6IGxpbmsoZHJhd1N0YXRlLmNvdW50KSxcbiAgICAgIG9mZnNldDogbGluayhkcmF3U3RhdGUub2Zmc2V0KSxcbiAgICAgIGluc3RhbmNlczogbGluayhkcmF3U3RhdGUuaW5zdGFuY2VzKSxcbiAgICAgIHByaW1pdGl2ZTogbGluayhkcmF3U3RhdGUucHJpbWl0aXZlKVxuICAgIH1cbiAgICB2YXIgRUxFTUVOVF9TVEFURSA9IGxpbmsoZWxlbWVudFN0YXRlLmVsZW1lbnRzKVxuICAgIHZhciBQUklNX1RZUEVTID0gbGluayhwcmltVHlwZXMpXG4gICAgdmFyIENPTVBBUkVfRlVOQ1MgPSBsaW5rKGNvbXBhcmVGdW5jcylcbiAgICB2YXIgU1RFTkNJTF9PUFMgPSBsaW5rKHN0ZW5jaWxPcHMpXG5cbiAgICB2YXIgQ09OVEVYVF9TVEFURSA9IHt9XG4gICAgZnVuY3Rpb24gbGlua0NvbnRleHQgKHgpIHtcbiAgICAgIHZhciByZXN1bHQgPSBDT05URVhUX1NUQVRFW3hdXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IENPTlRFWFRfU1RBVEVbeF0gPSBsaW5rKGNvbnRleHRTdGF0ZVt4XSlcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU1RBVElDIFNUQVRFXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIENvZGUgYmxvY2tzIGZvciB0aGUgc3RhdGljIHNlY3Rpb25zXG4gICAgdmFyIGVudHJ5ID0gYmxvY2soKVxuICAgIHZhciBleGl0ID0gYmxvY2soKVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHVwZGF0ZSBkZWZhdWx0IGNvbnRleHQgc3RhdGUgdmFyaWFibGVzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0YXRpY09wdGlvbiAocGFyYW0sIHZhbHVlKSB7XG4gICAgICB2YXIgU1RBVEVfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgIGVudHJ5KFNUQVRFX1NUQUNLLCAnLnB1c2goJywgdmFsdWUsICcpOycpXG4gICAgICBleGl0KFNUQVRFX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgfVxuXG4gICAgdmFyIGhhc1NoYWRlciA9IGZhbHNlXG4gICAgT2JqZWN0LmtleXMoc3RhdGljT3B0aW9ucykuc29ydChvcHRpb25Qcmlvcml0eSkuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0YXRpY09wdGlvbnNbcGFyYW1dXG4gICAgICBzd2l0Y2ggKHBhcmFtKSB7XG4gICAgICAgIGNhc2UgJ2ZyYWcnOlxuICAgICAgICAgIGhhc1NoYWRlciA9IHRydWVcbiAgICAgICAgICBlbnRyeShGUkFHX1NIQURFUl9TVEFURSwgJy5wdXNoKCcsIGxpbmsodmFsdWUpLCAnKTsnKVxuICAgICAgICAgIGV4aXQoRlJBR19TSEFERVJfU1RBVEUsICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3ZlcnQnOlxuICAgICAgICAgIGhhc1NoYWRlciA9IHRydWVcbiAgICAgICAgICBlbnRyeShWRVJUX1NIQURFUl9TVEFURSwgJy5wdXNoKCcsIGxpbmsodmFsdWUpLCAnKTsnKVxuICAgICAgICAgIGV4aXQoVkVSVF9TSEFERVJfU1RBVEUsICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2ZyYW1lYnVmZmVyJzpcbiAgICAgICAgICB2YXIgZmJvID0gZnJhbWVidWZmZXJTdGF0ZS5nZXRGcmFtZWJ1ZmZlcih2YWx1ZSlcbiAgICAgICAgICBjaGVjayh2YWx1ZSA9PT0gbnVsbCB8fCBmYm8sICdpbnZhbGlkIGZyYW1lYnVmZmVyIG9iamVjdCcpXG4gICAgICAgICAgdmFyIFZJRVdQT1JUX1NUQVRFID0gbGlua0NvbnRleHQoJ3ZpZXdwb3J0JylcbiAgICAgICAgICB2YXIgU0NJU1NPUl9TVEFURSA9IGxpbmtDb250ZXh0KCdzY2lzc29yLmJveCcpXG4gICAgICAgICAgZW50cnkoJ2lmKCcsIEZSQU1FQlVGRkVSX1NUQVRFLCAnLnB1c2goJywgbGluayhcbiAgICAgICAgICAgIHZhbHVlICYmIHZhbHVlLl9mcmFtZWJ1ZmZlciksICcpKXsnLFxuICAgICAgICAgICAgVklFV1BPUlRfU1RBVEUsICcuc2V0RGlydHkoKTsnLFxuICAgICAgICAgICAgU0NJU1NPUl9TVEFURSwgJy5zZXREaXJ0eSgpOycsXG4gICAgICAgICAgICAnfScpXG4gICAgICAgICAgZXhpdCgnaWYoJywgRlJBTUVCVUZGRVJfU1RBVEUsICcucG9wKCkpeycsXG4gICAgICAgICAgICBWSUVXUE9SVF9TVEFURSwgJy5zZXREaXJ0eSgpOycsXG4gICAgICAgICAgICBTQ0lTU09SX1NUQVRFLCAnLnNldERpcnR5KCk7JyxcbiAgICAgICAgICAgICd9JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIC8vIFVwZGF0ZSBkcmF3IHN0YXRlXG4gICAgICAgIGNhc2UgJ2NvdW50JzpcbiAgICAgICAgY2FzZSAnb2Zmc2V0JzpcbiAgICAgICAgY2FzZSAnaW5zdGFuY2VzJzpcbiAgICAgICAgICBjaGVjay5ubmkodmFsdWUsIHBhcmFtKVxuICAgICAgICAgIGVudHJ5KERSQVdfU1RBVEVbcGFyYW1dLCAnLnB1c2goJywgdmFsdWUsICcpOycpXG4gICAgICAgICAgZXhpdChEUkFXX1NUQVRFW3BhcmFtXSwgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgLy8gVXBkYXRlIHByaW1pdGl2ZSB0eXBlXG4gICAgICAgIGNhc2UgJ3ByaW1pdGl2ZSc6XG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKHZhbHVlLCBwcmltVHlwZXMsICdub3QgYSB2YWxpZCBkcmF3aW5nIHByaW1pdGl2ZScpXG4gICAgICAgICAgdmFyIHByaW1UeXBlID0gcHJpbVR5cGVzW3ZhbHVlXVxuICAgICAgICAgIGVudHJ5KERSQVdfU1RBVEUucHJpbWl0aXZlLCAnLnB1c2goJywgcHJpbVR5cGUsICcpOycpXG4gICAgICAgICAgZXhpdChEUkFXX1NUQVRFLnByaW1pdGl2ZSwgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgLy8gVXBkYXRlIGVsZW1lbnQgYnVmZmVyXG4gICAgICAgIGNhc2UgJ2VsZW1lbnRzJzpcbiAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50U3RhdGUuZ2V0RWxlbWVudHModmFsdWUpXG4gICAgICAgICAgdmFyIGhhc1ByaW1pdGl2ZSA9ICEoJ3ByaW1pdGl2ZScgaW4gc3RhdGljT3B0aW9ucylcbiAgICAgICAgICB2YXIgaGFzQ291bnQgPSAhKCdjb3VudCcgaW4gc3RhdGljT3B0aW9ucylcbiAgICAgICAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHZhciBFTEVNRU5UUyA9IGxpbmsoZWxlbWVudHMpXG4gICAgICAgICAgICBlbnRyeShFTEVNRU5UX1NUQVRFLCAnLnB1c2goJywgRUxFTUVOVFMsICcpOycpXG4gICAgICAgICAgICBpZiAoaGFzUHJpbWl0aXZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5KERSQVdfU1RBVEUucHJpbWl0aXZlLCAnLnB1c2goJywgRUxFTUVOVFMsICcucHJpbVR5cGUpOycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQ291bnQpIHtcbiAgICAgICAgICAgICAgZW50cnkoRFJBV19TVEFURS5jb3VudCwgJy5wdXNoKCcsIEVMRU1FTlRTLCAnLnZlcnRDb3VudCk7JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50cnkoRUxFTUVOVF9TVEFURSwgJy5wdXNoKG51bGwpOycpXG4gICAgICAgICAgICBpZiAoaGFzUHJpbWl0aXZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5KERSQVdfU1RBVEUucHJpbWl0aXZlLCAnLnB1c2goJywgR0xfVFJJQU5HTEVTLCAnKTsnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0NvdW50KSB7XG4gICAgICAgICAgICAgIGVudHJ5KERSQVdfU1RBVEUuY291bnQsICcucHVzaCgwKTsnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFzUHJpbWl0aXZlKSB7XG4gICAgICAgICAgICBleGl0KERSQVdfU1RBVEUucHJpbWl0aXZlLCAnLnBvcCgpOycpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoYXNDb3VudCkge1xuICAgICAgICAgICAgZXhpdChEUkFXX1NUQVRFLmNvdW50LCAnLnBvcCgpOycpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghKCdvZmZzZXQnIGluIHN0YXRpY09wdGlvbnMpKSB7XG4gICAgICAgICAgICBlbnRyeShEUkFXX1NUQVRFLm9mZnNldCwgJy5wdXNoKDApOycpXG4gICAgICAgICAgICBleGl0KERSQVdfU1RBVEUub2Zmc2V0LCAnLnBvcCgpOycpXG4gICAgICAgICAgfVxuICAgICAgICAgIGV4aXQoRUxFTUVOVF9TVEFURSwgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnY3VsbC5lbmFibGUnOlxuICAgICAgICBjYXNlICdibGVuZC5lbmFibGUnOlxuICAgICAgICBjYXNlICdkaXRoZXInOlxuICAgICAgICBjYXNlICdzdGVuY2lsLmVuYWJsZSc6XG4gICAgICAgIGNhc2UgJ2RlcHRoLmVuYWJsZSc6XG4gICAgICAgIGNhc2UgJ3NjaXNzb3IuZW5hYmxlJzpcbiAgICAgICAgY2FzZSAncG9seWdvbk9mZnNldC5lbmFibGUnOlxuICAgICAgICBjYXNlICdzYW1wbGUuYWxwaGEnOlxuICAgICAgICBjYXNlICdzYW1wbGUuZW5hYmxlJzpcbiAgICAgICAgY2FzZSAnZGVwdGgubWFzayc6XG4gICAgICAgICAgY2hlY2sudHlwZSh2YWx1ZSwgJ2Jvb2xlYW4nLCBwYXJhbSlcbiAgICAgICAgICBoYW5kbGVTdGF0aWNPcHRpb24ocGFyYW0sIHZhbHVlKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnZGVwdGguZnVuYyc6XG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKHZhbHVlLCBjb21wYXJlRnVuY3MsIHBhcmFtKVxuICAgICAgICAgIGhhbmRsZVN0YXRpY09wdGlvbihwYXJhbSwgY29tcGFyZUZ1bmNzW3ZhbHVlXSlcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2RlcHRoLnJhbmdlJzpcbiAgICAgICAgICBjaGVjayhcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpICYmXG4gICAgICAgICAgICB2YWx1ZS5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgIHZhbHVlWzBdIDw9IHZhbHVlWzFdLFxuICAgICAgICAgICAgJ2RlcHRoIHJhbmdlIGlzIDJkIGFycmF5JylcbiAgICAgICAgICB2YXIgREVQVEhfUkFOR0VfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShERVBUSF9SQU5HRV9TVEFDSywgJy5wdXNoKCcsIHZhbHVlWzBdLCAnLCcsIHZhbHVlWzFdLCAnKTsnKVxuICAgICAgICAgIGV4aXQoREVQVEhfUkFOR0VfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2JsZW5kLmZ1bmMnOlxuICAgICAgICAgIHZhciBCTEVORF9GVU5DX1NUQUNLID0gbGlua0NvbnRleHQocGFyYW0pXG4gICAgICAgICAgY2hlY2sudHlwZSh2YWx1ZSwgJ29iamVjdCcsICdibGVuZCBmdW5jIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgICAgICAgICB2YXIgc3JjUkdCID0gKCdzcmNSR0InIGluIHZhbHVlID8gdmFsdWUuc3JjUkdCIDogdmFsdWUuc3JjKVxuICAgICAgICAgIHZhciBzcmNBbHBoYSA9ICgnc3JjQWxwaGEnIGluIHZhbHVlID8gdmFsdWUuc3JjQWxwaGEgOiB2YWx1ZS5zcmMpXG4gICAgICAgICAgdmFyIGRzdFJHQiA9ICgnZHN0UkdCJyBpbiB2YWx1ZSA/IHZhbHVlLmRzdFJHQiA6IHZhbHVlLmRzdClcbiAgICAgICAgICB2YXIgZHN0QWxwaGEgPSAoJ2RzdEFscGhhJyBpbiB2YWx1ZSA/IHZhbHVlLmRzdEFscGhhIDogdmFsdWUuZHN0KVxuICAgICAgICAgIGNoZWNrLnBhcmFtZXRlcihzcmNSR0IsIGJsZW5kRnVuY3MpXG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKHNyY0FscGhhLCBibGVuZEZ1bmNzKVxuICAgICAgICAgIGNoZWNrLnBhcmFtZXRlcihkc3RSR0IsIGJsZW5kRnVuY3MpXG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKGRzdEFscGhhLCBibGVuZEZ1bmNzKVxuICAgICAgICAgIGVudHJ5KEJMRU5EX0ZVTkNfU1RBQ0ssICcucHVzaCgnLFxuICAgICAgICAgICAgYmxlbmRGdW5jc1tzcmNSR0JdLCAnLCcsXG4gICAgICAgICAgICBibGVuZEZ1bmNzW2RzdFJHQl0sICcsJyxcbiAgICAgICAgICAgIGJsZW5kRnVuY3Nbc3JjQWxwaGFdLCAnLCcsXG4gICAgICAgICAgICBibGVuZEZ1bmNzW2RzdEFscGhhXSwgJyk7JylcbiAgICAgICAgICBleGl0KEJMRU5EX0ZVTkNfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2JsZW5kLmVxdWF0aW9uJzpcbiAgICAgICAgICB2YXIgQkxFTkRfRVFVQVRJT05fU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY2hlY2sucGFyYW1ldGVyKHZhbHVlLCBibGVuZEVxdWF0aW9ucywgJ2ludmFsaWQgYmxlbmQgZXF1YXRpb24nKVxuICAgICAgICAgICAgZW50cnkoQkxFTkRfRVFVQVRJT05fU1RBQ0ssXG4gICAgICAgICAgICAgICcucHVzaCgnLFxuICAgICAgICAgICAgICBibGVuZEVxdWF0aW9uc1t2YWx1ZV0sICcsJyxcbiAgICAgICAgICAgICAgYmxlbmRFcXVhdGlvbnNbdmFsdWVdLCAnKTsnKVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY2hlY2sucGFyYW1ldGVyKFxuICAgICAgICAgICAgICB2YWx1ZS5yZ2IsIGJsZW5kRXF1YXRpb25zLCAnaW52YWxpZCBibGVuZCBlcXVhdGlvbiByZ2InKVxuICAgICAgICAgICAgY2hlY2sucGFyYW1ldGVyKFxuICAgICAgICAgICAgICB2YWx1ZS5hbHBoYSwgYmxlbmRFcXVhdGlvbnMsICdpbnZhbGlkIGJsZW5kIGVxdWF0aW9uIGFscGhhJylcbiAgICAgICAgICAgIGVudHJ5KEJMRU5EX0VRVUFUSU9OX1NUQUNLLFxuICAgICAgICAgICAgICAnLnB1c2goJyxcbiAgICAgICAgICAgICAgYmxlbmRFcXVhdGlvbnNbdmFsdWUucmdiXSwgJywnLFxuICAgICAgICAgICAgICBibGVuZEVxdWF0aW9uc1t2YWx1ZS5hbHBoYV0sICcpOycpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrLnJhaXNlKCdpbnZhbGlkIGJsZW5kIGVxdWF0aW9uJylcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhpdChCTEVORF9FUVVBVElPTl9TVEFDSywgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnYmxlbmQuY29sb3InOlxuICAgICAgICAgIGNoZWNrKFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiZcbiAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA9PT0gNCxcbiAgICAgICAgICAgICdibGVuZCBjb2xvciBpcyBhIDRkIGFycmF5JylcbiAgICAgICAgICB2YXIgQkxFTkRfQ09MT1JfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShCTEVORF9DT0xPUl9TVEFDSyxcbiAgICAgICAgICAgICcucHVzaCgnLFxuICAgICAgICAgICAgdmFsdWVbMF0sICcsJyxcbiAgICAgICAgICAgIHZhbHVlWzFdLCAnLCcsXG4gICAgICAgICAgICB2YWx1ZVsyXSwgJywnLFxuICAgICAgICAgICAgdmFsdWVbM10sICcpOycpXG4gICAgICAgICAgZXhpdChCTEVORF9DT0xPUl9TVEFDSywgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnc3RlbmNpbC5tYXNrJzpcbiAgICAgICAgICBjaGVjay50eXBlKHZhbHVlLCAnbnVtYmVyJywgJ3N0ZW5jaWwgbWFzayBtdXN0IGJlIGFuIGludGVnZXInKVxuICAgICAgICAgIHZhciBTVEVOQ0lMX01BU0tfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShTVEVOQ0lMX01BU0tfU1RBQ0ssICcucHVzaCgnLCB2YWx1ZSwgJyk7JylcbiAgICAgICAgICBleGl0KFNURU5DSUxfTUFTS19TVEFDSywgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnc3RlbmNpbC5mdW5jJzpcbiAgICAgICAgICBjaGVjay50eXBlKHZhbHVlLCAnb2JqZWN0JywgJ3N0ZW5jaWwgZnVuYyBtdXN0IGJlIGFuIG9iamVjdCcpXG4gICAgICAgICAgdmFyIGNtcCA9IHZhbHVlLmNtcCB8fCAna2VlcCdcbiAgICAgICAgICB2YXIgcmVmID0gdmFsdWUucmVmIHx8IDBcbiAgICAgICAgICB2YXIgbWFzayA9ICdtYXNrJyBpbiB2YWx1ZSA/IHZhbHVlLm1hc2sgOiAtMVxuICAgICAgICAgIGNoZWNrLnBhcmFtZXRlcihjbXAsIGNvbXBhcmVGdW5jcywgJ2ludmFsaWQgc3RlbmNpbCBmdW5jIGNtcCcpXG4gICAgICAgICAgY2hlY2sudHlwZShyZWYsICdudW1iZXInLCAnc3RlbmNpbCBmdW5jIHJlZicpXG4gICAgICAgICAgY2hlY2sudHlwZShtYXNrLCAnbnVtYmVyJywgJ3N0ZW5jaWwgZnVuYyBtYXNrJylcbiAgICAgICAgICB2YXIgU1RFTkNJTF9GVU5DX1NUQUNLID0gbGlua0NvbnRleHQocGFyYW0pXG4gICAgICAgICAgZW50cnkoU1RFTkNJTF9GVU5DX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIGNvbXBhcmVGdW5jc1tjbXBdLCAnLCcsXG4gICAgICAgICAgICByZWYsICcsJyxcbiAgICAgICAgICAgIG1hc2ssICcpOycpXG4gICAgICAgICAgZXhpdChTVEVOQ0lMX0ZVTkNfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3N0ZW5jaWwub3BGcm9udCc6XG4gICAgICAgIGNhc2UgJ3N0ZW5jaWwub3BCYWNrJzpcbiAgICAgICAgICBjaGVjay50eXBlKHZhbHVlLCAnb2JqZWN0JywgcGFyYW0pXG4gICAgICAgICAgdmFyIGZhaWwgPSB2YWx1ZS5mYWlsIHx8ICdrZWVwJ1xuICAgICAgICAgIHZhciB6ZmFpbCA9IHZhbHVlLnpmYWlsIHx8ICdrZWVwJ1xuICAgICAgICAgIHZhciBwYXNzID0gdmFsdWUucGFzcyB8fCAna2VlcCdcbiAgICAgICAgICBjaGVjay5wYXJhbWV0ZXIoZmFpbCwgc3RlbmNpbE9wcywgcGFyYW0pXG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKHpmYWlsLCBzdGVuY2lsT3BzLCBwYXJhbSlcbiAgICAgICAgICBjaGVjay5wYXJhbWV0ZXIocGFzcywgc3RlbmNpbE9wcywgcGFyYW0pXG4gICAgICAgICAgdmFyIFNURU5DSUxfT1BfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShTVEVOQ0lMX09QX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIHN0ZW5jaWxPcHNbZmFpbF0sICcsJyxcbiAgICAgICAgICAgIHN0ZW5jaWxPcHNbemZhaWxdLCAnLCcsXG4gICAgICAgICAgICBzdGVuY2lsT3BzW3Bhc3NdLCAnKTsnKVxuICAgICAgICAgIGV4aXQoU1RFTkNJTF9PUF9TVEFDSywgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAncG9seWdvbk9mZnNldC5vZmZzZXQnOlxuICAgICAgICAgIGNoZWNrLnR5cGUodmFsdWUsICdvYmplY3QnLCBwYXJhbSlcbiAgICAgICAgICB2YXIgZmFjdG9yID0gdmFsdWUuZmFjdG9yIHx8IDBcbiAgICAgICAgICB2YXIgdW5pdHMgPSB2YWx1ZS51bml0cyB8fCAwXG4gICAgICAgICAgY2hlY2sudHlwZShmYWN0b3IsICdudW1iZXInLCAnb2Zmc2V0LmZhY3RvcicpXG4gICAgICAgICAgY2hlY2sudHlwZSh1bml0cywgJ251bWJlcicsICdvZmZzZXQudW5pdHMnKVxuICAgICAgICAgIHZhciBQT0xZR09OX09GRlNFVF9TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIGVudHJ5KFBPTFlHT05fT0ZGU0VUX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIGZhY3RvciwgJywnLCB1bml0cywgJyk7JylcbiAgICAgICAgICBleGl0KFBPTFlHT05fT0ZGU0VUX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdjdWxsLmZhY2UnOlxuICAgICAgICAgIHZhciBmYWNlID0gMFxuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJ2Zyb250Jykge1xuICAgICAgICAgICAgZmFjZSA9IEdMX0ZST05UXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2JhY2snKSB7XG4gICAgICAgICAgICBmYWNlID0gR0xfQkFDS1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGVjayghIWZhY2UsICdjdWxsLmZhY2UnKVxuICAgICAgICAgIHZhciBDVUxMX0ZBQ0VfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShDVUxMX0ZBQ0VfU1RBQ0ssICcucHVzaCgnLCBmYWNlLCAnKTsnKVxuICAgICAgICAgIGV4aXQoQ1VMTF9GQUNFX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdsaW5lV2lkdGgnOlxuICAgICAgICAgIHZhciBsaW5lV2lkdGhEaW1zID0gbGltaXRzLmxpbmVXaWR0aERpbXNcbiAgICAgICAgICBjaGVjayhcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgICAgIHZhbHVlID49IGxpbmVXaWR0aERpbXNbMF0gJiZcbiAgICAgICAgICAgIHZhbHVlIDw9IGxpbmVXaWR0aERpbXNbMV0sXG4gICAgICAgICAgICAnaW52YWxpZCBsaW5lIHdpZHRoLCBtdXN0IHBvc2l0aXZlIG51bWJlciBiZXR3ZWVuICcgK1xuICAgICAgICAgICAgbGluZVdpZHRoRGltc1swXSArICcgYW5kICcgKyBsaW5lV2lkdGhEaW1zWzFdKVxuICAgICAgICAgIGhhbmRsZVN0YXRpY09wdGlvbihwYXJhbSwgdmFsdWUpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdmcm9udEZhY2UnOlxuICAgICAgICAgIHZhciBvcmllbnRhdGlvbiA9IDBcbiAgICAgICAgICBpZiAodmFsdWUgPT09ICdjdycpIHtcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gR0xfQ1dcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnY2N3Jykge1xuICAgICAgICAgICAgb3JpZW50YXRpb24gPSBHTF9DQ1dcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hlY2soISFvcmllbnRhdGlvbiwgJ2Zyb250RmFjZScpXG4gICAgICAgICAgdmFyIEZST05UX0ZBQ0VfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShGUk9OVF9GQUNFX1NUQUNLLCAnLnB1c2goJywgb3JpZW50YXRpb24sICcpOycpXG4gICAgICAgICAgZXhpdChGUk9OVF9GQUNFX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdjb2xvck1hc2snOlxuICAgICAgICAgIGNoZWNrKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gNCwgJ2NvbG9yIG1hc2sgbXVzdCBiZSBsZW5ndGggNCBhcnJheScpXG4gICAgICAgICAgdmFyIENPTE9SX01BU0tfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShDT0xPUl9NQVNLX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIHZhbHVlLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gISF2IH0pLmpvaW4oKSxcbiAgICAgICAgICAgICcpOycpXG4gICAgICAgICAgZXhpdChDT0xPUl9NQVNLX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdzYW1wbGUuY292ZXJhZ2UnOlxuICAgICAgICAgIGNoZWNrLnR5cGUodmFsdWUsICdvYmplY3QnLCBwYXJhbSlcbiAgICAgICAgICB2YXIgc2FtcGxlVmFsdWUgPSAndmFsdWUnIGluIHZhbHVlID8gdmFsdWUudmFsdWUgOiAxXG4gICAgICAgICAgdmFyIHNhbXBsZUludmVydCA9ICEhdmFsdWUuaW52ZXJ0XG4gICAgICAgICAgY2hlY2soXG4gICAgICAgICAgICB0eXBlb2Ygc2FtcGxlVmFsdWUgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgICBzYW1wbGVWYWx1ZSA+PSAwICYmIHNhbXBsZVZhbHVlIDw9IDEsXG4gICAgICAgICAgICAnc2FtcGxlIHZhbHVlJylcbiAgICAgICAgICB2YXIgU0FNUExFX0NPVkVSQUdFX1NUQUNLID0gbGlua0NvbnRleHQocGFyYW0pXG4gICAgICAgICAgZW50cnkoU0FNUExFX0NPVkVSQUdFX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIHNhbXBsZVZhbHVlLCAnLCcsIHNhbXBsZUludmVydCwgJyk7JylcbiAgICAgICAgICBleGl0KFNBTVBMRV9DT1ZFUkFHRV9TVEFDSywgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAndmlld3BvcnQnOlxuICAgICAgICBjYXNlICdzY2lzc29yLmJveCc6XG4gICAgICAgICAgY2hlY2sodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSwgcGFyYW0gKyAnIGlzIGFuIG9iamVjdCcpXG4gICAgICAgICAgdmFyIFggPSB2YWx1ZS54IHx8IDBcbiAgICAgICAgICB2YXIgWSA9IHZhbHVlLnkgfHwgMFxuICAgICAgICAgIHZhciBXID0gLTFcbiAgICAgICAgICB2YXIgSCA9IC0xXG4gICAgICAgICAgY2hlY2sodHlwZW9mIFggPT09ICdudW1iZXInICYmIFggPj0gMCwgcGFyYW0gKyAnLnggbXVzdCBiZSBhIHBvc2l0aXZlIGludCcpXG4gICAgICAgICAgY2hlY2sodHlwZW9mIFkgPT09ICdudW1iZXInICYmIFkgPj0gMCwgcGFyYW0gKyAnLnkgbXVzdCBiZSBhIHBvc2l0aXZlIGludCcpXG4gICAgICAgICAgaWYgKCd3JyBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgVyA9IHZhbHVlLndcbiAgICAgICAgICAgIGNoZWNrKHR5cGVvZiBXID09PSAnbnVtYmVyJyAmJiBXID49IDAsIHBhcmFtICsgJy53IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnQnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJ2gnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBIID0gdmFsdWUuaFxuICAgICAgICAgICAgY2hlY2sodHlwZW9mIEggPT09ICdudW1iZXInICYmIEggPj0gMCwgcGFyYW0gKyAnLmggbXVzdCBiZSBhIHBvc2l0aXZlIGludCcpXG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBCT1hfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBlbnRyeShCT1hfU1RBQ0ssICcucHVzaCgnLCBYLCAnLCcsIFksICcsJywgVywgJywnLCBILCAnKTsnKVxuICAgICAgICAgIGV4aXQoQk9YX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIFRPRE8gU2hvdWxkIHRoaXMganVzdCBiZSBhIHdhcm5pbmcgaW5zdGVhZD9cbiAgICAgICAgICBjaGVjay5yYWlzZSgndW5zdXBwb3J0ZWQgcGFyYW1ldGVyICcgKyBwYXJhbSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gdXBkYXRlIHNoYWRlciBwcm9ncmFtXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChoYXNTaGFkZXIpIHtcbiAgICAgIGlmIChzdGF0aWNPcHRpb25zLmZyYWcgJiYgc3RhdGljT3B0aW9ucy52ZXJ0KSB7XG4gICAgICAgIHZhciBmcmFnU3JjID0gc3RhdGljT3B0aW9ucy5mcmFnXG4gICAgICAgIHZhciB2ZXJ0U3JjID0gc3RhdGljT3B0aW9ucy52ZXJ0XG4gICAgICAgIGVudHJ5KFBST0dSQU1fU1RBVEUsICcucHVzaCgnLFxuICAgICAgICAgIGxpbmsoc2hhZGVyU3RhdGUuY3JlYXRlKHZlcnRTcmMsIGZyYWdTcmMpKSwgJyk7JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBGUkFHX1NSQyA9IGVudHJ5LmRlZihcbiAgICAgICAgICBGUkFHX1NIQURFUl9TVEFURSwgJ1snLCBGUkFHX1NIQURFUl9TVEFURSwgJy5sZW5ndGgtMV0nKVxuICAgICAgICB2YXIgVkVSVF9TUkMgPSBlbnRyeS5kZWYoXG4gICAgICAgICAgVkVSVF9TSEFERVJfU1RBVEUsICdbJywgVkVSVF9TSEFERVJfU1RBVEUsICcubGVuZ3RoLTFdJylcbiAgICAgICAgdmFyIExJTktfUFJPRyA9IGxpbmsoc2hhZGVyU3RhdGUuY3JlYXRlKVxuICAgICAgICBlbnRyeShcbiAgICAgICAgICBQUk9HUkFNX1NUQVRFLCAnLnB1c2goJyxcbiAgICAgICAgICBMSU5LX1BST0csICcoJywgVkVSVF9TUkMsICcsJywgRlJBR19TUkMsICcpKTsnKVxuICAgICAgfVxuICAgICAgZXhpdChQUk9HUkFNX1NUQVRFLCAnLnBvcCgpOycpXG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHVwZGF0ZSBzdGF0aWMgdW5pZm9ybXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgT2JqZWN0LmtleXMoc3RhdGljVW5pZm9ybXMpLmZvckVhY2goZnVuY3Rpb24gKHVuaWZvcm0pIHtcbiAgICAgIHVuaWZvcm1TdGF0ZS5kZWYodW5pZm9ybSlcbiAgICAgIHZhciBTVEFDSyA9IGxpbmsodW5pZm9ybVN0YXRlLnVuaWZvcm1zW3VuaWZvcm1dKVxuICAgICAgdmFyIFZBTFVFXG4gICAgICB2YXIgdmFsdWUgPSBzdGF0aWNVbmlmb3Jtc1t1bmlmb3JtXVxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWx1ZS5fcmVnbFR5cGUpIHtcbiAgICAgICAgVkFMVUUgPSBsaW5rKHZhbHVlKVxuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBWQUxVRSA9IGxpbmsodmFsdWUuc2xpY2UoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFZBTFVFID0gK3ZhbHVlXG4gICAgICB9XG4gICAgICBlbnRyeShTVEFDSywgJy5wdXNoKCcsIFZBTFVFLCAnKTsnKVxuICAgICAgZXhpdChTVEFDSywgJy5wb3AoKTsnKVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gdXBkYXRlIGRlZmF1bHQgYXR0cmlidXRlc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBPYmplY3Qua2V5cyhzdGF0aWNBdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgIGF0dHJpYnV0ZVN0YXRlLmRlZihhdHRyaWJ1dGUpXG4gICAgICB2YXIgQVRUUklCVVRFID0gbGluayhhdHRyaWJ1dGVTdGF0ZS5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pXG5cbiAgICAgIHZhciBkYXRhID0gc3RhdGljQXR0cmlidXRlc1thdHRyaWJ1dGVdXG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGVudHJ5KEFUVFJJQlVURSwgJy5wdXNoVmVjKCcsICtkYXRhLCAnLDAsMCwwKTsnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2soISFkYXRhLCAnaW52YWxpZCBhdHRyaWJ1dGU6ICcgKyBhdHRyaWJ1dGUpXG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICBlbnRyeShcbiAgICAgICAgICAgIEFUVFJJQlVURSwgJy5wdXNoVmVjKCcsXG4gICAgICAgICAgICBbZGF0YVswXSB8fCAwLCBkYXRhWzFdIHx8IDAsIGRhdGFbMl0gfHwgMCwgZGF0YVszXSB8fCAwXSwgJyk7JylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgYnVmZmVyID0gYnVmZmVyU3RhdGUuZ2V0QnVmZmVyKGRhdGEpXG4gICAgICAgICAgdmFyIHNpemUgPSAwXG4gICAgICAgICAgdmFyIHN0cmlkZSA9IDBcbiAgICAgICAgICB2YXIgb2Zmc2V0ID0gMFxuICAgICAgICAgIHZhciBkaXZpc29yID0gMFxuICAgICAgICAgIHZhciBub3JtYWxpemVkID0gZmFsc2VcbiAgICAgICAgICB2YXIgdHlwZSA9IEdMX0ZMT0FUXG5cbiAgICAgICAgICBpZiAoIWJ1ZmZlcikge1xuICAgICAgICAgICAgY2hlY2sudHlwZShkYXRhLCAnb2JqZWN0JywgJ2ludmFsaWQgYXR0cmlidXRlIFwiJyArIGF0dHJpYnV0ZSArICdcIicpXG5cbiAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlclN0YXRlLmdldEJ1ZmZlcihkYXRhLmJ1ZmZlcilcbiAgICAgICAgICAgIHNpemUgPSBkYXRhLnNpemUgfHwgMFxuICAgICAgICAgICAgc3RyaWRlID0gZGF0YS5zdHJpZGUgfHwgMFxuICAgICAgICAgICAgb2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwgMFxuICAgICAgICAgICAgZGl2aXNvciA9IGRhdGEuZGl2aXNvciB8fCAwXG4gICAgICAgICAgICBub3JtYWxpemVkID0gZGF0YS5ub3JtYWxpemVkIHx8IGZhbHNlXG5cbiAgICAgICAgICAgIGNoZWNrKCEhYnVmZmVyLCAnaW52YWxpZCBhdHRyaWJ1dGUgJyArIGF0dHJpYnV0ZSArICcuYnVmZmVyJylcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHVzZXIgZGVmaW5lZCB0eXBlIG92ZXJsb2FkaW5nXG4gICAgICAgICAgICB0eXBlID0gYnVmZmVyLmR0eXBlXG4gICAgICAgICAgICBpZiAoJ3R5cGUnIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgY2hlY2sucGFyYW1ldGVyKGRhdGEudHlwZSwgZ2xUeXBlcywgJ2F0dHJpYnV0ZSB0eXBlJylcbiAgICAgICAgICAgICAgdHlwZSA9IGdsVHlwZXNbZGF0YS50eXBlXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0eXBlID0gYnVmZmVyLmR0eXBlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2hlY2soISFidWZmZXIsICdpbnZhbGlkIGF0dHJpYnV0ZSAnICsgYXR0cmlidXRlICsgJy5idWZmZXInKVxuICAgICAgICAgIGNoZWNrLm5uaShzdHJpZGUsIGF0dHJpYnV0ZSArICcuc3RyaWRlJylcbiAgICAgICAgICBjaGVjay5ubmkob2Zmc2V0LCBhdHRyaWJ1dGUgKyAnLm9mZnNldCcpXG4gICAgICAgICAgY2hlY2subm5pKGRpdmlzb3IsIGF0dHJpYnV0ZSArICcuZGl2aXNvcicpXG4gICAgICAgICAgY2hlY2sudHlwZShub3JtYWxpemVkLCAnYm9vbGVhbicsIGF0dHJpYnV0ZSArICcubm9ybWFsaXplZCcpXG4gICAgICAgICAgY2hlY2sub25lT2Yoc2l6ZSwgWzAsIDEsIDIsIDMsIDRdLCBhdHRyaWJ1dGUgKyAnLnNpemUnKVxuXG4gICAgICAgICAgZW50cnkoXG4gICAgICAgICAgICBBVFRSSUJVVEUsICcucHVzaFB0cignLCBbXG4gICAgICAgICAgICAgIGxpbmsoYnVmZmVyKSwgc2l6ZSwgb2Zmc2V0LCBzdHJpZGUsXG4gICAgICAgICAgICAgIGRpdmlzb3IsIG5vcm1hbGl6ZWQsIHR5cGVcbiAgICAgICAgICAgIF0uam9pbigpLCAnKTsnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBleGl0KEFUVFJJQlVURSwgJy5wb3AoKTsnKVxuICAgIH0pXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gRFlOQU1JQyBTVEFURSAoZm9yIHNjb3BlIGFuZCBkcmF3KVxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBHZW5lcmF0ZWQgY29kZSBibG9ja3MgZm9yIGR5bmFtaWMgc3RhdGUgZmxhZ3NcbiAgICB2YXIgZHluYW1pY0VudHJ5ID0gZW52LmJsb2NrKClcbiAgICB2YXIgZHluYW1pY0V4aXQgPSBlbnYuYmxvY2soKVxuXG4gICAgdmFyIEZSQU1FU1RBVEVcbiAgICB2YXIgRFlOQVJHU1xuICAgIGlmIChoYXNEeW5hbWljKSB7XG4gICAgICBGUkFNRVNUQVRFID0gbGluayhmcmFtZVN0YXRlKVxuICAgICAgRFlOQVJHUyA9IGVudHJ5LmRlZigpXG4gICAgfVxuXG4gICAgdmFyIGR5bmFtaWNWYXJzID0ge31cbiAgICBmdW5jdGlvbiBkeW4gKHgpIHtcbiAgICAgIHZhciBpZCA9IHguaWRcbiAgICAgIHZhciByZXN1bHQgPSBkeW5hbWljVmFyc1tpZF1cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgICAgaWYgKHguZnVuYykge1xuICAgICAgICByZXN1bHQgPSBkeW5hbWljRW50cnkuZGVmKFxuICAgICAgICAgIGxpbmsoeC5kYXRhKSwgJygnLCBEWU5BUkdTLCAnLDAsJywgRlJBTUVTVEFURSwgJyknKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZHluYW1pY0VudHJ5LmRlZihEWU5BUkdTLCAnLicsIHguZGF0YSlcbiAgICAgIH1cbiAgICAgIGR5bmFtaWNWYXJzW2lkXSA9IHJlc3VsdFxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkeW5hbWljIGNvbnRleHQgc3RhdGUgdmFyaWFibGVzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIE9iamVjdC5rZXlzKGR5bmFtaWNPcHRpb25zKS5zb3J0KG9wdGlvblByaW9yaXR5KS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgLy8gTGluayBpbiBkeW5hbWljIHZhcmlhYmxlXG4gICAgICB2YXIgdmFyaWFibGUgPSBkeW4oZHluYW1pY09wdGlvbnNbcGFyYW1dKVxuXG4gICAgICBzd2l0Y2ggKHBhcmFtKSB7XG4gICAgICAgIGNhc2UgJ2ZyYW1lYnVmZmVyJzpcbiAgICAgICAgICB2YXIgVklFV1BPUlRfU1RBVEUgPSBsaW5rQ29udGV4dCgndmlld3BvcnQnKVxuICAgICAgICAgIHZhciBTQ0lTU09SX1NUQVRFID0gbGlua0NvbnRleHQoJ3NjaXNzb3IuYm94JylcbiAgICAgICAgICBkeW5hbWljRW50cnkoJ2lmKCcsXG4gICAgICAgICAgICBGUkFNRUJVRkZFUl9TVEFURSwgJy5wdXNoKCcsXG4gICAgICAgICAgICB2YXJpYWJsZSwgJyYmJywgdmFyaWFibGUsICcuX2ZyYW1lYnVmZmVyKSl7JyxcbiAgICAgICAgICAgIFZJRVdQT1JUX1NUQVRFLCAnLnNldERpcnR5KCk7JyxcbiAgICAgICAgICAgIFNDSVNTT1JfU1RBVEUsICcuc2V0RGlydHkoKTsnLFxuICAgICAgICAgICAgJ30nKVxuICAgICAgICAgIGR5bmFtaWNFeGl0KCdpZignLFxuICAgICAgICAgICAgRlJBTUVCVUZGRVJfU1RBVEUsICcucG9wKCkpeycsXG4gICAgICAgICAgICBWSUVXUE9SVF9TVEFURSwgJy5zZXREaXJ0eSgpOycsXG4gICAgICAgICAgICBTQ0lTU09SX1NUQVRFLCAnLnNldERpcnR5KCk7JyxcbiAgICAgICAgICAgICd9JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2N1bGwuZW5hYmxlJzpcbiAgICAgICAgY2FzZSAnYmxlbmQuZW5hYmxlJzpcbiAgICAgICAgY2FzZSAnZGl0aGVyJzpcbiAgICAgICAgY2FzZSAnc3RlbmNpbC5lbmFibGUnOlxuICAgICAgICBjYXNlICdkZXB0aC5lbmFibGUnOlxuICAgICAgICBjYXNlICdzY2lzc29yLmVuYWJsZSc6XG4gICAgICAgIGNhc2UgJ3BvbHlnb25PZmZzZXQuZW5hYmxlJzpcbiAgICAgICAgY2FzZSAnc2FtcGxlLmFscGhhJzpcbiAgICAgICAgY2FzZSAnc2FtcGxlLmVuYWJsZSc6XG4gICAgICAgIGNhc2UgJ2xpbmVXaWR0aCc6XG4gICAgICAgIGNhc2UgJ2RlcHRoLm1hc2snOlxuICAgICAgICAgIHZhciBTVEFURV9TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIGR5bmFtaWNFbnRyeShTVEFURV9TVEFDSywgJy5wdXNoKCcsIHZhcmlhYmxlLCAnKTsnKVxuICAgICAgICAgIGR5bmFtaWNFeGl0KFNUQVRFX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICAvLyBEcmF3IGNhbGxzXG4gICAgICAgIGNhc2UgJ2NvdW50JzpcbiAgICAgICAgY2FzZSAnb2Zmc2V0JzpcbiAgICAgICAgY2FzZSAnaW5zdGFuY2VzJzpcbiAgICAgICAgICB2YXIgRFJBV19TVEFDSyA9IERSQVdfU1RBVEVbcGFyYW1dXG4gICAgICAgICAgZHluYW1pY0VudHJ5KERSQVdfU1RBQ0ssICcucHVzaCgnLCB2YXJpYWJsZSwgJyk7JylcbiAgICAgICAgICBkeW5hbWljRXhpdChEUkFXX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdwcmltaXRpdmUnOlxuICAgICAgICAgIHZhciBQUklNX1NUQUNLID0gRFJBV19TVEFURS5wcmltaXRpdmVcbiAgICAgICAgICBkeW5hbWljRW50cnkoUFJJTV9TVEFDSywgJy5wdXNoKCcsIFBSSU1fVFlQRVMsICdbJywgdmFyaWFibGUsICddKTsnKVxuICAgICAgICAgIGR5bmFtaWNFeGl0KFBSSU1fU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2RlcHRoLmZ1bmMnOlxuICAgICAgICAgIHZhciBERVBUSF9GVU5DX1NUQUNLID0gbGlua0NvbnRleHQocGFyYW0pXG4gICAgICAgICAgZHluYW1pY0VudHJ5KERFUFRIX0ZVTkNfU1RBQ0ssICcucHVzaCgnLCBDT01QQVJFX0ZVTkNTLCAnWycsIHZhcmlhYmxlLCAnXSk7JylcbiAgICAgICAgICBkeW5hbWljRXhpdChERVBUSF9GVU5DX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdibGVuZC5mdW5jJzpcbiAgICAgICAgICB2YXIgQkxFTkRfRlVOQ19TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIHZhciBCTEVORF9GVU5DUyA9IGxpbmsoYmxlbmRGdW5jcylcbiAgICAgICAgICBkeW5hbWljRW50cnkoXG4gICAgICAgICAgICBCTEVORF9GVU5DX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIEJMRU5EX0ZVTkNTLFxuICAgICAgICAgICAgJ1tcInNyY1JHQlwiIGluICcsIHZhcmlhYmxlLCAnPycsIHZhcmlhYmxlLCAnLnNyY1JHQjonLCB2YXJpYWJsZSwgJy5zcmNdLCcsXG4gICAgICAgICAgICBCTEVORF9GVU5DUyxcbiAgICAgICAgICAgICdbXCJkc3RSR0JcIiBpbiAnLCB2YXJpYWJsZSwgJz8nLCB2YXJpYWJsZSwgJy5kc3RSR0I6JywgdmFyaWFibGUsICcuZHN0XSwnLFxuICAgICAgICAgICAgQkxFTkRfRlVOQ1MsXG4gICAgICAgICAgICAnW1wic3JjQWxwaGFcIiBpbiAnLCB2YXJpYWJsZSwgJz8nLCB2YXJpYWJsZSwgJy5zcmNBbHBoYTonLCB2YXJpYWJsZSwgJy5zcmNdLCcsXG4gICAgICAgICAgICBCTEVORF9GVU5DUyxcbiAgICAgICAgICAgICdbXCJkc3RBbHBoYVwiIGluICcsIHZhcmlhYmxlLCAnPycsIHZhcmlhYmxlLCAnLmRzdEFscGhhOicsIHZhcmlhYmxlLCAnLmRzdF0pOycpXG4gICAgICAgICAgZHluYW1pY0V4aXQoQkxFTkRfRlVOQ19TVEFDSywgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnYmxlbmQuZXF1YXRpb24nOlxuICAgICAgICAgIHZhciBCTEVORF9FUVVBVElPTl9TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIHZhciBCTEVORF9FUVVBVElPTlMgPSBsaW5rKGJsZW5kRXF1YXRpb25zKVxuICAgICAgICAgIGR5bmFtaWNFbnRyeShcbiAgICAgICAgICAgICdpZih0eXBlb2YgJywgdmFyaWFibGUsICc9PT1cInN0cmluZ1wiKXsnLFxuICAgICAgICAgICAgQkxFTkRfRVFVQVRJT05fU1RBQ0ssICcucHVzaCgnLFxuICAgICAgICAgICAgQkxFTkRfRVFVQVRJT05TLCAnWycsIHZhcmlhYmxlLCAnXSwnLFxuICAgICAgICAgICAgQkxFTkRfRVFVQVRJT05TLCAnWycsIHZhcmlhYmxlLCAnXSk7JyxcbiAgICAgICAgICAgICd9ZWxzZXsnLFxuICAgICAgICAgICAgQkxFTkRfRVFVQVRJT05fU1RBQ0ssICcucHVzaCgnLFxuICAgICAgICAgICAgQkxFTkRfRVFVQVRJT05TLCAnWycsIHZhcmlhYmxlLCAnLnJnYl0sJyxcbiAgICAgICAgICAgIEJMRU5EX0VRVUFUSU9OUywgJ1snLCB2YXJpYWJsZSwgJy5hbHBoYV0pOycsXG4gICAgICAgICAgICAnfScpXG4gICAgICAgICAgZHluYW1pY0V4aXQoQkxFTkRfRVFVQVRJT05fU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2JsZW5kLmNvbG9yJzpcbiAgICAgICAgICB2YXIgQkxFTkRfQ09MT1JfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBkeW5hbWljRW50cnkoQkxFTkRfQ09MT1JfU1RBQ0ssICcucHVzaCgnLFxuICAgICAgICAgICAgdmFyaWFibGUsICdbMF0sJyxcbiAgICAgICAgICAgIHZhcmlhYmxlLCAnWzFdLCcsXG4gICAgICAgICAgICB2YXJpYWJsZSwgJ1syXSwnLFxuICAgICAgICAgICAgdmFyaWFibGUsICdbM10pOycpXG4gICAgICAgICAgZHluYW1pY0V4aXQoQkxFTkRfQ09MT1JfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3N0ZW5jaWwubWFzayc6XG4gICAgICAgICAgdmFyIFNURU5DSUxfTUFTS19TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIGR5bmFtaWNFbnRyeShTVEVOQ0lMX01BU0tfU1RBQ0ssICcucHVzaCgnLCB2YXJpYWJsZSwgJyk7JylcbiAgICAgICAgICBkeW5hbWljRXhpdChTVEVOQ0lMX01BU0tfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3N0ZW5jaWwuZnVuYyc6XG4gICAgICAgICAgdmFyIFNURU5DSUxfRlVOQ19TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIGR5bmFtaWNFbnRyeShTVEVOQ0lMX0ZVTkNfU1RBQ0ssICcucHVzaCgnLFxuICAgICAgICAgICAgQ09NUEFSRV9GVU5DUywgJ1snLCB2YXJpYWJsZSwgJy5jbXBdLCcsXG4gICAgICAgICAgICB2YXJpYWJsZSwgJy5yZWZ8MCwnLFxuICAgICAgICAgICAgJ1wibWFza1wiIGluICcsIHZhcmlhYmxlLCAnPycsIHZhcmlhYmxlLCAnLm1hc2s6LTEpOycpXG4gICAgICAgICAgZHluYW1pY0V4aXQoU1RFTkNJTF9GVU5DX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdzdGVuY2lsLm9wRnJvbnQnOlxuICAgICAgICBjYXNlICdzdGVuY2lsLm9wQmFjayc6XG4gICAgICAgICAgdmFyIFNURU5DSUxfT1BfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBkeW5hbWljRW50cnkoU1RFTkNJTF9PUF9TVEFDSywgJy5wdXNoKCcsXG4gICAgICAgICAgICBTVEVOQ0lMX09QUywgJ1snLCB2YXJpYWJsZSwgJy5mYWlsfHxcImtlZXBcIl0sJyxcbiAgICAgICAgICAgIFNURU5DSUxfT1BTLCAnWycsIHZhcmlhYmxlLCAnLnpmYWlsfHxcImtlZXBcIl0sJyxcbiAgICAgICAgICAgIFNURU5DSUxfT1BTLCAnWycsIHZhcmlhYmxlLCAnLnBhc3N8fFwia2VlcFwiXSk7JylcbiAgICAgICAgICBkeW5hbWljRXhpdChTVEVOQ0lMX09QX1NUQUNLLCAnLnBvcCgpOycpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdwb2x5Z29uT2Zmc2V0Lm9mZnNldCc6XG4gICAgICAgICAgdmFyIFBPTFlHT05fT0ZGU0VUX1NUQUNLID0gbGlua0NvbnRleHQocGFyYW0pXG4gICAgICAgICAgZHluYW1pY0VudHJ5KFBPTFlHT05fT0ZGU0VUX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIHZhcmlhYmxlLCAnLmZhY3Rvcnx8MCwnLFxuICAgICAgICAgICAgdmFyaWFibGUsICcudW5pdHN8fDApOycpXG4gICAgICAgICAgZHluYW1pY0V4aXQoUE9MWUdPTl9PRkZTRVRfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2N1bGwuZmFjZSc6XG4gICAgICAgICAgdmFyIENVTExfRkFDRV9TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIGR5bmFtaWNFbnRyeShDVUxMX0ZBQ0VfU1RBQ0ssICcucHVzaCgnLFxuICAgICAgICAgICAgdmFyaWFibGUsICc9PT1cImZyb250XCI/JywgR0xfRlJPTlQsICc6JywgR0xfQkFDSywgJyk7JylcbiAgICAgICAgICBkeW5hbWljRXhpdChDVUxMX0ZBQ0VfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2Zyb250RmFjZSc6XG4gICAgICAgICAgdmFyIEZST05UX0ZBQ0VfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBkeW5hbWljRW50cnkoRlJPTlRfRkFDRV9TVEFDSywgJy5wdXNoKCcsXG4gICAgICAgICAgICB2YXJpYWJsZSwgJz09PVwiY3dcIj8nLCBHTF9DVywgJzonLCBHTF9DQ1csICcpOycpXG4gICAgICAgICAgZHluYW1pY0V4aXQoRlJPTlRfRkFDRV9TVEFDSywgJy5wb3AoKTsnKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnY29sb3JNYXNrJzpcbiAgICAgICAgICB2YXIgQ09MT1JfTUFTS19TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIGR5bmFtaWNFbnRyeShDT0xPUl9NQVNLX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIHZhcmlhYmxlLCAnWzBdLCcsXG4gICAgICAgICAgICB2YXJpYWJsZSwgJ1sxXSwnLFxuICAgICAgICAgICAgdmFyaWFibGUsICdbMl0sJyxcbiAgICAgICAgICAgIHZhcmlhYmxlLCAnWzNdKTsnKVxuICAgICAgICAgIGR5bmFtaWNFeGl0KENPTE9SX01BU0tfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3NhbXBsZS5jb3ZlcmFnZSc6XG4gICAgICAgICAgdmFyIFNBTVBMRV9DT1ZFUkFHRV9TVEFDSyA9IGxpbmtDb250ZXh0KHBhcmFtKVxuICAgICAgICAgIGR5bmFtaWNFbnRyeShTQU1QTEVfQ09WRVJBR0VfU1RBQ0ssICcucHVzaCgnLFxuICAgICAgICAgICAgdmFyaWFibGUsICcudmFsdWUsJyxcbiAgICAgICAgICAgIHZhcmlhYmxlLCAnLmludmVydCk7JylcbiAgICAgICAgICBkeW5hbWljRXhpdChTQU1QTEVfQ09WRVJBR0VfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ3NjaXNzb3IuYm94JzpcbiAgICAgICAgY2FzZSAndmlld3BvcnQnOlxuICAgICAgICAgIHZhciBCT1hfU1RBQ0sgPSBsaW5rQ29udGV4dChwYXJhbSlcbiAgICAgICAgICBkeW5hbWljRW50cnkoQk9YX1NUQUNLLCAnLnB1c2goJyxcbiAgICAgICAgICAgIHZhcmlhYmxlLCAnLnh8fDAsJyxcbiAgICAgICAgICAgIHZhcmlhYmxlLCAnLnl8fDAsJyxcbiAgICAgICAgICAgICdcIndcIiBpbiAnLCB2YXJpYWJsZSwgJz8nLCB2YXJpYWJsZSwgJy53Oi0xLCcsXG4gICAgICAgICAgICAnXCJoXCIgaW4gJywgdmFyaWFibGUsICc/JywgdmFyaWFibGUsICcuaDotMSk7JylcbiAgICAgICAgICBkeW5hbWljRXhpdChCT1hfU1RBQ0ssICcucG9wKCk7JylcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2VsZW1lbnRzJzpcbiAgICAgICAgICB2YXIgaGFzUHJpbWl0aXZlID1cbiAgICAgICAgICAhKCdwcmltaXRpdmUnIGluIGR5bmFtaWNPcHRpb25zKSAmJlxuICAgICAgICAgICAgISgncHJpbWl0aXZlJyBpbiBzdGF0aWNPcHRpb25zKVxuICAgICAgICAgIHZhciBoYXNDb3VudCA9XG4gICAgICAgICAgISgnY291bnQnIGluIGR5bmFtaWNPcHRpb25zKSAmJlxuICAgICAgICAgICAgISgnY291bnQnIGluIHN0YXRpY09wdGlvbnMpXG4gICAgICAgICAgdmFyIGhhc09mZnNldCA9XG4gICAgICAgICAgISgnb2Zmc2V0JyBpbiBkeW5hbWljT3B0aW9ucykgJiZcbiAgICAgICAgICAgICEoJ29mZnNldCcgaW4gc3RhdGljT3B0aW9ucylcbiAgICAgICAgICB2YXIgRUxFTUVOVFMgPSBkeW5hbWljRW50cnkuZGVmKClcbiAgICAgICAgICBkeW5hbWljRW50cnkoXG4gICAgICAgICAgICAnaWYoJywgdmFyaWFibGUsICcpeycsXG4gICAgICAgICAgICBFTEVNRU5UUywgJz0nLCB2YXJpYWJsZSwgJy5fZWxlbWVudHM7JyxcbiAgICAgICAgICAgIEVMRU1FTlRfU1RBVEUsICcucHVzaCgnLCBFTEVNRU5UUywgJyk7JyxcbiAgICAgICAgICAgICFoYXNQcmltaXRpdmUgPyAnJ1xuICAgICAgICAgICAgICA6IERSQVdfU1RBVEUucHJpbWl0aXZlICsgJy5wdXNoKCcgKyBFTEVNRU5UUyArICcucHJpbVR5cGUpOycsXG4gICAgICAgICAgICAhaGFzQ291bnQgPyAnJ1xuICAgICAgICAgICAgICA6IERSQVdfU1RBVEUuY291bnQgKyAnLnB1c2goJyArIEVMRU1FTlRTICsgJy52ZXJ0Q291bnQpOycsXG4gICAgICAgICAgICAhaGFzT2Zmc2V0ID8gJydcbiAgICAgICAgICAgICAgOiBEUkFXX1NUQVRFLm9mZnNldCArICcucHVzaCgnICsgRUxFTUVOVFMgKyAnLm9mZnNldCk7JyxcbiAgICAgICAgICAgICd9ZWxzZXsnLFxuICAgICAgICAgICAgRUxFTUVOVF9TVEFURSwgJy5wdXNoKG51bGwpOycsXG4gICAgICAgICAgICAnfScpXG4gICAgICAgICAgZHluYW1pY0V4aXQoXG4gICAgICAgICAgICBFTEVNRU5UX1NUQVRFLCAnLnBvcCgpOycsXG4gICAgICAgICAgICAnaWYoJywgdmFyaWFibGUsICcpeycsXG4gICAgICAgICAgICBoYXNQcmltaXRpdmUgPyBEUkFXX1NUQVRFLnByaW1pdGl2ZSArICcucG9wKCk7JyA6ICcnLFxuICAgICAgICAgICAgaGFzQ291bnQgPyBEUkFXX1NUQVRFLmNvdW50ICsgJy5wb3AoKTsnIDogJycsXG4gICAgICAgICAgICBoYXNPZmZzZXQgPyBEUkFXX1NUQVRFLm9mZnNldCArICcucG9wKCk7JyA6ICcnLFxuICAgICAgICAgICAgJ30nKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjaGVjay5yYWlzZSgndW5zdXBwb3J0ZWQgZHluYW1pYyBvcHRpb246ICcgKyBwYXJhbSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGR5bmFtaWMgdW5pZm9ybXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgT2JqZWN0LmtleXMoZHluYW1pY1VuaWZvcm1zKS5mb3JFYWNoKGZ1bmN0aW9uICh1bmlmb3JtKSB7XG4gICAgICB1bmlmb3JtU3RhdGUuZGVmKHVuaWZvcm0pXG4gICAgICB2YXIgU1RBQ0sgPSBsaW5rKHVuaWZvcm1TdGF0ZS51bmlmb3Jtc1t1bmlmb3JtXSlcbiAgICAgIHZhciBWQUxVRSA9IGR5bihkeW5hbWljVW5pZm9ybXNbdW5pZm9ybV0pXG4gICAgICBkeW5hbWljRW50cnkoU1RBQ0ssICcucHVzaCgnLCBWQUxVRSwgJyk7JylcbiAgICAgIGR5bmFtaWNFeGl0KFNUQUNLLCAnLnBvcCgpOycpXG4gICAgfSlcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkeW5hbWljIGF0dHJpYnV0ZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgT2JqZWN0LmtleXMoZHluYW1pY0F0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgYXR0cmlidXRlU3RhdGUuZGVmKGF0dHJpYnV0ZSlcbiAgICAgIHZhciBBVFRSSUJVVEUgPSBsaW5rKGF0dHJpYnV0ZVN0YXRlLmF0dHJpYnV0ZXNbYXR0cmlidXRlXSlcbiAgICAgIHZhciBWQUxVRSA9IGR5bihkeW5hbWljQXR0cmlidXRlc1thdHRyaWJ1dGVdKVxuICAgICAgZHluYW1pY0VudHJ5KEFUVFJJQlVURSwgJy5wdXNoRHluKCcsIFZBTFVFLCAnKTsnKVxuICAgICAgZHluYW1pY0V4aXQoQVRUUklCVVRFLCAnLnBvcCgpOycpXG4gICAgfSlcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBTQ09QRSBQUk9DRURVUkVcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgdmFyIHNjb3BlID0gcHJvYygnc2NvcGUnKVxuICAgIHZhciBTQ09QRV9BUkdTID0gc2NvcGUuYXJnKClcbiAgICB2YXIgU0NPUEVfQk9EWSA9IHNjb3BlLmFyZygpXG4gICAgc2NvcGUoZW50cnkpXG4gICAgaWYgKGhhc0R5bmFtaWMpIHtcbiAgICAgIHNjb3BlKFxuICAgICAgICBEWU5BUkdTLCAnPScsIFNDT1BFX0FSR1MsICc7JyxcbiAgICAgICAgZHluYW1pY0VudHJ5KVxuICAgIH1cbiAgICBzY29wZShcbiAgICAgIFNDT1BFX0JPRFksICcoKTsnLFxuICAgICAgaGFzRHluYW1pYyA/IGR5bmFtaWNFeGl0IDogJycsXG4gICAgICBleGl0KVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIERSQVcgUFJPQ0VEVVJFXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHZhciBkcmF3ID0gcHJvYygnZHJhdycpXG4gICAgZHJhdyhlbnRyeSlcbiAgICBpZiAoaGFzRHluYW1pYykge1xuICAgICAgZHJhdyhcbiAgICAgICAgRFlOQVJHUywgJz0nLCBkcmF3LmFyZygpLCAnOycsXG4gICAgICAgIGR5bmFtaWNFbnRyeSlcbiAgICB9XG4gICAgdmFyIENVUlJFTlRfU0hBREVSID0gc3RhY2tUb3AoUFJPR1JBTV9TVEFURSlcbiAgICBkcmF3KFxuICAgICAgR0xfUE9MTCwgJygpOycsXG4gICAgICAnaWYoJywgQ1VSUkVOVF9TSEFERVIsICcpJyxcbiAgICAgIENVUlJFTlRfU0hBREVSLCAnLmRyYXcoJywgaGFzRHluYW1pYyA/IERZTkFSR1MgOiAnJywgJyk7JyxcbiAgICAgIGhhc0R5bmFtaWMgPyBkeW5hbWljRXhpdCA6ICcnLFxuICAgICAgZXhpdClcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBCQVRDSCBEUkFXXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHZhciBiYXRjaCA9IHByb2MoJ2JhdGNoJylcbiAgICBiYXRjaChlbnRyeSlcbiAgICB2YXIgQ1VSX1NIQURFUiA9IGJhdGNoLmRlZihzdGFja1RvcChQUk9HUkFNX1NUQVRFKSlcbiAgICB2YXIgRVhFQ19CQVRDSCA9IGxpbmsoZnVuY3Rpb24gKHByb2dyYW0sIGNvdW50LCBhcmdzKSB7XG4gICAgICB2YXIgcHJvYyA9IHByb2dyYW0uYmF0Y2hDYWNoZVtjYWxsSWRdXG4gICAgICBpZiAoIXByb2MpIHtcbiAgICAgICAgcHJvYyA9IHByb2dyYW0uYmF0Y2hDYWNoZVtjYWxsSWRdID0gY29tcGlsZUJhdGNoKFxuICAgICAgICAgIHByb2dyYW0sIGR5bmFtaWNPcHRpb25zLCBkeW5hbWljVW5pZm9ybXMsIGR5bmFtaWNBdHRyaWJ1dGVzLFxuICAgICAgICAgIHN0YXRpY09wdGlvbnMpXG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvYyhjb3VudCwgYXJncylcbiAgICB9KVxuICAgIGJhdGNoKFxuICAgICAgJ2lmKCcsIENVUl9TSEFERVIsICcpeycsXG4gICAgICBHTF9QT0xMLCAnKCk7JyxcbiAgICAgIEVYRUNfQkFUQ0gsICcoJyxcbiAgICAgIENVUl9TSEFERVIsICcsJyxcbiAgICAgIGJhdGNoLmFyZygpLCAnLCcsXG4gICAgICBiYXRjaC5hcmcoKSwgJyk7JylcbiAgICAvLyBTZXQgZGlydHkgb24gYWxsIGR5bmFtaWMgZmxhZ3NcbiAgICBPYmplY3Qua2V5cyhkeW5hbWljT3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICB2YXIgU1RBVEUgPSBDT05URVhUX1NUQVRFW29wdGlvbl1cbiAgICAgIGlmIChTVEFURSkge1xuICAgICAgICBiYXRjaChTVEFURSwgJy5zZXREaXJ0eSgpOycpXG4gICAgICB9XG4gICAgfSlcbiAgICBiYXRjaCgnfScsIGV4aXQpXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZXZhbCBhbmQgYmluZFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXR1cm4gZW52LmNvbXBpbGUoKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3OiBjb21waWxlU2hhZGVyRHJhdyxcbiAgICBjb21tYW5kOiBjb21waWxlQ29tbWFuZFxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiW29iamVjdCBJbnQ4QXJyYXldXCI6IDUxMjBcbiwgXCJbb2JqZWN0IEludDE2QXJyYXldXCI6IDUxMjJcbiwgXCJbb2JqZWN0IEludDMyQXJyYXldXCI6IDUxMjRcbiwgXCJbb2JqZWN0IFVpbnQ4QXJyYXldXCI6IDUxMjFcbiwgXCJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XVwiOiA1MTIxXG4sIFwiW29iamVjdCBVaW50MTZBcnJheV1cIjogNTEyM1xuLCBcIltvYmplY3QgVWludDMyQXJyYXldXCI6IDUxMjVcbiwgXCJbb2JqZWN0IEZsb2F0MzJBcnJheV1cIjogNTEyNlxuLCBcIltvYmplY3QgRmxvYXQ2NEFycmF5XVwiOiA1MTIxXG4sIFwiW29iamVjdCBBcnJheUJ1ZmZlcl1cIjogNTEyMVxufVxuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcImludDhcIjogNTEyMFxuLCBcImludDE2XCI6IDUxMjJcbiwgXCJpbnQzMlwiOiA1MTI0XG4sIFwidWludDhcIjogNTEyMVxuLCBcInVpbnQxNlwiOiA1MTIzXG4sIFwidWludDMyXCI6IDUxMjVcbiwgXCJmbG9hdFwiOiA1MTI2XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwicG9pbnRzXCI6IDAsXG4gIFwibGluZXNcIjogMSxcbiAgXCJsaW5lIGxvb3BcIjogMixcbiAgXCJsaW5lIHN0cmlwXCI6IDMsXG4gIFwidHJpYW5nbGVzXCI6IDQsXG4gIFwidHJpYW5nbGUgc3RyaXBcIjogNSxcbiAgXCJ0cmlhbmdsZSBmYW5cIjogNlxufVxuIiwiLy8gQ29udGV4dCBhbmQgY2FudmFzIGNyZWF0aW9uIGhlbHBlciBmdW5jdGlvbnNcbi8qZ2xvYmFscyBIVE1MRWxlbWVudCxXZWJHTFJlbmRlcmluZ0NvbnRleHQqL1xuXG52YXIgY2hlY2sgPSByZXF1aXJlKCcuL2NoZWNrJylcblxuZnVuY3Rpb24gY3JlYXRlQ2FudmFzIChlbGVtZW50LCBvcHRpb25zKSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuICB2YXIgYXJncyA9IGdldENvbnRleHQoY2FudmFzLCBvcHRpb25zKVxuXG4gIE9iamVjdC5hc3NpZ24oY2FudmFzLnN0eWxlLCB7XG4gICAgYm9yZGVyOiAwLFxuICAgIG1hcmdpbjogMCxcbiAgICBwYWRkaW5nOiAwLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwXG4gIH0pXG4gIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2FudmFzKVxuXG4gIGlmIChlbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwge1xuICAgICAgbWFyZ2luOiAwLFxuICAgICAgcGFkZGluZzogMFxuICAgIH0pXG4gIH1cblxuICB2YXIgc2NhbGUgPSArYXJncy5vcHRpb25zLnBpeGVsUmF0aW9cbiAgZnVuY3Rpb24gcmVzaXplICgpIHtcbiAgICB2YXIgdyA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgdmFyIGggPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICBpZiAoZWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdmFyIGJvdW5kcyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHcgPSBib3VuZHMucmlnaHQgLSBib3VuZHMubGVmdFxuICAgICAgaCA9IGJvdW5kcy50b3AgLSBib3VuZHMuYm90dG9tXG4gICAgfVxuICAgIGNhbnZhcy53aWR0aCA9IHNjYWxlICogd1xuICAgIGNhbnZhcy5oZWlnaHQgPSBzY2FsZSAqIGhcbiAgICBPYmplY3QuYXNzaWduKGNhbnZhcy5zdHlsZSwge1xuICAgICAgd2lkdGg6IHcgKyAncHgnLFxuICAgICAgaGVpZ2h0OiBoICsgJ3B4J1xuICAgIH0pXG4gIH1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplLCBmYWxzZSlcblxuICB2YXIgcHJldkRlc3Ryb3kgPSBhcmdzLm9wdGlvbnMub25EZXN0cm95XG4gIGFyZ3Mub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGFyZ3Mub3B0aW9ucywge1xuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSlcbiAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoY2FudmFzKVxuICAgICAgcHJldkRlc3Ryb3kgJiYgcHJldkRlc3Ryb3koKVxuICAgIH1cbiAgfSlcblxuICByZXNpemUoKVxuXG4gIHJldHVybiBhcmdzXG59XG5cbmZ1bmN0aW9uIGdldENvbnRleHQgKGNhbnZhcywgb3B0aW9ucykge1xuICB2YXIgZ2xPcHRpb25zID0gb3B0aW9ucy5nbE9wdGlvbnMgfHwge31cblxuICBmdW5jdGlvbiBnZXQgKG5hbWUpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGNhbnZhcy5nZXRDb250ZXh0KG5hbWUsIGdsT3B0aW9ucylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHZhciBnbCA9IGdldCgnd2ViZ2wnKSB8fFxuICAgICAgICAgICBnZXQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpIHx8XG4gICAgICAgICAgIGdldCgnd2ViZ2wtZXhwZXJpbWVudGFsJylcblxuICBjaGVjayhnbCwgJ3dlYmdsIG5vdCBzdXBwb3J0ZWQnKVxuXG4gIHJldHVybiB7XG4gICAgZ2w6IGdsLFxuICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe1xuICAgICAgcGl4ZWxSYXRpbzogd2luZG93LmRldmljZVBpeGVsUmF0aW9cbiAgICB9LCBvcHRpb25zKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VBcmdzIChhcmdzKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICB0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdsOiBhcmdzWzBdLFxuICAgICAgb3B0aW9uczogYXJnc1sxXSB8fCB7fVxuICAgIH1cbiAgfVxuXG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuYm9keVxuICB2YXIgb3B0aW9ucyA9IGFyZ3NbMV0gfHwge31cblxuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYXJnc1swXSkgfHwgZG9jdW1lbnQuYm9keVxuICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0Jykge1xuICAgIGlmIChhcmdzWzBdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQgPSBhcmdzWzBdXG4gICAgfSBlbHNlIGlmIChhcmdzWzBdIGluc3RhbmNlb2YgV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnbDogYXJnc1swXSxcbiAgICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgcGl4ZWxSYXRpbzogMVxuICAgICAgICB9LCBvcHRpb25zKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gYXJnc1swXVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVOYW1lICYmIGVsZW1lbnQubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0NBTlZBUycpIHtcbiAgICByZXR1cm4gZ2V0Q29udGV4dChlbGVtZW50LCBvcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBjcmVhdGVDYW52YXMoZWxlbWVudCwgb3B0aW9ucylcbiAgfVxufVxuIiwidmFyIEdMX1RSSUFOR0xFUyA9IDRcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3cmFwRHJhd1N0YXRlIChnbCkge1xuICB2YXIgcHJpbWl0aXZlID0gWyBHTF9UUklBTkdMRVMgXVxuICB2YXIgY291bnQgPSBbIDAgXVxuICB2YXIgb2Zmc2V0ID0gWyAwIF1cbiAgdmFyIGluc3RhbmNlcyA9IFsgMCBdXG5cbiAgcmV0dXJuIHtcbiAgICBwcmltaXRpdmU6IHByaW1pdGl2ZSxcbiAgICBjb3VudDogY291bnQsXG4gICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgaW5zdGFuY2VzOiBpbnN0YW5jZXNcbiAgfVxufVxuIiwidmFyIFZBUklBQkxFX0NPVU5URVIgPSAwXG5cbmZ1bmN0aW9uIER5bmFtaWNWYXJpYWJsZSAoaXNGdW5jLCBkYXRhKSB7XG4gIHRoaXMuaWQgPSAoVkFSSUFCTEVfQ09VTlRFUisrKVxuICB0aGlzLmZ1bmMgPSBpc0Z1bmNcbiAgdGhpcy5kYXRhID0gZGF0YVxufVxuXG5mdW5jdGlvbiBkZWZpbmVEeW5hbWljIChkYXRhLCBwYXRoKSB7XG4gIHN3aXRjaCAodHlwZW9mIGRhdGEpIHtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICBjYXNlICdudW1iZXInOlxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gbmV3IER5bmFtaWNWYXJpYWJsZShmYWxzZSwgZGF0YSlcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gbmV3IER5bmFtaWNWYXJpYWJsZSh0cnVlLCBkYXRhKVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZGVmaW5lRHluYW1pY1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRHluYW1pYyAoeCkge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nICYmICF4Ll9yZWdsVHlwZSkgfHxcbiAgICAgICAgIHggaW5zdGFuY2VvZiBEeW5hbWljVmFyaWFibGVcbn1cblxuZnVuY3Rpb24gdW5ib3ggKHgsIHBhdGgpIHtcbiAgaWYgKHggaW5zdGFuY2VvZiBEeW5hbWljVmFyaWFibGUpIHtcbiAgICByZXR1cm4geFxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICAgeCAhPT0gZGVmaW5lRHluYW1pYykge1xuICAgIHJldHVybiBuZXcgRHluYW1pY1ZhcmlhYmxlKHRydWUsIHgpXG4gIH1cbiAgcmV0dXJuIG5ldyBEeW5hbWljVmFyaWFibGUoZmFsc2UsIHBhdGgpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWZpbmU6IGRlZmluZUR5bmFtaWMsXG4gIGlzRHluYW1pYzogaXNEeW5hbWljLFxuICB1bmJveDogdW5ib3hcbn1cbiIsInZhciBjaGVjayA9IHJlcXVpcmUoJy4vY2hlY2snKVxudmFyIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXMtdHlwZWQtYXJyYXknKVxudmFyIGlzTkRBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzLW5kYXJyYXknKVxudmFyIHByaW1UeXBlcyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzL3ByaW1pdGl2ZXMuanNvbicpXG5cbnZhciBHTF9QT0lOVFMgPSAwXG52YXIgR0xfTElORVMgPSAxXG52YXIgR0xfVFJJQU5HTEVTID0gNFxuXG52YXIgR0xfQllURSA9IDUxMjBcbnZhciBHTF9VTlNJR05FRF9CWVRFID0gNTEyMVxudmFyIEdMX1NIT1JUID0gNTEyMlxudmFyIEdMX1VOU0lHTkVEX1NIT1JUID0gNTEyM1xudmFyIEdMX0lOVCA9IDUxMjRcbnZhciBHTF9VTlNJR05FRF9JTlQgPSA1MTI1XG5cbnZhciBHTF9FTEVNRU5UX0FSUkFZX0JVRkZFUiA9IDM0OTYzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd3JhcEVsZW1lbnRzU3RhdGUgKGdsLCBleHRlbnNpb25zLCBidWZmZXJTdGF0ZSkge1xuICB2YXIgZWxlbWVudHMgPSBbIG51bGwgXVxuXG4gIGZ1bmN0aW9uIFJFR0xFbGVtZW50QnVmZmVyICgpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IG51bGxcbiAgICB0aGlzLnByaW1UeXBlID0gR0xfVFJJQU5HTEVTXG4gICAgdGhpcy52ZXJ0Q291bnQgPSAwXG4gICAgdGhpcy50eXBlID0gMFxuICB9XG5cbiAgUkVHTEVsZW1lbnRCdWZmZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5idWZmZXIuYmluZCgpXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50cyAob3B0aW9ucykge1xuICAgIHZhciBlbGVtZW50cyA9IG5ldyBSRUdMRWxlbWVudEJ1ZmZlcigpXG4gICAgdmFyIGJ1ZmZlciA9IGJ1ZmZlclN0YXRlLmNyZWF0ZShudWxsLCBHTF9FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdHJ1ZSlcbiAgICBlbGVtZW50cy5idWZmZXIgPSBidWZmZXIuX2J1ZmZlclxuXG4gICAgZnVuY3Rpb24gcmVnbEVsZW1lbnRzIChpbnB1dCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBpbnB1dFxuICAgICAgdmFyIGV4dDMyYml0ID0gZXh0ZW5zaW9ucy5vZXNfZWxlbWVudF9pbmRleF91aW50XG5cbiAgICAgIC8vIFVwbG9hZCBkYXRhIHRvIHZlcnRleCBidWZmZXJcbiAgICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICBidWZmZXIoKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYnVmZmVyKG9wdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGF0YSA9IG51bGxcbiAgICAgICAgdmFyIHVzYWdlID0gJ3N0YXRpYydcbiAgICAgICAgdmFyIGJ5dGVMZW5ndGggPSAwXG4gICAgICAgIGlmIChcbiAgICAgICAgICBBcnJheS5pc0FycmF5KG9wdGlvbnMpIHx8XG4gICAgICAgICAgaXNUeXBlZEFycmF5KG9wdGlvbnMpIHx8XG4gICAgICAgICAgaXNOREFycmF5TGlrZShvcHRpb25zKSkge1xuICAgICAgICAgIGRhdGEgPSBvcHRpb25zXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hlY2sudHlwZShvcHRpb25zLCAnb2JqZWN0JywgJ2ludmFsaWQgYXJndW1lbnRzIGZvciBlbGVtZW50cycpXG4gICAgICAgICAgaWYgKCdkYXRhJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBkYXRhID0gb3B0aW9ucy5kYXRhXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgndXNhZ2UnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHVzYWdlID0gb3B0aW9ucy51c2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJ2xlbmd0aCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgYnl0ZUxlbmd0aCA9IG9wdGlvbnMubGVuZ3RoXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpIHx8XG4gICAgICAgICAgICAoaXNOREFycmF5TGlrZShkYXRhKSAmJiBkYXRhLmR0eXBlID09PSAnYXJyYXknKSB8fFxuICAgICAgICAgICAgJ3R5cGUnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBidWZmZXIoe1xuICAgICAgICAgICAgdHlwZTogb3B0aW9ucy50eXBlIHx8XG4gICAgICAgICAgICAgIChleHQzMmJpdFxuICAgICAgICAgICAgICAgID8gJ3VpbnQzMidcbiAgICAgICAgICAgICAgICA6ICd1aW50MTYnKSxcbiAgICAgICAgICAgIHVzYWdlOiB1c2FnZSxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBsZW5ndGg6IGJ5dGVMZW5ndGhcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1ZmZlcih7XG4gICAgICAgICAgICB1c2FnZTogdXNhZ2UsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgbGVuZ3RoOiBieXRlTGVuZ3RoXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSB8fCBpc1R5cGVkQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICBidWZmZXIuZGltZW5zaW9uID0gM1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRyeSB0byBndWVzcyBkZWZhdWx0IHByaW1pdGl2ZSB0eXBlIGFuZCBhcmd1bWVudHNcbiAgICAgIHZhciB2ZXJ0Q291bnQgPSBlbGVtZW50cy5idWZmZXIuYnl0ZUxlbmd0aFxuICAgICAgdmFyIHR5cGUgPSAwXG4gICAgICBzd2l0Y2ggKGVsZW1lbnRzLmJ1ZmZlci5kdHlwZSkge1xuICAgICAgICBjYXNlIEdMX1VOU0lHTkVEX0JZVEU6XG4gICAgICAgIGNhc2UgR0xfQllURTpcbiAgICAgICAgICB0eXBlID0gR0xfVU5TSUdORURfQllURVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSBHTF9VTlNJR05FRF9TSE9SVDpcbiAgICAgICAgY2FzZSBHTF9TSE9SVDpcbiAgICAgICAgICB0eXBlID0gR0xfVU5TSUdORURfU0hPUlRcbiAgICAgICAgICB2ZXJ0Q291bnQgPj49IDFcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfVU5TSUdORURfSU5UOlxuICAgICAgICBjYXNlIEdMX0lOVDpcbiAgICAgICAgICBjaGVjayhleHQzMmJpdCwgJzMyIGJpdCBlbGVtZW50IGJ1ZmZlcnMgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgICAgdHlwZSA9IEdMX1VOU0lHTkVEX0lOVFxuICAgICAgICAgIHZlcnRDb3VudCA+Pj0gMlxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjaGVjay5yYWlzZSgnaW52YWxpZCBlbGVtZW50IGJ1ZmZlciB0eXBlJylcbiAgICAgIH1cblxuICAgICAgLy8gdHJ5IHRvIGd1ZXNzIHByaW1pdGl2ZSB0eXBlIGZyb20gY2VsbCBkaW1lbnNpb25cbiAgICAgIHZhciBwcmltVHlwZSA9IEdMX1RSSUFOR0xFU1xuICAgICAgdmFyIGRpbWVuc2lvbiA9IGVsZW1lbnRzLmJ1ZmZlci5kaW1lbnNpb25cbiAgICAgIGlmIChkaW1lbnNpb24gPT09IDEpIHByaW1UeXBlID0gR0xfUE9JTlRTXG4gICAgICBpZiAoZGltZW5zaW9uID09PSAyKSBwcmltVHlwZSA9IEdMX0xJTkVTXG4gICAgICBpZiAoZGltZW5zaW9uID09PSAzKSBwcmltVHlwZSA9IEdMX1RSSUFOR0xFU1xuXG4gICAgICAvLyBpZiBtYW51YWwgb3ZlcnJpZGUgcHJlc2VudCwgdXNlIHRoYXRcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKCdwcmltaXRpdmUnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgcHJpbWl0aXZlID0gb3B0aW9ucy5wcmltaXRpdmVcbiAgICAgICAgICBjaGVjay5wYXJhbWV0ZXIocHJpbWl0aXZlLCBwcmltVHlwZXMpXG4gICAgICAgICAgcHJpbVR5cGUgPSBwcmltVHlwZXNbcHJpbWl0aXZlXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb3VudCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHZlcnRDb3VudCA9IG9wdGlvbnMudmVydENvdW50IHwgMFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBwcm9wZXJ0aWVzIGZvciBlbGVtZW50IGJ1ZmZlclxuICAgICAgZWxlbWVudHMucHJpbVR5cGUgPSBwcmltVHlwZVxuICAgICAgZWxlbWVudHMudmVydENvdW50ID0gdmVydENvdW50XG4gICAgICBlbGVtZW50cy50eXBlID0gdHlwZVxuXG4gICAgICByZXR1cm4gcmVnbEVsZW1lbnRzXG4gICAgfVxuXG4gICAgcmVnbEVsZW1lbnRzKG9wdGlvbnMpXG5cbiAgICBPYmplY3QuYXNzaWduKHJlZ2xFbGVtZW50cywge1xuICAgICAgX3JlZ2xUeXBlOiAnZWxlbWVudHMnLFxuICAgICAgX2VsZW1lbnRzOiBlbGVtZW50cyxcbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hlY2soZWxlbWVudHMuYnVmZmVyICE9PSBudWxsLCAnbXVzdCBub3QgZG91YmxlIGRlc3Ryb3kgZWxlbWVudHMnKVxuICAgICAgICBidWZmZXIuZGVzdHJveSgpXG4gICAgICAgIGVsZW1lbnRzLmJ1ZmZlciA9IG51bGxcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlZ2xFbGVtZW50c1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGU6IGNyZWF0ZUVsZW1lbnRzLFxuICAgIGVsZW1lbnRzOiBlbGVtZW50cyxcbiAgICBnZXRFbGVtZW50czogZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICBpZiAoZWxlbWVudHMgJiYgZWxlbWVudHMuX2VsZW1lbnRzIGluc3RhbmNlb2YgUkVHTEVsZW1lbnRCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzLl9lbGVtZW50c1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXh0ZW5zaW9uQ2FjaGUgKGdsKSB7XG4gIHZhciBleHRlbnNpb25zID0ge31cblxuICBmdW5jdGlvbiByZWZyZXNoRXh0ZW5zaW9ucyAoKSB7XG4gICAgW1xuICAgICAgJ29lc190ZXh0dXJlX2Zsb2F0JyxcbiAgICAgICdvZXNfdGV4dHVyZV9mbG9hdF9saW5lYXInLFxuICAgICAgJ29lc190ZXh0dXJlX2hhbGZfZmxvYXQnLFxuICAgICAgJ29lc190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyJyxcbiAgICAgICdvZXNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJ29lc19lbGVtZW50X2luZGV4X3VpbnQnLFxuICAgICAgJ29lc19mYm9fcmVuZGVyX21pcG1hcCcsXG5cbiAgICAgICd3ZWJnbF9kZXB0aF90ZXh0dXJlJyxcbiAgICAgICd3ZWJnbF9kcmF3X2J1ZmZlcnMnLFxuICAgICAgJ3dlYmdsX2NvbG9yX2J1ZmZlcl9mbG9hdCcsXG5cbiAgICAgICdleHRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMnLFxuICAgICAgJ2V4dF9mcmFnX2RlcHRoJyxcbiAgICAgICdleHRfYmxlbmRfbWlubWF4JyxcbiAgICAgICdleHRfc2hhZGVyX3RleHR1cmVfbG9kJyxcbiAgICAgICdleHRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQnLFxuICAgICAgJ2V4dF9zcmdiJyxcblxuICAgICAgJ2FuZ2xlX2luc3RhbmNlZF9hcnJheXMnLFxuXG4gICAgICAnd2ViZ2xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMnLFxuICAgICAgJ3dlYmdsX2NvbXByZXNzZWRfdGV4dHVyZV9hdGMnLFxuICAgICAgJ3dlYmdsX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YycsXG4gICAgICAnd2ViZ2xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnXG4gICAgXS5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4dGVuc2lvbnNbZXh0XSA9IGdsLmdldEV4dGVuc2lvbihleHQpXG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH0pXG4gIH1cblxuICByZWZyZXNoRXh0ZW5zaW9ucygpXG5cbiAgcmV0dXJuIHtcbiAgICBleHRlbnNpb25zOiBleHRlbnNpb25zLFxuICAgIHJlZnJlc2g6IHJlZnJlc2hFeHRlbnNpb25zXG4gIH1cbn1cbiIsInZhciBjaGVjayA9IHJlcXVpcmUoJy4vY2hlY2snKVxudmFyIHZhbHVlcyA9IHJlcXVpcmUoJy4vdmFsdWVzJylcblxuLy8gV2Ugc3RvcmUgdGhlc2UgY29uc3RhbnRzIHNvIHRoYXQgdGhlIG1pbmlmaWVyIGNhbiBpbmxpbmUgdGhlbVxudmFyIEdMX0ZSQU1FQlVGRkVSID0gMHg4RDQwXG52YXIgR0xfUkVOREVSQlVGRkVSID0gMHg4RDQxXG5cbnZhciBHTF9URVhUVVJFXzJEID0gMHgwREUxXG52YXIgR0xfVEVYVFVSRV9DVUJFX01BUCA9IDB4ODUxM1xudmFyIEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCA9IDB4ODUxNVxuXG52YXIgR0xfQ09MT1JfQVRUQUNITUVOVDAgPSAweDhDRTBcbnZhciBHTF9ERVBUSF9BVFRBQ0hNRU5UID0gMHg4RDAwXG52YXIgR0xfU1RFTkNJTF9BVFRBQ0hNRU5UID0gMHg4RDIwXG52YXIgR0xfREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UID0gMHg4MjFBXG5cbnZhciBHTF9VTlNJR05FRF9CWVRFID0gMHgxNDAxXG52YXIgR0xfRkxPQVQgPSAweDE0MDZcblxudmFyIEdMX0hBTEZfRkxPQVRfT0VTID0gMHg4RDYxXG5cbnZhciBHTF9BTFBIQSA9IDB4MTkwNlxudmFyIEdMX0xVTUlOQU5DRSA9IDB4MTkwOVxudmFyIEdMX0xVTUlOQU5DRV9BTFBIQSA9IDB4MTkwQVxudmFyIEdMX1JHQiA9IDB4MTkwN1xudmFyIEdMX1JHQkEgPSAweDE5MDhcblxudmFyIEdMX1JHQkE0ID0gMHg4MDU2XG52YXIgR0xfUkdCNV9BMSA9IDB4ODA1N1xudmFyIEdMX1JHQjU2NSA9IDB4OEQ2MlxudmFyIEdMX0RFUFRIX0NPTVBPTkVOVDE2ID0gMHg4MUE1XG52YXIgR0xfU1RFTkNJTF9JTkRFWDggPSAweDhENDhcblxudmFyIEdMX0RFUFRIX0NPTVBPTkVOVCA9IDB4MTkwMlxudmFyIEdMX0RFUFRIX1NURU5DSUwgPSAweDg0RjlcblxudmFyIEdMX1NSR0I4X0FMUEhBOF9FWFQgPSAweDhDNDNcblxudmFyIEdMX1JHQkEzMkZfRVhUID0gMHg4ODE0XG5cbnZhciBHTF9SR0JBMTZGX0VYVCA9IDB4ODgxQVxudmFyIEdMX1JHQjE2Rl9FWFQgPSAweDg4MUJcblxudmFyIEdMX0ZSQU1FQlVGRkVSX0NPTVBMRVRFID0gMHg4Q0Q1XG52YXIgR0xfRlJBTUVCVUZGRVJfSU5DT01QTEVURV9BVFRBQ0hNRU5UID0gMHg4Q0Q2XG52YXIgR0xfRlJBTUVCVUZGRVJfSU5DT01QTEVURV9NSVNTSU5HX0FUVEFDSE1FTlQgPSAweDhDRDdcbnZhciBHTF9GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0RJTUVOU0lPTlMgPSAweDhDRDlcbnZhciBHTF9GUkFNRUJVRkZFUl9VTlNVUFBPUlRFRCA9IDB4OENERFxuXG52YXIgR0xfQkFDSyA9IDEwMjlcblxudmFyIEJBQ0tfQlVGRkVSID0gW0dMX0JBQ0tdXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd3JhcEZCT1N0YXRlIChcbiAgZ2wsXG4gIGV4dGVuc2lvbnMsXG4gIGxpbWl0cyxcbiAgdGV4dHVyZVN0YXRlLFxuICByZW5kZXJidWZmZXJTdGF0ZSkge1xuICB2YXIgc3RhdHVzQ29kZSA9IHt9XG4gIHN0YXR1c0NvZGVbR0xfRlJBTUVCVUZGRVJfQ09NUExFVEVdID0gJ2NvbXBsZXRlJ1xuICBzdGF0dXNDb2RlW0dMX0ZSQU1FQlVGRkVSX0lOQ09NUExFVEVfQVRUQUNITUVOVF0gPSAnaW5jb21wbGV0ZSBhdHRhY2htZW50J1xuICBzdGF0dXNDb2RlW0dMX0ZSQU1FQlVGRkVSX0lOQ09NUExFVEVfRElNRU5TSU9OU10gPSAnaW5jb21wbGV0ZSBkaW1lbnNpb25zJ1xuICBzdGF0dXNDb2RlW0dMX0ZSQU1FQlVGRkVSX0lOQ09NUExFVEVfTUlTU0lOR19BVFRBQ0hNRU5UXSA9ICdpbmNvbXBsZXRlLCBtaXNzaW5nIGF0dGFjaG1lbnQnXG4gIHN0YXR1c0NvZGVbR0xfRlJBTUVCVUZGRVJfVU5TVVBQT1JURURdID0gJ3Vuc3VwcG9ydGVkJ1xuXG4gIHZhciBjb2xvclRleHR1cmVGb3JtYXRzID0ge1xuICAgICdyZ2JhJzogR0xfUkdCQVxuICB9XG5cbiAgdmFyIGNvbG9yUmVuZGVyYnVmZmVyRm9ybWF0cyA9IHtcbiAgICAncmdiYTQnOiBHTF9SR0JBNCxcbiAgICAncmdiNTY1JzogR0xfUkdCNTY1LFxuICAgICdyZ2I1IGExJzogR0xfUkdCNV9BMVxuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMuZXh0X3NyZ2IpIHtcbiAgICBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdHNbJ3NyZ2JhJ10gPSBHTF9TUkdCOF9BTFBIQThfRVhUXG4gIH1cblxuICBpZiAoZXh0ZW5zaW9ucy5leHRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQpIHtcbiAgICBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdHNbJ3JnYmExNmYnXSA9IEdMX1JHQkExNkZfRVhUXG4gICAgY29sb3JSZW5kZXJidWZmZXJGb3JtYXRzWydyZ2IxNmYnXSA9IEdMX1JHQjE2Rl9FWFRcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2NvbG9yX2J1ZmZlcl9mbG9hdCkge1xuICAgIGNvbG9yUmVuZGVyYnVmZmVyRm9ybWF0c1sncmdiYTMyZiddID0gR0xfUkdCQTMyRl9FWFRcbiAgfVxuXG4gIHZhciBkZXB0aFJlbmRlcmJ1ZmZlckZvcm1hdEVudW1zID0gW0dMX0RFUFRIX0NPTVBPTkVOVDE2XVxuICB2YXIgc3RlbmNpbFJlbmRlcmJ1ZmZlckZvcm1hdEVudW1zID0gW0dMX1NURU5DSUxfSU5ERVg4XVxuICB2YXIgZGVwdGhTdGVuY2lsUmVuZGVyYnVmZmVyRm9ybWF0RW51bXMgPSBbR0xfREVQVEhfU1RFTkNJTF1cblxuICB2YXIgZGVwdGhUZXh0dXJlRm9ybWF0RW51bXMgPSBbXVxuICB2YXIgc3RlbmNpbFRleHR1cmVGb3JtYXRFbnVtcyA9IFtdXG4gIHZhciBkZXB0aFN0ZW5jaWxUZXh0dXJlRm9ybWF0RW51bXMgPSBbXVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2RlcHRoX3RleHR1cmUpIHtcbiAgICBkZXB0aFRleHR1cmVGb3JtYXRFbnVtcy5wdXNoKEdMX0RFUFRIX0NPTVBPTkVOVClcbiAgICBkZXB0aFN0ZW5jaWxUZXh0dXJlRm9ybWF0RW51bXMucHVzaChHTF9ERVBUSF9TVEVOQ0lMKVxuICB9XG5cbiAgdmFyIGNvbG9yRm9ybWF0cyA9IE9iamVjdC5hc3NpZ24oe30sXG4gICAgY29sb3JUZXh0dXJlRm9ybWF0cyxcbiAgICBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdHMpXG5cbiAgdmFyIGNvbG9yVGV4dHVyZUZvcm1hdEVudW1zID0gdmFsdWVzKGNvbG9yVGV4dHVyZUZvcm1hdHMpXG4gIHZhciBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdEVudW1zID0gdmFsdWVzKGNvbG9yUmVuZGVyYnVmZmVyRm9ybWF0cylcblxuICB2YXIgaGlnaGVzdFByZWNpc2lvbiA9IEdMX1VOU0lHTkVEX0JZVEVcbiAgdmFyIGNvbG9yVHlwZXMgPSB7XG4gICAgJ3VpbnQ4JzogR0xfVU5TSUdORURfQllURVxuICB9XG4gIGlmIChleHRlbnNpb25zLm9lc190ZXh0dXJlX2hhbGZfZmxvYXQpIHtcbiAgICBoaWdoZXN0UHJlY2lzaW9uID0gY29sb3JUeXBlc1snaGFsZiBmbG9hdCddID0gR0xfSEFMRl9GTE9BVF9PRVNcbiAgfVxuICBpZiAoZXh0ZW5zaW9ucy5vZXNfdGV4dHVyZV9mbG9hdCkge1xuICAgIGhpZ2hlc3RQcmVjaXNpb24gPSBjb2xvclR5cGVzLmZsb2F0ID0gR0xfRkxPQVRcbiAgfVxuICBjb2xvclR5cGVzLmJlc3QgPSBoaWdoZXN0UHJlY2lzaW9uXG5cbiAgdmFyIERSQVdfQlVGRkVSUyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheShsaW1pdHMubWF4RHJhd2J1ZmZlcnMpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gbGltaXRzLm1heERyYXdidWZmZXJzOyArK2kpIHtcbiAgICAgIHZhciByb3cgPSByZXN1bHRbaV0gPSBuZXcgQXJyYXkoaSlcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgKytqKSB7XG4gICAgICAgIHJvd1tqXSA9IEdMX0NPTE9SX0FUVEFDSE1FTlQwICsgalxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0pKClcblxuICBmdW5jdGlvbiBGcmFtZWJ1ZmZlckF0dGFjaG1lbnQgKHRhcmdldCwgbGV2ZWwsIHRleHR1cmUsIHJlbmRlcmJ1ZmZlcikge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsXG4gICAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZVxuICAgIHRoaXMucmVuZGVyYnVmZmVyID0gcmVuZGVyYnVmZmVyXG4gIH1cblxuICBmdW5jdGlvbiBkZWNSZWYgKGF0dGFjaG1lbnQpIHtcbiAgICBpZiAoYXR0YWNobWVudCkge1xuICAgICAgaWYgKGF0dGFjaG1lbnQudGV4dHVyZSkge1xuICAgICAgICBhdHRhY2htZW50LnRleHR1cmUuX3RleHR1cmUuZGVjUmVmKClcbiAgICAgIH1cbiAgICAgIGlmIChhdHRhY2htZW50LnJlbmRlcmJ1ZmZlcikge1xuICAgICAgICBhdHRhY2htZW50LnJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyLmRlY1JlZigpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tGb3JtYXQgKGF0dGFjaG1lbnQsIHRleEZvcm1hdHMsIHJiRm9ybWF0cykge1xuICAgIGlmIChhdHRhY2htZW50LnRleHR1cmUpIHtcbiAgICAgIGNoZWNrLm9uZU9mKGF0dGFjaG1lbnQudGV4dHVyZS5fdGV4dHVyZS5wYXJhbXMuaW50ZXJuYWxmb3JtYXQsIHRleEZvcm1hdHMsXG4gICAgICAgICd1bnN1cHBvcnRlZCB0ZXh0dXJlIGZvcm1hdCBmb3IgYXR0YWNobWVudCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNoZWNrLm9uZU9mKGF0dGFjaG1lbnQucmVuZGVyYnVmZmVyLl9yZW5kZXJidWZmZXIuZm9ybWF0LCByYkZvcm1hdHMsXG4gICAgICAgICd1bnN1cHBvcnRlZCByZW5kZXJidWZmZXIgZm9ybWF0IGZvciBhdHRhY2htZW50JylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbmNSZWZBbmRDaGVja1NoYXBlIChhdHRhY2htZW50LCBmcmFtZWJ1ZmZlcikge1xuICAgIHZhciB3aWR0aCA9IGZyYW1lYnVmZmVyLndpZHRoXG4gICAgdmFyIGhlaWdodCA9IGZyYW1lYnVmZmVyLmhlaWdodFxuICAgIGlmIChhdHRhY2htZW50LnRleHR1cmUpIHtcbiAgICAgIHZhciB0ZXh0dXJlID0gYXR0YWNobWVudC50ZXh0dXJlLl90ZXh0dXJlXG4gICAgICB2YXIgdHcgPSBNYXRoLm1heCgxLCB0ZXh0dXJlLnBhcmFtcy53aWR0aCA+PiBhdHRhY2htZW50LmxldmVsKVxuICAgICAgdmFyIHRoID0gTWF0aC5tYXgoMSwgdGV4dHVyZS5wYXJhbXMuaGVpZ2h0ID4+IGF0dGFjaG1lbnQubGV2ZWwpXG4gICAgICB3aWR0aCA9IHdpZHRoIHx8IHR3XG4gICAgICBoZWlnaHQgPSBoZWlnaHQgfHwgdGhcbiAgICAgIGNoZWNrKHR3ID09PSB3aWR0aCAmJiB0aCA9PT0gaGVpZ2h0LFxuICAgICAgICAnaW5jb25zaXN0ZW50IHdpZHRoL2hlaWdodCBmb3Igc3VwcGxpZWQgdGV4dHVyZScpXG4gICAgICBjaGVjayh0ZXh0dXJlLnBvbGxJZCA8IDAsXG4gICAgICAgICdwb2xsaW5nIGZibyB0ZXh0dXJlcyBub3Qgc3VwcG9ydGVkJylcbiAgICAgIHRleHR1cmUucmVmQ291bnQgKz0gMVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVuZGVyYnVmZmVyID0gYXR0YWNobWVudC5yZW5kZXJidWZmZXIuX3JlbmRlcmJ1ZmZlclxuICAgICAgd2lkdGggPSB3aWR0aCB8fCByZW5kZXJidWZmZXIud2lkdGhcbiAgICAgIGhlaWdodCA9IGhlaWdodCB8fCByZW5kZXJidWZmZXIuaGVpZ2h0XG4gICAgICBjaGVjayhcbiAgICAgICAgcmVuZGVyYnVmZmVyLndpZHRoID09PSB3aWR0aCAmJiByZW5kZXJidWZmZXIuaGVpZ2h0ID09PSBoZWlnaHQsXG4gICAgICAgICdpbmNvbnNpc3RlbnQgd2lkdGgvaGVpZ2h0IGZvciByZW5kZXJidWZmZXInKVxuICAgICAgY2hlY2soXG4gICAgICAgIGNvbG9yUmVuZGVyYnVmZmVyRm9ybWF0RW51bXMuaW5kZXhPZihyZW5kZXJidWZmZXIuZm9ybWF0KSA+PSAwLFxuICAgICAgICAncmVuZGVyYnVmZmVyIGZvcm1hdCBub3QgY29tcGF0aWJsZSB3aXRoIGNvbG9yIGNoYW5uZWxzJylcbiAgICAgIHJlbmRlcmJ1ZmZlci5yZWZDb3VudCArPSAxXG4gICAgfVxuICAgIGZyYW1lYnVmZmVyLndpZHRoID0gd2lkdGhcbiAgICBmcmFtZWJ1ZmZlci5oZWlnaHQgPSBoZWlnaHRcbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFjaCAobG9jYXRpb24sIGF0dGFjaG1lbnQpIHtcbiAgICBpZiAoYXR0YWNobWVudCkge1xuICAgICAgaWYgKGF0dGFjaG1lbnQudGV4dHVyZSkge1xuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgICAgICBHTF9GUkFNRUJVRkZFUixcbiAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICBhdHRhY2htZW50LnRhcmdldCxcbiAgICAgICAgICBhdHRhY2htZW50LnRleHR1cmUuX3RleHR1cmUudGV4dHVyZSxcbiAgICAgICAgICBhdHRhY2htZW50LmxldmVsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoXG4gICAgICAgICAgR0xfRlJBTUVCVUZGRVIsXG4gICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgR0xfUkVOREVSQlVGRkVSLFxuICAgICAgICAgIGF0dGFjaG1lbnQucmVuZGVyYnVmZmVyLl9yZW5kZXJidWZmZXIucmVuZGVyYnVmZmVyKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgICAgR0xfRlJBTUVCVUZGRVIsXG4gICAgICAgIGxvY2F0aW9uLFxuICAgICAgICBHTF9URVhUVVJFXzJELFxuICAgICAgICBudWxsLFxuICAgICAgICAwKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRyeVVwZGF0ZUF0dGFjaG1lbnQgKFxuICAgIGF0dGFjaG1lbnQsXG4gICAgaXNUZXh0dXJlLFxuICAgIGZvcm1hdCxcbiAgICB0eXBlLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCkge1xuICAgIGlmIChhdHRhY2htZW50LnRleHR1cmUpIHtcbiAgICAgIHZhciB0ZXh0dXJlID0gYXR0YWNobWVudC50ZXh0dXJlXG4gICAgICBpZiAoaXNUZXh0dXJlKSB7XG4gICAgICAgIHRleHR1cmUoe1xuICAgICAgICAgIGZvcm1hdDogZm9ybWF0LFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgIH0pXG4gICAgICAgIHRleHR1cmUuX3RleHR1cmUucmVmQ291bnQgKz0gMVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVuZGVyYnVmZmVyID0gYXR0YWNobWVudC5yZW5kZXJidWZmZXJcbiAgICAgIGlmICghaXNUZXh0dXJlKSB7XG4gICAgICAgIHJlbmRlcmJ1ZmZlcih7XG4gICAgICAgICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyLnJlZkNvdW50ICs9IDFcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgZGVjUmVmKGF0dGFjaG1lbnQpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUF0dGFjaG1lbnQgKGF0dGFjaG1lbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gR0xfVEVYVFVSRV8yRFxuICAgIHZhciBsZXZlbCA9IDBcbiAgICB2YXIgdGV4dHVyZSA9IG51bGxcbiAgICB2YXIgcmVuZGVyYnVmZmVyID0gbnVsbFxuXG4gICAgdmFyIGRhdGEgPSBhdHRhY2htZW50XG4gICAgaWYgKHR5cGVvZiBhdHRhY2htZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgZGF0YSA9IGF0dGFjaG1lbnQuZGF0YVxuICAgICAgaWYgKCdsZXZlbCcgaW4gYXR0YWNobWVudCkge1xuICAgICAgICBsZXZlbCA9IGF0dGFjaG1lbnQubGV2ZWwgfCAwXG4gICAgICB9XG4gICAgICBpZiAoJ3RhcmdldCcgaW4gYXR0YWNobWVudCkge1xuICAgICAgICB0YXJnZXQgPSBhdHRhY2htZW50LnRhcmdldCB8IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVjay50eXBlKGRhdGEsICdmdW5jdGlvbicsICdpbnZhbGlkIGF0dGFjaG1lbnQgZGF0YScpXG5cbiAgICB2YXIgdHlwZSA9IGF0dGFjaG1lbnQuX3JlZ2xUeXBlXG4gICAgaWYgKHR5cGUgPT09ICd0ZXh0dXJlJykge1xuICAgICAgdGV4dHVyZSA9IGF0dGFjaG1lbnRcbiAgICAgIGlmICh0ZXh0dXJlLl90ZXh0dXJlLnRhcmdldCA9PT0gR0xfVEVYVFVSRV9DVUJFX01BUCkge1xuICAgICAgICBjaGVjayhcbiAgICAgICAgICB0YXJnZXQgPj0gR0xfVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICYmXG4gICAgICAgICAgdGFyZ2V0IDwgR0xfVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICsgNixcbiAgICAgICAgICAnaW52YWxpZCBjdWJlIG1hcCB0YXJnZXQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2sodGFyZ2V0ID09PSBHTF9URVhUVVJFXzJEKVxuICAgICAgfVxuICAgICAgLy8gVE9ETyBjaGVjayBtaXBsZXZlbCBpcyBjb25zaXN0ZW50XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAncmVuZGVyYnVmZmVyJykge1xuICAgICAgcmVuZGVyYnVmZmVyID0gYXR0YWNobWVudFxuICAgICAgdGFyZ2V0ID0gR0xfUkVOREVSQlVGRkVSXG4gICAgICBsZXZlbCA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgY2hlY2sucmFpc2UoJ2ludmFsaWQgcmVnbCBvYmplY3QgZm9yIGF0dGFjaG1lbnQnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgRnJhbWVidWZmZXJBdHRhY2htZW50KHRhcmdldCwgbGV2ZWwsIHRleHR1cmUsIHJlbmRlcmJ1ZmZlcilcbiAgfVxuXG4gIGZ1bmN0aW9uIHVud3JhcEF0dGFjaG1lbnQgKGF0dGFjaG1lbnQpIHtcbiAgICByZXR1cm4gYXR0YWNobWVudCAmJiAoYXR0YWNobWVudC50ZXh0dXJlIHx8IGF0dGFjaG1lbnQucmVuZGVyYnVmZmVyKVxuICB9XG5cbiAgdmFyIGZyYW1lYnVmZmVyQ291bnQgPSAwXG4gIHZhciBmcmFtZWJ1ZmZlclNldCA9IHt9XG4gIHZhciBmcmFtZWJ1ZmZlclN0YWNrID0gW251bGxdXG4gIHZhciBmcmFtZWJ1ZmZlckRpcnR5ID0gdHJ1ZVxuXG4gIGZ1bmN0aW9uIFJFR0xGcmFtZWJ1ZmZlciAoKSB7XG4gICAgdGhpcy5pZCA9IGZyYW1lYnVmZmVyQ291bnQrK1xuICAgIGZyYW1lYnVmZmVyU2V0W3RoaXMuaWRdID0gdGhpc1xuXG4gICAgdGhpcy5mcmFtZWJ1ZmZlciA9IG51bGxcbiAgICB0aGlzLndpZHRoID0gMFxuICAgIHRoaXMuaGVpZ2h0ID0gMFxuXG4gICAgdGhpcy5jb2xvckF0dGFjaG1lbnRzID0gW11cbiAgICB0aGlzLmRlcHRoQXR0YWNobWVudCA9IG51bGxcbiAgICB0aGlzLnN0ZW5jaWxBdHRhY2htZW50ID0gbnVsbFxuICAgIHRoaXMuZGVwdGhTdGVuY2lsQXR0YWNobWVudCA9IG51bGxcblxuICAgIHRoaXMub3duc0NvbG9yID0gZmFsc2VcbiAgICB0aGlzLm93bnNEZXB0aFN0ZW5jaWwgPSBmYWxzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVmcmVzaCAoZnJhbWVidWZmZXIpIHtcbiAgICBpZiAoIWdsLmlzRnJhbWVidWZmZXIoZnJhbWVidWZmZXIuZnJhbWVidWZmZXIpKSB7XG4gICAgICBmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKClcbiAgICB9XG4gICAgZnJhbWVidWZmZXJEaXJ0eSA9IHRydWVcbiAgICBnbC5iaW5kRnJhbWVidWZmZXIoR0xfRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyKVxuXG4gICAgdmFyIGNvbG9yQXR0YWNobWVudHMgPSBmcmFtZWJ1ZmZlci5jb2xvckF0dGFjaG1lbnRzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xvckF0dGFjaG1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBhdHRhY2goR0xfQ09MT1JfQVRUQUNITUVOVDAgKyBpLCBjb2xvckF0dGFjaG1lbnRzW2ldKVxuICAgIH1cbiAgICBmb3IgKGkgPSBjb2xvckF0dGFjaG1lbnRzLmxlbmd0aDsgaSA8IGxpbWl0cy5tYXhDb2xvckF0dGFjaG1lbnRzOyArK2kpIHtcbiAgICAgIGF0dGFjaChHTF9DT0xPUl9BVFRBQ0hNRU5UMCArIGksIG51bGwpXG4gICAgfVxuICAgIGF0dGFjaChHTF9ERVBUSF9BVFRBQ0hNRU5ULCBmcmFtZWJ1ZmZlci5kZXB0aEF0dGFjaG1lbnQpXG4gICAgYXR0YWNoKEdMX1NURU5DSUxfQVRUQUNITUVOVCwgZnJhbWVidWZmZXIuc3RlbmNpbEF0dGFjaG1lbnQpXG4gICAgYXR0YWNoKEdMX0RFUFRIX1NURU5DSUxfQVRUQUNITUVOVCwgZnJhbWVidWZmZXIuZGVwdGhTdGVuY2lsQXR0YWNobWVudClcblxuICAgIGlmIChleHRlbnNpb25zLndlYmdsX2RyYXdfYnVmZmVycykge1xuICAgICAgZXh0ZW5zaW9ucy53ZWJnbF9kcmF3X2J1ZmZlcnMuZHJhd0J1ZmZlcnNXRUJHTChcbiAgICAgICAgRFJBV19CVUZGRVJTW2NvbG9yQXR0YWNobWVudHMubGVuZ3RoXSlcbiAgICB9XG5cbiAgICAvLyBDaGVjayBzdGF0dXMgY29kZVxuICAgIHZhciBzdGF0dXMgPSBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKEdMX0ZSQU1FQlVGRkVSKVxuICAgIGlmIChzdGF0dXMgIT09IEdMX0ZSQU1FQlVGRkVSX0NPTVBMRVRFKSB7XG4gICAgICBjaGVjay5yYWlzZSgnZnJhbWVidWZmZXIgY29uZmlndXJhdGlvbiBub3Qgc3VwcG9ydGVkLCBzdGF0dXMgPSAnICtcbiAgICAgICAgc3RhdHVzQ29kZVtzdGF0dXNdKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY0ZCT1JlZnMgKGZyYW1lYnVmZmVyKSB7XG4gICAgZnJhbWVidWZmZXIuY29sb3JBdHRhY2htZW50cy5mb3JFYWNoKGRlY1JlZilcbiAgICBkZWNSZWYoZnJhbWVidWZmZXIuZGVwdGhBdHRhY2htZW50KVxuICAgIGRlY1JlZihmcmFtZWJ1ZmZlci5zdGVuY2lsQXR0YWNobWVudClcbiAgICBkZWNSZWYoZnJhbWVidWZmZXIuZGVwdGhTdGVuY2lsQXR0YWNobWVudClcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3kgKGZyYW1lYnVmZmVyKSB7XG4gICAgdmFyIGhhbmRsZSA9IGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyXG4gICAgY2hlY2soaGFuZGxlLCAnbXVzdCBub3QgZG91YmxlIGRlc3Ryb3kgZnJhbWVidWZmZXInKVxuICAgIGlmIChnbC5pc0ZyYW1lYnVmZmVyKGhhbmRsZSkpIHtcbiAgICAgIGdsLmRlbGV0ZUZyYW1lYnVmZmVyKGhhbmRsZSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGQk8gKG9wdGlvbnMpIHtcbiAgICB2YXIgZnJhbWVidWZmZXIgPSBuZXcgUkVHTEZyYW1lYnVmZmVyKClcblxuICAgIGZ1bmN0aW9uIHJlZ2xGcmFtZWJ1ZmZlciAoaW5wdXQpIHtcbiAgICAgIHZhciBpXG4gICAgICB2YXIgb3B0aW9ucyA9IGlucHV0IHx8IHt9XG5cbiAgICAgIHZhciBleHREcmF3QnVmZmVycyA9IGV4dGVuc2lvbnMud2ViZ2xfZHJhd19idWZmZXJzXG5cbiAgICAgIHZhciB3aWR0aCA9IDBcbiAgICAgIHZhciBoZWlnaHQgPSAwXG4gICAgICBpZiAoJ3NoYXBlJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzaGFwZSA9IG9wdGlvbnMuc2hhcGVcbiAgICAgICAgY2hlY2soQXJyYXkuaXNBcnJheShzaGFwZSkgJiYgc2hhcGUubGVuZ3RoID49IDIsXG4gICAgICAgICAgJ2ludmFsaWQgc2hhcGUgZm9yIGZyYW1lYnVmZmVyJylcbiAgICAgICAgd2lkdGggPSBzaGFwZVswXVxuICAgICAgICBoZWlnaHQgPSBzaGFwZVsxXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCdyYWRpdXMnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCA9IG9wdGlvbnMucmFkaXVzXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCd3aWR0aCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHdpZHRoID0gb3B0aW9ucy53aWR0aFxuICAgICAgICB9XG4gICAgICAgIGlmICgnaGVpZ2h0JyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjb2xvclR5cGUsIG51bUNvbG9yc1xuICAgICAgdmFyIGNvbG9yQnVmZmVycyA9IG51bGxcbiAgICAgIHZhciBvd25zQ29sb3IgPSBmYWxzZVxuICAgICAgaWYgKCdjb2xvckJ1ZmZlcnMnIGluIG9wdGlvbnMgfHwgJ2NvbG9yQnVmZmVyJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIHZhciBjb2xvcklucHV0cyA9IG9wdGlvbnMuY29sb3JCdWZmZXJzIHx8IG9wdGlvbnMuY29sb3JCdWZmZXJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbG9ySW5wdXRzKSkge1xuICAgICAgICAgIGNvbG9ySW5wdXRzID0gW2NvbG9ySW5wdXRzXVxuICAgICAgICB9XG5cbiAgICAgICAgZnJhbWVidWZmZXIud2lkdGggPSB3aWR0aFxuICAgICAgICBmcmFtZWJ1ZmZlci5oZWlnaHQgPSBoZWlnaHRcblxuICAgICAgICBpZiAoY29sb3JJbnB1dHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGNoZWNrKGV4dERyYXdCdWZmZXJzLCAnbXVsdGlwbGUgcmVuZGVyIHRhcmdldHMgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgIH1cbiAgICAgICAgY2hlY2soY29sb3JJbnB1dHMubGVuZ3RoID49IDAsXG4gICAgICAgICAgJ211c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgY29sb3IgYXR0YWNobWVudCcpXG5cbiAgICAgICAgLy8gV3JhcCBjb2xvciBhdHRhY2htZW50c1xuICAgICAgICBjb2xvckJ1ZmZlcnMgPSBjb2xvcklucHV0cy5tYXAocGFyc2VBdHRhY2htZW50KVxuXG4gICAgICAgIC8vIENoZWNrIGhlYWQgbm9kZVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sb3JCdWZmZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgdmFyIGNvbG9yQXR0YWNobWVudCA9IGNvbG9yQnVmZmVyc1tpXVxuICAgICAgICAgIGNoZWNrRm9ybWF0KFxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50LFxuICAgICAgICAgICAgY29sb3JUZXh0dXJlRm9ybWF0RW51bXMsXG4gICAgICAgICAgICBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdEVudW1zKVxuICAgICAgICAgIGluY1JlZkFuZENoZWNrU2hhcGUoXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQsXG4gICAgICAgICAgICBmcmFtZWJ1ZmZlcilcbiAgICAgICAgfVxuXG4gICAgICAgIHdpZHRoID0gZnJhbWVidWZmZXIud2lkdGhcbiAgICAgICAgaGVpZ2h0ID0gZnJhbWVidWZmZXIuaGVpZ2h0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY29sb3JUZXh0dXJlID0gdHJ1ZVxuICAgICAgICB2YXIgY29sb3JGb3JtYXQgPSAncmdiYSdcbiAgICAgICAgdmFyIGNvbG9yVHlwZSA9ICd1aW50OCdcbiAgICAgICAgdmFyIGNvbG9yQ291bnQgPSAxXG4gICAgICAgIG93bnNDb2xvciA9IHRydWVcblxuICAgICAgICBmcmFtZWJ1ZmZlci53aWR0aCA9IHdpZHRoIHx8IGdsLmRyYXdpbmdCdWZmZXJXaWR0aFxuICAgICAgICBmcmFtZWJ1ZmZlci5oZWlnaHQgPSBoZWlnaHQgfHwgZ2wuZHJhd2luZ0J1ZmZlckhlaWdodFxuXG4gICAgICAgIGlmICgnZm9ybWF0JyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgY29sb3JGb3JtYXQgPSBvcHRpb25zLmZvcm1hdFxuICAgICAgICAgIGNoZWNrLnBhcmFtZXRlcihjb2xvckZvcm1hdCwgY29sb3JGb3JtYXRzLCAnaW52YWxpZCBjb2xvciBmb3JtYXQnKVxuICAgICAgICAgIGNvbG9yVGV4dHVyZSA9IGNvbG9yRm9ybWF0IGluIGNvbG9yVGV4dHVyZUZvcm1hdHNcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgndHlwZScgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGNoZWNrKGNvbG9yVGV4dHVyZSxcbiAgICAgICAgICAgICdjb2xvclR5cGUgY2FuIG5vdCBiZSBzZXQgZm9yIHJlbmRlcmJ1ZmZlciB0YXJnZXRzJylcbiAgICAgICAgICBjb2xvclR5cGUgPSBvcHRpb25zLnR5cGVcbiAgICAgICAgICBjaGVjay5wYXJhbWV0ZXIoY29sb3JUeXBlLCBjb2xvclR5cGVzLCAnaW52YWxpZCBjb2xvciB0eXBlJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29sb3JDb3VudCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGNvbG9yQ291bnQgPSBvcHRpb25zLmNvbG9yQ291bnQgfCAwXG4gICAgICAgICAgY2hlY2soY29sb3JDb3VudCA+PSAwLCAnY29sb3IgY291bnQgbXVzdCBiZSBwb3NpdGl2ZScpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXVzZSBjb2xvciBidWZmZXIgYXJyYXkgaWYgd2Ugb3duIGl0XG4gICAgICAgIGlmIChmcmFtZWJ1ZmZlci5vd25zQ29sb3IpIHtcbiAgICAgICAgICBjb2xvckJ1ZmZlcnMgPSBmcmFtZWJ1ZmZlci5jb2xvckF0dGFjaG1lbnRzXG4gICAgICAgICAgd2hpbGUgKGNvbG9yQnVmZmVycy5sZW5ndGggPiBjb2xvckNvdW50KSB7XG4gICAgICAgICAgICBkZWNSZWYoY29sb3JCdWZmZXJzLnBvcCgpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2xvckJ1ZmZlcnMgPSBbXVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIGJ1ZmZlcnMgaW4gcGxhY2UsIHJlbW92ZSBpbmNvbXBhdGlibGUgYnVmZmVyc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sb3JCdWZmZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKCF0cnlVcGRhdGVBdHRhY2htZW50KFxuICAgICAgICAgICAgICBjb2xvckJ1ZmZlcnNbaV0sXG4gICAgICAgICAgICAgIGNvbG9yVGV4dHVyZSxcbiAgICAgICAgICAgICAgY29sb3JGb3JtYXQsXG4gICAgICAgICAgICAgIGNvbG9yVHlwZSxcbiAgICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodCkpIHtcbiAgICAgICAgICAgIGNvbG9yQnVmZmVyc1tpLS1dID0gY29sb3JCdWZmZXJzW2NvbG9yQnVmZmVycy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgY29sb3JCdWZmZXJzLnBvcCgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlbiBhcHBlbmQgbmV3IGJ1ZmZlcnNcbiAgICAgICAgd2hpbGUgKGNvbG9yQnVmZmVycy5sZW5ndGggPCBjb2xvckNvdW50KSB7XG4gICAgICAgICAgaWYgKGNvbG9yVGV4dHVyZSkge1xuICAgICAgICAgICAgY29sb3JCdWZmZXJzLnB1c2gobmV3IEZyYW1lYnVmZmVyQXR0YWNobWVudChcbiAgICAgICAgICAgICAgR0xfVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgdGV4dHVyZVN0YXRlLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBjb2xvckZvcm1hdCxcbiAgICAgICAgICAgICAgICB0eXBlOiBjb2xvclR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICAgIH0sIEdMX1RFWFRVUkVfMkQpLFxuICAgICAgICAgICAgICBudWxsKSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3JCdWZmZXJzLnB1c2gobmV3IEZyYW1lYnVmZmVyQXR0YWNobWVudChcbiAgICAgICAgICAgICAgR0xfUkVOREVSQlVGRkVSLFxuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICByZW5kZXJidWZmZXJTdGF0ZS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIGZvcm1hdDogY29sb3JGb3JtYXQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICAgIH0pKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2hlY2soY29sb3JCdWZmZXJzLmxlbmd0aCA+IDAsICdtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIGNvbG9yIGJ1ZmZlcicpXG5cbiAgICAgIGZyYW1lYnVmZmVyLndpZHRoID0gd2lkdGhcbiAgICAgIGZyYW1lYnVmZmVyLmhlaWdodCA9IGhlaWdodFxuXG4gICAgICB2YXIgZGVwdGhCdWZmZXIgPSBudWxsXG4gICAgICB2YXIgc3RlbmNpbEJ1ZmZlciA9IG51bGxcbiAgICAgIHZhciBkZXB0aFN0ZW5jaWxCdWZmZXIgPSBudWxsXG4gICAgICB2YXIgb3duc0RlcHRoU3RlbmNpbCA9IGZhbHNlXG4gICAgICB2YXIgZGVwdGhTdGVuY2lsQ291bnQgPSAwXG5cbiAgICAgIGlmICgnZGVwdGhCdWZmZXInIGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVwdGhCdWZmZXIgPSBwYXJzZUF0dGFjaG1lbnQob3B0aW9ucy5kZXB0aEJ1ZmZlcilcbiAgICAgICAgY2hlY2tGb3JtYXQoXG4gICAgICAgICAgZGVwdGhCdWZmZXIsXG4gICAgICAgICAgZGVwdGhUZXh0dXJlRm9ybWF0RW51bXMsXG4gICAgICAgICAgZGVwdGhSZW5kZXJidWZmZXJGb3JtYXRFbnVtcylcbiAgICAgICAgZGVwdGhTdGVuY2lsQ291bnQgKz0gMVxuICAgICAgfVxuICAgICAgaWYgKCdzdGVuY2lsQnVmZmVyJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIHN0ZW5jaWxCdWZmZXIgPSBwYXJzZUF0dGFjaG1lbnQob3B0aW9ucy5zdGVuY2lsQnVmZmVyKVxuICAgICAgICBjaGVja0Zvcm1hdChcbiAgICAgICAgICBzdGVuY2lsQnVmZmVyLFxuICAgICAgICAgIHN0ZW5jaWxUZXh0dXJlRm9ybWF0RW51bXMsXG4gICAgICAgICAgc3RlbmNpbFJlbmRlcmJ1ZmZlckZvcm1hdEVudW1zKVxuICAgICAgICBkZXB0aFN0ZW5jaWxDb3VudCArPSAxXG4gICAgICB9XG4gICAgICBpZiAoJ2RlcHRoU3RlbmNpbEJ1ZmZlcicgaW4gb3B0aW9ucykge1xuICAgICAgICBkZXB0aFN0ZW5jaWxCdWZmZXIgPSBwYXJzZUF0dGFjaG1lbnQob3B0aW9ucy5kZXB0aFN0ZW5jaWxCdWZmZXIpXG4gICAgICAgIGNoZWNrRm9ybWF0KFxuICAgICAgICAgIGRlcHRoU3RlbmNpbEJ1ZmZlcixcbiAgICAgICAgICBkZXB0aFN0ZW5jaWxUZXh0dXJlRm9ybWF0RW51bXMsXG4gICAgICAgICAgZGVwdGhTdGVuY2lsUmVuZGVyYnVmZmVyRm9ybWF0RW51bXMpXG4gICAgICAgIGRlcHRoU3RlbmNpbENvdW50ICs9IDFcbiAgICAgIH1cblxuICAgICAgaWYgKCEoZGVwdGhCdWZmZXIgfHwgc3RlbmNpbEJ1ZmZlciB8fCBkZXB0aFN0ZW5jaWxCdWZmZXIpKSB7XG4gICAgICAgIHZhciBkZXB0aCA9IHRydWVcbiAgICAgICAgdmFyIHN0ZW5jaWwgPSBmYWxzZVxuICAgICAgICB2YXIgdXNlVGV4dHVyZSA9IGZhbHNlXG5cbiAgICAgICAgaWYgKCdkZXB0aCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGRlcHRoID0gISFvcHRpb25zLmRlcHRoXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdzdGVuY2lsJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgc3RlbmNpbCA9ICEhb3B0aW9ucy5zdGVuY2lsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdkZXB0aFRleHR1cmUnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB1c2VUZXh0dXJlID0gISFvcHRpb25zLmRlcHRoVGV4dHVyZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1ckRlcHRoU3RlbmNpbCA9XG4gICAgICAgICAgZnJhbWVidWZmZXIuZGVwdGhBdHRhY2htZW50IHx8XG4gICAgICAgICAgZnJhbWVidWZmZXIuc3RlbmNpbEF0dGFjaG1lbnQgfHxcbiAgICAgICAgICBmcmFtZWJ1ZmZlci5kZXB0aFN0ZW5jaWxBdHRhY2htZW50XG4gICAgICAgIHZhciBuZXh0RGVwdGhTdGVuY2lsID0gbnVsbFxuXG4gICAgICAgIGlmIChkZXB0aCB8fCBzdGVuY2lsKSB7XG4gICAgICAgICAgb3duc0RlcHRoU3RlbmNpbCA9IHRydWVcblxuICAgICAgICAgIGlmICh1c2VUZXh0dXJlKSB7XG4gICAgICAgICAgICBjaGVjayhleHRlbnNpb25zLndlYmdsX2RlcHRoX3RleHR1cmUsXG4gICAgICAgICAgICAgICdkZXB0aCB0ZXh0dXJlIGV4dGVuc2lvbiBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgICAgIHZhciBkZXB0aFRleHR1cmVGb3JtYXRcbiAgICAgICAgICAgIGNoZWNrKGRlcHRoLCAnc3RlbmNpbCBvbmx5IHRleHR1cmVzIG5vdCBzdXBwb3J0ZWQnKVxuICAgICAgICAgICAgaWYgKHN0ZW5jaWwpIHtcbiAgICAgICAgICAgICAgZGVwdGhUZXh0dXJlRm9ybWF0ID0gJ2RlcHRoIHN0ZW5jaWwnXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkZXB0aFRleHR1cmVGb3JtYXQgPSAnZGVwdGgnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnJhbWVidWZmZXIub3duc0RlcHRoU3RlbmNpbCAmJiBjdXJEZXB0aFN0ZW5jaWwudGV4dHVyZSkge1xuICAgICAgICAgICAgICBjdXJEZXB0aFN0ZW5jaWwudGV4dHVyZSh7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBkZXB0aFRleHR1cmVGb3JtYXQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGN1ckRlcHRoU3RlbmNpbC50ZXh0dXJlLl90ZXh0dXJlLnJlZkNvdW50ICs9IDFcbiAgICAgICAgICAgICAgbmV4dERlcHRoU3RlbmNpbCA9IGN1ckRlcHRoU3RlbmNpbFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV4dERlcHRoU3RlbmNpbCA9IG5ldyBGcmFtZWJ1ZmZlckF0dGFjaG1lbnQoXG4gICAgICAgICAgICAgICAgR0xfVEVYVFVSRV8yRCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRleHR1cmVTdGF0ZS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgZm9ybWF0OiBkZXB0aFRleHR1cmVGb3JtYXQsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgICAgICAgICAgIH0sIEdMX1RFWFRVUkVfMkQpLFxuICAgICAgICAgICAgICAgIG51bGwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBkZXB0aFJlbmRlcmJ1ZmZlckZvcm1hdFxuICAgICAgICAgICAgaWYgKGRlcHRoKSB7XG4gICAgICAgICAgICAgIGlmIChzdGVuY2lsKSB7XG4gICAgICAgICAgICAgICAgZGVwdGhSZW5kZXJidWZmZXJGb3JtYXQgPSAnZGVwdGggc3RlbmNpbCdcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXB0aFJlbmRlcmJ1ZmZlckZvcm1hdCA9ICdkZXB0aCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGVwdGhSZW5kZXJidWZmZXJGb3JtYXQgPSAnc3RlbmNpbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmcmFtZWJ1ZmZlci5vd25zRGVwdGhTdGVuY2lsICYmIGN1ckRlcHRoU3RlbmNpbC5yZW5kZXJidWZmZXIpIHtcbiAgICAgICAgICAgICAgY3VyRGVwdGhTdGVuY2lsLnJlbmRlcmJ1ZmZlcih7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBkZXB0aFJlbmRlcmJ1ZmZlckZvcm1hdCxcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgY3VyRGVwdGhTdGVuY2lsLnJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyLnJlZkNvdW50ICs9IDFcbiAgICAgICAgICAgICAgbmV4dERlcHRoU3RlbmNpbCA9IGN1ckRlcHRoU3RlbmNpbFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV4dERlcHRoU3RlbmNpbCA9IG5ldyBGcmFtZWJ1ZmZlckF0dGFjaG1lbnQoXG4gICAgICAgICAgICAgICAgR0xfUkVOREVSQlVGRkVSLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICByZW5kZXJidWZmZXJTdGF0ZS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgZm9ybWF0OiBkZXB0aFJlbmRlcmJ1ZmZlckZvcm1hdCxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRlcHRoKSB7XG4gICAgICAgICAgICBpZiAoc3RlbmNpbCkge1xuICAgICAgICAgICAgICBkZXB0aFN0ZW5jaWxCdWZmZXIgPSBuZXh0RGVwdGhTdGVuY2lsXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkZXB0aEJ1ZmZlciA9IG5leHREZXB0aFN0ZW5jaWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RlbmNpbEJ1ZmZlciA9IG5leHREZXB0aFN0ZW5jaWxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoZWNrKGRlcHRoU3RlbmNpbENvdW50ID09PSAxLFxuICAgICAgICAgICdjYW4gc3BlY2lmeSBvbmx5IG9uZSBvZiBkZXB0aCwgc3RlbmNpbCBvciBkZXB0aFN0ZW5jaWwgYXR0YWNobWVudCcpXG5cbiAgICAgICAgaW5jUmVmQW5kQ2hlY2tTaGFwZShcbiAgICAgICAgICBkZXB0aEJ1ZmZlciB8fFxuICAgICAgICAgIHN0ZW5jaWxCdWZmZXIgfHxcbiAgICAgICAgICBkZXB0aFN0ZW5jaWxCdWZmZXIsXG4gICAgICAgICAgZnJhbWVidWZmZXIpXG4gICAgICB9XG5cbiAgICAgIGRlY0ZCT1JlZnMoZnJhbWVidWZmZXIpXG5cbiAgICAgIGZyYW1lYnVmZmVyLmNvbG9yQXR0YWNobWVudHMgPSBjb2xvckJ1ZmZlcnNcbiAgICAgIGZyYW1lYnVmZmVyLmRlcHRoQXR0YWNobWVudCA9IGRlcHRoQnVmZmVyXG4gICAgICBmcmFtZWJ1ZmZlci5zdGVuY2lsQXR0YWNobWVudCA9IHN0ZW5jaWxCdWZmZXJcbiAgICAgIGZyYW1lYnVmZmVyLmRlcHRoU3RlbmNpbEF0dGFjaG1lbnQgPSBkZXB0aFN0ZW5jaWxCdWZmZXJcbiAgICAgIGZyYW1lYnVmZmVyLm93bnNDb2xvciA9IG93bnNDb2xvclxuICAgICAgZnJhbWVidWZmZXIub3duc0RlcHRoU3RlbmNpbCA9IG93bnNEZXB0aFN0ZW5jaWxcblxuICAgICAgcmVnbEZyYW1lYnVmZmVyLmNvbG9yID0gY29sb3JCdWZmZXJzLm1hcCh1bndyYXBBdHRhY2htZW50KVxuICAgICAgcmVnbEZyYW1lYnVmZmVyLmRlcHRoID0gdW53cmFwQXR0YWNobWVudChkZXB0aEJ1ZmZlcilcbiAgICAgIHJlZ2xGcmFtZWJ1ZmZlci5zdGVuY2lsID0gdW53cmFwQXR0YWNobWVudChzdGVuY2lsQnVmZmVyKVxuICAgICAgcmVnbEZyYW1lYnVmZmVyLmRlcHRoU3RlbmNpbCA9IHVud3JhcEF0dGFjaG1lbnQoZGVwdGhTdGVuY2lsQnVmZmVyKVxuXG4gICAgICByZWZyZXNoKGZyYW1lYnVmZmVyKVxuXG4gICAgICByZWdsRnJhbWVidWZmZXIud2lkdGggPSBmcmFtZWJ1ZmZlci53aWR0aFxuICAgICAgcmVnbEZyYW1lYnVmZmVyLmhlaWdodCA9IGZyYW1lYnVmZmVyLmhlaWdodFxuXG4gICAgICByZXR1cm4gcmVnbEZyYW1lYnVmZmVyXG4gICAgfVxuXG4gICAgcmVnbEZyYW1lYnVmZmVyKG9wdGlvbnMpXG5cbiAgICBPYmplY3QuYXNzaWduKHJlZ2xGcmFtZWJ1ZmZlciwge1xuICAgICAgX3JlZ2xUeXBlOiAnZnJhbWVidWZmZXInLFxuICAgICAgX2ZyYW1lYnVmZmVyOiBmcmFtZWJ1ZmZlcixcbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVzdHJveShmcmFtZWJ1ZmZlcilcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlZ2xGcmFtZWJ1ZmZlclxuICB9XG5cbiAgZnVuY3Rpb24gcmVmcmVzaENhY2hlICgpIHtcbiAgICB2YWx1ZXMoZnJhbWVidWZmZXJTZXQpLmZvckVhY2gocmVmcmVzaClcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyQ2FjaGUgKCkge1xuICAgIHZhbHVlcyhmcmFtZWJ1ZmZlclNldCkuZm9yRWFjaChkZXN0cm95KVxuICB9XG5cbiAgZnVuY3Rpb24gcG9sbCAoKSB7XG4gICAgaWYgKGZyYW1lYnVmZmVyRGlydHkpIHtcbiAgICAgIHZhciB0b3AgPSBmcmFtZWJ1ZmZlclN0YWNrW2ZyYW1lYnVmZmVyU3RhY2subGVuZ3RoIC0gMV1cbiAgICAgIHZhciBleHRfZHJhd2J1ZmZlcnMgPSBleHRlbnNpb25zLndlYmdsX2RyYXdfYnVmZmVyc1xuXG4gICAgICBpZiAodG9wKSB7XG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihHTF9GUkFNRUJVRkZFUiwgdG9wLmZyYW1lYnVmZmVyKVxuICAgICAgICBpZiAoZXh0X2RyYXdidWZmZXJzKSB7XG4gICAgICAgICAgZXh0X2RyYXdidWZmZXJzLmRyYXdCdWZmZXJzV0VCR0woRFJBV19CVUZGRVJTW3RvcC5jb2xvckF0dGFjaG1lbnRzLmxlbmd0aF0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihHTF9GUkFNRUJVRkZFUiwgbnVsbClcbiAgICAgICAgaWYgKGV4dF9kcmF3YnVmZmVycykge1xuICAgICAgICAgIGV4dF9kcmF3YnVmZmVycy5kcmF3QnVmZmVyc1dFQkdMKEJBQ0tfQlVGRkVSKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZyYW1lYnVmZmVyRGlydHkgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGN1cnJlbnRGcmFtZWJ1ZmZlciAoKSB7XG4gICAgcmV0dXJuIGZyYW1lYnVmZmVyU3RhY2tbZnJhbWVidWZmZXJTdGFjay5sZW5ndGggLSAxXVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IGN1cnJlbnRGcmFtZWJ1ZmZlcixcbiAgICBkaXJ0eTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZyYW1lYnVmZmVyRGlydHlcbiAgICB9LFxuICAgIHB1c2g6IGZ1bmN0aW9uIChuZXh0Xykge1xuICAgICAgdmFyIG5leHQgPSBuZXh0XyB8fCBudWxsXG4gICAgICBmcmFtZWJ1ZmZlckRpcnR5ID0gZnJhbWVidWZmZXJEaXJ0eSB8fCAobmV4dCAhPT0gY3VycmVudEZyYW1lYnVmZmVyKCkpXG4gICAgICBmcmFtZWJ1ZmZlclN0YWNrLnB1c2gobmV4dClcbiAgICAgIHJldHVybiBmcmFtZWJ1ZmZlckRpcnR5XG4gICAgfSxcbiAgICBwb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwcmV2ID0gY3VycmVudEZyYW1lYnVmZmVyKClcbiAgICAgIGZyYW1lYnVmZmVyU3RhY2sucG9wKClcbiAgICAgIGZyYW1lYnVmZmVyRGlydHkgPSBmcmFtZWJ1ZmZlckRpcnR5IHx8IChwcmV2ICE9PSBjdXJyZW50RnJhbWVidWZmZXIoKSlcbiAgICAgIHJldHVybiBmcmFtZWJ1ZmZlckRpcnR5XG4gICAgfSxcbiAgICBnZXRGcmFtZWJ1ZmZlcjogZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0Ll9yZWdsVHlwZSA9PT0gJ2ZyYW1lYnVmZmVyJykge1xuICAgICAgICB2YXIgZmJvID0gb2JqZWN0Ll9mcmFtZWJ1ZmZlclxuICAgICAgICBpZiAoZmJvIGluc3RhbmNlb2YgUkVHTEZyYW1lYnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGZib1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0sXG4gICAgcG9sbDogcG9sbCxcbiAgICBjcmVhdGU6IGNyZWF0ZUZCTyxcbiAgICBjbGVhcjogY2xlYXJDYWNoZSxcbiAgICByZWZyZXNoOiByZWZyZXNoQ2FjaGVcbiAgfVxufVxuIiwidmFyIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXMtdHlwZWQtYXJyYXknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTkRBcnJheUxpa2UgKG9iaikge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmXG4gICAgQXJyYXkuaXNBcnJheShvYmouc2hhcGUpICYmXG4gICAgQXJyYXkuaXNBcnJheShvYmouc3RyaWRlKSAmJlxuICAgIHR5cGVvZiBvYmoub2Zmc2V0ID09PSAnbnVtYmVyJyAmJlxuICAgIG9iai5zaGFwZS5sZW5ndGggPT09IG9iai5zdHJpZGUubGVuZ3RoICYmXG4gICAgKEFycmF5LmlzQXJyYXkob2JqLmRhdGEpIHx8XG4gICAgICBpc1R5cGVkQXJyYXkob2JqLmRhdGEpKSlcbn1cbiIsInZhciBkdHlwZXMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy9hcnJheXR5cGVzLmpzb24nKVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpIGluIGR0eXBlc1xufVxuIiwidmFyIEdMX1NVQlBJWEVMX0JJVFMgPSAweDBENTBcbnZhciBHTF9SRURfQklUUyA9IDB4MEQ1MlxudmFyIEdMX0dSRUVOX0JJVFMgPSAweDBENTNcbnZhciBHTF9CTFVFX0JJVFMgPSAweDBENTRcbnZhciBHTF9BTFBIQV9CSVRTID0gMHgwRDU1XG52YXIgR0xfREVQVEhfQklUUyA9IDB4MEQ1NlxudmFyIEdMX1NURU5DSUxfQklUUyA9IDB4MEQ1N1xuXG52YXIgR0xfQUxJQVNFRF9QT0lOVF9TSVpFX1JBTkdFID0gMHg4NDZEXG52YXIgR0xfQUxJQVNFRF9MSU5FX1dJRFRIX1JBTkdFID0gMHg4NDZFXG5cbnZhciBHTF9NQVhfVEVYVFVSRV9TSVpFID0gMHgwRDMzXG52YXIgR0xfTUFYX1ZJRVdQT1JUX0RJTVMgPSAweDBEM0FcbnZhciBHTF9NQVhfVkVSVEVYX0FUVFJJQlMgPSAweDg4NjlcbnZhciBHTF9NQVhfVkVSVEVYX1VOSUZPUk1fVkVDVE9SUyA9IDB4OERGQlxudmFyIEdMX01BWF9WQVJZSU5HX1ZFQ1RPUlMgPSAweDhERkNcbnZhciBHTF9NQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyA9IDB4OEI0RFxudmFyIEdMX01BWF9WRVJURVhfVEVYVFVSRV9JTUFHRV9VTklUUyA9IDB4OEI0Q1xudmFyIEdMX01BWF9URVhUVVJFX0lNQUdFX1VOSVRTID0gMHg4ODcyXG52YXIgR0xfTUFYX0ZSQUdNRU5UX1VOSUZPUk1fVkVDVE9SUyA9IDB4OERGRFxudmFyIEdMX01BWF9DVUJFX01BUF9URVhUVVJFX1NJWkUgPSAweDg1MUNcbnZhciBHTF9NQVhfUkVOREVSQlVGRkVSX1NJWkUgPSAweDg0RThcblxudmFyIEdMX1ZFTkRPUiA9IDB4MUYwMFxudmFyIEdMX1JFTkRFUkVSID0gMHgxRjAxXG52YXIgR0xfVkVSU0lPTiA9IDB4MUYwMlxudmFyIEdMX1NIQURJTkdfTEFOR1VBR0VfVkVSU0lPTiA9IDB4OEI4Q1xuXG52YXIgR0xfTUFYX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhUID0gMHg4NEZGXG5cbnZhciBHTF9NQVhfQ09MT1JfQVRUQUNITUVOVFNfV0VCR0wgPSAweDhDREZcbnZhciBHTF9NQVhfRFJBV19CVUZGRVJTX1dFQkdMID0gMHg4ODI0XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGdsLCBleHRlbnNpb25zKSB7XG4gIHZhciBtYXhBbmlzb3Ryb3BpYyA9IDFcbiAgaWYgKGV4dGVuc2lvbnMuZXh0X3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljKSB7XG4gICAgbWF4QW5pc290cm9waWMgPSBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhUKVxuICB9XG5cbiAgdmFyIG1heERyYXdidWZmZXJzID0gMVxuICB2YXIgbWF4Q29sb3JBdHRhY2htZW50cyA9IDFcbiAgaWYgKGV4dGVuc2lvbnMud2ViZ2xfZHJhd19idWZmZXJzKSB7XG4gICAgbWF4RHJhd2J1ZmZlcnMgPSBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX0RSQVdfQlVGRkVSU19XRUJHTClcbiAgICBtYXhDb2xvckF0dGFjaG1lbnRzID0gZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9DT0xPUl9BVFRBQ0hNRU5UU19XRUJHTClcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLy8gZHJhd2luZyBidWZmZXIgYml0IGRlcHRoXG4gICAgY29sb3JCaXRzOiBbXG4gICAgICBnbC5nZXRQYXJhbWV0ZXIoR0xfUkVEX0JJVFMpLFxuICAgICAgZ2wuZ2V0UGFyYW1ldGVyKEdMX0dSRUVOX0JJVFMpLFxuICAgICAgZ2wuZ2V0UGFyYW1ldGVyKEdMX0JMVUVfQklUUyksXG4gICAgICBnbC5nZXRQYXJhbWV0ZXIoR0xfQUxQSEFfQklUUylcbiAgICBdLFxuICAgIGRlcHRoQml0czogZ2wuZ2V0UGFyYW1ldGVyKEdMX0RFUFRIX0JJVFMpLFxuICAgIHN0ZW5jaWxCaXRzOiBnbC5nZXRQYXJhbWV0ZXIoR0xfU1RFTkNJTF9CSVRTKSxcbiAgICBzdWJwaXhlbEJpdHM6IGdsLmdldFBhcmFtZXRlcihHTF9TVUJQSVhFTF9CSVRTKSxcblxuICAgIC8vIHN1cHBvcnRlZCBleHRlbnNpb25zXG4gICAgZXh0ZW5zaW9uczogT2JqZWN0LmtleXMoZXh0ZW5zaW9ucykuZmlsdGVyKGZ1bmN0aW9uIChleHQpIHtcbiAgICAgIHJldHVybiAhIWV4dGVuc2lvbnNbZXh0XVxuICAgIH0pLFxuXG4gICAgLy8gbWF4IGFuaXNvIHNhbXBsZXNcbiAgICBtYXhBbmlzb3Ryb3BpYzogbWF4QW5pc290cm9waWMsXG5cbiAgICAvLyBtYXggZHJhdyBidWZmZXJzXG4gICAgbWF4RHJhd2J1ZmZlcnM6IG1heERyYXdidWZmZXJzLFxuICAgIG1heENvbG9yQXR0YWNobWVudHM6IG1heENvbG9yQXR0YWNobWVudHMsXG5cbiAgICAvLyBwb2ludCBhbmQgbGluZSBzaXplIHJhbmdlc1xuICAgIHBvaW50U2l6ZURpbXM6IGdsLmdldFBhcmFtZXRlcihHTF9BTElBU0VEX1BPSU5UX1NJWkVfUkFOR0UpLFxuICAgIGxpbmVXaWR0aERpbXM6IGdsLmdldFBhcmFtZXRlcihHTF9BTElBU0VEX0xJTkVfV0lEVEhfUkFOR0UpLFxuICAgIG1heFZpZXdwb3J0RGltczogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9WSUVXUE9SVF9ESU1TKSxcbiAgICBtYXhDb21iaW5lZFRleHR1cmVVbml0czogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9DT01CSU5FRF9URVhUVVJFX0lNQUdFX1VOSVRTKSxcbiAgICBtYXhDdWJlTWFwU2l6ZTogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9DVUJFX01BUF9URVhUVVJFX1NJWkUpLFxuICAgIG1heFJlbmRlcmJ1ZmZlclNpemU6IGdsLmdldFBhcmFtZXRlcihHTF9NQVhfUkVOREVSQlVGRkVSX1NJWkUpLFxuICAgIG1heFRleHR1cmVVbml0czogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9URVhUVVJFX0lNQUdFX1VOSVRTKSxcbiAgICBtYXhUZXh0dXJlU2l6ZTogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9URVhUVVJFX1NJWkUpLFxuICAgIG1heEF0dHJpYnV0ZXM6IGdsLmdldFBhcmFtZXRlcihHTF9NQVhfVkVSVEVYX0FUVFJJQlMpLFxuICAgIG1heFZlcnRleFVuaWZvcm1zOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX1ZFUlRFWF9VTklGT1JNX1ZFQ1RPUlMpLFxuICAgIG1heFZlcnRleFRleHR1cmVVbml0czogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9WRVJURVhfVEVYVFVSRV9JTUFHRV9VTklUUyksXG4gICAgbWF4VmFyeWluZ1ZlY3RvcnM6IGdsLmdldFBhcmFtZXRlcihHTF9NQVhfVkFSWUlOR19WRUNUT1JTKSxcbiAgICBtYXhGcmFnbWVudFVuaWZvcm1zOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX0ZSQUdNRU5UX1VOSUZPUk1fVkVDVE9SUyksXG5cbiAgICAvLyB2ZW5kb3IgaW5mb1xuICAgIGdsc2w6IGdsLmdldFBhcmFtZXRlcihHTF9TSEFESU5HX0xBTkdVQUdFX1ZFUlNJT04pLFxuICAgIHJlbmRlcmVyOiBnbC5nZXRQYXJhbWV0ZXIoR0xfUkVOREVSRVIpLFxuICAgIHZlbmRvcjogZ2wuZ2V0UGFyYW1ldGVyKEdMX1ZFTkRPUiksXG4gICAgdmVyc2lvbjogZ2wuZ2V0UGFyYW1ldGVyKEdMX1ZFUlNJT04pXG4gIH1cbn1cbiIsIi8qIGdsb2JhbHMgZG9jdW1lbnQsIEltYWdlLCBYTUxIdHRwUmVxdWVzdCAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRUZXh0dXJlXG5cbmZ1bmN0aW9uIGdldEV4dGVuc2lvbiAodXJsKSB7XG4gIHZhciBwYXJ0cyA9IC9cXC4oXFx3KykoXFw/LiopPyQvLmV4ZWModXJsKVxuICBpZiAocGFydHMgJiYgcGFydHNbMV0pIHtcbiAgICByZXR1cm4gcGFydHNbMV0udG9Mb3dlckNhc2UoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVmlkZW9FeHRlbnNpb24gKHVybCkge1xuICByZXR1cm4gW1xuICAgICdhdmknLFxuICAgICdhc2YnLFxuICAgICdnaWZ2JyxcbiAgICAnbW92JyxcbiAgICAncXQnLFxuICAgICd5dXYnLFxuICAgICdtcGcnLFxuICAgICdtcGVnJyxcbiAgICAnbTJ2JyxcbiAgICAnbXA0JyxcbiAgICAnbTRwJyxcbiAgICAnbTR2JyxcbiAgICAnb2dnJyxcbiAgICAnb2d2JyxcbiAgICAndm9iJyxcbiAgICAnd2VibScsXG4gICAgJ3dtdidcbiAgXS5pbmRleE9mKHVybCkgPj0gMFxufVxuXG5mdW5jdGlvbiBpc0NvbXByZXNzZWRFeHRlbnNpb24gKHVybCkge1xuICByZXR1cm4gW1xuICAgICdkZHMnXG4gIF0uaW5kZXhPZih1cmwpID49IDBcbn1cblxuZnVuY3Rpb24gbG9hZFZpZGVvICh1cmwsIGNyb3NzT3JpZ2luKSB7XG4gIHZhciB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcbiAgdmlkZW8uYXV0b3BsYXkgPSB0cnVlXG4gIHZpZGVvLmxvb3AgPSB0cnVlXG4gIGlmIChjcm9zc09yaWdpbikge1xuICAgIHZpZGVvLmNyb3NzT3JpZ2luID0gY3Jvc3NPcmlnaW5cbiAgfVxuICB2aWRlby5zcmMgPSB1cmxcbiAgcmV0dXJuIHZpZGVvXG59XG5cbmZ1bmN0aW9uIGxvYWRDb21wcmVzc2VkVGV4dHVyZSAodXJsLCBleHQsIGNyb3NzT3JpZ2luKSB7XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJ1xuICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKVxuICB4aHIuc2VuZCgpXG4gIHJldHVybiB4aHJcbn1cblxuZnVuY3Rpb24gbG9hZEltYWdlICh1cmwsIGNyb3NzT3JpZ2luKSB7XG4gIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpXG4gIGlmIChjcm9zc09yaWdpbikge1xuICAgIGltYWdlLmNyb3NzT3JpZ2luID0gY3Jvc3NPcmlnaW5cbiAgfVxuICBpbWFnZS5zcmMgPSB1cmxcbiAgcmV0dXJuIGltYWdlXG59XG5cbi8vIEN1cnJlbnRseSB0aGlzIHN0dWZmIG9ubHkgd29ya3MgaW4gYSBET00gZW52aXJvbm1lbnRcbmZ1bmN0aW9uIGxvYWRUZXh0dXJlICh1cmwsIGNyb3NzT3JpZ2luKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIGV4dCA9IGdldEV4dGVuc2lvbih1cmwpXG4gICAgaWYgKGlzVmlkZW9FeHRlbnNpb24oZXh0KSkge1xuICAgICAgcmV0dXJuIGxvYWRWaWRlbyh1cmwsIGNyb3NzT3JpZ2luKVxuICAgIH1cbiAgICBpZiAoaXNDb21wcmVzc2VkRXh0ZW5zaW9uKGV4dCkpIHtcbiAgICAgIHJldHVybiBsb2FkQ29tcHJlc3NlZFRleHR1cmUodXJsLCBleHQsIGNyb3NzT3JpZ2luKVxuICAgIH1cbiAgICByZXR1cm4gbG9hZEltYWdlKHVybCwgY3Jvc3NPcmlnaW4pXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cbiIsIi8vIFJlZmVyZW5jZXM6XG4vL1xuLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2JiOTQzOTkxLmFzcHgvXG4vLyBodHRwOi8vYmxvZy50b2ppY29kZS5jb20vMjAxMS8xMi9jb21wcmVzc2VkLXRleHR1cmVzLWluLXdlYmdsLmh0bWxcbi8vXG52YXIgY2hlY2sgPSByZXF1aXJlKCcuL2NoZWNrJylcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUREU1xuXG52YXIgRERTX01BR0lDID0gMHgyMDUzNDQ0NFxuXG52YXIgR0xfVEVYVFVSRV8yRCA9IDB4MERFMVxudmFyIEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCA9IDB4ODUxNVxuXG52YXIgR0xfQ09NUFJFU1NFRF9SR0JfUzNUQ19EWFQxX0VYVCA9IDB4ODNGMFxudmFyIEdMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDFfRVhUID0gMHg4M0YxXG52YXIgR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUM19FWFQgPSAweDgzRjJcbnZhciBHTF9DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQ1X0VYVCA9IDB4ODNGM1xuXG52YXIgR0xfQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCA9IDB4OEQ2NFxuXG52YXIgR0xfVU5TSUdORURfQllURSA9IDB4MTQwMVxuLy8gdmFyIEdMX0hBTEZfRkxPQVRfT0VTID0gMHg4RDYxXG4vLyB2YXIgR0xfRkxPQVQgPSAweDE0MDZcblxudmFyIEREU0RfTUlQTUFQQ09VTlQgPSAweDIwMDAwXG5cbnZhciBERFNDQVBTMl9DVUJFTUFQID0gMHgyMDBcbnZhciBERFNDQVBTMl9DVUJFTUFQX1BPU0lUSVZFWCA9IDB4NDAwXG52YXIgRERTQ0FQUzJfQ1VCRU1BUF9ORUdBVElWRVggPSAweDgwMFxudmFyIEREU0NBUFMyX0NVQkVNQVBfUE9TSVRJVkVZID0gMHgxMDAwXG52YXIgRERTQ0FQUzJfQ1VCRU1BUF9ORUdBVElWRVkgPSAweDIwMDBcbnZhciBERFNDQVBTMl9DVUJFTUFQX1BPU0lUSVZFWiA9IDB4NDAwMFxudmFyIEREU0NBUFMyX0NVQkVNQVBfTkVHQVRJVkVaID0gMHg4MDAwXG5cbnZhciBDVUJFTUFQX0NPTVBMRVRFX0ZBQ0VTID0gKFxuICBERFNDQVBTMl9DVUJFTUFQX1BPU0lUSVZFWCB8XG4gIEREU0NBUFMyX0NVQkVNQVBfTkVHQVRJVkVYIHxcbiAgRERTQ0FQUzJfQ1VCRU1BUF9QT1NJVElWRVkgfFxuICBERFNDQVBTMl9DVUJFTUFQX05FR0FUSVZFWSB8XG4gIEREU0NBUFMyX0NVQkVNQVBfUE9TSVRJVkVaIHxcbiAgRERTQ0FQUzJfQ1VCRU1BUF9ORUdBVElWRVopXG5cbnZhciBERFBGX0ZPVVJDQyA9IDB4NFxudmFyIEREUEZfUkdCID0gMHg0MFxuXG52YXIgRk9VUkNDX0RYVDEgPSAweDMxNTQ1ODQ0XG52YXIgRk9VUkNDX0RYVDMgPSAweDMzNTQ1ODQ0XG52YXIgRk9VUkNDX0RYVDUgPSAweDM1NTQ1ODQ0XG52YXIgRk9VUkNDX0VUQzEgPSAweDMxNDM1NDQ1XG5cbi8vIEREU19IRUFERVIge1xudmFyIE9GRl9TSVpFID0gMSAgICAgICAgLy8gaW50MzIgZHdTaXplXG52YXIgT0ZGX0ZMQUdTID0gMiAgICAgICAvLyBpbnQzMiBkd0ZsYWdzXG52YXIgT0ZGX0hFSUdIVCA9IDMgICAgICAvLyBpbnQzMiBkd0hlaWdodFxudmFyIE9GRl9XSURUSCA9IDQgICAgICAgLy8gaW50MzIgZHdXaWR0aFxuLy8gdmFyIE9GRl9QSVRDSCA9IDUgICAgICAgLy8gaW50MzIgZHdQaXRjaE9yTGluZWFyU2l6ZVxuLy8gdmFyIE9GRl9ERVBUSCA9IDYgICAgICAgLy8gaW50MzIgZHdEZXB0aFxudmFyIE9GRl9NSVBNQVAgPSA3ICAgICAgLy8gaW50MzIgZHdNaXBNYXBDb3VudDsgLy8gb2Zmc2V0OiA3XG4vLyBpbnQzMlsxMV0gZHdSZXNlcnZlZDFcbi8vIEREU19QSVhFTEZPUk1BVCB7XG4vLyB2YXIgT0ZGX1BGX1NJWkUgPSAxOSAgICAvLyBpbnQzMiBkd1NpemU7IC8vIG9mZnNldDogMTlcbnZhciBPRkZfUEZfRkxBR1MgPSAyMCAgIC8vIGludDMyIGR3RmxhZ3NcbnZhciBPRkZfRk9VUkNDID0gMjEgICAgIC8vIGNoYXJbNF0gZHdGb3VyQ0Ncbi8vIHZhciBPRkZfUkdCQV9CSVRTID0gMjIgIC8vIGludDMyIGR3UkdCQml0Q291bnRcbi8vIHZhciBPRkZfUkVEX01BU0sgPSAyMyAgIC8vIGludDMyIGR3UkJpdE1hc2tcbi8vIHZhciBPRkZfR1JFRU5fTUFTSyA9IDI0IC8vIGludDMyIGR3R0JpdE1hc2tcbi8vIHZhciBPRkZfQkxVRV9NQVNLID0gMjUgIC8vIGludDMyIGR3QkJpdE1hc2tcbi8vIHZhciBPRkZfQUxQSEFfTUFTSyA9IDI2IC8vIGludDMyIGR3QUJpdE1hc2s7IC8vIG9mZnNldDogMjZcbi8vIH1cbi8vIHZhciBPRkZfQ0FQUyA9IDI3ICAgICAgIC8vIGludDMyIGR3Q2FwczsgLy8gb2Zmc2V0OiAyN1xudmFyIE9GRl9DQVBTMiA9IDI4ICAgICAgLy8gaW50MzIgZHdDYXBzMlxuLy8gdmFyIE9GRl9DQVBTMyA9IDI5ICAgICAgLy8gaW50MzIgZHdDYXBzM1xuLy8gdmFyIE9GRl9DQVBTNCA9IDMwICAgICAgLy8gaW50MzIgZHdDYXBzNFxuLy8gaW50MzIgZHdSZXNlcnZlZDIgLy8gb2Zmc2V0IDMxXG5cbmZ1bmN0aW9uIHBhcnNlRERTIChhcnJheUJ1ZmZlcikge1xuICB2YXIgaGVhZGVyID0gbmV3IEludDMyQXJyYXkoYXJyYXlCdWZmZXIpXG4gIGNoZWNrKGhlYWRlclswXSA9PT0gRERTX01BR0lDLFxuICAgICdpbnZhbGlkIG1hZ2ljIG51bWJlciBmb3IgZGRzIGhlYWRlcicpXG5cbiAgdmFyIGZsYWdzID0gaGVhZGVyW09GRl9GTEFHU11cbiAgY2hlY2soZmxhZ3MgJiBERFBGX0ZPVVJDQyxcbiAgICAndW5zdXBwb3J0ZWQgZGRzIGZvcm1hdCcpXG5cbiAgdmFyIHdpZHRoID0gaGVhZGVyW09GRl9XSURUSF1cbiAgdmFyIGhlaWdodCA9IGhlYWRlcltPRkZfSEVJR0hUXVxuXG4gIHZhciB0eXBlID0gR0xfVU5TSUdORURfQllURVxuICB2YXIgZm9ybWF0ID0gMFxuICB2YXIgYmxvY2tCeXRlcyA9IDBcbiAgdmFyIGNoYW5uZWxzID0gNFxuICBzd2l0Y2ggKGhlYWRlcltPRkZfRk9VUkNDXSkge1xuICAgIGNhc2UgRk9VUkNDX0RYVDE6XG4gICAgICBibG9ja0J5dGVzID0gOFxuICAgICAgaWYgKGZsYWdzICYgRERQRl9SR0IpIHtcbiAgICAgICAgY2hhbm5lbHMgPSAzXG4gICAgICAgIGZvcm1hdCA9IEdMX0NPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1hdCA9IEdMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDFfRVhUXG4gICAgICB9XG4gICAgICBicmVha1xuXG4gICAgY2FzZSBGT1VSQ0NfRFhUMzpcbiAgICAgIGJsb2NrQnl0ZXMgPSAxNlxuICAgICAgZm9ybWF0ID0gR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUM19FWFRcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIEZPVVJDQ19EWFQ1OlxuICAgICAgYmxvY2tCeXRlcyA9IDE2XG4gICAgICBmb3JtYXQgPSBHTF9DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQ1X0VYVFxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgRk9VUkNDX0VUQzE6XG4gICAgICBibG9ja0J5dGVzID0gOFxuICAgICAgZm9ybWF0ID0gR0xfQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTFxuICAgICAgYnJlYWtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBoZHIgYW5kIHVuY29tcHJlc3NlZCB0ZXh0dXJlc1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIEhhbmRsZSB1bmNvbXByZXNzZWQgZGF0YSBoZXJlXG4gICAgICBjaGVjay5yYWlzZSgndW5zdXBwb3J0ZWQgZGRzIHRleHR1cmUgZm9ybWF0JylcbiAgfVxuXG4gIHZhciBwaXhlbEZsYWdzID0gaGVhZGVyW09GRl9QRl9GTEFHU11cblxuICB2YXIgbWlwbWFwQ291bnQgPSAxXG4gIGlmIChwaXhlbEZsYWdzICYgRERTRF9NSVBNQVBDT1VOVCkge1xuICAgIG1pcG1hcENvdW50ID0gTWF0aC5tYXgoMSwgaGVhZGVyW09GRl9NSVBNQVBdKVxuICB9XG5cbiAgdmFyIHB0ciA9IGhlYWRlcltPRkZfU0laRV0gKyA0XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgY2hhbm5lbHM6IGNoYW5uZWxzLFxuICAgIGZvcm1hdDogZm9ybWF0LFxuICAgIHR5cGU6IHR5cGUsXG4gICAgY29tcHJlc3NlZDogdHJ1ZSxcbiAgICBjdWJlOiBmYWxzZSxcbiAgICBwaXhlbHM6IFtdXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1pcHMgKHRhcmdldCkge1xuICAgIHZhciBtaXBXaWR0aCA9IHdpZHRoXG4gICAgdmFyIG1pcEhlaWdodCA9IGhlaWdodFxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaXBtYXBDb3VudDsgKytpKSB7XG4gICAgICB2YXIgc2l6ZSA9XG4gICAgICAgIE1hdGgubWF4KDEsIChtaXBXaWR0aCArIDMpID4+IDIpICpcbiAgICAgICAgTWF0aC5tYXgoMSwgKG1pcEhlaWdodCArIDMpID4+IDIpICpcbiAgICAgICAgYmxvY2tCeXRlc1xuICAgICAgcmVzdWx0LnBpeGVscy5wdXNoKHtcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgIG1pcGxldmVsOiBpLFxuICAgICAgICB3aWR0aDogbWlwV2lkdGgsXG4gICAgICAgIGhlaWdodDogbWlwSGVpZ2h0LFxuICAgICAgICBkYXRhOiBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlciwgcHRyLCBzaXplKVxuICAgICAgfSlcbiAgICAgIHB0ciArPSBzaXplXG4gICAgICBtaXBXaWR0aCA+Pj0gMVxuICAgICAgbWlwSGVpZ2h0ID4+PSAxXG4gICAgfVxuICB9XG5cbiAgdmFyIGNhcHMyID0gaGVhZGVyW09GRl9DQVBTMl1cbiAgdmFyIGN1YmVtYXAgPSAhIShjYXBzMiAmIEREU0NBUFMyX0NVQkVNQVApXG4gIGlmIChjdWJlbWFwKSB7XG4gICAgY2hlY2soXG4gICAgICAoY2FwczIgJiBDVUJFTUFQX0NPTVBMRVRFX0ZBQ0VTKSA9PT0gQ1VCRU1BUF9DT01QTEVURV9GQUNFUyxcbiAgICAgICdtaXNzaW5nIGN1YmVtYXAgZmFjZXMnKVxuICAgIHJlc3VsdC5jdWJlID0gdHJ1ZVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgICBwYXJzZU1pcHMoR0xfVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICsgaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyc2VNaXBzKEdMX1RFWFRVUkVfMkQpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG4iLCIvKiBnbG9iYWxzIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgY2FuY2VsQW5pbWF0aW9uRnJhbWUgKi9cbmlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIGNhbmNlbEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uICh4KSB7IHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoeCkgfSxcbiAgICBjYW5jZWw6IGZ1bmN0aW9uICh4KSB7IHJldHVybiBjYW5jZWxBbmltYXRpb25GcmFtZSh4KSB9XG4gIH1cbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0ge1xuICAgIG5leHQ6IGZ1bmN0aW9uIChjYikge1xuICAgICAgc2V0VGltZW91dChjYiwgMzApXG4gICAgfSxcbiAgICBjYW5jZWw6IGNsZWFyVGltZW91dFxuICB9XG59XG4iLCJ2YXIgY2hlY2sgPSByZXF1aXJlKCcuL2NoZWNrJylcbnZhciBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzLXR5cGVkLWFycmF5JylcblxudmFyIEdMX1JHQkEgPSA2NDA4XG52YXIgR0xfVU5TSUdORURfQllURSA9IDUxMjFcbnZhciBHTF9QQUNLX0FMSUdOTUVOVCA9IDB4MEQwNVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdyYXBSZWFkUGl4ZWxzIChnbCwgcmVnbFBvbGwsIHZpZXdwb3J0U3RhdGUpIHtcbiAgZnVuY3Rpb24gcmVhZFBpeGVscyAoaW5wdXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGlucHV0IHx8IHt9XG4gICAgaWYgKGlzVHlwZWRBcnJheShpbnB1dCkpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGE6IG9wdGlvbnNcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIHdpZHRoOiBhcmd1bWVudHNbMF0gfCAwLFxuICAgICAgICBoZWlnaHQ6IGFyZ3VtZW50c1sxXSB8IDBcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBXZWJHTCBzdGF0ZVxuICAgIHJlZ2xQb2xsKClcblxuICAgIC8vIFJlYWQgdmlld3BvcnQgc3RhdGVcbiAgICB2YXIgeCA9IG9wdGlvbnMueCB8fCAwXG4gICAgdmFyIHkgPSBvcHRpb25zLnkgfHwgMFxuICAgIHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGggfHwgdmlld3BvcnRTdGF0ZS53aWR0aFxuICAgIHZhciBoZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCB2aWV3cG9ydFN0YXRlLmhlaWdodFxuXG4gICAgLy8gQ29tcHV0ZSBzaXplXG4gICAgdmFyIHNpemUgPSB3aWR0aCAqIGhlaWdodCAqIDRcblxuICAgIC8vIEFsbG9jYXRlIGRhdGFcbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCBuZXcgVWludDhBcnJheShzaXplKVxuXG4gICAgLy8gVHlwZSBjaGVja1xuICAgIGNoZWNrLmlzVHlwZWRBcnJheShkYXRhKVxuICAgIGNoZWNrKGRhdGEuYnl0ZUxlbmd0aCA+PSBzaXplLCAnZGF0YSBidWZmZXIgdG9vIHNtYWxsJylcblxuICAgIC8vIFJ1biByZWFkIHBpeGVsc1xuICAgIGdsLnBpeGVsU3RvcmVpKEdMX1BBQ0tfQUxJR05NRU5ULCA0KVxuICAgIGdsLnJlYWRQaXhlbHMoeCwgeSwgd2lkdGgsIGhlaWdodCwgR0xfUkdCQSwgR0xfVU5TSUdORURfQllURSwgZGF0YSlcblxuICAgIHJldHVybiBkYXRhXG4gIH1cblxuICByZXR1cm4gcmVhZFBpeGVsc1xufVxuIiwidmFyIGNoZWNrID0gcmVxdWlyZSgnLi9jaGVjaycpXG52YXIgdmFsdWVzID0gcmVxdWlyZSgnLi92YWx1ZXMnKVxuXG52YXIgR0xfUkVOREVSQlVGRkVSID0gMHg4RDQxXG5cbnZhciBHTF9SR0JBNCA9IDB4ODA1NlxudmFyIEdMX1JHQjVfQTEgPSAweDgwNTdcbnZhciBHTF9SR0I1NjUgPSAweDhENjJcbnZhciBHTF9ERVBUSF9DT01QT05FTlQxNiA9IDB4ODFBNVxudmFyIEdMX1NURU5DSUxfSU5ERVg4ID0gMHg4RDQ4XG52YXIgR0xfREVQVEhfU1RFTkNJTCA9IDB4ODRGOVxuXG52YXIgR0xfU1JHQjhfQUxQSEE4X0VYVCA9IDB4OEM0M1xuXG52YXIgR0xfUkdCQTMyRl9FWFQgPSAweDg4MTRcblxudmFyIEdMX1JHQkExNkZfRVhUID0gMHg4ODFBXG52YXIgR0xfUkdCMTZGX0VYVCA9IDB4ODgxQlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChnbCwgZXh0ZW5zaW9ucywgbGltaXRzKSB7XG4gIHZhciBmb3JtYXRUeXBlcyA9IHtcbiAgICAncmdiYTQnOiBHTF9SR0JBNCxcbiAgICAncmdiNTY1JzogR0xfUkdCNTY1LFxuICAgICdyZ2I1IGExJzogR0xfUkdCNV9BMSxcbiAgICAnZGVwdGgnOiBHTF9ERVBUSF9DT01QT05FTlQxNixcbiAgICAnc3RlbmNpbCc6IEdMX1NURU5DSUxfSU5ERVg4LFxuICAgICdkZXB0aCBzdGVuY2lsJzogR0xfREVQVEhfU1RFTkNJTFxuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMuZXh0X3NyZ2IpIHtcbiAgICBmb3JtYXRUeXBlc1snc3JnYmEnXSA9IEdMX1NSR0I4X0FMUEhBOF9FWFRcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLmV4dF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCkge1xuICAgIGZvcm1hdFR5cGVzWydyZ2JhMTZmJ10gPSBHTF9SR0JBMTZGX0VYVFxuICAgIGZvcm1hdFR5cGVzWydyZ2IxNmYnXSA9IEdMX1JHQjE2Rl9FWFRcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2NvbG9yX2J1ZmZlcl9mbG9hdCkge1xuICAgIGZvcm1hdFR5cGVzWydyZ2JhMzJmJ10gPSBHTF9SR0JBMzJGX0VYVFxuICB9XG5cbiAgdmFyIHJlbmRlcmJ1ZmZlckNvdW50ID0gMFxuICB2YXIgcmVuZGVyYnVmZmVyU2V0ID0ge31cblxuICBmdW5jdGlvbiBSRUdMUmVuZGVyYnVmZmVyICgpIHtcbiAgICB0aGlzLmlkID0gcmVuZGVyYnVmZmVyQ291bnQrK1xuICAgIHRoaXMucmVmQ291bnQgPSAxXG5cbiAgICB0aGlzLnJlbmRlcmJ1ZmZlciA9IG51bGxcblxuICAgIHRoaXMuZm9ybWF0ID0gR0xfUkdCQTRcbiAgICB0aGlzLndpZHRoID0gMFxuICAgIHRoaXMuaGVpZ2h0ID0gMFxuICB9XG5cbiAgUkVHTFJlbmRlcmJ1ZmZlci5wcm90b3R5cGUuZGVjUmVmID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgtLXRoaXMucmVmQ291bnQgPT09IDApIHtcbiAgICAgIGRlc3Ryb3kodGhpcylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWZyZXNoIChyYikge1xuICAgIGlmICghZ2wuaXNSZW5kZXJidWZmZXIocmIucmVuZGVyYnVmZmVyKSkge1xuICAgICAgcmIucmVuZGVyYnVmZmVyID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKClcbiAgICB9XG4gICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihHTF9SRU5ERVJCVUZGRVIsIHJiLnJlbmRlcmJ1ZmZlcilcbiAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKFxuICAgICAgR0xfUkVOREVSQlVGRkVSLFxuICAgICAgcmIuZm9ybWF0LFxuICAgICAgcmIud2lkdGgsXG4gICAgICByYi5oZWlnaHQpXG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95IChyYikge1xuICAgIHZhciBoYW5kbGUgPSByYi5yZW5kZXJidWZmZXJcbiAgICBjaGVjayhoYW5kbGUsICdtdXN0IG5vdCBkb3VibGUgZGVzdHJveSByZW5kZXJidWZmZXInKVxuICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoR0xfUkVOREVSQlVGRkVSLCBudWxsKVxuICAgIGlmIChnbC5pc1JlbmRlcmJ1ZmZlcihoYW5kbGUpKSB7XG4gICAgICBnbC5kZWxldGVSZW5kZXJidWZmZXIoaGFuZGxlKVxuICAgIH1cbiAgICByYi5yZW5kZXJidWZmZXIgPSBudWxsXG4gICAgcmIucmVmQ291bnQgPSAwXG4gICAgZGVsZXRlIHJlbmRlcmJ1ZmZlclNldFtyYi5pZF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlbmRlcmJ1ZmZlciAoaW5wdXQpIHtcbiAgICB2YXIgcmVuZGVyYnVmZmVyID0gbmV3IFJFR0xSZW5kZXJidWZmZXIoKVxuICAgIHJlbmRlcmJ1ZmZlclNldFtyZW5kZXJidWZmZXIuaWRdID0gcmVuZGVyYnVmZmVyXG5cbiAgICBmdW5jdGlvbiByZWdsUmVuZGVyYnVmZmVyIChpbnB1dCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBpbnB1dCB8fCB7fVxuXG4gICAgICB2YXIgdyA9IDBcbiAgICAgIHZhciBoID0gMFxuICAgICAgaWYgKCdzaGFwZScgaW4gb3B0aW9ucykge1xuICAgICAgICB2YXIgc2hhcGUgPSBvcHRpb25zLnNoYXBlXG4gICAgICAgIGNoZWNrKEFycmF5LmlzQXJyYXkoc2hhcGUpICYmIHNoYXBlLmxlbmd0aCA+PSAyLFxuICAgICAgICAgICdpbnZhbGlkIHJlbmRlcmJ1ZmZlciBzaGFwZScpXG4gICAgICAgIHcgPSBzaGFwZVswXSB8IDBcbiAgICAgICAgaCA9IHNoYXBlWzFdIHwgMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCdyYWRpdXMnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB3ID0gaCA9IG9wdGlvbnMucmFkaXVzIHwgMFxuICAgICAgICB9XG4gICAgICAgIGlmICgnd2lkdGgnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB3ID0gb3B0aW9ucy53aWR0aCB8IDBcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2hlaWdodCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGggPSBvcHRpb25zLmhlaWdodCB8IDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHMgPSBsaW1pdHMubWF4UmVuZGVyYnVmZmVyU2l6ZVxuICAgICAgY2hlY2sodyA+PSAwICYmIGggPj0gMCAmJiB3IDw9IHMgJiYgaCA8PSBzLFxuICAgICAgICAnaW52YWxpZCByZW5kZXJidWZmZXIgc2l6ZScpXG4gICAgICByZWdsUmVuZGVyYnVmZmVyLndpZHRoID0gcmVuZGVyYnVmZmVyLndpZHRoID0gTWF0aC5tYXgodywgMSlcbiAgICAgIHJlZ2xSZW5kZXJidWZmZXIuaGVpZ2h0ID0gcmVuZGVyYnVmZmVyLmhlaWdodCA9IE1hdGgubWF4KGgsIDEpXG5cbiAgICAgIHJlbmRlcmJ1ZmZlci5mb3JtYXQgPSBHTF9SR0JBNFxuICAgICAgaWYgKCdmb3JtYXQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IG9wdGlvbnMuZm9ybWF0XG4gICAgICAgIGNoZWNrLnBhcmFtZXRlcihmb3JtYXQsIGZvcm1hdFR5cGVzLCAnaW52YWxpZCByZW5kZXIgYnVmZmVyIGZvcm1hdCcpXG4gICAgICAgIHJlbmRlcmJ1ZmZlci5mb3JtYXQgPSBmb3JtYXRUeXBlc1tmb3JtYXRdXG4gICAgICB9XG5cbiAgICAgIHJlZnJlc2gocmVuZGVyYnVmZmVyKVxuXG4gICAgICByZXR1cm4gcmVnbFJlbmRlcmJ1ZmZlclxuICAgIH1cblxuICAgIHJlZ2xSZW5kZXJidWZmZXIoaW5wdXQpXG5cbiAgICBPYmplY3QuYXNzaWduKHJlZ2xSZW5kZXJidWZmZXIsIHtcbiAgICAgIF9yZWdsVHlwZTogJ3JlbmRlcmJ1ZmZlcicsXG4gICAgICBfcmVuZGVyYnVmZmVyOiByZW5kZXJidWZmZXIsXG4gICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbmRlcmJ1ZmZlci5kZWNSZWYoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVnbFJlbmRlcmJ1ZmZlclxuICB9XG5cbiAgZnVuY3Rpb24gcmVmcmVzaFJlbmRlcmJ1ZmZlcnMgKCkge1xuICAgIHZhbHVlcyhyZW5kZXJidWZmZXJTZXQpLmZvckVhY2gocmVmcmVzaClcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3lSZW5kZXJidWZmZXJzICgpIHtcbiAgICB2YWx1ZXMocmVuZGVyYnVmZmVyU2V0KS5mb3JFYWNoKGRlc3Ryb3kpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZTogY3JlYXRlUmVuZGVyYnVmZmVyLFxuICAgIHJlZnJlc2g6IHJlZnJlc2hSZW5kZXJidWZmZXJzLFxuICAgIGNsZWFyOiBkZXN0cm95UmVuZGVyYnVmZmVyc1xuICB9XG59XG4iLCJ2YXIgY2hlY2sgPSByZXF1aXJlKCcuL2NoZWNrJylcblxudmFyIERFRkFVTFRfRlJBR19TSEFERVIgPSAndm9pZCBtYWluKCl7Z2xfRnJhZ0NvbG9yPXZlYzQoMCwwLDAsMCk7fSdcbnZhciBERUZBVUxUX1ZFUlRfU0hBREVSID0gJ3ZvaWQgbWFpbigpe2dsX1Bvc2l0aW9uPXZlYzQoMCwwLDAsMCk7fSdcblxudmFyIEdMX0ZSQUdNRU5UX1NIQURFUiA9IDM1NjMyXG52YXIgR0xfVkVSVEVYX1NIQURFUiA9IDM1NjMzXG5cbmZ1bmN0aW9uIEFjdGl2ZUluZm8gKG5hbWUsIGxvY2F0aW9uLCBpbmZvKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uXG4gIHRoaXMuaW5mbyA9IGluZm9cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3cmFwU2hhZGVyU3RhdGUgKFxuICBnbCxcbiAgYXR0cmlidXRlU3RhdGUsXG4gIHVuaWZvcm1TdGF0ZSxcbiAgY29tcGlsZVNoYWRlckRyYXcpIHtcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGdsc2wgY29tcGlsYXRpb24gYW5kIGxpbmtpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIHZhciBzaGFkZXJzID0ge31cblxuICB2YXIgZnJhZ1NoYWRlcnMgPSBbREVGQVVMVF9GUkFHX1NIQURFUl1cbiAgdmFyIHZlcnRTaGFkZXJzID0gW0RFRkFVTFRfVkVSVF9TSEFERVJdXG5cbiAgZnVuY3Rpb24gZ2V0U2hhZGVyICh0eXBlLCBzb3VyY2UpIHtcbiAgICB2YXIgY2FjaGUgPSBzaGFkZXJzW3R5cGVdXG4gICAgdmFyIHNoYWRlciA9IGNhY2hlW3NvdXJjZV1cblxuICAgIGlmICghc2hhZGVyKSB7XG4gICAgICBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSlcbiAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSlcbiAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxuXG4gICAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgICB2YXIgZXJyTG9nID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpXG4gICAgICAgIGNoZWNrLnJhaXNlKCdFcnJvciBjb21waWxpbmcgc2hhZGVyOlxcbicgKyBlcnJMb2cpXG4gICAgICB9XG4gICAgICBjYWNoZVtzb3VyY2VdID0gc2hhZGVyXG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlclxuICB9XG5cbiAgZnVuY3Rpb24gcmVmcmVzaFNoYWRlcnMgKCkge1xuICAgIHNoYWRlcnNbR0xfRlJBR01FTlRfU0hBREVSXSA9IHt9XG4gICAgc2hhZGVyc1tHTF9WRVJURVhfU0hBREVSXSA9IHt9XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhclNoYWRlcnMgKCkge1xuICAgIE9iamVjdC5rZXlzKHNoYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIE9iamVjdC5rZXlzKHNoYWRlcnNbdHlwZV0pLmZvckVhY2goZnVuY3Rpb24gKHNoYWRlcikge1xuICAgICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyc1t0eXBlXVtzaGFkZXJdKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHNoYWRlcnNbR0xfRlJBR01FTlRfU0hBREVSXSA9IHt9XG4gICAgc2hhZGVyc1tHTF9WRVJURVhfU0hBREVSXSA9IHt9XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gcHJvZ3JhbSBsaW5raW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgcHJvZ3JhbUNhY2hlID0ge31cbiAgdmFyIHByb2dyYW1MaXN0ID0gW11cblxuICBmdW5jdGlvbiBSRUdMUHJvZ3JhbSAoZnJhZ1NyYywgdmVydFNyYykge1xuICAgIHRoaXMuZnJhZ1NyYyA9IGZyYWdTcmNcbiAgICB0aGlzLnZlcnRTcmMgPSB2ZXJ0U3JjXG4gICAgdGhpcy5wcm9ncmFtID0gbnVsbFxuICAgIHRoaXMudW5pZm9ybXMgPSBbXVxuICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge31cbiAgICB0aGlzLmJhdGNoQ2FjaGUgPSB7fVxuICB9XG5cbiAgT2JqZWN0LmFzc2lnbihSRUdMUHJvZ3JhbS5wcm90b3R5cGUsIHtcbiAgICBsaW5rOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaSwgaW5mb1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBjb21waWxlICYgbGlua1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdmFyIGZyYWdTaGFkZXIgPSBnZXRTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSLCB0aGlzLmZyYWdTcmMpXG4gICAgICB2YXIgdmVydFNoYWRlciA9IGdldFNoYWRlcihnbC5WRVJURVhfU0hBREVSLCB0aGlzLnZlcnRTcmMpXG5cbiAgICAgIHZhciBwcm9ncmFtID0gdGhpcy5wcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpXG4gICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ1NoYWRlcilcbiAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0U2hhZGVyKVxuICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSlcbiAgICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgICAgdmFyIGVyckxvZyA9IGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pXG4gICAgICAgIGNoZWNrLnJhaXNlKCdFcnJvciBsaW5raW5nIHByb2dyYW06XFxuJyArIGVyckxvZylcbiAgICAgIH1cblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gZ3JhYiB1bmlmb3Jtc1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdmFyIG51bVVuaWZvcm1zID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5BQ1RJVkVfVU5JRk9STVMpXG4gICAgICB2YXIgdW5pZm9ybXMgPSB0aGlzLnVuaWZvcm1zID0gW11cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1Vbmlmb3JtczsgKytpKSB7XG4gICAgICAgIGluZm8gPSBnbC5nZXRBY3RpdmVVbmlmb3JtKHByb2dyYW0sIGkpXG4gICAgICAgIGlmIChpbmZvKSB7XG4gICAgICAgICAgaWYgKGluZm8uc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5mby5zaXplOyArK2opIHtcbiAgICAgICAgICAgICAgdmFyIG5hbWUgPSBpbmZvLm5hbWUucmVwbGFjZSgnWzBdJywgJ1snICsgaiArICddJylcbiAgICAgICAgICAgICAgdW5pZm9ybXMucHVzaChuZXcgQWN0aXZlSW5mbyhcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBuYW1lKSxcbiAgICAgICAgICAgICAgICBpbmZvKSlcbiAgICAgICAgICAgICAgdW5pZm9ybVN0YXRlLmRlZihuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bmlmb3Jtcy5wdXNoKG5ldyBBY3RpdmVJbmZvKFxuICAgICAgICAgICAgICBpbmZvLm5hbWUsXG4gICAgICAgICAgICAgIGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBpbmZvLm5hbWUpLFxuICAgICAgICAgICAgICBpbmZvKSlcbiAgICAgICAgICAgIHVuaWZvcm1TdGF0ZS5kZWYoaW5mby5uYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBncmFiIGF0dHJpYnV0ZXNcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHZhciBudW1BdHRyaWJ1dGVzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5BQ1RJVkVfQVRUUklCVVRFUylcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzID0gW11cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1BdHRyaWJ1dGVzOyArK2kpIHtcbiAgICAgICAgaW5mbyA9IGdsLmdldEFjdGl2ZUF0dHJpYihwcm9ncmFtLCBpKVxuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgQWN0aXZlSW5mbyhcbiAgICAgICAgICAgIGluZm8ubmFtZSxcbiAgICAgICAgICAgIGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIGluZm8ubmFtZSksXG4gICAgICAgICAgICBpbmZvKSlcbiAgICAgICAgICBhdHRyaWJ1dGVTdGF0ZS5kZWYoaW5mby5uYW1lKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIGNsZWFyIGNhY2hlZCByZW5kZXJpbmcgbWV0aG9kc1xuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdGhpcy5kcmF3ID0gY29tcGlsZVNoYWRlckRyYXcodGhpcylcbiAgICAgIHRoaXMuYmF0Y2hDYWNoZSA9IHt9XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGdsLmRlbGV0ZVByb2dyYW0odGhpcy5wcm9ncmFtKVxuICAgIH1cbiAgfSlcblxuICBmdW5jdGlvbiBnZXRQcm9ncmFtICh2ZXJ0U291cmNlLCBmcmFnU291cmNlKSB7XG4gICAgdmFyIGNhY2hlID0gcHJvZ3JhbUNhY2hlW2ZyYWdTb3VyY2VdXG4gICAgaWYgKCFjYWNoZSkge1xuICAgICAgY2FjaGUgPSBwcm9ncmFtQ2FjaGVbZnJhZ1NvdXJjZV0gPSB7fVxuICAgIH1cbiAgICB2YXIgcHJvZ3JhbSA9IGNhY2hlW3ZlcnRTb3VyY2VdXG4gICAgaWYgKCFwcm9ncmFtKSB7XG4gICAgICBwcm9ncmFtID0gbmV3IFJFR0xQcm9ncmFtKGZyYWdTb3VyY2UsIHZlcnRTb3VyY2UpXG4gICAgICBwcm9ncmFtLmxpbmsoKVxuICAgICAgY2FjaGVbdmVydFNvdXJjZV0gPSBwcm9ncmFtXG4gICAgICBwcm9ncmFtTGlzdC5wdXNoKHByb2dyYW0pXG4gICAgfVxuICAgIHJldHVybiBwcm9ncmFtXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhclByb2dyYW1zICgpIHtcbiAgICBwcm9ncmFtTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChwcm9ncmFtKSB7XG4gICAgICBwcm9ncmFtLmRlc3Ryb3koKVxuICAgIH0pXG4gICAgcHJvZ3JhbUxpc3QubGVuZ3RoID0gMFxuICAgIHByb2dyYW1DYWNoZSA9IHt9XG4gIH1cblxuICBmdW5jdGlvbiByZWZyZXNoUHJvZ3JhbXMgKCkge1xuICAgIHByb2dyYW1MaXN0LmZvckVhY2goZnVuY3Rpb24gKHByb2dyYW0pIHtcbiAgICAgIHByb2dyYW0ubGluaygpXG4gICAgfSlcbiAgfVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBwcm9ncmFtIHN0YXRlXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgcHJvZ3JhbVN0YXRlID0gW251bGxdXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGNvbnRleHQgbWFuYWdlbWVudFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZnVuY3Rpb24gY2xlYXIgKCkge1xuICAgIGNsZWFyU2hhZGVycygpXG4gICAgY2xlYXJQcm9ncmFtcygpXG4gIH1cblxuICBmdW5jdGlvbiByZWZyZXNoICgpIHtcbiAgICByZWZyZXNoU2hhZGVycygpXG4gICAgcmVmcmVzaFByb2dyYW1zKClcbiAgfVxuXG4gIC8vIFdlIGNhbGwgY2xlYXIgb25jZSB0byBpbml0aWFsaXplIGFsbCBkYXRhIHN0cnVjdHVyZXNcbiAgY2xlYXIoKVxuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlOiBnZXRQcm9ncmFtLFxuICAgIGNsZWFyOiBjbGVhcixcbiAgICByZWZyZXNoOiByZWZyZXNoLFxuICAgIHByb2dyYW1zOiBwcm9ncmFtU3RhdGUsXG4gICAgZnJhZ1NoYWRlcnM6IGZyYWdTaGFkZXJzLFxuICAgIHZlcnRTaGFkZXJzOiB2ZXJ0U2hhZGVyc1xuICB9XG59XG4iLCIvLyBBIHN0YWNrIGZvciBtYW5hZ2luZyB0aGUgc3RhdGUgb2YgYSBzY2FsYXIvdmVjdG9yIHBhcmFtZXRlclxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVN0YWNrIChpbml0LCBvbkNoYW5nZSkge1xuICB2YXIgbiA9IGluaXQubGVuZ3RoXG4gIHZhciBzdGFjayA9IGluaXQuc2xpY2UoKVxuICB2YXIgY3VycmVudCA9IGluaXQuc2xpY2UoKVxuICB2YXIgZGlydHkgPSBmYWxzZVxuICB2YXIgZm9yY2VEaXJ0eSA9IHRydWVcblxuICBmdW5jdGlvbiBwb2xsICgpIHtcbiAgICB2YXIgcHRyID0gc3RhY2subGVuZ3RoIC0gblxuICAgIGlmIChkaXJ0eSB8fCBmb3JjZURpcnR5KSB7XG4gICAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIG9uQ2hhbmdlKHN0YWNrW3B0cl0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIG9uQ2hhbmdlKHN0YWNrW3B0cl0sIHN0YWNrW3B0ciArIDFdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBvbkNoYW5nZShzdGFja1twdHJdLCBzdGFja1twdHIgKyAxXSwgc3RhY2tbcHRyICsgMl0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIG9uQ2hhbmdlKHN0YWNrW3B0cl0sIHN0YWNrW3B0ciArIDFdLCBzdGFja1twdHIgKyAyXSwgc3RhY2tbcHRyICsgM10pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIG9uQ2hhbmdlKHN0YWNrW3B0cl0sIHN0YWNrW3B0ciArIDFdLCBzdGFja1twdHIgKyAyXSwgc3RhY2tbcHRyICsgM10sIHN0YWNrW3B0ciArIDRdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICBvbkNoYW5nZShzdGFja1twdHJdLCBzdGFja1twdHIgKyAxXSwgc3RhY2tbcHRyICsgMl0sIHN0YWNrW3B0ciArIDNdLCBzdGFja1twdHIgKyA0XSwgc3RhY2tbcHRyICsgNV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBvbkNoYW5nZS5hcHBseShudWxsLCBzdGFjay5zbGljZShwdHIsIHN0YWNrLmxlbmd0aCkpXG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgICBjdXJyZW50W2ldID0gc3RhY2tbcHRyICsgaV1cbiAgICAgIH1cbiAgICAgIGZvcmNlRGlydHkgPSBkaXJ0eSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwdXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICBkaXJ0eSA9IGZhbHNlXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgICB2YXIgeCA9IGFyZ3VtZW50c1tpXVxuICAgICAgICBkaXJ0eSA9IGRpcnR5IHx8ICh4ICE9PSBjdXJyZW50W2ldKVxuICAgICAgICBzdGFjay5wdXNoKHgpXG4gICAgICB9XG4gICAgfSxcblxuICAgIHBvcDogZnVuY3Rpb24gKCkge1xuICAgICAgZGlydHkgPSBmYWxzZVxuICAgICAgc3RhY2subGVuZ3RoIC09IG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGRpcnR5ID0gZGlydHkgfHwgKHN0YWNrW3N0YWNrLmxlbmd0aCAtIG4gKyBpXSAhPT0gY3VycmVudFtpXSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcG9sbDogcG9sbCxcblxuICAgIHNldERpcnR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3JjZURpcnR5ID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuIiwidmFyIGNyZWF0ZVN0YWNrID0gcmVxdWlyZSgnLi9zdGFjaycpXG52YXIgY3JlYXRlRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2NvZGVnZW4nKVxuXG4vLyBXZWJHTCBjb25zdGFudHNcbnZhciBHTF9DVUxMX0ZBQ0UgPSAweDBCNDRcbnZhciBHTF9CTEVORCA9IDB4MEJFMlxudmFyIEdMX0RJVEhFUiA9IDB4MEJEMFxudmFyIEdMX1NURU5DSUxfVEVTVCA9IDB4MEI5MFxudmFyIEdMX0RFUFRIX1RFU1QgPSAweDBCNzFcbnZhciBHTF9TQ0lTU09SX1RFU1QgPSAweDBDMTFcbnZhciBHTF9QT0xZR09OX09GRlNFVF9GSUxMID0gMHg4MDM3XG52YXIgR0xfU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFID0gMHg4MDlFXG52YXIgR0xfU0FNUExFX0NPVkVSQUdFID0gMHg4MEEwXG52YXIgR0xfRlVOQ19BREQgPSAweDgwMDZcbnZhciBHTF9aRVJPID0gMFxudmFyIEdMX09ORSA9IDFcbnZhciBHTF9GUk9OVCA9IDEwMjhcbnZhciBHTF9CQUNLID0gMTAyOVxudmFyIEdMX0xFU1MgPSA1MTNcbnZhciBHTF9DQ1cgPSAyMzA1XG52YXIgR0xfQUxXQVlTID0gNTE5XG52YXIgR0xfS0VFUCA9IDc2ODBcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3cmFwQ29udGV4dFN0YXRlIChnbCwgZnJhbWVidWZmZXJTdGF0ZSwgdmlld3BvcnRTdGF0ZSkge1xuICBmdW5jdGlvbiBjYXBTdGFjayAoY2FwLCBkZmx0KSB7XG4gICAgdmFyIHJlc3VsdCA9IGNyZWF0ZVN0YWNrKFshIWRmbHRdLCBmdW5jdGlvbiAoZmxhZykge1xuICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgZ2wuZW5hYmxlKGNhcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdsLmRpc2FibGUoY2FwKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmVzdWx0LmZsYWcgPSBjYXBcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvLyBDYXBzLCBmbGFncyBhbmQgb3RoZXIgcmFuZG9tIFdlYkdMIGNvbnRleHQgc3RhdGVcbiAgdmFyIGNvbnRleHRTdGF0ZSA9IHtcbiAgICAvLyBEaXRoZXJpbmdcbiAgICAnZGl0aGVyJzogY2FwU3RhY2soR0xfRElUSEVSKSxcblxuICAgIC8vIEJsZW5kaW5nXG4gICAgJ2JsZW5kLmVuYWJsZSc6IGNhcFN0YWNrKEdMX0JMRU5EKSxcbiAgICAnYmxlbmQuY29sb3InOiBjcmVhdGVTdGFjayhbMCwgMCwgMCwgMF0sIGZ1bmN0aW9uIChyLCBnLCBiLCBhKSB7XG4gICAgICBnbC5ibGVuZENvbG9yKHIsIGcsIGIsIGEpXG4gICAgfSksXG4gICAgJ2JsZW5kLmVxdWF0aW9uJzogY3JlYXRlU3RhY2soW0dMX0ZVTkNfQURELCBHTF9GVU5DX0FERF0sIGZ1bmN0aW9uIChyZ2IsIGEpIHtcbiAgICAgIGdsLmJsZW5kRXF1YXRpb25TZXBhcmF0ZShyZ2IsIGEpXG4gICAgfSksXG4gICAgJ2JsZW5kLmZ1bmMnOiBjcmVhdGVTdGFjayhbXG4gICAgICBHTF9PTkUsIEdMX1pFUk8sIEdMX09ORSwgR0xfWkVST1xuICAgIF0sIGZ1bmN0aW9uIChzcmNSR0IsIGRzdFJHQiwgc3JjQWxwaGEsIGRzdEFscGhhKSB7XG4gICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZShzcmNSR0IsIGRzdFJHQiwgc3JjQWxwaGEsIGRzdEFscGhhKVxuICAgIH0pLFxuXG4gICAgLy8gRGVwdGhcbiAgICAnZGVwdGguZW5hYmxlJzogY2FwU3RhY2soR0xfREVQVEhfVEVTVCwgdHJ1ZSksXG4gICAgJ2RlcHRoLmZ1bmMnOiBjcmVhdGVTdGFjayhbR0xfTEVTU10sIGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgICBnbC5kZXB0aEZ1bmMoZnVuYylcbiAgICB9KSxcbiAgICAnZGVwdGgucmFuZ2UnOiBjcmVhdGVTdGFjayhbMCwgMV0sIGZ1bmN0aW9uIChuZWFyLCBmYXIpIHtcbiAgICAgIGdsLmRlcHRoUmFuZ2UobmVhciwgZmFyKVxuICAgIH0pLFxuICAgICdkZXB0aC5tYXNrJzogY3JlYXRlU3RhY2soW3RydWVdLCBmdW5jdGlvbiAobSkge1xuICAgICAgZ2wuZGVwdGhNYXNrKG0pXG4gICAgfSksXG5cbiAgICAvLyBGYWNlIGN1bGxpbmdcbiAgICAnY3VsbC5lbmFibGUnOiBjYXBTdGFjayhHTF9DVUxMX0ZBQ0UpLFxuICAgICdjdWxsLmZhY2UnOiBjcmVhdGVTdGFjayhbR0xfQkFDS10sIGZ1bmN0aW9uIChtb2RlKSB7XG4gICAgICBnbC5jdWxsRmFjZShtb2RlKVxuICAgIH0pLFxuXG4gICAgLy8gRnJvbnQgZmFjZSBvcmllbnRhdGlvblxuICAgICdmcm9udEZhY2UnOiBjcmVhdGVTdGFjayhbR0xfQ0NXXSwgZnVuY3Rpb24gKG1vZGUpIHtcbiAgICAgIGdsLmZyb250RmFjZShtb2RlKVxuICAgIH0pLFxuXG4gICAgLy8gV3JpdGUgbWFza3NcbiAgICAnY29sb3JNYXNrJzogY3JlYXRlU3RhY2soW3RydWUsIHRydWUsIHRydWUsIHRydWVdLCBmdW5jdGlvbiAociwgZywgYiwgYSkge1xuICAgICAgZ2wuY29sb3JNYXNrKHIsIGcsIGIsIGEpXG4gICAgfSksXG5cbiAgICAvLyBMaW5lIHdpZHRoXG4gICAgJ2xpbmVXaWR0aCc6IGNyZWF0ZVN0YWNrKFsxXSwgZnVuY3Rpb24gKHcpIHtcbiAgICAgIGdsLmxpbmVXaWR0aCh3KVxuICAgIH0pLFxuXG4gICAgLy8gUG9seWdvbiBvZmZzZXRcbiAgICAncG9seWdvbk9mZnNldC5lbmFibGUnOiBjYXBTdGFjayhHTF9QT0xZR09OX09GRlNFVF9GSUxMKSxcbiAgICAncG9seWdvbk9mZnNldC5vZmZzZXQnOiBjcmVhdGVTdGFjayhbMCwgMF0sIGZ1bmN0aW9uIChmYWN0b3IsIHVuaXRzKSB7XG4gICAgICBnbC5wb2x5Z29uT2Zmc2V0KGZhY3RvciwgdW5pdHMpXG4gICAgfSksXG5cbiAgICAvLyBTYW1wbGUgY292ZXJhZ2VcbiAgICAnc2FtcGxlLmFscGhhJzogY2FwU3RhY2soR0xfU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFKSxcbiAgICAnc2FtcGxlLmVuYWJsZSc6IGNhcFN0YWNrKEdMX1NBTVBMRV9DT1ZFUkFHRSksXG4gICAgJ3NhbXBsZS5jb3ZlcmFnZSc6IGNyZWF0ZVN0YWNrKFsxLCBmYWxzZV0sIGZ1bmN0aW9uICh2YWx1ZSwgaW52ZXJ0KSB7XG4gICAgICBnbC5zYW1wbGVDb3ZlcmFnZSh2YWx1ZSwgaW52ZXJ0KVxuICAgIH0pLFxuXG4gICAgLy8gU3RlbmNpbFxuICAgICdzdGVuY2lsLmVuYWJsZSc6IGNhcFN0YWNrKEdMX1NURU5DSUxfVEVTVCksXG4gICAgJ3N0ZW5jaWwubWFzayc6IGNyZWF0ZVN0YWNrKFstMV0sIGZ1bmN0aW9uIChtYXNrKSB7XG4gICAgICBnbC5zdGVuY2lsTWFzayhtYXNrKVxuICAgIH0pLFxuICAgICdzdGVuY2lsLmZ1bmMnOiBjcmVhdGVTdGFjayhbXG4gICAgICBHTF9BTFdBWVMsIDAsIC0xXG4gICAgXSwgZnVuY3Rpb24gKGZ1bmMsIHJlZiwgbWFzaykge1xuICAgICAgZ2wuc3RlbmNpbEZ1bmMoZnVuYywgcmVmLCBtYXNrKVxuICAgIH0pLFxuICAgICdzdGVuY2lsLm9wRnJvbnQnOiBjcmVhdGVTdGFjayhbXG4gICAgICBHTF9LRUVQLCBHTF9LRUVQLCBHTF9LRUVQXG4gICAgXSwgZnVuY3Rpb24gKGZhaWwsIHpmYWlsLCBwYXNzKSB7XG4gICAgICBnbC5zdGVuY2lsT3BTZXBhcmF0ZShHTF9GUk9OVCwgZmFpbCwgemZhaWwsIHBhc3MpXG4gICAgfSksXG4gICAgJ3N0ZW5jaWwub3BCYWNrJzogY3JlYXRlU3RhY2soW1xuICAgICAgR0xfS0VFUCwgR0xfS0VFUCwgR0xfS0VFUFxuICAgIF0sIGZ1bmN0aW9uIChmYWlsLCB6ZmFpbCwgcGFzcykge1xuICAgICAgZ2wuc3RlbmNpbE9wU2VwYXJhdGUoR0xfQkFDSywgZmFpbCwgemZhaWwsIHBhc3MpXG4gICAgfSksXG5cbiAgICAvLyBTY2lzc29yXG4gICAgJ3NjaXNzb3IuZW5hYmxlJzogY2FwU3RhY2soR0xfU0NJU1NPUl9URVNUKSxcbiAgICAnc2Npc3Nvci5ib3gnOiBjcmVhdGVTdGFjayhbMCwgMCwgLTEsIC0xXSwgZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcbiAgICAgIHZhciB3XyA9IHdcbiAgICAgIHZhciBmYm8gPSBmcmFtZWJ1ZmZlclN0YXRlLnRvcCgpXG4gICAgICBpZiAodyA8IDApIHtcbiAgICAgICAgaWYgKGZibykge1xuICAgICAgICAgIHdfID0gZmJvLndpZHRoIC0geFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdfID0gZ2wuZHJhd2luZ0J1ZmZlcldpZHRoIC0geFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgaF8gPSBoXG4gICAgICBpZiAoaCA8IDApIHtcbiAgICAgICAgaWYgKGZibykge1xuICAgICAgICAgIGhfID0gZmJvLmhlaWdodCAtIHlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoXyA9IGdsLmRyYXdpbmdCdWZmZXJIZWlnaHQgLSB5XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGdsLnNjaXNzb3IoeCwgeSwgd18sIGhfKVxuICAgIH0pLFxuXG4gICAgLy8gVmlld3BvcnRcbiAgICAndmlld3BvcnQnOiBjcmVhdGVTdGFjayhbMCwgMCwgLTEsIC0xXSwgZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcbiAgICAgIHZhciB3XyA9IHdcbiAgICAgIHZhciBmYm8gPSBmcmFtZWJ1ZmZlclN0YXRlLnRvcCgpXG4gICAgICBpZiAodyA8IDApIHtcbiAgICAgICAgaWYgKGZibykge1xuICAgICAgICAgIHdfID0gZmJvLndpZHRoIC0geFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdfID0gZ2wuZHJhd2luZ0J1ZmZlcldpZHRoIC0geFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgaF8gPSBoXG4gICAgICBpZiAoaCA8IDApIHtcbiAgICAgICAgaWYgKGZibykge1xuICAgICAgICAgIGhfID0gZmJvLmhlaWdodCAtIHlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoXyA9IGdsLmRyYXdpbmdCdWZmZXJIZWlnaHQgLSB5XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGdsLnZpZXdwb3J0KHgsIHksIHdfLCBoXylcbiAgICAgIHZpZXdwb3J0U3RhdGUud2lkdGggPSB3X1xuICAgICAgdmlld3BvcnRTdGF0ZS5oZWlnaHQgPSBoX1xuICAgIH0pXG4gIH1cblxuICB2YXIgZW52ID0gY3JlYXRlRW52aXJvbm1lbnQoKVxuICB2YXIgcG9sbCA9IGVudi5wcm9jKCdwb2xsJylcbiAgdmFyIHJlZnJlc2ggPSBlbnYucHJvYygncmVmcmVzaCcpXG4gIE9iamVjdC5rZXlzKGNvbnRleHRTdGF0ZSkuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIHZhciBTVEFDSyA9IGVudi5saW5rKGNvbnRleHRTdGF0ZVtwcm9wXSlcbiAgICBwb2xsKFNUQUNLLCAnLnBvbGwoKTsnKVxuICAgIHJlZnJlc2goU1RBQ0ssICcuc2V0RGlydHkoKTsnKVxuICB9KVxuXG4gIHZhciBwcm9jcyA9IGVudi5jb21waWxlKClcblxuICByZXR1cm4ge1xuICAgIGNvbnRleHRTdGF0ZTogY29udGV4dFN0YXRlLFxuICAgIHZpZXdwb3J0OiB2aWV3cG9ydFN0YXRlLFxuICAgIHBvbGw6IHByb2NzLnBvbGwsXG4gICAgcmVmcmVzaDogcHJvY3MucmVmcmVzaCxcblxuICAgIG5vdGlmeVZpZXdwb3J0Q2hhbmdlZDogZnVuY3Rpb24gKCkge1xuICAgICAgY29udGV4dFN0YXRlLnZpZXdwb3J0LnNldERpcnR5KClcbiAgICAgIGNvbnRleHRTdGF0ZVsnc2Npc3Nvci5ib3gnXS5zZXREaXJ0eSgpXG4gICAgfVxuICB9XG59XG4iLCJ2YXIgY2hlY2sgPSByZXF1aXJlKCcuL2NoZWNrJylcbnZhciB2YWx1ZXMgPSByZXF1aXJlKCcuL3ZhbHVlcycpXG52YXIgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pcy10eXBlZC1hcnJheScpXG52YXIgaXNOREFycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXMtbmRhcnJheScpXG52YXIgbG9hZFRleHR1cmUgPSByZXF1aXJlKCcuL2xvYWQtdGV4dHVyZScpXG52YXIgY29udmVydFRvSGFsZkZsb2F0ID0gcmVxdWlyZSgnLi90by1oYWxmLWZsb2F0JylcbnZhciBwYXJzZUREUyA9IHJlcXVpcmUoJy4vcGFyc2UtZGRzJylcblxudmFyIEdMX0NPTVBSRVNTRURfVEVYVFVSRV9GT1JNQVRTID0gMHg4NkEzXG5cbnZhciBHTF9URVhUVVJFXzJEID0gMHgwREUxXG52YXIgR0xfVEVYVFVSRV9DVUJFX01BUCA9IDB4ODUxM1xudmFyIEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCA9IDB4ODUxNVxuXG52YXIgR0xfUkdCQSA9IDB4MTkwOFxudmFyIEdMX0FMUEhBID0gMHgxOTA2XG52YXIgR0xfUkdCID0gMHgxOTA3XG52YXIgR0xfTFVNSU5BTkNFID0gMHgxOTA5XG52YXIgR0xfTFVNSU5BTkNFX0FMUEhBID0gMHgxOTBBXG5cbnZhciBHTF9SR0JBNCA9IDB4ODA1NlxudmFyIEdMX1JHQjVfQTEgPSAweDgwNTdcbnZhciBHTF9SR0I1NjUgPSAweDhENjJcblxudmFyIEdMX1VOU0lHTkVEX1NIT1JUXzRfNF80XzQgPSAweDgwMzNcbnZhciBHTF9VTlNJR05FRF9TSE9SVF81XzVfNV8xID0gMHg4MDM0XG52YXIgR0xfVU5TSUdORURfU0hPUlRfNV82XzUgPSAweDgzNjNcbnZhciBHTF9VTlNJR05FRF9JTlRfMjRfOF9XRUJHTCA9IDB4ODRGQVxuXG52YXIgR0xfREVQVEhfQ09NUE9ORU5UID0gMHgxOTAyXG52YXIgR0xfREVQVEhfU1RFTkNJTCA9IDB4ODRGOVxuXG52YXIgR0xfU1JHQl9FWFQgPSAweDhDNDBcbnZhciBHTF9TUkdCX0FMUEhBX0VYVCA9IDB4OEM0MlxuXG52YXIgR0xfSEFMRl9GTE9BVF9PRVMgPSAweDhENjFcblxudmFyIEdMX0NPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFQgPSAweDgzRjBcbnZhciBHTF9DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQxX0VYVCA9IDB4ODNGMVxudmFyIEdMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDNfRVhUID0gMHg4M0YyXG52YXIgR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQgPSAweDgzRjNcblxudmFyIEdMX0NPTVBSRVNTRURfUkdCX0FUQ19XRUJHTCA9IDB4OEM5MlxudmFyIEdMX0NPTVBSRVNTRURfUkdCQV9BVENfRVhQTElDSVRfQUxQSEFfV0VCR0wgPSAweDhDOTNcbnZhciBHTF9DT01QUkVTU0VEX1JHQkFfQVRDX0lOVEVSUE9MQVRFRF9BTFBIQV9XRUJHTCA9IDB4ODdFRVxuXG52YXIgR0xfQ09NUFJFU1NFRF9SR0JfUFZSVENfNEJQUFYxX0lNRyA9IDB4OEMwMFxudmFyIEdMX0NPTVBSRVNTRURfUkdCX1BWUlRDXzJCUFBWMV9JTUcgPSAweDhDMDFcbnZhciBHTF9DT01QUkVTU0VEX1JHQkFfUFZSVENfNEJQUFYxX0lNRyA9IDB4OEMwMlxudmFyIEdMX0NPTVBSRVNTRURfUkdCQV9QVlJUQ18yQlBQVjFfSU1HID0gMHg4QzAzXG5cbnZhciBHTF9DT01QUkVTU0VEX1JHQl9FVEMxX1dFQkdMID0gMHg4RDY0XG5cbnZhciBHTF9VTlNJR05FRF9CWVRFID0gMHgxNDAxXG52YXIgR0xfVU5TSUdORURfU0hPUlQgPSAweDE0MDNcbnZhciBHTF9VTlNJR05FRF9JTlQgPSAweDE0MDVcbnZhciBHTF9GTE9BVCA9IDB4MTQwNlxuXG52YXIgR0xfVEVYVFVSRV9XUkFQX1MgPSAweDI4MDJcbnZhciBHTF9URVhUVVJFX1dSQVBfVCA9IDB4MjgwM1xuXG52YXIgR0xfUkVQRUFUID0gMHgyOTAxXG52YXIgR0xfQ0xBTVBfVE9fRURHRSA9IDB4ODEyRlxudmFyIEdMX01JUlJPUkVEX1JFUEVBVCA9IDB4ODM3MFxuXG52YXIgR0xfVEVYVFVSRV9NQUdfRklMVEVSID0gMHgyODAwXG52YXIgR0xfVEVYVFVSRV9NSU5fRklMVEVSID0gMHgyODAxXG5cbnZhciBHTF9ORUFSRVNUID0gMHgyNjAwXG52YXIgR0xfTElORUFSID0gMHgyNjAxXG52YXIgR0xfTkVBUkVTVF9NSVBNQVBfTkVBUkVTVCA9IDB4MjcwMFxudmFyIEdMX0xJTkVBUl9NSVBNQVBfTkVBUkVTVCA9IDB4MjcwMVxudmFyIEdMX05FQVJFU1RfTUlQTUFQX0xJTkVBUiA9IDB4MjcwMlxudmFyIEdMX0xJTkVBUl9NSVBNQVBfTElORUFSID0gMHgyNzAzXG5cbnZhciBHTF9HRU5FUkFURV9NSVBNQVBfSElOVCA9IDB4ODE5MlxudmFyIEdMX0RPTlRfQ0FSRSA9IDB4MTEwMFxudmFyIEdMX0ZBU1RFU1QgPSAweDExMDFcbnZhciBHTF9OSUNFU1QgPSAweDExMDJcblxudmFyIEdMX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhUID0gMHg4NEZFXG5cbnZhciBHTF9VTlBBQ0tfQUxJR05NRU5UID0gMHgwQ0Y1XG52YXIgR0xfVU5QQUNLX0ZMSVBfWV9XRUJHTCA9IDB4OTI0MFxudmFyIEdMX1VOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCA9IDB4OTI0MVxudmFyIEdMX1VOUEFDS19DT0xPUlNQQUNFX0NPTlZFUlNJT05fV0VCR0wgPSAweDkyNDNcblxudmFyIEdMX0JST1dTRVJfREVGQVVMVF9XRUJHTCA9IDB4OTI0NFxuXG52YXIgR0xfVEVYVFVSRTAgPSAweDg0QzBcblxudmFyIE1JUE1BUF9GSUxURVJTID0gW1xuICBHTF9ORUFSRVNUX01JUE1BUF9ORUFSRVNULFxuICBHTF9ORUFSRVNUX01JUE1BUF9MSU5FQVIsXG4gIEdMX0xJTkVBUl9NSVBNQVBfTkVBUkVTVCxcbiAgR0xfTElORUFSX01JUE1BUF9MSU5FQVJcbl1cblxuZnVuY3Rpb24gaXNQb3cyICh2KSB7XG4gIHJldHVybiAhKHYgJiAodiAtIDEpKSAmJiAoISF2KVxufVxuXG5mdW5jdGlvbiBpc051bWVyaWNBcnJheSAoYXJyKSB7XG4gIHJldHVybiAoXG4gICAgQXJyYXkuaXNBcnJheShhcnIpICYmXG4gICAgKGFyci5sZW5ndGggPT09IDAgfHxcbiAgICB0eXBlb2YgYXJyWzBdID09PSAnbnVtYmVyJykpXG59XG5cbmZ1bmN0aW9uIGlzUmVjdEFycmF5IChhcnIpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHZhciB3aWR0aCA9IGFyci5sZW5ndGhcbiAgaWYgKHdpZHRoID09PSAwIHx8ICFBcnJheS5pc0FycmF5KGFyclswXSkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHZhciBoZWlnaHQgPSBhcnJbMF0ubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgd2lkdGg7ICsraSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJbaV0pIHx8IGFycltpXS5sZW5ndGggIT09IGhlaWdodCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGNsYXNzU3RyaW5nICh4KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeClcbn1cblxuZnVuY3Rpb24gaXNDYW52YXNFbGVtZW50IChvYmplY3QpIHtcbiAgcmV0dXJuIGNsYXNzU3RyaW5nKG9iamVjdCkgPT09ICdbb2JqZWN0IEhUTUxDYW52YXNFbGVtZW50XSdcbn1cblxuZnVuY3Rpb24gaXNDb250ZXh0MkQgKG9iamVjdCkge1xuICByZXR1cm4gY2xhc3NTdHJpbmcob2JqZWN0KSA9PT0gJ1tvYmplY3QgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXSdcbn1cblxuZnVuY3Rpb24gaXNJbWFnZUVsZW1lbnQgKG9iamVjdCkge1xuICByZXR1cm4gY2xhc3NTdHJpbmcob2JqZWN0KSA9PT0gJ1tvYmplY3QgSFRNTEltYWdlRWxlbWVudF0nXG59XG5cbmZ1bmN0aW9uIGlzVmlkZW9FbGVtZW50IChvYmplY3QpIHtcbiAgcmV0dXJuIGNsYXNzU3RyaW5nKG9iamVjdCkgPT09ICdbb2JqZWN0IEhUTUxWaWRlb0VsZW1lbnRdJ1xufVxuXG5mdW5jdGlvbiBpc1BlbmRpbmdYSFIgKG9iamVjdCkge1xuICByZXR1cm4gY2xhc3NTdHJpbmcob2JqZWN0KSA9PT0gJ1tvYmplY3QgWE1MSHR0cFJlcXVlc3RdJ1xufVxuXG5mdW5jdGlvbiBpc1BpeGVsRGF0YSAob2JqZWN0KSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIG9iamVjdCA9PT0gJ3N0cmluZycgfHxcbiAgICAoISFvYmplY3QgJiYgKFxuICAgICAgaXNUeXBlZEFycmF5KG9iamVjdCkgfHxcbiAgICAgIGlzTnVtZXJpY0FycmF5KG9iamVjdCkgfHxcbiAgICAgIGlzTkRBcnJheUxpa2Uob2JqZWN0KSB8fFxuICAgICAgaXNDYW52YXNFbGVtZW50KG9iamVjdCkgfHxcbiAgICAgIGlzQ29udGV4dDJEKG9iamVjdCkgfHxcbiAgICAgIGlzSW1hZ2VFbGVtZW50KG9iamVjdCkgfHxcbiAgICAgIGlzVmlkZW9FbGVtZW50KG9iamVjdCkgfHxcbiAgICAgIGlzUmVjdEFycmF5KG9iamVjdCkpKSlcbn1cblxuLy8gVHJhbnNwb3NlIGFuIGFycmF5IG9mIHBpeGVsc1xuZnVuY3Rpb24gdHJhbnNwb3NlUGl4ZWxzIChkYXRhLCBueCwgbnksIG5jLCBzeCwgc3ksIHNjLCBvZmYpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKG54ICogbnkgKiBuYylcbiAgdmFyIHB0ciA9IDBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBueTsgKytpKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBueDsgKytqKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IG5jOyArK2spIHtcbiAgICAgICAgcmVzdWx0W3B0cisrXSA9IGRhdGFbc3kgKiBpICsgc3ggKiBqICsgc2MgKiBrICsgb2ZmXVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVGV4dHVyZVNldCAoZ2wsIGV4dGVuc2lvbnMsIGxpbWl0cywgcmVnbFBvbGwsIHZpZXdwb3J0U3RhdGUpIHtcbiAgdmFyIG1pcG1hcEhpbnQgPSB7XG4gICAgXCJkb24ndCBjYXJlXCI6IEdMX0RPTlRfQ0FSRSxcbiAgICAnZG9udCBjYXJlJzogR0xfRE9OVF9DQVJFLFxuICAgICduaWNlJzogR0xfTklDRVNULFxuICAgICdmYXN0JzogR0xfRkFTVEVTVFxuICB9XG5cbiAgdmFyIHdyYXBNb2RlcyA9IHtcbiAgICAncmVwZWF0JzogR0xfUkVQRUFULFxuICAgICdjbGFtcCc6IEdMX0NMQU1QX1RPX0VER0UsXG4gICAgJ21pcnJvcic6IEdMX01JUlJPUkVEX1JFUEVBVFxuICB9XG5cbiAgdmFyIG1hZ0ZpbHRlcnMgPSB7XG4gICAgJ25lYXJlc3QnOiBHTF9ORUFSRVNULFxuICAgICdsaW5lYXInOiBHTF9MSU5FQVJcbiAgfVxuXG4gIHZhciBtaW5GaWx0ZXJzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgJ25lYXJlc3QgbWlwbWFwIG5lYXJlc3QnOiBHTF9ORUFSRVNUX01JUE1BUF9ORUFSRVNULFxuICAgICdsaW5lYXIgbWlwbWFwIG5lYXJlc3QnOiBHTF9MSU5FQVJfTUlQTUFQX05FQVJFU1QsXG4gICAgJ25lYXJlc3QgbWlwbWFwIGxpbmVhcic6IEdMX05FQVJFU1RfTUlQTUFQX0xJTkVBUixcbiAgICAnbGluZWFyIG1pcG1hcCBsaW5lYXInOiBHTF9MSU5FQVJfTUlQTUFQX0xJTkVBUixcbiAgICAnbWlwbWFwJzogR0xfTElORUFSX01JUE1BUF9MSU5FQVJcbiAgfSwgbWFnRmlsdGVycylcblxuICB2YXIgY29sb3JTcGFjZSA9IHtcbiAgICAnbm9uZSc6IDAsXG4gICAgJ2Jyb3dzZXInOiBHTF9CUk9XU0VSX0RFRkFVTFRfV0VCR0xcbiAgfVxuXG4gIHZhciB0ZXh0dXJlVHlwZXMgPSB7XG4gICAgJ3VpbnQ4JzogR0xfVU5TSUdORURfQllURSxcbiAgICAncmdiYTQnOiBHTF9VTlNJR05FRF9TSE9SVF80XzRfNF80LFxuICAgICdyZ2I1NjUnOiBHTF9VTlNJR05FRF9TSE9SVF81XzZfNSxcbiAgICAncmdiNSBhMSc6IEdMX1VOU0lHTkVEX1NIT1JUXzVfNV81XzFcbiAgfVxuXG4gIHZhciB0ZXh0dXJlRm9ybWF0cyA9IHtcbiAgICAnYWxwaGEnOiBHTF9BTFBIQSxcbiAgICAnbHVtaW5hbmNlJzogR0xfTFVNSU5BTkNFLFxuICAgICdsdW1pbmFuY2UgYWxwaGEnOiBHTF9MVU1JTkFOQ0VfQUxQSEEsXG4gICAgJ3JnYic6IEdMX1JHQixcbiAgICAncmdiYSc6IEdMX1JHQkEsXG4gICAgJ3JnYmE0JzogR0xfUkdCQTQsXG4gICAgJ3JnYjUgYTEnOiBHTF9SR0I1X0ExLFxuICAgICdyZ2I1NjUnOiBHTF9SR0I1NjVcbiAgfVxuXG4gIHZhciBjb21wcmVzc2VkVGV4dHVyZUZvcm1hdHMgPSB7fVxuXG4gIGlmIChleHRlbnNpb25zLmV4dF9zcmdiKSB7XG4gICAgdGV4dHVyZUZvcm1hdHMuc3JnYiA9IEdMX1NSR0JfRVhUXG4gICAgdGV4dHVyZUZvcm1hdHMuc3JnYmEgPSBHTF9TUkdCX0FMUEhBX0VYVFxuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMub2VzX3RleHR1cmVfZmxvYXQpIHtcbiAgICB0ZXh0dXJlVHlwZXMuZmxvYXQgPSBHTF9GTE9BVFxuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMub2VzX3RleHR1cmVfaGFsZl9mbG9hdCkge1xuICAgIHRleHR1cmVUeXBlc1snaGFsZiBmbG9hdCddID0gR0xfSEFMRl9GTE9BVF9PRVNcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2RlcHRoX3RleHR1cmUpIHtcbiAgICBPYmplY3QuYXNzaWduKHRleHR1cmVGb3JtYXRzLCB7XG4gICAgICAnZGVwdGgnOiBHTF9ERVBUSF9DT01QT05FTlQsXG4gICAgICAnZGVwdGggc3RlbmNpbCc6IEdMX0RFUFRIX1NURU5DSUxcbiAgICB9KVxuXG4gICAgT2JqZWN0LmFzc2lnbih0ZXh0dXJlVHlwZXMsIHtcbiAgICAgICd1aW50MTYnOiBHTF9VTlNJR05FRF9TSE9SVCxcbiAgICAgICd1aW50MzInOiBHTF9VTlNJR05FRF9JTlQsXG4gICAgICAnZGVwdGggc3RlbmNpbCc6IEdMX1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMXG4gICAgfSlcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjKSB7XG4gICAgT2JqZWN0LmFzc2lnbihjb21wcmVzc2VkVGV4dHVyZUZvcm1hdHMsIHtcbiAgICAgICdyZ2IgczN0YyBkeHQxJzogR0xfQ09NUFJFU1NFRF9SR0JfUzNUQ19EWFQxX0VYVCxcbiAgICAgICdyZ2JhIHMzdGMgZHh0MSc6IEdMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDFfRVhULFxuICAgICAgJ3JnYmEgczN0YyBkeHQzJzogR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUM19FWFQsXG4gICAgICAncmdiYSBzM3RjIGR4dDUnOiBHTF9DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQ1X0VYVFxuICAgIH0pXG4gIH1cblxuICBpZiAoZXh0ZW5zaW9ucy53ZWJnbF9jb21wcmVzc2VkX3RleHR1cmVfYXRjKSB7XG4gICAgT2JqZWN0LmFzc2lnbihjb21wcmVzc2VkVGV4dHVyZUZvcm1hdHMsIHtcbiAgICAgICdyZ2IgYXJjJzogR0xfQ09NUFJFU1NFRF9SR0JfQVRDX1dFQkdMLFxuICAgICAgJ3JnYmEgYXRjIGV4cGxpY2l0IGFscGhhJzogR0xfQ09NUFJFU1NFRF9SR0JBX0FUQ19FWFBMSUNJVF9BTFBIQV9XRUJHTCxcbiAgICAgICdyZ2JhIGF0YyBpbnRlcnBvbGF0ZWQgYWxwaGEnOiBHTF9DT01QUkVTU0VEX1JHQkFfQVRDX0lOVEVSUE9MQVRFRF9BTFBIQV9XRUJHTFxuICAgIH0pXG4gIH1cblxuICBpZiAoZXh0ZW5zaW9ucy53ZWJnbF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMpIHtcbiAgICBPYmplY3QuYXNzaWduKGNvbXByZXNzZWRUZXh0dXJlRm9ybWF0cywge1xuICAgICAgJ3JnYiBwdnJ0YyA0YnBwdjEnOiBHTF9DT01QUkVTU0VEX1JHQl9QVlJUQ180QlBQVjFfSU1HLFxuICAgICAgJ3JnYiBwdnJ0YyAyYnBwdjEnOiBHTF9DT01QUkVTU0VEX1JHQl9QVlJUQ18yQlBQVjFfSU1HLFxuICAgICAgJ3JnYmEgcHZydGMgNGJwcHYxJzogR0xfQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzRCUFBWMV9JTUcsXG4gICAgICAncmdiYSBwdnJ0YyAyYnBwdjEnOiBHTF9DT01QUkVTU0VEX1JHQkFfUFZSVENfMkJQUFYxX0lNR1xuICAgIH0pXG4gIH1cblxuICBpZiAoZXh0ZW5zaW9ucy53ZWJnbF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMSkge1xuICAgIGNvbXByZXNzZWRUZXh0dXJlRm9ybWF0c1sncmdiIGV0YzEnXSA9IEdMX0NPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0xcbiAgfVxuXG4gIC8vIENvcHkgb3ZlciBhbGwgdGV4dHVyZSBmb3JtYXRzXG4gIHZhciBzdXBwb3J0ZWRDb21wcmVzc2VkRm9ybWF0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxuICAgIGdsLmdldFBhcmFtZXRlcihHTF9DT01QUkVTU0VEX1RFWFRVUkVfRk9STUFUUykpXG4gIE9iamVjdC5rZXlzKGNvbXByZXNzZWRUZXh0dXJlRm9ybWF0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBmb3JtYXQgPSBjb21wcmVzc2VkVGV4dHVyZUZvcm1hdHNbbmFtZV1cbiAgICBpZiAoc3VwcG9ydGVkQ29tcHJlc3NlZEZvcm1hdHMuaW5kZXhPZihmb3JtYXQpID49IDApIHtcbiAgICAgIHRleHR1cmVGb3JtYXRzW25hbWVdID0gZm9ybWF0XG4gICAgfVxuICB9KVxuXG4gIHZhciBzdXBwb3J0ZWRGb3JtYXRzID0gT2JqZWN0LmtleXModGV4dHVyZUZvcm1hdHMpXG4gIGxpbWl0cy50ZXh0dXJlRm9ybWF0cyA9IHN1cHBvcnRlZEZvcm1hdHNcblxuICB2YXIgY29sb3JGb3JtYXRzID0gc3VwcG9ydGVkRm9ybWF0cy5yZWR1Y2UoZnVuY3Rpb24gKGNvbG9yLCBrZXkpIHtcbiAgICB2YXIgZ2xlbnVtID0gdGV4dHVyZUZvcm1hdHNba2V5XVxuICAgIGlmIChnbGVudW0gPT09IEdMX0xVTUlOQU5DRSB8fFxuICAgICAgICBnbGVudW0gPT09IEdMX0FMUEhBIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfTFVNSU5BTkNFIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfTFVNSU5BTkNFX0FMUEhBIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfREVQVEhfQ09NUE9ORU5UIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfREVQVEhfU1RFTkNJTCkge1xuICAgICAgY29sb3JbZ2xlbnVtXSA9IGdsZW51bVxuICAgIH0gZWxzZSBpZiAoZ2xlbnVtID09PSBHTF9SR0I1X0ExIHx8IGtleS5pbmRleE9mKCdyZ2JhJykgPj0gMCkge1xuICAgICAgY29sb3JbZ2xlbnVtXSA9IEdMX1JHQkFcbiAgICB9IGVsc2Uge1xuICAgICAgY29sb3JbZ2xlbnVtXSA9IEdMX1JHQlxuICAgIH1cbiAgICByZXR1cm4gY29sb3JcbiAgfSwge30pXG5cbiAgLy8gUGl4ZWwgc3RvcmFnZSBwYXJzaW5nXG4gIGZ1bmN0aW9uIFBpeGVsSW5mbyAodGFyZ2V0KSB7XG4gICAgLy8gdGV4IHRhcmdldFxuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICAvLyBwaXhlbFN0b3JlaSBpbmZvXG4gICAgdGhpcy5mbGlwWSA9IGZhbHNlXG4gICAgdGhpcy5wcmVtdWx0aXBseUFscGhhID0gZmFsc2VcbiAgICB0aGlzLnVucGFja0FsaWdubWVudCA9IDFcbiAgICB0aGlzLmNvbG9yU3BhY2UgPSAwXG5cbiAgICAvLyBzaGFwZVxuICAgIHRoaXMud2lkdGggPSAwXG4gICAgdGhpcy5oZWlnaHQgPSAwXG4gICAgdGhpcy5jaGFubmVscyA9IDBcblxuICAgIC8vIGZvcm1hdCBhbmQgdHlwZVxuICAgIHRoaXMuZm9ybWF0ID0gMFxuICAgIHRoaXMuaW50ZXJuYWxmb3JtYXQgPSAwXG4gICAgdGhpcy50eXBlID0gMFxuICAgIHRoaXMuY29tcHJlc3NlZCA9IGZhbHNlXG5cbiAgICAvLyBtaXAgbGV2ZWxcbiAgICB0aGlzLm1pcGxldmVsID0gMFxuXG4gICAgLy8gbmRhcnJheS1saWtlIHBhcmFtZXRlcnNcbiAgICB0aGlzLnN0cmlkZVggPSAwXG4gICAgdGhpcy5zdHJpZGVZID0gMFxuICAgIHRoaXMuc3RyaWRlQyA9IDBcbiAgICB0aGlzLm9mZnNldCA9IDBcblxuICAgIC8vIGNvcHkgcGl4ZWxzIGluZm9cbiAgICB0aGlzLnggPSAwXG4gICAgdGhpcy55ID0gMFxuICAgIHRoaXMuY29weSA9IGZhbHNlXG5cbiAgICAvLyBkYXRhIHNvdXJjZXNcbiAgICB0aGlzLmRhdGEgPSBudWxsXG4gICAgdGhpcy5pbWFnZSA9IG51bGxcbiAgICB0aGlzLnZpZGVvID0gbnVsbFxuICAgIHRoaXMuY2FudmFzID0gbnVsbFxuICAgIHRoaXMueGhyID0gbnVsbFxuXG4gICAgLy8gQ09SU1xuICAgIHRoaXMuY3Jvc3NPcmlnaW4gPSBudWxsXG5cbiAgICAvLyBob3JyaWJsZSBzdGF0ZSBmbGFnc1xuICAgIHRoaXMubmVlZHNQb2xsID0gZmFsc2VcbiAgICB0aGlzLm5lZWRzTGlzdGVuZXJzID0gZmFsc2VcbiAgfVxuXG4gIE9iamVjdC5hc3NpZ24oUGl4ZWxJbmZvLnByb3RvdHlwZSwge1xuICAgIHBhcnNlRmxhZ3M6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnIHx8ICFvcHRpb25zKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoJ3ByZW11bHRpcGx5QWxwaGEnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgY2hlY2sudHlwZShvcHRpb25zLnByZW11bHRpcGx5QWxwaGEsICdib29sZWFuJyxcbiAgICAgICAgICAnaW52YWxpZCBwcmVtdWx0aXBseUFscGhhJylcbiAgICAgICAgdGhpcy5wcmVtdWx0aXBseUFscGhhID0gb3B0aW9ucy5wcmVtdWx0aXBseUFscGhhXG4gICAgICB9XG5cbiAgICAgIGlmICgnZmxpcFknIGluIG9wdGlvbnMpIHtcbiAgICAgICAgY2hlY2sudHlwZShvcHRpb25zLmZsaXBZLCAnYm9vbGVhbicsXG4gICAgICAgICAgJ2ludmFsaWQgdGV4dHVyZSBmbGlwJylcbiAgICAgICAgdGhpcy5mbGlwWSA9IG9wdGlvbnMuZmxpcFlcbiAgICAgIH1cblxuICAgICAgaWYgKCdhbGlnbm1lbnQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgY2hlY2sub25lT2Yob3B0aW9ucy5hbGlnbm1lbnQsIFsxLCAyLCA0LCA4XSxcbiAgICAgICAgICAnaW52YWxpZCB0ZXh0dXJlIHVucGFjayBhbGlnbm1lbnQnKVxuICAgICAgICB0aGlzLnVucGFja0FsaWdubWVudCA9IG9wdGlvbnMuYWxpZ25tZW50XG4gICAgICB9XG5cbiAgICAgIGlmICgnY29sb3JTcGFjZScgaW4gb3B0aW9ucykge1xuICAgICAgICBjaGVjay5wYXJhbWV0ZXIob3B0aW9ucy5jb2xvclNwYWNlLCBjb2xvclNwYWNlLFxuICAgICAgICAgICdpbnZhbGlkIGNvbG9yU3BhY2UnKVxuICAgICAgICB0aGlzLmNvbG9yU3BhY2UgPSBjb2xvclNwYWNlW29wdGlvbnMuY29sb3JTcGFjZV1cbiAgICAgIH1cblxuICAgICAgaWYgKCdmb3JtYXQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IG9wdGlvbnMuZm9ybWF0XG4gICAgICAgIGNoZWNrLnBhcmFtZXRlcihmb3JtYXQsIHRleHR1cmVGb3JtYXRzLFxuICAgICAgICAgICdpbnZhbGlkIHRleHR1cmUgZm9ybWF0JylcbiAgICAgICAgdGhpcy5pbnRlcm5hbGZvcm1hdCA9IHRleHR1cmVGb3JtYXRzW2Zvcm1hdF1cbiAgICAgICAgaWYgKGZvcm1hdCBpbiB0ZXh0dXJlVHlwZXMpIHtcbiAgICAgICAgICB0aGlzLnR5cGUgPSB0ZXh0dXJlVHlwZXNbZm9ybWF0XVxuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgaW4gY29tcHJlc3NlZFRleHR1cmVGb3JtYXRzKSB7XG4gICAgICAgICAgdGhpcy5jb21wcmVzc2VkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgndHlwZScgaW4gb3B0aW9ucykge1xuICAgICAgICB2YXIgdHlwZSA9IG9wdGlvbnMudHlwZVxuICAgICAgICBjaGVjay5wYXJhbWV0ZXIodHlwZSwgdGV4dHVyZVR5cGVzLFxuICAgICAgICAgICdpbnZhbGlkIHRleHR1cmUgdHlwZScpXG4gICAgICAgIHRoaXMudHlwZSA9IHRleHR1cmVUeXBlc1t0eXBlXVxuICAgICAgfVxuXG4gICAgICB2YXIgdyA9IHRoaXMud2lkdGhcbiAgICAgIHZhciBoID0gdGhpcy5oZWlnaHRcbiAgICAgIHZhciBjID0gdGhpcy5jaGFubmVsc1xuICAgICAgaWYgKCdzaGFwZScgaW4gb3B0aW9ucykge1xuICAgICAgICBjaGVjayhBcnJheS5pc0FycmF5KG9wdGlvbnMuc2hhcGUpICYmIG9wdGlvbnMuc2hhcGUubGVuZ3RoID49IDIsXG4gICAgICAgICAgJ3NoYXBlIG11c3QgYmUgYW4gYXJyYXknKVxuICAgICAgICB3ID0gb3B0aW9ucy5zaGFwZVswXVxuICAgICAgICBoID0gb3B0aW9ucy5zaGFwZVsxXVxuICAgICAgICBpZiAob3B0aW9ucy5zaGFwZS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICBjID0gb3B0aW9ucy5zaGFwZVsyXVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoJ3JhZGl1cycgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHcgPSBoID0gb3B0aW9ucy5yYWRpdXNcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ3dpZHRoJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdyA9IG9wdGlvbnMud2lkdGhcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2hlaWdodCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGggPSBvcHRpb25zLmhlaWdodFxuICAgICAgICB9XG4gICAgICAgIGlmICgnY2hhbm5lbHMnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBjID0gb3B0aW9ucy5jaGFubmVsc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLndpZHRoID0gdyB8IDBcbiAgICAgIHRoaXMuaGVpZ2h0ID0gaCB8IDBcbiAgICAgIHRoaXMuY2hhbm5lbHMgPSBjIHwgMFxuXG4gICAgICBpZiAoJ3N0cmlkZScgaW4gb3B0aW9ucykge1xuICAgICAgICB2YXIgc3RyaWRlID0gb3B0aW9ucy5zdHJpZGVcbiAgICAgICAgY2hlY2soQXJyYXkuaXNBcnJheShzdHJpZGUpICYmIHN0cmlkZS5sZW5ndGggPj0gMixcbiAgICAgICAgICAnaW52YWxpZCBzdHJpZGUgdmVjdG9yJylcbiAgICAgICAgdGhpcy5zdHJpZGVYID0gc3RyaWRlWzBdXG4gICAgICAgIHRoaXMuc3RyaWRlWSA9IHN0cmlkZVsxXVxuICAgICAgICBpZiAoc3RyaWRlLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHRoaXMuc3RyaWRlQyA9IHN0cmlkZVsyXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RyaWRlQyA9IDFcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5lZWRzVHJhbnNwb3NlID0gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdHJpZGVDID0gMVxuICAgICAgICB0aGlzLnN0cmlkZVggPSB0aGlzLnN0cmlkZUMgKiBjXG4gICAgICAgIHRoaXMuc3RyaWRlWSA9IHRoaXMuc3RyaWRlWCAqIHdcbiAgICAgIH1cblxuICAgICAgaWYgKCdvZmZzZXQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvcHRpb25zLm9mZnNldCB8IDBcbiAgICAgICAgdGhpcy5uZWVkc1RyYW5zcG9zZSA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCdjcm9zc09yaWdpbicgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzLmNyb3NzT3JpZ2luID0gb3B0aW9ucy5jcm9zc09yaWdpblxuICAgICAgfVxuICAgIH0sXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChvcHRpb25zLCBtaXBsZXZlbCkge1xuICAgICAgdGhpcy5taXBsZXZlbCA9IG1pcGxldmVsXG4gICAgICB0aGlzLndpZHRoID0gdGhpcy53aWR0aCA+PiBtaXBsZXZlbFxuICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmhlaWdodCA+PiBtaXBsZXZlbFxuXG4gICAgICB2YXIgZGF0YSA9IG9wdGlvbnNcbiAgICAgIHN3aXRjaCAodHlwZW9mIG9wdGlvbnMpIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucGFyc2VGbGFncyhvcHRpb25zKVxuICAgICAgICAgIGlmIChpc1BpeGVsRGF0YShvcHRpb25zLmRhdGEpKSB7XG4gICAgICAgICAgICBkYXRhID0gb3B0aW9ucy5kYXRhXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY2hlY2sucmFpc2UoJ2ludmFsaWQgcGl4ZWwgZGF0YSB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBkYXRhID0gbG9hZFRleHR1cmUoZGF0YSwgdGhpcy5jcm9zc09yaWdpbilcbiAgICAgIH1cblxuICAgICAgdmFyIGFycmF5ID0gbnVsbFxuICAgICAgdmFyIG5lZWRzQ29udmVydCA9IGZhbHNlXG5cbiAgICAgIGlmICh0aGlzLmNvbXByZXNzZWQpIHtcbiAgICAgICAgY2hlY2soZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgfHwgaXNQZW5kaW5nWEhSKGRhdGEpLFxuICAgICAgICAgICdjb21wcmVzc2VkIHRleHR1cmUgZGF0YSBtdXN0IGJlIHN0b3JlZCBpbiBhIHVpbnQ4YXJyYXknKVxuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAvLyBUT0RPXG4gICAgICB9IGVsc2UgaWYgKGlzVHlwZWRBcnJheShkYXRhKSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhXG4gICAgICB9IGVsc2UgaWYgKGlzTnVtZXJpY0FycmF5KGRhdGEpKSB7XG4gICAgICAgIGFycmF5ID0gZGF0YVxuICAgICAgICBuZWVkc0NvbnZlcnQgPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKGlzTkRBcnJheUxpa2UoZGF0YSkpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YS5kYXRhKSkge1xuICAgICAgICAgIGFycmF5ID0gZGF0YS5kYXRhXG4gICAgICAgICAgbmVlZHNDb252ZXJ0ID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGEuZGF0YVxuICAgICAgICB9XG4gICAgICAgIHZhciBzaGFwZSA9IGRhdGEuc2hhcGVcbiAgICAgICAgdGhpcy53aWR0aCA9IHNoYXBlWzBdXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gc2hhcGVbMV1cbiAgICAgICAgaWYgKHNoYXBlLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHRoaXMuY2hhbm5lbHMgPSBzaGFwZVsyXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2hhbm5lbHMgPSAxXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0cmlkZSA9IGRhdGEuc3RyaWRlXG4gICAgICAgIHRoaXMuc3RyaWRlWCA9IGRhdGEuc3RyaWRlWzBdXG4gICAgICAgIHRoaXMuc3RyaWRlWSA9IGRhdGEuc3RyaWRlWzFdXG4gICAgICAgIGlmIChzdHJpZGUubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdGhpcy5zdHJpZGVDID0gZGF0YS5zdHJpZGVbMl1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0cmlkZUMgPSAxXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vZmZzZXQgPSBkYXRhLm9mZnNldFxuICAgICAgICB0aGlzLm5lZWRzVHJhbnNwb3NlID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChpc0NhbnZhc0VsZW1lbnQoZGF0YSkgfHwgaXNDb250ZXh0MkQoZGF0YSkpIHtcbiAgICAgICAgaWYgKGlzQ2FudmFzRWxlbWVudChkYXRhKSkge1xuICAgICAgICAgIHRoaXMuY2FudmFzID0gZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2FudmFzID0gZGF0YS5jYW52YXNcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGhcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHRcbiAgICAgICAgdGhpcy5zZXREZWZhdWx0Rm9ybWF0KClcbiAgICAgIH0gZWxzZSBpZiAoaXNJbWFnZUVsZW1lbnQoZGF0YSkpIHtcbiAgICAgICAgdGhpcy5pbWFnZSA9IGRhdGFcbiAgICAgICAgaWYgKCFkYXRhLmNvbXBsZXRlKSB7XG4gICAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMud2lkdGggfHwgZGF0YS5uYXR1cmFsV2lkdGhcbiAgICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaGVpZ2h0IHx8IGRhdGEubmF0dXJhbEhlaWdodFxuICAgICAgICAgIHRoaXMubmVlZHNMaXN0ZW5lcnMgPSB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy53aWR0aCA9IGRhdGEubmF0dXJhbFdpZHRoXG4gICAgICAgICAgdGhpcy5oZWlnaHQgPSBkYXRhLm5hdHVyYWxIZWlnaHRcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldERlZmF1bHRGb3JtYXQoKVxuICAgICAgfSBlbHNlIGlmIChpc1ZpZGVvRWxlbWVudChkYXRhKSkge1xuICAgICAgICB0aGlzLnZpZGVvID0gZGF0YVxuICAgICAgICBpZiAoZGF0YS5yZWFkeVN0YXRlID4gMSkge1xuICAgICAgICAgIHRoaXMud2lkdGggPSBkYXRhLndpZHRoXG4gICAgICAgICAgdGhpcy5oZWlnaHQgPSBkYXRhLmhlaWdodFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMud2lkdGggPSB0aGlzLndpZHRoIHx8IGRhdGEud2lkdGhcbiAgICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaGVpZ2h0IHx8IGRhdGEuaGVpZ2h0XG4gICAgICAgICAgdGhpcy5uZWVkc0xpc3RlbmVycyA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5lZWRzUG9sbCA9IHRydWVcbiAgICAgICAgdGhpcy5zZXREZWZhdWx0Rm9ybWF0KClcbiAgICAgIH0gZWxzZSBpZiAoaXNQZW5kaW5nWEhSKGRhdGEpKSB7XG4gICAgICAgIHRoaXMueGhyID0gZGF0YVxuICAgICAgICB0aGlzLm5lZWRzTGlzdGVuZXJzID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChpc1JlY3RBcnJheShkYXRhKSkge1xuICAgICAgICB2YXIgdyA9IGRhdGEubGVuZ3RoXG4gICAgICAgIHZhciBoID0gZGF0YVswXS5sZW5ndGhcbiAgICAgICAgdmFyIGMgPSAxXG4gICAgICAgIHZhciBpLCBqLCBrLCBwXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGFbMF1bMF0pKSB7XG4gICAgICAgICAgYyA9IGRhdGFbMF1bMF0ubGVuZ3RoXG4gICAgICAgICAgY2hlY2soYyA+PSAwICYmIGMgPD0gNCwgJ2ludmFsaWQgbnVtYmVyIG9mIGNoYW5uZWxzIGZvciBpbWFnZSBkYXRhJylcbiAgICAgICAgICBhcnJheSA9IEFycmF5KHcgKiBoICogYylcbiAgICAgICAgICBwID0gMFxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBoOyArK2opIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB3OyArK2kpIHtcbiAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGM7ICsraykge1xuICAgICAgICAgICAgICAgIGFycmF5W3ArK10gPSBkYXRhW2ldW2pdW2tdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJyYXkgPSBBcnJheSh3ICogaClcbiAgICAgICAgICBwID0gMFxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBoOyArK2opIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB3OyArK2kpIHtcbiAgICAgICAgICAgICAgYXJyYXlbcCsrXSA9IGRhdGFbaV1bal1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53aWR0aCA9IHdcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoXG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBjXG4gICAgICAgIG5lZWRzQ29udmVydCA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jb3B5KSB7XG4gICAgICAgIHRoaXMuY29weSA9IHRydWVcbiAgICAgICAgdGhpcy54ID0gdGhpcy54IHwgMFxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgfCAwXG4gICAgICAgIHRoaXMud2lkdGggPSAodGhpcy53aWR0aCB8fCB2aWV3cG9ydFN0YXRlLndpZHRoKSB8IDBcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAodGhpcy5oZWlnaHQgfHwgdmlld3BvcnRTdGF0ZS5oZWlnaHQpIHwgMFxuICAgICAgICB0aGlzLnNldERlZmF1bHRGb3JtYXQoKVxuICAgICAgfVxuXG4gICAgICAvLyBGaXggdXAgbWlzc2luZyB0eXBlIGluZm8gZm9yIHR5cGVkIGFycmF5c1xuICAgICAgaWYgKCF0aGlzLnR5cGUgJiYgdGhpcy5kYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gR0xfREVQVEhfQ09NUE9ORU5UKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0YSBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBHTF9VTlNJR05FRF9TSE9SVFxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXkpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IEdMX1VOU0lHTkVEX0lOVFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICAgICAgICB0aGlzLnR5cGUgPSBHTF9GTE9BVFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEluZmVyIGRlZmF1bHQgZm9ybWF0XG4gICAgICBpZiAoIXRoaXMuaW50ZXJuYWxmb3JtYXQpIHtcbiAgICAgICAgdmFyIGNoYW5uZWxzID0gdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMgfHwgNFxuICAgICAgICB0aGlzLmludGVybmFsZm9ybWF0ID0gW1xuICAgICAgICAgIEdMX0xVTUlOQU5DRSxcbiAgICAgICAgICBHTF9MVU1JTkFOQ0VfQUxQSEEsXG4gICAgICAgICAgR0xfUkdCLFxuICAgICAgICAgIEdMX1JHQkFdW2NoYW5uZWxzIC0gMV1cbiAgICAgICAgY2hlY2sodGhpcy5pbnRlcm5hbGZvcm1hdCwgJ2ludmFsaWQgbnVtYmVyIG9mIGNoYW5uZWxzJylcbiAgICAgIH1cblxuICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuaW50ZXJuYWxmb3JtYXRcbiAgICAgIGlmIChmb3JtYXQgPT09IEdMX0RFUFRIX0NPTVBPTkVOVCB8fCBmb3JtYXQgPT09IEdMX0RFUFRIX1NURU5DSUwpIHtcbiAgICAgICAgY2hlY2soZXh0ZW5zaW9ucy53ZWJnbF9kZXB0aF90ZXh0dXJlLFxuICAgICAgICAgICdkZXB0aC9zdGVuY2lsIHRleHR1cmUgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgIGlmIChmb3JtYXQgPT09IEdMX0RFUFRIX0NPTVBPTkVOVCkge1xuICAgICAgICAgIGNoZWNrKHRoaXMudHlwZSA9PT0gR0xfVU5TSUdORURfU0hPUlQgfHwgR0xfVU5TSUdORURfSU5ULFxuICAgICAgICAgICAgJ2RlcHRoIHRleHR1cmUgdHlwZSBtdXN0IGJlIHVpbnQxNiBvciB1aW50MzInKVxuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IEdMX0RFUFRIX1NURU5DSUwpIHtcbiAgICAgICAgICBjaGVjayh0aGlzLnR5cGUgPT09IEdMX1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMLFxuICAgICAgICAgICAgJ2RlcHRoIHN0ZW5jaWwgdGV4dHVyZSBmb3JtYXQgbXVzdCBtYXRjaCB0eXBlJylcbiAgICAgICAgfVxuICAgICAgICBjaGVjayhcbiAgICAgICAgICAhdGhpcy5kYXRhICYmICFhcnJheSAmJiAhdGhpcy5pbWFnZSAmJiAhdGhpcy52aWRlbyAmJiAhdGhpcy5jYW52YXMsXG4gICAgICAgICAgJ2RlcHRoL3N0ZW5jaWwgdGV4dHVyZXMgYXJlIGZvciByZW5kZXJpbmcgb25seScpXG4gICAgICB9XG5cbiAgICAgIC8vIENvbXB1dGUgY29sb3IgZm9ybWF0IGFuZCBudW1iZXIgb2YgY2hhbm5lbHNcbiAgICAgIHZhciBjb2xvckZvcm1hdCA9IHRoaXMuZm9ybWF0ID0gY29sb3JGb3JtYXRzW2Zvcm1hdF1cbiAgICAgIGlmICghdGhpcy5jaGFubmVscykge1xuICAgICAgICBzd2l0Y2ggKGNvbG9yRm9ybWF0KSB7XG4gICAgICAgICAgY2FzZSBHTF9MVU1JTkFOQ0U6XG4gICAgICAgICAgY2FzZSBHTF9BTFBIQTpcbiAgICAgICAgICBjYXNlIEdMX0RFUFRIX0NPTVBPTkVOVDpcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMgPSAxXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgY2FzZSBHTF9ERVBUSF9TVEVOQ0lMOlxuICAgICAgICAgIGNhc2UgR0xfTFVNSU5BTkNFX0FMUEhBOlxuICAgICAgICAgICAgdGhpcy5jaGFubmVscyA9IDJcbiAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICBjYXNlIEdMX1JHQjpcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMgPSAzXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMgPSA0XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgdGhhdCB0ZXh0dXJlIHR5cGUgaXMgc3VwcG9ydGVkXG4gICAgICB2YXIgdHlwZSA9IHRoaXMudHlwZVxuICAgICAgaWYgKHR5cGUgPT09IEdMX0ZMT0FUKSB7XG4gICAgICAgIGNoZWNrKGV4dGVuc2lvbnMub2VzX3RleHR1cmVfZmxvYXQsXG4gICAgICAgICAgJ2Zsb2F0IHRleHR1cmUgbm90IHN1cHBvcnRlZCcpXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IEdMX0hBTEZfRkxPQVRfT0VTKSB7XG4gICAgICAgIGNoZWNrKGV4dGVuc2lvbnMub2VzX3RleHR1cmVfaGFsZl9mbG9hdCxcbiAgICAgICAgICAnaGFsZiBmbG9hdCB0ZXh0dXJlIG5vdCBzdXBwb3J0ZWQnKVxuICAgICAgfSBlbHNlIGlmICghdHlwZSkge1xuICAgICAgICBpZiAoZm9ybWF0ID09PSBHTF9ERVBUSF9DT01QT05FTlQpIHtcbiAgICAgICAgICB0eXBlID0gR0xfVU5TSUdORURfSU5UXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHlwZSA9IEdMX1VOU0lHTkVEX0JZVEVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy50eXBlID0gdHlwZVxuXG4gICAgICAvLyBhcHBseSBjb252ZXJzaW9uXG4gICAgICBpZiAobmVlZHNDb252ZXJ0KSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgR0xfVU5TSUdORURfQllURTpcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIEdMX1VOU0lHTkVEX1NIT1JUOlxuICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3IFVpbnQxNkFycmF5KGFycmF5KVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIEdMX1VOU0lHTkVEX0lOVDpcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBVaW50MzJBcnJheShhcnJheSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9GTE9BVDpcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoYXJyYXkpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgR0xfSEFMRl9GTE9BVF9PRVM6XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBjb252ZXJ0VG9IYWxmRmxvYXQoYXJyYXkpXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgY2FzZSBHTF9VTlNJR05FRF9TSE9SVF81XzZfNTpcbiAgICAgICAgICBjYXNlIEdMX1VOU0lHTkVEX1NIT1JUXzVfNV81XzE6XG4gICAgICAgICAgY2FzZSBHTF9VTlNJR05FRF9TSE9SVF80XzRfNF80OlxuICAgICAgICAgIGNhc2UgR0xfVU5TSUdORURfSU5UXzI0XzhfV0VCR0w6XG4gICAgICAgICAgICBjaGVjay5yYWlzZSgndW5zdXBwb3J0ZWQgZm9ybWF0IGZvciBhdXRvbWF0aWMgY29udmVyc2lvbicpXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNoZWNrLnJhaXNlKCd1bnN1cHBvcnRlZCB0eXBlIGNvbnZlcnNpb24nKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgICAgLy8gYXBwbHkgdHJhbnNwb3NlXG4gICAgICAgIGlmICh0aGlzLm5lZWRzVHJhbnNwb3NlKSB7XG4gICAgICAgICAgdGhpcy5kYXRhID0gdHJhbnNwb3NlUGl4ZWxzKFxuICAgICAgICAgICAgdGhpcy5kYXRhLFxuICAgICAgICAgICAgdGhpcy53aWR0aCxcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0LFxuICAgICAgICAgICAgdGhpcy5jaGFubmVscyxcbiAgICAgICAgICAgIHRoaXMuc3RyaWRlWCxcbiAgICAgICAgICAgIHRoaXMuc3RyaWRlWSxcbiAgICAgICAgICAgIHRoaXMuc3RyaWRlQyxcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0KVxuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIGRhdGEgdHlwZVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIEdMX1VOU0lHTkVEX0JZVEU6XG4gICAgICAgICAgICBjaGVjayh0aGlzLmRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5IHx8XG4gICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheSxcbiAgICAgICAgICAgICAgICAgICdpbmNvbXBhdGlibGUgcGl4ZWwgdHlwZScpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgR0xfVU5TSUdORURfU0hPUlRfNV82XzU6XG4gICAgICAgICAgY2FzZSBHTF9VTlNJR05FRF9TSE9SVF81XzVfNV8xOlxuICAgICAgICAgIGNhc2UgR0xfVU5TSUdORURfU0hPUlRfNF80XzRfNDpcbiAgICAgICAgICBjYXNlIEdMX1VOU0lHTkVEX1NIT1JUOlxuICAgICAgICAgIGNhc2UgR0xfSEFMRl9GTE9BVF9PRVM6XG4gICAgICAgICAgICBjaGVjayh0aGlzLmRhdGEgaW5zdGFuY2VvZiBVaW50MTZBcnJheSxcbiAgICAgICAgICAgICAgICAgICdpbmNvbXBhdGlibGUgcGl4ZWwgdHlwZScpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgR0xfVU5TSUdORURfSU5UOlxuICAgICAgICAgICAgY2hlY2sodGhpcy5kYXRhIGluc3RhbmNlb2YgVWludDMyQXJyYXksXG4gICAgICAgICAgICAgICAgICAnaW5jb21wYXRpYmxlIHBpeGVsIHR5cGUnKVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgR0xfRkxPQVQ6XG4gICAgICAgICAgICBjaGVjayh0aGlzLmRhdGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXksXG4gICAgICAgICAgICAgICAgICAnaW5jb21wYXRpYmxlIHBpeGVsIHR5cGUnKVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjaGVjay5yYWlzZSgnYmFkIG9yIG1pc3NpbmcgcGl4ZWwgdHlwZScpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5uZWVkc1RyYW5zcG9zZSA9IGZhbHNlXG4gICAgfSxcblxuICAgIHNldERlZmF1bHRGb3JtYXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZm9ybWF0ID0gdGhpcy5pbnRlcm5hbGZvcm1hdCA9IEdMX1JHQkFcbiAgICAgIHRoaXMudHlwZSA9IEdMX1VOU0lHTkVEX0JZVEVcbiAgICAgIHRoaXMuY2hhbm5lbHMgPSA0XG4gICAgICB0aGlzLmNvbXByZXNzZWQgPSBmYWxzZVxuICAgIH0sXG5cbiAgICB1cGxvYWQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIGdsLnBpeGVsU3RvcmVpKEdMX1VOUEFDS19GTElQX1lfV0VCR0wsIHRoaXMuZmxpcFkpXG4gICAgICBnbC5waXhlbFN0b3JlaShHTF9VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIHRoaXMucHJlbXVsdGlwbHlBbHBoYSlcbiAgICAgIGdsLnBpeGVsU3RvcmVpKEdMX1VOUEFDS19DT0xPUlNQQUNFX0NPTlZFUlNJT05fV0VCR0wsIHRoaXMuY29sb3JTcGFjZSlcbiAgICAgIGdsLnBpeGVsU3RvcmVpKEdMX1VOUEFDS19BTElHTk1FTlQsIHRoaXMudW5wYWNrQWxpZ25tZW50KVxuXG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcy50YXJnZXRcbiAgICAgIHZhciBtaXBsZXZlbCA9IHRoaXMubWlwbGV2ZWxcbiAgICAgIHZhciBpbWFnZSA9IHRoaXMuaW1hZ2VcbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmNhbnZhc1xuICAgICAgdmFyIHZpZGVvID0gdGhpcy52aWRlb1xuICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGFcbiAgICAgIHZhciBpbnRlcm5hbGZvcm1hdCA9IHRoaXMuaW50ZXJuYWxmb3JtYXRcbiAgICAgIHZhciBmb3JtYXQgPSB0aGlzLmZvcm1hdFxuICAgICAgdmFyIHR5cGUgPSB0aGlzLnR5cGVcbiAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGggfHwgTWF0aC5tYXgoMSwgcGFyYW1zLndpZHRoID4+IG1pcGxldmVsKVxuICAgICAgdmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0IHx8IE1hdGgubWF4KDEsIHBhcmFtcy5oZWlnaHQgPj4gbWlwbGV2ZWwpXG4gICAgICBpZiAodmlkZW8gJiYgdmlkZW8ucmVhZHlTdGF0ZSA+IDIpIHtcbiAgICAgICAgZ2wudGV4SW1hZ2UyRCh0YXJnZXQsIG1pcGxldmVsLCBmb3JtYXQsIGZvcm1hdCwgdHlwZSwgdmlkZW8pXG4gICAgICB9IGVsc2UgaWYgKGltYWdlICYmIGltYWdlLmNvbXBsZXRlKSB7XG4gICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0LCBtaXBsZXZlbCwgZm9ybWF0LCBmb3JtYXQsIHR5cGUsIGltYWdlKVxuICAgICAgfSBlbHNlIGlmIChjYW52YXMpIHtcbiAgICAgICAgZ2wudGV4SW1hZ2UyRCh0YXJnZXQsIG1pcGxldmVsLCBmb3JtYXQsIGZvcm1hdCwgdHlwZSwgY2FudmFzKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbXByZXNzZWQpIHtcbiAgICAgICAgZ2wuY29tcHJlc3NlZFRleEltYWdlMkQodGFyZ2V0LCBtaXBsZXZlbCwgaW50ZXJuYWxmb3JtYXQsIHdpZHRoLCBoZWlnaHQsIDAsIGRhdGEpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29weSkge1xuICAgICAgICByZWdsUG9sbCgpXG4gICAgICAgIGdsLmNvcHlUZXhJbWFnZTJEKHRhcmdldCwgbWlwbGV2ZWwsIGZvcm1hdCwgdGhpcy54LCB0aGlzLnksIHdpZHRoLCBoZWlnaHQsIDApXG4gICAgICB9IGVsc2UgaWYgKGRhdGEpIHtcbiAgICAgICAgZ2wudGV4SW1hZ2UyRCh0YXJnZXQsIG1pcGxldmVsLCBmb3JtYXQsIHdpZHRoLCBoZWlnaHQsIDAsIGZvcm1hdCwgdHlwZSwgZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0LCBtaXBsZXZlbCwgZm9ybWF0LCB3aWR0aCB8fCAxLCBoZWlnaHQgfHwgMSwgMCwgZm9ybWF0LCB0eXBlLCBudWxsKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBmdW5jdGlvbiBUZXhQYXJhbXMgKHRhcmdldCkge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICAvLyBEZWZhdWx0IGltYWdlIHNoYXBlIGluZm9cbiAgICB0aGlzLndpZHRoID0gMFxuICAgIHRoaXMuaGVpZ2h0ID0gMFxuICAgIHRoaXMuZm9ybWF0ID0gMFxuICAgIHRoaXMuaW50ZXJuYWxmb3JtYXQgPSAwXG4gICAgdGhpcy50eXBlID0gMFxuXG4gICAgLy8gd3JhcCBtb2RlXG4gICAgdGhpcy53cmFwUyA9IEdMX0NMQU1QX1RPX0VER0VcbiAgICB0aGlzLndyYXBUID0gR0xfQ0xBTVBfVE9fRURHRVxuXG4gICAgLy8gZmlsdGVyaW5nXG4gICAgdGhpcy5taW5GaWx0ZXIgPSAwXG4gICAgdGhpcy5tYWdGaWx0ZXIgPSBHTF9ORUFSRVNUXG4gICAgdGhpcy5hbmlzb3Ryb3BpYyA9IDFcblxuICAgIC8vIG1pcG1hcHNcbiAgICB0aGlzLmdlbk1pcG1hcHMgPSBmYWxzZVxuICAgIHRoaXMubWlwbWFwSGludCA9IEdMX0RPTlRfQ0FSRVxuICB9XG5cbiAgT2JqZWN0LmFzc2lnbihUZXhQYXJhbXMucHJvdG90eXBlLCB7XG4gICAgcGFyc2U6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnIHx8ICFvcHRpb25zKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoJ21pbicgaW4gb3B0aW9ucykge1xuICAgICAgICB2YXIgbWluRmlsdGVyID0gb3B0aW9ucy5taW5cbiAgICAgICAgY2hlY2sucGFyYW1ldGVyKG1pbkZpbHRlciwgbWluRmlsdGVycylcbiAgICAgICAgdGhpcy5taW5GaWx0ZXIgPSBtaW5GaWx0ZXJzW21pbkZpbHRlcl1cbiAgICAgIH1cblxuICAgICAgaWYgKCdtYWcnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG1hZ0ZpbHRlciA9IG9wdGlvbnMubWFnXG4gICAgICAgIGNoZWNrLnBhcmFtZXRlcihtYWdGaWx0ZXIsIG1hZ0ZpbHRlcnMpXG4gICAgICAgIHRoaXMubWFnRmlsdGVyID0gbWFnRmlsdGVyc1ttYWdGaWx0ZXJdXG4gICAgICB9XG5cbiAgICAgIHZhciB3cmFwUyA9IHRoaXMud3JhcFNcbiAgICAgIHZhciB3cmFwVCA9IHRoaXMud3JhcFRcbiAgICAgIGlmICgnd3JhcCcgaW4gb3B0aW9ucykge1xuICAgICAgICB2YXIgd3JhcCA9IG9wdGlvbnMud3JhcFxuICAgICAgICBpZiAodHlwZW9mIHdyYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKHdyYXAsIHdyYXBNb2RlcylcbiAgICAgICAgICB3cmFwUyA9IHdyYXBUID0gd3JhcE1vZGVzW3dyYXBdXG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh3cmFwKSkge1xuICAgICAgICAgIGNoZWNrLnBhcmFtZXRlcih3cmFwWzBdLCB3cmFwTW9kZXMpXG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKHdyYXBbMV0sIHdyYXBNb2RlcylcbiAgICAgICAgICB3cmFwUyA9IHdyYXBNb2Rlc1t3cmFwWzBdXVxuICAgICAgICAgIHdyYXBUID0gd3JhcE1vZGVzW3dyYXBbMV1dXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgnd3JhcFMnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgb3B0V3JhcFMgPSBvcHRpb25zLndyYXBTXG4gICAgICAgICAgY2hlY2sucGFyYW1ldGVyKG9wdFdyYXBTLCB3cmFwTW9kZXMpXG4gICAgICAgICAgd3JhcFMgPSB3cmFwTW9kZXNbb3B0V3JhcFNdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCd3cmFwVCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHZhciBvcHRXcmFwVCA9IG9wdGlvbnMud3JhcFRcbiAgICAgICAgICBjaGVjay5wYXJhbWV0ZXIob3B0V3JhcFQsIHdyYXBNb2RlcylcbiAgICAgICAgICB3cmFwVCA9IHdyYXBNb2Rlc1tvcHRXcmFwVF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy53cmFwUyA9IHdyYXBTXG4gICAgICB0aGlzLndyYXBUID0gd3JhcFRcblxuICAgICAgaWYgKCdhbmlzb3Ryb3BpYycgaW4gb3B0aW9ucykge1xuICAgICAgICB2YXIgYW5pc290cm9waWMgPSBvcHRpb25zLmFuaXNvdHJvcGljXG4gICAgICAgIGNoZWNrKHR5cGVvZiBhbmlzb3Ryb3BpYyA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgICAgYW5pc290cm9waWMgPj0gMSAmJiBhbmlzb3Ryb3BpYyA8PSBsaW1pdHMubWF4QW5pc290cm9waWMsXG4gICAgICAgICAgJ2FuaXNvIHNhbXBsZXMgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kICcpXG4gICAgICAgIHRoaXMuYW5pc290cm9waWMgPSBvcHRpb25zLmFuaXNvdHJvcGljXG4gICAgICB9XG5cbiAgICAgIGlmICgnbWlwbWFwJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIHZhciBtaXBtYXAgPSBvcHRpb25zLm1pcG1hcFxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiBtaXBtYXApIHtcbiAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2hlY2sucGFyYW1ldGVyKG1pcG1hcCwgbWlwbWFwSGludCxcbiAgICAgICAgICAgICAgJ2ludmFsaWQgbWlwbWFwIGhpbnQnKVxuICAgICAgICAgICAgdGhpcy5taXBtYXBIaW50ID0gbWlwbWFwSGludFttaXBtYXBdXG4gICAgICAgICAgICB0aGlzLmdlbk1pcG1hcHMgPSB0cnVlXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICB0aGlzLmdlbk1pcG1hcHMgPSAhIW1pcG1hcFxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNoZWNrLnJhaXNlKCdpbnZhbGlkIG1pcG1hcCB0eXBlJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0YXJnZXQgPSB0aGlzLnRhcmdldFxuICAgICAgZ2wudGV4UGFyYW1ldGVyaSh0YXJnZXQsIEdMX1RFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5taW5GaWx0ZXIpXG4gICAgICBnbC50ZXhQYXJhbWV0ZXJpKHRhcmdldCwgR0xfVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLm1hZ0ZpbHRlcilcbiAgICAgIGdsLnRleFBhcmFtZXRlcmkodGFyZ2V0LCBHTF9URVhUVVJFX1dSQVBfUywgdGhpcy53cmFwUylcbiAgICAgIGdsLnRleFBhcmFtZXRlcmkodGFyZ2V0LCBHTF9URVhUVVJFX1dSQVBfVCwgdGhpcy53cmFwVClcbiAgICAgIGlmIChleHRlbnNpb25zLmV4dF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYykge1xuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKHRhcmdldCwgR0xfVEVYVFVSRV9NQVhfQU5JU09UUk9QWV9FWFQsIHRoaXMuYW5pc290cm9waWMpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5nZW5NaXBtYXBzKSB7XG4gICAgICAgIGdsLmhpbnQoR0xfR0VORVJBVEVfTUlQTUFQX0hJTlQsIHRoaXMubWlwbWFwSGludClcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAodGFyZ2V0KVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICAvLyBGaW5hbCBwYXNzIHRvIG1lcmdlIHBhcmFtcyBhbmQgcGl4ZWwgZGF0YVxuICBmdW5jdGlvbiBjaGVja1RleHR1cmVDb21wbGV0ZSAocGFyYW1zLCBwaXhlbHMpIHtcbiAgICB2YXIgaSwgcGl4bWFwXG5cbiAgICB2YXIgdHlwZSA9IDBcbiAgICB2YXIgZm9ybWF0ID0gMFxuICAgIHZhciBpbnRlcm5hbGZvcm1hdCA9IDBcbiAgICB2YXIgd2lkdGggPSAwXG4gICAgdmFyIGhlaWdodCA9IDBcbiAgICB2YXIgY2hhbm5lbHMgPSAwXG4gICAgdmFyIGNvbXByZXNzZWQgPSBmYWxzZVxuICAgIHZhciBuZWVkc1BvbGwgPSBmYWxzZVxuICAgIHZhciBuZWVkc0xpc3RlbmVycyA9IGZhbHNlXG4gICAgdmFyIG1pcE1hc2syRCA9IDBcbiAgICB2YXIgbWlwTWFza0N1YmUgPSBbMCwgMCwgMCwgMCwgMCwgMF1cbiAgICB2YXIgY3ViZU1hc2sgPSAwXG4gICAgdmFyIGhhc01pcCA9IGZhbHNlXG4gICAgZm9yIChpID0gMDsgaSA8IHBpeGVscy5sZW5ndGg7ICsraSkge1xuICAgICAgcGl4bWFwID0gcGl4ZWxzW2ldXG4gICAgICB3aWR0aCA9IHdpZHRoIHx8IChwaXhtYXAud2lkdGggPDwgcGl4bWFwLm1pcGxldmVsKVxuICAgICAgaGVpZ2h0ID0gaGVpZ2h0IHx8IChwaXhtYXAuaGVpZ2h0IDw8IHBpeG1hcC5taXBsZXZlbClcbiAgICAgIHR5cGUgPSB0eXBlIHx8IHBpeG1hcC50eXBlXG4gICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgcGl4bWFwLmZvcm1hdFxuICAgICAgaW50ZXJuYWxmb3JtYXQgPSBpbnRlcm5hbGZvcm1hdCB8fCBwaXhtYXAuaW50ZXJuYWxmb3JtYXRcbiAgICAgIGNoYW5uZWxzID0gY2hhbm5lbHMgfHwgcGl4bWFwLmNoYW5uZWxzXG4gICAgICBuZWVkc1BvbGwgPSBuZWVkc1BvbGwgfHwgcGl4bWFwLm5lZWRzUG9sbFxuICAgICAgbmVlZHNMaXN0ZW5lcnMgPSBuZWVkc0xpc3RlbmVycyB8fCBwaXhtYXAubmVlZHNMaXN0ZW5lcnNcbiAgICAgIGNvbXByZXNzZWQgPSBjb21wcmVzc2VkIHx8IHBpeG1hcC5jb21wcmVzc2VkXG5cbiAgICAgIHZhciBtaXBsZXZlbCA9IHBpeG1hcC5taXBsZXZlbFxuICAgICAgdmFyIHRhcmdldCA9IHBpeG1hcC50YXJnZXRcbiAgICAgIGhhc01pcCA9IGhhc01pcCB8fCAobWlwbGV2ZWwgPiAwKVxuICAgICAgaWYgKHRhcmdldCA9PT0gR0xfVEVYVFVSRV8yRCkge1xuICAgICAgICBtaXBNYXNrMkQgfD0gKDEgPDwgbWlwbGV2ZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZmFjZSA9IHRhcmdldCAtIEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWFxuICAgICAgICBtaXBNYXNrQ3ViZVtmYWNlXSB8PSAoMSA8PCBtaXBsZXZlbClcbiAgICAgICAgY3ViZU1hc2sgfD0gKDEgPDwgZmFjZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJhbXMubmVlZHNQb2xsID0gbmVlZHNQb2xsXG4gICAgcGFyYW1zLm5lZWRzTGlzdGVuZXJzID0gbmVlZHNMaXN0ZW5lcnNcbiAgICBwYXJhbXMud2lkdGggPSB3aWR0aFxuICAgIHBhcmFtcy5oZWlnaHQgPSBoZWlnaHRcbiAgICBwYXJhbXMuZm9ybWF0ID0gZm9ybWF0XG4gICAgcGFyYW1zLmludGVybmFsZm9ybWF0ID0gaW50ZXJuYWxmb3JtYXRcbiAgICBwYXJhbXMudHlwZSA9IHR5cGVcblxuICAgIHZhciBtaXBNYXNrID0gaGFzTWlwID8gKHdpZHRoIDw8IDEpIC0gMSA6IDFcbiAgICBpZiAocGFyYW1zLnRhcmdldCA9PT0gR0xfVEVYVFVSRV8yRCkge1xuICAgICAgY2hlY2soY3ViZU1hc2sgPT09IDAsXG4gICAgICAgICdwaXhtYXAgdHlwZSBtdXN0IG5vdCBjb250YWluIGN1YmVtYXAgZmFjZXMnKVxuICAgICAgY2hlY2sobWlwTWFzazJEID09PSBtaXBNYXNrLCAnbWlzc2luZyBtaXAgbWFwIGRhdGEnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjaGVjayhjdWJlTWFzayA9PT0gKCgxIDw8IDYpIC0gMSksICdtaXNzaW5nIGN1YmVtYXAgZmFjZXMnKVxuICAgICAgZm9yIChpID0gMDsgaSA8IDY7ICsraSkge1xuICAgICAgICBjaGVjayhtaXBNYXNrQ3ViZVtpXSA9PT0gbWlwTWFzaywgJ21pc3NpbmcgbWlwIG1hcCBkYXRhJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbWlwRmlsdGVyID0gKE1JUE1BUF9GSUxURVJTLmluZGV4T2YocGFyYW1zLm1pbkZpbHRlcikgPj0gMClcbiAgICBwYXJhbXMuZ2VuTWlwbWFwcyA9ICFoYXNNaXAgJiYgKHBhcmFtcy5nZW5NaXBtYXBzIHx8IG1pcEZpbHRlcilcbiAgICB2YXIgdXNlTWlwbWFwcyA9IGhhc01pcCB8fCBwYXJhbXMuZ2VuTWlwbWFwc1xuXG4gICAgaWYgKCFwYXJhbXMubWluRmlsdGVyKSB7XG4gICAgICBwYXJhbXMubWluRmlsdGVyID0gdXNlTWlwbWFwc1xuICAgICAgICA/IEdMX0xJTkVBUl9NSVBNQVBfTElORUFSXG4gICAgICAgIDogR0xfTkVBUkVTVFxuICAgIH0gZWxzZSB7XG4gICAgICBjaGVjayh1c2VNaXBtYXBzID09PSBtaXBGaWx0ZXIsXG4gICAgICAgICdtaW4gZmlsdGVyIGluY29uc2lzdGVudCB3aXRoIG1pcG1hcCBkYXRhJylcbiAgICB9XG5cbiAgICBpZiAodXNlTWlwbWFwcykge1xuICAgICAgY2hlY2sod2lkdGggPT09IGhlaWdodCAmJiBpc1BvdzIod2lkdGgpLFxuICAgICAgICAnbXVzdCBiZSBhIHNxdWFyZSBwb3dlciBvZiAyIHRvIHN1cHBvcnQgbWlwbWFwcycpXG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5nZW5NaXBtYXBzKSB7XG4gICAgICBjaGVjayghY29tcHJlc3NlZCwgJ21pcG1hcCBnZW5lcmF0aW9uIG5vdCBzdXBwb3J0ZWQgZm9yIGNvbXByZXNzZWQgdGV4dHVyZXMnKVxuICAgIH1cblxuICAgIHBhcmFtcy53cmFwUyA9IHBhcmFtcy53cmFwUyB8fCBHTF9DTEFNUF9UT19FREdFXG4gICAgcGFyYW1zLndyYXBUID0gcGFyYW1zLndyYXBUIHx8IEdMX0NMQU1QX1RPX0VER0VcbiAgICBpZiAocGFyYW1zLndyYXBTICE9PSBHTF9DTEFNUF9UT19FREdFIHx8XG4gICAgICAgIHBhcmFtcy53cmFwVCAhPT0gR0xfQ0xBTVBfVE9fRURHRSkge1xuICAgICAgY2hlY2soaXNQb3cyKHdpZHRoKSAmJiBpc1BvdzIoaGVpZ2h0KSAmJiAhY3ViZU1hc2ssXG4gICAgICAgICdpbmNvbXBhdGlibGUgc2l6ZSBmb3Igd3JhcCBtb2RlLCBpbWFnZSBtdXN0IGJlIGEgcG93ZXIgb2YgMicpXG4gICAgfVxuXG4gICAgaWYgKCh0eXBlID09PSBHTF9GTE9BVCAmJiAhZXh0ZW5zaW9ucy5vZXNfdGV4dHVyZV9mbG9hdF9saW5lYXIpIHx8XG4gICAgICAgICh0eXBlID09PSBHTF9IQUxGX0ZMT0FUX09FUyAmJlxuICAgICAgICAgICFleHRlbnNpb25zLm9lc190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyKSkge1xuICAgICAgY2hlY2sodGhpcy5tYWdGaWx0ZXIgPT09IEdMX05FQVJFU1QgJiYgdGhpcy5taW5GaWx0ZXIgPT09IEdMX05FQVJFU1QsXG4gICAgICAgICd1bnN1cHBvcnRlZCBmaWx0ZXIgbW9kZSBmb3IgZmxvYXQgdGV4dHVyZScpXG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IHBpeGVscy5sZW5ndGg7ICsraSkge1xuICAgICAgcGl4bWFwID0gcGl4ZWxzW2ldXG4gICAgICB2YXIgbGV2ZWwgPSBwaXhtYXAubWlwbGV2ZWxcbiAgICAgIGlmIChwaXhtYXAud2lkdGgpIHtcbiAgICAgICAgY2hlY2socGl4bWFwLndpZHRoIDw8IGxldmVsID09PSB3aWR0aCwgJ2luY29uc2lzdGVudCB3aWR0aCcpXG4gICAgICB9XG4gICAgICBpZiAocGl4bWFwLmhlaWdodCkge1xuICAgICAgICBjaGVjayhwaXhtYXAuaGVpZ2h0IDw8IGxldmVsID09PSBoZWlnaHQsICdpbmNvbnNpc3RlbnQgd2lkdGgnKVxuICAgICAgfVxuICAgICAgaWYgKHBpeG1hcC5jaGFubmVscykge1xuICAgICAgICBjaGVjayhwaXhtYXAuY2hhbm5lbHMgPT09IGNoYW5uZWxzLCAnaW5jb25zaXN0ZW50IGNoYW5uZWxzJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBpeG1hcC5jaGFubmVscyA9IGNoYW5uZWxzXG4gICAgICB9XG4gICAgICBpZiAocGl4bWFwLmZvcm1hdCkge1xuICAgICAgICBjaGVjayhwaXhtYXAuZm9ybWF0ID09PSBmb3JtYXQsICdpbmNvbnNpc3RlbnQgZm9ybWF0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBpeG1hcC5mb3JtYXQgPSBmb3JtYXRcbiAgICAgIH1cbiAgICAgIGlmIChwaXhtYXAuaW50ZXJuYWxmb3JtYXQpIHtcbiAgICAgICAgY2hlY2socGl4bWFwLmludGVybmFsZm9ybWF0ID09PSBpbnRlcm5hbGZvcm1hdCwgJ2luY29uc2lzdGVudCBpbnRlcm5hbGZvcm1hdCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaXhtYXAuaW50ZXJuYWxmb3JtYXQgPSBpbnRlcm5hbGZvcm1hdFxuICAgICAgfVxuICAgICAgaWYgKHBpeG1hcC50eXBlKSB7XG4gICAgICAgIGNoZWNrKHBpeG1hcC50eXBlID09PSB0eXBlLCAnaW5jb25zaXN0ZW50IHR5cGUnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGl4bWFwLnR5cGUgPSB0eXBlXG4gICAgICB9XG4gICAgICBpZiAocGl4bWFwLmNvcHkpIHtcbiAgICAgICAgY2hlY2socGl4bWFwLnR5cGUgPT09IEdMX1VOU0lHTkVEX0JZVEUgJiZcbiAgICAgICAgICBwaXhtYXAuaW50ZXJuYWxmb3JtYXQgPT09IEdMX1JHQkEsXG4gICAgICAgICAgJ2luY29tcGF0aWJsZSBmb3JtYXQvdHlwZSBmb3IgY29weVRleEltYWdlMkQnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBhY3RpdmVUZXh0dXJlID0gMFxuICB2YXIgdGV4dHVyZUNvdW50ID0gMFxuICB2YXIgdGV4dHVyZVNldCA9IHt9XG4gIHZhciBwb2xsU2V0ID0gW11cbiAgdmFyIG51bVRleFVuaXRzID0gbGltaXRzLm1heFRleHR1cmVVbml0c1xuICB2YXIgdGV4dHVyZVVuaXRzID0gQXJyYXkobnVtVGV4VW5pdHMpLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfSlcblxuICBmdW5jdGlvbiBSRUdMVGV4dHVyZSAodGFyZ2V0KSB7XG4gICAgdGhpcy5pZCA9IHRleHR1cmVDb3VudCsrXG4gICAgdGhpcy5yZWZDb3VudCA9IDFcblxuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gICAgdGhpcy50ZXh0dXJlID0gbnVsbFxuXG4gICAgdGhpcy5wb2xsSWQgPSAtMVxuXG4gICAgdGhpcy51bml0ID0gLTFcbiAgICB0aGlzLmJpbmRDb3VudCA9IDBcblxuICAgIC8vIGNhbmNlbHMgYWxsIHBlbmRpbmcgY2FsbGJhY2tzXG4gICAgdGhpcy5jYW5jZWxQZW5kaW5nID0gbnVsbFxuXG4gICAgLy8gcGFyc2VkIHVzZXIgaW5wdXRzXG4gICAgdGhpcy5wYXJhbXMgPSBuZXcgVGV4UGFyYW1zKHRhcmdldClcbiAgICB0aGlzLnBpeGVscyA9IFtdXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUgKHRleHR1cmUsIG9wdGlvbnMpIHtcbiAgICB2YXIgaVxuICAgIGNsZWFyTGlzdGVuZXJzKHRleHR1cmUpXG5cbiAgICAvLyBDbGVhciBwYXJhbWV0ZXJzIGFuZCBwaXhlbCBkYXRhXG4gICAgdmFyIHBhcmFtcyA9IHRleHR1cmUucGFyYW1zXG4gICAgVGV4UGFyYW1zLmNhbGwocGFyYW1zLCB0ZXh0dXJlLnRhcmdldClcbiAgICB2YXIgcGl4ZWxzID0gdGV4dHVyZS5waXhlbHNcbiAgICBwaXhlbHMubGVuZ3RoID0gMFxuXG4gICAgLy8gcGFyc2UgcGFyYW1ldGVyc1xuICAgIHBhcmFtcy5wYXJzZShvcHRpb25zKVxuXG4gICAgLy8gcGFyc2UgcGl4ZWwgZGF0YVxuICAgIGZ1bmN0aW9uIHBhcnNlTWlwICh0YXJnZXQsIGRhdGEpIHtcbiAgICAgIHZhciBtaXBtYXAgPSBkYXRhLm1pcG1hcFxuICAgICAgdmFyIHBpeG1hcFxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobWlwbWFwKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1pcG1hcC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIHBpeG1hcCA9IG5ldyBQaXhlbEluZm8odGFyZ2V0KVxuICAgICAgICAgIHBpeG1hcC5wYXJzZUZsYWdzKG9wdGlvbnMpXG4gICAgICAgICAgcGl4bWFwLnBhcnNlRmxhZ3MoZGF0YSlcbiAgICAgICAgICBwaXhtYXAucGFyc2UobWlwbWFwW2ldLCBpKVxuICAgICAgICAgIHBpeGVscy5wdXNoKHBpeG1hcClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGl4bWFwID0gbmV3IFBpeGVsSW5mbyh0YXJnZXQpXG4gICAgICAgIHBpeG1hcC5wYXJzZUZsYWdzKG9wdGlvbnMpXG4gICAgICAgIHBpeG1hcC5wYXJzZShkYXRhLCAwKVxuICAgICAgICBwaXhlbHMucHVzaChwaXhtYXApXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0ZXh0dXJlLnRhcmdldCA9PT0gR0xfVEVYVFVSRV8yRCkge1xuICAgICAgcGFyc2VNaXAoR0xfVEVYVFVSRV8yRCwgb3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZhY2VzID0gb3B0aW9ucy5mYWNlcyB8fCBvcHRpb25zXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShmYWNlcykpIHtcbiAgICAgICAgY2hlY2soZmFjZXMubGVuZ3RoID09PSA2LFxuICAgICAgICAgICdpbnZhbGlkIG51bWJlciBvZiBmYWNlcyBpbiBjdWJlIG1hcCcpXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICAgICAgICBwYXJzZU1pcChHTF9URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBpLCBmYWNlc1tpXSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZmFjZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIFRPRE8gUmVhZCBkZHNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluaXRpYWxpemUgdG8gYWxsIGVtcHR5IHRleHR1cmVzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICAgICAgICBwYXJzZU1pcChHTF9URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBpLCB7fSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRvIGEgc2Vjb25kIHBhc3MgdG8gcmVjb25jaWxlIGRlZmF1bHRzXG4gICAgY2hlY2tUZXh0dXJlQ29tcGxldGUocGFyYW1zLCBwaXhlbHMpXG5cbiAgICBpZiAocGFyYW1zLm5lZWRzTGlzdGVuZXJzKSB7XG4gICAgICBob29rTGlzdGVuZXJzKHRleHR1cmUpXG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5uZWVkc1BvbGwpIHtcbiAgICAgIHRleHR1cmUucG9sbElkID0gcG9sbFNldC5sZW5ndGhcbiAgICAgIHBvbGxTZXQucHVzaCh0ZXh0dXJlKVxuICAgIH1cblxuICAgIHJlZnJlc2godGV4dHVyZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZnJlc2ggKHRleHR1cmUpIHtcbiAgICBpZiAoIWdsLmlzVGV4dHVyZSh0ZXh0dXJlLnRleHR1cmUpKSB7XG4gICAgICB0ZXh0dXJlLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKClcbiAgICB9XG5cbiAgICAvLyBMYXp5IGJpbmRcbiAgICB2YXIgdGFyZ2V0ID0gdGV4dHVyZS50YXJnZXRcbiAgICB2YXIgdW5pdCA9IHRleHR1cmUudW5pdFxuICAgIGlmICh1bml0ID49IDApIHtcbiAgICAgIGdsLmFjdGl2ZVRleHR1cmUoR0xfVEVYVFVSRTAgKyB1bml0KVxuICAgICAgYWN0aXZlVGV4dHVyZSA9IHVuaXRcbiAgICB9IGVsc2Uge1xuICAgICAgZ2wuYmluZFRleHR1cmUodGFyZ2V0LCB0ZXh0dXJlLnRleHR1cmUpXG4gICAgfVxuXG4gICAgLy8gVXBsb2FkXG4gICAgdmFyIHBpeGVscyA9IHRleHR1cmUucGl4ZWxzXG4gICAgdmFyIHBhcmFtcyA9IHRleHR1cmUucGFyYW1zXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwaXhlbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHBpeGVsc1tpXS51cGxvYWQocGFyYW1zKVxuICAgIH1cbiAgICBwYXJhbXMudXBsb2FkKClcblxuICAgIC8vIExhenkgdW5iaW5kXG4gICAgaWYgKHVuaXQgPCAwKSB7XG4gICAgICB2YXIgYWN0aXZlID0gdGV4dHVyZVVuaXRzW2FjdGl2ZVRleHR1cmVdXG4gICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgIC8vIHJlc3RvcmUgYmluZGluZyBzdGF0ZVxuICAgICAgICBnbC5iaW5kVGV4dHVyZShhY3RpdmUudGFyZ2V0LCBhY3RpdmUudGV4dHVyZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG90aGVyd2lzZSBiZWNvbWUgbmV3IGFjdGl2ZVxuICAgICAgICB0ZXh0dXJlLnVuaXQgPSBhY3RpdmVUZXh0dXJlXG4gICAgICAgIHRleHR1cmVVbml0c1thY3RpdmVUZXh0dXJlXSA9IHRleHR1cmVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBob29rTGlzdGVuZXJzICh0ZXh0dXJlKSB7XG4gICAgdmFyIHBhcmFtcyA9IHRleHR1cmUucGFyYW1zXG4gICAgdmFyIHBpeGVscyA9IHRleHR1cmUucGl4ZWxzXG5cbiAgICAvLyBBcHBlbmRzIGFsbCB0aGUgdGV4dHVyZSBkYXRhIGZyb20gdGhlIGJ1ZmZlciB0byB0aGUgY3VycmVudFxuICAgIGZ1bmN0aW9uIGFwcGVuZEREUyAodGFyZ2V0LCBtaXBsZXZlbCwgYnVmZmVyKSB7XG4gICAgICB2YXIgZGRzID0gcGFyc2VERFMoYnVmZmVyKVxuXG4gICAgICBjaGVjayhkZHMuZm9ybWF0IGluIGNvbG9yRm9ybWF0cywgJ3Vuc3VwcG9ydGVkIGRkcyB0ZXh0dXJlIGZvcm1hdCcpXG5cbiAgICAgIGlmIChkZHMuY3ViZSkge1xuICAgICAgICBjaGVjayh0ZXh0dXJlLnRhcmdldCA9PT0gR0xfVEVYVFVSRV9DVUJFX01BUClcblxuICAgICAgICAvLyBUT0RPIGhhbmRsZSBjdWJlIG1hcCBERFNcbiAgICAgICAgY2hlY2sucmFpc2UoJ2N1YmUgbWFwIEREUyBub3QgeWV0IGltcGxlbWVudGVkJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoZWNrKHRleHR1cmUudGFyZ2V0ID09PSBHTF9URVhUVVJFXzJEKVxuICAgICAgfVxuXG4gICAgICBpZiAobWlwbGV2ZWwpIHtcbiAgICAgICAgY2hlY2soZGRzLnBpeGVscy5sZW5ndGggPT09IDEsICdudW1iZXIgb2YgbWlwIGxldmVscyBpbmNvbnNpc3RlbnQnKVxuICAgICAgfVxuXG4gICAgICBkZHMucGl4ZWxzLmZvckVhY2goZnVuY3Rpb24gKHBpeG1hcCkge1xuICAgICAgICB2YXIgaW5mbyA9IG5ldyBQaXhlbEluZm8oZGRzLmN1YmUgPyBwaXhtYXAudGFyZ2V0IDogdGFyZ2V0KVxuXG4gICAgICAgIGluZm8uY2hhbm5lbHMgPSBkZHMuY2hhbm5lbHNcbiAgICAgICAgaW5mby5jb21wcmVzc2VkID0gZGRzLmNvbXByZXNzZWRcbiAgICAgICAgaW5mby50eXBlID0gZGRzLnR5cGVcbiAgICAgICAgaW5mby5pbnRlcm5hbGZvcm1hdCA9IGRkcy5mb3JtYXRcbiAgICAgICAgaW5mby5mb3JtYXQgPSBjb2xvckZvcm1hdHNbZGRzLmZvcm1hdF1cblxuICAgICAgICBpbmZvLndpZHRoID0gcGl4bWFwLndpZHRoXG4gICAgICAgIGluZm8uaGVpZ2h0ID0gcGl4bWFwLmhlaWdodFxuICAgICAgICBpbmZvLm1pcGxldmVsID0gcGl4bWFwLm1pcGxldmVsIHx8IG1pcGxldmVsXG4gICAgICAgIGluZm8uZGF0YSA9IHBpeG1hcC5kYXRhXG5cbiAgICAgICAgcGl4ZWxzLnB1c2goaW5mbylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25EYXRhICgpIHtcbiAgICAgIC8vIFVwZGF0ZSBzaXplIG9mIGFueSBuZXdseSBsb2FkZWQgcGl4ZWxzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBpeGVscy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcGl4ZWxEYXRhID0gcGl4ZWxzW2ldXG4gICAgICAgIHZhciBpbWFnZSA9IHBpeGVsRGF0YS5pbWFnZVxuICAgICAgICB2YXIgdmlkZW8gPSBwaXhlbERhdGEudmlkZW9cbiAgICAgICAgdmFyIHhociA9IHBpeGVsRGF0YS54aHJcbiAgICAgICAgaWYgKGltYWdlICYmIGltYWdlLmNvbXBsZXRlKSB7XG4gICAgICAgICAgcGl4ZWxEYXRhLndpZHRoID0gaW1hZ2UubmF0dXJhbFdpZHRoXG4gICAgICAgICAgcGl4ZWxEYXRhLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHRcbiAgICAgICAgfSBlbHNlIGlmICh2aWRlbyAmJiB2aWRlby5yZWFkeVN0YXRlID4gMikge1xuICAgICAgICAgIHBpeGVsRGF0YS53aWR0aCA9IHZpZGVvLndpZHRoXG4gICAgICAgICAgcGl4ZWxEYXRhLmhlaWdodCA9IHZpZGVvLmhlaWdodFxuICAgICAgICB9IGVsc2UgaWYgKHhociAmJiB4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIHBpeGVsc1tpXSA9IHBpeGVsc1twaXhlbHMubGVuZ3RoIC0gMV1cbiAgICAgICAgICBwaXhlbHMucG9wKClcbiAgICAgICAgICB4aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIHJlZnJlc2gpXG4gICAgICAgICAgYXBwZW5kRERTKHBpeGVsRGF0YS50YXJnZXQsIHBpeGVsRGF0YS5taXBsZXZlbCwgeGhyLnJlc3BvbnNlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjaGVja1RleHR1cmVDb21wbGV0ZShwYXJhbXMsIHBpeGVscylcbiAgICAgIHJlZnJlc2godGV4dHVyZSlcbiAgICB9XG5cbiAgICBwaXhlbHMuZm9yRWFjaChmdW5jdGlvbiAocGl4ZWxEYXRhKSB7XG4gICAgICBpZiAocGl4ZWxEYXRhLmltYWdlICYmICFwaXhlbERhdGEuaW1hZ2UuY29tcGxldGUpIHtcbiAgICAgICAgcGl4ZWxEYXRhLmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkRhdGEpXG4gICAgICB9IGVsc2UgaWYgKHBpeGVsRGF0YS52aWRlbyAmJiBwaXhlbERhdGEucmVhZHlTdGF0ZSA8IDEpIHtcbiAgICAgICAgcGl4ZWxEYXRhLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgb25EYXRhKVxuICAgICAgfSBlbHNlIGlmIChwaXhlbERhdGEueGhyKSB7XG4gICAgICAgIHBpeGVsRGF0YS54aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIG9uRGF0YSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGV4dHVyZS5jYW5jZWxQZW5kaW5nID0gZnVuY3Rpb24gZGV0YWNoTGlzdGVuZXJzICgpIHtcbiAgICAgIHBpeGVscy5mb3JFYWNoKGZ1bmN0aW9uIChwaXhlbERhdGEpIHtcbiAgICAgICAgaWYgKHBpeGVsRGF0YS5pbWFnZSkge1xuICAgICAgICAgIHBpeGVsRGF0YS5pbWFnZS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25EYXRhKVxuICAgICAgICB9IGVsc2UgaWYgKHBpeGVsRGF0YS52aWRlbykge1xuICAgICAgICAgIHBpeGVsRGF0YS52aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIG9uRGF0YSlcbiAgICAgICAgfSBlbHNlIGlmIChwaXhlbERhdGEueGhyKSB7XG4gICAgICAgICAgcGl4ZWxEYXRhLnhoci5yZW1vdmVFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgb25EYXRhKVxuICAgICAgICAgIHBpeGVsRGF0YS54aHIuYWJvcnQoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyTGlzdGVuZXJzICh0ZXh0dXJlKSB7XG4gICAgdmFyIGNhbmNlbFBlbmRpbmcgPSB0ZXh0dXJlLmNhbmNlbFBlbmRpbmdcbiAgICBpZiAoY2FuY2VsUGVuZGluZykge1xuICAgICAgY2FuY2VsUGVuZGluZygpXG4gICAgICB0ZXh0dXJlLmNhbmNlbFBlbmRpbmcgPSBudWxsXG4gICAgfVxuICAgIHZhciBpZCA9IHRleHR1cmUucG9sbElkXG4gICAgaWYgKGlkID49IDApIHtcbiAgICAgIHZhciBvdGhlciA9IHBvbGxTZXRbaWRdID0gcG9sbFNldFtwb2xsU2V0Lmxlbmd0aCAtIDFdXG4gICAgICBvdGhlci5pZCA9IGlkXG4gICAgICBwb2xsU2V0LnBvcCgpXG4gICAgICB0ZXh0dXJlLnBvbGxJZCA9IC0xXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSAodGV4dHVyZSkge1xuICAgIHZhciBoYW5kbGUgPSB0ZXh0dXJlLnRleHR1cmVcbiAgICBjaGVjayhoYW5kbGUsICdtdXN0IG5vdCBkb3VibGUgZGVzdHJveSB0ZXh0dXJlJylcbiAgICB2YXIgdW5pdCA9IHRleHR1cmUudW5pdFxuICAgIHZhciB0YXJnZXQgPSB0ZXh0dXJlLnRhcmdldFxuICAgIGlmICh1bml0ID49IDApIHtcbiAgICAgIGdsLmFjdGl2ZVRleHR1cmUoR0xfVEVYVFVSRTAgKyB1bml0KVxuICAgICAgYWN0aXZlVGV4dHVyZSA9IHVuaXRcbiAgICAgIGdsLmJpbmRUZXh0dXJlKHRhcmdldCwgbnVsbClcbiAgICAgIHRleHR1cmVVbml0c1t1bml0XSA9IG51bGxcbiAgICB9XG4gICAgY2xlYXJMaXN0ZW5lcnModGV4dHVyZSlcbiAgICBpZiAoZ2wuaXNUZXh0dXJlKGhhbmRsZSkpIHtcbiAgICAgIGdsLmRlbGV0ZVRleHR1cmUoaGFuZGxlKVxuICAgIH1cbiAgICB0ZXh0dXJlLnRleHR1cmUgPSBudWxsXG4gICAgdGV4dHVyZS5wYXJhbXMgPSBudWxsXG4gICAgdGV4dHVyZS5waXhlbHMgPSBudWxsXG4gICAgdGV4dHVyZS5yZWZDb3VudCA9IDBcbiAgICBkZWxldGUgdGV4dHVyZVNldFt0ZXh0dXJlLmlkXVxuICB9XG5cbiAgT2JqZWN0LmFzc2lnbihSRUdMVGV4dHVyZS5wcm90b3R5cGUsIHtcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGV4dHVyZSA9IHRoaXNcbiAgICAgIHRleHR1cmUuYmluZENvdW50ICs9IDFcbiAgICAgIHZhciB1bml0ID0gdGV4dHVyZS51bml0XG4gICAgICBpZiAodW5pdCA8IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1UZXhVbml0czsgKytpKSB7XG4gICAgICAgICAgdmFyIG90aGVyID0gdGV4dHVyZVVuaXRzW2ldXG4gICAgICAgICAgaWYgKG90aGVyKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIuYmluZENvdW50ID4gMCkge1xuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3RoZXIudW5pdCA9IC0xXG4gICAgICAgICAgfVxuICAgICAgICAgIHRleHR1cmVVbml0c1tpXSA9IHRleHR1cmVcbiAgICAgICAgICB1bml0ID0gaVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXQgPj0gbnVtVGV4VW5pdHMpIHtcbiAgICAgICAgICBjaGVjay5yYWlzZSgnaW5zdWZmaWNpZW50IG51bWJlciBvZiB0ZXh0dXJlIHVuaXRzJylcbiAgICAgICAgfVxuICAgICAgICB0ZXh0dXJlLnVuaXQgPSB1bml0XG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoR0xfVEVYVFVSRTAgKyB1bml0KVxuICAgICAgICBnbC5iaW5kVGV4dHVyZSh0ZXh0dXJlLnRhcmdldCwgdGV4dHVyZS50ZXh0dXJlKVxuICAgICAgICBhY3RpdmVUZXh0dXJlID0gdW5pdFxuICAgICAgfVxuICAgICAgcmV0dXJuIHVuaXRcbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmJpbmRDb3VudCAtPSAxXG4gICAgfSxcblxuICAgIGRlY1JlZjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKC0tdGhpcy5yZWZDb3VudCA9PT0gMCkge1xuICAgICAgICBkZXN0cm95KHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHR1cmUgKG9wdGlvbnMsIHRhcmdldCkge1xuICAgIHZhciB0ZXh0dXJlID0gbmV3IFJFR0xUZXh0dXJlKHRhcmdldClcbiAgICB0ZXh0dXJlU2V0W3RleHR1cmUuaWRdID0gdGV4dHVyZVxuXG4gICAgZnVuY3Rpb24gcmVnbFRleHR1cmUgKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYTAgfHwge31cbiAgICAgIGlmICh0YXJnZXQgPT09IEdMX1RFWFRVUkVfQ1VCRV9NQVAgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICBvcHRpb25zID0gW2EwLCBhMSwgYTIsIGEzLCBhNCwgYTVdXG4gICAgICB9XG4gICAgICB1cGRhdGUodGV4dHVyZSwgb3B0aW9ucylcbiAgICAgIHJlZ2xUZXh0dXJlLndpZHRoID0gdGV4dHVyZS5wYXJhbXMud2lkdGhcbiAgICAgIHJlZ2xUZXh0dXJlLmhlaWdodCA9IHRleHR1cmUucGFyYW1zLmhlaWdodFxuICAgICAgcmV0dXJuIHJlZ2xUZXh0dXJlXG4gICAgfVxuXG4gICAgcmVnbFRleHR1cmUob3B0aW9ucylcblxuICAgIE9iamVjdC5hc3NpZ24ocmVnbFRleHR1cmUsIHtcbiAgICAgIF9yZWdsVHlwZTogJ3RleHR1cmUnLFxuICAgICAgX3RleHR1cmU6IHRleHR1cmUsXG4gICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRleHR1cmUuZGVjUmVmKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlZ2xUZXh0dXJlXG4gIH1cblxuICAvLyBDYWxsZWQgYWZ0ZXIgY29udGV4dCByZXN0b3JlXG4gIGZ1bmN0aW9uIHJlZnJlc2hUZXh0dXJlcyAoKSB7XG4gICAgdmFsdWVzKHRleHR1cmVTZXQpLmZvckVhY2gocmVmcmVzaClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVRleFVuaXRzOyArK2kpIHtcbiAgICAgIHRleHR1cmVVbml0c1tpXSA9IG51bGxcbiAgICB9XG4gICAgYWN0aXZlVGV4dHVyZSA9IDBcbiAgICBnbC5hY3RpdmVUZXh0dXJlKEdMX1RFWFRVUkUwKVxuICB9XG5cbiAgLy8gQ2FsbGVkIHdoZW4gcmVnbCBpcyBkZXN0cm95ZWRcbiAgZnVuY3Rpb24gZGVzdHJveVRleHR1cmVzICgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVRleFVuaXRzOyArK2kpIHtcbiAgICAgIGdsLmFjdGl2ZVRleHR1cmUoR0xfVEVYVFVSRTAgKyBpKVxuICAgICAgZ2wuYmluZFRleHR1cmUoR0xfVEVYVFVSRV8yRCwgbnVsbClcbiAgICAgIHRleHR1cmVVbml0c1tpXSA9IG51bGxcbiAgICB9XG4gICAgZ2wuYWN0aXZlVGV4dHVyZShHTF9URVhUVVJFMClcbiAgICBhY3RpdmVUZXh0dXJlID0gMFxuICAgIHZhbHVlcyh0ZXh0dXJlU2V0KS5mb3JFYWNoKGRlc3Ryb3kpXG4gIH1cblxuICAvLyBDYWxsZWQgb25jZSBwZXIgcmFmLCB1cGRhdGVzIHZpZGVvIHRleHR1cmVzXG4gIGZ1bmN0aW9uIHBvbGxUZXh0dXJlcyAoKSB7XG4gICAgcG9sbFNldC5mb3JFYWNoKHJlZnJlc2gpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZTogY3JlYXRlVGV4dHVyZSxcbiAgICByZWZyZXNoOiByZWZyZXNoVGV4dHVyZXMsXG4gICAgY2xlYXI6IGRlc3Ryb3lUZXh0dXJlcyxcbiAgICBwb2xsOiBwb2xsVGV4dHVyZXMsXG4gICAgZ2V0VGV4dHVyZTogZnVuY3Rpb24gKHdyYXBwZXIpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbnZlcnRUb0hhbGZGbG9hdCAoYXJyYXkpIHtcbiAgdmFyIGZsb2F0cyA9IG5ldyBGbG9hdDMyQXJyYXkoYXJyYXkpXG4gIHZhciB1aW50cyA9IG5ldyBVaW50MzJBcnJheShmbG9hdHMuYnVmZmVyKVxuICB2YXIgdXNob3J0cyA9IG5ldyBVaW50MTZBcnJheShhcnJheS5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSkge1xuICAgIGlmIChpc05hTihhcnJheVtpXSkpIHtcbiAgICAgIHVzaG9ydHNbaV0gPSAweGZmZmZcbiAgICB9IGVsc2UgaWYgKGFycmF5W2ldID09PSBJbmZpbml0eSkge1xuICAgICAgdXNob3J0c1tpXSA9IDB4N2MwMFxuICAgIH0gZWxzZSBpZiAoYXJyYXlbaV0gPT09IC1JbmZpbml0eSkge1xuICAgICAgdXNob3J0c1tpXSA9IDB4ZmMwMFxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgeCA9IHVpbnRzW2ldXG5cbiAgICAgIHZhciBzZ24gPSAoeCA+Pj4gMzEpIDw8IDE1XG4gICAgICB2YXIgZXhwID0gKCh4IDw8IDEpID4+PiAyNCkgLSAxMjdcbiAgICAgIHZhciBmcmFjID0gKHggPj4gMTMpICYgKCgxIDw8IDEwKSAtIDEpXG5cbiAgICAgIGlmIChleHAgPCAtMjQpIHtcbiAgICAgICAgLy8gcm91bmQgbm9uLXJlcHJlc2VudGFibGUgZGVub3JtYWxzIHRvIDBcbiAgICAgICAgdXNob3J0c1tpXSA9IHNnblxuICAgICAgfSBlbHNlIGlmIChleHAgPCAtMTQpIHtcbiAgICAgICAgLy8gaGFuZGxlIGRlbm9ybWFsc1xuICAgICAgICB2YXIgcyA9IC0xNCAtIGV4cFxuICAgICAgICB1c2hvcnRzW2ldID0gc2duICsgKChmcmFjICsgKDEgPDwgMTApKSA+PiBzKVxuICAgICAgfSBlbHNlIGlmIChleHAgPiAxNSkge1xuICAgICAgICAvLyByb3VuZCBvdmVyZmxvdyB0byArLy0gSW5maW5pdHlcbiAgICAgICAgdXNob3J0c1tpXSA9IHNnbiArIDB4N2MwMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb3RoZXJ3aXNlIGNvbnZlcnQgZGlyZWN0bHlcbiAgICAgICAgdXNob3J0c1tpXSA9IHNnbiArICgoZXhwICsgMTUpIDw8IDEwKSArIGZyYWNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdXNob3J0c1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3cmFwVW5pZm9ybVN0YXRlICgpIHtcbiAgdmFyIHVuaWZvcm1TdGF0ZSA9IHt9XG5cbiAgZnVuY3Rpb24gZGVmVW5pZm9ybSAobmFtZSkge1xuICAgIGlmIChuYW1lIGluIHVuaWZvcm1TdGF0ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHVuaWZvcm1TdGF0ZVtuYW1lXSA9IFsgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdIF1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdW5pZm9ybXM6IHVuaWZvcm1TdGF0ZSxcbiAgICBkZWY6IGRlZlVuaWZvcm1cbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBvYmpba2V5XSB9KVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gYW5nbGVOb3JtYWxzXG5cbmZ1bmN0aW9uIGh5cG90KHgsIHksIHopIHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4LDIpICsgTWF0aC5wb3coeSwyKSArIE1hdGgucG93KHosMikpXG59XG5cbmZ1bmN0aW9uIHdlaWdodChzLCByLCBhKSB7XG4gIHJldHVybiBNYXRoLmF0YW4yKHIsIChzIC0gYSkpXG59XG5cbmZ1bmN0aW9uIG11bEFkZChkZXN0LCBzLCB4LCB5LCB6KSB7XG4gIGRlc3RbMF0gKz0gcyAqIHhcbiAgZGVzdFsxXSArPSBzICogeVxuICBkZXN0WzJdICs9IHMgKiB6XG59XG5cbmZ1bmN0aW9uIGFuZ2xlTm9ybWFscyhjZWxscywgcG9zaXRpb25zKSB7XG4gIHZhciBudW1WZXJ0cyA9IHBvc2l0aW9ucy5sZW5ndGhcbiAgdmFyIG51bUNlbGxzID0gY2VsbHMubGVuZ3RoXG5cbiAgLy9BbGxvY2F0ZSBub3JtYWwgYXJyYXlcbiAgdmFyIG5vcm1hbHMgPSBuZXcgQXJyYXkobnVtVmVydHMpXG4gIGZvcih2YXIgaT0wOyBpPG51bVZlcnRzOyArK2kpIHtcbiAgICBub3JtYWxzW2ldID0gWzAsMCwwXVxuICB9XG5cbiAgLy9TY2FuIGNlbGxzLCBhbmRcbiAgZm9yKHZhciBpPTA7IGk8bnVtQ2VsbHM7ICsraSkge1xuICAgIHZhciBjZWxsID0gY2VsbHNbaV1cbiAgICB2YXIgYSA9IHBvc2l0aW9uc1tjZWxsWzBdXVxuICAgIHZhciBiID0gcG9zaXRpb25zW2NlbGxbMV1dXG4gICAgdmFyIGMgPSBwb3NpdGlvbnNbY2VsbFsyXV1cblxuICAgIHZhciBhYnggPSBhWzBdIC0gYlswXVxuICAgIHZhciBhYnkgPSBhWzFdIC0gYlsxXVxuICAgIHZhciBhYnogPSBhWzJdIC0gYlsyXVxuICAgIHZhciBhYiA9IGh5cG90KGFieCwgYWJ5LCBhYnopXG5cbiAgICB2YXIgYmN4ID0gYlswXSAtIGNbMF1cbiAgICB2YXIgYmN5ID0gYlsxXSAtIGNbMV1cbiAgICB2YXIgYmN6ID0gYlsyXSAtIGNbMl1cbiAgICB2YXIgYmMgPSBoeXBvdChiY3gsIGJjeSwgYmN6KVxuXG4gICAgdmFyIGNheCA9IGNbMF0gLSBhWzBdXG4gICAgdmFyIGNheSA9IGNbMV0gLSBhWzFdXG4gICAgdmFyIGNheiA9IGNbMl0gLSBhWzJdXG4gICAgdmFyIGNhID0gaHlwb3QoY2F4LCBjYXksIGNheilcblxuICAgIGlmKE1hdGgubWluKGFiLCBiYywgY2EpIDwgMWUtNikge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICB2YXIgcyA9IDAuNSAqIChhYiArIGJjICsgY2EpXG4gICAgdmFyIHIgPSBNYXRoLnNxcnQoKHMgLSBhYikqKHMgLSBiYykqKHMgLSBjYSkvcylcblxuICAgIHZhciBueCA9IGFieSAqIGJjeiAtIGFieiAqIGJjeVxuICAgIHZhciBueSA9IGFieiAqIGJjeCAtIGFieCAqIGJjelxuICAgIHZhciBueiA9IGFieCAqIGJjeSAtIGFieSAqIGJjeFxuICAgIHZhciBubCA9IGh5cG90KG54LCBueSwgbnopXG4gICAgbnggLz0gbmxcbiAgICBueSAvPSBubFxuICAgIG56IC89IG5sXG5cbiAgICBtdWxBZGQobm9ybWFsc1tjZWxsWzBdXSwgd2VpZ2h0KHMsIHIsIGJjKSwgbngsIG55LCBueilcbiAgICBtdWxBZGQobm9ybWFsc1tjZWxsWzFdXSwgd2VpZ2h0KHMsIHIsIGNhKSwgbngsIG55LCBueilcbiAgICBtdWxBZGQobm9ybWFsc1tjZWxsWzJdXSwgd2VpZ2h0KHMsIHIsIGFiKSwgbngsIG55LCBueilcbiAgfVxuXG4gIC8vTm9ybWFsaXplIGFsbCB0aGUgbm9ybWFsc1xuICBmb3IodmFyIGk9MDsgaTxudW1WZXJ0czsgKytpKSB7XG4gICAgdmFyIG4gPSBub3JtYWxzW2ldXG4gICAgdmFyIGwgPSBNYXRoLnNxcnQoXG4gICAgICBNYXRoLnBvdyhuWzBdLCAyKSArXG4gICAgICBNYXRoLnBvdyhuWzFdLCAyKSArXG4gICAgICBNYXRoLnBvdyhuWzJdLCAyKSlcbiAgICBpZihsIDwgMWUtOCkge1xuICAgICAgblswXSA9IDFcbiAgICAgIG5bMV0gPSAwXG4gICAgICBuWzJdID0gMFxuICAgICAgY29udGludWVcbiAgICB9XG4gICAgblswXSAvPSBsXG4gICAgblsxXSAvPSBsXG4gICAgblsyXSAvPSBsXG4gIH1cblxuICByZXR1cm4gbm9ybWFsc1xufVxuIiwiZXhwb3J0cy5wb3NpdGlvbnM9W1sxLjMwMTg5NSwwLjEyMjYyMiwyLjU1MDA2MV0sWzEuMDQ1MzI2LDAuMTM5MDU4LDIuODM1MTU2XSxbMC41NjkyNTEsMC4xNTU5MjUsMi44MDUxMjVdLFswLjI1MTg4NiwwLjE0NDE0NSwyLjgyOTI4XSxbMC4wNjMwMzMsMC4xMzE3MjYsMy4wMTQwOF0sWy0wLjI3Nzc1MywwLjEzNTg5MiwzLjEwNzE2XSxbLTAuNDQxMDQ4LDAuMjc3MDY0LDIuNTk0MzMxXSxbLTEuMDEwOTU2LDAuMDk1Mjg1LDIuNjY4OTgzXSxbLTEuMzE3NjM5LDAuMDY5ODk3LDIuMzI1NDQ4XSxbLTAuNzUxNjkxLDAuMjY0NjgxLDIuMzgxNDk2XSxbMC42ODQxMzcsMC4zMTEzNCwyLjM2NDU3NF0sWzEuMzQ3OTMxLDAuMzAyODgyLDIuMjAxNDM0XSxbLTEuNzM2OTAzLDAuMDI5ODk0LDEuNzI0MTExXSxbLTEuMzE5OTg2LDAuMTE5OTgsMC45MTI5MjVdLFsxLjUzODA3NywwLjE1NzM3MiwwLjQ4MTcxMV0sWzEuOTUxOTc1LDAuMDgxNzQyLDEuMTY0MV0sWzEuODM0NzY4LDAuMDk1ODMyLDEuNjAyNjgyXSxbMi40NDYxMjIsMC4wOTE4MTcsMS4zNzU1OF0sWzIuNjE3NjE1LDAuMDc4NjQ0LDAuNzQyODAxXSxbLTEuNjA5NzQ4LDAuMDQ5NzMsLTAuMjM4NzIxXSxbLTEuMjgxOTczLDAuMjMwOTg0LC0wLjE4MDkxNl0sWy0xLjA3NDUwMSwwLjI0ODIwNCwwLjAzNDAwN10sWy0xLjIwMTczNCwwLjA1ODQ5OSwwLjQwMjIzNF0sWy0xLjQ0NDQ1NCwwLjA1NDc4MywwLjE0OTU3OV0sWy00LjY5NDYwNSw1LjA3NTg4MiwxLjA0MzQyN10sWy0zLjk1OTYzLDcuNzY3Mzk0LDAuNzU4NDQ3XSxbLTQuNzUzMzM5LDUuMzM5ODE3LDAuNjY1MDYxXSxbLTEuMTUwMzI1LDkuMTMzMzI3LC0wLjM2ODU1Ml0sWy00LjMxNjEwNywyLjg5MzYxMSwwLjQ0Mzk5XSxbLTAuODA5MjAyLDkuMzEyNTc1LC0wLjQ2NjA2MV0sWzAuMDg1NjI2LDUuOTYzNjkzLDEuNjg1NjY2XSxbLTEuMzE0ODUzLDkuMDAxNDIsLTAuMTMzOV0sWy00LjM2NDE4MiwzLjA3MjU1NiwxLjQzNjcxMl0sWy0yLjAyMjA3NCw3LjMyMzM5NiwwLjY3ODY1N10sWzEuOTkwODg3LDYuMTMwMjMsMC40Nzk2NDNdLFstMy4yOTU1MjUsNy44Nzg5MTcsMS40MDkzNTNdLFswLjU3MTMwOCw2LjE5NzU2OSwwLjY3MDY1N10sWzAuODk2NjEsNi4yMDAxOCwwLjMzNzA1Nl0sWzAuMzMxODUxLDYuMTYyMzcyLDEuMTg2MzcxXSxbLTQuODQwMDY2LDUuNTk5ODc0LDIuMjk2MDY5XSxbMi4xMzg5ODksNi4wMzEyOTEsMC4yMjgzMzVdLFswLjY3ODkyMyw2LjAyNjE3MywxLjg5NDA1Ml0sWy0wLjc4MTY4Miw1LjYwMTU3MywxLjgzNjczOF0sWzEuMTgxMzE1LDYuMjM5MDA3LDAuMzkzMjkzXSxbLTMuNjA2MzA4LDcuMzc2NDc2LDIuNjYxNDUyXSxbLTAuNTc5MDU5LDQuMDQyNTExLC0xLjU0MDg4M10sWy0zLjA2NDA2OSw4LjYzMDI1MywtMi41OTc1MzldLFstMi4xNTcyNzEsNi44MzcwMTIsMC4zMDAxOTFdLFstMi45NjYwMTMsNy44MjE1ODEsLTEuMTM2OTddLFstMi4zNDQyNiw4LjEyMjk2NSwwLjQwOTA0M10sWy0wLjk1MTY4NCw1Ljg3NDI1MSwxLjQxNTExOV0sWy0yLjgzNDg1Myw3Ljc0ODMxOSwwLjE4MjQwNl0sWy0zLjI0MjQ5Myw3LjgyMDA5NiwwLjM3MzY3NF0sWy0wLjIwODUzMiw1Ljk5Mjg0NiwxLjI1MjA4NF0sWy0zLjA0ODA4NSw4LjQzMTUyNywtMi4xMjk3OTVdLFsxLjQxMzI0NSw1LjgwNjMyNCwyLjI0MzkwNl0sWy0wLjA1MTIyMiw2LjA2NDkwMSwwLjY5NjA5M10sWy00LjIwNDMwNiwyLjcwMDA2MiwwLjcxMzg3NV0sWy00LjYxMDk5Nyw2LjM0MzQwNSwwLjM0NDI3Ml0sWy0zLjI5MTMzNiw5LjMwNTMxLC0zLjM0MDQ0NV0sWy0zLjI3MjExLDcuNTU5MjM5LC0yLjMyNDAxNl0sWy00LjIzODgyLDYuNDk4MzQ0LDMuMTg0NTJdLFstMy45NDUzMTcsNi4zNzc4MDQsMy4zODYyNV0sWy00LjkwNjM3OCw1LjQ3MjI2NSwxLjMxNTE5M10sWy0zLjU4MDEzMSw3Ljg0NjcxNywwLjcwOTY2Nl0sWy0xLjk5NTUwNCw2LjY0NTQ1OSwwLjY4ODQ4N10sWy0yLjU5NTY1MSw3Ljg2MDU0LDAuNzkzMzUxXSxbLTAuMDA4ODQ5LDAuMzA1ODcxLDAuMTg0NDg0XSxbLTAuMDI5MDExLDAuMzE0MTE2LC0wLjI1NzMxMl0sWy0yLjUyMjQyNCw3LjU2NTM5MiwxLjgwNDIxMl0sWy0xLjAyMjk5Myw4LjY1MDgyNiwtMC44NTU2MDldLFstMy44MzEyNjUsNi41OTU0MjYsMy4yNjY3ODNdLFstNC4wNDI1MjUsNi44NTU3MjQsMy4wNjA2NjNdLFstNC4xNzEyNiw3LjQwNDc0MiwyLjM5MTM4N10sWzMuOTA0NTI2LDMuNzY3NjkzLDAuMDkyMTc5XSxbMC4yNjgwNzYsNi4wODY4MDIsMS40NjkyMjNdLFstMy4zMjA0NTYsOC43NTMyMjIsLTIuMDg5NjldLFsxLjIwMzA0OCw2LjI2OTI1LDAuNjEyNDA3XSxbLTQuNDA2NDc5LDIuOTg1OTc0LDAuODUzNjkxXSxbLTMuMjI2ODg5LDYuNjE1MjE1LC0wLjQwNDI0M10sWzAuMzQ2MzI2LDEuNjAyMTEsMy41MDk4NThdLFstMy45NTU0NzYsNy4yNTMzMjMsMi43MjIzOTJdLFstMS4yMzIwNCwwLjA2ODkzNSwxLjY4Nzk0XSxbMC42MjU0MzYsNi4xOTY0NTUsMS4zMzMxNTZdLFs0LjQ2OTEzMiwyLjE2NTI5OCwxLjcwNTI1XSxbMC45NTAwNTMsNi4yNjI4OTksMC45MjI0NDFdLFstMi45ODA0MDQsNS4yNTQ3NCwtMC42NjMxNTVdLFstNC44NTkwNDMsNi4yODc0MSwxLjUzNzA4MV0sWy0zLjA3NzQ1Myw0LjY0MTQ3NSwtMC44OTIxNjddLFstMC40NDAwMiw4LjIyMjUwMywtMC43NzE0NTRdLFstNC4wMzQxMTIsNy42Mzk3ODYsMC4zODk5MzVdLFstMy42OTYwNDUsNi4yNDIwNDIsMy4zOTQ2NzldLFstMS4yMjE4MDYsNy43ODM2MTcsMC4xOTY0NTFdLFswLjcxNDYxLDYuMTQ5ODk1LDEuNjU2NjM2XSxbLTQuNzEzNTM5LDYuMTYzMTU0LDAuNDk1MzY5XSxbLTEuNTA5ODY5LDAuOTEzMDQ0LC0wLjgzMjQxM10sWy0xLjU0NzI0OSwyLjA2Njc1MywtMC44NTI2NjldLFstMy43NTc3MzQsNS43OTM3NDIsMy40NTU3OTRdLFstMC44MzE5MTEsMC4xOTkyOTYsMS43MTg1MzZdLFstMy4wNjI3NjMsNy41MjcxOCwtMS41NTA1NTldLFswLjkzODY4OCw2LjEwMzM1NCwxLjgyMDk1OF0sWy00LjAzNzAzMywyLjQxMjMxMSwwLjk4ODAyNl0sWy00LjEzMDc0NiwyLjU3MTgwNiwxLjEwMTY4OV0sWy0wLjY5MzY2NCw5LjE3NDI4MywtMC45NTIzMjNdLFstMS4yODY3NDIsMS4wNzk2NzksLTAuNzUxMjE5XSxbMS41NDMxODUsMS40MDg5MjUsMy40ODMxMzJdLFsxLjUzNTk3MywyLjA0Nzk3OSwzLjY1NTAyOV0sWzAuOTM4NDQsNS44NDEwMSwyLjE5NTIxOV0sWy0wLjY4NDQwMSw1LjkxODQ5MiwxLjIwMTA5XSxbMS4yODg0NCwyLjAwODY3NiwzLjcxMDc4MV0sWy0zLjU4NjcyMiw3LjQzNTUwNiwtMS40NTQ3MzddLFstMC4xMjk5NzUsNC4zODQxOTIsMi45MzA1OTNdLFstMS4wMzA1MzEsMC4yODEzNzQsMy4yMTQyNzNdLFstMy4wNTg3NTEsOC4xMzcyMzgsLTMuMjI3NzE0XSxbMy42NDk1MjQsNC41OTIyMjYsMS4zNDAwMjFdLFstMy4zNTQ4MjgsNy4zMjI0MjUsLTEuNDEyMDg2XSxbMC45MzY0NDksNi4yMDkyMzcsMS41MTI2OTNdLFstMS4wMDE4MzIsMy41OTA0MTEsLTEuNTQ1ODkyXSxbLTMuNzcwNDg2LDQuNTkzMjQyLDIuNDc3MDU2XSxbLTAuOTcxOTI1LDAuMDY3Nzk3LDAuOTIxMzg0XSxbLTQuNjM5ODMyLDYuODY1NDA3LDIuMzExNzkxXSxbLTAuNDQxMDE0LDguMDkzNTk1LC0wLjU5NTk5OV0sWy0yLjAwNDg1Miw2LjM3MTQyLDEuNjM1MzgzXSxbNC43NTk1OTEsMS45MjgxOCwwLjMyODMyOF0sWzMuNzQ4MDY0LDEuMjI0MDc0LDIuMTQwNDg0XSxbLTAuNzAzNjAxLDUuMjg1NDc2LDIuMjUxOTg4XSxbMC41OTUzMiw2LjIxODkzLDAuOTgxMDA0XSxbMC45ODA3OTksNi4yNTcwMjYsMS4yNDIyM10sWzEuNTc0Njk3LDYuMjA0OTgxLDAuMzgxNjI4XSxbMS4xNDk1OTQsNi4xNzM2MDgsMS42NjA3NjNdLFstMy41MDE5NjMsNS44OTU5ODksMy40NTY1NzZdLFsxLjA3MTEyMiw1LjQyNDE5OCwyLjU4ODcxN10sWy0wLjc3NDY5Myw4LjQ3MzMzNSwtMC4yNzY5NTddLFszLjg0OTk1OSw0LjE1NTQyLDAuMzk2NzQyXSxbLTAuODAxNzE1LDQuOTczMTQ5LC0xLjA2ODU4Ml0sWy0yLjkyNzY3NiwwLjYyNTExMiwyLjMyNjM5M10sWzIuNjY5NjgyLDQuMDQ1NTQyLDIuOTcxMTg0XSxbLTQuMzkxMzI0LDQuNzQwODYsMC4zNDM0NjNdLFsxLjUyMDEyOSw2LjI3MDAzMSwwLjc3NTQ3MV0sWzEuODM3NTg2LDYuMDg0NzMxLDAuMTA5MTg4XSxbMS4yNzE0NzUsNS45NzUwMjQsMi4wMzIzNTVdLFstMy40ODc5NjgsNC41MTMyNDksMi42MDU4NzFdLFstMS4zMjIzNCwxLjUxNzI2NCwtMC42OTE4NzldLFstMS4wODAzMDEsMS42NDgyMjYsLTAuODA1NTI2XSxbLTMuMzY1NzAzLDYuOTEwMTY2LC0wLjQ1NDkwMl0sWzEuMzYwMzQsMC40MzIyMzgsMy4wNzUwMDRdLFstMy4zMDUwMTMsNS43NzQ2ODUsMy4zOTE0Ml0sWzMuODg0MzIsMC42NTQxNDEsMC4xMjU3NF0sWzMuNTcyNTQsMC4zNzc5MzQsMC4zMDI1MDFdLFs0LjE5NjEzNiwwLjgwNzk5OSwwLjIxMjIyOV0sWzMuOTMyOTk3LDAuNTQzMTIzLDAuMzgwNTc5XSxbNC4wMjM3MDQsMy4yODYxMjUsMC41Mzc1OTddLFsxLjg2NDQ1NSw0LjkxNjU0NCwyLjY5MTY3N10sWy00Ljc3NTQyNyw2LjQ5OTQ5OCwxLjQ0MDE1M10sWy0zLjQ2NDkyOCwzLjY4MjM0LDIuNzY2MzU2XSxbMy42NDg5NzIsMS43NTEyNjIsMi4xNTc0ODVdLFsxLjE3OTExMSwzLjIzODg0NiwzLjc3NDc5Nl0sWy0wLjE3MTE2NCwwLjI5OTEyNiwtMC41OTI2NjldLFstNC41MDI5MTIsMy4zMTY2NTYsMC44NzUxODhdLFstMC45NDg0NTQsOS4yMTQwMjUsLTAuNjc5NTA4XSxbMS4yMzc2NjUsNi4yODg1OTMsMS4wNDZdLFsxLjUyMzQyMyw2LjI2ODk2MywxLjEzOTU0NF0sWzEuNDM2NTE5LDYuMTQwNjA4LDEuNzM5MzE2XSxbMy43MjM2MDcsMS41MDQzNTUsMi4xMzY3NjJdLFsyLjAwOTQ5NSw0LjA0NTUxNCwzLjIyMDUzXSxbLTEuOTIxOTQ0LDcuMjQ5OTA1LDAuMjEzOTczXSxbMS4yNTQwNjgsMS4yMDU1MTgsMy40NzQ3MDldLFstMC4zMTcwODcsNS45OTYyNjksMC41MjU4NzJdLFstMi45OTY5MTQsMy45MzQ2MDcsMi45MDAxNzhdLFstMy4zMTY4NzMsNC4wMjgxNTQsMi43ODU2OTZdLFstMy40MDAyNjcsNC4yODAxNTcsMi42ODkyNjhdLFstMy4xMzQ4NDIsNC41NjQ4NzUsMi42OTcxOTJdLFsxLjQ4MDU2Myw0LjY5MjU2NywyLjgzNDA2OF0sWzAuODczNjgyLDEuMzE1NDUyLDMuNTQxNTg1XSxbMS41OTkzNTUsMC45MTYyMiwzLjI0Njc2OV0sWy0zLjI5MjEwMiw3LjEyNTkxNCwyLjc2ODUxNV0sWzMuNzQyOTYsNC41MTEyOTksMC42MTY1MzldLFs0LjY5ODkzNSwxLjU1MzM2LDAuMjY5MjFdLFstMy4yNzQzODcsMy4yOTk0MjEsMi44MjM5NDZdLFstMi44ODgwOSwzLjQxMDY5OSwyLjk1NTI0OF0sWzEuMTcxNDA3LDEuNzY5MDUsMy42ODg0NzJdLFsxLjQzMDI3NiwzLjkyNDgzLDMuNDczNjY2XSxbMy45MTY5NDEsMi41NTMzMDgsMC4wMTg5NDFdLFswLjcwMTYzMiwyLjQ0MjM3MiwzLjc3ODYzOV0sWzEuNTYyNjU3LDIuMzAyNzc4LDMuNjYwOTU3XSxbNC40NzY2MjIsMS4xNTI0MDcsMC4xODIxMzFdLFstMC42MTEzNiw1Ljc2MTM2NywxLjU5ODgzOF0sWy0zLjEwMjE1NCwzLjY5MTY4NywyLjkwMzczOF0sWzEuODE2MDEyLDUuNTQ2MTY3LDIuMzgwMzA4XSxbMy44NTM5MjgsNC4yNTA2NiwwLjc1MDAxN10sWzEuMjM0NjgxLDMuNTgxNjY1LDMuNjczNzIzXSxbMS44NjIyNzEsMS4zNjE4NjMsMy4zNTUyMDldLFsxLjM0Njg0NCw0LjE0Njk5NSwzLjMyNzg3N10sWzEuNzA2NzIsNC4wODAwNDMsMy4yNzQzMDddLFswLjg5NzI0MiwxLjkwODk4MywzLjY5NjldLFstMC41ODcwMjIsOS4xOTExMzIsLTAuNTY1MzAxXSxbLTAuMjE3NDI2LDUuNjc0NjA2LDIuMDE5OTY4XSxbMC4yNzg5MjUsNi4xMjA3NzcsMC40ODU0MDNdLFsxLjQ2MzMyOCwzLjU3ODc0MiwtMi4wMDE0NjRdLFstMy4wNzI5ODUsNC4yNjQ1ODEsMi43ODk1MDJdLFszLjYyMzUzLDQuNjczODQzLDAuMzgzNDUyXSxbLTMuMDUzNDkxLDguNzUyMzc3LC0yLjkwODQzNF0sWy0yLjYyODY4Nyw0LjUwNTA3MiwyLjc1NTYwMV0sWzAuODkxMDQ3LDUuMTEzNzgxLDIuNzQ4MjcyXSxbLTIuOTIzNzMyLDMuMDY1MTUsMi44NjYzNjhdLFswLjg0ODAwOCw0Ljc1NDI1MiwyLjg5Njk3Ml0sWy0zLjMxOTE4NCw4LjgxMTY0MSwtMi4zMjc0MTJdLFswLjEyODY0LDguODE0NzgxLC0xLjMzNDQ1Nl0sWzEuNTQ5NTAxLDQuNTQ5MzMxLC0xLjI4MjQzXSxbMS42NDcxNjEsMy43Mzg5NzMsMy41MDc3MTldLFsxLjI1MDg4OCwwLjk0NTU5OSwzLjM0ODczOV0sWzMuODA5NjYyLDQuMDM4ODIyLDAuMDUzMTQyXSxbMS40ODMxNjYsMC42NzMzMjcsMy4wOTE1Nl0sWzAuODI5NzI2LDMuNjM1OTIxLDMuNzEzMTAzXSxbMS4zNTI5MTQsNS4yMjY2NTEsMi42NjgxMTNdLFsyLjIzNzM1Miw0LjM3NDE0LDMuMDE2Mzg2XSxbNC41MDc5MjksMC44ODk0NDcsMC43NDQyNDldLFs0LjU3MzA0LDEuMDEwOTgxLDAuNDk2NTg4XSxbMy45MzE0MjIsMS43MjA5ODksMi4wODgxNzVdLFstMC40NjMxNzcsNS45ODk4MzUsMC44MzQzNDZdLFstMi44MTEyMzYsMy43NDUwMjMsMi45Njk1ODddLFstMi44MDUxMzUsNC4yMTk3MjEsMi44NDExMDhdLFstMi44MzY4NDIsNC44MDI1NDMsMi42MDgyNl0sWzEuNzc2NzE2LDIuMDg0NjExLDMuNTY4NjM4XSxbNC4wNDY4ODEsMS40NjM0NzgsMi4xMDYyNzNdLFswLjMxNjI2NSw1Ljk0NDMxMywxLjg5Mjc4NV0sWy0yLjg2MzQ3LDIuNzc2MDQ5LDIuNzcyNDJdLFstMi42NzM2NDQsMy4xMTY1MDgsMi45MDcxMDRdLFstMi42MjExNDksNC4wMTg1MDIsMi45MDM0MDldLFstMi41NzM0NDcsNS4xOTgwMTMsMi40Nzc0ODFdLFsxLjEwNDAzOSwyLjI3ODk4NSwzLjcyMjQ2OV0sWy00LjYwMjc0Myw0LjMwNjQxMywwLjkwMjI5Nl0sWy0yLjY4NDg3OCwxLjUxMDczMSwwLjUzNTAzOV0sWzAuMDkyMDM2LDguNDczMjY5LC0wLjk5NDEzXSxbLTEuMjgwNDcyLDUuNjAyMzkzLDEuOTI4MTA1XSxbLTEuMDI3OSw0LjEyMTU4MiwtMS40MDMxMDNdLFstMi40NjEwODEsMy4zMDQ0NzcsMi45NTczMTddLFstMi4zNzU5MjksMy42NTkzODMsMi45NTMyMzNdLFsxLjQxNzU3OSwyLjcxNTM4OSwzLjcxODc2N10sWzAuODE5NzI3LDIuOTQ4ODIzLDMuODEwNjM5XSxbMS4zMjk5NjIsMC43NjE3NzksMy4yMDM3MjRdLFsxLjczOTUyLDUuMjk1MjI5LDIuNTM3NzI1XSxbMC45NTI1MjMsMy45NDUwMTYsMy41NDgyMjldLFstMi41Njk0OTgsMC42MzM2NjksMi44NDgxOF0sWy0yLjI3NjY3NiwwLjc1NzAxMywyLjc4MDcxN10sWy0yLjAxMzE0Nyw3LjM1NDQyOSwtMC4wMDMyMDJdLFswLjkzMTQzLDEuNTY1OTEzLDMuNjAwMzI1XSxbMS4yNDkwMTQsMS41NTA1NTYsMy41ODU4NDJdLFsyLjI4NzI1Miw0LjA3MjM1MywzLjEyNDU0NF0sWy00LjczNDksNy4wMDYyNDQsMS42OTA2NTNdLFstMy41MDA2MDIsOC44MDM4NiwtMi4wMDkxOTZdLFstMC41ODI2MjksNS41NDkxMzgsMi4wMDA5MjNdLFstMS44NjUyOTcsNi4zNTYwNjYsMS4zMTM1OTNdLFstMy4yMTIxNTQsMi4zNzYxNDMsLTAuNTY1NTkzXSxbMi4wOTI4ODksMy40OTM1MzYsLTEuNzI3OTMxXSxbLTIuNTI4NTAxLDIuNzg0NTMxLDIuODMzNzU4XSxbLTIuNTY1Njk3LDQuODkzMTU0LDIuNTU5NjA1XSxbLTIuMTUzMzY2LDUuMDQ1ODQsMi40NjUyMTVdLFsxLjYzMTMxMSwyLjU2ODI0MSwzLjY4MTQ0NV0sWzIuMTUwMTkzLDQuNjk5MjI3LDIuODA3NTA1XSxbMC41MDc1OTksNS4wMTgxMywyLjc3NTg5Ml0sWzQuMTI5ODYyLDEuODYzNjk4LDIuMDE1MTAxXSxbMy41NzgyNzksNC41MDc2NiwtMC4wMDk1OThdLFszLjQ5MTAyMyw0LjgwNjc0OSwxLjU0OTI2NV0sWzAuNjE5NDg1LDEuNjI1MzM2LDMuNjA1MTI1XSxbMS4xMDc0OTksMi45MzI1NTcsMy43OTAwNjFdLFstMi4wODIyOTIsNi45OTMyMSwwLjc0MjYwMV0sWzQuODM5OTA5LDEuMzc5Mjc5LDAuOTQ1Mjc0XSxbMy41OTEzMjgsNC4zMjI2NDUsLTAuMjU5NDk3XSxbMS4wNTUyNDUsMC43MTA2ODYsMy4xNjU1M10sWy0zLjAyNjQ5NCw3Ljg0MjIyNywxLjYyNDU1M10sWzAuMTQ2NTY5LDYuMTE5MjE0LDAuOTgxNjczXSxbLTIuMDQzNjg3LDIuNjE0NTA5LDIuNzg1NTI2XSxbLTIuMzAyMjQyLDMuMDQ3Nzc1LDIuOTM2MzU1XSxbLTIuMjQ1Njg2LDQuMTAwNDI0LDIuODc3OTRdLFsyLjExNjE0OCw1LjA2MzUwNywyLjU3MjIwNF0sWy0xLjQ0ODQwNiw3LjY0NTU5LDAuMjUxNjkyXSxbMi41NTA3MTcsNC45MjY4LDIuNTE3NTI2XSxbLTIuOTU1NDU2LDcuODAyOTMsLTEuNzgyNDA3XSxbMS44ODI5OTUsNC42MzcxNjcsMi44OTU0MzZdLFstMi4wMTQ5MjQsMy4zOTgyNjIsMi45NTQ4OTZdLFstMi4yNzM2NTQsNC43NzEyMjcsMi42MTE0MThdLFstMi4xNjI3MjMsNy44NzY3NjEsMC43MDI0NzNdLFstMC4xOTg2NTksNS44MjMwNjIsMS43MzkyNzJdLFstMS4yODA5MDgsMi4xMzMxODksLTAuOTIxMjQxXSxbMi4wMzk5MzIsNC4yNTE1NjgsMy4xMzY1NzldLFsxLjQ3NzgxNSw0LjM1NDMzMywzLjEwODMyNV0sWzAuNTYwNTA0LDMuNzQ0MTI4LDMuNjkxM10sWy0yLjIzNDAxOCwxLjA1NDM3MywyLjM1Mjc4Ml0sWy0zLjE4OTE1Niw3LjY4NjY2MSwtMi41MTQ5NTVdLFstMy43NDQ3MzYsNy42OTk2MywyLjExNjk3M10sWy0yLjI4MzM2NiwyLjg3ODM2NSwyLjg3ODgyXSxbLTIuMTUzNzg2LDQuNDU3NDgxLDIuNzQzNTI5XSxbNC45MzM5NzgsMS42NzcyODcsMC43MTM3NzNdLFszLjUwMjE0NiwwLjUzNTMzNiwxLjc1MjUxMV0sWzEuODI1MTY5LDQuNDE5MjUzLDMuMDgxMTk4XSxbMy4wNzIzMzEsMC4yODA5NzksMC4xMDY1MzRdLFstMC41MDgzODEsMS4yMjAzOTIsMi44NzgwNDldLFstMy4xMzg4MjQsOC40NDUzOTQsLTEuNjU5NzExXSxbLTIuMDU2NDI1LDIuOTU0ODE1LDIuODk3MjQxXSxbLTIuMDM1MzQzLDUuMzk4NDc3LDIuMjE1ODQyXSxbLTMuMjM5OTE1LDcuMTI2Nzk4LC0wLjcxMjU0N10sWy0xLjg2NzkyMyw3Ljk4OTgwNSwwLjUyNjUxOF0sWzEuMjM0MDUsNi4yNDg5NzMsMS4zODcxODldLFstMC4yMTY0OTIsOC4zMjA5MzMsLTAuODYyNDk1XSxbLTIuMDc5NjU5LDMuNzU1NzA5LDIuOTI4NTYzXSxbLTEuNzg1OTUsNC4zMDAzNzQsMi44MDUyOTVdLFstMS44NTY1ODksNS4xMDY3OCwyLjM4NjU3Ml0sWy0xLjcxNDM2Miw1LjU0NDc3OCwyLjAwNDYyM10sWzEuNzIyNDAzLDQuMjAwMjkxLC0xLjQwODE2MV0sWzAuMTk1Mzg2LDAuMDg2OTI4LC0xLjMxODAwNl0sWzEuMzkzNjkzLDMuMDEzNDA0LDMuNzEwNjg2XSxbLTAuNDE1MzA3LDguNTA4NDcxLC0wLjk5Njg4M10sWy0xLjg1Mzc3NywwLjc1NTYzNSwyLjc1NzI3NV0sWy0xLjcyNDA1NywzLjY0NTMzLDIuODg0MjUxXSxbLTEuODg0NTExLDQuOTI3ODAyLDIuNTMwODg1XSxbLTEuMDE3MTc0LDcuNzgzOTA4LC0wLjIyNzA3OF0sWy0xLjc3OTgsMi4zNDI1MTMsMi43NDE3NDldLFstMS44NDEzMjksMy45NDM5OTYsMi44ODQzNl0sWzEuNDMwMzg4LDUuNDY4MDY3LDIuNTAzNDY3XSxbLTIuMDMwMjk2LDAuOTQwMDI4LDIuNjExMDg4XSxbLTEuNjc3MDI4LDEuMjE1NjY2LDIuNjA3NzcxXSxbLTEuNzQwOTIsMi44MzI1NjQsMi44MjcyOTVdLFs0LjE0NDY3MywwLjYzMTM3NCwwLjUwMzM1OF0sWzQuMjM4ODExLDAuNjUzOTkyLDAuNzYyNDM2XSxbLTEuODQ3MDE2LDIuMDgyODE1LDIuNjQyNjc0XSxbNC4wNDU3NjQsMy4xOTQwNzMsMC44NTIxMTddLFstMS41NjM5ODksOC4xMTI3MzksMC4zMDMxMDJdLFstMS43ODE2MjcsMS43OTQ4MzYsMi42MDIzMzhdLFstMS40OTM3NDksMi41MzM3OTksMi43OTcyNTFdLFstMS45MzQ0OTYsNC42OTA2ODksMi42NTg5OTldLFstMS40OTkxNzQsNS43Nzc5NDYsMS43NDc0OThdLFstMi4zODc0MDksMC44NTEyOTEsMS41MDA1MjRdLFstMS44NzIyMTEsOC4yNjk5ODcsMC4zOTI1MzNdLFstNC42NDc3MjYsNi43NjU3NzEsMC44MzM2NTNdLFstMy4xNTc0ODIsMC4zNDE5NTgsLTAuMjA2NzFdLFstMS43MjU3NjYsMy4yNDcwMywyLjg4MzU3OV0sWy0xLjQ1ODE5OSw0LjA3OTAzMSwyLjgzNjMyNV0sWy0xLjYyMTU0OCw0LjUxNTg2OSwyLjcxOTI2Nl0sWy0xLjYwNzI5Miw0LjkxODkxNCwyLjUwNTg4MV0sWy0xLjQ5NDY2MSw1LjU1NjIzOSwxLjk5MTU5OV0sWy0xLjcyNzI2OSw3LjQyMzc2OSwwLjAxMjMzN10sWy0xLjM4MjQ5NywxLjE2MTMyMiwyLjY0MDIyMl0sWy0xLjUyMTI5LDQuNjgxNzE0LDIuNjE1NDY3XSxbLTQuMjQ3MTI3LDIuNzkyODEyLDEuMjUwODQzXSxbLTEuNTc2MzM4LDAuNzQyOTQ3LDIuNzY5Nzk5XSxbLTEuNDk5MjU3LDIuMTcyNzYzLDIuNzQzMTQyXSxbLTEuNDgwMzkyLDMuMTAzMjYxLDIuODYyMjYyXSxbMS4wNDkxMzcsMi42MjU4MzYsMy43NzUzODRdLFstMS4zNjgwNjMsMS43OTE1ODcsMi42OTU1MTZdLFstMS4zMDc4MzksMi4zNDQ1MzQsMi43Njc1NzVdLFstMS4zMzY3NTgsNS4wOTIyMjEsMi4zNTUyMjVdLFstMS41NjE3LDUuMzAxNzQ5LDIuMjE2MjVdLFstMS40ODMzNjIsOC41Mzc3MDQsMC4xOTY3NTJdLFstMS41MTczNDgsOC43NzM2MTQsMC4wNzQwNTNdLFstMS40NzQzMDIsMS40OTI3MzEsMi42NDE0MzNdLFsyLjQ4NzE4LDAuNjQ0MjQ3LC0wLjkyMDIyNl0sWzAuODE4MDkxLDAuNDIyNjgyLDMuMTcxMjE4XSxbLTMuNjIzMzk4LDYuOTMwMDk0LDMuMDMzMDQ1XSxbMS42NzYzMzMsMy41MzEwMzksMy41OTE1OTFdLFsxLjE5OTkzOSw1LjY4Mzg3MywyLjM2NTYyM10sWy0xLjIyMzg1MSw4Ljg0MTIwMSwwLjAyNTQxNF0sWy0xLjI4NjMwNywzLjg0NzY0MywyLjkxODA0NF0sWy0xLjI1ODU3LDQuODEwODMxLDIuNTQzNjA1XSxbMi42MDM2NjIsNS41NzIxNDYsMS45OTE4NTRdLFswLjEzODk4NCw1Ljc3OTcyNCwyLjA3NzgzNF0sWy0xLjI2NzAzOSwzLjE3NTE2OSwyLjg5MDg4OV0sWy0xLjI5MzYxNiwzLjQ1NDYxMiwyLjkxMTc3NF0sWy0yLjYwMTEyLDEuMjc3MTg0LDAuMDc3MjRdLFsyLjU1Mjc3OSwzLjY0OTg3NywzLjE2MzY0M10sWy0xLjAzODk4MywxLjI0ODAxMSwyLjYwNTkzM10sWy0xLjI4ODcwOSw0LjM5MDk2NywyLjc2MTIxNF0sWy0xLjAzNDIxOCw1LjQ4NTk2MywyLjAxMTQ2N10sWy0xLjE4NTU3NiwxLjQ2NDg0MiwyLjYyNDMzNV0sWy0xLjA0NTY4MiwyLjU0ODk2LDIuNzYxMTAyXSxbNC4yNTkxNzYsMS42NjA2MjcsMi4wMTgwOTZdLFstMC45NjE3MDcsMS43MTcxODMsMi41OTgzNDJdLFstMS4wNDQ2MDMsMy4xNDc0NjQsMi44NTUzMzVdLFstMC44OTE5OTgsNC42ODU0MjksMi42Njk2OTZdLFstMS4wMjc1NjEsNS4wODE2NzIsMi4zNzc5MzldLFs0LjM4NjUwNiwwLjgzMjQzNCwwLjUxMDA3NF0sWy0xLjAxNDIyNSw5LjA2NDk5MSwtMC4xNzUzNTJdLFstMS4yMTg3NTIsMi44OTU0NDMsMi44MjM3ODVdLFstMC45NzIwNzUsNC40MzI2NjksMi43ODgwMDVdLFstMi43MTQ5ODYsMC41MjQyNSwxLjUwOTc5OF0sWy0wLjY5OTI0OCwxLjUxNzIxOSwyLjY0NTczOF0sWy0xLjE2MTU4MSwyLjA3ODg1MiwyLjcyMjc5NV0sWy0wLjg0NTI0OSwzLjI4NjI0NywyLjk5NjQ3MV0sWzEuMDY4MzI5LDQuNDQzNDQ0LDIuOTkzODYzXSxbMy45ODEzMiwzLjcxNTU1NywxLjAyNzc3NV0sWzEuNjU4MDk3LDMuOTgyNDI4LC0xLjY1MTY4OF0sWy00LjA1MzcwMSwyLjQ0OTg4OCwwLjczNDc0Nl0sWy0wLjkxMDkzNSwyLjIxNDE0OSwyLjcwMjM5M10sWzAuMDg3ODI0LDMuOTYxNjUsMy40MzkzNDRdLFstMC43Nzk3MTQsMy43MjQxMzQsMi45OTM0MjldLFstMS4wNTEwOTMsMy44MTA3OTcsMi45NDE5NTddLFstMC42NDQ5NDEsNC4zODU5LDIuODcwODYzXSxbLTIuOTg0MDMsOC42NjY4OTUsLTMuNjkxODg4XSxbLTAuNzU0MzA0LDIuNTA4MzI1LDIuODEyOTk5XSxbLTQuNjM1NTI0LDMuNjYyODkxLDAuOTEzMDA1XSxbLTAuOTgzMjk5LDQuMTI1OTc4LDIuOTE1Mzc4XSxbNC45MTY0OTcsMS45MDUyMDksMC42MjEzMTVdLFs0Ljg3NDk4MywxLjcyODQyOSwwLjQ2ODUyMV0sWzIuMzMxMjcsNS4xODE5NTcsMi40NDE2OTddLFstMC42NTM3MTEsMi4yNTMzODcsMi43OTQ5XSxbLTMuNjIzNzQ0LDguOTc4Nzk1LC0yLjQ2MTkyXSxbLTQuNTU1OTI3LDYuMTYwMjc5LDAuMjE1NzU1XSxbLTQuOTQwNjI4LDUuODA2NzEyLDEuMTgzODNdLFszLjMwODUwNiwyLjQwMzI2LC0wLjkxMDc3Nl0sWzAuNTg4MzUsNS4yNTE5MjgsLTAuOTkyODg2XSxbMi4xNTIyMTUsNS40NDk3MzMsMi4zMzE2NzldLFstMC43MTI3NTUsMC43NjY3NjUsMy4yODAzNzVdLFstMC43NDE3NzEsMS45NzE2LDIuNjU3MjM1XSxbLTQuODI4OTU3LDUuNTY2OTQ2LDIuNjM1NjIzXSxbLTMuNDc0Nzg4LDguNjk2NzcxLC0xLjc3NjEyMV0sWzEuNzcwNDE3LDYuMjA1NTYxLDEuMzMxNjI3XSxbLTAuNjIwNjI2LDQuMDY0NzIxLDIuOTY4OTcyXSxbLTEuNDk5MTg3LDIuMzA3NzM1LC0wLjk3ODkwMV0sWzQuMDk4NzkzLDIuMzMwMjQ1LDEuNjY3OTUxXSxbMS45NDA0NDQsNi4xNjcwNTcsMC45MzU5MDRdLFstMi4zMTQ0MzYsMS4xMDQ5OTUsMS42ODEyNzddLFstMi43MzM2MjksNy43NDI3OTMsMS43NzA1XSxbLTAuNDUyMjQ4LDQuNzE5ODY4LDIuNzQwODM0XSxbLTAuNjQ5MTQzLDQuOTUxNzEzLDIuNTQxMjk2XSxbLTAuNDc5NDE3LDkuNDM5NTksLTAuNjc2MzI0XSxbLTIuMjUxODUzLDYuNTU5Mjc1LDAuMDQ2ODE5XSxbMC4wMzM1MzEsOC4zMTY5MDcsLTAuNzg5OTM5XSxbLTAuNTEzMTI1LDAuOTk1NjczLDMuMTI1NDYyXSxbLTIuNjM3NjAyLDEuMDM5NzQ3LDAuNjAyNDM0XSxbMS41Mjc1MTMsNi4yMzAwODksMS40MzA5MDNdLFs0LjAzNjEyNCwyLjYwOTg0NiwxLjUwNjQ5OF0sWy0zLjU1OTgyOCw3Ljg3Nzg5MiwxLjIyODA3Nl0sWy00LjU3MDczNiw0Ljk2MDE5MywwLjgzODIwMV0sWy0wLjQzMjEyMSw1LjE1NzczMSwyLjQ2NzUxOF0sWy0xLjIwNjczNSw0LjU2MjUxMSwtMS4yMzcwNTRdLFstMC44MjM3NjgsMy43ODg3NDYsLTEuNTY3NDgxXSxbLTMuMDk1NTQ0LDcuMzUzNjEzLC0xLjAyNDU3N10sWy00LjA1NjA4OCw3LjYzMTExOSwyLjA2MjAwMV0sWy0wLjI4OTM4NSw1LjM4MjI2MSwyLjMyOTQyMV0sWzEuNjk3NTIsNi4xMzY0ODMsMS42NjcwMzddLFstMC4xNjg3NTgsNS4wNjExMzgsMi42MTc0NTNdLFsyLjg1MzU3NiwxLjYwNTUyOCwtMS4yMjk5NThdLFstNC41MTQzMTksNi41ODY2NzUsMC4zNTI3NTZdLFstMi41NTgwODEsNy43NDExNTEsMS4yOTI5NV0sWzEuNjExMTYsNS45MjM1OCwyLjA3MTUzNF0sWzMuOTM2OTIxLDMuMzU0ODU3LDAuMDkxNzU1XSxbLTAuMTYzMywxLjExOTI3MiwzLjE0Nzk3NV0sWzAuMDY3NTUxLDEuNTkzNDc1LDMuMzgyMTJdLFstMS4zMDMyMzksMi4zMjgxODQsLTEuMDExNjcyXSxbLTAuNDM4MDkzLDAuNzM0MjMsMy4zOTgzODRdLFstNC42Mjc2NywzLjg5ODE4NywwLjg0OTU3M10sWzAuMjg2ODUzLDQuMTY1MjgxLDMuMjg0ODM0XSxbLTIuOTY4MDUyLDguNDkyODEyLC0zLjQ5MzY5M10sWy0wLjExMTg5NiwzLjY5NjExMSwzLjUzNzkxXSxbLTMuODA4MjQ1LDguNDUxNzMxLC0xLjU3NDc0Ml0sWzAuMDUzNDE2LDUuNTU4NzY0LDIuMzExMDddLFszLjk1NjI2OSwzLjAxMjA3MSwwLjExMTIxXSxbLTAuNzEwOTU2LDguMTA2NTYxLC0wLjY2NTE1NF0sWzAuMjM0NzI1LDIuNzE3MzI2LDMuNzIyMzc5XSxbLTAuMDMxNTk0LDIuNzY0MTEsMy42NTczNDddLFstMC4wMTczNzEsNC43MDA2MzMsMi44MTkxMV0sWzAuMjE1MDY0LDUuMDM0ODU5LDIuNzIxNDI2XSxbLTAuMTExMTUxLDguNDgwMzMzLC0wLjY0OTM5OV0sWzMuOTc5NDIsMy41NzU0NzgsMC4zNjIyMTldLFswLjM5Mjk2Miw0LjczNTM5MiwyLjg3NDMyMV0sWzQuMTcwMTUsMi4wODUwODcsMS44NjU5OTldLFswLjE2OTA1NCwxLjI0NDc4NiwzLjMzNzcwOV0sWzAuMDIwMDQ5LDMuMTY1ODE4LDMuNzIxNzM2XSxbMC4yNDgyMTIsMy41OTU1MTgsMy42OTgzNzZdLFswLjEzMDcwNiw1LjI5NTU0MSwyLjU0MDAzNF0sWy00LjU0MTM1Nyw0Ljc5ODMzMiwxLjAyNjg2Nl0sWy0xLjI3NzQ4NSwxLjI4OTUxOCwtMC42NjcyNzJdLFszLjg5MjEzMywzLjU0MjYzLC0wLjA3ODA1Nl0sWzQuMDU3Mzc5LDMuMDM2NjksMC45OTc5MTNdLFswLjI4NzcxOSwwLjg4NDc1OCwzLjI1MTc4N10sWzAuNTM1NzcxLDEuMTQ0NzAxLDMuNDAwMDk2XSxbMC41ODUzMDMsMS4zOTkzNjIsMy41MDUzNTNdLFswLjE5MTU1MSwyLjA3NjI0NiwzLjU0OTM1NV0sWzAuMzI4NjU2LDIuMzk0NTc2LDMuNjQ5NjIzXSxbMC40MTMxMjQsMy4yNDA3MjgsMy43NzE1MTVdLFswLjYzMDM2MSw0LjUwMTU0OSwyLjk2MzYyM10sWzAuNTI5NDQxLDUuODU0MzkyLDIuMTIwMjI1XSxbMy44MDU3OTYsMy43Njk5NTgsLTAuMTYyMDc5XSxbMy40NDcyNzksNC4zNDQ4NDYsLTAuNDY3Mjc2XSxbMC4zNzc2MTgsNS41NTExMTYsMi40MjYwMTddLFswLjQwOTM1NSwxLjgyMTI2OSwzLjYwNjMzM10sWzAuNzE5OTU5LDIuMTk0NzI2LDMuNzAzODUxXSxbMC40OTU5MjIsMy41MDE1MTksMy43NTU2NjFdLFswLjYwMzQwOCw1LjM1NDA5NywyLjYwMzA4OF0sWy00LjYwNTA1Niw3LjUzMTk3OCwxLjE5NTc5XSxbMC45MDc5NzIsMC45NzMxMjgsMy4zNTY1MTNdLFswLjc1MDEzNCwzLjM1NjEzNywzLjc2NTg0N10sWzAuNDQ5NiwzLjk5MzI0NCwzLjUwNDU0NF0sWy0zLjAzMDczOCw3LjQ4OTQ3LC0xLjI1OTE2OV0sWzAuNzA3NTA1LDUuNjAyMDA1LDIuNDM0NzZdLFswLjY2ODk0NCwwLjY1NDg5MSwzLjIxMzc5N10sWzAuNTkzMjQ0LDIuNzAwOTc4LDMuNzkxNDI3XSxbMS40Njc3NTksMy4zMDMyNywzLjcxMDM1XSxbMy4zMTYyNDksMi40MzYzODgsMi41ODExNzVdLFszLjI2MTM4LDEuNzI0NDI1LDIuNTM5MDI4XSxbLTEuMjMxMjkyLDcuOTY4MjYzLDAuMjgxNDE0XSxbLTAuMTA4NzczLDguNzEyMzA3LC0wLjc5MDYwN10sWzQuNDQ1Njg0LDEuODE5NDQyLDEuODk2OTg4XSxbMS45OTg5NTksMi4yODE0OTksMy40OTQ0N10sWzIuMTYyMjY5LDIuMTEzODE3LDMuMzY1NDQ5XSxbNC4zNjMzOTcsMS40MDY3MzEsMS45MjI3MTRdLFs0LjgwOCwyLjIyNTg0MiwwLjYxMTEyN10sWzIuNzM1OTE5LDAuNzcxODEyLC0wLjcwMTE0Ml0sWzEuODk3NzM1LDIuODc4NDI4LDMuNTgzNDgyXSxbLTMuMzE2MTYsNS4zMzE5ODUsMy4yMTIzOTRdLFstMy4zMzE0LDYuMDE4MTM3LDMuMzEzMDE4XSxbLTMuNTAzMTgzLDYuNDgwMTAzLDMuMjIyMjE2XSxbLTEuOTA0NDUzLDUuNzUwMzkyLDEuOTEzMzI0XSxbLTEuMzM5NzM1LDMuNTU5NTkyLC0xLjQyMTgxN10sWy0xLjA0NDI0Miw4LjIyNTM5LDAuMDM3NDE0XSxbMS42NDM0OTIsMy4xMTA2NzYsMy42NDc0MjRdLFszLjk5MjgzMiwzLjY4NjI0NCwwLjcxMDk0Nl0sWzEuNzc0MjA3LDEuNzE4NDIsMy40NzU3NjhdLFstMy40Mzg4NDIsNS41NzEzLDMuNDI3ODE4XSxbNC42MDI0NDcsMS4yNTgzLDEuNjE5NTI4XSxbLTAuOTI1NTE2LDcuOTMwMDQyLDAuMDcyMzM2XSxbLTEuMjUyMDkzLDMuODQ2NTY1LC0xLjQyMDc2MV0sWy0zLjQyNjg1Nyw1LjA3MjQxOSwyLjk3ODA2XSxbLTMuMTYwNDA4LDYuMTUyNjI5LDMuMDYxODY5XSxbMy43Mzk5MzEsMy4zNjcwODIsMi4wNDEyNzNdLFsxLjAyNzQxOSw0LjIzNTg5MSwzLjI1MTI1M10sWzQuNzc3NzAzLDEuODg3NDUyLDEuNTYwNDA5XSxbLTMuMzE4NTI4LDYuNzMzNzk2LDIuOTgyOTY4XSxbMi45MjkyNjUsNC45NjI1NzksMi4yNzEwNzldLFszLjQ0OTc2MSwyLjgzODYyOSwyLjQ3NDU3Nl0sWy0zLjI4MDE1OSw1LjAyOTg3NSwyLjc4NzUxNF0sWzQuMDY4OTM5LDIuOTkzNjI5LDAuNzQxNTY3XSxbMC4zMDMzMTIsOC43MDkyNywtMS4xMjE5NzJdLFswLjIyOTg1Miw4Ljk4MTMyMiwtMS4xODYwNzVdLFstMC4wMTEwNDUsOS4xNDgxNTYsLTEuMDQ3MDU3XSxbLTIuOTQyNjgzLDUuNTc5NjEzLDIuOTI5Mjk3XSxbLTMuMTQ1NDA5LDUuNjk4NzI3LDMuMjA1Nzc4XSxbLTMuMDE5MDg5LDYuMzA4ODcsMi43OTQzMjNdLFstMy4yMTcxMzUsNi40NjgxOTEsMi45NzAwMzJdLFstMy4wNDgyOTgsNi45OTM2NDEsMi42MjMzNzhdLFstMy4wNzQyOSw2LjY2MDk4MiwyLjcwMjQzNF0sWzMuNjEyMDExLDIuNTU3NCwyLjI1MzQ5XSxbMi41NDUxNiw0LjU1Mzk2NywyLjc1ODg0XSxbLTEuNjgzNzU5LDcuNDAwNzg3LDAuMjUwODY4XSxbLTEuNzU2MDY2LDcuNDYzNTU3LDAuNDQ4MDMxXSxbLTMuMDIzNzYxLDUuMTQ5Njk3LDIuNjczNTM5XSxbMy4xMTIzNzYsMi42NzcyMTgsMi43ODIzNzhdLFsyLjgzNTMyNyw0LjU4MTE5NiwyLjU2NzE0Nl0sWy0yLjk3Mzc5OSw3LjIyNTQ1OCwyLjUwNjk4OF0sWy0wLjU5MTY0NSw4Ljc0MDY2MiwtMC41MDU4NDVdLFszLjc4Mjg2MSwyLjA0MzM3LDIuMDMwNjZdLFszLjMzMTYwNCwzLjM2MzQzLDIuNjA1MDQ3XSxbMi45NjY4NjYsMS4yMDU0OTcsMi41Mzc0MzJdLFswLjAwMjY2OSw5LjY1NDc0OCwtMS4zNTU1NTldLFsyLjYzMjgwMSwwLjU4NDk3LDIuNTQwMzExXSxbLTIuODE5Mzk4LDUuMDg3MzcyLDIuNTIxMDk4XSxbMi42MTYxOTMsNS4zMzI5NjEsMi4xOTQyODhdLFstMy4xOTM5NzMsNC45MjU2MzQsMi42MDc5MjRdLFstMy4xMjYxOCw1LjI3NTI0LDIuOTQ0NTQ0XSxbLTAuNDI2MDAzLDguNTE2MzU0LC0wLjUwMTUyOF0sWzIuODAyNzE3LDEuMzg3NjQzLDIuNzUxNjQ5XSxbLTMuMTIwNTk3LDcuODg5MTExLC0yLjc1NDMxXSxbMi42MzY2NDgsMS43MTcwMiwyLjk5MTMwMl0sWy0yLjg1MzE1MSw2LjcxMTc5MiwyLjQzMDI3Nl0sWy0yLjg0MzgzNiw2Ljk2Mjg2NSwyLjQwMDg0Ml0sWzEuOTY5NiwzLjE5OTAyMywzLjUwNDUxNF0sWy0yLjQ2MTc1MSwwLjM4NjM1MiwzLjAwODk5NF0sWzEuNjQxMjcsMC40OTU3NTgsMy4wMjk1OF0sWy00LjMzMDQ3Miw1LjQwOTgzMSwwLjAyNTI4N10sWy0yLjkxMjM4Nyw1Ljk4MDQxNiwyLjg0NDI2MV0sWy0yLjQ5MDA2OSwwLjIxMTA3OCwyLjk4NTM5MV0sWzMuNTgxODE2LDQuODA5MTE4LDAuNzMzNzI4XSxbMi42OTMxOTksMi42NDcyMTMsMy4xMjY3MDldLFstMC4xODI5NjQsOC4xODQxMDgsLTAuNjM4NDU5XSxbLTIuMjI2ODU1LDAuNDQ0NzExLDIuOTQ2NTUyXSxbLTAuNzIwMTc1LDguMTE1MDU1LDAuMDE3Njg5XSxbMi42NDUzMDIsNC4zMTYyMTIsMi44NTAxMzldLFstMC4yMzI3NjQsOS4zMjk1MDMsLTAuOTE4NjM5XSxbNC44NTIzNjUsMS40NzE5MDEsMC42NTI3NV0sWzIuNzYyMjksMi4wMTQ5OTQsMi45NTc3NTVdLFstMi44MDgzNzQsNS4zNTQzMDEsMi42NDQ2OTVdLFstMi43OTA5NjcsNi40MDY5NjMsMi41NDc5ODVdLFstMS4zNDI2ODQsMC40MTg0ODgsLTEuNjY5MTgzXSxbMi42OTA2NzUsNS41OTM1ODcsLTAuMDQxMjM2XSxbNC42NjAxNDYsMS42MzE4LDEuNzEzMzE0XSxbMi43NzU2NjcsMy4wMDcyMjksMy4xMTEzMzJdLFstMC4zOTY2OTYsOC45NjM0MzIsLTAuNzA2MjAyXSxbMi40NDY3MDcsMi43NDA2MTcsMy4zMjE0MzNdLFstNC44MDMyMDksNS44ODQ2MzQsMi42MDM2NzJdLFstMi42NTIwMDMsMS42NTQxLDEuNTA3OF0sWzMuOTMyMzI3LDMuOTcyODc0LDAuODMxOTI0XSxbMi4xMzU5MDYsMC45NTU1ODcsMi45ODY2MDhdLFsyLjQ4NjEzMSwyLjA1MzgwMiwzLjEyNDExNV0sWy0wLjM4NjcwNiw4LjExNTc1MywtMC4zNzU2NV0sWy0yLjcyMDcyNyw3LjMyNTA0NCwyLjIyNDg3OF0sWy0xLjM5Njk0Niw3LjYzODAxNiwtMC4xNjQ4Nl0sWy0wLjYyMDgzLDcuOTg5NzcxLC0wLjE0NDQxM10sWy0yLjY1MzI3Miw1LjcyOTY4NCwyLjY2NzY3OV0sWzMuMDM4MTg4LDQuNjU4MzUsMi4zNjQxNDJdLFsyLjM4MTcyMSwwLjczOTQ3MiwyLjc4ODk5Ml0sWy0yLjM0NTgyOSw1LjQ3NDkyOSwyLjM4MDYzM10sWy0yLjUxODk4Myw2LjA4MDU2MiwyLjQ3OTM4M10sWy0yLjYxNTc5Myw2LjgzOTYyMiwyLjE4NjExNl0sWy0yLjI4NjU2NiwwLjE0Mzc1MiwyLjc2Njg0OF0sWy00Ljc3MTIxOSw2LjUwODc2NiwxLjA3MDc5N10sWzMuNzE3MzA4LDIuOTA1MDE5LDIuMDk3OTk0XSxbMi41MDUyMSwzLjAxNjc0MywzLjI5NTg5OF0sWzIuMjA4NDQ4LDEuNTYwMjksMy4yMTY4MDZdLFszLjM0Njc4MywxLjAxMjU0LDIuMTE5OTUxXSxbMi42NTM1MDMsMy4yNjEyMiwzLjE3NTczOF0sWy0yLjM1OTYzNiw1LjgyNzUxOSwyLjQwMjI5N10sWy0xLjk1MjY5MywwLjU1ODEwMiwyLjg1MzMwN10sWy0wLjMyMTU2Miw5LjQxNDg4NSwtMS4xODc1MDFdLFszLjEzODkyMywxLjQwNTA3MiwyLjUyMDc2NV0sWzEuNDkzNzI4LDEuNzgwMDUxLDMuNjIxOTY5XSxbMy4wMTgxNywwLjkwNzI5MSwyLjMzNjkwOV0sWzMuMTgzNTQ4LDEuMTg1Mjk3LDIuMzUyMTc1XSxbMS42MDg2MTksNS4wMDY3NTMsMi42OTUxMzFdLFstNC43MjM5MTksNi44MzYxMDcsMS4wOTUyODhdLFstMS4wMTc1ODYsOC44NjU0MjksLTAuMTQ5MzI4XSxbNC43MzA3NjIsMS4yMTQwMTQsMC42NDAwOF0sWy0yLjEzNTE4Miw2LjY0NzkwNywxLjQ5NTQ3MV0sWy0yLjQyMDM4Miw2LjU0NjExNCwyLjEwODIwOV0sWy0yLjQ1ODA1Myw3LjE4NjM0NiwxLjg5NjYyM10sWzMuNDM3MTI0LDAuMjc1Nzk4LDEuMTM4MjAzXSxbMC4wOTU5MjUsOC43MjU4MzIsLTAuOTI2NDgxXSxbMi40MTczNzYsMi40Mjk4NjksMy4yODc2NTldLFsyLjI3OTk1MSwxLjIwMDMxNywzLjA0OTk5NF0sWzIuNjc0NzUzLDIuMzI2OTI2LDMuMDQ0MDU5XSxbLTIuMzI4MTIzLDYuODQ5MTY0LDEuNzU3NTFdLFstMy40MTg2MTYsNy44NTM0MDcsMC4xMjYyNDhdLFstMy4xNTE1ODcsNy43NzU0MywtMC4xMTA4ODldLFsyLjM0OTE0NCw1LjY1MzI0MiwyLjA1ODY5XSxbLTIuMjczMjM2LDYuMDg1NjMxLDIuMjQyODg4XSxbLTQuNTYwNjAxLDQuNTI1MzQyLDEuMjYxMjQxXSxbMi44NjYzMzQsMy43OTYwNjcsMi45MzQ3MTddLFstMi4xNzQ5Myw2LjUwNTUxOCwxLjc5MTM2N10sWzMuMTIwNTksMy4yODMxNTcsMi44MTg4NjldLFszLjAzNzcwMywzLjU2MjM1NiwyLjg2NjY1M10sWzAuMDY2MjMzLDkuNDg4NDE4LC0xLjI0ODIzN10sWzIuNzQ5OTQxLDAuOTc1MDE4LDIuNTczMzcxXSxbLTIuMTU1NzQ5LDUuODAxMDMzLDIuMjA0MDA5XSxbLTIuMTYyNzc4LDYuMjYxODg5LDIuMDI4NTk2XSxbMS45MzY4NzQsMC40NTkxNDIsMi45NTY3MThdLFszLjE3NjI0OSw0LjMzNTU0MSwyLjQ0MDQ0N10sWzQuMzU2NTk5LDEuMDI5NDIzLDEuNzAwNTg5XSxbMy44NzM1MDIsMy4wODI2NzgsMS44MDQzMV0sWzIuODk1NDg5LDQuMjQzMDM0LDIuNzM1MjU5XSxbLTAuMDk1Nzc0LDkuNDY4MTk1LC0xLjA3NDUxXSxbLTEuMTI0OTgyLDcuODg2ODA4LC0wLjQ4MDg1MV0sWzMuMDMyMzA0LDMuMDY1NDU0LDIuODk3OTI3XSxbMy42OTI2ODcsNC41OTYxLDAuOTU3ODU4XSxbLTMuMDEzMDQ1LDMuODA3MjM1LC0xLjA5ODM4MV0sWy0wLjc5MDAxMiw4LjkyOTEyLC0wLjM2NzU3Ml0sWzEuOTA1NzkzLDAuNzMxNzksMi45OTY3MjhdLFszLjUzMDM5NiwzLjQyNjIzMywyLjM1NjU4M10sWzIuMTIyOTksMC42MjQ5MzMsMi45MjkxNjddLFstMi4wNjkxOTYsNi4wMzkyODQsMi4wMTI1MV0sWy0zLjU2NTYyMyw3LjE4MjUyNSwyLjg1MDAzOV0sWzIuOTU5MjY0LDIuMzc2MzM3LDIuODI5MjQyXSxbMi45NDkwNzEsMS44MjI0ODMsMi43OTM5MzNdLFs0LjAzNjE0MiwwLjc2MzgwMywxLjcwMzc0NF0sWy0xLjk5MzUyNyw2LjE4MDMxOCwxLjgwNDkzNl0sWy0wLjAzMDk4NywwLjc2NjM4OSwzLjM0NDc2Nl0sWy0wLjU0OTY4Myw4LjIyNTE5MywtMC4xODkzNDFdLFstMC43NjU0NjksOC4yNzIyNDYsLTAuMTI3MTc0XSxbLTIuOTQ3MDQ3LDcuNTQxNjQ4LC0wLjQxNDExM10sWy0zLjA1MDMyNyw5LjEwMTE0LC0zLjQzNTYxOV0sWzMuNDg4NTY2LDIuMjMxODA3LDIuMzk5ODM2XSxbMy4zNTIyODMsNC43Mjc4NTEsMS45NDY0MzhdLFs0Ljc0MTAxMSwyLjE2Mjc3MywxLjQ5OTU3NF0sWy0xLjgxNTA5Myw2LjA3MjA3OSwxLjU4MDcyMl0sWy0zLjcyMDk2OSw4LjI2NzkyNywtMC45ODQ3MTNdLFsxLjkzMjgyNiwzLjcxNDA1MiwzLjQyNzQ4OF0sWzMuMzIzNjE3LDQuNDM4OTYxLDIuMjA3MzJdLFswLjI1NDExMSw5LjI2MzY0LC0xLjM3MzI0NF0sWy0xLjQ5MzM4NCw3Ljg2ODU4NSwtMC40NTAwNTFdLFstMC44NDE5MDEsMC43NzYxMzUsLTEuNjE5NDY3XSxbMC4yNDM1MzcsNi4wMjc2NjgsMC4wOTE2ODddLFswLjMwMzA1NywwLjMxMzAyMiwtMC41MzExMDVdLFstMC40MzUyNzMsMC40NzQwOTgsMy40ODE1NTJdLFsyLjEyMTUwNywyLjYyMjM4OSwzLjQ4NjI5M10sWzEuOTYxOTQsMS4xMDE3NTMsMy4xNTk1ODRdLFszLjkzNzk5MSwzLjQwNzU1MSwxLjU1MTM5Ml0sWzAuMDcwOTA2LDAuMjk1NzUzLDEuMzc3MTg1XSxbLTEuOTM1ODgsNy42MzE3NjQsMC42NTE2NzRdLFstMi41MjM1MzEsMC43NDQ4MTgsLTAuMzA5ODVdLFsyLjg5MTQ5NiwzLjMxOTg3NSwyLjk4MzA3OV0sWzQuNzgxNzY1LDEuNTQ3MDYxLDEuNTIzMTI5XSxbLTIuMjU2MDY0LDcuNTcxMjUxLDAuOTczNzE2XSxbMy4yNDQ4NjEsMy4wNTgyNDksMi43MjQzOTJdLFstMC4xNDU4NTUsMC40Mzc3NzUsMy40MzM2NjJdLFsxLjU4NjI5Niw1LjY1ODUzOCwyLjM1ODQ4N10sWzMuNjU4MzM2LDMuNzc0OTIxLDIuMDcxODM3XSxbMi44NDA0NjMsNC44MTcwOTgsMi40NjM3Nl0sWy0xLjIxOTQ2NCw4LjEyMjU0MiwtMC42NzI4MDhdLFstMi41MjA5MDYsMi42NjQ0ODYsLTEuMDM0MzQ2XSxbLTEuMzE1NDE3LDguNDcxMzY1LC0wLjcwOTU1N10sWzMuNDI5MTY1LDMuNzQ2ODYsMi40NDYxNjldLFszLjA3NDU3OSwzLjg0MDc1OCwyLjc2NzQwOV0sWzMuNTY5NDQzLDMuMTY2MzM3LDIuMzMzNjQ3XSxbMi4yOTQzMzcsMy4yODAwNTEsMy4zNTkzNDZdLFsyLjIxODE2LDMuNjY1NzgsMy4yNjkyMjJdLFsyLjE1ODY2Miw0LjE1MTQ0NCwtMS4zNTc5MTldLFsxLjEzODYyLDQuMzgwOTg2LC0xLjQwNDU2NV0sWzMuMzg4MzgyLDIuNzQ5OTMxLC0wLjg0MDk0OV0sWzMuMDU5ODkyLDUuMDg0ODQ4LDIuMDI2MDY2XSxbMy4yMDQ3MzksMi4wNzUxNDUsMi42NDA3MDZdLFszLjM4NzA2NSwxLjQyNjE3LDIuMzA1Mjc1XSxbMy45MTAzOTgsMi42NzA3NDIsMS43NTAxNzldLFszLjQ3MTUxMiwxLjk0NTgyMSwyLjM5NTg4MV0sWzQuMDgwODIsMS4wNzA2NTQsMS45NjAxNzFdLFstMS4wNTc4NjEsMC4xMzMwMzYsMi4xNDY3MDddLFstMC4xNTE3NDksNS41MzU1MSwtMC42MjQzMjNdLFszLjIzMzA5OSw0LjAwMzc3OCwyLjU3MTE3Ml0sWzIuNjExNzI2LDUuMzE5MTk5LC0wLjQ5OTM4OF0sWzIuNjgyOTA5LDEuMDk0NDk5LC0xLjIwNjI0N10sWy0xLjIyODIzLDcuNjU2ODg3LDAuMDQxNDA5XSxbLTIuMjkzMjQ3LDcuMjU5MTg5LDAuMDEzODQ0XSxbMC4wODEzMTUsMC4yMDIxNzQsMy4yODYzODFdLFstMS4wMDIwMzgsNS43OTQ0NTQsLTAuMTg3MTk0XSxbMy40NDg4NTYsNC4wODA5MSwyLjI1ODMyNV0sWzAuMjg3ODgzLDkuMDA2ODg4LC0xLjU1MDY0MV0sWy0zLjg1MTAxOSw0LjA1OTgzOSwtMC42NDY5MjJdLFszLjYxMDk2Niw0LjIwNTQzOCwxLjkxMzEyOV0sWzIuMjM5MDQyLDIuOTUwODcyLDMuNDQ5OTU5XSxbMC4yMTYzMDUsMC40NDI4NDMsMy4zMjgwNTJdLFsxLjg3MTQxLDIuNDcwNzQ1LDMuNTc0NTU5XSxbMy44MTEzNzgsMi43Njg3MTgsLTAuMjI4MzY0XSxbMi41MTEwODEsMS4zNjI3MjQsMi45NjkzNDldLFstMS41OTgxMyw3Ljg2NjUwNiwwLjQ0MDE4NF0sWy0zLjMwNzk3NSwyLjg1MTA3MiwtMC44OTQ5NzhdLFstMC4xMDcwMTEsOC45MDU3MywtMC44ODQzOTldLFstMy44NTUzMTUsMi44NDI1OTcsLTAuNDM0NTQxXSxbMi41MTc4NTMsMS4wOTA3NjgsMi43OTk2ODddLFszLjc5MTcwOSwyLjM2Njg1LDIuMDAyNzAzXSxbNC4wNjI5NCwyLjc3MzkyMiwwLjQ1MjcyM10sWy0yLjk3MzI4OSw3LjYxNzAzLC0wLjYyMzY1M10sWy0yLjk1NTA5LDguOTI0NDYyLC0zLjQ0NjMxOV0sWzIuODYxNDAyLDAuNTYyNTkyLDIuMTg0Mzk3XSxbLTEuMTA5NzI1LDguNTk0MjA2LC0wLjA3NjgxMl0sWy0wLjcyNTcyMiw3LjkyNDQ4NSwtMC4zODExMzNdLFstMS40ODU1ODcsMS4zMjk5OTQsLTAuNjU0NDA1XSxbLTQuMzQyMTEzLDMuMjMzNzM1LDEuNzUyOTIyXSxbLTIuOTY4MDQ5LDcuOTU1NTE5LC0yLjA5NDA1XSxbLTMuMTMwOTQ4LDAuNDQ2MTk2LDAuODUyODddLFstNC45NTg0NzUsNS43NTczMjksMS40NDcwNTVdLFstMy4wODY1NDcsNy42MTUxOTMsLTEuOTUzMTY4XSxbLTMuNzUxOTIzLDUuNDEyODIxLDMuMzczMzczXSxbLTQuNTk5NjQ1LDcuNDgwOTUzLDEuNjc3MTM0XSxbMS4xMzM5OTIsMC4yNzQ4NzEsMC4wMzIyNDldLFstMi45NTY1MTIsOC4xMjY5MDUsLTEuNzg1NDYxXSxbLTAuOTYwNjQ1LDQuNzMwNjUsLTEuMTkxNzg2XSxbLTIuODcxMDY0LDAuODc1NTU5LDAuNDI0ODgxXSxbLTQuOTMyMTE0LDUuOTk2MTQsMS40ODM4NDVdLFstMi45ODE3NjEsOC4xMjQ2MTIsLTEuMzg3Mjc2XSxbMC4zNjIyOTgsOC45Nzg1NDUsLTEuMzY4MDI0XSxbLTQuNDA4Mzc1LDMuMDQ2MjcxLDAuNjAyMzczXSxbMi44NjU4NDEsMi4zMjIyNjMsLTEuMzQ0NjI1XSxbLTQuNzg0OCw1LjYyMDg5NSwwLjU5NDQzMl0sWy0yLjg4MzIyLDAuMzM4OTMxLDEuNjcyMzFdLFstNC42ODgxMDEsNi43NzI5MzEsMS44NzIzMThdLFstNC45MDM5NDgsNi4xNjQ2OTgsMS4yNzEzNV0sWzIuODU2NjMsMS4wMDU2NDcsLTAuOTA2ODQzXSxbMi42OTEyODYsMC4yMDk4MTEsMC4wNTA1MTJdLFstNC42OTM2MzYsNi40Nzc1NTYsMC42NjU3OTZdLFstNC40NzIzMzEsNi44NjEwNjcsMC40NzczMThdLFswLjg4MzA2NSwwLjIwNDkwNywzLjA3MzkzM10sWy0wLjk5NTg2Nyw4LjA0ODcyOSwtMC42NTM4OTddLFstMC43OTQ2NjMsNS42NzAzOTcsLTAuMzkwMTE5XSxbMy4zMTMxNTMsMS42MzgwMDYsLTAuNzIyMjg5XSxbLTQuODU2NDU5LDUuMzk0NzU4LDEuMDMyNTkxXSxbLTMuMDA1NDQ4LDcuNzgzMDIzLC0wLjgxOTY0MV0sWzMuMTE4OTEsMi4wMzY5NzQsLTEuMDg2ODldLFstMi4zNjQzMTksMi40MDg0MTksMi42MzQxOV0sWy0yLjkyNzEzMiw4Ljc1NDM1LC0zLjUzNzE1OV0sWy0zLjI5NjIyMiw3Ljk2NDYyOSwtMy4xMzQ2MjVdLFstMS42NDIwNDEsNC4xMzQxNywtMS4zMDE2NjVdLFsyLjAzMDc1OSwwLjE3NjM3MiwtMS4wMzA5MjNdLFstNC41NTkwNjksMy43NTEwNTMsMC41NDg0NTNdLFszLjQzODM4NSw0LjU5NDU0LC0wLjI0MzIxNV0sWy0yLjU2MTc2OSw3LjkzOTM1LDAuMTc3Njk2XSxbMi45OTA1OTMsMS4zMzUzMTQsLTAuOTQzMTc3XSxbMS4yODA4LDAuMjc2Mzk2LC0wLjQ5MDcyXSxbLTAuMzE4ODg5LDAuMjkwNjg0LDAuMjExMTQzXSxbMy41NDYxNCwzLjM0MjYzNSwtMC43Njc4NzhdLFstMy4wNzMzNzIsNy43ODAwMTgsLTIuMzU3ODA3XSxbLTQuNDU1Mzg4LDQuMzg3MjQ1LDAuMzYxMDM4XSxbLTQuNjU5MzkzLDYuMjc2MDY0LDIuNzY3MDE0XSxbMC42MzY3OTksNC40ODIyMjMsLTEuNDI2Mjg0XSxbLTIuOTg3NjgxLDguMDcyOTY5LC0yLjQ1MjQ1XSxbLTIuNjEwNDQ1LDAuNzYzNTU0LDEuNzkyMDU0XSxbMy4zNTgyNDEsMi4wMDY3MDcsLTAuODAyOTczXSxbLTAuNDk4MzQ3LDAuMjUxNTk0LDAuOTYyODg1XSxbMy4xMzIyLDAuNjgzMzEyLDIuMDM4Nzc3XSxbLTQuMzg5ODAxLDcuNDkzNzc2LDAuNjkwMjQ3XSxbMC40MzE0NjcsNC4yMjExOSwtMS42MTQyMTVdLFstNC4zNzYxODEsMy4yMTMxNDEsMC4yNzMyNTVdLFstNC44NzIzMTksNS43MTU2NDUsMC44Mjk3MTRdLFstNC44MjY4OTMsNi4xOTUzMzQsMC44NDk5MTJdLFszLjUxNjU2MiwyLjIzNzMyLC0wLjY3NzU5N10sWzMuMTMxNjU2LDEuNjk4ODQxLC0wLjk3NTc2MV0sWy00Ljc1NDkyNSw1LjQxMTY2NiwxLjk4OTMwM10sWy0yLjk4NzI5OSw3LjMyMDc2NSwtMC42Mjk0NzldLFstMy43NTc2MzUsMy4yNzQ4NjIsLTAuNzQ0MDIyXSxbMy40ODcwNDQsMi41NDE5OTksLTAuNjk5OTMzXSxbLTQuNTMyNzQsNC42NDk1MDUsMC43NzA5M10sWy0xLjQyNDE5MiwwLjA5OTQyMywyLjYzMzMyN10sWzMuMDkwODY3LDIuNDc2OTc1LC0xLjE0Njk1N10sWy0yLjcxMzI1NiwwLjgxNTYyMiwyLjE3MzExXSxbMy4zNDgxMjEsMy4yNTQxNjcsLTAuOTg0ODk2XSxbLTMuMDMxMzc5LDAuMTY0NTMsLTAuMzA5OTM3XSxbLTAuOTQ5NzU3LDQuNTE4MTM3LC0xLjMwOTE3Ml0sWy0wLjg4OTUwOSwwLjA5NTI1NiwxLjI4ODgwM10sWzMuNTM5NTk0LDEuOTY2MTA1LC0wLjU1Mzk2NV0sWy00LjYwNjEyLDcuMTI3NzQ5LDAuODExOTU4XSxbLTIuMzMyOTUzLDEuNDQ0NzEzLDEuNjI0NTQ4XSxbMy4xMzYyOTMsMi45NTgwNSwtMS4xMzgyNzJdLFszLjU0MDgwOCwzLjA2OTA1OCwtMC43MzUyODVdLFszLjY3ODg1MiwyLjM2MjM3NSwtMC40NTI1NDNdLFstNC42NDg4OTgsNy4zNzQzOCwwLjk1NDc5MV0sWy0wLjY0Njg3MSwwLjE5MDM3LDMuMzQ0NzQ2XSxbMi4yODI1LDAuMjkzNDMsLTAuODI2MjczXSxbLTQuNDIyMjkxLDcuMTgzOTU5LDAuNTU3NTE3XSxbLTQuNjk0NjY4LDUuMjQ2MTAzLDIuNTQxNzY4XSxbLTQuNTgzNjkxLDQuMTQ1NDg2LDAuNjAwMjA3XSxbLTIuOTM0ODU0LDcuOTEyNTEzLC0xLjUzOTI2OV0sWy0zLjA2Nzg2MSw3LjgxNzQ3MiwtMC41NDY1MDFdLFszLjgyNTA5NSwzLjIyOTUxMiwtMC4yMzc1NDddLFsyLjUzMjQ5NCwwLjMyMzA1OSwyLjM4NzEwNV0sWy0yLjUxNDU4MywwLjY5Mjg1NywxLjIzNTk3XSxbLTQuNzM2ODA1LDcuMjE0Mzg0LDEuMjU5NDIxXSxbLTIuOTgwNzEsOC40MDk5MDMsLTIuNDY4MTk5XSxbMi42MjE0NjgsMS4zODU4NDQsLTEuNDA2MzU1XSxbMy44MTE0NDcsMy41NjA4NTUsMS44NDc4MjhdLFszLjQzMjkyNSwxLjQ5NzIwNSwtMC40ODk3ODRdLFszLjc0NjYwOSwzLjYzMTUzOCwtMC4zOTA2N10sWzMuNTk0OTA5LDIuODMyMjU3LC0wLjU3NjAxMl0sWy0wLjQwNDE5Miw1LjMwMDE4OCwtMC44NTY1NjFdLFstNC43NjI5OTYsNi40ODM3NzQsMS43MDI2NDhdLFstNC43NTY2MTIsNi43ODYyMjMsMS40MzY4Ml0sWy0yLjk2NTMwOSw4LjQzNzIxNywtMi43ODU0OTVdLFsyLjg2Mzg2NywwLjc0MDg3LC0wLjQyOTY4NF0sWzQuMDI1MDMsMi45Njg3NTMsMS4zOTI0MTldLFszLjY2OTAzNiwxLjgzMzg1OCwtMC4zMDQ5NzFdLFstMi44ODg4NjQsMC43MjA1MzcsMC43NzgwNTddLFstMi4zNjk4MiwwLjk3OTQ0MywxLjA1NDQ0N10sWy0yLjk1OTI1OSw4LjIyMjMwMywtMi42NTk3MjRdLFstMy40Njc4MjUsNy41NDU3MzksLTIuMzMzNDQ1XSxbMi4xNTM0MjYsMC40NDYyNTYsLTEuMjA1MjNdLFstMy4yMjk4MDcsOS4xODk2OTksLTMuNTk2NjA5XSxbLTMuNzI0ODYsOC43NzM3MDcsLTIuMDQ2NjcxXSxbMy42ODcyMTgsMy4yOTc3NTEsLTAuNTIzNzQ2XSxbMS4zODEwMjUsMC4wODgxNSwtMS4xODU2NjhdLFstMi43OTY4MjgsNy4yMDU2MjIsLTAuMjA4NzgzXSxbMy42NDcxOTQsNC4wNjYyMzIsLTAuMjkxNTA3XSxbLTQuNTc4Mzc2LDMuODg1NTU2LDEuNTI1NDZdLFstMi44NDAyNjIsMC42MzA5NCwxLjg5NDk5XSxbLTIuNDI5NTE0LDAuOTIyMTE4LDEuODIwNzgxXSxbLTQuNjc1MDc5LDYuNTczOTI1LDIuNDIzMzYzXSxbMi44MDYyMDcsNC4zMjAxODgsLTEuMDI3MzcyXSxbLTEuMjg5NjA4LDAuMDk3MjQxLDEuMzIxNjYxXSxbLTMuMDEwNzMxLDguMTQxMzM0LC0yLjg2NjE0OF0sWzMuMjAyMjkxLDEuMjM1NjE3LC0wLjU0OTAyNV0sWzQuMDk0NzkyLDIuNDc3NTE5LDAuMzA0NTgxXSxbMi45NDg0MDMsMC45NjY4NzMsLTAuNjY0ODU3XSxbLTQuODMyOTcsNS45MjA1ODcsMi4wOTU0NjFdLFstMi4xNjk2OTMsNy4yNTcyNzcsMC45NDYxODRdLFstMS4zMzU4MDcsMy4wNTc1OTcsLTEuMzAzMTY2XSxbLTEuMDM3ODc3LDAuNjQxNTEsLTEuNjg1MjcxXSxbMi42Mjc5MTksMC4wODk4MTQsMC40MzkwNzRdLFszLjgxNTc5NCwzLjgwODEwMiwxLjczMDQ5M10sWy0yLjk3MzQ1NSw4LjQzMzE0MSwtMy4wODg3Ml0sWy0yLjM5MTU1OCw3LjMzMTQyOCwxLjY1ODI2NF0sWy00LjMzMzEwNyw0LjUyOTk3OCwxLjg1MDUxNl0sWy00LjY0MDI5MywzLjc2NzEwNywxLjE2ODg0MV0sWzMuNjAwNzE2LDQuNDY5MzEsMS43MzQwMjRdLFszLjg4MDgwMywxLjczMDE1OCwtMC4xNzI3MzZdLFszLjgxNDE4Myw0LjI2MjM3MiwxLjE2NzA0Ml0sWzQuMzczMjUsMC44Mjk1NDIsMS40MTM3MjldLFsyLjQ5MDQ0Nyw1Ljc1MTExLDAuMDExNDkyXSxbMy40NjAwMDMsNC45NjI0MzYsMS4xODg5NzFdLFszLjkxODQxOSwzLjgxNDIzNCwxLjM1ODI3MV0sWy0wLjgwNzU5NSw4Ljg0MDUwNCwtMC45NTM3MTFdLFszLjc1Mjg1NSw0LjIwNTc3LDEuNTcxNzddLFstMi45OTEwODUsOC44MTY1MDEsLTMuMjQ0NTk1XSxbLTIuMzMzMTk2LDcuMTI4ODg5LDEuNTUxOTg1XSxbMy45Nzc3MTgsMy41NzA5NDEsMS4yNTkzN10sWzQuMzYwMDcxLDAuNzU1NTc5LDEuMDc5OTE2XSxbNC42Mzc1NzksMS4wMjc5NzMsMS4wMzI1NjddLFstMi4zMTcsNy40MjEwNjYsMS4zMjk1ODldLFstMS4wMTM0MDQsOC4yOTM2NjIsLTAuNzgyM10sWzQuNTQ4MDIzLDEuMDIwNjQ0LDEuNDIwNDYyXSxbNC43NjMyNTgsMS4yNjY3OTgsMS4yOTYyMDNdLFs0Ljg5NiwyLjA3MzA4NCwxLjI1NTIxM10sWzQuMDE1MDA1LDMuMzI1MjI2LDEuMDkzODc5XSxbNC45NDg4NSwxLjg2MDkzNiwwLjg5NDQ2M10sWy0yLjE4OTY0NSw2Ljk1NDYzNCwxLjI3MDA3N10sWzQuODg3NDQyLDEuNzIwOTkyLDEuMjg4NTI2XSxbLTMuMTg0MDY4LDcuODcxODAyLDAuOTU2MTg5XSxbLTEuMjc0MzE4LDAuODM5ODg3LC0xLjIyNDM4OV0sWy0yLjkxOTUyMSw3Ljg0NDMyLDAuNTQxNjI5XSxbLTIuOTk0NTg2LDcuNzY2MTAyLDEuOTY4NjddLFstMy40MTc1MDQsOS4yNDE3MTQsLTMuMDkzMjAxXSxbLTMuMTc0NTYzLDcuNDY2NDU2LDIuNDczNjE3XSxbLTMuMjYzMDY3LDkuMDY5NDEyLC0zLjAwMzQ1OV0sWy0yLjg0MTU5MiwwLjUyOTgzMywyLjY5MzQzNF0sWy0zLjYxMTA2OSw5LjE1ODgwNCwtMi44Mjk4NzFdLFstNC42NDI4MjgsNS45Mjc1MjYsMC4zMjA1NDldLFstMy44MDkzMDgsOS4wNTEwMzUsLTIuNjkyNzQ5XSxbLTIuODM3NTgyLDcuNDg3OTg3LC0wLjEwNjIwNl0sWzQuNzczMDI1LDIuMzMwNDQyLDEuMjEzODk5XSxbNC44OTc0MzUsMi4yMDk5MDYsMC45NjY2NTddLFstMy4wNjc2MzcsOC4xNjQwNjIsLTEuMTI2NjFdLFstMy4xMjIxMjksOC4wODA3NCwtMC44OTkxOTRdLFs0LjU3MTAxOSwyLjM1ODExMywxLjQ2MjA1NF0sWzQuNTg0ODg0LDIuNDU0NDE4LDAuNzA5NDY2XSxbLTMuNjYxMDkzLDcuMTQ2NTgxLC0wLjQ3NTk0OF0sWzQuNzM1MTMxLDIuNDE1ODU5LDAuOTMzOTM5XSxbNC4yMDc1NTYsMi41NDAwMTgsMS4yMTgyOTNdLFstMy42MDc1OTUsNy44OTE2MSwtMC4xMjExNzJdLFstMS41Mjc5NTIsMC43NzU1NjQsLTEuMDYxOTAzXSxbNC41Mzg3NCwyLjUwMzI3MywxLjA5OTU4M10sWy0zLjkzODgzNyw3LjU4Nzk4OCwwLjA4MjQ0OV0sWy00Ljg1MzU4Miw2LjE1MjQwOSwxLjc4Nzk0M10sWy00Ljc1MjIxNCw2LjI0NzIzNCwyLjI5Njg3M10sWzQuNjAyOTM1LDIuMzYzOTU1LDAuNDg4OTAxXSxbLTEuODE2MzgsNi4zNjU4NzksMC44NjgyNzJdLFswLjU5NTQ2Nyw0Ljc0NDA3NCwtMS4zMjQ4M10sWzEuODc2MzUsMy41MTE5ODYsLTEuODQyOTI0XSxbNC4zMzA5NDcsMi41MzQzMjYsMC43MjA1MDNdLFs0LjEwODczNiwyLjc1MDgwNSwwLjkwNDU1Ml0sWy0xLjg5MDkzOSw4LjQ5MjYyOCwtMC4yOTA3NjhdLFstMy41MDQzMDksNi4xNzMwNTgsLTAuNDIyODA0XSxbLTEuNjExOTkyLDYuMTk2NzMyLDAuNjQ4NzM2XSxbLTMuODk5MTQ5LDcuODI2MTIzLDEuMDg4ODQ1XSxbLTMuMDc4MzAzLDMuMDA4ODEzLC0xLjAzNTc4NF0sWy0yLjc5ODk5OSw3Ljg0NDg5OSwxLjM0MDA2MV0sWy0xLjI0ODgzOSw1Ljk1OTEwNSwwLjA0MTc2MV0sWzAuNzY3Nzc5LDQuMzM3MzE4LDMuMDkwODE3XSxbLTMuODMxMTc3LDcuNTE1NjA1LDIuNDMyMjYxXSxbLTEuNjY3NTI4LDYuMTU2MjA4LDAuMzY1MjY3XSxbLTEuNzI2MDc4LDYuMjM3Mzg0LDEuMTAwMDU5XSxbLTMuOTcyMDM3LDQuNTIwODMyLC0wLjM3MDc1Nl0sWy00LjQwNDQ5LDcuNjM2MzU3LDEuNTIwNDI1XSxbLTEuMzQ1MDYsNi4wMDQwNTQsMS4yOTMxNTldLFstMS4yMzM1NTYsNi4wNDk5MzMsMC41MDA2NTFdLFstMy42OTY4NjksNy43OTczMiwwLjM3OTc5XSxbLTMuMzA3Nzk4LDguOTQ5OTY0LC0yLjY5ODExM10sWy0xLjk5NzI5NSw2LjYxNTA1NiwxLjEwMzY5MV0sWy0zLjIxOTIyMiw4LjMzNjM5NCwtMS4xNTA2MTRdLFstMy40NTI2MjMsOC4zMTg2NiwtMC45NDE3XSxbLTMuOTQ2NDEsMi45OTA0OTQsMi4yMTI1OTJdLFstMy4yNTAwMjUsOC4wMzA0MTQsLTAuNTk2MDk3XSxbLTIuMDIzNzUsMS41NzEzMzMsMi4zOTc5MzldLFstMy4xOTAzNTgsNy42NjUwMTMsMi4yNjgxODNdLFstMi44MTE5MTgsNy42MTg1MjYsMi4xNDU1ODddLFstMS4wMDUyNjUsNS44OTIzMDMsMC4wNzIxNThdLFstMC45MzcyMSw1Ljk3NDE0OCwwLjkwNjY2OV0sWy00LjY0NjA3Miw3LjQ5MjE5MywxLjQ1MzEyXSxbLTAuMjUyOTMxLDEuNzk3NjU0LDMuMTQwNjM4XSxbLTEuMDc2MDY0LDUuNzM4NDMzLDEuNjk1OTUzXSxbLTMuOTgwNTM0LDcuNzQ0MzkxLDEuNzM1NzkxXSxbLTAuNzIxMTg3LDUuOTM5Mzk2LDAuNTI2MDMyXSxbLTAuNDI4MTgsNS45MTk3NTUsMC4yMjkwMDFdLFstMS40MzQyOSw2LjExNjIyLDAuOTM4NjNdLFstMC45ODU2MzgsNS45Mzk2ODMsMC4yOTA2MzZdLFstNC40MzM4MzYsNy40NjEzNzIsMS45NjY0MzddLFstMy42OTYzOTgsNy44NDQ4NTksMS41NDczMjVdLFstMy4zOTA3NzIsNy44MjAxODYsMS44MTIyMDRdLFstMi45MTY3ODcsNy44NjQwMTksMC44MDQzNDFdLFstMy43MTU5NTIsOC4wMzcyNjksLTAuNTkxMzQxXSxbLTQuMjA0NjM0LDcuNzI5MTksMS4xMTk4NjZdLFstNC41OTIyMzMsNS41OTI4ODMsMC4yNDYyNjRdLFszLjMwNzI5OSw1LjA2MTcwMSwxLjYyMjkxN10sWy0zLjUxNTE1OSw3LjYwMTQ2NywyLjM2ODkxNF0sWy0zLjQzNTc0Miw4LjUzMzQ1NywtMS4zNzkxNl0sWy0wLjI2OTQyMSw0LjU0NTYzNSwtMS4zNjY0NDVdLFstMi41NDIxMjQsMy43Njg3MzYsLTEuMjU4NTEyXSxbLTMuMDM0MDAzLDcuODczNzczLDEuMjU2ODU0XSxbLTIuODAxMzk5LDcuODU2MDI4LDEuMDgwMTM3XSxbMy4yOTM1NCw1LjIyMDg5NCwxLjA4MTc2N10sWy0yLjM1MTA5LDEuMjk5NDg2LDEuMDEyMDZdLFstMy4yMzIyMTMsNy43NjgxMzYsMi4wNDc1NjNdLFszLjI5MDQxNSw1LjIxNzUyNSwwLjY4MDE5XSxbLTMuNDE1MTA5LDcuNzMxMDM0LDIuMTQ0MzI2XSxbMy40NDAzNTcsNC45NjI0NjMsMC4zNzMzODddLFszLjE0NzM0Niw1LjM1MjEyMSwxLjM4NjkyM10sWzIuODQ3MjUyLDUuNDY5MDUxLDEuODMxOTgxXSxbMy4xMzc2ODIsNS40MTAyMjIsMS4wNTAxODhdLFszLjEwMjY5NCw1LjMxMDQ1NiwxLjY3NjQzNF0sWy0zLjA0NDYwMSwwLjM5NTE1LDEuOTk0MDg0XSxbMi45MDM2NDcsNS41NjEzMzgsMS41MTg1OThdLFstMy44MTAxNDgsOC4wOTM1OTgsLTAuODg5MTMxXSxbNC4yMzQ4MzUsMC44MDMwNTQsMS41OTMyNzFdLFszLjI0MDE2NSw1LjIyODc0NywwLjMyNTk1NV0sWzMuMDM3NDUyLDUuNTA5ODI1LDAuODE3MTM3XSxbMi42MzUwMzEsNS43OTUxODcsMS40Mzk3MjRdLFszLjA3MTYwNyw1LjMxODMwMywwLjA4MDE0Ml0sWzIuOTA5MTY3LDUuNjExNzUxLDEuMTU1ODc0XSxbMy4wNDQ4ODksNS40NjU5MjgsMC40ODY1NjZdLFsyLjUwMjI1Niw1Ljc3MDY3MywxLjc0MDA1NF0sWy0wLjA2NzQ5NywwLjA4NjQxNiwtMS4xOTAyMzldLFsyLjMzMzI2LDUuOTA2MDUxLDAuMTM4Mjk1XSxbMC42NTA5Niw0LjIwNTQyMywzLjMwODc2N10sWy0yLjY3MTEzNyw3LjkzNjUzNSwwLjQzMjczMV0sWzIuMTQ0NjMsNS44NzkyMTQsMS44NjYwNDddLFstNC43NzY0NjksNS44OTA2ODksMC41NjE5ODZdLFsyLjcyNDMyLDUuNjU1MTQ1LDAuMjExOTUxXSxbMi43MzA0ODgsNS43NTE0NTUsMC42OTU4OTRdLFsyLjU3MjY4Miw1Ljg2OTI5NSwxLjE1MjY2M10sWzEuOTA2Nzc2LDUuNzM5MTIzLDIuMTk2NTUxXSxbMi4zNDQ0MTQsNS45OTk5NjEsMC43NzI5MjJdLFstMy4zNzc5MDUsNy40NDg3MDgsLTEuODYzMjUxXSxbMi4yODUxNDksNS45NjgxNTYsMS40NTkyNThdLFsyLjM4NTk4OSw1LjkyODk3NCwwLjM2ODldLFsyLjE5MjExMSw2LjA4NzUxNiwwLjk1OTkwMV0sWzIuMzYzNzIsNi4wMDExMDEsMS4wNzQzNDZdLFsxLjk3MjAyMiw2LjA3OTYwMywxLjU5MTE3NV0sWzEuODc2MTUsNS45NzY2OTgsMS45MTU1NF0sWy0zLjgyNDc2MSw5LjA1MzcyLC0yLjkyODYxNV0sWzIuMDQ0NzA0LDYuMTI5NzA0LDEuMjYzMTExXSxbLTIuNTgzMDQ2LDAuODQ5NTM3LDIuNDk3MzQ0XSxbLTAuMDc4ODI1LDIuMzQyMjA1LDMuNTIwMzIyXSxbLTAuNzA0Njg2LDAuNTM3MTY1LDMuMzk3MTk0XSxbLTAuMjU3NDQ5LDMuMjM1MzM0LDMuNjQ3NTQ1XSxbLTAuMzMyMDY0LDEuNDQ4Mjg0LDMuMDIyNTgzXSxbLTIuMjAwMTQ2LDAuODk4Mjg0LC0wLjQ0NzIxMl0sWy0yLjQ5NzUwOCwxLjc0NTQ0NiwxLjgyOTE2N10sWzAuMzA3MDIsNC40MTYzMTUsMi45Nzg5NTZdLFstMy4yMDUxOTcsMy40NzkzMDcsLTEuMDQwNTgyXSxbMC4xMTAwNjksOS4zNDc3MjUsLTEuNTYzNjg2XSxbLTAuODI3NTQsMC44ODM4ODYsMy4wNjU4MzhdLFstMi4wMTcxMDMsMS4yNDQ3ODUsMi40MjUxMl0sWy0wLjQyMTA5MSwyLjMwOTkyOSwzLjE1Mzg5OF0sWy0wLjQ5MTYwNCwzLjc5NjA3MiwzLjE2MjQ1XSxbMi43ODY5NTUsMy41MDEyNDEsLTEuMzQwMjE0XSxbLTMuMjI5MDU1LDQuMzgwNzEzLC0wLjg5OTI0MV0sWzMuNzMwNzY4LDAuNzY4NDUsMS45MDMxMl0sWy0wLjU2MTA3OSwyLjY1MjM4MiwzLjE1MjQ2M10sWy0zLjQ2MTQ3MSwzLjA4NjQ5NiwyLjY2MjUwNV0sWy0wLjY2MTQwNSwzLjQ0NjAwOSwzLjE3OTkzOV0sWy0wLjkxNTM1MSwwLjYzNjc1NSwzLjI0MzcwOF0sWy0yLjk5Mjk2NCw4LjkxNTYyOCwtMy43Mjk4MzNdLFstMC40Mzk2MjcsMy41MDIxMDQsMy40MjY2NV0sWy0xLjE1NDIxNywwLjg4MzE4MSwyLjgwMDgzNV0sWy0xLjczNjE5MywxLjQ2NTQ3NCwyLjU5NTQ4OV0sWy0wLjQyMzkyOCwzLjI0NDM1LDMuNTQ4Mjc3XSxbLTAuNTExMTUzLDIuODcxMDQ2LDMuMzc5NzQ5XSxbLTAuNjc1NzIyLDIuOTkxNzU2LDMuMTQzMjYyXSxbLTEuMDkyNjAyLDAuNTk5MTAzLDMuMDkwNjM5XSxbLTAuODk4MjEsMi44MzY5NTIsMi44NDAwMjNdLFstMi42NTg0MTIsMC43ODEzNzYsMC45NjA1NzVdLFstMi4yNzE0NTUsMS4yMjI4NTcsMS4zMzA0NzhdLFstMC44Nzc4NjEsMS4xMTEyMjIsMi43MjI2M10sWy0wLjMwNjk1OSwyLjg3Njk4NywzLjU1NjA0NF0sWy0zLjgzOTI3NCw3Ljg0MTM4LC0wLjkxODQwNF0sWy0wLjE3MjA5NCw0LjA4Mzc5OSwzLjE0MTcwOF0sWy0xLjU0ODMzMiwwLjI1MjksMi44NjQ2NTVdLFstMC4yMTczNTMsNC44NzM5MTEsLTEuMjIzMTA0XSxbLTMuMzg0MjQyLDMuMTgxMDU2LC0wLjk1NTc5XSxbLTIuNzMxNzA0LDAuMzgyNDIxLDIuODk1NTAyXSxbLTEuMjg1MDM3LDAuNTUxMjY3LDIuOTQ3Njc1XSxbMC4wNzcyMjQsNC4yNDY1NzksMy4wNjY3MzhdLFstMC40Nzk5NzksMS43Nzk1NSwyLjg2MDAxMV0sWy0wLjcxNjM3NSwxLjIyNDY5NCwyLjY2Njc1MV0sWy0wLjU0NjIyLDMuMTM4MjU1LDMuMzkzNDU3XSxbLTIuMzM0MTMsMS44MjEyMjIsMi4xMjQ4ODNdLFstMC41MDY1MywyLjAzNzE0NywyLjg5NzQ2NV0sWzIuNDUxMjkxLDEuMjExMzg5LC0xLjQ2NjU4OV0sWy0zLjE2MDA0NywyLjg5NDA4MSwyLjcyNDI4Nl0sWy00LjEzNzI1OCw1LjQzMzQzMSwzLjIxMjAxXSxbMC40NjI4OTYsMC4zMjA0NTYsLTAuMTc0ODM3XSxbLTAuMzc0NTgsMi42MDk0NDcsMy4zNzkyNTNdLFstMy4wOTUyNDQsMC4yNTYyMDUsMi4xOTY0NDZdLFstNC4xOTc5ODUsNS43MzI5OTEsMy4yNjI5MjRdLFstMC43Mjk3NDcsMC4yNDYwMzYsMC40OTcwMzZdLFstMi4zNTYxODksNS4wNjIsLTAuOTY1NjE5XSxbLTEuNjA5MDM2LDAuMjU5NjIsLTEuNDg3MzY3XSxbLTQuMDc0MzgxLDYuMDc0MDYxLDMuNDA5NDU5XSxbLTMuNjE5MzA0LDQuMDAyMiwyLjY1NzA1XSxbLTAuNTQzMzkzLDguNzQyODk2LC0xLjA1NjYyMl0sWy00LjMwMzU2LDYuODU4OTM0LDIuODc5NjQyXSxbLTAuNzE2Njg4LDIuOTAxODMxLC0yLjExMjAyXSxbMS41NDczNjIsMC4wODMxODksMS4xMzg3NjRdLFstMC4yNTA5MTYsMC4yNzUyNjgsMS4yMDEzNDRdLFstMy43NzgwMzUsMy4xMzYyNCwyLjQ2NjE3N10sWy00LjU5NDMxNiw1Ljc3MTM0MiwzLjAxNjk0XSxbLTMuNzE3NzA2LDMuNDQyODg3LDIuNjAzMzQ0XSxbLTQuMzExMTYzLDUuMjI0NjY5LDMuMDE5MzczXSxbLTAuNjEwMzg5LDIuMDk1MTYxLC0xLjkyMzUxNV0sWy0zLjA0MDA4Niw2LjE5NjkxOCwtMC40MjkxNDldLFstMy44MDI2OTUsMy43NjgyNDcsMi41NDU1MjNdLFstMC4xNTk1NDEsMi4wNDMzNjIsMy4zMjg1NDldLFstMy43NDQzMjksNC4zMTc4NSwyLjQ5MTg4OV0sWy0zLjA0NzkzOSwwLjIxNDE1NSwxLjg3MzYzOV0sWy00LjQxNjg1LDYuMTEzMDU4LDMuMTY2Nzc0XSxbLTEuMTY1MTMzLDAuNDYwNjkyLC0xLjc0MjEzNF0sWy0xLjM3MTI4OSw0LjI0OTk5NiwtMS4zMTc5MzVdLFstMy40NDc4ODMsMC4zNTIxLDAuNDY2MjA1XSxbLTQuNDk1NTU1LDYuNDY1NTQ4LDIuOTQ0MTQ3XSxbLTMuNDU1MzM1LDAuMTcxNjUzLDAuMzkwODE2XSxbLTMuOTY0MDI4LDQuMDE3MTk2LDIuMzc2MDA5XSxbLTEuMzIzNTk1LDEuNzYzMTI2LC0wLjc1MDc3Ml0sWy0zLjk3MTE0Miw1LjI3NzUyNCwtMC4xOTQ5Nl0sWy0zLjIyMjA1MiwwLjIzNzcyMywwLjg3MjIyOV0sWy00LjQwMzc4NCwzLjg5MTA3LDEuODcyMDc3XSxbLTMuMzMzMzExLDAuMzQyOTk3LDAuNjYxMDE2XSxbLTQuNDk1ODcxLDQuMjk2MDYsMS42MzYwOF0sWy0zLjYzNjA4MSwyLjc2MDcxMSwyLjM2MTk0OV0sWy00LjQ4NzIzNSwzLjU1OTYwOCwxLjY2NzM3XSxbLTQuNzE5Nzg3LDcuMjY4ODgsMS42NTg3MjJdLFstMS4wODYxNDMsOS4wMzU3NDEsLTAuNzA3MTQ0XSxbLTIuMzM5NjkzLDEuNjAwNDg1LC0wLjQwNDgxN10sWy00LjY0MjAxMSw3LjEyMzgyOSwxLjk5MDk4N10sWy0xLjQ5ODA3NywzLjg1NDAzNSwtMS4zNjk3ODddLFstNC4xODgzNzIsNC43MjkzNjMsMi4wMjk4M10sWy0zLjExNjM0NCw1Ljg4MjI4NCwtMC40Njg4ODRdLFstNC4zMDUyMzYsNC4yNDY0MTcsMS45NzY5OTFdLFstMy4wMjI1MDksMC4yMjgxOSwxLjA2NTY4OF0sWy0yLjc5OTkxNiwwLjUyMDIyLDEuMTI4MzE5XSxbLTQuMjYyODIzLDMuNTM0NDA5LDIuMDIwMzgzXSxbLTQuMjIxNTMzLDMuOTQ3Njc2LDIuMTE3MzVdLFstMy43NDQzNTMsNC4zOTE3MTIsLTAuNjE5M10sWy0xLjI3MjkwNSwwLjE1NjY5NCwtMS43NDE3NTNdLFstMy42MjQ5MSwyLjY2OTgyNSwtMC41NDk2NjRdLFstNC4xODA3NTYsMy4wOTYxNzksMS45ODcyMTVdLFstNC4wNTkyNzYsNC4zMDUzMTMsMi4yMzI5MjRdLFstMi44MTI3NTMsMC4xODMyMjYsMS4zNzAyNjddLFstNC4wMzI0MzcsMy41MTIyMzQsMi4zMDk5ODVdLFstMC4wMzc4NywwLjI4MTg4LDAuNTMwMzkxXSxbLTQuNzExNTYyLDUuNDY4NjUzLDIuODIyODM4XSxbLTQuNTAwNjM2LDYuOTUzMzE0LDIuNTY0NDQ1XSxbLTQuNDc5NDMzLDcuMjE2OTkxLDIuMjcwNjgyXSxbMy45OTA1NjIsMC41MDUyMiwwLjcxNjMwOV0sWy0yLjUxMjIyOSw2Ljg2MzQ0NywtMC4xMDA2NThdLFstMi45NjgwNTgsNi45NTY2MzksLTAuMzcwNjFdLFsyLjU1MDM3NSwzLjE0MjY4MywtMS41NDA2OF0sWy0yLjMyMDA1OSwzLjUyMTYwNSwtMS4yNzkzOTddLFstNC41NTYzMTksNi42NDY2MiwyLjc0NTM2M10sWy00LjI4MTA5MSw3LjEwODExNiwyLjY2NzU5OF0sWy0yLjA1MDA5NSw4LjQxMTY4OSwwLjEyMTM1M10sWy0yLjQ0ODU0LDEuMTM1NDg3LDAuODUxODc1XSxbMy4xMjE4MTUsMC42OTk5NDMsLTAuMjc3MTY3XSxbLTQuNjk4NzcsNi4wMDM3NiwyLjg0MzAzNV0sWy0xLjM2MDU5OSw4LjgyNDc0MiwtMC41OTU1OTddLFsxLjEyODQzNywwLjE3MTYxMSwwLjMwMTY5MV0sWy00LjM2MDE0Niw2LjI4OTQyMywwLjA0MjIzM10sWzEuNDAwNzk1LDQuMDg4ODI5LC0xLjYyMDQwOV0sWy0zLjE5MzQ2Miw4LjQ2MDEzNywtMy41NTk0NDZdLFstMy4xNjg3NzEsOC44Nzg0MzEsLTMuNjM1Nzk1XSxbLTMuNDM0Mjc1LDkuMzA0MzAyLC0zLjQ2MDg3OF0sWy0zLjM0OTk5Myw4LjgwODA5MywtMy4zODE3OV0sWy0zLjMwNDgyMyw4LjMyMzg2NSwtMy4zMjU5MDVdLFstMy41NzI2MDcsOS4zMDg4NDMsLTMuMjA3NjcyXSxbLTMuMTY2MzkzLDguMjAxMjE1LC0zLjQzMDE0XSxbLTMuNDUxNjM4LDkuMDUzMzEsLTMuMzUxMzQ1XSxbLTMuMzA5NTkxLDguNTQ5NzU4LC0zLjM3NTA1NV0sWy0zLjUyNzk5Miw4Ljc5MzkyNiwtMy4xMDAzNzZdLFstMy42Mjg3LDguOTgxNjc3LC0zLjA3NjMxOV0sWy0zLjQ0NTUwNSw4LjAwMTg4NywtMi44MjczXSxbLTMuNDA4MDExLDguMjIxMDE0LC0zLjAzOTIzN10sWy0zLjY1OTI4LDguNzQwMzgyLC0yLjgwODg1Nl0sWy0zLjg3ODAxOSw4Ljc5NzI5NSwtMi40NjI4NjZdLFstMy41MTUxMzIsOC4yMzIzNDEsLTIuNzQ3NzM5XSxbLTMuNDYwMzMxLDguNTE1MjQsLTMuMDY4MThdLFstMy40MDM3MDMsNy42NTg2MjgsLTIuNjQ4Nzg5XSxbLTMuNTA3MTEzLDguMDAxNTksLTIuNTgyMjc1XSxbLTMuNjA3MzczLDguMTc0NzM3LC0yLjQwMTcyM10sWy0zLjc0OTA0Myw4LjM3ODA4NCwtMi4yMjY5NTldLFstMy42NDg1MTQsOC41MDIyMTMsLTIuNjEzOF0sWy0yLjUzNDE5OSwwLjkwNDc1MywyLjAyMTE0OF0sWzEuNDA4Myw1Ljc0NDI1MiwtMC41NzE0MDJdLFstMy44NTI1MzYsOC41NzEwMDksLTIuMzUyMzU4XSxbMi44NjgyNTUsNS4zNzMxMjYsLTAuMTYzNzA1XSxbMi4yMjQzNjMsNC42Njk4OTEsLTEuMDYxNTg2XSxbLTQuNTI4MjgxLDQuODg1ODM4LDEuMzQwMjc0XSxbMS4zMDgxNyw0LjYwOTYyOSwtMS4yODc2Ml0sWy00LjUxOTY5OCwzLjQyMjUwMSwxLjM1NDgyNl0sWy0zLjU0OTk1NSw3Ljc4MzIyOCwtMi4zMzI4NTldLFsxLjEyMzEzLDYuMTIwODU2LDAuMDQ1MTE1XSxbLTMuNjIwMzI0LDcuNTc3MTYsLTIuMDMzNDIzXSxbLTAuNzk4ODMzLDIuNjI0MTMzLC0xLjk5MjY4Ml0sWy0zLjYxNzU4Nyw3Ljc4MzE0OCwtMi4wNTEzODNdLFstMy42NjkyOTMsOC4xMDM3NzYsLTIuMTAyMjddLFstMy44OTI0MTcsOC42Njc0MzYsLTIuMTY3Mjg4XSxbLTAuNTM3NDM1LDAuMjg1MzQ1LC0wLjE3NjI2N10sWy0wLjg0MTUyMiwzLjI5OTg2NiwtMS44ODc4NjFdLFstMC43NjE1NDcsMy42NDcwODIsLTEuNzk4OTUzXSxbLTMuNjYxNTQ0LDcuODU3MDgsLTEuODY3OTI0XSxbLTMuODg2NzYzLDguNTUxNzgzLC0xLjg4OTE3MV0sWy0wLjU5MTI0NCwxLjU0OTc0OSwtMS43MTQ3ODRdLFstMC43NzUyNzYsMS45MDgyMTgsLTEuNTk3NjA5XSxbLTAuOTYxNDU4LDIuNTczMjczLC0xLjY5NTU0OV0sWy0yLjIxNTY3MiwxLjMzNTAwOSwyLjE0MzAzMV0sWy00LjYyMjY3NCw0LjEzMDI0MiwxLjIyMDY4M10sWzEuMDczNDQsMC4yOTAwOTksMS41ODQ3MzRdLFstMC45NzY5MDYsMi45MjE3MSwtMS43NjY2N10sWy0xLjEzNjk2LDMuMTk0NDAxLC0xLjUxMzQ1NV0sWy0zLjc0MzI2Miw3Ljk5OTQ5LC0xLjYyOTI4Nl0sWy0yLjg3NjM1OSw0LjkwMDk4NiwtMC44Nzk1NTZdLFswLjU1MDgzNSwzLjkwNTU1NywtMi4wMzEzNzJdLFswLjc3NzY0Nyw0Ljk5MjMxNCwtMS4yMTU3MDNdLFsxLjQ0NTg4MSw0LjI2NjIwMSwtMS40MTQ2NjNdLFsxLjI3NDIyMiw1LjUxMDU0MywtMC44MjQ0OTVdLFstMC44NjQ2ODUsMi4zMTg1ODEsLTEuNzAyMzg5XSxbLTAuNjI3NDU4LDMuODIwNzIyLC0xLjc0MzE1M10sWy0zLjg2NzY5OSw4LjMwODY2LC0xLjg1MDA2Nl0sWzEuNjM1Mjg3LDUuNDU1ODcsLTAuODM4NDRdLFstMS4wMzc4NzYsMi41Mzg1ODksLTEuNTEzNTA0XSxbLTQuMzg5OTMsNC43MzkyNiwxLjY5OTYzOV0sWzAuMDQ4NzA5LDQuNzY1MjMyLC0xLjI3OTUwNl0sWy0wLjYyNjU0OCwxLjMzOTg4NywtMS41OTUxMTRdLFstMy42ODI4MjcsNy42NDM0NTMsLTEuNzIzMzk4XSxbLTMuODY4NzgzLDguMTgwMTkxLC0xLjUxMTc0M10sWy0wLjc2OTg4LDEuNTA4MzczLC0xLjQxOTU5OV0sWy0xLjEzODM3NCwyLjc2Njc2NSwtMS40NDgxNjNdLFsxLjY5OTg4Myw1Ljc4MDc1MiwtMC40NzUzNjFdLFsxLjIxNDMwNSwwLjMwODUxNywxLjg2NjQwNV0sWy0xLjcxMzY0MiwwLjM3MzQ2MSwtMS4yNjUyMDRdLFstMS41ODIzODgsMC41ODI5NCwtMS4yNjc5NzddLFstMC44Nzk1NDksMS44MjE1ODEsLTEuMzEzNzg3XSxbMC41MTkwNTcsNS44NTg3NTcsLTAuMzgxMzk3XSxbLTMuNzcwOTg5LDIuNDQ5MjA4LC0wLjEzMjY1NV0sWzAuMDg3NTc2LDAuMTU2NzEzLC0xLjUzNjE2XSxbLTAuOTQyNjIyLDIuMTQ2NTM0LC0xLjQyMTQ5NF0sWy0xLjAyNjE5MiwxLjAyMjE2NCwtMS4xNDU0MjNdLFstMC45NjQwNzksMS42NDU0NzMsLTEuMDY3NjMxXSxbLTEuMTA5MTI4LDIuNDU4Nzg5LC0xLjI5MTA2XSxbLTEuMDM3NDc4LDAuMjA5NDg5LC0xLjgwNTQyNF0sWy0zLjcyNDM5MSw3LjU5OTY4NiwtMS4yNzM0NThdLFstMy43ODc4OTgsNy45NTE3OTIsLTEuMzA0Nzk0XSxbMy44MjE2NzcsMi4xNjU1ODEsLTAuMTgxNTM1XSxbLTIuMzk0NjcsMC4zMDQ2MDYsLTAuNTcwMzc1XSxbLTIuMzUyOTI4LDEuMDQzOSwyLjA3OTM2OV0sWy0wLjI4ODg5OSw5LjY0MDY4NCwtMS4wMDYwNzldLFstMy40NzIxMTgsNy4yNjMwMDEsLTEuMDgwMzI2XSxbLTEuMjQwNzY5LDAuOTcyMzUyLC0wLjk3NjQ0Nl0sWy0xLjg0NTI1MywwLjM1NjgwMSwtMC45OTU1NzRdLFstMi4zMjI3OSw3LjkxNTM2MSwtMC4wNTc0NzddLFstMS4wODA5MiwyLjE3OTMxNSwtMS4xNjg4MjFdLFs0LjU5ODgzMywyLjE1Njc2OCwwLjI4MDI2NF0sWy00LjcyNTQxNyw2LjQ0MjM3MywyLjA1NjgwOV0sWy0wLjQ5MDM0Nyw5LjQ2NDI5LC0wLjk4MTA5Ml0sWy0xLjk5NjUyLDAuMDk3MzcsLTAuNzY1ODI4XSxbLTEuMTM3NzkzLDEuODg4ODQ2LC0wLjg5NDE2NV0sWy0wLjM3MjQ3LDQuMjk2NjEsLTEuNDY1MTk5XSxbLTAuMTg0NjMxLDUuNjkyOTQ2LC0wLjQyMTM5OF0sWy0zLjc1MTY5NCw3Ljc0MjIzMSwtMS4wODY5MDhdLFstMS4wMDE0MTYsMS4yOTgyMjUsLTAuOTA0Njc0XSxbLTMuNTM2ODg0LDcuMTkwNzc3LC0wLjc4ODYwOV0sWy0zLjczNzU5Nyw3LjUxMTI4MSwtMC45NDAwNTJdLFstMS43NjY2NTEsMC42NjkzODgsLTAuODczMDU0XSxbMy4xMTIyNDUsMy40NzQzNDUsLTEuMTI5NjcyXSxbLTAuMTc1NTA0LDMuODEyOTgsLTIuMDQ3OV0sWy0zLjc2Njc2Miw3LjQxMjUxNCwtMC42ODE1NjldLFstMC42MzM3NSw5LjQzOTQyNCwtMC43ODUxMjhdLFstMC41MTgxOTksNC43Njg5ODIsLTEuMjU4NjI1XSxbMC43OTA2MTksNC4yMTI3NTksLTEuNjEwMjE4XSxbLTMuNzYxOTUxLDMuNzQyNTI4LC0wLjc1NjI4M10sWzAuODk3NDgzLDUuNjc5ODA4LC0wLjYxMjQyM10sWzIuMjIxMTI2LDQuNDI3NDY4LC0xLjI1MjE1NV0sWy0wLjcyODU3Nyw1Ljg0NjQ1NywwLjA2MjcwMl0sWzAuMTk0NDUxLDkuNTAzOTA4LC0xLjQ4MjQ2MV0sWy0wLjA5OTI0Myw5LjM4NTQ1OSwtMS4zOTU2NF0sWzAuNjQzMTg1LDMuNjM2ODU1LC0yLjE4MDI0N10sWzAuODk0NTIyLDUuOTAwNjAxLC0wLjM1NjkzNV0sWzIuNTk1NTE2LDQuNzU3MzEsLTAuODkzMjQ1XSxbMS4xMDg0OTcsMy45MzY4OTMsLTEuOTA1MDk4XSxbMS45ODk4OTQsNS43ODk3MjYsLTAuMzQzMjY4XSxbLTMuODAyMzQ1LDcuNjU1NTA4LC0wLjYxMzgxN10sWzIuMzM5MzUzLDQuOTYyNTcsLTAuOTAzMDhdLFswLjEyNTY0LDQuMDEzMzI0LC0xLjg3OTIzNl0sWy00LjA3ODk2NSwzLjY4MzI1NCwtMC40NDU0MzldLFsyLjA5Mjg5OSw1LjI1NjEyOCwtMC44MzE2MDddLFswLjQyNzU3MSwwLjI5MTc2OSwxLjI3Mjk2NF0sWzIuMzM1NTQ5LDMuNDgwMDU2LC0xLjU4MTk0OV0sWy0wLjE1Njg3LDAuMzI0ODI3LC0xLjY0ODkyMl0sWy0wLjUzNjUyMiw1Ljc2MDc4NiwtMC4yMDM1MzVdLFsxLjUwNzA4MiwwLjA3ODI1MSwtMC45MjMxMDldLFstMS44NTQ3NDIsMC4xMzQ4MjYsMi42OTg3NzRdLFstMy45Mzk4MjcsMy4xNjg0OTgsLTAuNTI2MTQ0XSxbLTMuOTg0NjEsMy4zOTg2OSwtMC41MzMyMTJdLFstMy45NjE3MzgsNC4yMTcxMzIsLTAuNDg5MTQ3XSxbNC4yNzM3ODksMi4xODExNjQsMC4xNTM3ODZdLFstMC40NzA0OTgsNS42NDU2NjQsLTAuNDM5MDc5XSxbLTAuNDE0NTM5LDUuNDg4MDE3LC0wLjY3MzM3OV0sWy0wLjA5NzQ2Miw1LjA2MjczOSwtMS4xMTQ4NjNdLFsxLjE5ODA5Miw1Ljg4MjIzMiwtMC4zOTE2OTldLFsyLjg1NTgzNCw1LjA4NTAyMiwtMC40OTg2NzhdLFsxLjAzNzk5OCw0LjEyOTc1NywtMS43MDE4MTFdLFsxLjcyODA5MSw1LjA2ODQ0NCwtMS4wNjM3NjFdLFstMy44MzIyNTgsMi42MjUxNDEsLTAuMzExMzg0XSxbLTQuMDc4NTI2LDMuMDcwMjU2LC0wLjI4NDM2Ml0sWy00LjA4MDM2NSwzLjk1NDI0MywtMC40NDA0NzFdLFstMC4xNTI1NzgsNS4yNzYyNjcsLTAuOTI5ODE1XSxbLTEuNDg5NjM1LDguOTI4MDgyLC0wLjI5NTg5MV0sWzAuNzU5Mjk0LDUuMTU1ODUsLTEuMDg3Mzc0XSxbLTQuMDAwMzM4LDIuODAxNjQ3LC0wLjIzNTEzNV0sWy00LjI5MDgwMSwzLjgyMzIwOSwtMC4xOTM3NF0sWy00LjIyMTQ5Myw0LjI1NjE4LC0wLjE4OTg5NF0sWy00LjA2NjE5NSw0LjcxOTE2LC0wLjIwMTcyNF0sWy0wLjE1NTM4Niw0LjA3NjM5NiwtMS42NjI4NjVdLFszLjA1NDU3MSw0LjQxNDMwNSwtMC44MjU5ODVdLFstMS42NTI5MTksOC43MjY0OTksLTAuMzg4NTA0XSxbLTMuMDQyNzUzLDAuNTYwMDY4LC0wLjEyNjQyNV0sWy0yLjQzNDQ1NiwxLjExODA4OCwtMC4yMTM1NjNdLFstMi42MjM1MDIsMS44NDUwNjIsLTAuMjgzNjk3XSxbLTQuMjMzMzcxLDMuNDM5NDEsLTAuMjAyOTE4XSxbMi43MjY3MDIsMy44MjA3MSwtMS4yODAwOTddLFswLjE4NDE5OSw0LjE0NjM5LC0xLjY3MzY1M10sWy0xLjI4OTIwMywwLjYyNDU2MiwtMS41NjA5MjldLFstMy44MjM2NzYsNy4zODI0NTgsLTAuNDA3MjIzXSxbMC40NzY2NjcsNS4wNjQ0MTksLTEuMTQzNzQyXSxbLTMuODczNjUxLDQuOTU1MTEyLC0wLjI2OTM4OV0sWzEuMzQ5NjY2LDUuMzEyMjI3LC0xLjAwMDI3NF0sWy0yLjA0Mzc3Niw4LjQzNDQ4OCwtMC4xMDg4OTFdLFstMi43NjM5NjQsMC43MzMzOTUsLTAuMTI5Mjk0XSxbLTQuMzgwNTA1LDMuNjY0NDA5LC0wLjAyNDU0Nl0sWy0wLjcxMjExLDUuMzQxODExLC0wLjgwMzI4MV0sWy0zLjk2MDg1OCw3LjE4MzExMiwtMC4xMTg0MDddLFstMy44MjIyNzcsNy43MTI4NTMsLTAuMjYzMjIxXSxbLTIuMzQ2ODA4LDguMTA4NTg4LDAuMDYzMjQ0XSxbLTEuODQxNzMxLDguNjQyOTk5LC0wLjE0MjQ5Nl0sWy0yLjYwMDA1NSwwLjk4NTYwNCwtMC4wNDM1OTVdLFstMy41MTMwNTcsMi4yMTMyNDMsLTAuMDQ0MTUxXSxbLTMuOTYzNDkyLDIuNjAzMDU1LC0wLjA4MDg5OF0sWy00LjI1ODA2NiwzLjE0NTM3LC0wLjAyNzA0Nl0sWy00LjI2MTU3Miw1LjAwMzM0LDAuMTMwMDRdLFswLjc5NTQ2NCwzLjk5ODczLC0xLjkwNTY4OF0sWy0zLjMwMDg3MywwLjM4NDc2MSwwLjAxMzI3MV0sWy0yLjc3MDI0NCwwLjg4MTk0MiwwLjA3NzMxM10sWy0zLjQ1NjIyNywxLjk5Mzg3MSwwLjMwMTA1NF0sWy00LjQ0MTk4NywzLjkxNDE0NCwwLjE3Nzg2N10sWy00LjM2NzA3NSw2LjYxMTQxNCwwLjE2NTMxMl0sWy0zLjIwMTc2NywwLjU3NjI5MiwwLjEwNTc2OV0sWy0zLjE3NDM1NCwwLjY0NTAwOSwwLjQ0MDM3M10sWy0yLjk5NjU3NiwwLjc0MjYyLDAuMTYxMzI1XSxbLTIuNzI0OTc5LDEuNjU2NDk3LDAuMDkyOTgzXSxbLTMuMjYxNzU3LDIuMDE3NzQyLC0wLjA3MDc2M10sWy00LjI4MDE3Myw0LjUxODIzNSwtMC4wMDI5OTldLFstNC40NzEwNzMsNS45NDUzNTgsMC4wNTIwMl0sWy0zLjg3NzEzNywyLjQwNzQzLDAuMjc0OTI4XSxbLTQuMzcxMjE5LDQuMjUyNzU4LDAuMDc4MDM5XSxbLTMuNDAwOTE0LDAuNDA5ODMsMC4yMzg1OTldLFstNC40NDI5MywzLjUyMzI0MiwwLjE0NjMzOV0sWy00LjU3NDUyOCw1LjI3OTc2MSwwLjM1MzkyM10sWy00LjIyNjY0Myw3LjE5MTI4MiwwLjI2OTI1Nl0sWy00LjE2MzYxLDIuODQzMjA0LDAuMDk3NzI3XSxbLTQuNTI4NTA2LDUuMDExNjYxLDAuNTM2NjI1XSxbMC4zNTUxNCw1LjY2NDgwMiwtMC41NzI4MTRdLFsyLjUwODcxMSw1LjU4MDk3NiwtMC4yNjY2MzZdLFsyLjU1NjIyNiwzLjYzMzc3OSwtMS40MjYzNjJdLFsxLjg3ODQ1Niw0LjUzMzcxNCwtMS4yMjM3NDRdLFsyLjQ2MDcwOSw0LjQ0MDI0MSwtMS4xMzk1XSxbMi4yMTg1ODksNS41MTQ2MDMsLTAuNTYwMDY2XSxbMi4yNjM3MTIsNS43MzcwMjMsLTAuMjUwNjk0XSxbMi45NjQ5ODEsMy44MTQ4NTgsLTEuMTM5OTI3XSxbMC45OTEzODQsNS4zMDQxMzEsLTAuOTk5ODY3XSxbMi44MTE4Nyw0LjU0NzI5MiwtMC45MTYwMjVdLFsyLjkxODA4OSw0Ljc2ODM4MiwtMC43MDI4MDhdLFszLjI2MjQwMyw0LjQxNDI4NiwtMC42NTc5MzVdLFswLjY1MjEzNiw2LjA4OTExMywwLjA2OTA4OV0sWzMuMzYxMzg5LDMuNTA1MiwtMC45NDYxMjNdLFsyLjYxMzA0Miw1LjAzNzE5MiwtMC42OTcxNTNdLFswLjA5NDMzOSw0LjM2ODU4LC0xLjQ1MTIzOF0sWzMuMjkwODYyLDQuMTU1NzE2LC0wLjczMjMxOF0sWzIuNjU4MDYzLDQuMDczNjE0LC0xLjIxNzQ1NV0sWzMuMjYwMzQ5LDMuNzUzMjU3LC0wLjk0NjgxOV0sWzEuMTI0MjY4LDQuODYyNDYzLC0xLjIwNzg1NV0sWzMuMzUxNTgsNC44OTkyNDcsLTAuMDI3NTg2XSxbMy4xOTQwNTcsNC42OTEyNTcsLTAuNTI0NTY2XSxbMy4wOTAxMTksNS4xMTYwODUsLTAuMjMyNTVdLFsyLjQxODk2NSwzLjgxMTc1MywtMS40MTkzOTldLFsyLjE5MTc4OSwzLjg3NzAzOCwtMS40NzAyM10sWzQuMDQzMTY2LDIuMDM0MTg4LDAuMDE1NDc3XSxbLTEuMDI2OTY2LDAuODY3NjYsLTEuNDEwOTEyXSxbMS45Mzc1NjMsMy44NjAwMDUsLTEuNjE3NDY1XSxbMi45ODkwNCw0LjEwMTgwNiwtMC45OTgxMzJdLFstMC4xNDI2MTEsNS44NjUzMDUsLTAuMTAwODcyXSxbMy45NzI2NzMsMi4yOTIwNjksMC4wODk0NjNdLFszLjIzMzQ5LDMuOTU5OTI1LC0wLjg0OTgyOV0sWzAuMTYzMDQsNS44NTcyNzYsLTAuMjE2NzA0XSxbNC4xMjI5NjQsMS43NzAwNjEsLTAuMTE0OTA2XSxbMi4wOTkwNTcsNC45NzgzNzQsLTAuOTg0NDldLFszLjUwMjQxMSwzLjc2MTgxLC0wLjY2NzUwMl0sWzIuMDc5NDg0LDUuOTM5NjE0LC0wLjAzNjIwNV0sWy0wLjA4NDU2OCwzLjUyNTE5MywtMi4yNTM1MDZdLFswLjQyMzg1OSw0LjA2MDk1LC0xLjg0NTMyN10sWzEuNjAxMyw2LjAwNjQ2NiwtMC4xNTM0MjldLFswLjI3MTcwMSwzLjg0NDk2NCwtMi4wNzg3NDhdLFswLjI3MzU3Nyw1LjIxODkwNCwtMC45OTQ3MTFdLFstMC40MTA1NzgsMy45MjE2NSwtMS43NzM2MzVdLFsxLjk0MTk1NCw1LjYwMDQxLC0wLjYyMTU2OV0sWzAuMTAwODI1LDUuNDYyMTMxLC0wLjc3NDI1Nl0sWy0wLjUzMDE2LDMuNjE5ODkyLC0yLjAyNzQ1MV0sWy0wLjgyMjM3MSw1LjUxNzQ1MywtMC42MDU3NDddLFstMi40NzQ5MjUsNy42NzA4OTIsLTAuMDIwMTc0XSxbNC4wMTU3MSwwLjgzMDE5NCwtMC4wMTM3OTNdLFstMC40MDAwOTIsNS4wOTQxMTIsLTEuMDQxOTkyXSxbLTIuODg3Mjg0LDUuNTgxMjQ2LC0wLjUyNTMyNF0sWy0xLjU1OTg0MSw2LjA1MDk3MiwwLjA3OTMwMV0sWy0wLjQ2OTMxNywzLjI5MTY3MywtMi4yMzUyMTFdLFswLjMzNzM5NywzLjQ2NzkyNiwtMi4yOTU0NThdLFstMi42MzIwNzQsNS41NzM3MDEsLTAuNTgyNzE3XSxbLTAuMDMwMzE4LDYuMDExMzk1LDAuMjc2NjE2XSxbLTAuOTM0MzczLDAuMzg4OTg3LC0xLjc4MDUyM10sWy0yLjY2MTI2Myw1Ljg0NDgzOCwtMC40MjU5NjZdLFswLjU0OTM1Myw1LjQ4OTY0NiwtMC44MDcyNjhdLFstMi4xOTQzNTUsNi4xOTc0OTEsLTAuMTA5MzIyXSxbLTIuMjg5NjE4LDUuNjY0ODEzLC0wLjU4MTA5OF0sWzEuNTgzNTgzLDMuNzk2MzY2LC0xLjg0NDQ5OF0sWzAuODU1Mjk1LDAuMjE1OTc5LC0xLjQyNTU1N10sWy0yLjYyNzU2OSw1LjMwMDIzNiwtMC43NjcxNzRdLFs0LjMzMzM0NywyLjM4NDMzMiwwLjM5OTEyOV0sWy0xLjg4MDQwMSw1LjU4Mzg0MywtMC42OTY1NjFdLFstMi4xNzIzNDYsNS4zMjQ4NTksLTAuODQ2MjQ2XSxbLTIuMjcwNTgsNS45MDYyNjUsLTAuMzg4MzczXSxbLTEuOTYwMDQ5LDUuODg5MzQ2LC0wLjM5NzU5M10sWzAuOTY1NzU2LDMuNjc1NDcsLTIuMTA1NjcxXSxbLTIuMDE0MDY2LDYuNDMxMTI1LDAuMjg3MjU0XSxbLTEuNzc2MTczLDUuMjg3MDk3LC0wLjg5MDkxXSxbLTIuMDI1ODUyLDUuMDg5NTYyLC0wLjk4MDIxOF0sWy0xLjg4NjQxOCw2LjEwODM1OCwtMC4wMDA2NjddLFstMS42MDA4MDMsNS43ODUzNDcsLTAuNDkxMDY5XSxbLTEuNjYxODgsNC45NjgwNTMsLTEuMDQyNTM1XSxbLTEuNjAwNjIxLDUuOTYyODE4LC0wLjE4ODA0NF0sWy0xLjU4ODgzMSw1LjYxNTQxOCwtMC42NjU0NTZdLFs0LjQ2OTAxLDEuODgwMTM4LDAuMDU3MjQ4XSxbLTEuOTc4ODQ1LDAuOTI3Mzk5LC0wLjU1NDg1Nl0sWy0xLjQwODA3NCw1LjMyNTI2NiwtMC44Mzk2N10sWzEuOTIzMTIzLDQuODQzOTU1LC0xLjEwMTM4OV0sWy0yLjg3Mzc4LDAuMTE3MTA2LC0wLjQxMjczNV0sWy0xLjIyMjE5Myw1LjYyNjM4LC0wLjUzOTk4MV0sWy0yLjYzMjUzNywwLjE2NjM0OSwtMC40ODkyMThdLFstMS4zNzA4NjUsNS44Mzg4MzIsLTAuMzQxMDI2XSxbLTEuMDY3NzQyLDUuNDQ4ODc0LC0wLjY5MjcwMV0sWy0xLjA3Mzc5OCw1LjIyMDg3OCwtMC45MDg3NzldLFstMS4xNDc1NjIsNC45NTA0MTcsLTEuMDc5NzI3XSxbLTIuNzg5MTE1LDQuNTMxMDQ3LC0xLjA0MjcxM10sWy0zLjU1MDgyNiw0LjE3MDQ4NywtMC44MDYwNThdLFstMy4zMzE2OTQsNC43OTgxNzcsLTAuNjk1NjhdLFstMy42ODk0MDQsNC42ODg1NDMsLTAuNTM0MzE3XSxbLTMuNTExNTA5LDUuMTA2MjQ2LC0wLjQ4MzYzMl0sWzEuNzk2MzQ0LDAuMDc2MTM3LDAuMDgwNDU1XSxbLTMuMzA2MzU0LDUuNDczNjA1LC0wLjQ3ODc2NF0sWy0yLjY5MjUwMywzLjM0NjYwNCwtMS4yMDk1OV0sWy0zLjk2MzA1Niw1LjE4NzQ2MiwzLjExMzE1Nl0sWy0zLjkwMTIzMSw2LjM5MTQ3NywtMC4yNDY5ODRdLFs0LjQ4NDIzNCwxLjUxODYzOCwtMC4wMDE2MTddLFs0LjMwODgyOSwxLjY1NzcxNiwtMC4xMTkyNzVdLFs0LjI5MDA0NSwxLjMzOTUyOCwtMC4xMTA2MjZdLFstMy41MTQ5MzgsMy41MjQ5NzQsLTAuOTA5MTA5XSxbLTIuMTk0MywyLjEyMTYzLC0wLjcxOTY2XSxbNC4xMDgyMDYsMS4wOTEwODcsLTAuMTE0MTZdLFszLjc4NTMxMiwxLjM5MjQzNSwtMC4yODU4OF0sWzQuMDkyODg2LDEuNDgwNDc2LC0wLjIxMDY1NV0sWy0yLjk2NTkzNyw2LjQ2OTAwNiwtMC4zNzkwODVdLFstMy43MDg1ODEsMi45NjI5NzQsLTAuNjM5NzldLFstMy4yOTc5NzEsMi4yMTg5MTcsLTAuMjk5ODcyXSxbMy44MDY5NDksMC44MDQ3MDMsLTAuMTE0MzhdLFszLjc0Nzk1NywxLjA1OTI1OCwtMC4yNzMwNjldLFstMy4xMDE4MjcsNC4xMTE0NDQsLTEuMDA2MjU1XSxbLTEuNTM2NDQ1LDQuNjU4OTEzLC0xLjE5NTA0OV0sWy0zLjU0OTgyNiwyLjQ1MDU1NSwtMC4zNzU2OTRdLFstMy42NzY0OTUsMi4xMDgzNjYsMC41MzQzMjNdLFstMy42NzQ3MzgsNS45MjUwNzUsLTAuNDAwMDExXSxbLTIuMjUwMTE1LDIuODQ4MzM1LC0xLjEyMTE3NF0sWy0zLjY5ODA2Miw1LjY2NzU2NywtMC4zODEzOTZdLFszLjQ2ODk2NiwwLjczNDY0MywtMC4xOTA2MjRdLFstMy45Nzk3Miw1LjY3MDA3OCwtMC4yNjg3NF0sWy0zLjAwMjA4Nyw0LjMzNzgzNywtMS4wMzM0MjFdLFstMy4zNTYzOTIsMi42MDgzMDgsLTAuNzEzMzIzXSxbLTEuODMzMDE2LDMuMzU5OTgzLC0xLjI4Nzc1XSxbLTEuOTg5MDY5LDMuNjMyNDE2LC0xLjMwNTYwN10sWzMuNTkxMjU0LDAuNTQyMzcxLDAuMDI2MTQ2XSxbMy4zNjQ5MjcsMS4wODI1NzIsLTAuMzQyNjEzXSxbLTMuMzkzNzU5LDMuODY2ODAxLC0wLjkzNzI2Nl0sWy00LjEyNDg2NSw1LjU0OTUyOSwtMC4xNjE3MjldLFstNC40MjM0MjMsNS42ODcyMjMsMC4wMDAxMDNdLFstMS40OTY4ODEsMi42MDE3ODUsLTEuMTE0MzI4XSxbLTIuNjQyMjk3LDYuNDk2OTMyLC0wLjI2NDE3NV0sWy0zLjY4NDIzNiw2LjgxOTQyMywtMC4zMjAyMzNdLFstMi4yODY5OTYsMy4xNjcwNjcsLTEuMjQ2NjUxXSxbLTEuNjI0ODk2LDguNDQ4NDgsLTAuNTMwMDE0XSxbLTMuNjY2Nzg3LDIuMTU5MjY2LDAuMjY4MTQ5XSxbLTIuNDAyNjI1LDIuMDExMjQzLC0wLjU2NDQ2XSxbLTIuNzM2MTY2LDIuMjU5ODM5LC0wLjY5NDNdLFstMi4xNjg2MTEsMy44OTA3OCwtMS4yOTIyMDZdLFstMi4wNjU5NTYsMy4zNDU3MDgsLTEuMjgxMzQ2XSxbLTIuNzc4MTQ3LDIuNjc1NjA1LC0wLjk5NTcwNl0sWy0zLjUwNzQzMSw0LjUxMzI3MiwtMC43MTgyOV0sWy0yLjMwMTE4NCw0LjI5MzkxMSwtMS4yMzgxODJdLFszLjIwNTgwOCwwLjIxMTA3OCwwLjM5NDM0OV0sWy0yLjEyOTkzNiw0Ljg3MDU3NywtMS4wODA3ODFdLFstMi4yODc5NzcsMi40OTY1OTMsLTAuOTM0MDY5XSxbLTIuNzAxODMzLDIuOTMxODE0LC0xLjExNDUwOV0sWzMuMjk0Nzk1LDAuNTA2MzEsLTAuMDgxMDYyXSxbLTIuNTUyODI5LDcuNDY4NzcxLC0wLjAyMTU0MV0sWzMuMDY3MjEsMC45NDQwNjYsLTAuNDMwNzRdLFstMi44NjA4NiwxLjk3MzYyMiwtMC4zMDMxMzJdLFstMy41OTg4MTgsNS40MTk2MTMsLTAuNDAxNjQ1XSxbLTEuNTI0MzgxLDAuMDgwMTU2LC0xLjYxNjYyXSxbLTEuOTA3MjkxLDIuNjQ2Mjc0LC0xLjAzOTQzOF0sWzIuOTUwNzgzLDAuNDA3NTYyLC0wLjEwNTQwN10sWy0xLjY2MzA0OCwxLjY1NTAzOCwtMC42ODk3ODddLFstMS43MjgxMDIsMS4xMTAwNjQsLTAuNjM1OTYzXSxbLTIuMDg1ODIzLDcuNjg2Mjk2LC0wLjE1OTc0NV0sWzIuODgzNTE4LDMuMTU3MDA5LC0xLjMwODU4XSxbLTIuNzI0MTE2LDAuNDE3MTY5LC0wLjM4OTcxOV0sWy0xLjc4ODYzNiw3Ljg2MjY3MiwtMC4zNDY0MTNdLFstMi4xODY0MTgsMS4yNDk2MDksLTAuNDM0NTgzXSxbLTMuMDkyNDM0LDIuNjA2NjU3LC0wLjg2MDAwMl0sWy0xLjczNzMxNCwzLjg3NDIwMSwtMS4zMzA5ODZdLFsyLjU2NDUyMiwwLjQyMjk2NywtMC4zOTA5MDNdLFsxLjY3MDc4MiwzLjUzODQzMiwtMS45MjQ3NTNdLFstMi4zMzgxMzEsNC4wMjU3OCwtMS4yODY2NzNdLFstMS45MTY1MTYsNC4wNTQxMjEsLTEuMzAxNzg4XSxbMi44NzE1OSwyLjAzNDk0OSwtMS4yNjcxMzldLFstMS45MzE1MTgsMy4wNjI4ODMsLTEuMTk3MjI3XSxbLTAuODE2NjAyLDAuMTM1NjgyLDMuMTA0MTA0XSxbMC40NjkzOTIsMC4yMTM5MTYsLTEuNDg5NjA4XSxbMi41NzQwNTUsMS45NTAwOTEsLTEuNTE0NDI3XSxbMi43MzM1OTUsMi42ODI1NDYsLTEuNDYxMjEzXSxbLTEuOTE1NDA3LDQuNjkzNjQ3LC0xLjE1MTcyMV0sWy0zLjQxMjg4Myw1Ljg2NzA5NCwtMC40NTA1MjhdLFsyLjI4ODIyLDAuMTIwNDMyLC0wLjA0MTAyXSxbMi4yNDQ0NzcsMC4xNDQyNCwtMC4zNzY5MzNdLFstMS42NzYxOTgsMy41NzA2OTgsLTEuMzI4MDMxXSxbLTEuODIxMTkzLDQuMzY2OTgyLC0xLjI2NjI3MV0sWy0xLjU1MjIwOCw4LjA5OTIyMSwtMC41MzI2Ml0sWy0xLjcyNzQxOSwyLjM5MDk3LC0wLjk4OTQ1Nl0sWy0yLjQ2ODIyNiw0LjcxMTY2MywtMS4wNjk3NjZdLFstMi40NTE2NjksNi4xMTMzMTksLTAuMjczNzg4XSxbMi42MzU0NDcsMi4yOTU4NDIsLTEuNTE4MzYxXSxbLTIuMDIwODA5LDguMTUwMjUzLC0wLjI0NjcxNF0sWzIuMjkyNDU1LDAuODA1NTk2LC0xLjMwNDJdLFsyLjY0MTU1NiwxLjY1NjY1LC0xLjQ2Njk2Ml0sWzIuNDA5MDYyLDIuODQyNTM4LC0xLjYzNTAyNV0sWzIuNDU2NjgyLDEuNDU5NDg0LC0xLjU3NTQzXSxbLTEuNjkxMDQ3LDMuMTczNTgyLC0xLjI0NzA4Ml0sWy0xLjg2NTY0MiwxLjk1NzYwOCwtMC43Njg2ODNdLFstMy40MDE1NzksMC4yMDQwNywwLjEwMDkzMl0sWzIuMzAxOTgxLDEuNzEwMiwtMS42NTA0NjFdLFsyLjM0MjkyOSwyLjYxMTk0NCwtMS42OTA3MTNdLFstMS42NzYxMTEsMi45MjM4OTQsLTEuMTc4MzVdLFstMi45OTIwMzksMy41NDc2MzEsLTEuMTE4OTQ1XSxbLTMuNTcxNjc3LDYuNTA0NjM0LC0wLjM3NTQ1NV0sWzIuMTQxNzY0LDEuNDYwODY5LC0xLjcwMjQ2NF0sWy0zLjIyMTk1OCw1LjE0NjA0OSwtMC42MTU2MzJdLFsyLjE5MjM4LDIuOTQ5MzY3LC0xLjc0NzI0Ml0sWzIuMzIwNzkxLDIuMjMyOTcxLC0xLjcwNjg0Ml0sWzIuMDg4Njc4LDIuNTg1MjM1LC0xLjgxMzE1OV0sWy0yLjE5NjQwNCwwLjU5MjIxOCwtMC41Njk3MDldLFstMi4xMjA4MTEsMS44MzY0ODMsLTAuNjIzMzhdLFstMS45NDk5MzUsMi4yNzEyNDksLTAuODc0MTI4XSxbMi4yMzU5MDEsMS4xMTAxODMsLTEuNTEwNzE5XSxbMi4wMjAxNTcsMy4yNDExMjgsLTEuODAzOTE3XSxbMi4wNTQzMzYsMS45NDkzOTQsLTEuNzkyMzMyXSxbLTMuMDk0MTE3LDQuOTk2NTk1LC0wLjc0MDIzOF0sWzIuMDM4MDYzLDAuNjM1OTQ5LC0xLjQwMjA0MV0sWzEuOTgwNjQ0LDEuNjg0NDA4LC0xLjc2Nzc4XSxbMS41ODc0MzIsMy4zMDY1NDIsLTEuOTkxMTMxXSxbMS45MzUzMjIsMC45NzYyNjcsLTEuNjAyMjA4XSxbMS45MjI2MjEsMS4yMzU1MjIsLTEuNjk4ODEzXSxbMS43MTI0OTUsMS45MTE4NzQsLTEuOTAzMjM0XSxbMS45MTI4MDIsMi4yNTkyNzMsLTEuODg4Njk4XSxbMS44ODQzNjcsMC4zNTU0NTMsLTEuMzEyNjMzXSxbMS42NzY0MjcsMC43NjI4MywtMS41Mzk0NTVdLFsxLjc4NDUzLDIuODM2NjIsLTEuOTQzMDM1XSxbMS42OTczMTIsMC4xMjAyODEsLTEuMTUwMzI0XSxbMS42NDgzMTgsMi40ODQ5NzMsLTEuOTk5NTA1XSxbLTQuMDUxODA0LDUuOTU4NDcyLC0wLjIzMTczMV0sWy0xLjk2NDgyMywxLjQ2NDYwNywtMC41ODExNV0sWzEuNTU5OTYsMi4xODM0ODYsLTEuOTcxMzc4XSxbMS42MjgxMjUsMS4wNDU5MTIsLTEuNzA3ODMyXSxbMS43MDE2ODQsMS41NDA0MjgsLTEuODI3MTU2XSxbMS41Njc0NzUsNC44Njk0ODEsLTEuMTg0NjY1XSxbMS40MzI0OTIsMC44NDM3NzksLTEuNjQ4MDgzXSxbMS4xNzM4MzcsMi45Nzg5ODMsLTIuMTU2Njg3XSxbMS4yMzUyODcsMy4zNzk3NSwtMi4wOTUxNV0sWzEuMjUyNTg5LDEuNTI1MjkzLC0xLjk0OTIwNV0sWzEuMTU5MzM0LDIuMzM2Mzc5LC0yLjEwNTM2MV0sWzEuNDkwNjEsMi42OTUyNjMsLTIuMDgzMjE2XSxbLTQuMTIyNDg2LDYuNzgyNjA0LC0wLjAyNTQ1XSxbMS4xNzMzODgsMC4yNzkxOTMsLTEuNDIzNDE4XSxbMS41MDU2ODQsMC4zODA4MTUsLTEuNDE0Mzk1XSxbMS4zOTE0MjMsMS4zNDMwMzEsLTEuODQzNTU3XSxbMS4yNjM0NDksMi43MzIyNSwtMi4xNDQ5NjFdLFsxLjI5NTg1OCwwLjU5NzEyMiwtMS41MTU2MjhdLFsxLjI0NTg1MSwzLjcyOTEyNiwtMS45OTMwMTVdLFstMi43NjE0MzksNi4yMzcxNywtMC4zNjU4NTZdLFswLjk3ODg4NywxLjY2NDg4OCwtMi4wNDY2MzNdLFsxLjIxOTU0MiwwLjk4MjcyOSwtMS43ODU0ODZdLFsxLjMxNTkxNSwxLjkxNzQ4LC0yLjAyNzg4XSxbLTMuMDUyNzQ2LDIuMTI3MjIyLC0wLjM2OTA4Ml0sWzAuOTc3NjU2LDEuMzYyMjMsLTEuOTQ0MTE5XSxbMC45MzYxMjIsMy4zOTQ0NywtMi4yMDMwMDddLFstMi43NDAwMzYsNC4xODQ3MDIsLTEuMTIyODQ5XSxbMC44NTM1ODEsMi44NjQ2OTQsLTIuMjYwODQ3XSxbMC43MTk1NjksMC44MTg3NjIsLTEuNzYzNjE4XSxbMC44MzkxMTUsMS4xNTkzNTksLTEuOTA3OTQzXSxbMC45MzIwNjksMS45NDU1OSwtMi4xMTc5NjJdLFswLjU3OTMyMSwzLjMyNjc0NywtMi4yOTkzNjldLFswLjg2MzI0LDAuNTk3ODIyLC0xLjU2NTEwNl0sWzAuNTc0NTY3LDEuMTU4NDUyLC0xLjk0MzEyM10sWzAuNTI1MTM4LDIuMTM3MjUyLC0yLjIxMzg2N10sWzAuNzc5OTQxLDIuMzQyMDE5LC0yLjIwNjE1N10sWzAuOTE1MjU1LDIuNjE4MTAyLC0yLjIwOTA0MV0sWzAuNTI2NDI2LDMuMDIyNDEsLTIuMzIxODI2XSxbMC40OTU0MzEsMi41MjEzOTYsLTIuMjk1OTA1XSxbMC44MDc5OSwzLjE1NjgxNywtMi4yODY0MzJdLFswLjI3MzU1NiwxLjMwNDkzNiwtMi4wMTI1MDldLFswLjY2NDMyNiwxLjUzMDAyNCwtMi4wNDg3MjJdLFswLjIxOTE3MywyLjMyOTA3LC0yLjMyMzIxMl0sWzAuNDA1MzI0LDAuNjk1MzU5LC0xLjcwNDg4NF0sWzAuMzk4ODI3LDAuOTQ2NjQ5LC0xLjg0Mzg5OV0sWzAuMzQ1MTA5LDEuNjA4ODI5LC0yLjEwMDE3NF0sWy0yLjM1Njc0MywwLjA2MjAzMiwtMC40OTQ3XSxbLTMuMDAxMDg0LDAuMjcxNDYsMi41NjAwMzRdLFstMi4wNjQ2NjMsMC4zMDMwNTUsLTAuNjk3MzI0XSxbMC4yMjEyNzEsMy4xNzQwMjMsLTIuMzc0Mzk5XSxbMC4xOTU4NDIsMC40Mzc4NjUsLTEuNjIxNDczXSxbLTAuMzg1NjEzLDAuMjk3NzYzLDEuOTYwMDk2XSxbMS45OTk2MDksMC4xMDg5MjgsLTAuNzkxMjVdLFswLjM1MTY5OCw5LjIyNzQ5NCwtMS41NzU2NV0sWzAuMDIxNDc3LDIuMTkxOTEzLC0yLjMwOTM1M10sWzAuMjQ2MzgxLDIuODM2NTc1LC0yLjM1NjM2NV0sWzEuNTQzMjgxLDAuMjM3NTM5LDEuOTAxOTA2XSxbMC4wMzE4ODEsOS4xNDcwMjIsLTEuNDU0MjAzXSxbLTAuMDAxODgxLDEuNjQ4NTAzLC0yLjEwODA0NF0sWzAuMzMzNDIzLDEuOTA3MDg4LC0yLjIwNDUzM10sWzAuMDQ0MDYzLDIuNjM0MDMyLC0yLjM2ODQxMl0sWy0wLjAyODE0OCwzLjA1MzY4NCwtMi4zOTAwODJdLFswLjAyNDEzLDMuMzQyOTcsLTIuMzY1NDRdLFstMC4yNzI2NDUsOS4wMjg3OSwtMS4yMzg2ODVdLFstMC4wMDYzNDgsMC44MzIwNDQsLTEuNzU4MjIyXSxbLTAuMzIxMTA1LDEuNDU4NzU0LC0xLjg4NjMxM10sWy0wLjE1Mzk0OCw4LjYxODgwOSwtMS4xMDUzNTNdLFstMC40MDkzMDMsMS4xMzc3ODMsLTEuNzIwNTU2XSxbLTAuNDEwMDU0LDEuNzQyNzg5LC0xLjk1Nzk4OV0sWy0wLjI4NzkwNSwyLjM4MDQwNCwtMi4yOTQ1MDldLFstMC4yNjEzNzUsMi42NDY2MjksLTIuMzU2MzIyXSxbLTAuMjIxOTg2LDMuMjE1MzAzLC0yLjM0NTg0NF0sWy0wLjMxNjA4LDAuNjg3NTgxLC0xLjcxOTAxXSxbLTAuNTM3NzA1LDAuODU1ODAyLC0xLjY0ODU4NV0sWy0wLjE0MjgzNCwxLjE5MzA1MywtMS44NzM3MV0sWy0wLjI0MzcxLDIuMDQ0NDM1LC0yLjE3Njk1OF0sWy0wLjQzNzk5OSwyLjk1OTc0OCwtMi4yOTk2OThdLFstMC43ODg5NSwwLjE3NjIyNiwtMS43MjkwNDZdLFstMC42MDg1MDksMC41NDY5MzIsLTEuNzM0MDMyXSxbLTAuNjkzNjk4LDQuNDc4NzgyLC0xLjM2OTM3Ml0sWy0wLjY2OTE1Myw4LjQ2OTY0NSwtMC45MTExNDldLFstMC43NDE4NTcsMS4wODI3MDUsLTEuNDU4NDc0XSxbLTAuNTU0MDU5LDIuNDQwMzI1LC0yLjE0MTc4NV0sWzIuMDkyNjEsMC4xNTMxODIsMi41NzU4MV0sWzEuNzkyNTQ3LDAuMTExNzk0LDIuNTYzNzc3XSxbMS44NTU3ODcsMC4xODk1NDEsMi44MzUwODldLFsxLjQ5MjYwMSwwLjIzMjI0NiwyLjk4NzY4MV0sWy0wLjI4NDkxOCwwLjIzNjY4NywzLjQyOTczOF0sWzIuNjA0ODQxLDAuMTE5OTcsMS4wMTUwNl0sWzAuMzMxMjcxLDAuMTY4MTEzLDMuMTI0MDMxXSxbMC4yODA2MDYsMC4zMDgzNjgsMi40OTU5MzddLFswLjU0NDU5MSwwLjMyNTcxMSwyLjA4MTI3NF0sWzAuMTkzMTQ1LDAuMTkxNTQsLTAuOTc3NTU2XSxbMy44MTAwOTksMC40MjMyNCwxLjAzMjIwMl0sWzMuNTQ2MjIsMC4zNzkyNDUsMS4zOTI4MTRdLFswLjYxNDAyLDAuMjc2MzI4LDAuODQ5MzU2XSxbLTEuMTk4NjI4LDAuMTQ0OTUzLDIuOTExNDU3XSxbNC4xNzE5OSwwLjY4MDM3LDEuMzkxNTI2XSxbMC44ODI3OSwwLjMyMTMzOSwyLjA1OTEyOV0sWzEuOTMwMzUsMC4xMDk5OTIsMi4wNTQxNTRdLFsxLjYyMDMzMSwwLjEyMTk4NiwyLjM3MjAzXSxbMi4zNzQ4MTIsMC4xMDkyMSwxLjczNDg3Nl0sWy0wLjAzMTIyNywwLjI5NDQxMiwyLjU5MzY4N10sWzQuMDc1MDE4LDAuNTYxOTE0LDEuMDM4MDY1XSxbLTAuNTcwMzY2LDAuMTI2NTgzLDIuOTc1NTU4XSxbMC45NTAwNTIsMC4zMTg0NjMsMS44MDQwMTJdLFsxLjEzMDAzNCwwLjExNzEyNSwwLjk4Mzg1XSxbMi4xMjMwNDksMC4wODk0NiwxLjY2NTkxMV0sWzIuMDg3NTcyLDAuMDY4NjIxLDAuMzM1MDEzXSxbMi45MjczMzcsMC4xNjcxMTcsMC4yODk2MTFdLFswLjUyODg3NiwwLjMxMzQzNCwzLjIwNTk2OV0sWzEuMTc0OTExLDAuMTYyNzQ0LDEuMzI4MjYyXSxbLTQuODg4NDQsNS41OTUzNSwxLjY2MTEzNF0sWy00LjcwOTYwNyw1LjE2NTMzOCwxLjMyNDA4Ml0sWzAuODcxMTk5LDAuMjc3MDIxLDEuMjYzODMxXSxbLTMuOTEwODc3LDIuMzQ5MzE4LDEuMjcyMjY5XSxbMS41NjgyNCwwLjExODYwNSwyLjc2ODExMl0sWzEuMTc5MTc2LDAuMTUyNjE3LC0wLjg1ODAwM10sWzEuNjM0NjI5LDAuMjQ3ODcyLDIuMTI4NjI1XSxbLTQuNjI3NDI1LDUuMTI2OTM1LDEuNjE3ODM2XSxbMy44NDU1NDIsMC41NDkwNywxLjQ1NjAxXSxbMi42NTQwMDYsMC4xNjU1MDgsMS42MzcxNjldLFstMC42NzgzMjQsMC4yNjQ4OCwxLjk3NDc0MV0sWzIuNDUxMTM5LDAuMTAwMzc3LDAuMjEzNzY4XSxbMC42MzMxOTksMC4yODY3MTksMC40MDMzNTddLFstMC41MzMwNDIsMC4yNTI0LDEuMzczMjY3XSxbMC45OTMxNywwLjE3MTEwNiwwLjYyNDk2Nl0sWy0wLjEwMDA2MywwLjMwNjQ2NiwyLjE3MDIyNV0sWzEuMjQ1OTQzLDAuMDkyMzUxLDAuNjYxMDMxXSxbMS4zOTA0MTQsMC4xOTg5OTYsLTAuMDg2NF0sWy00LjQ1NzI2NSw1LjAzMDUzMSwyLjEzODI0Ml0sWzIuODk3NzYsMC4xNDY1NzUsMS4yOTc0NjhdLFsxLjgwMjcwMywwLjA4ODgyNCwtMC40OTA0MDVdLFsxLjA1NTQ0NywwLjMwOTI2MSwyLjM5MjQzN10sWzIuMzAwNDM2LDAuMTQyNDI5LDIuMTA0MjU0XSxbMi4zMzM5OSwwLjE4Nzc1NiwyLjQxNjkzNV0sWzIuMzI1MTgzLDAuMTM0MzQ5LDAuNTc0MDYzXSxbMi40MTA5MjQsMC4zNzA5NzEsMi42MzcxMTVdLFsxLjEzMjkyNCwwLjI5MDUxMSwzLjA2MV0sWzEuNzY0MDI4LDAuMDcwMjEyLC0wLjgwNTM1XSxbMi4xNTY5OTQsMC4zOTc2NTcsMi44NDQwNjFdLFswLjkyMDcxMSwwLjIyNTUyNywtMC44ODI0NTZdLFstNC41NTIxMzUsNS4yNDA5NiwyLjg1NTE0XSxbMC4yMTAwMTYsMC4zMDkzOTYsMi4wNjQyOTZdLFswLjYxMjA2NywwLjEzNjgxNSwtMS4wODYwMDJdLFszLjE1MDIzNiwwLjQyNjc1NywxLjgwMjcwM10sWy0wLjI0ODI0LDAuMjgyMjU4LDEuNDcwOTk3XSxbMC45NzQyNjksMC4zMDEzMTEsLTAuNjQwODk4XSxbLTQuNDAxNDEzLDUuMDM5NjYsMi41MzU1NTNdLFswLjY0NDMxOSwwLjI3NDAwNiwtMC44MTc4MDZdLFswLjMzMjkyMiwwLjMwOTA3NywwLjEwODQ3NF0sWzMuNjEwMDAxLDAuMzE3NDQ3LDAuNjg5MzUzXSxbMy4zMzU2ODEsMC4zNTgxOTUsMC4xMTg0NzddLFswLjYyMzU0NCwwLjMxODk4MywtMC40MTkzXSxbLTAuMTEwMTIsMC4zMDc3NDcsMS44MzEzMzFdLFstMC40MDc1MjgsMC4yOTEwNDQsMi4yODI5MzVdLFswLjA2OTc4MywwLjI4NTA5NSwwLjk1MDI4OV0sWzAuOTcwMTM1LDAuMzEwMzkyLC0wLjI4Mzc0Ml0sWzAuODQwNTY0LDAuMzA2ODk4LDAuMDk4ODU0XSxbLTAuNTQxODI3LDAuMjY3NzUzLDEuNjgzNzk1XSxbLTMuOTU2MDgyLDQuNTU3MTMsMi4yOTcxNjRdLFstNC4xNjEwMzYsMi44MzQ0ODEsMS42NDE4M10sWy00LjA5Mzk1Miw0Ljk3NzU1MSwyLjc0Nzc0N10sWzIuNjYxODE5LDAuMjYxODY3LDEuOTI2MTQ1XSxbLTMuNzQ5OTI2LDIuMTYxODc1LDAuODk1MjM4XSxbLTIuNDk3Nzc2LDEuMzYyOSwwLjc5MTg1NV0sWzAuNjkxNDgyLDAuMzA0OTY4LDEuNTgyOTM5XSxbLTQuMDEzMTkzLDQuODMwOTYzLDIuNDc2OV0sWy0zLjYzOTU4NSwyLjA5MTI2NSwxLjMwNDQxNV0sWy0zLjk3NjcsMi41NjMwNTMsMS42Mjg0XSxbLTMuOTc5OTE1LDIuNzg4NjE2LDEuOTc3OTc3XSxbMC4zODg3ODIsMC4zMTI2NTYsMS43MDkxNjhdLFstMy40MDg3MywxLjg3NzMyNCwwLjg1MTY1Ml0sWy0zLjY3MTYzNyw1LjEzNjk3NCwzLjE3MDczNF0sWy0zLjEyOTY0LDEuODUyMDEyLDAuMTU3NjgyXSxbLTMuNjI5Njg3LDQuODUyNjk4LDIuNjg2ODM3XSxbLTMuMTk2MTY0LDEuNzkzNDU5LDAuNDUyODA0XSxbLTMuNzQ2MzM4LDIuMzEzNTcsMS42NDg1NTFdLFsyLjk5MjE5MiwwLjEyNTI1MSwwLjU3NTk3Nl0sWy0zLjI1NDA1MSwwLjA1NDQzMSwwLjMxNDE1Ml0sWy0zLjQ3NDY0NCwxLjkyNTI4OCwxLjEzNDExNl0sWy0zLjQxODM3MiwyLjAyMjg4MiwxLjU3ODkwMV0sWy0yLjkyMDk1NSwxLjcwNTQwMywwLjI5ODQyXSxbLTMuNTcyMjksMi4xNTIwMjIsMS42MDc1NzJdLFstMy4yNTEyNTksMC4wOTAxMywtMC4xMDYxNzRdLFstMy4yOTk5NTIsMS44Nzc3ODEsMS4zNDg2MjNdLFstMy42NjY4MTksMi40NDE0NTksMi4wMDQ4MzhdLFstMi45MTI2NDYsMS44MjQ3NDgsLTAuMDQ1MzQ4XSxbLTMuMzk5NTExLDIuNDc5NDg0LDIuMzQwMzkzXSxbLTMuMDA5NzU0LDAuMDE1Mjg2LDAuMDc1NTY3XSxbLTMuMzgxNDQzLDIuMzE2OTM3LDIuMTU2OTIzXSxbLTMuMzUyODAxLDIuMTMzMzQxLDEuODU3MzY2XSxbLTMuMDE3ODgsMS42ODc2ODUsMC42NDU4NjddLFstMi45MzE4NTcsMS42Nzg3MTIsMS4xNTg0NzJdLFstMy4zMDEwMDgsMC4wODgzNiwwLjU5MTAwMV0sWzEuMzU4MDI1LDAuMTk3OTUsMS41OTkxNDRdLFstMi45OTk1NjUsMS44NDUwMTYsMS42MTgzOTZdLFstMi43Njc5NTcsMC4wMjgzOTcsLTAuMTk2NDM2XSxbLTIuOTM5NjIsMi4wNzg3NzksMi4xNDA1OTNdLFstMy4zNDY2NDgsMi42NzQwNTYsMi41MTgwOTddLFszLjMyNDMyMiwwLjIwODIyLDAuNjI4NjA1XSxbMy4wOTE2NzcsMC4xMzcyMDIsMC45MzQ1XSxbLTIuODgxODA3LDAuMDA5OTUyLDAuMzE4NDM5XSxbLTIuNzY0OTQ2LDEuNzg2NjE5LDEuNjkzNDM5XSxbLTIuOTA1NTQyLDEuOTMyMzQzLDEuOTAwMDAyXSxbLTMuMTQwODU0LDIuMjcxMzg0LDIuMjc0OTQ2XSxbLTIuODg5OTUsMi40ODc4NTYsMi41NzQ3NTldLFstMi4zNjcxOTQsLTAuMDAwOTQzLC0wLjE1NTc2XSxbLTMuMDUwNzM4LDAuMDY4NzAzLDAuNzQyOTg4XSxbLTIuNzU5NTI1LDEuNTU2NzksMC44Nzc3ODJdLFstMy4xNTE3NzUsMi40ODA1NCwyLjQ4Mjc0OV0sWy0yLjU3ODYxOCwtMC4wMDI4ODUsMC4xNjU3MTZdLFstMi42NTE2MTgsMS44NzcyNDYsMS45ODExODldLFstMi45MzM5NzMsMC4xMzM3MzEsMS42MzEwMjNdLFsxLjA0NzYyOCwwLjEwMDI4NCwtMS4wODUyNDhdLFstMS41ODUxMjMsMC4wNjIwODMsLTEuMzk0ODk2XSxbLTIuMjg3OTE3LC0wLjAwMjY3MSwwLjIxNDQzNF0sWy0yLjUyNDg5OSwwLjAwNzQ4MSwwLjQ3MTc4OF0sWy0yLjgxNTQ5MiwyLjE4ODE5OCwyLjM0MzI5NF0sWy0yLjA5NTE0MiwtMC4wMDMxNDksLTAuMDk0NTc0XSxbLTIuMTcyNjg2LC0wLjAwMDEzMywwLjQ3OTYzXSxbLTIuNzMyNzA0LDAuMDc0MzA2LDEuNzQyMDc5XSxbLTIuNDk2NTMsMi4xNDU2NjgsMi40MjY5MV0sWy0xLjM0MzY4MywwLjA0NzcyMSwtMS41MDYzOTFdLFstMi41ODExODUsMC4wNDg3MDMsMC45NzU1MjhdLFstMi45MDUxMDEsMC4wODMxNTgsMi4wMTAwNTJdLFstMi42MDE1MTQsMi4wMDc4MDEsMi4yMjMwODldLFstMi4zMzk0NjQsMC4wMjYzNCwxLjQ4NDMwNF0sWy0yLjkwNzg3MywwLjEwMzY3LDIuMzc4MTQ5XSxbLTEuMzY4Nzk2LDAuMDYyNTE2LC0xLjA0OTEyNV0sWy0xLjkzMjQ0LDAuMDI0NDMsLTAuNDI3NjAzXSxbLTIuNzA1MDgxLDAuMDYwNTEzLDIuMzAzODAyXSxbMy4zNzIxNTUsMC4yMDYyNzQsMC44OTIyOTNdLFstMS43NjE4MjcsMC4wOTMyMDIsLTEuMDM3NDA0XSxbLTEuNzAwNjY3LDAuMDM5NywtMC42MTQyMjFdLFstMS44NzIyOTEsMC4wMTE5NzksLTAuMTM1NzUzXSxbLTEuOTI5MjU3LDAuMDc0MDA1LDAuNzI4OTk5XSxbLTIuNTIwMTI4LDAuMDQ5NjY1LDEuOTkwNTRdLFstMi42OTk0MTEsMC4xMDA5MiwyLjYwMzExNl0sWzMuMjExNzAxLDAuMjczMDIsMS40MjMzNTddLFstMS40NDUzNjIsMC4xMzcxLC0wLjYyNjQ5MV0sWzIuOTIxMzMyLDAuMjU5MTEyLDEuNjQ1NTI1XSxbLTAuOTkzMjQyLDAuMDU4Njg2LC0xLjQwODkxNl0sWy0wLjk0NDk4NiwwLjE1NzU0MSwtMS4wOTc2NjVdLFstMi4xNTQzMDEsMC4wMzI3NDksMS44ODIwMDFdLFstMi4xMDg3ODksMS45ODg1NTcsMi40NDI2NzNdLFstMS4wMTU2NTksMC4yNTQ5NywtMC40MTY2NjVdLFstMS44OTg0MTEsMC4wMTU4NzIsMC4xNjcxNV0sWy0xLjU4NTUxNywwLjAyNzEyMSwwLjQ1MzQ0NV0sWy0yLjMxMTEwNSwwLjA2MTI2NCwyLjMyNzA2MV0sWy0yLjYzNzA0MiwwLjE1MjIyNCwyLjgzMjIwMV0sWy0yLjA4NzUxNSwyLjI5Mjk3MiwyLjYxNzU4NV0sWy0wLjc1MDYxMSwwLjA1NjY5NywtMS41MDQ1MTZdLFstMC40NzIwMjksMC4wNzU2NTQsLTEuMzYwMjAzXSxbLTAuNzEwNzk4LDAuMTM5MjQ0LC0xLjE4Mzg2M10sWy0wLjk3NzU1LDAuMjYwNTIsLTAuODMxMTY3XSxbLTAuNjU1ODE0LDAuMjYwODQzLC0wLjg4MDA2OF0sWy0wLjg5NzUxMywwLjI3NTUzNywtMC4xMzMwNDJdLFstMi4wNDkxOTQsMC4wODQ5NDcsMi40NTU0MjJdLFstMC4xNzc4MzcsMC4wNzYzNjIsLTEuNDQ5MDA5XSxbLTAuNTUzMzkzLDAuMjc5MDgzLC0wLjU5NTczXSxbLTEuNzg4NjM2LDAuMDYxNjMsMi4yMzExOThdLFstMC4zNDc2MSwwLjI1NTU3OCwtMC45OTk2MTRdLFstMS4zOTg1ODksMC4wMzY0ODIsMC42NTg3MV0sWy0xLjEzMzkxOCwwLjA1NjE3LDAuNjk0NzNdLFstMS40MzM2OSwwLjA1ODIyNiwxLjk3Nzg2NV0sWy0yLjUwNTQ1OSwxLjQ5MjI2NiwxLjE5Mjk1XV1cbmV4cG9ydHMuY2VsbHM9W1syLDE2NjEsM10sWzE2NzYsNyw2XSxbNzEyLDE2OTQsOV0sWzMsMTY3NCwxNjYyXSxbMTEsMTY3MiwwXSxbMTcwNSwwLDFdLFs1LDYsMTY3NF0sWzQsNSwxNjc0XSxbNyw4LDcxMl0sWzIsMTY2MiwxMF0sWzEsMTAsMTcwNV0sWzExLDE2OTAsMTY3Ml0sWzE3MDUsMTEsMF0sWzUsMTY3Niw2XSxbNyw5LDZdLFs3LDcxMiw5XSxbMiwzLDE2NjJdLFszLDQsMTY3NF0sWzEsMiwxMF0sWzEyLDgyLDE4MzddLFsxODA4LDEyLDE3OTldLFsxODA4LDE3OTksMTc5Nl0sWzEyLDg2MSw4Ml0sWzg2MSwxODA4LDEzXSxbMTgwOCw4NjEsMTJdLFsxNzk5LDEyLDE4MTZdLFsxNjgwLDE0LDE0NDRdLFsxNSwxNywxNl0sWzE0LDE2NzgsMTcwMF0sWzE2LDE3LDE2NzldLFsxNSwxNjYwLDE3XSxbMTQsMTA4NCwxNjc4XSxbMTUsMTcwOCwxOF0sWzE1LDE4LDE2NjBdLFsxNjgwLDEwODQsMTRdLFsxNjgwLDE1LDEwODRdLFsxNSwxNjgwLDE3MDhdLFs3OTMsODEzLDExOV0sWzEwNzYsNzkzLDExOV0sWzEwNzYsMTgzNiwyMl0sWzIzLDE5LDIwXSxbMjEsMTA3NiwyMl0sWzIxLDIyLDIzXSxbMjMsMjAsMjFdLFsxMDc2LDExOSwxODM2XSxbODA2LDYzNCw0NzBdLFs0MzIsMTM0OSw4MDZdLFsyNTEsNDIsMTI1XSxbODA5LDExNzEsNzkxXSxbOTUzLDYzMSw4MjddLFs2MzQsMTIxMCwxMTc2XSxbMTU3LDE4MzIsMTgzNF0sWzU2LDIxOSw1M10sWzEyNiwzOCw4M10sWzM3LDg1LDQzXSxbNTksMTE1MSwxMTU0XSxbODMsNzUsNDFdLFs3Nyw4NSwxMzhdLFsyMDEsOTQ4LDQ2XSxbMTM2MiwzNiwzN10sWzQ1Miw3NzUsODg1XSxbMTIzNyw5NSwxMDRdLFs5NjYsOTYzLDEyNjJdLFs4NSw3Nyw0M10sWzM2LDg1LDM3XSxbMTAxOCw0MzksMTAxOV0sWzQxLDIyNSw0ODFdLFs4NSw4MywxMjddLFs5Myw4Myw0MV0sWzkzNSw5NzIsOTYyXSxbMTE2LDkzLDEwMF0sWzk4LDgyLDgxM10sWzQxLDc1LDIyNV0sWzI5OCw3NTEsNTRdLFsxMDIxLDQxNSwxMDE4XSxbNzcsMTM4LDEyOF0sWzc2Niw4MjMsMTM0N10sWzU5MywxMjEsNTczXSxbOTA1LDg4NSw2NjddLFs3ODYsNzQ0LDc0N10sWzEwMCw0MSwxMDddLFs2MDQsMzM0LDc2NV0sWzc3OSw0NTAsODI1XSxbOTY4LDk2Miw5NjldLFsyMjUsMzY1LDQ4MV0sWzM2NSwyODMsMTk2XSxbMTYxLDE2MCwzMDNdLFs4NzUsMzk5LDE1OF0sWzMyOCwxODE3LDk1NF0sWzYyLDYxLDEwNzldLFszNTgsODEsNzJdLFs3NCwyMTEsMTMzXSxbMTYwLDE2MSwxMzhdLFs5MSw2MiwxMDc5XSxbMTY3LDU2LDE0MDVdLFs1NiwxNjcsMjE5XSxbOTEzLDkxNCw0OF0sWzM0NCw1NywxMDJdLFs0Myw3NywxMjhdLFsxMDc1LDk3LDEwNzldLFszODksODgyLDg4N10sWzIxOSwxMDgsNTNdLFsxMjQyLDg1OSwxMjBdLFs2MDQsODQwLDYxOF0sWzc1NCw4Nyw3NjJdLFsxOTcsMzYsMTM2Ml0sWzE0MzksODgsMTIwMF0sWzE2NTIsMzA0LDg5XSxbODEsNDQsOTQwXSxbNDQ1LDQ2MywxNTFdLFs3MTcsNTIwLDkyXSxbMTI5LDExNiwxMDBdLFsxNjY2LDE4MTEsNjI0XSxbMTA3OSw5Nyw5MV0sWzYyLDkxLDcxXSxbNjg4LDg5OCw1MjZdLFs0NjMsNzQsMTMzXSxbMjc4LDgyNiw5OV0sWzk2MSwzNzIsNDJdLFs3OTksOTQsMTAwN10sWzEwMCw5Myw0MV0sWzEzMTQsOTQzLDEzMDFdLFsxODQsMjMwLDEwOV0sWzg3NSwxMTk1LDIzMV0sWzEzMywxNzYsMTg5XSxbNzUxLDc1NSw4MjZdLFsxMDEsMTAyLDU3XSxbMTE5OCw1MTMsMTE3XSxbNzQ4LDUxOCw5N10sWzExNDUsMTQ4NCwxMzA0XSxbMzU4LDY1OCw4MV0sWzk3MSw2NzIsOTkzXSxbNDQ1LDE1MSw0NTZdLFsyNTIsNjIxLDEyMl0sWzM2LDI3MSwxMjZdLFs4NSwzNiwxMjZdLFsxMTYsODMsOTNdLFsxNDEsMTcxLDE3NDddLFsxMDgxLDg4MywxMDNdLFsxMzk4LDE0NTQsMTQ5XSxbNDU3LDEyMSw1OTNdLFsxMjcsMTE2LDMwM10sWzY5Nyw3MCw4OTFdLFs0NTcsODkxLDE2NTJdLFsxMDU4LDE2NjgsMTEyXSxbNTE4LDEzMCw5N10sWzIxNCwzMTksMTMxXSxbMTg1LDE0NTEsMTQ0OV0sWzQ2MywxMzMsNTE2XSxbMTQyOCwxMjMsMTc3XSxbMTEzLDg2Miw1NjFdLFsyMTUsMjQ4LDEzNl0sWzE4Niw0MiwyNTFdLFsxMjcsODMsMTE2XSxbMTYwLDg1LDEyN10sWzE2MiwxMjksMTQwXSxbMTU0LDE2OSwxMDgwXSxbMTY5LDE3MCwxMDgwXSxbMjEwLDE3NCwxNjZdLFsxNTI5LDE0OTIsMTUyNF0sWzQ1MCw4NzUsMjMxXSxbMzk5LDg3NSw0NTBdLFsxNzEsMTQxLDE3MF0sWzExMywxMTU1LDQ1Ml0sWzEzMSwzMTksMzYwXSxbNDQsMTc1LDkwNF0sWzQ1Miw4NzIsMTEzXSxbNzQ2LDc1NCw0MDddLFsxNDcsMTQ5LDE1MF0sWzMwOSwzOTAsMTE0OF0sWzUzLDE4NiwyODNdLFs3NTcsMTU4LDc5N10sWzMwMywxMjksMTYyXSxbNDI5LDMwMywxNjJdLFsxNTQsMTY4LDE2OV0sWzY3MywxNjQsMTkzXSxbMzgsMjcxLDc1XSxbMzIwLDI4OCwxMDIyXSxbMjQ2LDQ3NiwxNzNdLFsxNzUsNTQ4LDkwNF0sWzE4Miw3MjgsNDU2XSxbMTk5LDE3MCwxNjldLFsxNjgsMTk5LDE2OV0sWzE5OSwxNzEsMTcwXSxbMTg0LDIzOCwyMzBdLFsyNDYsMjQ3LDE4MF0sWzE0OTYsMTQ4MywxNDY3XSxbMTQ3LDE1MCwxNDhdLFs4MjgsNDcyLDQ0NV0sWzUzLDEwOCwxODZdLFs1Niw1MywyNzFdLFsxODYsOTYxLDQyXSxbMTM0MiwzOTEsNTddLFsxNjY0LDE1NywxODM0XSxbMTA3MCwyMDQsMTc4XSxbMTc4LDIwNCwxNzldLFsyODUsMjE1LDI5NV0sWzY5Miw1NSwzNjBdLFsxOTIsMTkzLDI4Nl0sWzM1OSw2NzMsMjA5XSxbNTg2LDE5NSw2NTNdLFsxMjEsODksNTczXSxbMjAyLDE3MSwxOTldLFsyMzgsNTE1LDMxMV0sWzE3NCwyMTAsMjQwXSxbMTc0LDEwNSwxNjZdLFs3MTcsMjc2LDU5NV0sWzExNTUsMTE0OSw0NTJdLFsxNDA1LDU2LDE5N10sWzUzLDI4MywzMF0sWzc1LDUzLDMwXSxbNDUsMjM1LDE2NTFdLFsyMTAsMTY2LDQ5MF0sWzE4MSwxOTMsMTkyXSxbMTg1LDYyMCwyMTddLFsyNiw3OTgsNzU5XSxbMTA3MCwyMjYsMjA0XSxbMjIwLDE4NywxNzldLFsyMjAsMTY4LDE4N10sWzIwMiwyMjIsMTcxXSxbMzU5LDIwOSwxODFdLFsxODIsNDU2LDczNl0sWzk2NCwxNjcsMTQwNV0sWzc2LDI1MCw0MTRdLFs4MDcsMTI4MCwxODMzXSxbNzAsODgzLDE2NTJdLFsyMjcsMTc5LDIwNF0sWzIyMSwxOTksMTY4XSxbMjIxLDIwMiwxOTldLFszNjAsNDk0LDEzMV0sWzIxNCwyNDEsMzE5XSxbMTA1LDI0NywxNjZdLFsyMDUsMjAzLDI2MF0sWzM4OCw0ODAsOTM5XSxbNDgyLDg1NSwyMTFdLFs4LDgwNywxODMzXSxbMjI2LDI1NSwyMDRdLFsyMjgsMjIxLDE2OF0sWzE2NiwxNzMsNDkwXSxbNzAxLDM2OSw3MDJdLFsyMTEsODU1LDI2Ml0sWzYzMSw5MjAsNjMwXSxbMTQ0OCwxMTQ3LDE1ODRdLFsyNTUsMjI3LDIwNF0sWzIzNywyMjAsMTc5XSxbMjI4LDE2OCwyMjBdLFsyMjIsMjU2LDU1NV0sWzIxNSwyNTksMjc5XSxbMTI2LDI3MSwzOF0sWzEwOCw1MCwxODZdLFsyMjcsMjM2LDE3OV0sWzIzNiwyMzcsMTc5XSxbMjIwLDIzNywyMjhdLFsyMjgsMjAyLDIyMV0sWzI1NiwyMjIsMjAyXSxbNTU1LDI1NiwyMjldLFsyNTksMTUyLDI3OV0sWzI3LDEyOTYsMzFdLFsxODYsNTAsOTYxXSxbOTYxLDIzNCwzNzJdLFsxNjUxLDIzNSw4MTJdLFsxNTcyLDExNDcsMTQ0OF0sWzI1NSwyMjYsMTc3OF0sWzI1NSwyMzYsMjI3XSxbMjU2LDI1NywyMjldLFsxMDYsMTg0LDEwOV0sWzI0MSw0MTAsMTg4XSxbMTc3LDU3OCw2MjBdLFsyMDksNjczLDE4MV0sWzExMzYsMTQ1Nyw3OV0sWzE1MDcsMjQ1LDcxOF0sWzI1NSwyNzMsMjM2XSxbMjc1LDQxMCwyNDFdLFsyMDYsODUxLDI1MF0sWzE0NTksMjUzLDE1OTVdLFsxNDA2LDY3NywxNjUwXSxbMjI4LDI3NCwyMDJdLFsyMDIsMjgxLDI1Nl0sWzM0OCwyMzksNDk2XSxbMjA1LDE3MiwyMDNdLFszNjksMjQ4LDcwMl0sWzI2MSw1NTAsMjE4XSxbMjYxLDQ2NSw1NTBdLFs1NzQsMjQzLDU2Nl0sWzkyMSw5MDAsMTIyMF0sWzI5MSwyNzMsMjU1XSxbMzQ4LDIzOCwyNjVdLFsxMDksMjMwLDE5NF0sWzE0OSwzODAsMzIzXSxbNDQzLDI3MCw0MjFdLFsyNzIsMjkxLDI1NV0sWzI3NCwyMjgsMjM3XSxbMjc0LDI5MiwyMDJdLFsyODEsMjU3LDI1Nl0sWzI3Niw1NDMsMzQxXSxbMTUyLDI1OSwyNzVdLFsxMTExLDgzMSwyNDldLFs2MzIsNTU2LDM2NF0sWzI5OSwyNzMsMjkxXSxbMjk5LDIzNiwyNzNdLFsyODAsMjM3LDIzNl0sWzIwMiwyOTIsMjgxXSxbMjQ3LDI0NiwxNzNdLFsyODIsNDksNjZdLFsxNjIwLDEyMzMsMTU1M10sWzI5OSwyODAsMjM2XSxbMjgwLDMwNSwyMzddLFsyMzcsMzA1LDI3NF0sWzMwNiwyOTIsMjc0XSxbMzMwLDI1NywyODFdLFsyNDYsMTk0LDI2NF0sWzE2NiwyNDcsMTczXSxbOTEyLDg5NCw4OTZdLFs2MTEsMzIwLDI0NF0sWzExNTQsMTAyMCw5MDddLFs5NjksOTYyLDI5MF0sWzI3MiwyOTksMjkxXSxbMzA1LDMxOCwyNzRdLFsxNDUsMjEyLDI0MF0sWzE2NCwyNDgsMjg1XSxbMjU5LDI3NywyNzVdLFsxOTMsMTY0LDI5NV0sWzI2OSwyNDAsMjEwXSxbMTAzMywyODgsMzIwXSxbNDYsOTQ4LDIwNl0sWzMzNiwyODAsMjk5XSxbMzMwLDI4MSwyOTJdLFsyNTcsMzA3LDMwMF0sWzM2OSwxMzYsMjQ4XSxbMTQ1LDI0MCwyNjldLFs1MDIsODQsNDY1XSxbMTkzLDI5NSwyODZdLFsxNjQsMjg1LDI5NV0sWzI4MiwzMDIsNDldLFsxNjEsMzAzLDQyOV0sWzMxOCwzMDYsMjc0XSxbMzA2LDMzMCwyOTJdLFszMTUsMjU3LDMzMF0sWzMxNSwzMDcsMjU3XSxbMzA3LDM1MiwzMDBdLFszMDAsMzUyLDMwOF0sWzI3NSwyNzcsNDAzXSxbMzUzLDExNDEsMzMzXSxbMTQyMCw0MjUsNDddLFs2MTEsMzEzLDMyMF0sWzg1LDEyNiw4M10sWzEyOCwxMTgwLDQzXSxbMzAzLDExNiwxMjldLFsyODAsMzE0LDMwNV0sWzMxNCwzMTgsMzA1XSxbMTkwLDE4MSwyNDJdLFsyMDMsMjE0LDEzMV0sWzgyMCw3OTUsODE1XSxbMzIyLDI5OSwyNzJdLFszMjIsMzM2LDI5OV0sWzMxNSwzMzksMzA3XSxbMTcyLDE1Miw2MTddLFsxNzIsMjE0LDIwM10sWzMyMSwxMDMzLDMyMF0sWzE0MDEsOTQxLDk0Nl0sWzg1LDE2MCwxMzhdLFs5NzYsNDU0LDk1MV0sWzc0Nyw2MCw3ODZdLFszMTcsMzIyLDI3Ml0sWzMzOSwzNTIsMzA3XSxbMjY2LDMzLDg2N10sWzE2MywyMjQsMjE4XSxbMjQ3LDYxNCwxODBdLFs2NDgsNjM5LDU1M10sWzM4OCwxNzIsMjA1XSxbNjExLDM0NSwzMTNdLFszMTMsMzQ1LDMyMF0sWzE2MCwxMjcsMzAzXSxbNDU0LDY3Miw5NTFdLFszMTcsMzI5LDMyMl0sWzMxNCwyODAsMzM2XSxbMzA2LDMzOCwzMzBdLFszMzAsMzM5LDMxNV0sWzEyMzYsMTE1LDQzNl0sWzM0MiwzMjEsMzIwXSxbMTA0NiwzNTUsMzI4XSxbMzI4LDM0NiwzMjVdLFszMjUsMzQ2LDMxN10sWzM2NywzMTQsMzM2XSxbMzE0LDMzNywzMThdLFszMzcsMzA2LDMxOF0sWzMzOCwzNDMsMzMwXSxbMzQyLDMyMCwzNDVdLFszNTUsMzQ5LDMyOF0sWzM0NiwzMjksMzE3XSxbMzQ3LDMzNiwzMjJdLFszMTQsMzYyLDMzN10sWzMzMCwzNDMsMzM5XSxbMzQwLDMwOCwzNTJdLFsxMzUsOTA2LDEwMjJdLFsyMzksMTU2LDQ5MV0sWzE5NCwyMzAsNDg2XSxbNDAsMTAxNSwxMDAzXSxbMzIxLDM1NSwxMDQ2XSxbMzI5LDM4MiwzMjJdLFszODIsMzQ3LDMyMl0sWzM0NywzNjcsMzM2XSxbMzM3LDM3MSwzMDZdLFszMDYsMzcxLDMzOF0sWzE2ODEsMjk2LDE0OTNdLFsyODYsMTcyLDM4OF0sWzIzMCwzNDgsNDg2XSxbMzQ4LDE4Myw0ODZdLFszODQsMzMyLDgzMF0sWzMyOCwzNDksMzQ2XSxbMzY3LDM2MiwzMTRdLFszNzEsMzQzLDMzOF0sWzMzOSwzNTEsMzUyXSxbNTcsMzQ0LDc4XSxbMzQyLDM1NSwzMjFdLFszODYsMzQ2LDM0OV0sWzM4NiwzNTAsMzQ2XSxbMzQ2LDM1MCwzMjldLFszNDcsMzY2LDM2N10sWzM0MywzNjMsMzM5XSxbMzIzLDM4MCwzMjRdLFsxNTIsMjc1LDI0MV0sWzM0NSwxMDQ1LDM0Ml0sWzM1MCwzNzQsMzI5XSxbMzM5LDM2MywzNTFdLFsyMzQsMzQwLDM1Ml0sWzM1MywzNjEsMzU0XSxbNDAsMzQsMTAxNV0sWzM3MywzNTUsMzQyXSxbMzczLDM0OSwzNTVdLFszNzQsMzgyLDMyOV0sWzM2NiwzNDcsMzgyXSxbMzcxLDM2MywzNDNdLFszNTEsMzc5LDM1Ml0sWzM3OSwzNzIsMzUyXSxbMzcyLDIzNCwzNTJdLFsxNTYsMTkwLDQ5MV0sWzMxOSwyNDEsNjkyXSxbMzU0LDM2MSwzMV0sWzM2NiwzNzcsMzY3XSxbMzYzLDM3OSwzNTFdLFsxMzMsNTkwLDUxNl0sWzE5Nyw1NiwyNzFdLFsxMDQ1LDM3MCwzNDJdLFszNzAsMzczLDM0Ml0sWzM3NCwzNTAsMzg2XSxbMzc3LDM2NiwzODJdLFszNjcsMzk1LDM2Ml0sWzQwMCwzMzcsMzYyXSxbNDAwLDM3MSwzMzddLFszNzgsMzYzLDM3MV0sWzEwNiwxMDksNjE0XSxbMTgxLDY3MywxOTNdLFs5NTMsOTIwLDYzMV0sWzM3NiwzNDksMzczXSxbMzc2LDM4NiwzNDldLFszNzgsMzc5LDM2M10sWzIyNCwzNzUsMjE4XSxbMjc5LDE1MiwxNzJdLFszNjEsNjE5LDM4MV0sWzEzNDcsODIzLDc5NV0sWzc2MCw4NTcsMzg0XSxbMzkyLDM3NCwzODZdLFszOTQsMzk1LDM2N10sWzM4MywzNzEsNDAwXSxbMzgzLDM3OCwzNzFdLFsyMTgsMzc1LDI2MV0sWzE5NywyNzEsMzZdLFs0MTQsNDU0LDk3Nl0sWzM4NSwzNzYsMzczXSxbMTA1MSwzODIsMzc0XSxbMzg3LDM5NCwzNjddLFszNzcsMzg3LDM2N10sWzM5NSw0MDAsMzYyXSxbMjc5LDE3MiwyOTVdLFszMCwzNjUsMjI1XSxbNDUwLDIzMSw4MjVdLFszODUsMzczLDM3MF0sWzM5OCwzNzQsMzkyXSxbMTA1MSwzNzcsMzgyXSxbMzk2LDM3OCwzODNdLFszNDgsNDk2LDE4M10sWzI5NSwxNzIsMjg2XSxbMzU3LDI2OSw0OTVdLFsxMTQ4LDM5MCwxNDExXSxbNzUsMzAsMjI1XSxbMjA2LDc2LDU0XSxbNDEyLDM4NiwzNzZdLFs0MTIsMzkyLDM4Nl0sWzM5NiwzODMsNDAwXSxbNjUxLDExNCw4NzhdLFsxMjMsMTI0MSw1MDZdLFsyMzgsMzExLDI2NV0sWzM4MSw2NTMsMjldLFs2MTgsODE1LDMzNF0sWzQyNywxMDMyLDQxMV0sWzI5OCw0MTQsOTc2XSxbNzkxLDMzMiwzODRdLFsxMjksMTAwLDE0MF0sWzQxMiw0MDQsMzkyXSxbMzkyLDQwNCwzOThdLFsxNDAsMTA3LDM2MF0sWzM5NSwzOTQsNDAwXSxbNDIzLDM3OSwzNzhdLFszODUsNDEyLDM3Nl0sWzQwNiw5NCw1OF0sWzQxOSw0MTUsMTAyMV0sWzQyMiw0MjMsMzc4XSxbNDIzLDEyNSwzNzldLFsyNTgsNTA4LDIzOF0sWzMxMSwxNTYsMjY1XSxbMjEzLDI4Nyw0OTFdLFs0NDksNDExLDEwMjRdLFs0MTIsMTA2OCw0MDRdLFs1NSwxNDAsMzYwXSxbNzYsNDE0LDU0XSxbMzk0LDQxNiw0MDBdLFs0MDAsNDE2LDM5Nl0sWzQyMiwzNzgsMzk2XSxbMTI1OCw3OTYsNzg5XSxbNDI3LDQxMSw0NDldLFs0MjcsMjk3LDEwMzJdLFsxMzg1LDEzNjYsNDgzXSxbNDE3LDQ0OCwyODRdLFsxNTA3LDM0MSwyNDVdLFsxNjIsMTQwLDQ0NF0sWzY1OCw0NCw4MV0sWzQzMywxMjUsNDIzXSxbNDM4LDI1MSwxMjVdLFs0MjksMTYyLDQzOV0sWzEzNDIsNTcsMTM0OF0sWzc2NSw3NjYsNDQyXSxbNjk3LDg5MSw2OTVdLFsxMDU3LDM5Niw0MTZdLFs0NDAsNDIzLDQyMl0sWzQ0MCw0MzMsNDIzXSxbNDMzLDQzOCwxMjVdLFs0MzgsMTk2LDI1MV0sWzc0LDQ4MiwyMTFdLFsxMTM2LDc5LDE0NF0sWzI5LDE5NSw0MjRdLFsyNDIsMTAwNCw0OTJdLFs1Nyw3NTcsMjhdLFs0MTQsMjk4LDU0XSxbMjM4LDM0OCwyMzBdLFsyMjQsMTYzLDEyNF0sWzI5NSwyMTUsMjc5XSxbNDk1LDI2OSw0OTBdLFs0NDksNDQ2LDQyN10sWzQ0NiwyOTcsNDI3XSxbMTAyMCwxMTYzLDkwOV0sWzEyOCwxMzgsNDE5XSxbNjYsOTgwLDQ0M10sWzQxNSw0MzksMTAxOF0sWzExMSwzOTYsMTA1N10sWzExMSw0MjIsMzk2XSxbODQwLDI0OSw4MzFdLFs1OTMsNjY0LDU5Nl0sWzIxOCw1NTAsMTU1XSxbMTA5LDE5NCwxODBdLFs0ODMsMjY4LDg1NV0sWzE2MSw0MTUsNDE5XSxbMTczNywyMzIsNDI4XSxbMzYwLDEwNyw0OTRdLFsxMDA2LDEwMTEsNDEwXSxbNDQ0LDE0MCw1NV0sWzkxOSw4NDMsNDMwXSxbMTkwLDI0MiwyMTNdLFsyNzUsNDAzLDQxMF0sWzEzMSw0OTQsNDg4XSxbNDQ5LDY2Myw0NDZdLFsxMzgsMTYxLDQxOV0sWzEyOCw0MTksMzRdLFs0MzksMTYyLDQ0NF0sWzQ2MCw0NDAsNDIyXSxbNDQwLDQzOCw0MzNdLFs0NzIsNzQsNDQ1XSxbNDkxLDE5MCwyMTNdLFsyMzgsNTA4LDUxNV0sWzQ2LDIwNiw1NF0sWzk3Miw5NDQsOTYyXSxbMTI0MSwxNDI4LDEyODRdLFsxMTEsNDYwLDQyMl0sWzQ3MCw0MzIsODA2XSxbMjQ4LDE2NCw3MDJdLFsxMDI1LDQ2Nyw0NTNdLFs1NTMsMTIzNSw2NDhdLFsyNjMsMTE0LDg4MV0sWzI2NywyOTMsODk2XSxbNDY5LDQzOCw0NDBdLFs0NTUsMTk2LDQzOF0sWzI4NywyNDIsNDkyXSxbMjM5LDI2NSwxNTZdLFsyMTMsMjQyLDI4N10sWzE2ODQsNzQ2LDYzXSxbNjYzLDQ3NCw0NDZdLFs0MTUsMTYxLDQyOV0sWzE0MCwxMDAsMTA3XSxbMTA1NSw0NTksNDY3XSxbNDY5LDQ1NSw0MzhdLFsyNTksNTQyLDI3N10sWzQ0Niw0NzQsNDY2XSxbNDQ2LDQ2Niw0NDddLFs0MzksNDQ0LDEwMTldLFs2MTQsMTA5LDE4MF0sWzE5MCwzNTksMTgxXSxbMTU2LDQ5NywxOTBdLFs3MjYsNDc0LDY2M10sWzEwMjMsNDU4LDQ1OV0sWzQ2MSw0NDAsNDYwXSxbMjY5LDIxMCw0OTBdLFsyNDYsMTgwLDE5NF0sWzU5MCwxMzMsMTg5XSxbMTYzLDIxOCwxNTVdLFs0NjcsNDY4LDQ1M10sWzEwNjMsMTAyOSwxMTFdLFsxMTEsMTAyOSw0NjBdLFsxMDI5LDQ2NCw0NjBdLFs0NjEsNDY5LDQ0MF0sWzE1MCwxNDksMzIzXSxbODI4LDQ0NSw0NTZdLFszNzUsNTAyLDI2MV0sWzQ3NCw0NzUsNDY2XSxbNTczLDQyNiw0NjJdLFs0NzgsMTAyMyw0NzddLFs0NzgsNDU4LDEwMjNdLFs0NTgsNDc5LDQ2N10sWzQ1OSw0NTgsNDY3XSxbNDY4LDM5Myw0NTNdLFs0NjQsNDYxLDQ2MF0sWzQ4NCwzNjUsNDU1XSxbMTIzMiwxODIsMTM4MF0sWzE3Miw2MTcsMjE0XSxbNTQ3LDY5NCwyNzddLFs1NDIsNTQ3LDI3N10sWzE4NCwyNTgsMjM4XSxbMjYxLDUwMiw0NjVdLFs0NjcsNDc5LDQ2OF0sWzQ4NCw0NTUsNDY5XSxbMTM4MCwxODIsODY0XSxbNDc1LDQ3Niw0NjZdLFs4MCw0NDcsNDc2XSxbNDY2LDQ3Niw0NDddLFs0MTUsNDI5LDQzOV0sWzQ3OSw0ODcsNDY4XSxbNDg3LDI4Nyw0NjhdLFs0OTIsMzkzLDQ2OF0sWzI2MCw0NjksNDYxXSxbNDgxLDM2NSw0ODRdLFs1MzEsNDczLDkzMV0sWzY5MiwzNjAsMzE5XSxbNzI2LDQ5NSw0NzRdLFs0NjgsMjg3LDQ5Ml0sWzQ4MCw0NjQsMTAyOV0sWzI2MCw0NjEsNDY0XSxbNDk0LDQ4MSw0ODRdLFs3NCw0NzIsNDgyXSxbMTc0LDI0MCwyMTJdLFsyMjMsMTA2LDYxNF0sWzQ4Niw0NzcsNDg1XSxbNDc4LDQ5Niw0NThdLFs0OTEsNDg3LDQ3OV0sWzEyMyw0MDIsMTc3XSxbNDg4LDQ2OSwyNjBdLFs0ODgsNDg0LDQ2OV0sWzI2NSwyMzksMzQ4XSxbMjQ4LDIxNSwyODVdLFs0NzQsNDkwLDQ3NV0sWzQ3Nyw0ODYsNDc4XSxbNDU4LDQ5Niw0NzldLFsyMzksNDkxLDQ3OV0sWzE1ODQsMTE0NywxMzM0XSxbNDg4LDQ5NCw0ODRdLFs0MDEsMTIzLDUwNl0sWzQ5NSw0OTAsNDc0XSxbNDkwLDE3Myw0NzVdLFs4MCw0NzYsMjY0XSxbNDkxLDI4Nyw0ODddLFs0ODAsMTAyOSwxMDA0XSxbNDgwLDIwNSw0NjRdLFsxNzMsNDc2LDQ3NV0sWzQ4NSwxOTQsNDg2XSxbNDg2LDE4Myw0NzhdLFs0NzgsMTgzLDQ5Nl0sWzQ5NiwyMzksNDc5XSxbODQ4LDExNjYsNjBdLFsyNjgsMjYyLDg1NV0sWzIwNSwyNjAsNDY0XSxbMjYwLDIwMyw0ODhdLFsyMDMsMTMxLDQ4OF0sWzI0NiwyNjQsNDc2XSxbMTk0LDQ4NSwyNjRdLFsxMDAyLDMxMCwxNjY0XSxbMzExLDUxNSw0OTddLFs1MTUsMzU5LDQ5N10sWzU2NSwzNTksNTE1XSxbMTI1MCwxMjM2LDMwMV0sWzczNiw0NTYsMTUxXSxbNjU0LDE3NCw1NjddLFs1NzcsNTM0LDY0OF0sWzUxOSw1MDUsNjQ1XSxbNzI1LDU2NSw1MDhdLFsxNTAsMTcyMywxNDhdLFs1ODQsNTAyLDUwNV0sWzU4NCw1MjYsNTAyXSxbNTAyLDUyNiw4NF0sWzYwNywxOTEsNjgyXSxbNTYwLDQ5OSw2NjBdLFs2MDcsNTE3LDE5MV0sWzEwMzgsNzExLDEyNF0sWzk1MSw2NzIsOTcxXSxbNzE2LDUwNywzNTZdLFs4NjgsNTEzLDExOThdLFs2MTUsNzk0LDYwOF0sWzY4MiwxOTEsMTc0XSxbMTMxMyw5MjgsMTIxMV0sWzYxNywyNDEsMjE0XSxbNTExLDcxLDkxXSxbNDA4LDgwMCw3OTJdLFsxOTIsMjg2LDUyNV0sWzgwLDQ4NSw0NDddLFs5MSw5NywxMzBdLFsxNjc1LDMyNCw4ODhdLFsyMDcsNzU2LDUzMl0sWzU4MiwxMDk3LDExMjRdLFszMTEsNDk3LDE1Nl0sWzUxMCwxMzAsMTQ2XSxbNTIzLDUxMSw1MTBdLFs2MDgsNzA4LDYxNl0sWzU0Niw2OTAsNjUwXSxbNTExLDUyNywzNThdLFs1MzYsMTQ2LDUxOF0sWzQ2NSw0MTgsNTUwXSxbNDE4LDcwOSw3MzVdLFs1MjAsNTE0LDUwMF0sWzU4NCw1MDUsNTE5XSxbNTM2LDUxOCw1MDldLFsxNDYsNTM2LDUxMF0sWzUzOCw1MjcsNTExXSxbODc2LDI2Myw2NjldLFs2NDYsNTI0LDYwNV0sWzUxMCw1MzYsNTIzXSxbNTI3LDE3NSwzNThdLFs3MjQsODc2LDY2OV0sWzcyMSw3MjQsNjc0XSxbNTI0LDY4Myw4MzRdLFs1NTgsNTA5LDUyMl0sWzU1OCw1MzYsNTA5XSxbNTIzLDUzOCw1MTFdLFs2MTEsMjQzLDU3NF0sWzUyOCw3MDYsNTU2XSxbNjY4LDU0MSw0OThdLFs1MjMsNTM3LDUzOF0sWzUyNyw1NDAsMTc1XSxbNTMyLDc1Niw1MzNdLFsxMDEzLDYwLDc0N10sWzU1MSw2OTgsNjk5XSxbOTIsNTIwLDUwMF0sWzUzNSw1MzYsNTU4XSxbNTM2LDU2OSw1MjNdLFs1MzgsNTQwLDUyN10sWzUzOSw1NDgsMTc1XSxbNTY3LDIxMiwxNDVdLFs0MDEsODk2LDI5M10sWzUzNCw2NzUsNjM5XSxbMTUxMCw1OTUsMTUwN10sWzU1Nyw1NDUsNTMwXSxbNTY5LDUzNiw1MzVdLFs1MzcsNTQwLDUzOF0sWzU0MCw1MzksMTc1XSxbNTY5LDUzNyw1MjNdLFsxMTM1LDcxOCw0N10sWzU4Nyw2ODEsNjI2XSxbNTgwLDUzNSw1NThdLFs5OSw3NDcsMjc4XSxbNzAxLDU2NSw3MjVdLFs2NjUsMTMyLDUxNF0sWzY2NSw1MTQsNTc1XSxbMTMyLDU0OSw2NTNdLFsxNzYsNjUxLDE4OV0sWzY1LDQ3LDI2Nl0sWzU5Nyw1NjksNTM1XSxbNTY5LDU4MSw1MzddLFs1MzcsNTgxLDU0MF0sWzU2Myw1MzksNTQwXSxbNTM5LDU2NCw1NDhdLFsxNTA5LDEyMzMsMTQzNF0sWzEzMiw2NTMsNzQwXSxbNTUwLDcxMCwxNTVdLFs3MTQsNzIxLDY0NF0sWzQxMCwxMDExLDE4OF0sWzczMiw1MzQsNTg2XSxbNTYwLDU2Miw3MjldLFs1NTUsNTU3LDIyMl0sWzU4MCw1NTgsNTQ1XSxbNTk3LDUzNSw1ODBdLFs1ODEsNTYzLDU0MF0sWzUsODIxLDE2NzZdLFs1NzYsMjE1LDEzNl0sWzY0OSw0NTcsNzQxXSxbNTY0LDUzOSw1NjNdLFsxMjQsNzExLDIyNF0sWzU1MCw2NjgsNzEwXSxbNTUwLDU0MSw2NjhdLFs1NjUsNzAxLDY3M10sWzU2MCw2MTMsNDk5XSxbMjMzLDUzMiw2MjVdLFs1NDUsNTU1LDU4MF0sWzYwMSw1ODEsNTY5XSxbNTk0LDkwNCw1NDhdLFsxNDYzLDE0MjUsNDM0XSxbMTg1LDE0OSwxNDU0XSxbNzIxLDY3NCw2NDRdLFsxODUsMzgwLDE0OV0sWzU3Nyw0MjQsNTg2XSxbNDYyLDU4Niw1NTldLFs1OTcsNjAxLDU2OV0sWzU5NCw1NDgsNTY0XSxbNTY2LDYwMyw1NzRdLFsxNjUsNTQzLDU0NF0sWzQ1Nyw4OSwxMjFdLFs1ODYsNDI0LDE5NV0sWzcyNSw1ODcsNjA2XSxbMTA3OCw1ODIsMTEyNF0sWzU4OCw5MjUsODY2XSxbNDYyLDU1OSw1OTNdLFsxODksODc4LDU5MF0sWzU1NSwyMjksNTgwXSxbNjAyLDU2Myw1ODFdLFs5MDQsNTk0LDk1Nl0sWzQzNCwxNDI1LDE0MzhdLFsxMDI0LDExMiw4MjFdLFs1NzIsNTg3LDYyNl0sWzYwMCw1OTcsNTgwXSxbNTk5LDU5MSw2NTZdLFs2MDAsNTgwLDIyOV0sWzYwMSw2MjIsNTgxXSxbNTgxLDYyMiw2MDJdLFs2MDIsNTY0LDU2M10sWzYwMiw1OTQsNTY0XSxbNjAzLDYxMSw1NzRdLFs0OTgsNTI5LDU0Nl0sWzY5NywxMTQ1LDcwXSxbNTkyLDYyOCw2MjZdLFs2MTAsNTk3LDYwMF0sWzU5Nyw2MTAsNjAxXSxbMjIyLDU1NywxNzFdLFs2MDQsNzY1LDc5OV0sWzU3Myw0NjIsNTkzXSxbMTMzLDIwMCwxNzZdLFs3MjksNjA3LDYyN10sWzEwMTEsNjkyLDE4OF0sWzUxOCwxNDYsMTMwXSxbNTg1LDY4Nyw2MDldLFs2ODIsNjI3LDYwN10sWzE3MTIsNTk5LDY1Nl0sWzU2Miw1OTIsNjA3XSxbNjQzLDY1Niw2NTRdLFsyNTcsNjAwLDIyOV0sWzYwMSw2MzMsNjIyXSxbNjIzLDU5NCw2MDJdLFsxNzQsMjEyLDU2N10sWzcyNSw2MDYsNzAxXSxbNjA5LDcwMSw2MDZdLFs2MTAsNjMzLDYwMV0sWzYzMyw2NDIsNjIyXSxbMzgwLDIxNiwzMjRdLFsxNDIsMTQzLDEyNDldLFs1MDEsNzMyLDU4Nl0sWzUzNCw1NzcsNTg2XSxbNjQ4LDEyMzUsNTc3XSxbNjEwLDY0MSw2MzNdLFszMTAsMTAwMiwxODMxXSxbNjE4LDMzNCw2MDRdLFsxNzEwLDE0NSwyNjldLFs3MDcsNDk4LDY1OV0sWzUwMSw1ODYsNDYyXSxbNjI1LDUwMSw0NjJdLFs3MjYsNjYzLDY5MV0sWzMwMCw2MDAsMjU3XSxbNjQxLDYxMCw2MDBdLFs2MjIsNjI5LDYwMl0sWzYwMiw2MjksNjIzXSxbNTUsNjkyLDQ0NF0sWzUxOCw3NDgsNTA5XSxbOTI5LDE1MTUsMTQxMV0sWzYyMCw1NzgsMjY3XSxbNzEsNTExLDM1OF0sWzcwNyw2NjgsNDk4XSxbNjUwLDY4Nyw1ODVdLFs2MDAsMzAwLDY0MV0sWzY0MSw2NTcsNjMzXSxbMTY3NSw4ODgsMTY2OV0sWzYyMiw2MzYsNjI5XSxbNTA1LDUwMiwzNzVdLFs1NDEsNTI5LDQ5OF0sWzMzMiw0MjAsMTA1M10sWzYzNyw1NTEsNjM4XSxbNTM0LDYzOSw2NDhdLFs2OSw2MjMsODczXSxbMzAwLDUxMiw2NDFdLFs2MzMsNjU3LDY0Ml0sWzU2Miw2NjAsNTc5XSxbNjg3LDYzNyw2MzhdLFs3MDksNjQ2LDYwNV0sWzc3NSw3MzgsODg1XSxbNTU5LDU0OSwxMzJdLFs2NDYsNjgzLDUyNF0sWzY0MSw1MTIsNjU3XSxbMjY2LDg5Nyw5NDldLFsxNzEyLDY0MywxNjU3XSxbMTg0LDcyNywyNThdLFs2NzQsNzI0LDY2OV0sWzY5OSw3MTQsNjQ3XSxbNjI4LDY1OSw1NzJdLFs2NTcsNjYyLDY0Ml0sWzU3MSw4ODEsNjUxXSxbNTE3LDYwNyw1MDRdLFs1OTgsNzA2LDUyOF0sWzU5OCw2OTQsNTQ3XSxbNjQwLDU1Miw1NjBdLFs2NTUsNjkzLDY5OF0sWzY5OCw2OTMsNzIxXSxbOTEsNTEwLDUxMV0sWzE0NCwzMDEsMTEzNl0sWzMyNCwyMTYsODg4XSxbODcwLDc2NCwxNjgxXSxbNTc1LDUxNCw1MjBdLFsyNzYsNTQ0LDU0M10sWzY1OCwxNzUsNDRdLFs2NDUsNTA1LDcxMV0sWzY1OSw1NDYsNTcyXSxbNzAwLDUyNCw2NTVdLFs2MDUsNzAwLDUyOV0sWzI2Niw4NjcsODk3XSxbMTY5NSwxNTI2LDc2NF0sWzU3OSw2NTksNjI4XSxbNjU0LDU5MSw2ODJdLFs1ODYsNTQ5LDU1OV0sWzY5OCw3MjEsNzE0XSxbODk2LDQwMSw1MDZdLFs2NDAsNzM0LDU5OV0sWzY2NCw2NjUsNTc1XSxbNjIxLDYyOSw2MzZdLFsxNzEyLDY1Niw2NDNdLFs1NDcsNjQ0LDU5OF0sWzcxMCw2NjgsNzA3XSxbNjQwLDU2MCw3MzRdLFs2NTUsNjk4LDU1MV0sWzY5NCw1MjgsMjc3XSxbNTEyLDY2Miw2NTddLFs1MDQsNTkyLDYyNl0sWzY4OCw1ODQsNTE5XSxbMTUyLDI0MSw2MTddLFs1ODcsNzI1LDY4MV0sWzU5OCw2NjksNzA2XSxbNTI2LDY3MCw4NF0sWzU5OCw1MjgsNjk0XSxbNzEwLDcwNyw0OTldLFs1NzksNTkyLDU2Ml0sWzY2MCw2NTksNTc5XSxbMzIzLDMyNCwxMTM0XSxbMzI2LDg5NSw0NzNdLFsxOTUsMjksNjUzXSxbODQsNjcwLDkxNV0sWzU2MCw2NjAsNTYyXSxbNTA0LDYyNiw2ODFdLFs3MTEsNTA1LDIyNF0sWzY1MSw4ODEsMTE0XSxbMjE2LDYyMCw4ODldLFsxMzYyLDY3OCwxOTddLFs0OTMsOTksNDhdLFsxNjU5LDY5MSw2ODBdLFs1MjksNjkwLDU0Nl0sWzQzMCw4NDMsNzA5XSxbNjU1LDUyNCw2OTNdLFsxNzQsMTkxLDEwNV0sWzY3NCw2NjksNTk4XSxbOTgsNzEyLDgyXSxbNTcyLDU0Niw1ODVdLFs3Miw2MSw3MV0sWzkxMiw5MTEsODk0XSxbMTA2LDIyMywxODRdLFs2NjQsMTMyLDY2NV0sWzg0Myw2NDYsNzA5XSxbNjM1LDY5OSwxMzZdLFs2OTksNjk4LDcxNF0sWzU5MywxMzIsNjY0XSxbNjg4LDUyNiw1ODRdLFsxODUsMTc3LDYyMF0sWzUzMyw2NzUsNTM0XSxbNjg3LDYzOCw2MzVdLFsxNjUyLDg5LDQ1N10sWzg5Niw1MDYsOTEyXSxbMTMyLDc0MCw1MTRdLFs2ODksNjg1LDI4Ml0sWzY5MSw0NDksNjgwXSxbNDgsNDM2LDQ5M10sWzEzNiw2OTksNjQ3XSxbNzM5LDY0MCw1NTRdLFs1NDksNTg2LDY1M10sWzUzMiw1MzMsNjI1XSxbMTUzMCw2OTUsNjQ5XSxbNjUzLDM4MSw2MTldLFs3MzYsMTUxLDUzMV0sWzE4OCw2OTIsMjQxXSxbMTc3LDQwMiw1NzhdLFszMyw2ODksODY3XSxbNjg5LDMzLDY4NV0sWzU5Myw1NTksMTMyXSxbOTQ5LDY1LDI2Nl0sWzcxMSwxMDM4LDY2MV0sWzkzOSw0ODAsMTAwNF0sWzYwOSwzNjksNzAxXSxbNjE2LDU1Miw2MTVdLFs2MTksMzYxLDc0MF0sWzE1MSw0NjMsNTE2XSxbNTEzLDUyMSwxMTddLFs2OTEsNjYzLDQ0OV0sWzE4NiwyNTEsMTk2XSxbMzMzLDMwMiwzMjddLFs2MTMsNTYwLDU1Ml0sWzYxNiw2MTMsNTUyXSxbNjkwLDU1MSw2MzddLFs2NjAsNzA3LDY1OV0sWzcwNCwyMDgsMTIwM10sWzQxOCw3MzUsNTUwXSxbMTYzLDcwOCwxMjRdLFs1MjQsODM0LDY5M10sWzU1NCw2NDAsNTk5XSxbMjQ1LDM0MSwxNjVdLFs1NjUsNjczLDM1OV0sWzE1NSw3MTAsNzA4XSxbMTA1LDE5MSw1MTddLFsxNTE1LDE5OCwxNDExXSxbMTcwOSw1NTQsNTk5XSxbNjAsMjg5LDc4Nl0sWzgzOCwxMjk1LDEzOTldLFs1MzMsNTM0LDYyNV0sWzcxMCw0OTksNzA4XSxbNTU2LDYzMiw0MTBdLFsyMTcsNjIwLDIxNl0sWzU5MSw2MjcsNjgyXSxbNTA0LDUwMywyMjNdLFs2NDMsNjU0LDU2N10sWzY5MCw2MzcsNjUwXSxbNTQ1LDU1Nyw1NTVdLFsxNzQsNjU0LDY4Ml0sWzcxOSw2OTEsMTY1OV0sWzcyNyw2ODEsNTA4XSxbNjQ1LDcxMSw2NjFdLFs3OTQsNjE1LDczOV0sWzU2NSw1MTUsNTA4XSxbMjgyLDY4NSwzMDJdLFsxMTUwLDM5NywxMTQ5XSxbNjM4LDY5OSw2MzVdLFs1NDQsNjg1LDMzXSxbNzE5LDcyNiw2OTFdLFsxNzQyLDExMjYsMTczM10sWzE3MjQsMTQ3NSwxNDhdLFs1NTYsNDEwLDQwM10sWzE4NSwyMTcsMzgwXSxbNTAzLDUwNCw2ODFdLFsyNzcsNTU2LDQwM10sWzMyLDExNzgsMTU4XSxbMTcxMiwxNzA5LDU5OV0sWzYwNSw1MjksNTQxXSxbNjM1LDEzNiwzNjldLFs2ODcsNjM1LDM2OV0sWzUyOSw3MDAsNjkwXSxbNzAwLDU1MSw2OTBdLFs4OSwzMDQsNTczXSxbNjI1LDUzNCw3MzJdLFs3MzAsMzAyLDY4NV0sWzUwMyw2ODEsNzI3XSxbNzAyLDY3Myw3MDFdLFs3MzAsMzI3LDMwMl0sWzMyNywzNTMsMzMzXSxbNTk2LDY2NCw1NzVdLFs2NjAsNDk5LDcwN10sWzU4NSw1NDYsNjUwXSxbNTYwLDcyOSw3MzRdLFs3MDAsNjU1LDU1MV0sWzE3Niw1NzEsNjUxXSxbNTE3LDUwNCwyMjNdLFs3MzAsNjg1LDU0NF0sWzE2NjEsMTY4Miw3MjZdLFsxNjgyLDQ5NSw3MjZdLFsxMjUwLDMwMSw5MTddLFs2MDUsNTI0LDcwMF0sWzYwOSw2ODcsMzY5XSxbNTE2LDM4OSw4OTVdLFsxNTUzLDY4NiwxMDI3XSxbNjczLDcwMiwxNjRdLFs2NTYsNTkxLDY1NF0sWzUyMCw1OTYsNTc1XSxbNDAyLDEyMyw0MDFdLFs4MjgsNDU2LDcyOF0sWzE2NDUsNjc3LDE2NTNdLFs1MjgsNTU2LDI3N10sWzYzOCw1NTEsNjk5XSxbMTkwLDQ5NywzNTldLFsyNzYsNzMwLDU0NF0sWzExMTcsMTUyNSw5MzNdLFsxMDI3LDY4NiwxMzA2XSxbMTU1LDcwOCwxNjNdLFs3MDksNjA1LDU0MV0sWzY0Nyw2NDQsNTQ3XSxbNjUwLDYzNyw2ODddLFs1OTksNzM0LDU5MV0sWzU3OCwyOTMsMjY3XSxbMTY4MiwzNTcsNDk1XSxbNTEwLDkxLDEzMF0sWzczNCw3MjksNjI3XSxbNTc2LDU0MiwyMTVdLFs3MDksNTQxLDczNV0sWzczNSw1NDEsNTUwXSxbMjc2LDUwMCw3MzBdLFs1MDAsMzI3LDczMF0sWzY1Myw2MTksNzQwXSxbNDE0LDg1MSw0NTRdLFs3MzQsNjI3LDU5MV0sWzcyOSw1NjIsNjA3XSxbNjE1LDU1Miw2NDBdLFs1MjUsMTgxLDE5Ml0sWzMwOCw1MTIsMzAwXSxbMjIzLDUwMyw3MjddLFsyNjYsMTY1LDMzXSxbOTIsNTAwLDI3Nl0sWzMyMSwxMDQ2LDEwMzNdLFs1ODUsNjA5LDYwNl0sWzEyMDAsMTU1OSw4Nl0sWzYyOCw1NzIsNjI2XSxbMzAxLDQzNiw4MDNdLFs3MTQsNjQ0LDY0N10sWzcwOCw0OTksNjEzXSxbNzIxLDY5Myw3MjRdLFs1MTQsMzUzLDMyN10sWzM1Myw3NDAsMzYxXSxbMzQ0LDE1OCw3OF0sWzcwOCw2MTMsNjE2XSxbNjE1LDY0MCw3MzldLFs1MDAsNTE0LDMyN10sWzUxNCw3NDAsMzUzXSxbMTQ0OSwxNzcsMTg1XSxbNDYyLDIzMyw2MjVdLFs4NTEsNDA1LDExNjNdLFs2MDgsNjE2LDYxNV0sWzY0Nyw1NDIsNTc2XSxbNjI1LDczMiw1MDFdLFsxMDk3LDU4MiwxMzExXSxbMTIzNSw0MjQsNTc3XSxbNTc5LDYyOCw1OTJdLFs2MDcsNTkyLDUwNF0sWzI0LDQzMiw0NzBdLFsxMDUsNjE0LDI0N10sWzEwNCw3NDIsNDcxXSxbNTQyLDI1OSwyMTVdLFszNjUsMTk2LDQ1NV0sWzE0MjAsNDcsNjVdLFsyMjMsNzI3LDE4NF0sWzU0Nyw1NDIsNjQ3XSxbNTcyLDU4NSw2MDZdLFs1ODcsNTcyLDYwNl0sWzI2Miw3ODAsMTM3MF0sWzY0Nyw1NzYsMTM2XSxbNjQ0LDY3NCw1OThdLFsyNzEsNTMsNzVdLFs3MjcsNTA4LDI1OF0sWzQ3MSw3NDIsMTQyXSxbNTA1LDM3NSwyMjRdLFszNTcsMTcxMCwyNjldLFs3MjUsNTA4LDY4MV0sWzY1OSw0OTgsNTQ2XSxbNzQzLDExNzgsMzJdLFsxMTk1LDYzNCwyMzFdLFsxMTc2LDI0LDQ3MF0sWzc0MywxMTEwLDExNzhdLFsxMzUsODA5LDg1N10sWzYzLDc0Niw0MDddLFs2MzQsMTE3Niw0NzBdLFsxNTksMTExMiwyN10sWzExNzYsMTY4NSwyNF0sWzM5OSw0NTAsNzc5XSxbMTE3OCw4NTYsODc1XSxbNzUxLDc0NCw1NF0sWzQzNiw0OCw3NzJdLFs2MzQsMTEwOCwxMjEwXSxbNzY5LDEyODUsMTI4Nl0sWzc1MSwyOTgsNzU1XSxbNzQ2LDE2ODQsNzU0XSxbNzU0LDkyNCw4N10sWzcyMiwxNjI1LDc1Nl0sWzg3LDgzOSwxNTNdLFs0ODksNzk1LDgyMF0sWzc1OCw4MDgsMTUxOF0sWzgzOSw4NDAsMTUzXSxbODMxLDExMTEsOTU5XSxbMTExMSw3NDksOTU5XSxbODEwLDEyNTMsMTM2M10sWzEyNDcsMTM5NCw3MTNdLFsxMzg4LDEzMjksMTIwMV0sWzEyNDIsMTIwLDc2MV0sWzg1Nyw3OTEsMzg0XSxbNzU4LDE1MjMsODA4XSxbMjk2LDc2NCwxNTA0XSxbNzAsMTY1Miw4OTFdLFsyMDcsMjMzLDE2MzhdLFsxMzQ4LDU3LDI4XSxbODU4LDQyMCwzMzJdLFs5NjQsMTM3OSwxMjc4XSxbNDIwLDExOTQsODE2XSxbNzg0LDEwNzYsMTE4Nl0sWzEwNzYsMjEsMTE4Nl0sWzE3MTAsNzY3LDFdLFs4NDksODIyLDc3OF0sWzgwNiwxMzcsNzg3XSxbNzg2LDc5MCw3NDRdLFs3OTAsNTQsNzQ0XSxbNzcxLDYzLDQwN10sWzc4NSw4NTIsODE4XSxbNzc0LDE4MjMsMjcyXSxbODk1LDE1MSw1MTZdLFsxMzUsMTAyMiw4MDldLFs5OSw4MjYsNDhdLFs0OCw4MjYsNzU1XSxbODA4LDcwNSw0MDhdLFs4MzMsNDQxLDcxNl0sWzE3MzMsNzQzLDMyXSxbMTM4NSw4MzYsODUyXSxbNzcyLDgyNyw3MzddLFsxMDA1LDQ5LDc4MV0sWzc5MywxNjk3LDgxM10sWzE1MTgsNDQxLDE1MzddLFsxMTM5LDExMzIsODU5XSxbNzgyLDgwMSw3NzBdLFsxNTEwLDE1MzAsNjc2XSxbNzcwLDgxNCw4MzVdLFsyMzEsNzg3LDgyNV0sWzIwNyw3MjIsNzU2XSxbMjYsNzcxLDc5OF0sWzc4Miw4NjMsODY1XSxbODMyLDU0LDc5MF0sWzg2NSw4NDIsNTA3XSxbNzk5LDc2NSw5NF0sWzExNzUsMTI2MSwxMzUzXSxbODAwLDQwOCw4MDVdLFsyNjIsOTg2LDIwMF0sWzc5Miw4MDAsODE0XSxbODAxLDc5Miw3NzBdLFs3MDQsMTIwMywxMTQ4XSxbMzU2LDE1MTQsODIyXSxbMTY1LDU0NCwzM10sWzU2MSw3NzYsMTEzXSxbMTA0Myw3MzgsNzc1XSxbODE1LDgzMSw4MjBdLFs3NzMsNzkyLDgwMV0sWzc3Miw0OCw5MTRdLFs3NzIsNzM3LDgwM10sWzQzNiw3NzIsODAzXSxbODA4LDgxNyw3MDVdLFsxNjI0LDgyMiwxNTI3XSxbNTg4LDExNDQsNzg4XSxbNzk5LDc2Miw2MDRdLFs4MjEsMTUyMCwxNjc2XSxbODU0LDgwMyw2NjZdLFs4MjgsNDgyLDQ3Ml0sWzQ0NSw3NCw0NjNdLFs4MzEsNDg5LDgyMF0sWzgyOCw4MzYsNDgyXSxbNzE2LDc4Miw3NjNdLFszMzQsODE1LDc2Nl0sWzgxNSw4MjMsNzY2XSxbMzM0LDc2Niw3NjVdLFs4MTksODA1LDgzN10sWzE3MTYsMTUyMSwxNDEyXSxbMTY4NCw5MjQsNzU0XSxbODAwLDgwNSw4MTldLFsxNzA5LDgyOSw1NTRdLFs4MDYsMTM0OSwxMzddLFs5OSwxMDEzLDc0N10sWzM0MSw1OTUsMjc2XSxbODE3LDgxMCw4MThdLFsxMTc2LDE2OTEsMTY4NV0sWzc2Myw3ODIsODY1XSxbODMwLDg0NiwxMDUyXSxbODY1LDE0OTksODQyXSxbOTgyLDg0NiwxMDUzXSxbODQ3LDgzMiw3OTBdLFsxMTc4LDg3NSwxNThdLFs4MTcsODE4LDcwNV0sWzEzMDIsMTM5Miw0NV0sWzk2LDQxNywyODRdLFsyMjMsNjE0LDUxN10sWzM1Niw1MDcsMTUxNF0sWzExNjYsODQ4LDExNzldLFsxMzQ5LDQzMiwyNl0sWzcxNyw5MiwyNzZdLFs3NzAsODM1LDg2M10sWzUyMiw1MDksMTc0NV0sWzg0Nyw4NDEsODMyXSxbODMyLDg0MSw0Nl0sWzgyOSw3MzksNTU0XSxbODAyLDgyNCwzOV0sWzM5NywxMDQzLDc3NV0sWzE1NjcsODQ5LDc3OF0sWzEzODUsNDgzLDg1NV0sWzEzNDksMjYsMTM0Nl0sWzQ0MSw4MDEsNzgyXSxbNDAyLDQwMSwyOTNdLFsxMDQzLDY2Nyw3MzhdLFs3NTksNzk4LDEwMDddLFs4MTksODM3LDcyOF0sWzcyOCw4MzcsODI4XSxbODM3LDg1Miw4MjhdLFsxNTM3LDQ0MSw4MzNdLFsxNDgsMTQ3NSwxNDddLFs4MDUsNzA1LDgzN10sWzcxNiw0NDEsNzgyXSxbNDgzLDEzNzEsNzgwXSxbODE0LDgxOSw4NDRdLFs4NDUsNzUzLDEzMzZdLFsxNjYxLDcxOSw0XSxbODYyLDg0Nyw3OTBdLFs3MzcsODI3LDY2Nl0sWzIwMSw0Niw4NDFdLFs4MTAsNzg1LDgxOF0sWzQwOCw3MDUsODA1XSxbMTU2MCwxNTM2LDg0OV0sWzE1ODUsODUzLDE3ODZdLFs3LDE2NjgsODA3XSxbNyw4MDcsOF0sWzgyMiwxNTE0LDE1MjddLFs4MDAsODE5LDgxNF0sWzg0Nyw4NjIsODQxXSxbOTkxLDg1Nyw3NjBdLFs3MDUsODE4LDgzN10sWzgwOCw0MDgsNzczXSxbNDAyLDI5Myw1NzhdLFs3OTEsODU4LDMzMl0sWzE0ODAsMTIyOCwxMjQwXSxbODE0LDg0NCw4MzVdLFs3ODUsMTM4NSw4NTJdLFsxMTMyLDEyMCw4NTldLFsxNzQzLDE3MjYsNjg0XSxbMTcwNCw3ODMsMTI3OV0sWzE2MjMsMTY5NCwxNzMxXSxbOTU5LDQ4OSw4MzFdLFsxNTE4LDgwOCw3NzNdLFs4NjIsODcyLDg0MV0sWzQ0MSw3NzMsODAxXSxbMzMxLDUxMiwzMDhdLFszODAsMjE3LDIxNl0sWzg0MSw4NzIsMjAxXSxbODE4LDg1Miw4MzddLFs0NDgsMTQ4MCwxMjQwXSxbODU2LDExMDgsMTE5NV0sWzE1MjcsMTUxNCwxNTI2XSxbODE5LDE4MiwxMjMyXSxbODcxLDcyNCw2OTNdLFs4NTIsODM2LDgyOF0sWzc3MCw3OTIsODE0XSxbODAzLDczNyw2NjZdLFs3NTEsODI2LDI3OF0sWzE2NzQsMTcyNywxNjk5XSxbODQ5LDM1Niw4MjJdLFs4NzEsNjkzLDgzNF0sWzUwNyw4NDIsMTUxNF0sWzE0MDYsMTA5Nyw4NjldLFsxMzI4LDEzNDksMTM0Nl0sWzgyMyw4MTUsNzk1XSxbNzQ0LDc1MSwyNzhdLFsxMTEwLDg1NiwxMTc4XSxbNTIwLDcxNywzMTZdLFs4NzEsODM0LDY4M10sWzg4NCw4NzYsNzI0XSxbMTY1LDI2Niw0N10sWzcxNiw3NjMsNTA3XSxbMjE2LDg4OSw4ODhdLFs4NTMsMTU4NSwxNTcwXSxbMTUzNiw3MTYsMzU2XSxbODg2LDg3Myw2MjNdLFs3ODIsNzcwLDg2M10sWzQzMiwyNCwyNl0sWzY4Myw4ODIsODcxXSxbODg0LDcyNCw4NzFdLFsxMTQsODc2LDg4NF0sWzUxNiw1OTAsMzg5XSxbMTEsMTIxOCwxNjI4XSxbODYyLDExMyw4NzJdLFs4ODYsNjIzLDYyOV0sWzgzMCwxMDUyLDExMjBdLFs3NjIsMTUzLDYwNF0sWzc3Myw0MDgsNzkyXSxbNzYzLDg2NSw1MDddLFsxNTMsODQwLDYwNF0sWzg4Miw4ODQsODcxXSxbNTMxLDE1MSwzMjZdLFs4ODYsODkwLDg3M10sWzEzMywyNjIsMjAwXSxbODE5LDEyMzIsODQ0XSxbNjIxLDYzNiwxMjJdLFs2NDUsODkyLDUxOV0sWzExMzAsMTA3Niw3ODRdLFsxMTQsMjYzLDg3Nl0sWzE2NzAsMTAsMTY2M10sWzkxMSw2NzAsODk0XSxbNDUyLDg4NSw4NzJdLFs4NzIsODg1LDIwMV0sWzg4Nyw4ODIsNjgzXSxbODc4LDg4NCw4ODJdLFs1OTAsODc4LDg4Ml0sWzg5MCw4NjcsNjg5XSxbODk3LDYyOSw2MjFdLFs4OTcsODg2LDYyOV0sWzgxOSw3MjgsMTgyXSxbNTE5LDg5Myw2ODhdLFs4OTQsNjcwLDUyNl0sWzg5OCw4OTQsNTI2XSxbMTUzNiwzNTYsODQ5XSxbODEwLDEzNjMsNzg1XSxbODc4LDExNCw4ODRdLFs4NzksODg4LDg5Ml0sWzg5Miw4ODksODkzXSxbODkzLDg5OCw2ODhdLFs4OTUsNjgzLDg0M10sWzg5NSw4ODcsNjgzXSxbODg5LDYyMCwyNjddLFs1OTAsODgyLDM4OV0sWzQxOCw0NjUsODRdLFs5NDksODk3LDYyMV0sWzg5Nyw4OTAsODg2XSxbODg5LDI2Nyw4OTNdLFs4OTgsMjY3LDg5Nl0sWzUzMSwzMjYsNDczXSxbMTg5LDY1MSw4NzhdLFs4NDMsNjgzLDY0Nl0sWzg5Nyw4NjcsODkwXSxbODg4LDg4OSw4OTJdLFs4OTMsMjY3LDg5OF0sWzg5Niw4OTQsODk4XSxbNDczLDg5NSw4NDNdLFs4OTUsMzg5LDg4N10sWzk3NCw3MDYsNjY5XSxbNTEzLDExMTUsNTIxXSxbMzI2LDE1MSw4OTVdLFs4MDksNzkxLDg1N10sWzIxMSwyNjIsMTMzXSxbOTIwLDkyMyw5NDddLFs5MjMsOTAsOTQ3XSxbOTAsMjUsOTQ3XSxbMjUsOTcyLDkzNV0sWzY0LDQzMSw4OTldLFs1Miw4OTksOTAxXSxbOTAzLDkwNSw1OV0sWzQzNyw5NjcsNzNdLFs4MzksMTI0Miw3NjFdLFs5MDQsOTc1LDQ0XSxbOTE3LDMwMSwxNDRdLFs5MTUsNjcwLDkxMV0sWzkwNSwyMDEsODg1XSxbMTY4NCw2MywxNjg1XSxbMTAzMywxMTk0LDI4OF0sWzk1MCw5MTMsNzU1XSxbOTEyLDkxOCw5MTFdLFs5NTAsOTE0LDkxM10sWzUwNiw5MTgsOTEyXSxbOTIyLDkxOSw5MTVdLFs5MTEsOTIyLDkxNV0sWzEwMDQsNDUxLDQ5Ml0sWzEyNjMsNTUzLDYzOV0sWzkyMiw5MTEsOTE4XSxbNjMwLDkyMCw5NDddLFs5MTYsNTA2LDkyNl0sWzkxNiw5MTgsNTA2XSxbNTIxLDExMTUsMTA5OF0sWzkxNiw5MjIsOTE4XSxbOTE5LDQxOCw5MTVdLFs4MywzOCw3NV0sWzI0LDE2ODUsNzcxXSxbMTEwLDEyMzAsMTIxM10sWzcxMiw4LDE4MzddLFs5MjIsOTMwLDkxOV0sWzkxOSw0MzAsNDE4XSxbMTM5NSwxNDAyLDExODddLFs5MzAsOTIyLDkxNl0sWzU5NCw2MjMsNjldLFszNSw0MzEsOTY4XSxbMzUsOTY4LDk2OV0sWzg2Niw5MjQsMTY4NF0sWzE2MjUsMTI2Myw2NzVdLFs2MzEsNjMwLDUyXSxbOTMwLDkzMSw5MTldLFs0MzAsNzA5LDQxOF0sWzMwMiwzMzMsNDldLFsxNDQ2LDk3OCwxMTM4XSxbNzk5LDEwMDcsNzk4XSxbOTMxLDg0Myw5MTldLFs5NDcsMjUsNjRdLFs4ODUsNzM4LDY2N10sWzEyNjIsOTYzLDk2NF0sWzg5OSw5NzAsOTAxXSxbMTQwMSw5NDYsOTM4XSxbMTExNyw5MzMsMTA5MV0sWzE2ODUsNjMsNzcxXSxbOTA1LDk0OCwyMDFdLFs5NzksOTM3LDk4MF0sWzk1MSw5NTMsOTUwXSxbOTM3LDI3MCw0NDNdLFsxMTU0LDkwMyw1OV0sWzExOTQsOTU0LDEwNjddLFs5MDksNDA1LDkwN10sWzg1MCwxMTUxLDU5XSxbMTc2OSw4MTEsMTQzMl0sWzc2LDIwNiwyNTBdLFs5MzgsOTQ2LDk2Nl0sWzk2NSw5MjcsOTQyXSxbOTM4LDk2Niw5NTddLFs5NTUsOTc1LDkwNF0sWzkyNyw5NjUsOTM0XSxbNTIsNTEsNjMxXSxbNTksOTA1LDY2N10sWzQzMSw5MzUsOTY4XSxbNzg2LDI4OSw1NjFdLFsyNTIsMTIyLDY3MV0sWzQ4MSw0OTQsMTA3XSxbOTU0LDE4MTcsMTA2N10sWzc5NSwyNSw5MF0sWzk1OCw5NjUsOTQ1XSxbNzk1LDk3MiwyNV0sWzkwMiw5ODMsOTU1XSxbOTcyLDQ4OSw5NDRdLFsxMjU2LDI5LDQyNF0sWzY3MSwzMzEsOTQ1XSxbOTQ2LDk1OCw5NjNdLFs5NTYsOTU1LDkwNF0sWzkwMiw5NTUsOTU2XSxbNjcxLDUxMiwzMzFdLFs5NDUsMzMxLDk2MV0sWzY2Miw2NzEsMTIyXSxbNjcxLDY2Miw1MTJdLFs5MzQsNjUsOTI3XSxbNjMwLDk0Nyw1Ml0sWzY2Niw2MzEsOTEwXSxbODUwLDU5LDY2N10sWzk2MSwzMzEsMjM0XSxbMTAyNCw0MTEsMTA0Ml0sWzg5MCw2OSw4NzNdLFsyNTIsNjcxLDk0NV0sWzk3NSwyOTAsOTQwXSxbMjgzLDE4NiwxOTZdLFszMCwyODMsMzY1XSxbOTUwLDc1NSwyOThdLFs5NDYsOTY1LDk1OF0sWzk4NSwyOTAsOTc1XSxbOTY5LDI5MCw5ODVdLFs0MDUsODUxLDIwNl0sWzkzNSw0MzEsNjRdLFs5NDEsMTQyMywxNDIwXSxbOTY0LDk2MywxNjddLFs5NDIsMjUyLDk0NV0sWzc4LDc1Nyw1N10sWzQ5LDEwMDUsNjZdLFs5MzcsOTc5LDI3MF0sWzYzMSw2NjYsODI3XSxbOTgwLDkzNyw0NDNdLFs2Niw2ODksMjgyXSxbNDIxLDkwMiw5NTZdLFs5NDcsNjQsNTJdLFszNSw5NzksODk5XSxbOTUxLDk3MSw5NTNdLFs3NjIsODcsMTUzXSxbMjcsMzEsMzgxXSxbOTI0LDgzOSw4N10sWzk0Niw5NjMsOTY2XSxbMzMxLDMwOCwzNDBdLFs5NTcsOTY2LDEyNjJdLFs0NzMsODQzLDkzMV0sWzk1Myw5NzEsOTIwXSxbMjcwLDk2OSw5MDJdLFs5MzUsOTYyLDk2OF0sWzUxLDEwMDUsNzgxXSxbOTY5LDk4Myw5MDJdLFs0MzcsNzMsOTQwXSxbNjksNDIxLDk1Nl0sWzc2MSwyNDksODQwXSxbMjYzLDk3NCw2NjldLFs5NjIsOTQ0LDk2N10sWzk2Miw0MzcsMjkwXSxbOTg1LDk3NSw5NTVdLFs5MDcsNDA1LDk0OF0sWzcyMCw5NTcsMTI2Ml0sWzI1LDkzNSw2NF0sWzE3NiwyMDAsNTcxXSxbMTA4LDk0NSw1MF0sWzI1MCw4NTEsNDE0XSxbMjAwLDk4Niw1NzFdLFs4ODEsOTc0LDI2M10sWzgyNyw3NzIsOTUzXSxbOTcwLDg5OSw5ODBdLFsyOSwxNTksMjddLFsyMzQsMzMxLDM0MF0sWzk0OCw0MDUsMjA2XSxbOTgwLDg5OSw5NzldLFs5ODYsOTg0LDU3MV0sWzU3MSw5ODQsODgxXSxbOTkwLDcwNiw5NzRdLFs5NDYsOTM0LDk2NV0sWzk3MCw5ODAsNjZdLFsxMTEzLDE0ODYsMTU1NF0sWzk4NCw5ODEsODgxXSxbODgxLDk4Nyw5NzRdLFs2ODksNjYsNDQzXSxbMTAwNSw5MDEsNjZdLFs5ODMsOTg1LDk1NV0sWzE2NSw0Nyw3MThdLFs5ODcsOTkwLDk3NF0sWzEzNzAsOTg2LDI2Ml0sWzkwMSw5NzAsNjZdLFs1MSw5MDEsMTAwNV0sWzk4MSw5ODcsODgxXSxbOTg4LDcwNiw5OTBdLFs5NDIsOTQ1LDk2NV0sWzI5MCw0MzcsOTQwXSxbNjQsODk5LDUyXSxbOTg4LDU1Niw3MDZdLFs5NDEsOTM0LDk0Nl0sWzQzMSwzNSw4OTldLFs5OTYsOTg5LDk4NF0sWzk4NCw5ODksOTgxXSxbOTgxLDk4OSw5ODddLFszNSw5NjksMjcwXSxbMTM3MCw5OTUsOTg2XSxbOTg2LDk5NSw5ODRdLFs5ODksOTk5LDk4N10sWzk4Nyw5OTIsOTkwXSxbOTkyLDk4OCw5OTBdLFs5NjIsOTY3LDQzN10sWzk1MSw5NTAsOTc2XSxbOTc5LDM1LDI3MF0sWzQyMSwyNzAsOTAyXSxbOTk4LDk5NSwxMzcwXSxbOTg3LDk5OSw5OTJdLFs5ODgsMzY0LDU1Nl0sWzk2OSw5ODUsOTgzXSxbNjg5LDQ0Myw4OTBdLFs5OTUsMTAwMCw5ODRdLFsyMTksOTU4LDEwOF0sWzk5OCwxMDAwLDk5NV0sWzk5OSw5OTcsOTkyXSxbOTE0LDk1Myw3NzJdLFs4NDUsMTMzNiw3NDVdLFs4MDYsNzg3LDIzMV0sWzEwMDAsOTk2LDk4NF0sWzk4OSw5OTYsOTk5XSxbNTAsOTQ1LDk2MV0sWzQ0Myw0MjEsNjldLFs3OTcsMTU4LDc3OV0sWzEwOTgsMTQ2Myw0MzRdLFs5OTYsMTAwOSw5OTldLFsxMDAxLDk4OCw5OTJdLFsxMDAxLDM2NCw5ODhdLFs5MDMsOTA3LDkwNV0sWzI2LDc1OSw5NzNdLFs5OTcsMTAwMSw5OTJdLFs2MzIsMzY0LDEwMDFdLFsxMzQ2LDI2LDk3M10sWzk5OCwxMDA4LDEwMDBdLFsxMDAwLDEwMDksOTk2XSxbNTMxLDkzMSw3MzZdLFsyNTIsOTQ5LDYyMV0sWzI4NiwzODgsNTI1XSxbMTE3NCwxMDA4LDk5OF0sWzEwMDksMTAxMCw5OTldLFs5OTksMTAxMCw5OTddLFsxMDE0LDEwMDEsOTk3XSxbNjE0LDEwNSw1MTddLFs5NTgsOTQ1LDEwOF0sWzUyNSwxMDA0LDI0Ml0sWzk2Myw5NTgsMjE5XSxbMjMzLDQyNiwzMDRdLFsxMDAwLDEwMDgsMTAwOV0sWzEwMTAsMTAxNCw5OTddLFsxMDAxLDEwMDYsNjMyXSxbODI0LDQxMywzOV0sWzY0Miw2MzYsNjIyXSxbNDgwLDM4OCwyMDVdLFsyOCw3NTcsNzk3XSxbMTAxNCwxMDA2LDEwMDFdLFsxMDA2LDQxMCw2MzJdLFs5NzUsOTQwLDQ0XSxbMTIzNCw0MjAsODU4XSxbNTQsODMyLDQ2XSxbMTAwOSwxMDEyLDEwMTBdLFsxNjcsOTYzLDIxOV0sWzQxLDQ4MSwxMDddLFsxMDE3LDEwMTAsMTAxMl0sWzEyMiw2MzYsNjYyXSxbOTM5LDUyNSwzODhdLFs1MjUsOTM5LDEwMDRdLFs5NTAsOTUzLDkxNF0sWzgyOSwxNzM1LDczOV0sWzEwMDgsODgwLDEwMTVdLFsxMDA4LDEwMTUsMTAwOV0sWzEyNjMsNjM5LDY3NV0sWzk1Niw1OTQsNjldLFs3OTUsOTAsMTM0N10sWzExNzksODQ4LDEwMTNdLFs3NTksMTAwNyw5NzNdLFsxMDA5LDEwMTUsMTAxMl0sWzEwMTIsMTAxNiwxMDE3XSxbMTAxNywxMDE0LDEwMTBdLFsxMDE5LDEwMTEsMTAwNl0sWzkyNyw2NSw5NDldLFs2NDksMzE2LDU5NV0sWzkxMyw0OCw3NTVdLFs5NzYsOTUwLDI5OF0sWzEwMDMsMTAxNSw4ODBdLFsxMDE4LDEwMDYsMTAxNF0sWzEwMjEsMTAxOCwxMDE0XSxbNDQ0LDY5MiwxMDExXSxbNDUxLDEwMjksMTA2M10sWzExODUsODUxLDExNjNdLFsyOSwyNywzODFdLFsxODEsNTI1LDI0Ml0sWzEwMjEsMTAxNCwxMDE3XSxbMTAxNiwxMDIxLDEwMTddLFsxMDE4LDEwMTksMTAwNl0sWzEwMTksNDQ0LDEwMTFdLFs5MjcsOTQ5LDk0Ml0sWzQ1MSwzOTMsNDkyXSxbOTAzLDExNTQsOTA3XSxbMzkxLDEwMSw1N10sWzk0LDc2NSw1OF0sWzQxOSwxMDE2LDEwMTJdLFs5NDksMjUyLDk0Ml0sWzkwNywxMDIwLDkwOV0sWzc2NSw0NDIsNThdLFs5NCw0MDYsOTA4XSxbMTAwNyw5NCw5MDhdLFszNCwxMDEyLDEwMTVdLFszNCw0MTksMTAxMl0sWzQxOSwxMDIxLDEwMTZdLFs0NTEsMTA1NywzOTNdLFs5MDcsOTQ4LDkwNV0sWzEwMzQsMTA3MywxMDM5XSxbMTA2MSw5MDYsMTYxOV0sWzEwNjgsOTYwLDEwMzRdLFs0NzEsMTI0OSwxMDRdLFsxMTIsMTAyNCwxMDQyXSxbMzcyLDM3OSwxMjVdLFszNDEsNTQzLDE2NV0sWzE0MSwxMDk0LDE3MF0sWzU2NiwyNDMsMTA2MV0sWzM5OCwxMDM0LDEwMzldLFszMjUsMzE3LDE4MjNdLFsxNDkzLDI5NiwxNzI0XSxbODUwLDY2NywxMDQzXSxbMTA1NCwyOTcsMTA2NV0sWzE2MTksMTM1LDEwNzRdLFsxMDYxLDI0Myw5MDZdLFs2ODAsMTAyNCw4MjFdLFsxMTAzLDk2LDEyNDVdLFsxNDQwLDExMjMsMTQ5MV0sWzEwNDcsMTAyNSwxMDQ0XSxbNjcyLDQ1NCwxMjMxXSxbMTQ4NCw2OTcsMTUzMF0sWzk5Myw2NzIsMTIzMV0sWzE3OCwxNTQsMTA4OF0sWzEwNDQsMTA0MSwxMDY2XSxbMTEyLDEwNjIsMTA1OF0sWzE1MzAsNjQ5LDY3Nl0sWzE3OCwxMDg4LDEwNDBdLFsxMDQ2LDMyOCw5NTRdLFsyNDMsMjQ0LDEwMjJdLFs5NTQsMTE5NCwxMDMzXSxbMTA0Miw0MTEsMTAzMl0sWzk3MSw5OTMsMTA1Nl0sWzk2MCwxMDkzLDEwMzRdLFsxNzU0LDEzMzgsMjMyXSxbMzg1LDEwNjQsNDEyXSxbMTA1NywxMDYzLDExMV0sWzc0OCwxMDcxLDE0NDddLFsxNTMwLDY5Nyw2OTVdLFs5NzEsMTA1NiwxMjcwXSxbOTc3LDEwNTksMTIxMV0sWzY0OSw3NDEsMzE2XSxbMTA2MCwxNDUyLDEwMzBdLFszNTMsMzU0LDEzMjNdLFs2OTUsNzY4LDY0OV0sWzM5OCw0MDQsMTAzNF0sWzU5NiwzMTYsNzQxXSxbMTgzNiwxMTksMTNdLFsxNTEzLDExMTUsMTUyOF0sWzg4MywxMDgxLDE2NTJdLFsxMDM5LDEwNzMsMTA0OF0sWzQ2Miw0MjYsMjMzXSxbMzEsMTI5NiwzNTRdLFsxMDU1LDEwNDcsMTA2Nl0sWzEwMzIsMTA1NCwxMDQ1XSxbMTUyMSwzMTAsMTIyNF0sWzExOSw4NjEsMTNdLFsxMTk0LDEyMzQsMjg4XSxbMTEwOSwxNzcxLDEwNzBdLFsxMTY2LDExNjAsNzc2XSxbMTA0NCwxMDM1LDEwNDFdLFsxMDI2LDk2MCwxMDY0XSxbMTA1MCwxMDMyLDEwNDVdLFsxMDQ5LDEwNDEsMzg3XSxbMTE1LDEwMTMsOTldLFsxMDQ2LDk1NCwxMDMzXSxbMTMyMSw5MjAsOTcxXSxbNjExLDEwNTgsMzQ1XSxbMTA0OCwxMDY2LDEwNDldLFsxMDIzLDEwNTUsMTA3M10sWzEwMjksNDUxLDEwMDRdLFsxMTgsMTA5NCwxNDFdLFsxMDk0LDEwODAsMTcwXSxbMTA0MiwxMDMyLDEwNTBdLFsxMDI2LDEwNjQsMzg1XSxbMTUsMTYsMTA4NF0sWzEwOTYsMTA3OSw2MV0sWzEwNzUsMTA3MSw3NDhdLFszMjUsMTgxNywzMjhdLFs5MDksMTE2Myw0MDVdLFsxMDIyLDEyMzQsODA5XSxbMzc0LDM5OCwxMDUxXSxbMTA4Miw3Miw4MV0sWzEwMjMsMTAzNCwxMDkzXSxbMTgxNywxNzk0LDEwNjddLFs4NiwxNDQ1LDE0MDBdLFsxNTA3LDE1MzUsMTUxMF0sWzEwNzksMTA5NiwxMDc1XSxbNTY4LDE0NzgsMTEwNF0sWzEwNzAsMTc4LDEwNDBdLFsxMDM0LDEwMjMsMTA3M10sWzc3NiwxMTU1LDExM10sWzExMDMsMTQzLDE0Ml0sWzExNDAsODEsNzNdLFsxMDgyLDgxLDExNDBdLFsxMDYwLDEwMzAsOTM2XSxbMTA0MCwxMDg2LDExMDldLFszNzAsMTA2NSwzODVdLFs2MSw3MiwxMDgyXSxbMTA4NywxMDk2LDExNDRdLFsxMDQwLDEwODgsMTA4Nl0sWzE2NTEsODEyLDc1Ml0sWzEwNjIsMTA1MCwxMDQ1XSxbMTg3LDE1NCwxNzhdLFsxNzksMTg3LDE3OF0sWzEwOTksMTM0NCwxMTAxXSxbMTY2OCwxMDU4LDgwN10sWzEwNzMsMTA1NSwxMDQ4XSxbMTA5OSwxMzM2LDEzNDRdLFsxMjgzLDk0MywxMTIzXSxbMTA0OSwzODcsMTA1MV0sWzEwMjQsNjgwLDQ0OV0sWzYxLDEwODIsMTEwMF0sWzk2Nyw3NDksMTExMV0sWzE0MzksMTAzNyw4OF0sWzc0MiwxNTA1LDE0Ml0sWzM5OCwxMDM5LDEwNTFdLFsxMTA3LDEzMzYsMTA5OV0sWzEzNDQsMTU0MiwxMTAxXSxbMTQyLDE1MDUsMTEwM10sWzQ3NywxMDkzLDQ0N10sWzQ3NywxMDIzLDEwOTNdLFs0NzEsMTQyLDEyNDldLFsxMDQxLDEwMzUsMzk0XSxbMTMyOCw1NjgsMTEwNF0sWzYxLDExMDAsMTA5Nl0sWzE1NCwxMDkyLDEwODhdLFsxMTIsMTA0MiwxMDUwXSxbMTU0LDE4NywxNjhdLFs0MzUsMjM1LDQ1XSxbMTA3NSwxMDk2LDEwODddLFs5NywxMDc1LDc0OF0sWzEwNDksMTA2NiwxMDQxXSxbODE2LDEwNjcsMTAyOF0sWzg0Niw5ODIsMTE0Ml0sWzEyNDUsOTYsMjg0XSxbMTA5MiwxNTQsMTA4MF0sWzEwNTcsNDUxLDEwNjNdLFszODcsMzc3LDEwNTFdLFsxMDU1LDEwMjUsMTA0N10sWzEwNzUsMTA4NywxMDg5XSxbMTEwNiwxMTA4LDg1Nl0sWzEwNjgsMTAzNCw0MDRdLFsxNDgwLDE1NDUsODY4XSxbOTA2LDEzNSwxNjE5XSxbMTA3NCw5OTEsMTA5NV0sWzU3MCw1NjYsMTA2MV0sWzEwMjUsNDUzLDEwNDRdLFs3NDUsMTMzNiwxMTA3XSxbMTAzNSwxMDU3LDQxNl0sWzEwOTIsMTEwMiwxMTI5XSxbMTA3NCwxMzUsOTkxXSxbMTEwNSw3NDUsMTEwN10sWzQ0NywxMDI2LDQ0Nl0sWzM5NCwzODcsMTA0MV0sWzczLDgxLDk0MF0sWzExMTgsMTEwOCwxMTA2XSxbMTIxMCwxMTA4LDg3NF0sWzI0MywxMDIyLDkwNl0sWzQxMiwxMDY0LDEwNjhdLFsxMjgwLDYxMSw2MDNdLFs5NjAsNDQ3LDEwOTNdLFsxMDUxLDEwMzksMTA0OV0sWzEwNDAsMTEwOSwxMDcwXSxbMTQ3MSwxMDM3LDE0MzldLFs2OSw4OTAsNDQzXSxbMTM3Nyw3MDMsMTM3NF0sWzEwOTIsMTA4MCwxMTAyXSxbMTA5NiwxMTAwLDc4OF0sWzEwOTYsNzg4LDExNDRdLFsxMTE0LDk2NywxMTExXSxbNDQ2LDEwMjYsMjk3XSxbNzAsMTExMiw4ODNdLFs0NTMsMzkzLDEwNTddLFsxMTE4LDg3NCwxMTA4XSxbMTA1NCwzNzAsMTA0NV0sWzEwODAsMTA5NCwxMTAyXSxbMTAzOSwxMDQ4LDEwNDldLFs0MjgsNzUzLDg0NV0sWzEwNDcsMTA0NCwxMDY2XSxbMTA0NCw0NTMsMTAzNV0sWzE0NzIsNzMxLDE1MTJdLFsxMTI2LDExMjEsNzQzXSxbNzQzLDExMjEsMTExMF0sWzEwMzIsMjk3LDEwNTRdLFsxNDgwLDg2OCwxMjE2XSxbNzEsMzU4LDcyXSxbMTEzMyw5NjcsMTExNF0sWzExMDUsMTExOSw3NDVdLFsxMDM1LDQ1MywxMDU3XSxbMTAyNiw0NDcsOTYwXSxbNDU0LDg1MSwxMTkwXSxbMTAzMCwxNDc3LDY1Ml0sWzU4OSw4MTYsMTAyOF0sWzExMTAsMTEyMSwxMTA2XSxbMTEyMiwxMTE4LDExMDZdLFsxMTE2LDg3NCwxMTE4XSxbMTA0OCwxMDU1LDEwNjZdLFsxMTk0LDEwNjcsODE2XSxbNzQ0LDI3OCw3NDddLFs3NDUsMTEyMCw4NDVdLFs4NDUsMTA1Miw0MjhdLFsxMTA1LDE3ODAsMTExOV0sWzEwNjUsMjk3LDM4NV0sWzEwOTgsMTUyOSwxNDYzXSxbNzMxLDEwNjAsOTM2XSxbMjM1LDQzNCw4MTJdLFsxNDQ1LDE1MjUsMTExN10sWzExMDYsMTEyMSwxMTIyXSxbMTEyMiwxMTI3LDExMThdLFsxMTI3LDExMTYsMTExOF0sWzEwOTQsMTE4LDE3MzJdLFsxMTE5LDExMjAsNzQ1XSxbMTQwNiwxMTI0LDEwOTddLFs0MzUsMTE3LDIzNV0sWzE0NjIsMTQ0MCwxMDM3XSxbMTEyNiwxMTI5LDExMjFdLFsxMDg4LDEwOTIsMTEyOV0sWzExMzMsNzMsOTY3XSxbMTEyMCwxMDUyLDg0NV0sWzgxMiw0MzQsNzUyXSxbMTQ0MSwxNTU5LDEyMDBdLFsxMTMxLDU4OCw0MTNdLFsxMDU0LDEwNjUsMzcwXSxbMjM1LDEwOTgsNDM0XSxbMTA1MiwxMTQyLDQyOF0sWzE3MzcsNDI4LDExNDJdLFsxNDk2LDE0NDYsMTQ4M10sWzExODIsMTA4MywxNjU0XSxbMTEyMSwxMTI5LDExMjJdLFsxNzMyLDExMTYsMTEyN10sWzc2OCw0NTcsNjQ5XSxbNzYxLDExMTQsMjQ5XSxbMTA2NCw5NjAsMTA2OF0sWzExMzUsMTQ4MSwxMTM2XSxbMTEyNiw5NTIsMTEyOV0sWzEwODcsNTg4LDExMzFdLFsxMDg3LDExNDQsNTg4XSxbODU5LDc4OCwxMTM5XSxbMTE0MCwxMTMzLDExMzJdLFsxMTMzLDExNDAsNzNdLFsxODIyLDU3MCwxMDYxXSxbMzk0LDEwMzUsNDE2XSxbMTA1NSwxMDIzLDQ1OV0sWzgwLDI2NCw0ODVdLFsxMTE5LDExMjgsMTEyMF0sWzE0NSwxNjU4LDU2N10sWzY5NSw4OTEsNzY4XSxbMTEyOSwxMTAyLDExMjJdLFsxMTIyLDExMDIsMTEyN10sWzE0MTYsMTA3NywxNDEzXSxbMjk3LDEwMjYsMzg1XSxbMTA1Miw4NDYsMTE0Ml0sWzE0NDUsMTExNywxNDAwXSxbOTUyLDEwODYsMTEyOV0sWzE3MTQsMTA4OSwxMTMxXSxbMTEzMSwxMDg5LDEwODddLFsxMTAwLDExMzksNzg4XSxbMTEyLDEwNTAsMTA2Ml0sWzEzMjMsMzU0LDEyOTZdLFs0OSwzMzMsMTE0MV0sWzExNDIsOTgyLDE3MzddLFs3OSwxNDU3LDEwOTFdLFsxMDg4LDExMjksMTA4Nl0sWzExMDIsMTA5NCwxMTI3XSxbMTEyNywxMDk0LDE3MzJdLFsxMTAwLDEwODIsMTEzOV0sWzEwODIsMTEzMiwxMTM5XSxbMTA4MiwxMTQwLDExMzJdLFsxMTUwLDEwNDMsMzk3XSxbNjAsMTE2NiwyODldLFsxNjk2LDExNDYsMTY5OF0sWzEyOTcsMTIwMiwxMzEzXSxbNDA5LDEyOTcsMTMxM10sWzEyMzQsMTE5NCw0MjBdLFsxNDA4LDEzOTEsMTM5NF0sWzQyNCwxMjM1LDEyNDNdLFsxMjAzLDMwOSwxMTQ4XSxbNDg1LDQ3Nyw0NDddLFsxMTUyLDExNTYsODUwXSxbMTE1MywxMTQ5LDExNTVdLFsxMTUzLDExNTcsMTE0OV0sWzExNDksMTE1MiwxMTUwXSxbMTE1NiwxMTU0LDExNTFdLFs3NzYsMTE1MywxMTU1XSxbMTE1NywxMTUyLDExNDldLFsxMjE3LDEzOTMsMTIwOF0sWzExNTYsMTE1OSwxMTU0XSxbMTE1MywxMTY1LDExNTddLFsxMTY1LDExNTIsMTE1N10sWzExNTksMTAyMCwxMTU0XSxbMTE2MSwxMTUzLDc3Nl0sWzExNjEsMTE2NSwxMTUzXSxbMTE2NSwxMTU4LDExNTJdLFsxMTUyLDExNTgsMTE1Nl0sWzExNTgsMTE1OSwxMTU2XSxbMTE2Niw3NzYsNTYxXSxbMTE2MCwxMTYxLDc3Nl0sWzExNjEsMTE2NCwxMTY1XSxbMTE2MSwxMTYwLDExNjRdLFsxMTU4LDExNjIsMTE1OV0sWzExNTksMTE2MiwxMDIwXSxbMTI3MCwxMzIxLDk3MV0sWzExNjQsMTE3MCwxMTY1XSxbMTE2NSwxMTYyLDExNThdLFsxMTYyLDExNjMsMTAyMF0sWzU4OCw3ODgsOTI1XSxbMTE2NiwxMTY3LDExNjBdLFsxMTY1LDExNzAsMTE2Ml0sWzExNjAsMTE2NywxMTY0XSxbMTE2MiwxMTcwLDExNjNdLFsxMTc5LDExNjcsMTE2Nl0sWzExNjcsMTE2OCwxMTY0XSxbMTE2NCwxMTY4LDExNzBdLFsxMTY4LDExNjksMTE3MF0sWzEyMzQsMTAyMiwyODhdLFs4MDIsMzksODY2XSxbMTE3OSwxMTY4LDExNjddLFsxMTY5LDExNzMsMTE3MF0sWzExNzAsMTE3MywxMTYzXSxbMTE3MywxMTg1LDExNjNdLFsxMzYwLDEyNjcsMTM2NF0sWzExNjksMTE4NSwxMTczXSxbNjExLDI0NCwyNDNdLFs5MDAsMTIyNiwxMzc2XSxbMTI2MCwxNDA4LDEzNTBdLFs2MTgsODQwLDgzMV0sWzExODEsMTE4MywxMTc5XSxbMTE3OSwxMTg0LDExNjhdLFsxMjA4LDEyNzQsMTI5MV0sWzExODMsMTE4NCwxMTc5XSxbMTE2OCwxMTg0LDExNjldLFsxMzg3LDEzOTUsMTI1NF0sWzEyMDgsMTIwNCwxMTcyXSxbMTE4MiwxMTk3LDEwODNdLFsxMTg3LDEwODMsMTE5N10sWzEyMTMsMTE4MywxMTgxXSxbMTE2OSwxMjA3LDExODVdLFsxMzUsODU3LDk5MV0sWzEwMTMsMTIxMywxMTgxXSxbMTE4OSwxMTgzLDEyMTNdLFsxMTgzLDExODksMTE4NF0sWzExNjksMTE4NCwxMjA3XSxbMTIwNywxMTkwLDExODVdLFsxMTgwLDEzODksMTI4OF0sWzExOTEsMTE5MiwxNjQwXSxbMTY0MCwxMTkyLDEwOTBdLFsxMDkwLDEyMDUsMTY1NF0sWzE2NTQsMTIwNSwxMTgyXSxbMTE4OCwxMzk1LDExODddLFsxMTI2LDc0MywxNzMzXSxbNzg4LDg1OSw5MjVdLFs4MDksMTIzNCwxMTcxXSxbMTE5MywxMTk3LDExODJdLFsxMTg5LDExOTksMTE4NF0sWzE2MzksMTE5MSwxNjM3XSxbMTYzOSwxMjEyLDExOTFdLFsxMjA1LDExOTMsMTE4Ml0sWzExOTgsMTE4NywxMTk3XSxbMTE5OSwxMjA3LDExODRdLFszMzIsMTA1Myw4NDZdLFsxMDkwLDExOTIsMTIwNV0sWzExNywxMTg4LDExODddLFs0MzUsMTE4OCwxMTddLFs0MzUsMTIwNiwxMTg4XSxbMTE5OSwxMTg5LDEyMTNdLFs0MjAsODE2LDEwNTNdLFsxMjEyLDEyMTUsMTE5MV0sWzExNywxMTg3LDExOThdLFs0NSwxMjA2LDQzNV0sWzEyMCwxMTMyLDExMzNdLFs4NzQsMTExNiwxMjEwXSxbMTE5MSwxMjE1LDExOTJdLFsxMTkzLDEyMTYsMTE5N10sWzEyMTYsMTE5OCwxMTk3XSxbMTE5OSwxMjE0LDEyMDddLFsxMTcsNTIxLDIzNV0sWzEyMjAsMTMxMSwxMDc4XSxbMTIyMCw5MDAsMTMxMV0sWzE2NTMsMTIxNSwxMjEyXSxbMTE5MiwxMjI1LDEyMDVdLFsxMjA1LDEyMDksMTE5M10sWzEyMDksMTIxNiwxMTkzXSxbMTM4OSwxMjE3LDExNzJdLFsxMjA3LDEyMTQsNDU0XSxbMTcxLDU1NywxNzQ3XSxbMTgwNSwxMDc4LDE3ODddLFsxODA1LDEyMTksMTA3OF0sWzExOTgsMTIxNiw4NjhdLFs2NjYsOTEwLDg1NF0sWzEyMzAsMTIzMSwxMjEzXSxbMTIxMywxMjMxLDExOTldLFsxMTk5LDEyMzEsMTIxNF0sWzEyMTksMTIyMCwxMDc4XSxbMTIxNSwxMjIxLDExOTJdLFsxMTkyLDEyMjEsMTIyNV0sWzEyMjUsMTIyOCwxMjA1XSxbMTIwNSwxMjI4LDEyMDldLFsxMjA5LDEyMjgsMTIxNl0sWzE0NjQsMTMyNSwxMjIzXSxbMTIxNSwxMjI3LDEyMjFdLFsxMjI4LDE0ODAsMTIxNl0sWzEyMjYsMTY1MywxMzc2XSxbMTY1MywxMjQ5LDEyMTVdLFsxMjIxLDEyNDAsMTIyNV0sWzEyMjUsMTI0MCwxMjI4XSxbODM5LDc2MSw4NDBdLFsxMjM4LDEyMTksMTgwNV0sWzEyMzgsMTIyMCwxMjE5XSxbMTIzMiwxMzgwLDEzNzVdLFsxMjI2LDEyNDksMTY1M10sWzEyMjEsMTIyNywxMjQwXSxbMjMzLDIwNyw1MzJdLFsxMTAsMTIzNiwxMjMwXSxbMTI0OCwxMjMxLDEyMzBdLFsxMjMxLDQ1NCwxMjE0XSxbMTI0OSwxMjI3LDEyMTVdLFsxMjQ4LDEwNTYsMTIzMV0sWzQ4OSw5NTksOTQ0XSxbNDQ4LDEyNDAsMjg0XSxbOTI1LDg1OSwxMjQyXSxbMTgwNSwxMjQ0LDEyMzhdLFsxMjUyLDEyMjAsMTIzOF0sWzEyNTIsOTIxLDEyMjBdLFsxMjM2LDEyNTEsMTIzMF0sWzEyMzAsMTI1MSwxMjQ4XSxbMTA1Niw5OTMsMTIzMV0sWzEwMzEsMTI2NCwxMjYzXSxbNjgsMTE4NiwxNTddLFsxMjI3LDEyNDUsMTI0MF0sWzExMDMsMTI0NSwxNDNdLFsxMjQzLDEyMzUsNjEyXSxbMTI1Miw5NSw5MjFdLFsxMjQ5LDEyMjYsMTIzN10sWzEzOTAsMTM4NywxMjU0XSxbMTEyMCwzODQsODMwXSxbODMwLDMzMiw4NDZdLFsxMjI3LDE0MywxMjQ1XSxbMTMxNSwxMzY5LDEzNThdLFsxMzU2LDEyNjksMTM4Nl0sWzk3Miw3OTUsNDg5XSxbMTgzMSwxMjI0LDMxMF0sWzEyNTAsMTI1NSwxMjUxXSxbMTI1MSwxMDU2LDEyNDhdLFsxMjU2LDEyNDMsMTAzXSxbNjU4LDM1OCwxNzVdLFsxNjIwLDEyMzgsMTI0NF0sWzE2MjAsMTI1MiwxMjM4XSxbMTUwNiw5NSwxMjUyXSxbMTA0LDEyNDksMTIzN10sWzEyNDksMTQzLDEyMjddLFsxMjY4LDE0MTksMTMyOV0sWzYzNCw4MDYsMjMxXSxbNjE4LDgzMSw4MTVdLFs5MjQsMTI0Miw4MzldLFsxMjU1LDEyNzAsMTI1MV0sWzEyNTEsMTI3MCwxMDU2XSxbODY2LDkyNSwxMjQyXSxbMTAzLDI5LDEyNTZdLFs0MjQsMTI0MywxMjU2XSxbMTM0LDE2NTEsNzUyXSxbMTI1MCw5MTcsMTI1NV0sWzExNzIsMTIwNCwxMjYwXSxbMTM1MiwxMDM2LDEyNzZdLFsxMjY1LDEyMDEsMTMyOV0sWzgwNCwxMjgyLDEyNTldLFsxMjU5LDEyOTQsNzIzXSxbMzM1LDEzMzAsMTMwNV0sWzQwNyw3NjIsNzk5XSxbODc1LDg1NiwxMTk1XSxbMzIsMTU4LDM0NF0sWzk2Nyw5NDQsNzQ5XSxbMzcyLDEyNSw0Ml0sWzExNzUsMTM1NCwxMjYxXSxbNTUzLDYxMiwxMjM1XSxbMTI1OSwxMjczLDEyOTRdLFsxMjk0LDEyODMsNzIzXSxbNzU3LDc4LDE1OF0sWzQwNyw3OTksNzk4XSxbOTAxLDUxLDUyXSxbMTM5LDEzODYsMTM4OV0sWzEzODYsMTI2OSwxMzg5XSxbMTM4OSwxMjY5LDEyMTddLFsxMTQ4LDE1OTAsMTI2OF0sWzE0MjgsMTQ0OSwxNDUwXSxbODA0LDEyODEsMTI4Ml0sWzEyNzMsMTI1OSwxMjgyXSxbMTU4LDM5OSw3NzldLFs3NzEsNDA3LDc5OF0sWzUyMSwxMDk4LDIzNV0sWzkxNywxMzEyLDEyNTVdLFsxMzEyLDEyNzAsMTI1NV0sWzEyMTcsMTI2OSwxMzkzXSxbMTE5NSwxMTA4LDYzNF0sWzExMTAsMTEwNiw4NTZdLFsxMjEwLDE2OTEsMTE3Nl0sWzI3LDExMTIsMTE0NV0sWzEyOTYsMjcsMTE0NV0sWzExNzEsODU4LDc5MV0sWzcwNCwxMTQ4LDEyOTBdLFsxNDMwLDE0MzYsMTQzN10sWzEyODIsMTMwOCwxMjczXSxbMTMwMCw5NDMsMTI4M10sWzEzOTMsMTM1NSwxMjc0XSxbNzIwLDEyNzgsNzY5XSxbMTI4NywxMDU5LDEzOTldLFsxMzEwLDEzODgsMTI3Ml0sWzEzMTIsMTMyMSwxMjcwXSxbODUxLDExODUsMTE5MF0sWzEyOTYsMTE0NSwxMzA0XSxbMjYsMjQsNzcxXSxbNTEsOTEwLDYzMV0sWzEzMjksMTI5MCwxMjY4XSxbMTI5MCwxMTQ4LDEyNjhdLFsxMjk4LDEyOTMsNzMzXSxbMTI4MSwxMjkzLDEyODJdLFsxMjgyLDEyOTMsMTMwOF0sWzEzMDgsMTI5OSwxMjczXSxbMTMwMCwxMjgzLDEyOTRdLFsxMzQwLDk0MywxMzAwXSxbMTM0MCwxMzAxLDk0M10sWzQwNyw3NTQsNzYyXSxbMTI4NywxMzk5LDEyOTVdLFszNCwxMzksMTI4XSxbMTI4OCwxMTcyLDEyNjBdLFsxMjAsMTEzMywxMTE0XSxbMTMwNiwxMTEzLDE1MTFdLFsxNDY0LDEyMjMsMTI5Ml0sWzEyOTksMTI5NCwxMjczXSxbMTI5OSwxMzAwLDEyOTRdLFsxMjg2LDEyOTUsODM4XSxbMTI4NSwxMjQ3LDEyODZdLFsxMjQ3LDcxMywxMjg2XSxbMTIwMSwxMjY1LDEzOTBdLFsxMzc4LDEzNjgsMTM1N10sWzE0ODIsMTMyMCw5MTddLFs5MTcsMTMyMCwxMzEyXSxbODUwLDExNTYsMTE1MV0sWzU4OCwzOSw0MTNdLFsxMzI0LDEzMDYsNjg2XSxbNzg5LDEzNjUsOTI4XSxbMTIyMywxMzI2LDEyOTJdLFsxMjkyLDEzMjYsMTI5OF0sWzg2OSwxMDk3LDEzMTFdLFs3OTAsNzg2LDU2MV0sWzEzMjMsMTMwNCw5MzJdLFsxMzIzLDEyOTYsMTMwNF0sWzEzMTcsMTMyNCw2ODZdLFsxMzA2LDM2OCwxMTEzXSxbMTMyNSwxMzQyLDEyMjNdLFsxMzI2LDEzNDgsMTI5OF0sWzEyOTMsMTMyNywxMzA4XSxbMTMwOCwxMzE4LDEyOTldLFs3MDQsMTI5MCwxMjU4XSxbMTMyMCwxMzIxLDEzMTJdLFs3NjEsMTIwLDExMTRdLFsxNjg0LDgwMiw4NjZdLFsxNjc0LDYsMTcyN10sWzEzMTYsMTMyMyw5MzJdLFsxMzM1LDEzMzcsMTMwNV0sWzEzNDgsMTMyNywxMjkzXSxbMTI5OCwxMzQ4LDEyOTNdLFsxMzMzLDEzMDAsMTI5OV0sWzEzMzMsMTM0MywxMzAwXSxbMTMyOCwxMzAxLDEzNDBdLFsxMzI4LDEzMTQsMTMwMV0sWzgzOCwxMzk5LDEzMTldLFs5MjEsMTIzNyw5MDBdLFs0MDksMTM5MSwxNDA4XSxbMTM3NiwxNjUzLDY3N10sWzEyODEsODA0LDE0NThdLFsxMzMxLDEzMjQsMTMxN10sWzEzMjQsMzY4LDEzMDZdLFszNjgsMTMzOCwxMzA3XSxbMTMyNyw3OTcsMTMwOF0sWzc5NywxMzQ1LDEzMDhdLFsxMzA4LDEzNDUsMTMxOF0sWzEzMTgsMTMzMywxMjk5XSxbMTM0MSwxMTQ3LDE1NzJdLFs5MjMsMTMyMSwxMzIwXSxbOTIzLDkyMCwxMzIxXSxbMzksNTg4LDg2Nl0sWzExNDEsMTMyMywxMzE2XSxbMTMzMCwxMzM1LDEzMDVdLFsxMzM3LDEzMzUsMTMzNl0sWzEzMzksMTMzMiwxMzI1XSxbMTIyMywxMzQyLDEzMjZdLFsxMzQyLDEzNDgsMTMyNl0sWzEzNDgsNzk3LDEzMjddLFsxMzQ1LDEzMzMsMTMxOF0sWzEzNDMsMTM0MCwxMzAwXSxbMTQxOSwxMjY1LDEzMjldLFsxMzQ3LDEzMjAsMTU4NF0sWzE1MzUsMTE0MSwxMzE2XSxbMTA3OCwxMzExLDU4Ml0sWzEzNDQsMTMzNSwxMzMwXSxbNzUzLDEzMzEsMTMzN10sWzM2OCwxMzI0LDEzMzFdLFs3NTMsMzY4LDEzMzFdLFsxMzMyLDE0ODUsMTMyNV0sWzEzMjUsMTQ4NSwxMzQyXSxbNzg3LDEzNDMsMTMzM10sWzEzNywxMzI4LDEzNDBdLFs5NzMsMTM0MSwxNDc5XSxbNDA2LDExNDcsMTM0MV0sWzExNzEsMTIzNCw4NThdLFsxMTQxLDE1MzUsMTMyMl0sWzQ5LDExNDEsMTMyMl0sWzEzNDQsMTMzNiwxMzM1XSxbOTczLDkwOCwxMzQxXSxbNzY2LDEzNDcsMTU4NF0sWzEzNDcsOTIzLDEzMjBdLFs3ODEsNDksMTMyMl0sWzM2OCwyMzIsMTMzOF0sWzc4NywxMzQwLDEzNDNdLFs3ODcsMTM3LDEzNDBdLFs1NjgsMTM0Niw5NzNdLFs1OCwxMTQ3LDQwNl0sWzQ0MiwxMzM0LDExNDddLFs1OCw0NDIsMTE0N10sWzQ0Miw3NjYsMTMzNF0sWzkwLDkyMywxMzQ3XSxbNDI4LDM2OCw3NTNdLFs3NzksMTMzMywxMzQ1XSxbODI1LDc4NywxMzMzXSxbMTM3LDEzNDksMTMyOF0sWzEzMjgsMTM0Niw1NjhdLFs5MDgsNDA2LDEzNDFdLFs5MjQsODY2LDEyNDJdLFsxMzM2LDc1MywxMzM3XSxbNDI4LDIzMiwzNjhdLFsxMTE1LDc3NywxMDk4XSxbMTM0OCwyOCw3OTddLFs3OTcsNzc5LDEzNDVdLFs3NzksODI1LDEzMzNdLFsxMDA3LDkwOCw5NzNdLFs1ODMsMTM1MSw4ODBdLFsxMzY1LDEyNDYsOTc3XSxbMTY1OCwxNDUsMTcxMF0sWzEzMTAsNzk2LDEzODhdLFs3MTgsMjQ1LDE2NV0sWzEzMDIsMTI3MiwxMjU0XSxbMTE3NCwxMzUxLDU4M10sWzExNzQsNzE1LDEzNTFdLFsxMzU4LDEyNjAsMTIwNF0sWzEzNzQsMTM3MywxMjc2XSxbMTM3NywxMzc0LDEyNzZdLFs2NzgsMTM2MiwxMzgyXSxbMTM3NywxMjc2LDI1NF0sWzEzOSwzNCw0MF0sWzEwMDgsMTE3NCw1ODNdLFsxMzk2LDEyODYsMTMxOV0sWzc2OCw4OTEsNDU3XSxbMTMxNiw5MzIsMTUzNV0sWzEyODksMTM3MSwxMzYwXSxbMTgyLDczNiw4NjRdLFsxMzU1LDEzNjQsMTI3NF0sWzg2MCwxMzY3LDEzNTRdLFsxMzYyLDEyMjIsMTM4Ml0sWzEzNzYsODY5LDEzMTFdLFsxNTkwLDE0MTEsMTk4XSxbMTIzMiwxMzc1LDg3N10sWzEzOTQsMTI5NSwxMjg2XSxbODgwLDEzNTYsMTM4Nl0sWzg4MCwxMzUxLDEzNTZdLFsxMjExLDEwNTksMTI4N10sWzE5Nyw2NzgsMTQwNV0sWzg4MCwxMzg2LDEwMDNdLFsxMzY4LDEyNTMsMTM1N10sWzEzNTcsMTI1MywxMDM2XSxbNzE1LDEyODksMTM2NF0sWzEzNTQsMTM2Nyw3MDNdLFsxMzgzLDg3NywxMzc1XSxbMTI2NiwxMjg4LDEyNjBdLFsxMzczLDEzNzQsNzAzXSxbMTM3MiwxMjg5LDExNzRdLFsxMzAzLDEzNjYsMTM3OF0sWzEzNTEsNzE1LDEzNTVdLFsxNjY1LDE2NjYsNjI0XSxbMTMwOSwxMzU3LDEwMzZdLFs5MDAsMTIzNywxMjI2XSxbMTE3NCwxMjg5LDcxNV0sWzEzMzcsMTMzMSwxMzE3XSxbMTM2MCwxMzAzLDEzNTldLFsxMjY3LDEzNTQsMTE3NV0sWzEyNDEsMTI4NCwxNDE0XSxbMTM3NywyNTQsOTI5XSxbMTM4NSw4NTUsODM2XSxbMTM5NiwxMzE5LDE0MzZdLFsxMzYxLDEzNjYsMTMwM10sWzEzODEsMTM2OCwxMzc4XSxbMTMxMywxMjExLDEzOTFdLFsxMzY4LDEzODUsMTM2M10sWzgxMyw4Miw4NjFdLFsxMDU4LDEyODAsODA3XSxbODkzLDUxOSw4OTJdLFsxMzU5LDEzMDMsODYwXSxbMTM4MiwxMzUwLDEyNDddLFsxMzcxLDEzMDMsMTM2MF0sWzEyNjcsMTE3NSwxMjcxXSxbNzY5LDEyODYsMTM5Nl0sWzcxMiwxODM3LDgyXSxbMTM2NiwxMzg1LDEzODFdLFsxMzY1LDc5NiwxMzEwXSxbMTAwMywxMzg2LDQwXSxbNzgwLDEzNzEsMTM3MF0sWzU2MSw4NjIsNzkwXSxbMTI4NCwxMzgwLDg2NF0sWzE0NDksMTQyOCwxNzddLFs2MTEsMTI4MCwxMDU4XSxbMTI4NCwxMzc1LDEzODBdLFs5MjYsNTA2LDEyNDFdLFsxMzA1LDEzMzcsMTMxN10sWzMwOSwxMjAzLDIwOF0sWzEzODgsMTIwMSwxMzkwXSxbMTMwOSwxMDM2LDEzNTJdLFsxMzc3LDkyOSwxNDExXSxbMTM5OSwxMDU5LDEyNTddLFsxMTEyLDcwLDExNDVdLFsyODksMTE2Niw1NjFdLFsxMjg4LDEzODksMTE3Ml0sWzEzNjIsMzcsMTE4MF0sWzcxMywxMzk0LDEyODZdLFsxMzU1LDEzOTMsMTI2OV0sWzE0MDEsMTQyMyw5NDFdLFsxMjc0LDEyNzEsMTM4NF0sWzg2MCwxMzc4LDEzNjddLFs3MTUsMTM2NCwxMzU1XSxbNjc3LDE0MDYsODY5XSxbMTI5NywxMzU4LDEyMDJdLFsxMzg4LDEyNTgsMTMyOV0sWzExODAsMTI4OCwxMjY2XSxbMTAwOCw1ODMsODgwXSxbMTUyNCwxNDI1LDE0NjNdLFsxMzkwLDE0MDMsMTM4N10sWzEyNzgsMTM3OSwxMjQ3XSxbMTI3OCwxMjQ3LDEyODVdLFs5NjQsMTI3OCwxMjYyXSxbMTM1OCwxMzY5LDEyMDJdLFsxNzE1LDE2OTksMTcyNl0sWzkyNiwxMjQxLDE0MTRdLFsxMzQxLDE1NzIsMTQ3OV0sWzkyNiw5MzAsOTE2XSxbMTM5Nyw1MSw3ODFdLFs0MDksMTM1OCwxMjk3XSxbMTIzNiw0MzYsMzAxXSxbMTM3Niw2NzcsODY5XSxbMTM1MSwxMzU1LDEzNTZdLFs3NTgsMTUzNCwxNTIzXSxbMTM3OCwxMzU3LDEzNjddLFs5NzcsMTIxMSwxMzY1XSxbMTEzNSwxMTM2LDg1NF0sWzEzOTQsMTM5MSwxMjk1XSxbMTI2NiwxMjYwLDEyMjJdLFsxMzY1LDEzMDIsMTI0Nl0sWzEyMzIsODc3LDg0NF0sWzczNiw5MzAsODY0XSxbMTQwOCwxMzU4LDQwOV0sWzE1MDgsODE3LDE1MjNdLFsxMzgxLDEzODUsMTM2OF0sWzcxOCw4NTQsOTEwXSxbODU0LDcxOCwxMTM1XSxbMTM4MiwxMjIyLDEzNTBdLFsxMzkxLDEyMTEsMTI4N10sWzEzOTEsMTI4NywxMjk1XSxbMTI1NywxNjUxLDEzNF0sWzE0MTQsMTI4NCw4NjRdLFsxMjkxLDEzNjksMTMxNV0sWzEyMDIsOTI4LDEzMTNdLFs4NiwxNDAwLDE0MTNdLFsxNDEzLDEyMDAsODZdLFsxMjYzLDE2MjUsMTAzMV0sWzE0MTMsMTQwMCwxNDA0XSxbMTAwMiwxNjY0LDE4MzRdLFs5MzAsOTI2LDE0MTRdLFsxMzk5LDEyNTcsMTM0XSxbNTIwLDMxNiw1OTZdLFsxMzkzLDEyNzQsMTIwOF0sWzE2NTcsMTY1NSwxNzEyXSxbMTQwNywxNDA0LDE0MDBdLFsxNDA0LDE0MTAsMTQxM10sWzE2NDksMTIyOSwxNDA2XSxbMTM2MiwxMjY2LDEyMjJdLFsxMzg0LDEyNzEsMTE3NV0sWzkwMCwxMzc2LDEzMTFdLFsxMjc0LDEzODQsMTI5MV0sWzEyOTEsMTM4NCwxNDMxXSxbMTQzMywxMzk2LDE0MzZdLFsxMjY3LDEzNTksMTM1NF0sWzMwOSwxMzUzLDcwM10sWzgzOCwxMzE5LDEyODZdLFsxNDA3LDE0MTAsMTQwNF0sWzQ0MSwxNTE4LDc3M10sWzEyNDEsMTIzLDE0MjhdLFsxNjIyLDE1MjEsMTIyNF0sWzEyMTcsMTIwOCwxMTcyXSxbMTEzMCw3OTMsMTA3Nl0sWzQyNSwxNDA5LDE0ODFdLFsxNDgxLDE0MDksMTUzM10sWzEzMDMsMTM3OCw4NjBdLFsxMzUwLDE0MDgsMTM5NF0sWzEyNDYsMTY1MSw5NzddLFsxMjg5LDEzNjAsMTM2NF0sWzE3MjcsMTY5NCwxNjIzXSxbMTQxNywxNDA3LDE1MzNdLFsxNDE3LDE0MTAsMTQwN10sWzE0MDYsMTY1MCwxNjQ5XSxbMTMxOSwxMzQsMTQzN10sWzE0MTQsODY0LDkzMF0sWzE0MDYsMTIyOSwxMTI0XSxbMTM1NCwxMzU5LDg2MF0sWzE0MzMsNzY5LDEzOTZdLFsxNDE3LDE1MzMsMTQwOV0sWzE0MTYsMTQxMywxNDEwXSxbMTQxNSwxNDE2LDE0MTBdLFs5NSwxMjM3LDkyMV0sWzEzOTIsMTI1NCwxMzk1XSxbMTM2MCwxMzU5LDEyNjddLFsxMjU4LDEyOTAsMTMyOV0sWzExODAsMTI4LDEzODldLFsxNDIwLDE0MDksNDI1XSxbMTQxNywxNDE4LDE0MTBdLFsxNDE4LDE0MTUsMTQxMF0sWzE0MjIsMTA3NywxNDE2XSxbMTI0NywxMzUwLDEzOTRdLFszNyw0MywxMTgwXSxbMTIwNCwxMzE1LDEzNThdLFsxNDI4LDEzODMsMTM3NV0sWzEzNTYsMTM1NSwxMjY5XSxbMTQwOSwxNDE4LDE0MTddLFsxMzAyLDQ1LDEyNDZdLFsxNDIxLDE0MTYsMTQxNV0sWzE0MjEsMTQyMiwxNDE2XSxbMTQyMiwxNDk0LDEwNzddLFs5NTcsNzIwLDkzOF0sWzE0MjMsMTQwOSwxNDIwXSxbMTQyMywxNDE4LDE0MDldLFs3NTIsNDM0LDE0MzhdLFsxMjYwLDEzNTgsMTQwOF0sWzEzNjMsMTM4NSw3ODVdLFsxNDIzLDE0MjYsMTQxOF0sWzE0MjYsMTQyNCwxNDE4XSxbMTIyOSwxNjQ5LDExMjRdLFsxMjIyLDEyNjAsMTM1MF0sWzE1MDgsMTUyMywxMTM3XSxbMTI3OCwxMjg1LDc2OV0sWzE0ODIsOTE3LDE0NF0sWzE0MTgsMTQyNCwxNDE1XSxbMTQyNSwxNDIyLDE0MjFdLFsxNDI1LDE1MjQsMTQyMl0sWzEyNzIsMTM4OCwxMzkwXSxbMTM5MSw0MDksMTMxM10sWzEzNzgsMTM2NiwxMzgxXSxbMTM3MSw0ODMsMTM2MV0sWzcyMCwxMjYyLDEyNzhdLFsyOSwxMDMsMTU5XSxbMTI3MSwxMzY0LDEyNjddLFsxNDI0LDE0MjcsMTQxNV0sWzE1MzcsMTUyMiwxNTE4XSxbMTM0LDc1MiwxNDM4XSxbMTQyMCw5MzQsOTQxXSxbMTQyOCwxMzc1LDEyODRdLFsxMjc3LDEyMjQsMTgzMV0sWzEzNjIsMTE4MCwxMjY2XSxbMTQwMSwxNDI2LDE0MjNdLFsxNTc3LDEzNjksMTI5MV0sWzI2OCw0ODMsMjYyXSxbMTM4MywxNDUwLDE0NTZdLFsxMzg0LDExNzUsMTQzMV0sWzE0MzAsMTQxNSwxNDI3XSxbMTQzMCwxNDIxLDE0MTVdLFsxNDMwLDE0MjUsMTQyMV0sWzEzNzksMTM4MiwxMjQ3XSxbMTI1MiwxNTUzLDE0MjldLFsxMjA2LDEzOTIsMTM5NV0sWzE0MzMsMTQzMCwxNDI3XSxbMzA5LDIwOCwxMzUzXSxbMTI3MiwxMzkwLDEyNTRdLFsxMzYxLDQ4MywxMzY2XSxbMTUyMyw4MTcsODA4XSxbMTMwMiwxMjU0LDEzOTJdLFsxMzcxLDEzNjEsMTMwM10sWzE0MjYsMTQzNSwxNDI0XSxbMTQzNSwxNDMzLDE0MjRdLFsxNDMzLDE0MjcsMTQyNF0sWzcyMCw3NjksMTQzM10sWzc5NiwxMjU4LDEzODhdLFsxNTkwLDE0MTksMTI2OF0sWzEyODksMTM3MiwxMzcxXSxbMTMwNSwxMzE3LDE1MDldLFs5OTgsMTM3MiwxMTc0XSxbNDAsMTM4NiwxMzldLFsxMjYxLDEzNTQsNzAzXSxbMTM2NCwxMjcxLDEyNzRdLFsxMzQsMTQzOCwxNDM3XSxbMTQzNiwxMzE5LDE0MzddLFsxMzE3LDY4NiwxNTA5XSxbMTQ4NCw5MzIsMTMwNF0sWzE0MzQsMTQzMiwxNTA5XSxbMTQyMCw2NSw5MzRdLFs5MzEsOTMwLDczNl0sWzEzNjcsMTM1NywxMzA5XSxbMTM3MiwxMzcwLDEzNzFdLFsxMjA0LDEyMDgsMTMxNV0sWzE0MjYsOTM4LDE0MzVdLFsxMzY4LDEzNjMsMTI1M10sWzEyMDcsNDU0LDExOTBdLFsxMzAyLDEzMTAsMTI3Ml0sWzMwOSwxMzc3LDM5MF0sWzM5MCwxMzc3LDE0MTFdLFsxMzcwLDEzNzIsOTk4XSxbMTQxMSwxNTkwLDExNDhdLFs3MjAsMTQzMywxNDM1XSxbMTQ1MCwxMzgzLDE0MjhdLFsxMzc5LDY3OCwxMzgyXSxbMTQwNSw2NzgsMTM3OV0sWzEyMDgsMTI5MSwxMzE1XSxbMTM5OSwxMzQsMTMxOV0sWzEzNjcsMTMwOSwxMzczXSxbMTM3MywxMzUyLDEyNzZdLFs1OTYsNzQxLDU5M10sWzU1MywxMjY0LDYxMl0sWzE0MzMsMTQzNiwxNDMwXSxbMTQzNywxNDM4LDE0MzBdLFs5NjQsMTQwNSwxMzc5XSxbMTM3MywxMzA5LDEzNTJdLFsxMjY1LDE0MDMsMTM5MF0sWzEyMzMsMTYxOCwxNDM0XSxbMTM2NSwxMzEwLDEzMDJdLFs3ODksNzk2LDEzNjVdLFs3MjAsMTQzNSw5MzhdLFsxMjgsMTM5LDEzODldLFsxNDY2LDkzMywxNTI1XSxbMTE5MSwxNjQwLDE2MzddLFsxMzE0LDE0NDIsOTQzXSxbMTE0MSwzNTMsMTMyM10sWzE0ODksMTEzOCwxNDc0XSxbMTQ2MiwxNDc3LDE0NDBdLFsxNDc0LDExMzgsMTQ4OF0sWzE0NDIsMTMxNCwxNDQzXSxbMTQ0NiwxMDMwLDE1NDZdLFsxNDg0LDExNDUsNjk3XSxbMTU0OSwxNDQzLDE0NDVdLFsxNDcwLDE1NzIsMTQ2OF0sWzEzOTcsMTIzOSwxNTA3XSxbMTY0OSwxODI1LDE4MjRdLFsxMjU5LDE0NDAsMTQ3N10sWzE0NTEsMTQ1MCwxNDQ5XSxbOTc4LDE0NDYsNjUyXSxbMTQ1NCwxNDU2LDE0NTFdLFsxNDUxLDE0NTYsMTQ1MF0sWzM0MSwxNTA3LDU5NV0sWzkzMywxNTQ3LDc5XSxbODA0LDE0NTIsMTA2MF0sWzE0NTQsMTQ1NSwxNDU2XSxbMTM5OCwxNDYwLDE0NTRdLFsxNDU1LDg3NywxNDU2XSxbMTI3NywxODMxLDE4MjVdLFs4MDQsMTA2MCwxNDU4XSxbMTMzOSwxNDU5LDE1OTVdLFsxMzE0LDExMDQsMTQ0M10sWzkzMywxNDQ4LDE1NDddLFsxNDcsMTQ2MCwxMzk4XSxbMTQ2MCwxNDYxLDE0NTRdLFsxNDU0LDE0NjEsMTQ1NV0sWzEyOTIsMTEyNSwxNDY0XSxbNDE3LDE1MzEsMTQ4MF0sWzE0NTksMTMzOSwxMzI1XSxbODExLDE3NTYsMzM1XSxbMTUxMiw5MzYsMTQ5MF0sWzc3NywxNTI5LDEwOThdLFsxNDcsMTQ3NSwxNDYwXSxbMTQ2NCwyNTMsMTQ1OV0sWzgzNiw4NTUsNDgyXSxbMTQ4NywxNDg2LDEzMDddLFsxMTA0LDE1MDEsMTQ0M10sWzE0MzksMTIwMCwxNTMyXSxbMTQ3NSwxNDY5LDE0NjBdLFsxNDYwLDE0NjksMTQ2MV0sWzEzMjUsMTQ2NCwxNDU5XSxbMTI3NywxODI1LDE2NDldLFsxNTMyLDEyMDAsMTA3N10sWzg0NCw4NzcsMTQ1NV0sWzE1NzIsOTMzLDE0NjZdLFsxNDc5LDU2OCw5NzNdLFsxNTA5LDMzNSwxMzA1XSxbMTMzOSwxNTk1LDE3NTldLFsxNDY5LDE0NzYsMTQ2MV0sWzE0NjEsMTQ3NiwxNDU1XSxbMTEwNCwxNDcwLDE0NjhdLFsxNDY0LDE0NzIsMjUzXSxbMTExNywxMDkxLDE0MDddLFsxNzU2LDE1NDIsMzM1XSxbMTIwNiwxMzk1LDExODhdLFszMzUsMTU0MiwxMzMwXSxbODM1LDg0NCwxNDU1XSxbMTQ3MSwxNTk4LDE0NjJdLFsxNDkxLDE0NDIsMTQ0MV0sWzgzNSwxNDU1LDE0NzZdLFsxNDQxLDE0NDIsMTQ0M10sWzE0ODksMTQ3NCwxNDczXSxbMTI1MSwxMjM2LDEyNTBdLFsxMDMwLDE0NTIsMTQ3N10sWzE1OTgsMTQzOSwxNTMyXSxbOTc4LDE1OTgsMTQ5Ml0sWzE0MjYsMTQwMSw5MzhdLFsxNDQ4LDE1ODQsMTQ4Ml0sWzE3MjQsMTQ5NywxNDc1XSxbMTQ3NSwxNDk3LDE0NjldLFsxNDg0LDE1MzUsOTMyXSxbMTMwNywxNDg2LDExMTNdLFsxNDg3LDY5NiwxNDk1XSxbMTAzNywxNDkxLDE0NDFdLFsxMDMwLDE0NDYsOTM2XSxbMTQ1MywxNDg3LDE0OTVdLFs2OTYsMTQ2NywxNDk1XSxbMTEzOCwxNDg5LDE0ODNdLFsxNDk3LDExNDMsMTQ2OV0sWzE0NjksMTE0MywxNDc2XSxbNjUyLDE1OTgsOTc4XSxbODUwLDEwNDMsMTE1MF0sWzE0ODIsMTU4NCwxMzIwXSxbMTczMSw5OCwxNjk3XSxbMTExMywxNTU0LDE1NzNdLFsxNTI0LDE1MzIsMTQ5NF0sWzE0OTYsMTQ2Nyw2OTZdLFsxNDUyLDEyNTksMTQ3N10sWzI5NiwxNTA0LDE0OTddLFsxNTA0LDExNDMsMTQ5N10sWzExNDMsMTQ5OSwxNDc2XSxbNzE4LDkxMCwxNDk4XSxbODY4LDE1NDAsMTUyOF0sWzgxNywxMjUzLDgxMF0sWzE0OTAsNjk2LDE0ODddLFsxNDQwLDE0OTEsMTAzN10sWzE1MTAsNjc2LDU5NV0sWzE0ODgsMTQ5MiwxNTE3XSxbNzgxLDEyMzksMTM5N10sWzE0NjcsMTUxOSwxNTAzXSxbMTUwMCwxMzA3LDE3NTldLFsxMTQ5LDM5Nyw0NTJdLFsxNTA0LDE1MTQsMTE0M10sWzE1MTQsODQyLDExNDNdLFsxMTI1LDczMywxNDU4XSxbMTUwMywxNTMxLDE1NTVdLFsxMjc2LDEwMzYsMTEzN10sWzE0NDAsNzIzLDExMjNdLFsxMDM2LDE1MDgsMTEzN10sWzgxNywxNTA4LDEyNTNdLFsxMDMsODgzLDExMTJdLFsxNDU4LDczMSwxNDcyXSxbMTUxMiwxNDkwLDE0ODddLFsxNDg3LDE0NTMsMTQ4Nl0sWzExMzgsOTc4LDE0ODhdLFsxMDM2LDEyNTMsMTUwOF0sWzEzOTgsMTQ5LDE0N10sWzE0NzQsMTUxNywxNTEzXSxbMTEyNSwxNDU4LDE0NzJdLFsxNDg2LDE0NTMsMTU1NF0sWzE1MTgsMTUzNCw3NThdLFszNDUsMTA1OCwxMDYyXSxbOTI4LDEyMDIsMTM2OV0sWzE1NTQsMTU0MSwxNTA1XSxbMTQ2NCwxMTI1LDE0NzJdLFsxNTA0LDc2NCwxNTE0XSxbMzA0LDQyNiw1NzNdLFsxNTA1LDc0MiwxNTA2XSxbMTQ3OSwxNTcyLDE0NzhdLFsxNTE5LDE0ODMsMTQ4OV0sWzgzMyw3MTYsMTA2OV0sWzE1MjIsMTUzNCwxNTE4XSxbMTExNSwxNTEzLDc3N10sWzgxMSwzMzUsMTQzMl0sWzE1OTEsMTUzMywxNDA3XSxbNzc3LDE1MTcsMTUyOV0sWzE1MTMsMTUxNyw3NzddLFsxNDk4LDkxMCwxMzk3XSxbMTA2OSwxNTM5LDgzM10sWzgzMywxNTM5LDE1MzddLFsxNTIyLDE1NTEsMTUzNF0sWzE1MzQsMTU1MSwxNTIzXSxbMTUzOCwxMTM3LDE1MjNdLFs5MTAsNTEsMTM5N10sWzEzNjcsMTM3Myw3MDNdLFsxNDY2LDE1MjUsMTQ2OF0sWzE1NywxMTg2LDE4MzJdLFsxNDI5LDE1MTEsMTUwNl0sWzE1NzMsMTUwNSwxNTA2XSxbMTI1OSwxNDUyLDgwNF0sWzE1MDMsMTQ5NSwxNDY3XSxbMjYyLDQ4Myw3ODBdLFsxNTcyLDE0NjYsMTQ2OF0sWzE1MzYsMTU1Niw3MTZdLFs3MTYsMTU1NiwxMDY5XSxbMTU0NCwxNTIzLDE1NTFdLFsxNTQ0LDE1MzgsMTUyM10sWzE1MTEsMTU3MywxNTA2XSxbOTMzLDE1NzIsMTQ0OF0sWzE1NDMsMTUzNywxNTM5XSxbMTUzNywxNTQzLDE1MjJdLFsxMDkxLDkzMyw3OV0sWzE1MTksMTU0MCwxNTQ1XSxbMTU0OSwxNDQ1LDg2XSxbMTA2OSwxNTQ4LDE1MzldLFsxNTQ4LDE1NDMsMTUzOV0sWzE1NDMsMTU1MSwxNTIyXSxbMTUwMCwxNDg3LDEzMDddLFs2OCw3ODQsMTE4Nl0sWzE1NTIsMTU0NCwxNTUxXSxbMTU1MCwxNTM4LDE1NDRdLFsxNTM4LDE1NTAsMTEzN10sWzE1MTksMTQ3MywxNTQwXSxbMTU0NywxNDQ4LDE0ODJdLFsxNTYwLDE1NjMsMTUzNl0sWzE1MzYsMTU2MywxNTU2XSxbMTU1NiwxNTQ4LDEwNjldLFsxNTQzLDE1NTgsMTU1MV0sWzExMzcsMTU1MCwxMjc2XSxbMTQ1MywxNDk1LDE1NTVdLFsxNTYxLDE1NDMsMTU0OF0sWzE1NDMsMTU2MSwxNTU4XSxbMTU1OCwxNTY2LDE1NTFdLFsxNTUyLDE1NTAsMTU0NF0sWzE1NjksMTU1NywxNTUwXSxbMTU1NywxMjc2LDE1NTBdLFsxMjc2LDE1NTcsMjU0XSxbMTUzMSwxNTAzLDE0ODBdLFsxNTM1LDE1MzAsMTUxMF0sWzE1NDUsMTUwMywxNTE5XSxbMTU0NywxNDgyLDc5XSxbMTU2NiwxNTUyLDE1NTFdLFsxNTUyLDE1NjksMTU1MF0sWzE1MDMsMTU0NSwxNDgwXSxbNzAzLDEzNzcsMzA5XSxbMTYyNSw2NzUsNzU2XSxbMTAzNywxNDQxLDg4XSxbOTI5LDI1NCwxNTU3XSxbODQ5LDE1NjcsMTU2MF0sWzE1NTYsMTU2NCwxNTQ4XSxbMTQ5MiwxNTI5LDE1MTddLFsxMjUyLDE0MjksMTUwNl0sWzE1NTMsMTAyNywxNDI5XSxbMTQ1MywxNTU1LDE1NDFdLFsxNTU0LDE0NTMsMTU0MV0sWzEyMzMsNjg2LDE1NTNdLFsxMzI4LDExMDQsMTMxNF0sWzE1NjQsMTU3NiwxNTQ4XSxbMTU0OCwxNTc2LDE1NjFdLFsxNTU3LDE1NjIsOTI5XSxbMTUyMCwxMTIsMTY2OF0sWzE0ODMsMTQ0NiwxMTM4XSxbNzc4LDE1NzAsMTU2N10sWzE1NjMsMTU2NCwxNTU2XSxbMTU2MSwxNTY1LDE1NThdLFsxNTY1LDE1NjYsMTU1OF0sWzE1NjksMTU1MiwxNTY2XSxbMTU2MiwxNTU3LDE1NjldLFsxNTMwLDE1MzUsMTQ4NF0sWzEzODcsMTQwMiwxMzk1XSxbMTYyMSwxNjM0LDEzODddLFsxNTY3LDE1NjgsMTU2MF0sWzE1NjAsMTU2OCwxNTYzXSxbMTU3MSwxNTY5LDE1NjZdLFsxMzQ0LDEzMzAsMTU0Ml0sWzE1NzcsMTQzMSwxMzUzXSxbMTYzOCwyMzMsMzA0XSxbMTUyNCwxNDYzLDE1MjldLFsxMzUzLDE0MzEsMTE3NV0sWzEwNzcsMTIwMCwxNDEzXSxbMTQ3OCwxNDcwLDExMDRdLFsxNTY4LDE1NzUsMTU2M10sWzE1NjMsMTU3NSwxNTY0XSxbMTU3NSwxNTc2LDE1NjRdLFsxNTYxLDE1NzYsMTU2NV0sWzE1NjUsMTU3NCwxNTY2XSxbMTU2MiwxNTE1LDkyOV0sWzE1NTUsOTYsMTU0MV0sWzE1MzEsNDE3LDk2XSxbMTU1NSwxNTMxLDk2XSxbMTI0Niw0NSwxNjUxXSxbMjA4LDE1NzcsMTM1M10sWzE1ODYsMTU2OCwxNTY3XSxbMTU3NCwxNTcxLDE1NjZdLFsxNTcxLDE1ODMsMTU2OV0sWzE0NzQsMTUxMywxNTI4XSxbMTIzOSwxMzIyLDE1MzVdLFsxNDc4LDE1NzIsMTQ3MF0sWzE1NzAsMTU4NiwxNTY3XSxbMTQ4OCwxNTE3LDE0NzRdLFs4LDE4MzMsMTgzN10sWzExMjMsMTQ0MiwxNDkxXSxbMTU4OSwxNTY4LDE1ODZdLFsxNTc2LDE1OTQsMTU2NV0sWzE1NjUsMTU5NCwxNTc0XSxbMTU2MiwxOTgsMTUxNV0sWzE1NTksMTQ0MSwxNTQ5XSxbMTQ0MSwxNDQzLDE1NDldLFsxMTM1LDQyNSwxNDgxXSxbMTIzOSwxNTM1LDE1MDddLFsxNTk1LDE0ODcsMTUwMF0sWzE1NzAsMTU4NSwxNTg2XSxbMTU4OSwxNTc4LDE1NjhdLFsxNTY4LDE1NzgsMTU3NV0sWzE1NzksMTU2OSwxNTgzXSxbMTE3NywxNTc3LDIwOF0sWzExNSwxMjM2LDExMF0sWzE1NzgsMTU5MywxNTc1XSxbMTU4NywxNTc2LDE1NzVdLFsxNTc2LDE1ODEsMTU5NF0sWzE1NzEsMTU4MiwxNTgzXSxbMTU4OCwxNTc5LDE1ODNdLFsxNTc5LDE1ODAsMTU2Ml0sWzE1NjksMTU3OSwxNTYyXSxbMTU2MiwxNTgwLDE5OF0sWzEwMjcsMTUxMSwxNDI5XSxbMTU4OSwxNTkzLDE1NzhdLFsxNTg3LDE1ODEsMTU3Nl0sWzE1ODIsMTU3NCwxNTk0XSxbMTU3NCwxNTgyLDE1NzFdLFsxNTc1LDE1OTMsMTU4N10sWzE1ODMsMTU4MiwxNTg4XSxbMTU4MCwxNTkwLDE5OF0sWzE1ODcsMTU5MywxNTgxXSxbMTUwNSwxNTQxLDk2XSxbMTM2OSwxNTc3LDExNzddLFsxNTczLDE1NTQsMTUwNV0sWzE0NzksMTQ3OCw1NjhdLFsxNTg1LDE1ODksMTU4Nl0sWzEzNjksMTE3Nyw3MDRdLFs3NjYsMTU4NCwxMzM0XSxbOTc3LDEyNTcsMTA1OV0sWzEwOTEsMTU5MSwxNDA3XSxbMTU5MSwxMDkxLDE0NTddLFsxNTg1LDE2MDQsMTU4OV0sWzE1ODEsMTU5MiwxNTk0XSxbMTYwMiwxNTgyLDE1OTRdLFsxNTgyLDE2MDgsMTU4OF0sWzE2MDgsMTU3OSwxNTg4XSxbMTU3OSwxNTk3LDE1ODBdLFsxNDE5LDE1OTAsMTU4MF0sWzE1OTcsMTQxOSwxNTgwXSxbMTQzMSwxNTc3LDEyOTFdLFsxNTg5LDE2MDQsMTU5M10sWzE2MDEsMTU5NiwxNTkzXSxbMTU5MywxNTk2LDE1ODFdLFsxMzA2LDE1MTEsMTAyN10sWzE1MTEsMTExMywxNTczXSxbMTc4NiwxNDEyLDE1ODVdLFsxNDEyLDE2MDQsMTU4NV0sWzE1ODEsMTU5NiwxNTkyXSxbMTU5MiwxNjAyLDE1OTRdLFsxNjA4LDE1OTksMTU3OV0sWzE1OTksMTYxMSwxNTc5XSxbMTU3OSwxNjExLDE1OTddLFsxNTEyLDE0ODcsMjUzXSxbMTUxOSwxNDg5LDE0NzNdLFsxNTQ1LDE1NDAsODY4XSxbMTA4MywxMTg3LDE0MDJdLFsxMTE3LDE0MDcsMTQwMF0sWzEyOTIsNzMzLDExMjVdLFsyODQsMTI0MCwxMjQ1XSxbMTYwNCwxNjAwLDE1OTNdLFsxNjAwLDE2MDEsMTU5M10sWzE1ODIsMTYwNywxNjA4XSxbNzg5LDEzNjksNzA0XSxbMTQ2NywxNDgzLDE1MTldLFsxNjAxLDE2MTMsMTU5Nl0sWzE1OTYsMTYxMywxNTkyXSxbMTYwMiwxNjA3LDE1ODJdLFsxNjIwLDE1NTMsMTI1Ml0sWzE2MDEsMTYwNSwxNjEzXSxbMTU5MiwxNjEzLDE2MDJdLFsxNjAyLDE2MDYsMTYwN10sWzE2MDgsMTYwOSwxNTk5XSxbMTU5OSwxNjA5LDE2MTFdLFsxNjAzLDE1OTcsMTYxMV0sWzEyNjUsMTQxOSwxNTk3XSxbMTYwMywxMjY1LDE1OTddLFsxMzkyLDEyMDYsNDVdLFs5MjgsMTM2OSw3ODldLFsxNDc0LDE1MjgsMTQ3M10sWzExMDQsMTQ2OCwxNTAxXSxbMTQxMiwxNTIxLDE2MDRdLFsxNjEzLDE2MzEsMTYwMl0sWzE2MDcsMTYxMCwxNjA4XSxbMTYwOCwxNjEwLDE2MDldLFsxNDc2LDg2Myw4MzVdLFsxNDk1LDE1MDMsMTU1NV0sWzE0OTgsMTM5Nyw3MThdLFsxNTIwLDE2NjgsN10sWzE2MDQsMTYxNSwxNjAwXSxbMTYwNSwxNjAxLDE2MDBdLFsxNjAyLDE2MzEsMTYwNl0sWzE2MDYsMTYxMCwxNjA3XSxbMTc1OSwxNTk1LDE1MDBdLFsxMjkyLDEyOTgsNzMzXSxbMTYxNSwxNjA0LDE1MjFdLFsxNjA5LDE2MDMsMTYxMV0sWzY1MiwxNDYyLDE1OThdLFsxNDY4LDE1MjUsMTQ0NV0sWzE0NDMsMTUwMSwxNDQ1XSxbMTEzNCwxNzIzLDE1MF0sWzE1MjEsMTYyMiwxNjE1XSxbMTYxNSwxNjE2LDE2MDBdLFsxNjE2LDE2MDUsMTYwMF0sWzE2MDUsMTYxNiwxNjEyXSxbMTYwNSwxNjEyLDE2MTNdLFsxNjEyLDE2MTcsMTYxM10sWzE2MTMsMTYxNywxNjMxXSxbMTYwNiwxNjE0LDE2MTBdLFsxMjY1LDE2MDMsMTQwM10sWzQ0OCw0MTcsMTQ4MF0sWzE1OTUsMjUzLDE0ODddLFsxNTAxLDE0NjgsMTQ0NV0sWzEzODMsMTQ1Niw4NzddLFsxNDkwLDE0OTYsNjk2XSxbMTYxMCwxNjI3LDE2MDldLFsxNjI3LDE2MjEsMTYwOV0sWzE1OTEsMTQ4MSwxNTMzXSxbMTU5OCwxNDcxLDE0MzldLFsxMzUzLDEyNjEsNzAzXSxbMTYwNiwxNjMxLDE2MTRdLFsxNjA5LDE2MjEsMTQwM10sWzE1MzIsMTA3NywxNDk0XSxbMTUyOCwxMTE1LDUxM10sWzE1NDYsNjUyLDE0NDZdLFsxMjExLDkyOCwxMzY1XSxbMTU0MCwxNDczLDE1MjhdLFsxMDc4LDE1MDIsMTc4N10sWzE0MjUsMTQzMCwxNDM4XSxbMTYxNywxNjMwLDE2MzFdLFs5NTksNzQ5LDk0NF0sWzU2Niw1NzAsNjAzXSxbMTcxNiwzMTAsMTUyMV0sWzc3NSw0NTIsMzk3XSxbMTYxNSwxNjM2LDE2MTZdLFsxNjE2LDE2MzYsMTYxMl0sWzE2MTAsMTYzMiwxNjI3XSxbNzg5LDcwNCwxMjU4XSxbMTQ1NywxNDgxLDE1OTFdLFsxNzY5LDE3NTYsODExXSxbMjA3LDE2MjksNzIyXSxbMTYyOSwxNjI1LDcyMl0sWzEyMjQsMTI3NywxNjIyXSxbMTYyMiwxNjM2LDE2MTVdLFsxNjM2LDE2NDYsMTYxMl0sWzE2MTIsMTYzMCwxNjE3XSxbMTYzMSwxNjI2LDE2MTRdLFsxNjE0LDE2MzIsMTYxMF0sWzE1MDYsMTA0LDk1XSxbMTQ4MSwxNDU3LDExMzZdLFsxMTIzLDk0MywxNDQyXSxbOTM2LDE0NDYsMTQ5Nl0sWzE0OTksODYzLDE0NzZdLFsxNjI5LDEwMzEsMTYyNV0sWzEyMzMsMTUwOSw2ODZdLFsxNjMzLDE2MzQsMTYyMV0sWzE2MjEsMTM4NywxNDAzXSxbMTQ3MiwxNTEyLDI1M10sWzExNzcsMjA4LDcwNF0sWzEyNzcsMTYzNiwxNjIyXSxbMTYyNiwxNjMyLDE2MTRdLFsxNjI3LDE2MzMsMTYyMV0sWzkzNiwxNDk2LDE0OTBdLFsxODUsMTQ1NCwxNDUxXSxbNzMxLDkzNiwxNTEyXSxbMTYzOCwxNjM1LDIwN10sWzU1MywxMjYzLDEyNjRdLFsxNjUzLDEyMTIsMTYzOV0sWzE2MzMsMTYyNywxNjMyXSxbMTYzMywxMzg3LDE2MzRdLFsxNDU4LDEwNjAsNzMxXSxbMzY4LDEzMDcsMTExM10sWzEyNjQsMTAzMSwxNjI5XSxbMTE1Miw4NTAsMTE1MF0sWzEyNzcsMTY0NCwxNjM2XSxbMTY0NiwxNjM3LDE2MTJdLFsxNjM3LDE2MzAsMTYxMl0sWzE2NDcsMTYzMSwxNjMwXSxbMTY0NywxNjI2LDE2MzFdLFsxNDIyLDE1MjQsMTQ5NF0sWzEwMzAsNjUyLDE1NDZdLFsxNjM1LDE2MjksMjA3XSxbMTYzNSwxMjY0LDE2MjldLFsxNjM5LDE2NDYsMTYzNl0sWzE2MzcsMTY0MCwxNjMwXSxbMTY0MSwxNjMyLDE2MjZdLFsxNjMyLDE2NDIsMTYzM10sWzE2MzMsMTY0MywxMzg3XSxbODQyLDE0OTksMTE0M10sWzg2NSw4NjMsMTQ5OV0sWzE1MTYsOTc4LDE0OTJdLFs2NywxMTMwLDc4NF0sWzExMDMsMTUwNSw5Nl0sWzg4LDE0NDEsMTIwMF0sWzE2NDQsMTYzOSwxNjM2XSxbMTY0MCwxNjQ3LDE2MzBdLFsxNjQ3LDE2NDEsMTYyNl0sWzE2MzMsMTY0OCwxNjQzXSxbMTQ5MiwxNTMyLDE1MjRdLFsxNDg4LDE1MTYsMTQ5Ml0sWzEwMzcsMTQ3MSwxNDYyXSxbNjEyLDEyNjQsMTYzNV0sWzE1MDIsMTA3OCwxMTI0XSxbMTY0MSwxNjQyLDE2MzJdLFsxNjQ4LDE2MzMsMTY0Ml0sWzE1MjgsNTEzLDg2OF0sWzE0OTIsMTU5OCwxNTMyXSxbMTA5NSw5OTEsNzYwXSxbNjc5LDE1NywxNjY0XSxbNzYwLDExMjgsMTc4NV0sWzEyNzcsMTY1MCwxNjQ0XSxbMzIwLDEwMjIsMjQ0XSxbMTU1OSwxNTQ5LDg2XSxbMTY3NiwxNTIwLDddLFsxNDg4LDk3OCwxNTE2XSxbMTA5NSw3NjAsMTc4NV0sWzExMjgsMzg0LDExMjBdLFszMDQsMzEyLDE2MzhdLFsxMDgxLDE2MzgsMzEyXSxbMTA4MSwxNjM1LDE2MzhdLFsxMDMsNjEyLDE2MzVdLFs2NTIsMTQ3NywxNDYyXSxbMTY1MCwxNjQ1LDE2NDRdLFsxNjQ1LDE2MzksMTY0NF0sWzE2MzksMTYzNywxNjQ2XSxbMTY0MCwxMDkwLDE2NDddLFsxNjU0LDE2NDEsMTY0N10sWzE2NTQsMTY0MiwxNjQxXSxbMTY1NCwxNjQ4LDE2NDJdLFsxNjQzLDE0MDIsMTM4N10sWzE0MzIsMzM1LDE1MDldLFszODQsMTEyOCw3NjBdLFsxNjUyLDMxMiwzMDRdLFsxMDMsMTI0Myw2MTJdLFsxMjc3LDE2NDksMTY1MF0sWzEwOTAsMTY1NCwxNjQ3XSxbMTY0MywxNjQ4LDE0MDJdLFsxMTM0LDMyNCwxNjc1XSxbNjc5LDY4LDE1N10sWzE2NTIsMTA4MSwzMTJdLFsxMTM2LDMwMSw4MDNdLFsxNjUzLDE2MzksMTY0NV0sWzcyMywxNDQwLDEyNTldLFs4MDMsODU0LDExMzZdLFsxMDQsMTUwNiw3NDJdLFsxMTEyLDE1OSwxMDNdLFsxNjU0LDEwODMsMTY0OF0sWzk3NywxNjUxLDEyNTddLFsxMzk3LDE1MDcsNzE4XSxbMTA4MSwxMDMsMTYzNV0sWzE2NTAsNjc3LDE2NDVdLFsxMDgzLDE0MDIsMTY0OF0sWzE3MDYsMTY1NSwxNjcxXSxbMTYyNCwxNzA0LDE3MTFdLFs3NjcsMiwxXSxbNjA4LDc5NCwyOTRdLFsxNjc4LDE2ODMsMTY4Nl0sWzc2NywxNjgyLDJdLFsxNjY5LDE2OTIsMTY3NV0sWzI5NiwxNjgxLDc2NF0sWzE2NzEsMTY1NiwxNjcyXSxbMTcsMTY3MywxNjc5XSxbMTcwNiwxNjcxLDE2NzNdLFsxNjYyLDE2NzQsMTY5OV0sWzE2NTUsMTY1NywxNjU2XSxbNDE4LDg0LDkxNV0sWzE1MjYsMTUxNCw3NjRdLFsxNjU4LDE2NTcsNTY3XSxbODcwLDE2OTUsNzY0XSxbODEzLDE2OTcsOThdLFsxNjU5LDgyMSw1XSxbNjAsMTAxMyw4NDhdLFsxMDEzLDExMCwxMjEzXSxbNjYxLDEwMzgsMTY5Ml0sWzE2NjAsMTcwMywxN10sWzE2OTMsMTY3MywxN10sWzE2NjMsMTcxNSwxNzQzXSxbMTAxMywxMTUsMTEwXSxbMzQ0LDE3MzMsMzJdLFsxNjcwLDE2NjMsMTc0M10sWzE2NzAsMTc0MywxNzM4XSxbMTY3NywxNjcwLDE3MzhdLFsxNjYxLDQsM10sWzEwODQsMTY4MywxNjc4XSxbMTcyOCw3OTMsMTEzMF0sWzE2ODMsMTc2NywxMTk2XSxbMTY3NywxNzM4LDExOTZdLFsxMjc5LDE3ODYsODUzXSxbMjk0LDEwMzgsNjA4XSxbMTI3OSwxNjg5LDE3ODZdLFs4NzAsMTgsMTcwOF0sWzg3MCwxNjgwLDE2OTVdLFsxNzA1LDEwLDE2NzBdLFsxMDg0LDE3NjcsMTY4M10sWzExOTYsMTczOCwxNjg2XSxbMTc1MCw4NzAsMTY4MV0sWzE3NTAsMTgsODcwXSxbMTc3MywxNzAzLDE2NjBdLFsxMTM1LDQ3LDQyNV0sWzE1MCwzMjMsMTEzNF0sWzE3MDcsMTY1NSwxNzA2XSxbMTc0MSwzNDQsMTY4N10sWzE2ODUsMTY5MSwxNjg0XSxbMTY4NCwxNjkxLDgwMl0sWzE2NzIsMTY1NiwwXSxbMTAzOCwxMjQsNjA4XSxbMTY3MSwxNjcyLDE2OTBdLFsxNjI4LDEyMTgsMTc2N10sWzE2ODYsMTI3NSwxNjY3XSxbMTQ5MywxNzUwLDE2ODFdLFsxNzczLDE4LDE3NTBdLFsxNzczLDE2NjAsMThdLFsxNjc5LDE2NzEsMTZdLFsxNzM1LDE3MDYsMTY3M10sWzE2NjcsMTY3OCwxNjg2XSxbMTY4OCwxNjU4LDFdLFsxNjU2LDE2ODgsMF0sWzEyOTMsMTI4MSwxNDU4XSxbMTY5OCwxNjc4LDE2NjddLFsxNjk2LDExMzAsMTcyMl0sWzE2OTgsMTY2NywxNjk2XSxbMTcxNSwxNjYyLDE2OTldLFsxNjkyLDEwMzgsMjk0XSxbMTY4Miw3NjcsMzU3XSxbMTY2OSw2NjEsMTY5Ml0sWzgwMiwxNzAyLDgyNF0sWzEwMjgsMTA2NywxNzg0XSxbODIyLDE2MjQsNzc4XSxbMTE5LDgxMyw4NjFdLFsxMjE4LDE2NzAsMTY3N10sWzE3MDMsMTY5MywxN10sWzE2NTgsMTcxMCwxXSxbNzUwLDE3MzAsMTcyOV0sWzE3MDEsNzUwLDE3MjldLFsxNjkzLDE3MzUsMTY3M10sWzE3MzEsMTY5NCw5OF0sWzE2OTEsMTcwMiw4MDJdLFs3ODMsMTcyOSwxNzE5XSxbMTY4MCw4NzAsMTcwOF0sWzE3MDcsMTcwOSwxNjU1XSxbNTMzLDc1Niw2NzVdLFsxNjkxLDEyMTAsMTcwMl0sWzExLDE3MDUsMTY3MF0sWzE3NjcsMTIxOCwxMTk2XSxbMTIxOCwxNjc3LDExOTZdLFsxNjY0LDE3MTYsMTcyMV0sWzE3MjksMTcyNSwxNzE5XSxbMTcyOSwxMDcyLDE3MjVdLFsxMjEwLDExMTYsMTcwMl0sWzE3MDIsMTcyMCw4MjRdLFsxNjgyLDE2NjEsMl0sWzE3MTMsMTcxOSwxNzIxXSxbMTcxNiwxNzg2LDE3MTNdLFsxNzMwLDE3MjIsMTA3Ml0sWzI5NCwxNzE3LDE4MTFdLFsxNjkyLDI5NCwxNjY2XSxbMTY1OSw2ODAsODIxXSxbODI0LDE3MjAsMTcxNF0sWzE3MjYsMTczMSwxNzE4XSxbMzQ1LDEwNjIsMTA0NV0sWzE3MzgsMTc0MywxMjc1XSxbMTA3NSwxMDg5LDEwNzFdLFs3ODMsMTcxOSwxNjg5XSxbMTI3NSw2ODQsMTcyOF0sWzE2OTIsMTY2NiwxNjY1XSxbMTY3NSwxNjkyLDE2NjVdLFsyOTQsMTgxMSwxNjY2XSxbMTcxNiwxNjY0LDMxMF0sWzE2NzgsMTY5OCwxNzAwXSxbNiw5LDE3MjddLFs2NzYsNjQ5LDU5NV0sWzM4MSwzMSwzNjFdLFsxNzIzLDE4MDQsMTc3Ml0sWzE3MjcsOSwxNjk0XSxbMTcyMCwxMDg5LDE3MTRdLFsxNzg2LDE3MTYsMTQxMl0sWzE2ODMsMTE5NiwxNjg2XSxbMTcxOCwxNjk3LDEwODVdLFsxMTE2LDE3MzksMTcwMl0sWzE3MzksMTczNCwxNzIwXSxbMTcwMiwxNzM5LDE3MjBdLFsxMDg5LDE3MjAsMTczNF0sWzUwOSw3NDgsMTc0NV0sWzE3NDMsMTcxNSwxNzI2XSxbMTcxNywyOTQsNzk0XSxbMTExNiwxNzMyLDE3MzldLFsxNzE4LDE3MzEsMTY5N10sWzE2OTYsMTY2NywxMTMwXSxbMTEzNCwxNjY1LDE3MjNdLFsxNjk0LDcxMiw5OF0sWzEwMSwxNjg3LDEwMl0sWzM5MSwxNzM2LDEwMV0sWzY2Miw2MzYsNjQyXSxbMTczNCwxNDQ3LDEwODldLFsxMDg5LDE0NDcsMTA3MV0sWzQzNiw5OSw0OTNdLFsxNjg5LDEyNzksNzgzXSxbMTQ4NSwxNDY1LDEzNDJdLFsxNzM2LDE2ODcsMTAxXSxbMzQ0LDE3NDEsMTczM10sWzE3NDEsMTc0MiwxNzMzXSxbMTczNSw4MjksMTcwNl0sWzgyOSwxNzA3LDE3MDZdLFsxNDg1LDEzMzIsMTQ2NV0sWzk1MiwxMTI2LDE3NDJdLFsxNzQ3LDE0NDcsMTczNF0sWzg3OSw4OTIsNjQ1XSxbMTczMCwxMTQ2LDE2OTZdLFs4MjksMTcwOSwxNzA3XSxbMTcwOSwxNzEyLDE2NTVdLFsxMTgsMTczOSwxNzMyXSxbMTMzMiwxNzQ0LDE0NjVdLFsxNjg3LDE3NDksMTc0MV0sWzE3NDEsMTc1OCwxNzQyXSxbNjc5LDEwNzIsNjhdLFsxMDcyLDE3MjIsNjhdLFsxMTgsMTc0NywxNzM5XSxbMTc0NywxNzM0LDE3MzldLFsxNDY1LDE3NDQsMTczNl0sWzE3MzYsMTc0MCwxNjg3XSxbMTcwNCwxNzAxLDc4M10sWzE2NjUsNjI0LDE3MjNdLFsxNzIyLDExMzAsNjddLFsxMDI1LDEwNTUsNDY3XSxbMTQ0NCwxNCwxNzAxXSxbNTU4LDUyMiw1MzBdLFsxNjU3LDE2NTgsMTY4OF0sWzEzMzksMTc0NiwxMzMyXSxbMTMzMiwxNzQ4LDE3NDRdLFsxNjg3LDE3NDAsMTc0OV0sWzE3NDEsMTc0OSwxNzU4XSxbMTEwOSw5NTIsMTc0Ml0sWzE3NDcsMTE4LDE0MV0sWzE2NzEsMTY5MCwxNjI4XSxbMTY3MSwxNjI4LDE2XSxbMTY1NywxNjg4LDE2NTZdLFsxNzQ1LDc0OCwxNDQ3XSxbMzU3LDc2NywxNzEwXSxbMTc0NiwxNzQ4LDEzMzJdLFsxMTQ2LDE3MDAsMTY5OF0sWzE3NTksMTMwNywxMzM4XSxbMTIzOSw3ODEsMTMyMl0sWzE3NDUsMTQ0NywxNzQ3XSxbNTIyLDE3NDUsMTc0N10sWzMxNiw3MTcsNTk1XSxbMTQ4LDE0OTMsMTcyNF0sWzE3NTgsMTEwOSwxNzQyXSxbMTcyNSwxMDcyLDY3OV0sWzcyNiw3MTksMTY2MV0sWzE2OTUsMTY4MCwxNTI2XSxbMTc3MiwxNzUwLDE0OTNdLFsxNDgsMTc3MiwxNDkzXSxbMTU0MiwxNzUxLDExMDFdLFs5NTIsMTEwOSwxMDg2XSxbMTc0NCwxNzUyLDE3MzZdLFsxNzM2LDE3NTIsMTc0MF0sWzE3NTMsMTc1NSwxNzQwXSxbMzkxLDEzNDIsMTczNl0sWzgyMSwxMTIsMTUyMF0sWzU1Nyw1MzAsMTc0N10sWzUzMCw1MjIsMTc0N10sWzk5NCw4NzksNjQ1XSxbMTU0MiwxNzU2LDE3NTFdLFsxODEzLDE2OTMsMTcwM10sWzE3NDYsMTc1NCwxNzQ4XSxbMTc0OCwxNzY0LDE3NDRdLFsxNzUyLDE3NTcsMTc0MF0sWzE3NDAsMTc1NywxNzUzXSxbMTc0OSwxNzQwLDE3NTVdLFsxNzU1LDE3NjMsMTc0OV0sWzE3NjMsMTc1OCwxNzQ5XSxbMTI3NSwxNzQzLDY4NF0sWzE4MTMsMTczNSwxNjkzXSxbMTEwNywxMDk5LDExMDFdLFsxNzIzLDYyNCwxODA0XSxbMTQwMywxNjAzLDE2MDldLFsxNzQ4LDE3NTQsMTc2NF0sWzE3NDQsMTc1NywxNzUyXSxbMTc2MCwxMTA5LDE3NThdLFsxNDY1LDE3MzYsMTM0Ml0sWzQzNiwxMTUsOTldLFsxNjg2LDE3MzgsMTI3NV0sWzE3NTEsMTc2NiwxMTAxXSxbMTc1OSwxNzU0LDE3NDZdLFsxNzU1LDE3NTMsMTc2M10sWzE1NzAsMTI3OSw4NTNdLFsxNzAxLDExNDYsNzUwXSxbMTY1NSwxNjU2LDE2NzFdLFsxMSwxNjcwLDEyMThdLFsxNzYxLDE3NTEsMTc1Nl0sWzE3NjYsMTEwNywxMTAxXSxbMTcyNiwxNjIzLDE3MzFdLFsxNzExLDE3MDQsMTI3OV0sWzY3LDc4NCw2OF0sWzU1OCw1MzAsNTQ1XSxbMTYyMCwxNjE4LDEyMzNdLFsxNzY5LDE3NjEsMTc1Nl0sWzEwMiwxNjg3LDM0NF0sWzEzMzgsMTc1NCwxNzU5XSxbMTc1NCwyMzIsMTc2NF0sWzE3NDQsMTc2NSwxNzU3XSxbMTc1NywxNzYzLDE3NTNdLFsxNzYyLDE3NjAsMTc1OF0sWzE3NjAsMTc3MSwxMTA5XSxbMTMzOSwxNzU5LDE3NDZdLFsxNjc1LDE2NjUsMTEzNF0sWzE3MzAsMTY5NiwxNzIyXSxbMTc3NCwxNzUxLDE3NjFdLFsxNzY2LDE3ODAsMTEwN10sWzE3ODAsMTEwNSwxMTA3XSxbMTc2NCwxNzY1LDE3NDRdLFsxNzYzLDE3NjIsMTc1OF0sWzE3NzIsMTc3MywxNzUwXSxbMTgxMSwxODEzLDE3MDNdLFsxNDM0LDE3NjksMTQzMl0sWzE3ODAsMTc2NiwxNzUxXSxbMjMyLDE3ODEsMTc2NF0sWzE3MTEsMTI3OSwxNTcwXSxbMTY4OCwxLDBdLFsxNzc0LDE3ODAsMTc1MV0sWzE3NjQsMTc4MSwxNzY1XSxbMTc2NSwxNzY4LDE3NTddLFsxNzU3LDE3NjgsMTc2M10sWzE3NzcsMTc4MiwxNzYwXSxbMTc2MiwxNzc3LDE3NjBdLFsxNzY5LDE3NzQsMTc2MV0sWzE3NjMsMTc3NywxNzYyXSxbMTc2MCwxNzgyLDE3NzFdLFsyMzIsMTczNywxNzgxXSxbMTc2OCwxNzc2LDE3NjNdLFsyNzIsMjU1LDc3NF0sWzE2NjksOTk0LDY2MV0sWzE2MTgsMTc2OSwxNDM0XSxbMTc2NSw1ODksMTc2OF0sWzE3NzAsMTc3NywxNzYzXSxbMTcwMSwxNzI5LDc4M10sWzE3ODMsMTc3NCwxNzY5XSxbMTc4OSwxNzgwLDE3NzRdLFs1ODksMTc3NSwxNzY4XSxbMTc3NiwxNzcwLDE3NjNdLFsxNzgyLDE3NzgsMTc3MV0sWzE3NzEsMTc3OCwxMDcwXSxbNjI0LDE3MDMsMTc3M10sWzYyNCwxODExLDE3MDNdLFsxNjIwLDEyNDQsMTYxOF0sWzE3NzksMTc2OSwxNjE4XSxbMTc3OSwxNzgzLDE3NjldLFs3MzksMTczNSwxODEzXSxbMTc3NSwxNzc2LDE3NjhdLFsxNzkwLDE3NzcsMTc3MF0sWzE3NzcsMTc3OCwxNzgyXSxbMTcyNSw2NzksMTcyMV0sWzczMywxMjkzLDE0NThdLFsxODAyLDE2MTgsMTI0NF0sWzE4MDIsMTc3OSwxNjE4XSxbMTc4OCwxNzgzLDE3NzldLFsxNzg5LDE3NzQsMTc4M10sWzE3OTYsMTc4MCwxNzg5XSxbMTc5NiwxMTE5LDE3ODBdLFsxODIzLDE4MTcsMzI1XSxbMTY5OSwxNzI3LDE2MjNdLFs3NTAsMTE0NiwxNzMwXSxbMTQ5NywxNzI0LDI5Nl0sWzExMjgsMTExOSwxNzk2XSxbNjEsNjIsNzFdLFsxMTMxLDQxMyw4MjRdLFsxMTE0LDExMTEsMjQ5XSxbMTc4NCwxNzc2LDE3NzVdLFsxMTIzLDcyMywxMjgzXSxbMTc5MSwxNzg4LDE3NzldLFsxNzg4LDE3ODksMTc4M10sWzEwOTUsMTc5NywxMDc0XSxbMTAyOCwxNzg0LDE3NzVdLFsxNzg0LDE3NzAsMTc3Nl0sWzE3NzcsMTc5MCwxNzc4XSxbMTc5MywxNzk3LDEwOTVdLFsxNzk3LDE4MDAsMTA3NF0sWzE3OTgsMTc5MCwxNzcwXSxbMTgwNSwxODAyLDEyNDRdLFsxODAyLDE3OTEsMTc3OV0sWzE3OTIsMTc4OSwxNzg4XSxbMTc5MywxNzg1LDExMjhdLFsxNzkzLDEwOTUsMTc4NV0sWzEwNzQsMTgwMCwxNjE5XSxbNzQxLDQ1Nyw1OTNdLFsxNzk4LDE3NzAsMTc4NF0sWzE3OTgsMTc5NCwxNzkwXSxbMTc4NiwxNjg5LDE3MTNdLFs2ODQsMTcyNiwxNzE4XSxbMTcyOCwxMDg1LDc5M10sWzE3OTUsMTc4NywxNTAyXSxbMTgwNiwxODAyLDE4MDVdLFsxODE5LDE3ODgsMTc5MV0sWzEwNjcsMTc5OCwxNzg0XSxbMTc5MCwxNzk0LDE3NzhdLFsxNzk1LDE1MDIsMTEyNF0sWzE4MDEsMTgwNSwxNzg3XSxbMTgwNywxNzkxLDE4MDJdLFsxODA3LDE4MTksMTc5MV0sWzE4MTksMTc5MiwxNzg4XSxbMTc5OSwxMTI4LDE3OTZdLFs5OTQsNjQ1LDY2MV0sWzY4NCwxMDg1LDE3MjhdLFs2ODQsMTcxOCwxMDg1XSxbMTY5OSwxNjIzLDE3MjZdLFsxODAxLDE3ODcsMTc5NV0sWzE4MDgsMTc4OSwxNzkyXSxbMTgwOCwxNzk2LDE3ODldLFsxNzk5LDE3OTMsMTEyOF0sWzE4MDksMTc5NywxNzkzXSxbMTgwOSwxODAzLDE3OTddLFsxODAzLDE4MDAsMTc5N10sWzEwNjcsMTc5NCwxNzk4XSxbNzc0LDI1NSwxNzc4XSxbMTY3MywxNjcxLDE2NzldLFs4NzksMTY2OSw4ODhdLFsxOSwxODA3LDE4MDJdLFsxODEwLDE2MTksMTgwMF0sWzg3OSw5OTQsMTY2OV0sWzE3OTQsNzc0LDE3NzhdLFsxNzIzLDE3NzIsMTQ4XSxbMTgwNCwxNzczLDE3NzJdLFsxODE0LDE3OTUsMTEyNF0sWzE2NDksMTgxNCwxMTI0XSxbMTgxNCwxODAxLDE3OTVdLFsxODEyLDE4MDYsMTgwNV0sWzE5LDE4MDIsMTgwNl0sWzE5LDE4MTksMTgwN10sWzE4MTAsMTgwMCwxODAzXSxbMTgwNCw2MjQsMTc3M10sWzE3MTQsMTEzMSw4MjRdLFsxODAxLDE4MTIsMTgwNV0sWzE4MTIsMTksMTgwNl0sWzE4MDgsMTc5MiwxODE5XSxbMTc5OSwxODA5LDE3OTNdLFsxODIxLDE4MTAsMTgwM10sWzE3MTcsNzM5LDE4MTNdLFsxMDYxLDE2MTksMTgyMl0sWzE3OTQsMTgxNyw3NzRdLFs3OSwxNDgyLDE0NF0sWzE4MTUsMTgwMSwxODE0XSxbMjMsMTgxOSwxOV0sWzU4OSwxMDI4LDE3NzVdLFsxODE3LDE4MjMsNzc0XSxbMTY4OSwxNzE5LDE3MTNdLFsxODI0LDE4MTQsMTY0OV0sWzE4MjcsMTgxOCwxODAxXSxbMTgxOCwxODEyLDE4MDFdLFsxODE4LDE5LDE4MTJdLFsxODE4LDIwLDE5XSxbMTgxNiwxODA5LDE3OTldLFsxODIxLDE4MDMsMTgwOV0sWzE4MjIsMTYxOSwxODEwXSxbMTI0LDcwOCw2MDhdLFsxNjYzLDEwLDE3MTVdLFsxODE1LDE4MjcsMTgwMV0sWzE4MjAsMTgwOCwxODE5XSxbMjMsMTgyMCwxODE5XSxbNjAzLDE4MTAsMTgyMV0sWzYwMywxODIyLDE4MTBdLFsxMDg1LDE2OTcsNzkzXSxbMTYyOCwxNjkwLDExXSxbMTUyNywxNzA0LDE2MjRdLFsxNzMwLDEwNzIsMTcyOV0sWzE1MjYsMTQ0NCwxNzA0XSxbMTUyNiwxNjgwLDE0NDRdLFsxNzA0LDE0NDQsMTcwMV0sWzE4MTYsMTgyMSwxODA5XSxbMTcyMiw2Nyw2OF0sWzMxNywyNzIsMTgyM10sWzE3MTYsMTcxMywxNzIxXSxbMTYsMTYyOCwxNzY3XSxbMTUyNywxNTI2LDE3MDRdLFsxODI0LDE4MjYsMTgxNF0sWzE4MTQsMTgyNiwxODE1XSxbMTgxOCwyMSwyMF0sWzE4MzUsMTgwOCwxODIwXSxbNjAzLDU3MCwxODIyXSxbMjI2LDEwNzAsMTc3OF0sWzEwMTMsMTE4MSwxMTc5XSxbMTcyMSw2NzksMTY2NF0sWzE3MTcsMTgxMywxODExXSxbMTgyOCwxODI3LDE4MTVdLFsyMiwxODIwLDIzXSxbMjIsMTgzNSwxODIwXSxbMTgzMCw2MDMsMTgyMV0sWzcxOSwxNjU5LDVdLFs2NDMsNTY3LDE2NTddLFsxNzE3LDc5NCw3MzldLFsxODI1LDE4MjYsMTgyNF0sWzE4MjgsMTgxNSwxODI2XSxbMTgyOSwyMSwxODE4XSxbMTgwOCwxODM1LDEzXSxbNCw3MTksNV0sWzEwLDE2NjIsMTcxNV0sWzE4MjgsMTgzMiwxODI3XSxbMTgzMiwxODE4LDE4MjddLFsxMiwxODMzLDE4MTZdLFsxODMzLDE4MjEsMTgxNl0sWzE4MzMsMTgzMCwxODIxXSxbMTQsMTE0NiwxNzAxXSxbMTE4NiwxODI5LDE4MThdLFsxMjgwLDYwMywxODMwXSxbMTQsMTcwMCwxMTQ2XSxbMTY2NywxNzI4LDExMzBdLFsxODI1LDE4MzQsMTgyNl0sWzE4MzQsMTgyOCwxODI2XSxbMTgzMiwxMTg2LDE4MThdLFsxODM2LDEzLDE4MzVdLFsxNjI0LDE3MTEsMTU3MF0sWzc3OCwxNjI0LDE1NzBdLFsxNzE5LDE3MjUsMTcyMV0sWzEwMDIsMTgyNSwxODMxXSxbMTAwMiwxODM0LDE4MjVdLFsxODM0LDE4MzIsMTgyOF0sWzExODYsMjEsMTgyOV0sWzE4MzYsMTgzNSwyMl0sWzE4MzcsMTgzMywxMl0sWzEyODAsMTgzMCwxODMzXSxbMTY2NywxMjc1LDE3MjhdLFsxNiwxNzY3LDEwODRdLFs1ODksMTc2NSwxODM4XSxbMTc2NSwxNzgxLDE4MzhdLFsxNzgxLDE3MzcsMTgzOF0sWzE3MzcsOTgyLDE4MzhdLFs5ODIsMTA1MywxODM4XSxbMTA1Myw4MTYsMTgzOF0sWzgxNiw1ODksMTgzOF1dXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGFkam9pbnQ7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgYWRqdWdhdGUgb2YgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5mdW5jdGlvbiBhZGpvaW50KG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLCBhMTEgPSBhWzVdLCBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICBhMjAgPSBhWzhdLCBhMjEgPSBhWzldLCBhMjIgPSBhWzEwXSwgYTIzID0gYVsxMV0sXG4gICAgICAgIGEzMCA9IGFbMTJdLCBhMzEgPSBhWzEzXSwgYTMyID0gYVsxNF0sIGEzMyA9IGFbMTVdO1xuXG4gICAgb3V0WzBdICA9ICAoYTExICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjEgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSArIGEzMSAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpKTtcbiAgICBvdXRbMV0gID0gLShhMDEgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMSAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMxICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikpO1xuICAgIG91dFsyXSAgPSAgKGEwMSAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpIC0gYTExICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzEgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgb3V0WzNdICA9IC0oYTAxICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikgLSBhMTEgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSArIGEyMSAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICBvdXRbNF0gID0gLShhMTAgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMCAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpICsgYTMwICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikpO1xuICAgIG91dFs1XSAgPSAgKGEwMCAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIwICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzAgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSk7XG4gICAgb3V0WzZdICA9IC0oYTAwICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgLSBhMTAgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMCAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICBvdXRbN10gID0gIChhMDAgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSAtIGExMCAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpICsgYTIwICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgIG91dFs4XSAgPSAgKGExMCAqIChhMjEgKiBhMzMgLSBhMjMgKiBhMzEpIC0gYTIwICogKGExMSAqIGEzMyAtIGExMyAqIGEzMSkgKyBhMzAgKiAoYTExICogYTIzIC0gYTEzICogYTIxKSk7XG4gICAgb3V0WzldICA9IC0oYTAwICogKGEyMSAqIGEzMyAtIGEyMyAqIGEzMSkgLSBhMjAgKiAoYTAxICogYTMzIC0gYTAzICogYTMxKSArIGEzMCAqIChhMDEgKiBhMjMgLSBhMDMgKiBhMjEpKTtcbiAgICBvdXRbMTBdID0gIChhMDAgKiAoYTExICogYTMzIC0gYTEzICogYTMxKSAtIGExMCAqIChhMDEgKiBhMzMgLSBhMDMgKiBhMzEpICsgYTMwICogKGEwMSAqIGExMyAtIGEwMyAqIGExMSkpO1xuICAgIG91dFsxMV0gPSAtKGEwMCAqIChhMTEgKiBhMjMgLSBhMTMgKiBhMjEpIC0gYTEwICogKGEwMSAqIGEyMyAtIGEwMyAqIGEyMSkgKyBhMjAgKiAoYTAxICogYTEzIC0gYTAzICogYTExKSk7XG4gICAgb3V0WzEyXSA9IC0oYTEwICogKGEyMSAqIGEzMiAtIGEyMiAqIGEzMSkgLSBhMjAgKiAoYTExICogYTMyIC0gYTEyICogYTMxKSArIGEzMCAqIChhMTEgKiBhMjIgLSBhMTIgKiBhMjEpKTtcbiAgICBvdXRbMTNdID0gIChhMDAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMDEgKiBhMzIgLSBhMDIgKiBhMzEpICsgYTMwICogKGEwMSAqIGEyMiAtIGEwMiAqIGEyMSkpO1xuICAgIG91dFsxNF0gPSAtKGEwMCAqIChhMTEgKiBhMzIgLSBhMTIgKiBhMzEpIC0gYTEwICogKGEwMSAqIGEzMiAtIGEwMiAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTEyIC0gYTAyICogYTExKSk7XG4gICAgb3V0WzE1XSA9ICAoYTAwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkgLSBhMTAgKiAoYTAxICogYTIyIC0gYTAyICogYTIxKSArIGEyMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0NCBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gYSBtYXRyaXggdG8gY2xvbmVcbiAqIEByZXR1cm5zIHttYXQ0fSBhIG5ldyA0eDQgbWF0cml4XG4gKi9cbmZ1bmN0aW9uIGNsb25lKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICBvdXRbNF0gPSBhWzRdO1xuICAgIG91dFs1XSA9IGFbNV07XG4gICAgb3V0WzZdID0gYVs2XTtcbiAgICBvdXRbN10gPSBhWzddO1xuICAgIG91dFs4XSA9IGFbOF07XG4gICAgb3V0WzldID0gYVs5XTtcbiAgICBvdXRbMTBdID0gYVsxMF07XG4gICAgb3V0WzExXSA9IGFbMTFdO1xuICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICBvdXRbMTNdID0gYVsxM107XG4gICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGNvcHk7XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIG1hdDQgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gY29weShvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICBvdXRbOV0gPSBhWzldO1xuICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICBvdXRbMTFdID0gYVsxMV07XG4gICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIHJldHVybiBvdXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gY3JlYXRlO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0NFxuICpcbiAqIEByZXR1cm5zIHttYXQ0fSBhIG5ldyA0eDQgbWF0cml4XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDE7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGRldGVybWluYW50O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICovXG5mdW5jdGlvbiBkZXRlcm1pbmFudChhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sIGExMSA9IGFbNV0sIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sIGEyMSA9IGFbOV0sIGEyMiA9IGFbMTBdLCBhMjMgPSBhWzExXSxcbiAgICAgICAgYTMwID0gYVsxMl0sIGEzMSA9IGFbMTNdLCBhMzIgPSBhWzE0XSwgYTMzID0gYVsxNV0sXG5cbiAgICAgICAgYjAwID0gYTAwICogYTExIC0gYTAxICogYTEwLFxuICAgICAgICBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTAsXG4gICAgICAgIGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMCxcbiAgICAgICAgYjAzID0gYTAxICogYTEyIC0gYTAyICogYTExLFxuICAgICAgICBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTEsXG4gICAgICAgIGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMixcbiAgICAgICAgYjA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwLFxuICAgICAgICBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzAsXG4gICAgICAgIGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMCxcbiAgICAgICAgYjA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxLFxuICAgICAgICBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzEsXG4gICAgICAgIGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMjtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICByZXR1cm4gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZyb21RdWF0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24uXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtxdWF0NH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbmZ1bmN0aW9uIGZyb21RdWF0KG91dCwgcSkge1xuICAgIHZhciB4ID0gcVswXSwgeSA9IHFbMV0sIHogPSBxWzJdLCB3ID0gcVszXSxcbiAgICAgICAgeDIgPSB4ICsgeCxcbiAgICAgICAgeTIgPSB5ICsgeSxcbiAgICAgICAgejIgPSB6ICsgeixcblxuICAgICAgICB4eCA9IHggKiB4MixcbiAgICAgICAgeXggPSB5ICogeDIsXG4gICAgICAgIHl5ID0geSAqIHkyLFxuICAgICAgICB6eCA9IHogKiB4MixcbiAgICAgICAgenkgPSB6ICogeTIsXG4gICAgICAgIHp6ID0geiAqIHoyLFxuICAgICAgICB3eCA9IHcgKiB4MixcbiAgICAgICAgd3kgPSB3ICogeTIsXG4gICAgICAgIHd6ID0gdyAqIHoyO1xuXG4gICAgb3V0WzBdID0gMSAtIHl5IC0geno7XG4gICAgb3V0WzFdID0geXggKyB3ejtcbiAgICBvdXRbMl0gPSB6eCAtIHd5O1xuICAgIG91dFszXSA9IDA7XG5cbiAgICBvdXRbNF0gPSB5eCAtIHd6O1xuICAgIG91dFs1XSA9IDEgLSB4eCAtIHp6O1xuICAgIG91dFs2XSA9IHp5ICsgd3g7XG4gICAgb3V0WzddID0gMDtcblxuICAgIG91dFs4XSA9IHp4ICsgd3k7XG4gICAgb3V0WzldID0genkgLSB3eDtcbiAgICBvdXRbMTBdID0gMSAtIHh4IC0geXk7XG4gICAgb3V0WzExXSA9IDA7XG5cbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcblxuICAgIHJldHVybiBvdXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb247XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgcXVhdGVybmlvbiByb3RhdGlvbiBhbmQgdmVjdG9yIHRyYW5zbGF0aW9uXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCB2ZWMpO1xuICogICAgIHZhciBxdWF0TWF0ID0gbWF0NC5jcmVhdGUoKTtcbiAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XG4gKiAgICAgbWF0NC5tdWx0aXBseShkZXN0LCBxdWF0TWF0KTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3F1YXQ0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7dmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24ob3V0LCBxLCB2KSB7XG4gICAgLy8gUXVhdGVybmlvbiBtYXRoXG4gICAgdmFyIHggPSBxWzBdLCB5ID0gcVsxXSwgeiA9IHFbMl0sIHcgPSBxWzNdLFxuICAgICAgICB4MiA9IHggKyB4LFxuICAgICAgICB5MiA9IHkgKyB5LFxuICAgICAgICB6MiA9IHogKyB6LFxuXG4gICAgICAgIHh4ID0geCAqIHgyLFxuICAgICAgICB4eSA9IHggKiB5MixcbiAgICAgICAgeHogPSB4ICogejIsXG4gICAgICAgIHl5ID0geSAqIHkyLFxuICAgICAgICB5eiA9IHkgKiB6MixcbiAgICAgICAgenogPSB6ICogejIsXG4gICAgICAgIHd4ID0gdyAqIHgyLFxuICAgICAgICB3eSA9IHcgKiB5MixcbiAgICAgICAgd3ogPSB3ICogejI7XG5cbiAgICBvdXRbMF0gPSAxIC0gKHl5ICsgenopO1xuICAgIG91dFsxXSA9IHh5ICsgd3o7XG4gICAgb3V0WzJdID0geHogLSB3eTtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHh5IC0gd3o7XG4gICAgb3V0WzVdID0gMSAtICh4eCArIHp6KTtcbiAgICBvdXRbNl0gPSB5eiArIHd4O1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geHogKyB3eTtcbiAgICBvdXRbOV0gPSB5eiAtIHd4O1xuICAgIG91dFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSB2WzBdO1xuICAgIG91dFsxM10gPSB2WzFdO1xuICAgIG91dFsxNF0gPSB2WzJdO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIFxuICAgIHJldHVybiBvdXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnJ1c3R1bTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBmcnVzdHVtIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge051bWJlcn0gbGVmdCBMZWZ0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gcmlnaHQgUmlnaHQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSBib3R0b20gQm90dG9tIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gdG9wIFRvcCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IG5lYXIgTmVhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gZnJ1c3R1bShvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gICAgdmFyIHJsID0gMSAvIChyaWdodCAtIGxlZnQpLFxuICAgICAgICB0YiA9IDEgLyAodG9wIC0gYm90dG9tKSxcbiAgICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFswXSA9IChuZWFyICogMikgKiBybDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IChuZWFyICogMikgKiB0YjtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gKHJpZ2h0ICsgbGVmdCkgKiBybDtcbiAgICBvdXRbOV0gPSAodG9wICsgYm90dG9tKSAqIHRiO1xuICAgIG91dFsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICBvdXRbMTFdID0gLTE7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IChmYXIgKiBuZWFyICogMikgKiBuZjtcbiAgICBvdXRbMTVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuXG4vKipcbiAqIFNldCBhIG1hdDQgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KG91dCkge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAxO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDE7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogcmVxdWlyZSgnLi9jcmVhdGUnKVxuICAsIGNsb25lOiByZXF1aXJlKCcuL2Nsb25lJylcbiAgLCBjb3B5OiByZXF1aXJlKCcuL2NvcHknKVxuICAsIGlkZW50aXR5OiByZXF1aXJlKCcuL2lkZW50aXR5JylcbiAgLCB0cmFuc3Bvc2U6IHJlcXVpcmUoJy4vdHJhbnNwb3NlJylcbiAgLCBpbnZlcnQ6IHJlcXVpcmUoJy4vaW52ZXJ0JylcbiAgLCBhZGpvaW50OiByZXF1aXJlKCcuL2Fkam9pbnQnKVxuICAsIGRldGVybWluYW50OiByZXF1aXJlKCcuL2RldGVybWluYW50JylcbiAgLCBtdWx0aXBseTogcmVxdWlyZSgnLi9tdWx0aXBseScpXG4gICwgdHJhbnNsYXRlOiByZXF1aXJlKCcuL3RyYW5zbGF0ZScpXG4gICwgc2NhbGU6IHJlcXVpcmUoJy4vc2NhbGUnKVxuICAsIHJvdGF0ZTogcmVxdWlyZSgnLi9yb3RhdGUnKVxuICAsIHJvdGF0ZVg6IHJlcXVpcmUoJy4vcm90YXRlWCcpXG4gICwgcm90YXRlWTogcmVxdWlyZSgnLi9yb3RhdGVZJylcbiAgLCByb3RhdGVaOiByZXF1aXJlKCcuL3JvdGF0ZVonKVxuICAsIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uOiByZXF1aXJlKCcuL2Zyb21Sb3RhdGlvblRyYW5zbGF0aW9uJylcbiAgLCBmcm9tUXVhdDogcmVxdWlyZSgnLi9mcm9tUXVhdCcpXG4gICwgZnJ1c3R1bTogcmVxdWlyZSgnLi9mcnVzdHVtJylcbiAgLCBwZXJzcGVjdGl2ZTogcmVxdWlyZSgnLi9wZXJzcGVjdGl2ZScpXG4gICwgcGVyc3BlY3RpdmVGcm9tRmllbGRPZlZpZXc6IHJlcXVpcmUoJy4vcGVyc3BlY3RpdmVGcm9tRmllbGRPZlZpZXcnKVxuICAsIG9ydGhvOiByZXF1aXJlKCcuL29ydGhvJylcbiAgLCBsb29rQXQ6IHJlcXVpcmUoJy4vbG9va0F0JylcbiAgLCBzdHI6IHJlcXVpcmUoJy4vc3RyJylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGludmVydDtcblxuLyoqXG4gKiBJbnZlcnRzIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gaW52ZXJ0KG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLCBhMTEgPSBhWzVdLCBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICBhMjAgPSBhWzhdLCBhMjEgPSBhWzldLCBhMjIgPSBhWzEwXSwgYTIzID0gYVsxMV0sXG4gICAgICAgIGEzMCA9IGFbMTJdLCBhMzEgPSBhWzEzXSwgYTMyID0gYVsxNF0sIGEzMyA9IGFbMTVdLFxuXG4gICAgICAgIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMCxcbiAgICAgICAgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwLFxuICAgICAgICBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTAsXG4gICAgICAgIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMSxcbiAgICAgICAgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExLFxuICAgICAgICBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTIsXG4gICAgICAgIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMCxcbiAgICAgICAgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwLFxuICAgICAgICBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzAsXG4gICAgICAgIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMSxcbiAgICAgICAgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxLFxuICAgICAgICBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzIsXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG5cbiAgICBpZiAoIWRldCkgeyBcbiAgICAgICAgcmV0dXJuIG51bGw7IFxuICAgIH1cbiAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICBvdXRbMF0gPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldDtcbiAgICBvdXRbMV0gPSAoYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5KSAqIGRldDtcbiAgICBvdXRbMl0gPSAoYTMxICogYjA1IC0gYTMyICogYjA0ICsgYTMzICogYjAzKSAqIGRldDtcbiAgICBvdXRbM10gPSAoYTIyICogYjA0IC0gYTIxICogYjA1IC0gYTIzICogYjAzKSAqIGRldDtcbiAgICBvdXRbNF0gPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldDtcbiAgICBvdXRbNV0gPSAoYTAwICogYjExIC0gYTAyICogYjA4ICsgYTAzICogYjA3KSAqIGRldDtcbiAgICBvdXRbNl0gPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldDtcbiAgICBvdXRbN10gPSAoYTIwICogYjA1IC0gYTIyICogYjAyICsgYTIzICogYjAxKSAqIGRldDtcbiAgICBvdXRbOF0gPSAoYTEwICogYjEwIC0gYTExICogYjA4ICsgYTEzICogYjA2KSAqIGRldDtcbiAgICBvdXRbOV0gPSAoYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2KSAqIGRldDtcbiAgICBvdXRbMTBdID0gKGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMCkgKiBkZXQ7XG4gICAgb3V0WzExXSA9IChhMjEgKiBiMDIgLSBhMjAgKiBiMDQgLSBhMjMgKiBiMDApICogZGV0O1xuICAgIG91dFsxMl0gPSAoYTExICogYjA3IC0gYTEwICogYjA5IC0gYTEyICogYjA2KSAqIGRldDtcbiAgICBvdXRbMTNdID0gKGEwMCAqIGIwOSAtIGEwMSAqIGIwNyArIGEwMiAqIGIwNikgKiBkZXQ7XG4gICAgb3V0WzE0XSA9IChhMzEgKiBiMDEgLSBhMzAgKiBiMDMgLSBhMzIgKiBiMDApICogZGV0O1xuICAgIG91dFsxNV0gPSAoYTIwICogYjAzIC0gYTIxICogYjAxICsgYTIyICogYjAwKSAqIGRldDtcblxuICAgIHJldHVybiBvdXQ7XG59OyIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBsb29rQXQ7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgbG9vay1hdCBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZXllIHBvc2l0aW9uLCBmb2NhbCBwb2ludCwgYW5kIHVwIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge3ZlYzN9IGV5ZSBQb3NpdGlvbiBvZiB0aGUgdmlld2VyXG4gKiBAcGFyYW0ge3ZlYzN9IGNlbnRlciBQb2ludCB0aGUgdmlld2VyIGlzIGxvb2tpbmcgYXRcbiAqIEBwYXJhbSB7dmVjM30gdXAgdmVjMyBwb2ludGluZyB1cFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5mdW5jdGlvbiBsb29rQXQob3V0LCBleWUsIGNlbnRlciwgdXApIHtcbiAgICB2YXIgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbGVuLFxuICAgICAgICBleWV4ID0gZXllWzBdLFxuICAgICAgICBleWV5ID0gZXllWzFdLFxuICAgICAgICBleWV6ID0gZXllWzJdLFxuICAgICAgICB1cHggPSB1cFswXSxcbiAgICAgICAgdXB5ID0gdXBbMV0sXG4gICAgICAgIHVweiA9IHVwWzJdLFxuICAgICAgICBjZW50ZXJ4ID0gY2VudGVyWzBdLFxuICAgICAgICBjZW50ZXJ5ID0gY2VudGVyWzFdLFxuICAgICAgICBjZW50ZXJ6ID0gY2VudGVyWzJdO1xuXG4gICAgaWYgKE1hdGguYWJzKGV5ZXggLSBjZW50ZXJ4KSA8IDAuMDAwMDAxICYmXG4gICAgICAgIE1hdGguYWJzKGV5ZXkgLSBjZW50ZXJ5KSA8IDAuMDAwMDAxICYmXG4gICAgICAgIE1hdGguYWJzKGV5ZXogLSBjZW50ZXJ6KSA8IDAuMDAwMDAxKSB7XG4gICAgICAgIHJldHVybiBpZGVudGl0eShvdXQpO1xuICAgIH1cblxuICAgIHowID0gZXlleCAtIGNlbnRlcng7XG4gICAgejEgPSBleWV5IC0gY2VudGVyeTtcbiAgICB6MiA9IGV5ZXogLSBjZW50ZXJ6O1xuXG4gICAgbGVuID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xuICAgIHowICo9IGxlbjtcbiAgICB6MSAqPSBsZW47XG4gICAgejIgKj0gbGVuO1xuXG4gICAgeDAgPSB1cHkgKiB6MiAtIHVweiAqIHoxO1xuICAgIHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcbiAgICB4MiA9IHVweCAqIHoxIC0gdXB5ICogejA7XG4gICAgbGVuID0gTWF0aC5zcXJ0KHgwICogeDAgKyB4MSAqIHgxICsgeDIgKiB4Mik7XG4gICAgaWYgKCFsZW4pIHtcbiAgICAgICAgeDAgPSAwO1xuICAgICAgICB4MSA9IDA7XG4gICAgICAgIHgyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB4MCAqPSBsZW47XG4gICAgICAgIHgxICo9IGxlbjtcbiAgICAgICAgeDIgKj0gbGVuO1xuICAgIH1cblxuICAgIHkwID0gejEgKiB4MiAtIHoyICogeDE7XG4gICAgeTEgPSB6MiAqIHgwIC0gejAgKiB4MjtcbiAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgbGVuID0gTWF0aC5zcXJ0KHkwICogeTAgKyB5MSAqIHkxICsgeTIgKiB5Mik7XG4gICAgaWYgKCFsZW4pIHtcbiAgICAgICAgeTAgPSAwO1xuICAgICAgICB5MSA9IDA7XG4gICAgICAgIHkyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB5MCAqPSBsZW47XG4gICAgICAgIHkxICo9IGxlbjtcbiAgICAgICAgeTIgKj0gbGVuO1xuICAgIH1cblxuICAgIG91dFswXSA9IHgwO1xuICAgIG91dFsxXSA9IHkwO1xuICAgIG91dFsyXSA9IHowO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0geDE7XG4gICAgb3V0WzVdID0geTE7XG4gICAgb3V0WzZdID0gejE7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSB4MjtcbiAgICBvdXRbOV0gPSB5MjtcbiAgICBvdXRbMTBdID0gejI7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IC0oeDAgKiBleWV4ICsgeDEgKiBleWV5ICsgeDIgKiBleWV6KTtcbiAgICBvdXRbMTNdID0gLSh5MCAqIGV5ZXggKyB5MSAqIGV5ZXkgKyB5MiAqIGV5ZXopO1xuICAgIG91dFsxNF0gPSAtKHowICogZXlleCArIHoxICogZXlleSArIHoyICogZXlleik7XG4gICAgb3V0WzE1XSA9IDE7XG5cbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IG11bHRpcGx5O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIG1hdDQnc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7bWF0NH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gbXVsdGlwbHkob3V0LCBhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sIGExMSA9IGFbNV0sIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sIGEyMSA9IGFbOV0sIGEyMiA9IGFbMTBdLCBhMjMgPSBhWzExXSxcbiAgICAgICAgYTMwID0gYVsxMl0sIGEzMSA9IGFbMTNdLCBhMzIgPSBhWzE0XSwgYTMzID0gYVsxNV07XG5cbiAgICAvLyBDYWNoZSBvbmx5IHRoZSBjdXJyZW50IGxpbmUgb2YgdGhlIHNlY29uZCBtYXRyaXhcbiAgICB2YXIgYjAgID0gYlswXSwgYjEgPSBiWzFdLCBiMiA9IGJbMl0sIGIzID0gYlszXTsgIFxuICAgIG91dFswXSA9IGIwKmEwMCArIGIxKmExMCArIGIyKmEyMCArIGIzKmEzMDtcbiAgICBvdXRbMV0gPSBiMCphMDEgKyBiMSphMTEgKyBiMiphMjEgKyBiMyphMzE7XG4gICAgb3V0WzJdID0gYjAqYTAyICsgYjEqYTEyICsgYjIqYTIyICsgYjMqYTMyO1xuICAgIG91dFszXSA9IGIwKmEwMyArIGIxKmExMyArIGIyKmEyMyArIGIzKmEzMztcblxuICAgIGIwID0gYls0XTsgYjEgPSBiWzVdOyBiMiA9IGJbNl07IGIzID0gYls3XTtcbiAgICBvdXRbNF0gPSBiMCphMDAgKyBiMSphMTAgKyBiMiphMjAgKyBiMyphMzA7XG4gICAgb3V0WzVdID0gYjAqYTAxICsgYjEqYTExICsgYjIqYTIxICsgYjMqYTMxO1xuICAgIG91dFs2XSA9IGIwKmEwMiArIGIxKmExMiArIGIyKmEyMiArIGIzKmEzMjtcbiAgICBvdXRbN10gPSBiMCphMDMgKyBiMSphMTMgKyBiMiphMjMgKyBiMyphMzM7XG5cbiAgICBiMCA9IGJbOF07IGIxID0gYls5XTsgYjIgPSBiWzEwXTsgYjMgPSBiWzExXTtcbiAgICBvdXRbOF0gPSBiMCphMDAgKyBiMSphMTAgKyBiMiphMjAgKyBiMyphMzA7XG4gICAgb3V0WzldID0gYjAqYTAxICsgYjEqYTExICsgYjIqYTIxICsgYjMqYTMxO1xuICAgIG91dFsxMF0gPSBiMCphMDIgKyBiMSphMTIgKyBiMiphMjIgKyBiMyphMzI7XG4gICAgb3V0WzExXSA9IGIwKmEwMyArIGIxKmExMyArIGIyKmEyMyArIGIzKmEzMztcblxuICAgIGIwID0gYlsxMl07IGIxID0gYlsxM107IGIyID0gYlsxNF07IGIzID0gYlsxNV07XG4gICAgb3V0WzEyXSA9IGIwKmEwMCArIGIxKmExMCArIGIyKmEyMCArIGIzKmEzMDtcbiAgICBvdXRbMTNdID0gYjAqYTAxICsgYjEqYTExICsgYjIqYTIxICsgYjMqYTMxO1xuICAgIG91dFsxNF0gPSBiMCphMDIgKyBiMSphMTIgKyBiMiphMjIgKyBiMyphMzI7XG4gICAgb3V0WzE1XSA9IGIwKmEwMyArIGIxKmExMyArIGIyKmEyMyArIGIzKmEzMztcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IG9ydGhvO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIG9ydGhvZ29uYWwgcHJvamVjdGlvbiBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gYm91bmRzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgTGVmdCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0IFJpZ2h0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IHRvcCBUb3AgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbmZ1bmN0aW9uIG9ydGhvKG91dCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgbHIgPSAxIC8gKGxlZnQgLSByaWdodCksXG4gICAgICAgIGJ0ID0gMSAvIChib3R0b20gLSB0b3ApLFxuICAgICAgICBuZiA9IDEgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzBdID0gLTIgKiBscjtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IC0yICogYnQ7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMiAqIG5mO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAobGVmdCArIHJpZ2h0KSAqIGxyO1xuICAgIG91dFsxM10gPSAodG9wICsgYm90dG9tKSAqIGJ0O1xuICAgIG91dFsxNF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHBlcnNwZWN0aXZlO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IFZlcnRpY2FsIGZpZWxkIG9mIHZpZXcgaW4gcmFkaWFuc1xuICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdCBBc3BlY3QgcmF0aW8uIHR5cGljYWxseSB2aWV3cG9ydCB3aWR0aC9oZWlnaHRcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbmZ1bmN0aW9uIHBlcnNwZWN0aXZlKG91dCwgZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgZiA9IDEuMCAvIE1hdGgudGFuKGZvdnkgLyAyKSxcbiAgICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFswXSA9IGYgLyBhc3BlY3Q7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSBmO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgIG91dFsxMV0gPSAtMTtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gKDIgKiBmYXIgKiBuZWFyKSAqIG5mO1xuICAgIG91dFsxNV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcGVyc3BlY3RpdmVGcm9tRmllbGRPZlZpZXc7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZmllbGQgb2Ygdmlldy5cbiAqIFRoaXMgaXMgcHJpbWFyaWx5IHVzZWZ1bCBmb3IgZ2VuZXJhdGluZyBwcm9qZWN0aW9uIG1hdHJpY2VzIHRvIGJlIHVzZWRcbiAqIHdpdGggdGhlIHN0aWxsIGV4cGVyaWVtZW50YWwgV2ViVlIgQVBJLlxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7bnVtYmVyfSBmb3YgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyB2YWx1ZXM6IHVwRGVncmVlcywgZG93bkRlZ3JlZXMsIGxlZnREZWdyZWVzLCByaWdodERlZ3JlZXNcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbmZ1bmN0aW9uIHBlcnNwZWN0aXZlRnJvbUZpZWxkT2ZWaWV3KG91dCwgZm92LCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgdXBUYW4gPSBNYXRoLnRhbihmb3YudXBEZWdyZWVzICogTWF0aC5QSS8xODAuMCksXG4gICAgICAgIGRvd25UYW4gPSBNYXRoLnRhbihmb3YuZG93bkRlZ3JlZXMgKiBNYXRoLlBJLzE4MC4wKSxcbiAgICAgICAgbGVmdFRhbiA9IE1hdGgudGFuKGZvdi5sZWZ0RGVncmVlcyAqIE1hdGguUEkvMTgwLjApLFxuICAgICAgICByaWdodFRhbiA9IE1hdGgudGFuKGZvdi5yaWdodERlZ3JlZXMgKiBNYXRoLlBJLzE4MC4wKSxcbiAgICAgICAgeFNjYWxlID0gMi4wIC8gKGxlZnRUYW4gKyByaWdodFRhbiksXG4gICAgICAgIHlTY2FsZSA9IDIuMCAvICh1cFRhbiArIGRvd25UYW4pO1xuXG4gICAgb3V0WzBdID0geFNjYWxlO1xuICAgIG91dFsxXSA9IDAuMDtcbiAgICBvdXRbMl0gPSAwLjA7XG4gICAgb3V0WzNdID0gMC4wO1xuICAgIG91dFs0XSA9IDAuMDtcbiAgICBvdXRbNV0gPSB5U2NhbGU7XG4gICAgb3V0WzZdID0gMC4wO1xuICAgIG91dFs3XSA9IDAuMDtcbiAgICBvdXRbOF0gPSAtKChsZWZ0VGFuIC0gcmlnaHRUYW4pICogeFNjYWxlICogMC41KTtcbiAgICBvdXRbOV0gPSAoKHVwVGFuIC0gZG93blRhbikgKiB5U2NhbGUgKiAwLjUpO1xuICAgIG91dFsxMF0gPSBmYXIgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzExXSA9IC0xLjA7XG4gICAgb3V0WzEyXSA9IDAuMDtcbiAgICBvdXRbMTNdID0gMC4wO1xuICAgIG91dFsxNF0gPSAoZmFyICogbmVhcikgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzE1XSA9IDAuMDtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJvdGF0ZTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0NCBieSB0aGUgZ2l2ZW4gYW5nbGVcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHBhcmFtIHt2ZWMzfSBheGlzIHRoZSBheGlzIHRvIHJvdGF0ZSBhcm91bmRcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gcm90YXRlKG91dCwgYSwgcmFkLCBheGlzKSB7XG4gICAgdmFyIHggPSBheGlzWzBdLCB5ID0gYXhpc1sxXSwgeiA9IGF4aXNbMl0sXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopLFxuICAgICAgICBzLCBjLCB0LFxuICAgICAgICBhMDAsIGEwMSwgYTAyLCBhMDMsXG4gICAgICAgIGExMCwgYTExLCBhMTIsIGExMyxcbiAgICAgICAgYTIwLCBhMjEsIGEyMiwgYTIzLFxuICAgICAgICBiMDAsIGIwMSwgYjAyLFxuICAgICAgICBiMTAsIGIxMSwgYjEyLFxuICAgICAgICBiMjAsIGIyMSwgYjIyO1xuXG4gICAgaWYgKE1hdGguYWJzKGxlbikgPCAwLjAwMDAwMSkgeyByZXR1cm4gbnVsbDsgfVxuICAgIFxuICAgIGxlbiA9IDEgLyBsZW47XG4gICAgeCAqPSBsZW47XG4gICAgeSAqPSBsZW47XG4gICAgeiAqPSBsZW47XG5cbiAgICBzID0gTWF0aC5zaW4ocmFkKTtcbiAgICBjID0gTWF0aC5jb3MocmFkKTtcbiAgICB0ID0gMSAtIGM7XG5cbiAgICBhMDAgPSBhWzBdOyBhMDEgPSBhWzFdOyBhMDIgPSBhWzJdOyBhMDMgPSBhWzNdO1xuICAgIGExMCA9IGFbNF07IGExMSA9IGFbNV07IGExMiA9IGFbNl07IGExMyA9IGFbN107XG4gICAgYTIwID0gYVs4XTsgYTIxID0gYVs5XTsgYTIyID0gYVsxMF07IGEyMyA9IGFbMTFdO1xuXG4gICAgLy8gQ29uc3RydWN0IHRoZSBlbGVtZW50cyBvZiB0aGUgcm90YXRpb24gbWF0cml4XG4gICAgYjAwID0geCAqIHggKiB0ICsgYzsgYjAxID0geSAqIHggKiB0ICsgeiAqIHM7IGIwMiA9IHogKiB4ICogdCAtIHkgKiBzO1xuICAgIGIxMCA9IHggKiB5ICogdCAtIHogKiBzOyBiMTEgPSB5ICogeSAqIHQgKyBjOyBiMTIgPSB6ICogeSAqIHQgKyB4ICogcztcbiAgICBiMjAgPSB4ICogeiAqIHQgKyB5ICogczsgYjIxID0geSAqIHogKiB0IC0geCAqIHM7IGIyMiA9IHogKiB6ICogdCArIGM7XG5cbiAgICAvLyBQZXJmb3JtIHJvdGF0aW9uLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSA9IGEwMCAqIGIwMCArIGExMCAqIGIwMSArIGEyMCAqIGIwMjtcbiAgICBvdXRbMV0gPSBhMDEgKiBiMDAgKyBhMTEgKiBiMDEgKyBhMjEgKiBiMDI7XG4gICAgb3V0WzJdID0gYTAyICogYjAwICsgYTEyICogYjAxICsgYTIyICogYjAyO1xuICAgIG91dFszXSA9IGEwMyAqIGIwMCArIGExMyAqIGIwMSArIGEyMyAqIGIwMjtcbiAgICBvdXRbNF0gPSBhMDAgKiBiMTAgKyBhMTAgKiBiMTEgKyBhMjAgKiBiMTI7XG4gICAgb3V0WzVdID0gYTAxICogYjEwICsgYTExICogYjExICsgYTIxICogYjEyO1xuICAgIG91dFs2XSA9IGEwMiAqIGIxMCArIGExMiAqIGIxMSArIGEyMiAqIGIxMjtcbiAgICBvdXRbN10gPSBhMDMgKiBiMTAgKyBhMTMgKiBiMTEgKyBhMjMgKiBiMTI7XG4gICAgb3V0WzhdID0gYTAwICogYjIwICsgYTEwICogYjIxICsgYTIwICogYjIyO1xuICAgIG91dFs5XSA9IGEwMSAqIGIyMCArIGExMSAqIGIyMSArIGEyMSAqIGIyMjtcbiAgICBvdXRbMTBdID0gYTAyICogYjIwICsgYTEyICogYjIxICsgYTIyICogYjIyO1xuICAgIG91dFsxMV0gPSBhMDMgKiBiMjAgKyBhMTMgKiBiMjEgKyBhMjMgKiBiMjI7XG5cbiAgICBpZiAoYSAhPT0gb3V0KSB7IC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIGxhc3Qgcm93XG4gICAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgICAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByb3RhdGVYO1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXRyaXggYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWCBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gcm90YXRlWChvdXQsIGEsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgIGExMCA9IGFbNF0sXG4gICAgICAgIGExMSA9IGFbNV0sXG4gICAgICAgIGExMiA9IGFbNl0sXG4gICAgICAgIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sXG4gICAgICAgIGEyMSA9IGFbOV0sXG4gICAgICAgIGEyMiA9IGFbMTBdLFxuICAgICAgICBhMjMgPSBhWzExXTtcblxuICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgICAgICBvdXRbMF0gID0gYVswXTtcbiAgICAgICAgb3V0WzFdICA9IGFbMV07XG4gICAgICAgIG91dFsyXSAgPSBhWzJdO1xuICAgICAgICBvdXRbM10gID0gYVszXTtcbiAgICAgICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cblxuICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICBvdXRbNF0gPSBhMTAgKiBjICsgYTIwICogcztcbiAgICBvdXRbNV0gPSBhMTEgKiBjICsgYTIxICogcztcbiAgICBvdXRbNl0gPSBhMTIgKiBjICsgYTIyICogcztcbiAgICBvdXRbN10gPSBhMTMgKiBjICsgYTIzICogcztcbiAgICBvdXRbOF0gPSBhMjAgKiBjIC0gYTEwICogcztcbiAgICBvdXRbOV0gPSBhMjEgKiBjIC0gYTExICogcztcbiAgICBvdXRbMTBdID0gYTIyICogYyAtIGExMiAqIHM7XG4gICAgb3V0WzExXSA9IGEyMyAqIGMgLSBhMTMgKiBzO1xuICAgIHJldHVybiBvdXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcm90YXRlWTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFkgYXhpc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZVkob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxuICAgICAgICBhMDAgPSBhWzBdLFxuICAgICAgICBhMDEgPSBhWzFdLFxuICAgICAgICBhMDIgPSBhWzJdLFxuICAgICAgICBhMDMgPSBhWzNdLFxuICAgICAgICBhMjAgPSBhWzhdLFxuICAgICAgICBhMjEgPSBhWzldLFxuICAgICAgICBhMjIgPSBhWzEwXSxcbiAgICAgICAgYTIzID0gYVsxMV07XG5cbiAgICBpZiAoYSAhPT0gb3V0KSB7IC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIHJvd3NcbiAgICAgICAgb3V0WzRdICA9IGFbNF07XG4gICAgICAgIG91dFs1XSAgPSBhWzVdO1xuICAgICAgICBvdXRbNl0gID0gYVs2XTtcbiAgICAgICAgb3V0WzddICA9IGFbN107XG4gICAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgICAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdID0gYTAwICogYyAtIGEyMCAqIHM7XG4gICAgb3V0WzFdID0gYTAxICogYyAtIGEyMSAqIHM7XG4gICAgb3V0WzJdID0gYTAyICogYyAtIGEyMiAqIHM7XG4gICAgb3V0WzNdID0gYTAzICogYyAtIGEyMyAqIHM7XG4gICAgb3V0WzhdID0gYTAwICogcyArIGEyMCAqIGM7XG4gICAgb3V0WzldID0gYTAxICogcyArIGEyMSAqIGM7XG4gICAgb3V0WzEwXSA9IGEwMiAqIHMgKyBhMjIgKiBjO1xuICAgIG91dFsxMV0gPSBhMDMgKiBzICsgYTIzICogYztcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJvdGF0ZVo7XG5cbi8qKlxuICogUm90YXRlcyBhIG1hdHJpeCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5mdW5jdGlvbiByb3RhdGVaKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKSxcbiAgICAgICAgYTAwID0gYVswXSxcbiAgICAgICAgYTAxID0gYVsxXSxcbiAgICAgICAgYTAyID0gYVsyXSxcbiAgICAgICAgYTAzID0gYVszXSxcbiAgICAgICAgYTEwID0gYVs0XSxcbiAgICAgICAgYTExID0gYVs1XSxcbiAgICAgICAgYTEyID0gYVs2XSxcbiAgICAgICAgYTEzID0gYVs3XTtcblxuICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcbiAgICAgICAgb3V0WzhdICA9IGFbOF07XG4gICAgICAgIG91dFs5XSAgPSBhWzldO1xuICAgICAgICBvdXRbMTBdID0gYVsxMF07XG4gICAgICAgIG91dFsxMV0gPSBhWzExXTtcbiAgICAgICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cblxuICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICBvdXRbMF0gPSBhMDAgKiBjICsgYTEwICogcztcbiAgICBvdXRbMV0gPSBhMDEgKiBjICsgYTExICogcztcbiAgICBvdXRbMl0gPSBhMDIgKiBjICsgYTEyICogcztcbiAgICBvdXRbM10gPSBhMDMgKiBjICsgYTEzICogcztcbiAgICBvdXRbNF0gPSBhMTAgKiBjIC0gYTAwICogcztcbiAgICBvdXRbNV0gPSBhMTEgKiBjIC0gYTAxICogcztcbiAgICBvdXRbNl0gPSBhMTIgKiBjIC0gYTAyICogcztcbiAgICBvdXRbN10gPSBhMTMgKiBjIC0gYTAzICogcztcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHNjYWxlO1xuXG4vKipcbiAqIFNjYWxlcyB0aGUgbWF0NCBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjM1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byBzY2FsZVxuICogQHBhcmFtIHt2ZWMzfSB2IHRoZSB2ZWMzIHRvIHNjYWxlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqKi9cbmZ1bmN0aW9uIHNjYWxlKG91dCwgYSwgdikge1xuICAgIHZhciB4ID0gdlswXSwgeSA9IHZbMV0sIHogPSB2WzJdO1xuXG4gICAgb3V0WzBdID0gYVswXSAqIHg7XG4gICAgb3V0WzFdID0gYVsxXSAqIHg7XG4gICAgb3V0WzJdID0gYVsyXSAqIHg7XG4gICAgb3V0WzNdID0gYVszXSAqIHg7XG4gICAgb3V0WzRdID0gYVs0XSAqIHk7XG4gICAgb3V0WzVdID0gYVs1XSAqIHk7XG4gICAgb3V0WzZdID0gYVs2XSAqIHk7XG4gICAgb3V0WzddID0gYVs3XSAqIHk7XG4gICAgb3V0WzhdID0gYVs4XSAqIHo7XG4gICAgb3V0WzldID0gYVs5XSAqIHo7XG4gICAgb3V0WzEwXSA9IGFbMTBdICogejtcbiAgICBvdXRbMTFdID0gYVsxMV0gKiB6O1xuICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICBvdXRbMTNdID0gYVsxM107XG4gICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHN0cjtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gbWF0IG1hdHJpeCB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gKi9cbmZ1bmN0aW9uIHN0cihhKSB7XG4gICAgcmV0dXJuICdtYXQ0KCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBhWzNdICsgJywgJyArXG4gICAgICAgICAgICAgICAgICAgIGFbNF0gKyAnLCAnICsgYVs1XSArICcsICcgKyBhWzZdICsgJywgJyArIGFbN10gKyAnLCAnICtcbiAgICAgICAgICAgICAgICAgICAgYVs4XSArICcsICcgKyBhWzldICsgJywgJyArIGFbMTBdICsgJywgJyArIGFbMTFdICsgJywgJyArIFxuICAgICAgICAgICAgICAgICAgICBhWzEyXSArICcsICcgKyBhWzEzXSArICcsICcgKyBhWzE0XSArICcsICcgKyBhWzE1XSArICcpJztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB0cmFuc2xhdGU7XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWF0NCBieSB0aGUgZ2l2ZW4gdmVjdG9yXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICogQHBhcmFtIHt2ZWMzfSB2IHZlY3RvciB0byB0cmFuc2xhdGUgYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gdHJhbnNsYXRlKG91dCwgYSwgdikge1xuICAgIHZhciB4ID0gdlswXSwgeSA9IHZbMV0sIHogPSB2WzJdLFxuICAgICAgICBhMDAsIGEwMSwgYTAyLCBhMDMsXG4gICAgICAgIGExMCwgYTExLCBhMTIsIGExMyxcbiAgICAgICAgYTIwLCBhMjEsIGEyMiwgYTIzO1xuXG4gICAgaWYgKGEgPT09IG91dCkge1xuICAgICAgICBvdXRbMTJdID0gYVswXSAqIHggKyBhWzRdICogeSArIGFbOF0gKiB6ICsgYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzFdICogeCArIGFbNV0gKiB5ICsgYVs5XSAqIHogKyBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMl0gKiB4ICsgYVs2XSAqIHkgKyBhWzEwXSAqIHogKyBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbM10gKiB4ICsgYVs3XSAqIHkgKyBhWzExXSAqIHogKyBhWzE1XTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhMDAgPSBhWzBdOyBhMDEgPSBhWzFdOyBhMDIgPSBhWzJdOyBhMDMgPSBhWzNdO1xuICAgICAgICBhMTAgPSBhWzRdOyBhMTEgPSBhWzVdOyBhMTIgPSBhWzZdOyBhMTMgPSBhWzddO1xuICAgICAgICBhMjAgPSBhWzhdOyBhMjEgPSBhWzldOyBhMjIgPSBhWzEwXTsgYTIzID0gYVsxMV07XG5cbiAgICAgICAgb3V0WzBdID0gYTAwOyBvdXRbMV0gPSBhMDE7IG91dFsyXSA9IGEwMjsgb3V0WzNdID0gYTAzO1xuICAgICAgICBvdXRbNF0gPSBhMTA7IG91dFs1XSA9IGExMTsgb3V0WzZdID0gYTEyOyBvdXRbN10gPSBhMTM7XG4gICAgICAgIG91dFs4XSA9IGEyMDsgb3V0WzldID0gYTIxOyBvdXRbMTBdID0gYTIyOyBvdXRbMTFdID0gYTIzO1xuXG4gICAgICAgIG91dFsxMl0gPSBhMDAgKiB4ICsgYTEwICogeSArIGEyMCAqIHogKyBhWzEyXTtcbiAgICAgICAgb3V0WzEzXSA9IGEwMSAqIHggKyBhMTEgKiB5ICsgYTIxICogeiArIGFbMTNdO1xuICAgICAgICBvdXRbMTRdID0gYTAyICogeCArIGExMiAqIHkgKyBhMjIgKiB6ICsgYVsxNF07XG4gICAgICAgIG91dFsxNV0gPSBhMDMgKiB4ICsgYTEzICogeSArIGEyMyAqIHogKyBhWzE1XTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRyYW5zcG9zZTtcblxuLyoqXG4gKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbmZ1bmN0aW9uIHRyYW5zcG9zZShvdXQsIGEpIHtcbiAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICB2YXIgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTAzID0gYVszXSxcbiAgICAgICAgICAgIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgICAgICBhMjMgPSBhWzExXTtcblxuICAgICAgICBvdXRbMV0gPSBhWzRdO1xuICAgICAgICBvdXRbMl0gPSBhWzhdO1xuICAgICAgICBvdXRbM10gPSBhWzEyXTtcbiAgICAgICAgb3V0WzRdID0gYTAxO1xuICAgICAgICBvdXRbNl0gPSBhWzldO1xuICAgICAgICBvdXRbN10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzhdID0gYTAyO1xuICAgICAgICBvdXRbOV0gPSBhMTI7XG4gICAgICAgIG91dFsxMV0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzEyXSA9IGEwMztcbiAgICAgICAgb3V0WzEzXSA9IGExMztcbiAgICAgICAgb3V0WzE0XSA9IGEyMztcbiAgICB9IGVsc2Uge1xuICAgICAgICBvdXRbMF0gPSBhWzBdO1xuICAgICAgICBvdXRbMV0gPSBhWzRdO1xuICAgICAgICBvdXRbMl0gPSBhWzhdO1xuICAgICAgICBvdXRbM10gPSBhWzEyXTtcbiAgICAgICAgb3V0WzRdID0gYVsxXTtcbiAgICAgICAgb3V0WzVdID0gYVs1XTtcbiAgICAgICAgb3V0WzZdID0gYVs5XTtcbiAgICAgICAgb3V0WzddID0gYVsxM107XG4gICAgICAgIG91dFs4XSA9IGFbMl07XG4gICAgICAgIG91dFs5XSA9IGFbNl07XG4gICAgICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICAgICAgb3V0WzExXSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTJdID0gYVszXTtcbiAgICAgICAgb3V0WzEzXSA9IGFbN107XG4gICAgICAgIG91dFsxNF0gPSBhWzExXTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gb3V0O1xufTsiLCJ2YXIgY2hlY2sgPSByZXF1aXJlKCcuL2xpYi9jaGVjaycpXG52YXIgZ2V0Q29udGV4dCA9IHJlcXVpcmUoJy4vbGliL2NvbnRleHQnKVxudmFyIHdyYXBFeHRlbnNpb25zID0gcmVxdWlyZSgnLi9saWIvZXh0ZW5zaW9uJylcbnZhciB3cmFwTGltaXRzID0gcmVxdWlyZSgnLi9saWIvbGltaXRzJylcbnZhciB3cmFwQnVmZmVycyA9IHJlcXVpcmUoJy4vbGliL2J1ZmZlcicpXG52YXIgd3JhcEVsZW1lbnRzID0gcmVxdWlyZSgnLi9saWIvZWxlbWVudHMnKVxudmFyIHdyYXBUZXh0dXJlcyA9IHJlcXVpcmUoJy4vbGliL3RleHR1cmUnKVxudmFyIHdyYXBSZW5kZXJidWZmZXJzID0gcmVxdWlyZSgnLi9saWIvcmVuZGVyYnVmZmVyJylcbnZhciB3cmFwRnJhbWVidWZmZXJzID0gcmVxdWlyZSgnLi9saWIvZnJhbWVidWZmZXInKVxudmFyIHdyYXBVbmlmb3JtcyA9IHJlcXVpcmUoJy4vbGliL3VuaWZvcm0nKVxudmFyIHdyYXBBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9saWIvYXR0cmlidXRlJylcbnZhciB3cmFwU2hhZGVycyA9IHJlcXVpcmUoJy4vbGliL3NoYWRlcicpXG52YXIgd3JhcERyYXcgPSByZXF1aXJlKCcuL2xpYi9kcmF3JylcbnZhciB3cmFwQ29udGV4dCA9IHJlcXVpcmUoJy4vbGliL3N0YXRlJylcbnZhciBjcmVhdGVDb21waWxlciA9IHJlcXVpcmUoJy4vbGliL2NvbXBpbGUnKVxudmFyIHdyYXBSZWFkID0gcmVxdWlyZSgnLi9saWIvcmVhZCcpXG52YXIgZHluYW1pYyA9IHJlcXVpcmUoJy4vbGliL2R5bmFtaWMnKVxudmFyIHJhZiA9IHJlcXVpcmUoJy4vbGliL3JhZicpXG52YXIgY2xvY2sgPSByZXF1aXJlKCcuL2xpYi9jbG9jaycpXG5cbnZhciBHTF9DT0xPUl9CVUZGRVJfQklUID0gMTYzODRcbnZhciBHTF9ERVBUSF9CVUZGRVJfQklUID0gMjU2XG52YXIgR0xfU1RFTkNJTF9CVUZGRVJfQklUID0gMTAyNFxuXG52YXIgR0xfQVJSQVlfQlVGRkVSID0gMzQ5NjJcbnZhciBHTF9URVhUVVJFXzJEID0gMHgwREUxXG52YXIgR0xfVEVYVFVSRV9DVUJFX01BUCA9IDB4ODUxM1xuXG52YXIgQ09OVEVYVF9MT1NUX0VWRU5UID0gJ3dlYmdsY29udGV4dGxvc3QnXG52YXIgQ09OVEVYVF9SRVNUT1JFRF9FVkVOVCA9ICd3ZWJnbGNvbnRleHRyZXN0b3JlZCdcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3cmFwUkVHTCAoKSB7XG4gIHZhciBhcmdzID0gZ2V0Q29udGV4dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICB2YXIgZ2wgPSBhcmdzLmdsXG4gIHZhciBvcHRpb25zID0gYXJncy5vcHRpb25zXG5cbiAgdmFyIGV4dGVuc2lvblN0YXRlID0gd3JhcEV4dGVuc2lvbnMoZ2wpXG4gIHZhciBleHRlbnNpb25zID0gZXh0ZW5zaW9uU3RhdGUuZXh0ZW5zaW9uc1xuXG4gIHZhciB2aWV3cG9ydFN0YXRlID0ge1xuICAgIHdpZHRoOiBnbC5kcmF3aW5nQnVmZmVyV2lkdGgsXG4gICAgaGVpZ2h0OiBnbC5kcmF3aW5nQnVmZmVySGVpZ2h0XG4gIH1cblxuICB2YXIgbGltaXRzID0gd3JhcExpbWl0cyhcbiAgICBnbCxcbiAgICBleHRlbnNpb25zKVxuXG4gIHZhciBidWZmZXJTdGF0ZSA9IHdyYXBCdWZmZXJzKGdsKVxuXG4gIHZhciBlbGVtZW50U3RhdGUgPSB3cmFwRWxlbWVudHMoXG4gICAgZ2wsXG4gICAgZXh0ZW5zaW9ucyxcbiAgICBidWZmZXJTdGF0ZSlcblxuICB2YXIgdW5pZm9ybVN0YXRlID0gd3JhcFVuaWZvcm1zKClcblxuICB2YXIgYXR0cmlidXRlU3RhdGUgPSB3cmFwQXR0cmlidXRlcyhcbiAgICBnbCxcbiAgICBleHRlbnNpb25zLFxuICAgIGxpbWl0cyxcbiAgICBidWZmZXJTdGF0ZSlcblxuICB2YXIgc2hhZGVyU3RhdGUgPSB3cmFwU2hhZGVycyhcbiAgICBnbCxcbiAgICBhdHRyaWJ1dGVTdGF0ZSxcbiAgICB1bmlmb3JtU3RhdGUsXG4gICAgZnVuY3Rpb24gKHByb2dyYW0pIHtcbiAgICAgIHJldHVybiBjb21waWxlci5kcmF3KHByb2dyYW0pXG4gICAgfSlcblxuICB2YXIgZHJhd1N0YXRlID0gd3JhcERyYXcoXG4gICAgZ2wsXG4gICAgZXh0ZW5zaW9ucyxcbiAgICBidWZmZXJTdGF0ZSlcblxuICB2YXIgdGV4dHVyZVN0YXRlID0gd3JhcFRleHR1cmVzKFxuICAgIGdsLFxuICAgIGV4dGVuc2lvbnMsXG4gICAgbGltaXRzLFxuICAgIHBvbGwsXG4gICAgdmlld3BvcnRTdGF0ZSlcblxuICB2YXIgcmVuZGVyYnVmZmVyU3RhdGUgPSB3cmFwUmVuZGVyYnVmZmVycyhcbiAgICBnbCxcbiAgICBleHRlbnNpb25zLFxuICAgIGxpbWl0cylcblxuICB2YXIgZnJhbWVidWZmZXJTdGF0ZSA9IHdyYXBGcmFtZWJ1ZmZlcnMoXG4gICAgZ2wsXG4gICAgZXh0ZW5zaW9ucyxcbiAgICBsaW1pdHMsXG4gICAgdGV4dHVyZVN0YXRlLFxuICAgIHJlbmRlcmJ1ZmZlclN0YXRlKVxuXG4gIHZhciBmcmFtZVN0YXRlID0ge1xuICAgIGNvdW50OiAwLFxuICAgIHN0YXJ0OiBjbG9jaygpLFxuICAgIGR0OiAwLFxuICAgIHQ6IGNsb2NrKCksXG4gICAgcmVuZGVyVGltZTogMCxcbiAgICB3aWR0aDogZ2wuZHJhd2luZ0J1ZmZlcldpZHRoLFxuICAgIGhlaWdodDogZ2wuZHJhd2luZ0J1ZmZlckhlaWdodCxcbiAgICBwaXhlbFJhdGlvOiBvcHRpb25zLnBpeGVsUmF0aW9cbiAgfVxuXG4gIHZhciBnbFN0YXRlID0gd3JhcENvbnRleHQoXG4gICAgZ2wsXG4gICAgZnJhbWVidWZmZXJTdGF0ZSxcbiAgICB2aWV3cG9ydFN0YXRlKVxuXG4gIHZhciByZWFkUGl4ZWxzID0gd3JhcFJlYWQoZ2wsIHBvbGwsIHZpZXdwb3J0U3RhdGUpXG5cbiAgdmFyIGNvbXBpbGVyID0gY3JlYXRlQ29tcGlsZXIoXG4gICAgZ2wsXG4gICAgZXh0ZW5zaW9ucyxcbiAgICBsaW1pdHMsXG4gICAgYnVmZmVyU3RhdGUsXG4gICAgZWxlbWVudFN0YXRlLFxuICAgIHRleHR1cmVTdGF0ZSxcbiAgICBmcmFtZWJ1ZmZlclN0YXRlLFxuICAgIGdsU3RhdGUsXG4gICAgdW5pZm9ybVN0YXRlLFxuICAgIGF0dHJpYnV0ZVN0YXRlLFxuICAgIHNoYWRlclN0YXRlLFxuICAgIGRyYXdTdGF0ZSxcbiAgICBmcmFtZVN0YXRlLFxuICAgIHBvbGwpXG5cbiAgdmFyIGNhbnZhcyA9IGdsLmNhbnZhc1xuXG4gIC8vIHJhZiBzdHVmZlxuICB2YXIgcmFmQ2FsbGJhY2tzID0gW11cbiAgdmFyIGFjdGl2ZVJBRiA9IDBcbiAgZnVuY3Rpb24gaGFuZGxlUkFGICgpIHtcbiAgICBhY3RpdmVSQUYgPSByYWYubmV4dChoYW5kbGVSQUYpXG4gICAgZnJhbWVTdGF0ZS5jb3VudCArPSAxXG5cbiAgICBpZiAoZnJhbWVTdGF0ZS53aWR0aCAhPT0gZ2wuZHJhd2luZ0J1ZmZlcldpZHRoIHx8XG4gICAgICAgIGZyYW1lU3RhdGUuaGVpZ2h0ICE9PSBnbC5kcmF3aW5nQnVmZmVySGVpZ2h0KSB7XG4gICAgICBmcmFtZVN0YXRlLndpZHRoID0gZ2wuZHJhd2luZ0J1ZmZlcldpZHRoXG4gICAgICBmcmFtZVN0YXRlLmhlaWdodCA9IGdsLmRyYXdpbmdCdWZmZXJIZWlnaHRcbiAgICAgIGdsU3RhdGUubm90aWZ5Vmlld3BvcnRDaGFuZ2VkKClcbiAgICB9XG5cbiAgICB2YXIgbm93ID0gY2xvY2soKVxuICAgIGZyYW1lU3RhdGUuZHQgPSBub3cgLSBmcmFtZVN0YXRlLnRcbiAgICBmcmFtZVN0YXRlLnQgPSBub3dcblxuICAgIHRleHR1cmVTdGF0ZS5wb2xsKClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmFmQ2FsbGJhY2tzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgY2IgPSByYWZDYWxsYmFja3NbaV1cbiAgICAgIGNiKGZyYW1lU3RhdGUuY291bnQsIGZyYW1lU3RhdGUudCwgZnJhbWVTdGF0ZS5kdClcbiAgICB9XG4gICAgZnJhbWVTdGF0ZS5yZW5kZXJUaW1lID0gY2xvY2soKSAtIG5vd1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnRSQUYgKCkge1xuICAgIGlmICghYWN0aXZlUkFGICYmIHJhZkNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICBoYW5kbGVSQUYoKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BSQUYgKCkge1xuICAgIGlmIChhY3RpdmVSQUYpIHtcbiAgICAgIHJhZi5jYW5jZWwoaGFuZGxlUkFGKVxuICAgICAgYWN0aXZlUkFGID0gMFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbnRleHRMb3NzIChldmVudCkge1xuICAgIHN0b3BSQUYoKVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBpZiAob3B0aW9ucy5vbkNvbnRleHRMb3N0KSB7XG4gICAgICBvcHRpb25zLm9uQ29udGV4dExvc3QoKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbnRleHRSZXN0b3JlZCAoZXZlbnQpIHtcbiAgICBnbC5nZXRFcnJvcigpXG4gICAgZXh0ZW5zaW9uU3RhdGUucmVmcmVzaCgpXG4gICAgYnVmZmVyU3RhdGUucmVmcmVzaCgpXG4gICAgdGV4dHVyZVN0YXRlLnJlZnJlc2goKVxuICAgIHJlbmRlcmJ1ZmZlclN0YXRlLnJlZnJlc2goKVxuICAgIGZyYW1lYnVmZmVyU3RhdGUucmVmcmVzaCgpXG4gICAgc2hhZGVyU3RhdGUucmVmcmVzaCgpXG4gICAgZ2xTdGF0ZS5yZWZyZXNoKClcbiAgICBpZiAob3B0aW9ucy5vbkNvbnRleHRSZXN0b3JlZCkge1xuICAgICAgb3B0aW9ucy5vbkNvbnRleHRSZXN0b3JlZCgpXG4gICAgfVxuICAgIGhhbmRsZVJBRigpXG4gIH1cblxuICBpZiAoY2FudmFzKSB7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoQ09OVEVYVF9MT1NUX0VWRU5ULCBoYW5kbGVDb250ZXh0TG9zcywgZmFsc2UpXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoQ09OVEVYVF9SRVNUT1JFRF9FVkVOVCwgaGFuZGxlQ29udGV4dFJlc3RvcmVkLCBmYWxzZSlcbiAgfVxuXG4gIC8vIFJlc291cmNlIGRlc3RydWN0dWlvblxuICBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgICBzdG9wUkFGKClcblxuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKENPTlRFWFRfTE9TVF9FVkVOVCwgaGFuZGxlQ29udGV4dExvc3MpXG4gICAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihDT05URVhUX1JFU1RPUkVEX0VWRU5ULCBoYW5kbGVDb250ZXh0UmVzdG9yZWQpXG4gICAgfVxuXG4gICAgc2hhZGVyU3RhdGUuY2xlYXIoKVxuICAgIGZyYW1lYnVmZmVyU3RhdGUuY2xlYXIoKVxuICAgIHJlbmRlcmJ1ZmZlclN0YXRlLmNsZWFyKClcbiAgICB0ZXh0dXJlU3RhdGUuY2xlYXIoKVxuICAgIGJ1ZmZlclN0YXRlLmNsZWFyKClcblxuICAgIGlmIChvcHRpb25zLm9uRGVzdHJveSkge1xuICAgICAgb3B0aW9ucy5vbkRlc3Ryb3koKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBpbGVQcm9jZWR1cmUgKG9wdGlvbnMpIHtcbiAgICBjaGVjayghIW9wdGlvbnMsICdpbnZhbGlkIGFyZ3MgdG8gcmVnbCh7Li4ufSknKVxuICAgIGNoZWNrLnR5cGUob3B0aW9ucywgJ29iamVjdCcsICdpbnZhbGlkIGFyZ3MgdG8gcmVnbCh7Li4ufSknKVxuXG4gICAgdmFyIGhhc0R5bmFtaWMgPSBmYWxzZVxuXG4gICAgZnVuY3Rpb24gZmxhdHRlbk5lc3RlZE9wdGlvbnMgKG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKVxuICAgICAgZGVsZXRlIHJlc3VsdC51bmlmb3Jtc1xuICAgICAgZGVsZXRlIHJlc3VsdC5hdHRyaWJ1dGVzXG5cbiAgICAgIGZ1bmN0aW9uIG1lcmdlIChuYW1lKSB7XG4gICAgICAgIGlmIChuYW1lIGluIHJlc3VsdCkge1xuICAgICAgICAgIHZhciBjaGlsZCA9IHJlc3VsdFtuYW1lXVxuICAgICAgICAgIGRlbGV0ZSByZXN1bHRbbmFtZV1cbiAgICAgICAgICBPYmplY3Qua2V5cyhjaGlsZCkuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWUgKyAnLicgKyBwcm9wXSA9IGNoaWxkW3Byb3BdXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbWVyZ2UoJ2JsZW5kJylcbiAgICAgIG1lcmdlKCdkZXB0aCcpXG4gICAgICBtZXJnZSgnY3VsbCcpXG4gICAgICBtZXJnZSgnc3RlbmNpbCcpXG4gICAgICBtZXJnZSgncG9seWdvbk9mZnNldCcpXG4gICAgICBtZXJnZSgnc2Npc3NvcicpXG4gICAgICBtZXJnZSgnc2FtcGxlJylcblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIC8vIEZpcnN0IHdlIHNlcGFyYXRlIHRoZSBvcHRpb25zIGludG8gc3RhdGljIGFuZCBkeW5hbWljIGNvbXBvbmVudHNcbiAgICBmdW5jdGlvbiBzZXBhcmF0ZUR5bmFtaWMgKG9iamVjdCkge1xuICAgICAgdmFyIHN0YXRpY0l0ZW1zID0ge31cbiAgICAgIHZhciBkeW5hbWljSXRlbXMgPSB7fVxuICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W29wdGlvbl1cbiAgICAgICAgaWYgKGR5bmFtaWMuaXNEeW5hbWljKHZhbHVlKSkge1xuICAgICAgICAgIGhhc0R5bmFtaWMgPSB0cnVlXG4gICAgICAgICAgZHluYW1pY0l0ZW1zW29wdGlvbl0gPSBkeW5hbWljLnVuYm94KHZhbHVlLCBvcHRpb24pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhdGljSXRlbXNbb3B0aW9uXSA9IHZhbHVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4ge1xuICAgICAgICBkeW5hbWljOiBkeW5hbWljSXRlbXMsXG4gICAgICAgIHN0YXRpYzogc3RhdGljSXRlbXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdW5pZm9ybXMgPSBzZXBhcmF0ZUR5bmFtaWMob3B0aW9ucy51bmlmb3JtcyB8fCB7fSlcbiAgICB2YXIgYXR0cmlidXRlcyA9IHNlcGFyYXRlRHluYW1pYyhvcHRpb25zLmF0dHJpYnV0ZXMgfHwge30pXG4gICAgdmFyIG9wdHMgPSBzZXBhcmF0ZUR5bmFtaWMoZmxhdHRlbk5lc3RlZE9wdGlvbnMob3B0aW9ucykpXG5cbiAgICB2YXIgY29tcGlsZWQgPSBjb21waWxlci5jb21tYW5kKFxuICAgICAgb3B0cy5zdGF0aWMsIHVuaWZvcm1zLnN0YXRpYywgYXR0cmlidXRlcy5zdGF0aWMsXG4gICAgICBvcHRzLmR5bmFtaWMsIHVuaWZvcm1zLmR5bmFtaWMsIGF0dHJpYnV0ZXMuZHluYW1pYyxcbiAgICAgIGhhc0R5bmFtaWMpXG5cbiAgICB2YXIgZHJhdyA9IGNvbXBpbGVkLmRyYXdcbiAgICB2YXIgYmF0Y2ggPSBjb21waWxlZC5iYXRjaFxuICAgIHZhciBzY29wZSA9IGNvbXBpbGVkLnNjb3BlXG5cbiAgICB2YXIgRU1QVFlfQVJSQVkgPSBbXVxuICAgIGZ1bmN0aW9uIHJlc2VydmUgKGNvdW50KSB7XG4gICAgICB3aGlsZSAoRU1QVFlfQVJSQVkubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgICAgRU1QVFlfQVJSQVkucHVzaChudWxsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIEVNUFRZX0FSUkFZXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUkVHTENvbW1hbmQgKGFyZ3MsIGJvZHkpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJncyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIGJhdGNoKGFyZ3MgfCAwLCByZXNlcnZlKGFyZ3MgfCAwKSlcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmdzKSkge1xuICAgICAgICByZXR1cm4gYmF0Y2goYXJncy5sZW5ndGgsIGFyZ3MpXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBzY29wZShudWxsLCBhcmdzKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gc2NvcGUoYXJncywgYm9keSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBkcmF3KGFyZ3MpXG4gICAgfVxuXG4gICAgcmV0dXJuIFJFR0xDb21tYW5kXG4gIH1cblxuICBmdW5jdGlvbiBwb2xsICgpIHtcbiAgICBmcmFtZWJ1ZmZlclN0YXRlLnBvbGwoKVxuICAgIGdsU3RhdGUucG9sbCgpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhciAob3B0aW9ucykge1xuICAgIHZhciBjbGVhckZsYWdzID0gMFxuXG4gICAgLy8gVXBkYXRlIGNvbnRleHQgc3RhdGVcbiAgICBwb2xsKClcblxuICAgIHZhciBjID0gb3B0aW9ucy5jb2xvclxuICAgIGlmIChjKSB7XG4gICAgICBnbC5jbGVhckNvbG9yKCtjWzBdIHx8IDAsICtjWzFdIHx8IDAsICtjWzJdIHx8IDAsICtjWzNdIHx8IDApXG4gICAgICBjbGVhckZsYWdzIHw9IEdMX0NPTE9SX0JVRkZFUl9CSVRcbiAgICB9XG4gICAgaWYgKCdkZXB0aCcgaW4gb3B0aW9ucykge1xuICAgICAgZ2wuY2xlYXJEZXB0aCgrb3B0aW9ucy5kZXB0aClcbiAgICAgIGNsZWFyRmxhZ3MgfD0gR0xfREVQVEhfQlVGRkVSX0JJVFxuICAgIH1cbiAgICBpZiAoJ3N0ZW5jaWwnIGluIG9wdGlvbnMpIHtcbiAgICAgIGdsLmNsZWFyU3RlbmNpbChvcHRpb25zLnN0ZW5jaWwgfCAwKVxuICAgICAgY2xlYXJGbGFncyB8PSBHTF9TVEVOQ0lMX0JVRkZFUl9CSVRcbiAgICB9XG5cbiAgICBjaGVjayghIWNsZWFyRmxhZ3MsICdjYWxsZWQgcmVnbC5jbGVhciB3aXRoIG5vIGJ1ZmZlciBzcGVjaWZpZWQnKVxuICAgIGdsLmNsZWFyKGNsZWFyRmxhZ3MpXG4gIH1cblxuICAvLyBSZWdpc3RlcnMgYW5vdGhlciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgY2FsbGJhY2tcbiAgZnVuY3Rpb24gZnJhbWUgKGNiKSB7XG4gICAgcmFmQ2FsbGJhY2tzLnB1c2goY2IpXG5cbiAgICBmdW5jdGlvbiBjYW5jZWwgKCkge1xuICAgICAgdmFyIGluZGV4ID0gcmFmQ2FsbGJhY2tzLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0gPT09IGNiXG4gICAgICB9KVxuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHJhZkNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICBpZiAocmFmQ2FsbGJhY2tzLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIHN0b3BSQUYoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0UkFGKClcblxuICAgIHJldHVybiB7XG4gICAgICBjYW5jZWw6IGNhbmNlbFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKGNvbXBpbGVQcm9jZWR1cmUsIHtcbiAgICAvLyBDbGVhciBjdXJyZW50IEZCT1xuICAgIGNsZWFyOiBjbGVhcixcblxuICAgIC8vIFNob3J0IGN1dCBmb3IgcHJvcCBiaW5kaW5nXG4gICAgcHJvcDogZHluYW1pYy5kZWZpbmUsXG5cbiAgICAvLyBleGVjdXRlcyBhbiBlbXB0eSBkcmF3IGNvbW1hbmRcbiAgICBkcmF3OiBjb21waWxlUHJvY2VkdXJlKHt9KSxcblxuICAgIC8vIFJlc291cmNlc1xuICAgIGVsZW1lbnRzOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIGVsZW1lbnRTdGF0ZS5jcmVhdGUob3B0aW9ucylcbiAgICB9LFxuICAgIGJ1ZmZlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBidWZmZXJTdGF0ZS5jcmVhdGUob3B0aW9ucywgR0xfQVJSQVlfQlVGRkVSKVxuICAgIH0sXG4gICAgdGV4dHVyZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0ZXh0dXJlU3RhdGUuY3JlYXRlKG9wdGlvbnMsIEdMX1RFWFRVUkVfMkQpXG4gICAgfSxcbiAgICBjdWJlOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgcmV0dXJuIHRleHR1cmVTdGF0ZS5jcmVhdGUoXG4gICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgICAgICBHTF9URVhUVVJFX0NVQkVfTUFQKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRleHR1cmVTdGF0ZS5jcmVhdGUob3B0aW9ucywgR0xfVEVYVFVSRV9DVUJFX01BUClcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbmRlcmJ1ZmZlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiByZW5kZXJidWZmZXJTdGF0ZS5jcmVhdGUob3B0aW9ucylcbiAgICB9LFxuICAgIGZyYW1lYnVmZmVyOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIGZyYW1lYnVmZmVyU3RhdGUuY3JlYXRlKG9wdGlvbnMpXG4gICAgfSxcbiAgICBmcmFtZWJ1ZmZlckN1YmU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICBjaGVjay5yYWlzZSgnZnJhbWVidWZmZXIgY3ViZSBub3QgeWV0IGltcGxlbWVudGVkJylcbiAgICB9LFxuXG4gICAgLy8gRnJhbWUgcmVuZGVyaW5nXG4gICAgZnJhbWU6IGZyYW1lLFxuICAgIHN0YXRzOiBmcmFtZVN0YXRlLFxuXG4gICAgLy8gU3lzdGVtIGxpbWl0c1xuICAgIGxpbWl0czogbGltaXRzLFxuXG4gICAgLy8gUmVhZCBwaXhlbHNcbiAgICByZWFkOiByZWFkUGl4ZWxzLFxuXG4gICAgLy8gRGVzdHJveSByZWdsIGFuZCBhbGwgYXNzb2NpYXRlZCByZXNvdXJjZXNcbiAgICBkZXN0cm95OiBkZXN0cm95XG4gIH0pXG59XG4iXX0=