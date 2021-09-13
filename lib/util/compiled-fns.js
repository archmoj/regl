module.exports = {
 '$0': function ($0
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v74, v75, v76, v77, v78, v79, v80, v81, v88, v89, v94, v95, v96, v97, v98, v99, v100, v101, v104, v105, v106, v107, v108, v109;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v74 = v10.blend_color;
  v75 = v3.blend_color;
  v76 = v10.blend_equation;
  v77 = v3.blend_equation;
  v78 = v10.blend_func;
  v79 = v3.blend_func;
  v80 = v10.colorMask;
  v81 = v3.colorMask;
  v88 = v10.depth_range;
  v89 = v3.depth_range;
  v94 = v10.polygonOffset_offset;
  v95 = v3.polygonOffset_offset;
  v96 = v10.sample_coverage;
  v97 = v3.sample_coverage;
  v98 = v10.scissor_box;
  v99 = v3.scissor_box;
  v100 = v10.stencil_func;
  v101 = v3.stencil_func;
  v104 = v10.stencil_opBack;
  v105 = v3.stencil_opBack;
  v106 = v10.stencil_opFront;
  v107 = v3.stencil_opFront;
  v108 = v10.viewport;
  v109 = v3.viewport;
  return {
   'poll': function () {
    var v47;
    var v65, v66, v67, v68, v69, v70, v71, v72, v73, v82, v83, v84, v85, v86, v87, v90, v91, v92, v93, v102, v103;
    v3.dirty = false;
    v65 = v10.blend_enable;
    v66 = v10.cull_enable;
    v67 = v10.depth_enable;
    v68 = v10.dither;
    v69 = v10.polygonOffset_enable;
    v70 = v10.sample_alpha;
    v71 = v10.sample_enable;
    v72 = v10.scissor_enable;
    v73 = v10.stencil_enable;
    v82 = v10.cull_face;
    v83 = v3.cull_face;
    v84 = v10.depth_func;
    v85 = v3.depth_func;
    v86 = v10.depth_mask;
    v87 = v3.depth_mask;
    v90 = v10.frontFace;
    v91 = v3.frontFace;
    v92 = v10.lineWidth;
    v93 = v3.lineWidth;
    v102 = v10.stencil_mask;
    v103 = v3.stencil_mask;
    v47 = v7.next;
    if (v47 !== v7.cur) {
     if (v47) {
      v8.bindFramebuffer(36160, v47.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v47;
    }
    if (v65 !== v3.blend_enable) {
     if (v65) {
      v8.enable(3042)
     }
     else {
      v8.disable(3042)
     }
     v3.blend_enable = v65;
    }
    if (v66 !== v3.cull_enable) {
     if (v66) {
      v8.enable(2884)
     }
     else {
      v8.disable(2884)
     }
     v3.cull_enable = v66;
    }
    if (v67 !== v3.depth_enable) {
     if (v67) {
      v8.enable(2929)
     }
     else {
      v8.disable(2929)
     }
     v3.depth_enable = v67;
    }
    if (v68 !== v3.dither) {
     if (v68) {
      v8.enable(3024)
     }
     else {
      v8.disable(3024)
     }
     v3.dither = v68;
    }
    if (v69 !== v3.polygonOffset_enable) {
     if (v69) {
      v8.enable(32823)
     }
     else {
      v8.disable(32823)
     }
     v3.polygonOffset_enable = v69;
    }
    if (v70 !== v3.sample_alpha) {
     if (v70) {
      v8.enable(32926)
     }
     else {
      v8.disable(32926)
     }
     v3.sample_alpha = v70;
    }
    if (v71 !== v3.sample_enable) {
     if (v71) {
      v8.enable(32928)
     }
     else {
      v8.disable(32928)
     }
     v3.sample_enable = v71;
    }
    if (v72 !== v3.scissor_enable) {
     if (v72) {
      v8.enable(3089)
     }
     else {
      v8.disable(3089)
     }
     v3.scissor_enable = v72;
    }
    if (v73 !== v3.stencil_enable) {
     if (v73) {
      v8.enable(2960)
     }
     else {
      v8.disable(2960)
     }
     v3.stencil_enable = v73;
    }
    if (v74[0] !== v75[0] || v74[1] !== v75[1] || v74[2] !== v75[2] || v74[3] !== v75[3]) {
     v8.blendColor(v74[0], v74[1], v74[2], v74[3]);
     v75[0] = v74[0];
     v75[1] = v74[1];
     v75[2] = v74[2];
     v75[3] = v74[3];
    }
    if (v76[0] !== v77[0] || v76[1] !== v77[1]) {
     v8.blendEquationSeparate(v76[0], v76[1]);
     v77[0] = v76[0];
     v77[1] = v76[1];
    }
    if (v78[0] !== v79[0] || v78[1] !== v79[1] || v78[2] !== v79[2] || v78[3] !== v79[3]) {
     v8.blendFuncSeparate(v78[0], v78[1], v78[2], v78[3]);
     v79[0] = v78[0];
     v79[1] = v78[1];
     v79[2] = v78[2];
     v79[3] = v78[3];
    }
    if (v80[0] !== v81[0] || v80[1] !== v81[1] || v80[2] !== v81[2] || v80[3] !== v81[3]) {
     v8.colorMask(v80[0], v80[1], v80[2], v80[3]);
     v81[0] = v80[0];
     v81[1] = v80[1];
     v81[2] = v80[2];
     v81[3] = v80[3];
    }
    if (v82 !== v83) {
     v8.cullFace(v82);
     v3.cull_face = v82;
    }
    if (v84 !== v85) {
     v8.depthFunc(v84);
     v3.depth_func = v84;
    }
    if (v86 !== v87) {
     v8.depthMask(v86);
     v3.depth_mask = v86;
    }
    if (v88[0] !== v89[0] || v88[1] !== v89[1]) {
     v8.depthRange(v88[0], v88[1]);
     v89[0] = v88[0];
     v89[1] = v88[1];
    }
    if (v90 !== v91) {
     v8.frontFace(v90);
     v3.frontFace = v90;
    }
    if (v92 !== v93) {
     v8.lineWidth(v92);
     v3.lineWidth = v92;
    }
    if (v94[0] !== v95[0] || v94[1] !== v95[1]) {
     v8.polygonOffset(v94[0], v94[1]);
     v95[0] = v94[0];
     v95[1] = v94[1];
    }
    if (v96[0] !== v97[0] || v96[1] !== v97[1]) {
     v8.sampleCoverage(v96[0], v96[1]);
     v97[0] = v96[0];
     v97[1] = v96[1];
    }
    if (v98[0] !== v99[0] || v98[1] !== v99[1] || v98[2] !== v99[2] || v98[3] !== v99[3]) {
     v8.scissor(v98[0], v98[1], v98[2], v98[3]);
     v99[0] = v98[0];
     v99[1] = v98[1];
     v99[2] = v98[2];
     v99[3] = v98[3];
    }
    if (v100[0] !== v101[0] || v100[1] !== v101[1] || v100[2] !== v101[2]) {
     v8.stencilFunc(v100[0], v100[1], v100[2]);
     v101[0] = v100[0];
     v101[1] = v100[1];
     v101[2] = v100[2];
    }
    if (v102 !== v103) {
     v8.stencilMask(v102);
     v3.stencil_mask = v102;
    }
    if (v104[0] !== v105[0] || v104[1] !== v105[1] || v104[2] !== v105[2] || v104[3] !== v105[3]) {
     v8.stencilOpSeparate(v104[0], v104[1], v104[2], v104[3]);
     v105[0] = v104[0];
     v105[1] = v104[1];
     v105[2] = v104[2];
     v105[3] = v104[3];
    }
    if (v106[0] !== v107[0] || v106[1] !== v107[1] || v106[2] !== v107[2] || v106[3] !== v107[3]) {
     v8.stencilOpSeparate(v106[0], v106[1], v106[2], v106[3]);
     v107[0] = v106[0];
     v107[1] = v106[1];
     v107[2] = v106[2];
     v107[3] = v106[3];
    }
    if (v108[0] !== v109[0] || v108[1] !== v109[1] || v108[2] !== v109[2] || v108[3] !== v109[3]) {
     v8.viewport(v108[0], v108[1], v108[2], v108[3]);
     v109[0] = v108[0];
     v109[1] = v108[1];
     v109[2] = v108[2];
     v109[3] = v108[3];
    }
   }
   , 'refresh': function () {
    var v48, v49, v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64;
    var v65, v66, v67, v68, v69, v70, v71, v72, v73, v82, v83, v84, v85, v86, v87, v90, v91, v92, v93, v102, v103;
    v3.dirty = false;
    v65 = v10.blend_enable;
    v66 = v10.cull_enable;
    v67 = v10.depth_enable;
    v68 = v10.dither;
    v69 = v10.polygonOffset_enable;
    v70 = v10.sample_alpha;
    v71 = v10.sample_enable;
    v72 = v10.scissor_enable;
    v73 = v10.stencil_enable;
    v82 = v10.cull_face;
    v83 = v3.cull_face;
    v84 = v10.depth_func;
    v85 = v3.depth_func;
    v86 = v10.depth_mask;
    v87 = v3.depth_mask;
    v90 = v10.frontFace;
    v91 = v3.frontFace;
    v92 = v10.lineWidth;
    v93 = v3.lineWidth;
    v102 = v10.stencil_mask;
    v103 = v3.stencil_mask;
    v48 = v7.next;
    if (v48) {
     v8.bindFramebuffer(36160, v48.framebuffer);
    }
    else {
     v8.bindFramebuffer(36160, null);
    }
    v7.cur = v48;
    v49 = v0[0];
    if (v49.buffer) {
     v8.enableVertexAttribArray(0);
     v8.bindBuffer(34962, v49.buffer.buffer);
     v8.vertexAttribPointer(0, v49.size, v49.type, v49.normalized, v49.stride, v49.offset);
    }
    else {
     v8.disableVertexAttribArray(0);
     v8.vertexAttrib4f(0, v49.x, v49.y, v49.z, v49.w);
     v49.buffer = null;
    }
    v50 = v0[1];
    if (v50.buffer) {
     v8.enableVertexAttribArray(1);
     v8.bindBuffer(34962, v50.buffer.buffer);
     v8.vertexAttribPointer(1, v50.size, v50.type, v50.normalized, v50.stride, v50.offset);
    }
    else {
     v8.disableVertexAttribArray(1);
     v8.vertexAttrib4f(1, v50.x, v50.y, v50.z, v50.w);
     v50.buffer = null;
    }
    v51 = v0[2];
    if (v51.buffer) {
     v8.enableVertexAttribArray(2);
     v8.bindBuffer(34962, v51.buffer.buffer);
     v8.vertexAttribPointer(2, v51.size, v51.type, v51.normalized, v51.stride, v51.offset);
    }
    else {
     v8.disableVertexAttribArray(2);
     v8.vertexAttrib4f(2, v51.x, v51.y, v51.z, v51.w);
     v51.buffer = null;
    }
    v52 = v0[3];
    if (v52.buffer) {
     v8.enableVertexAttribArray(3);
     v8.bindBuffer(34962, v52.buffer.buffer);
     v8.vertexAttribPointer(3, v52.size, v52.type, v52.normalized, v52.stride, v52.offset);
    }
    else {
     v8.disableVertexAttribArray(3);
     v8.vertexAttrib4f(3, v52.x, v52.y, v52.z, v52.w);
     v52.buffer = null;
    }
    v53 = v0[4];
    if (v53.buffer) {
     v8.enableVertexAttribArray(4);
     v8.bindBuffer(34962, v53.buffer.buffer);
     v8.vertexAttribPointer(4, v53.size, v53.type, v53.normalized, v53.stride, v53.offset);
    }
    else {
     v8.disableVertexAttribArray(4);
     v8.vertexAttrib4f(4, v53.x, v53.y, v53.z, v53.w);
     v53.buffer = null;
    }
    v54 = v0[5];
    if (v54.buffer) {
     v8.enableVertexAttribArray(5);
     v8.bindBuffer(34962, v54.buffer.buffer);
     v8.vertexAttribPointer(5, v54.size, v54.type, v54.normalized, v54.stride, v54.offset);
    }
    else {
     v8.disableVertexAttribArray(5);
     v8.vertexAttrib4f(5, v54.x, v54.y, v54.z, v54.w);
     v54.buffer = null;
    }
    v55 = v0[6];
    if (v55.buffer) {
     v8.enableVertexAttribArray(6);
     v8.bindBuffer(34962, v55.buffer.buffer);
     v8.vertexAttribPointer(6, v55.size, v55.type, v55.normalized, v55.stride, v55.offset);
    }
    else {
     v8.disableVertexAttribArray(6);
     v8.vertexAttrib4f(6, v55.x, v55.y, v55.z, v55.w);
     v55.buffer = null;
    }
    v56 = v0[7];
    if (v56.buffer) {
     v8.enableVertexAttribArray(7);
     v8.bindBuffer(34962, v56.buffer.buffer);
     v8.vertexAttribPointer(7, v56.size, v56.type, v56.normalized, v56.stride, v56.offset);
    }
    else {
     v8.disableVertexAttribArray(7);
     v8.vertexAttrib4f(7, v56.x, v56.y, v56.z, v56.w);
     v56.buffer = null;
    }
    v57 = v0[8];
    if (v57.buffer) {
     v8.enableVertexAttribArray(8);
     v8.bindBuffer(34962, v57.buffer.buffer);
     v8.vertexAttribPointer(8, v57.size, v57.type, v57.normalized, v57.stride, v57.offset);
    }
    else {
     v8.disableVertexAttribArray(8);
     v8.vertexAttrib4f(8, v57.x, v57.y, v57.z, v57.w);
     v57.buffer = null;
    }
    v58 = v0[9];
    if (v58.buffer) {
     v8.enableVertexAttribArray(9);
     v8.bindBuffer(34962, v58.buffer.buffer);
     v8.vertexAttribPointer(9, v58.size, v58.type, v58.normalized, v58.stride, v58.offset);
    }
    else {
     v8.disableVertexAttribArray(9);
     v8.vertexAttrib4f(9, v58.x, v58.y, v58.z, v58.w);
     v58.buffer = null;
    }
    v59 = v0[10];
    if (v59.buffer) {
     v8.enableVertexAttribArray(10);
     v8.bindBuffer(34962, v59.buffer.buffer);
     v8.vertexAttribPointer(10, v59.size, v59.type, v59.normalized, v59.stride, v59.offset);
    }
    else {
     v8.disableVertexAttribArray(10);
     v8.vertexAttrib4f(10, v59.x, v59.y, v59.z, v59.w);
     v59.buffer = null;
    }
    v60 = v0[11];
    if (v60.buffer) {
     v8.enableVertexAttribArray(11);
     v8.bindBuffer(34962, v60.buffer.buffer);
     v8.vertexAttribPointer(11, v60.size, v60.type, v60.normalized, v60.stride, v60.offset);
    }
    else {
     v8.disableVertexAttribArray(11);
     v8.vertexAttrib4f(11, v60.x, v60.y, v60.z, v60.w);
     v60.buffer = null;
    }
    v61 = v0[12];
    if (v61.buffer) {
     v8.enableVertexAttribArray(12);
     v8.bindBuffer(34962, v61.buffer.buffer);
     v8.vertexAttribPointer(12, v61.size, v61.type, v61.normalized, v61.stride, v61.offset);
    }
    else {
     v8.disableVertexAttribArray(12);
     v8.vertexAttrib4f(12, v61.x, v61.y, v61.z, v61.w);
     v61.buffer = null;
    }
    v62 = v0[13];
    if (v62.buffer) {
     v8.enableVertexAttribArray(13);
     v8.bindBuffer(34962, v62.buffer.buffer);
     v8.vertexAttribPointer(13, v62.size, v62.type, v62.normalized, v62.stride, v62.offset);
    }
    else {
     v8.disableVertexAttribArray(13);
     v8.vertexAttrib4f(13, v62.x, v62.y, v62.z, v62.w);
     v62.buffer = null;
    }
    v63 = v0[14];
    if (v63.buffer) {
     v8.enableVertexAttribArray(14);
     v8.bindBuffer(34962, v63.buffer.buffer);
     v8.vertexAttribPointer(14, v63.size, v63.type, v63.normalized, v63.stride, v63.offset);
    }
    else {
     v8.disableVertexAttribArray(14);
     v8.vertexAttrib4f(14, v63.x, v63.y, v63.z, v63.w);
     v63.buffer = null;
    }
    v64 = v0[15];
    if (v64.buffer) {
     v8.enableVertexAttribArray(15);
     v8.bindBuffer(34962, v64.buffer.buffer);
     v8.vertexAttribPointer(15, v64.size, v64.type, v64.normalized, v64.stride, v64.offset);
    }
    else {
     v8.disableVertexAttribArray(15);
     v8.vertexAttrib4f(15, v64.x, v64.y, v64.z, v64.w);
     v64.buffer = null;
    }
    v15.currentVAO = null;
    v15.setVAO(v15.targetVAO);
    if (v65) {
     v8.enable(3042)
    }
    else {
     v8.disable(3042)
    }
    v3.blend_enable = v65;
    if (v66) {
     v8.enable(2884)
    }
    else {
     v8.disable(2884)
    }
    v3.cull_enable = v66;
    if (v67) {
     v8.enable(2929)
    }
    else {
     v8.disable(2929)
    }
    v3.depth_enable = v67;
    if (v68) {
     v8.enable(3024)
    }
    else {
     v8.disable(3024)
    }
    v3.dither = v68;
    if (v69) {
     v8.enable(32823)
    }
    else {
     v8.disable(32823)
    }
    v3.polygonOffset_enable = v69;
    if (v70) {
     v8.enable(32926)
    }
    else {
     v8.disable(32926)
    }
    v3.sample_alpha = v70;
    if (v71) {
     v8.enable(32928)
    }
    else {
     v8.disable(32928)
    }
    v3.sample_enable = v71;
    if (v72) {
     v8.enable(3089)
    }
    else {
     v8.disable(3089)
    }
    v3.scissor_enable = v72;
    if (v73) {
     v8.enable(2960)
    }
    else {
     v8.disable(2960)
    }
    v3.stencil_enable = v73;
    v8.blendColor(v74[0], v74[1], v74[2], v74[3]);
    v75[0] = v74[0];
    v75[1] = v74[1];
    v75[2] = v74[2];
    v75[3] = v74[3];
    v8.blendEquationSeparate(v76[0], v76[1]);
    v77[0] = v76[0];
    v77[1] = v76[1];
    v8.blendFuncSeparate(v78[0], v78[1], v78[2], v78[3]);
    v79[0] = v78[0];
    v79[1] = v78[1];
    v79[2] = v78[2];
    v79[3] = v78[3];
    v8.colorMask(v80[0], v80[1], v80[2], v80[3]);
    v81[0] = v80[0];
    v81[1] = v80[1];
    v81[2] = v80[2];
    v81[3] = v80[3];
    v8.cullFace(v82);
    v3.cull_face = v82;
    v8.depthFunc(v84);
    v3.depth_func = v84;
    v8.depthMask(v86);
    v3.depth_mask = v86;
    v8.depthRange(v88[0], v88[1]);
    v89[0] = v88[0];
    v89[1] = v88[1];
    v8.frontFace(v90);
    v3.frontFace = v90;
    v8.lineWidth(v92);
    v3.lineWidth = v92;
    v8.polygonOffset(v94[0], v94[1]);
    v95[0] = v94[0];
    v95[1] = v94[1];
    v8.sampleCoverage(v96[0], v96[1]);
    v97[0] = v96[0];
    v97[1] = v96[1];
    v8.scissor(v98[0], v98[1], v98[2], v98[3]);
    v99[0] = v98[0];
    v99[1] = v98[1];
    v99[2] = v98[2];
    v99[3] = v98[3];
    v8.stencilFunc(v100[0], v100[1], v100[2]);
    v101[0] = v100[0];
    v101[1] = v100[1];
    v101[2] = v100[2];
    v8.stencilMask(v102);
    v3.stencil_mask = v102;
    v8.stencilOpSeparate(v104[0], v104[1], v104[2], v104[3]);
    v105[0] = v104[0];
    v105[1] = v104[1];
    v105[2] = v104[2];
    v105[3] = v104[3];
    v8.stencilOpSeparate(v106[0], v106[1], v106[2], v106[3]);
    v107[0] = v106[0];
    v107[1] = v106[1];
    v107[2] = v106[2];
    v107[3] = v106[3];
    v8.viewport(v108[0], v108[1], v108[2], v108[3]);
    v109[0] = v108[0];
    v109[1] = v108[1];
    v109[2] = v108[2];
    v109[3] = v108[3];
   }
   ,
  }

 },
 '$3': function ($0, $1, $2, $3
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v106, v168;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v106 = {
  }
   ;
  v168 = {
  }
   ;
  return {
   'batch': function (a0, a1) {
    var v109, v110, v165, v166, v167, v169, v170;
    v109 = v6.angle_instanced_arrays;
    v110 = v7.next;
    if (v110 !== v7.cur) {
     if (v110) {
      v8.bindFramebuffer(36160, v110.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v110;
    }
    if (v3.dirty) {
     var v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153, v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164;
     v111 = v10.dither;
     if (v111 !== v3.dither) {
      if (v111) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v111;
     }
     v112 = v10.blend_enable;
     if (v112 !== v3.blend_enable) {
      if (v112) {
       v8.enable(3042);
      }
      else {
       v8.disable(3042);
      }
      v3.blend_enable = v112;
     }
     v113 = v16[0];
     v114 = v16[1];
     v115 = v16[2];
     v116 = v16[3];
     if (v113 !== v17[0] || v114 !== v17[1] || v115 !== v17[2] || v116 !== v17[3]) {
      v8.blendColor(v113, v114, v115, v116);
      v17[0] = v113;
      v17[1] = v114;
      v17[2] = v115;
      v17[3] = v116;
     }
     v117 = v18[0];
     v118 = v18[1];
     if (v117 !== v19[0] || v118 !== v19[1]) {
      v8.blendEquationSeparate(v117, v118);
      v19[0] = v117;
      v19[1] = v118;
     }
     v119 = v20[0];
     v120 = v20[1];
     v121 = v20[2];
     v122 = v20[3];
     if (v119 !== v21[0] || v120 !== v21[1] || v121 !== v21[2] || v122 !== v21[3]) {
      v8.blendFuncSeparate(v119, v120, v121, v122);
      v21[0] = v119;
      v21[1] = v120;
      v21[2] = v121;
      v21[3] = v122;
     }
     v123 = v10.depth_enable;
     if (v123 !== v3.depth_enable) {
      if (v123) {
       v8.enable(2929);
      }
      else {
       v8.disable(2929);
      }
      v3.depth_enable = v123;
     }
     v124 = v10.depth_func;
     if (v124 !== v3.depth_func) {
      v8.depthFunc(v124);
      v3.depth_func = v124;
     }
     v125 = v24[0];
     v126 = v24[1];
     if (v125 !== v25[0] || v126 !== v25[1]) {
      v8.depthRange(v125, v126);
      v25[0] = v125;
      v25[1] = v126;
     }
     v127 = v10.depth_mask;
     if (v127 !== v3.depth_mask) {
      v8.depthMask(v127);
      v3.depth_mask = v127;
     }
     v128 = v22[0];
     v129 = v22[1];
     v130 = v22[2];
     v131 = v22[3];
     if (v128 !== v23[0] || v129 !== v23[1] || v130 !== v23[2] || v131 !== v23[3]) {
      v8.colorMask(v128, v129, v130, v131);
      v23[0] = v128;
      v23[1] = v129;
      v23[2] = v130;
      v23[3] = v131;
     }
     v132 = v10.cull_enable;
     if (v132 !== v3.cull_enable) {
      if (v132) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v132;
     }
     v133 = v10.cull_face;
     if (v133 !== v3.cull_face) {
      v8.cullFace(v133);
      v3.cull_face = v133;
     }
     v134 = v10.frontFace;
     if (v134 !== v3.frontFace) {
      v8.frontFace(v134);
      v3.frontFace = v134;
     }
     v135 = v10.lineWidth;
     if (v135 !== v3.lineWidth) {
      v8.lineWidth(v135);
      v3.lineWidth = v135;
     }
     v136 = v10.polygonOffset_enable;
     if (v136 !== v3.polygonOffset_enable) {
      if (v136) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v136;
     }
     v137 = v26[0];
     v138 = v26[1];
     if (v137 !== v27[0] || v138 !== v27[1]) {
      v8.polygonOffset(v137, v138);
      v27[0] = v137;
      v27[1] = v138;
     }
     v139 = v10.sample_alpha;
     if (v139 !== v3.sample_alpha) {
      if (v139) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v139;
     }
     v140 = v10.sample_enable;
     if (v140 !== v3.sample_enable) {
      if (v140) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v140;
     }
     v141 = v28[0];
     v142 = v28[1];
     if (v141 !== v29[0] || v142 !== v29[1]) {
      v8.sampleCoverage(v141, v142);
      v29[0] = v141;
      v29[1] = v142;
     }
     v143 = v10.stencil_enable;
     if (v143 !== v3.stencil_enable) {
      if (v143) {
       v8.enable(2960);
      }
      else {
       v8.disable(2960);
      }
      v3.stencil_enable = v143;
     }
     v144 = v10.stencil_mask;
     if (v144 !== v3.stencil_mask) {
      v8.stencilMask(v144);
      v3.stencil_mask = v144;
     }
     v145 = v32[0];
     v146 = v32[1];
     v147 = v32[2];
     if (v145 !== v33[0] || v146 !== v33[1] || v147 !== v33[2]) {
      v8.stencilFunc(v145, v146, v147);
      v33[0] = v145;
      v33[1] = v146;
      v33[2] = v147;
     }
     v148 = v36[0];
     v149 = v36[1];
     v150 = v36[2];
     v151 = v36[3];
     if (v148 !== v37[0] || v149 !== v37[1] || v150 !== v37[2] || v151 !== v37[3]) {
      v8.stencilOpSeparate(v148, v149, v150, v151);
      v37[0] = v148;
      v37[1] = v149;
      v37[2] = v150;
      v37[3] = v151;
     }
     v152 = v34[0];
     v153 = v34[1];
     v154 = v34[2];
     v155 = v34[3];
     if (v152 !== v35[0] || v153 !== v35[1] || v154 !== v35[2] || v155 !== v35[3]) {
      v8.stencilOpSeparate(v152, v153, v154, v155);
      v35[0] = v152;
      v35[1] = v153;
      v35[2] = v154;
      v35[3] = v155;
     }
     v156 = v10.scissor_enable;
     if (v156 !== v3.scissor_enable) {
      if (v156) {
       v8.enable(3089);
      }
      else {
       v8.disable(3089);
      }
      v3.scissor_enable = v156;
     }
     v157 = v30[0];
     v158 = v30[1];
     v159 = v30[2];
     v160 = v30[3];
     if (v157 !== v31[0] || v158 !== v31[1] || v159 !== v31[2] || v160 !== v31[3]) {
      v8.scissor(v157, v158, v159, v160);
      v31[0] = v157;
      v31[1] = v158;
      v31[2] = v159;
      v31[3] = v160;
     }
     v161 = v38[0];
     v162 = v38[1];
     v163 = v38[2];
     v164 = v38[3];
     if (v161 !== v39[0] || v162 !== v39[1] || v163 !== v39[2] || v164 !== v39[3]) {
      v8.viewport(v161, v162, v163, v164);
      v39[0] = v161;
      v39[1] = v162;
      v39[2] = v163;
      v39[3] = v164;
     }
     v3.dirty = false;
    }
    v165 = v11.frag;
    v166 = v11.vert;
    v167 = v11.program(v166, v165);
    v8.useProgram(v167.program);
    v15.setVAO(null);
    v169 = v167.id;
    v170 = v168[v169];
    if (v170) {
     v170.call(this, a0, a1);
    }
    else {
     v170 = v168[v169] = $3(v167);
     v170.call(this, a0, a1);
    }
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v47, v48, v103, v104, v105, v107, v108;
    v47 = v6.angle_instanced_arrays;
    v48 = v7.next;
    if (v48 !== v7.cur) {
     if (v48) {
      v8.bindFramebuffer(36160, v48.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v48;
    }
    if (v3.dirty) {
     var v49, v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102;
     v49 = v10.dither;
     if (v49 !== v3.dither) {
      if (v49) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v49;
     }
     v50 = v10.blend_enable;
     if (v50 !== v3.blend_enable) {
      if (v50) {
       v8.enable(3042);
      }
      else {
       v8.disable(3042);
      }
      v3.blend_enable = v50;
     }
     v51 = v16[0];
     v52 = v16[1];
     v53 = v16[2];
     v54 = v16[3];
     if (v51 !== v17[0] || v52 !== v17[1] || v53 !== v17[2] || v54 !== v17[3]) {
      v8.blendColor(v51, v52, v53, v54);
      v17[0] = v51;
      v17[1] = v52;
      v17[2] = v53;
      v17[3] = v54;
     }
     v55 = v18[0];
     v56 = v18[1];
     if (v55 !== v19[0] || v56 !== v19[1]) {
      v8.blendEquationSeparate(v55, v56);
      v19[0] = v55;
      v19[1] = v56;
     }
     v57 = v20[0];
     v58 = v20[1];
     v59 = v20[2];
     v60 = v20[3];
     if (v57 !== v21[0] || v58 !== v21[1] || v59 !== v21[2] || v60 !== v21[3]) {
      v8.blendFuncSeparate(v57, v58, v59, v60);
      v21[0] = v57;
      v21[1] = v58;
      v21[2] = v59;
      v21[3] = v60;
     }
     v61 = v10.depth_enable;
     if (v61 !== v3.depth_enable) {
      if (v61) {
       v8.enable(2929);
      }
      else {
       v8.disable(2929);
      }
      v3.depth_enable = v61;
     }
     v62 = v10.depth_func;
     if (v62 !== v3.depth_func) {
      v8.depthFunc(v62);
      v3.depth_func = v62;
     }
     v63 = v24[0];
     v64 = v24[1];
     if (v63 !== v25[0] || v64 !== v25[1]) {
      v8.depthRange(v63, v64);
      v25[0] = v63;
      v25[1] = v64;
     }
     v65 = v10.depth_mask;
     if (v65 !== v3.depth_mask) {
      v8.depthMask(v65);
      v3.depth_mask = v65;
     }
     v66 = v22[0];
     v67 = v22[1];
     v68 = v22[2];
     v69 = v22[3];
     if (v66 !== v23[0] || v67 !== v23[1] || v68 !== v23[2] || v69 !== v23[3]) {
      v8.colorMask(v66, v67, v68, v69);
      v23[0] = v66;
      v23[1] = v67;
      v23[2] = v68;
      v23[3] = v69;
     }
     v70 = v10.cull_enable;
     if (v70 !== v3.cull_enable) {
      if (v70) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v70;
     }
     v71 = v10.cull_face;
     if (v71 !== v3.cull_face) {
      v8.cullFace(v71);
      v3.cull_face = v71;
     }
     v72 = v10.frontFace;
     if (v72 !== v3.frontFace) {
      v8.frontFace(v72);
      v3.frontFace = v72;
     }
     v73 = v10.lineWidth;
     if (v73 !== v3.lineWidth) {
      v8.lineWidth(v73);
      v3.lineWidth = v73;
     }
     v74 = v10.polygonOffset_enable;
     if (v74 !== v3.polygonOffset_enable) {
      if (v74) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v74;
     }
     v75 = v26[0];
     v76 = v26[1];
     if (v75 !== v27[0] || v76 !== v27[1]) {
      v8.polygonOffset(v75, v76);
      v27[0] = v75;
      v27[1] = v76;
     }
     v77 = v10.sample_alpha;
     if (v77 !== v3.sample_alpha) {
      if (v77) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v77;
     }
     v78 = v10.sample_enable;
     if (v78 !== v3.sample_enable) {
      if (v78) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v78;
     }
     v79 = v28[0];
     v80 = v28[1];
     if (v79 !== v29[0] || v80 !== v29[1]) {
      v8.sampleCoverage(v79, v80);
      v29[0] = v79;
      v29[1] = v80;
     }
     v81 = v10.stencil_enable;
     if (v81 !== v3.stencil_enable) {
      if (v81) {
       v8.enable(2960);
      }
      else {
       v8.disable(2960);
      }
      v3.stencil_enable = v81;
     }
     v82 = v10.stencil_mask;
     if (v82 !== v3.stencil_mask) {
      v8.stencilMask(v82);
      v3.stencil_mask = v82;
     }
     v83 = v32[0];
     v84 = v32[1];
     v85 = v32[2];
     if (v83 !== v33[0] || v84 !== v33[1] || v85 !== v33[2]) {
      v8.stencilFunc(v83, v84, v85);
      v33[0] = v83;
      v33[1] = v84;
      v33[2] = v85;
     }
     v86 = v36[0];
     v87 = v36[1];
     v88 = v36[2];
     v89 = v36[3];
     if (v86 !== v37[0] || v87 !== v37[1] || v88 !== v37[2] || v89 !== v37[3]) {
      v8.stencilOpSeparate(v86, v87, v88, v89);
      v37[0] = v86;
      v37[1] = v87;
      v37[2] = v88;
      v37[3] = v89;
     }
     v90 = v34[0];
     v91 = v34[1];
     v92 = v34[2];
     v93 = v34[3];
     if (v90 !== v35[0] || v91 !== v35[1] || v92 !== v35[2] || v93 !== v35[3]) {
      v8.stencilOpSeparate(v90, v91, v92, v93);
      v35[0] = v90;
      v35[1] = v91;
      v35[2] = v92;
      v35[3] = v93;
     }
     v94 = v10.scissor_enable;
     if (v94 !== v3.scissor_enable) {
      if (v94) {
       v8.enable(3089);
      }
      else {
       v8.disable(3089);
      }
      v3.scissor_enable = v94;
     }
     v95 = v30[0];
     v96 = v30[1];
     v97 = v30[2];
     v98 = v30[3];
     if (v95 !== v31[0] || v96 !== v31[1] || v97 !== v31[2] || v98 !== v31[3]) {
      v8.scissor(v95, v96, v97, v98);
      v31[0] = v95;
      v31[1] = v96;
      v31[2] = v97;
      v31[3] = v98;
     }
     v99 = v38[0];
     v100 = v38[1];
     v101 = v38[2];
     v102 = v38[3];
     if (v99 !== v39[0] || v100 !== v39[1] || v101 !== v39[2] || v102 !== v39[3]) {
      v8.viewport(v99, v100, v101, v102);
      v39[0] = v99;
      v39[1] = v100;
      v39[2] = v101;
      v39[3] = v102;
     }
     v3.dirty = false;
    }
    v103 = v11.frag;
    v104 = v11.vert;
    v105 = v11.program(v104, v103);
    v8.useProgram(v105.program);
    v15.setVAO(null);
    v107 = v105.id;
    v108 = v106[v107];
    if (v108) {
     v108.call(this, a0);
    }
    else {
     v108 = v106[v107] = $2(v105);
     v108.call(this, a0);
    }
    v15.setVAO(null);
   }
   , 'scope': function (a0, a1, a2) {
    a1(v2, a0, a2);
   }
   ,
  }

 },
 '$38,colors,contextColor,dim0A,dim0B,dim0C,dim0D,dim1A,dim1B,dim1C,dim1D,drwLayer,hiA,hiB,hiC,hiD,loA,loB,loC,loD,maskHeight,maskTexture,p01_04,p05_08,p09_12,p13_16,p17_20,p21_24,p25_28,p29_32,p33_36,p37_40,p41_44,p45_48,p49_52,p53_56,p57_60,palette,resolution,viewBoxPos,viewBoxSize': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, colors, contextColor, dim0A, dim0B, dim0C, dim0D, dim1A, dim1B, dim1C, dim1D, drwLayer, hiA, hiB, hiC, hiD, loA, loB, loC, loD, maskHeight, maskTexture, p01_04, p05_08, p09_12, p13_16, p17_20, p21_24, p25_28, p29_32, p33_36, p37_40, p41_44, p45_48, p49_52, p53_56, p57_60, palette, resolution, viewBoxPos, viewBoxSize
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48, v126, v128, v130, v132, v134, v136, v138, v140, v142, v144, v146, v148, v150, v152, v154, v156, v550, v552, v554, v556, v558, v560, v562, v564, v566, v568, v570, v572, v574, v576, v578, v580;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v47 = {
  }
   ;
  v48 = {
  }
   ;
  v126 = new Float32Array(16);
  v128 = new Float32Array(16);
  v130 = new Float32Array(16);
  v132 = new Float32Array(16);
  v134 = new Float32Array(16);
  v136 = new Float32Array(16);
  v138 = new Float32Array(16);
  v140 = new Float32Array(16);
  v142 = new Float32Array(16);
  v144 = new Float32Array(16);
  v146 = new Float32Array(16);
  v148 = new Float32Array(16);
  v150 = new Float32Array(16);
  v152 = new Float32Array(16);
  v154 = new Float32Array(16);
  v156 = new Float32Array(16);
  v550 = new Float32Array(16);
  v552 = new Float32Array(16);
  v554 = new Float32Array(16);
  v556 = new Float32Array(16);
  v558 = new Float32Array(16);
  v560 = new Float32Array(16);
  v562 = new Float32Array(16);
  v564 = new Float32Array(16);
  v566 = new Float32Array(16);
  v568 = new Float32Array(16);
  v570 = new Float32Array(16);
  v572 = new Float32Array(16);
  v574 = new Float32Array(16);
  v576 = new Float32Array(16);
  v578 = new Float32Array(16);
  v580 = new Float32Array(16);
  return {
   'batch': function (a0, a1) {
    var v471, v497, v498;
    v471 = v7.next;
    if (v471 !== v7.cur) {
     if (v471) {
      v8.bindFramebuffer(36160, v471.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v471;
    }
    if (v3.dirty) {
     var v472, v473, v474, v475, v476, v477, v478, v479, v480, v481, v482, v483, v484, v485, v486, v487, v488, v489, v490, v491, v492, v493, v494, v495, v496;
     v472 = v22[0];
     v473 = v22[1];
     v474 = v22[2];
     v475 = v22[3];
     if (v472 !== v23[0] || v473 !== v23[1] || v474 !== v23[2] || v475 !== v23[3]) {
      v8.colorMask(v472, v473, v474, v475);
      v23[0] = v472;
      v23[1] = v473;
      v23[2] = v474;
      v23[3] = v475;
     }
     v476 = v10.frontFace;
     if (v476 !== v3.frontFace) {
      v8.frontFace(v476);
      v3.frontFace = v476;
     }
     v477 = v10.polygonOffset_enable;
     if (v477 !== v3.polygonOffset_enable) {
      if (v477) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v477;
     }
     v478 = v26[0];
     v479 = v26[1];
     if (v478 !== v27[0] || v479 !== v27[1]) {
      v8.polygonOffset(v478, v479);
      v27[0] = v478;
      v27[1] = v479;
     }
     v480 = v10.sample_alpha;
     if (v480 !== v3.sample_alpha) {
      if (v480) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v480;
     }
     v481 = v10.sample_enable;
     if (v481 !== v3.sample_enable) {
      if (v481) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v481;
     }
     v482 = v28[0];
     v483 = v28[1];
     if (v482 !== v29[0] || v483 !== v29[1]) {
      v8.sampleCoverage(v482, v483);
      v29[0] = v482;
      v29[1] = v483;
     }
     v484 = v10.stencil_enable;
     if (v484 !== v3.stencil_enable) {
      if (v484) {
       v8.enable(2960);
      }
      else {
       v8.disable(2960);
      }
      v3.stencil_enable = v484;
     }
     v485 = v10.stencil_mask;
     if (v485 !== v3.stencil_mask) {
      v8.stencilMask(v485);
      v3.stencil_mask = v485;
     }
     v486 = v32[0];
     v487 = v32[1];
     v488 = v32[2];
     if (v486 !== v33[0] || v487 !== v33[1] || v488 !== v33[2]) {
      v8.stencilFunc(v486, v487, v488);
      v33[0] = v486;
      v33[1] = v487;
      v33[2] = v488;
     }
     v489 = v36[0];
     v490 = v36[1];
     v491 = v36[2];
     v492 = v36[3];
     if (v489 !== v37[0] || v490 !== v37[1] || v491 !== v37[2] || v492 !== v37[3]) {
      v8.stencilOpSeparate(v489, v490, v491, v492);
      v37[0] = v489;
      v37[1] = v490;
      v37[2] = v491;
      v37[3] = v492;
     }
     v493 = v34[0];
     v494 = v34[1];
     v495 = v34[2];
     v496 = v34[3];
     if (v493 !== v35[0] || v494 !== v35[1] || v495 !== v35[2] || v496 !== v35[3]) {
      v8.stencilOpSeparate(v493, v494, v495, v496);
      v35[0] = v493;
      v35[1] = v494;
      v35[2] = v495;
      v35[3] = v496;
     }
    }
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.disable(3042);
    v3.blend_enable = false;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 1, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 1;
    v21[3] = 1;
    v8.enable(2884);
    v3.cull_enable = true;
    v8.cullFace(1029);
    v3.cull_face = 1029;
    v8.enable(2929);
    v3.depth_enable = true;
    v8.depthFunc(513);
    v3.depth_func = 513;
    v8.depthMask(true);
    v3.depth_mask = true;
    v8.depthRange(0, 1);
    v25[0] = 0;
    v25[1] = 1;
    v8.disable(3024);
    v3.dither = false;
    v8.lineWidth(2);
    v3.lineWidth = 2;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.useProgram($37.program);
    var v517, v518, v519, v520, v521, v522, v523, v524, v525, v526, v527, v528, v529, v530, v531, v532, v533, v534, v535, v536, v537, v538, v539, v540, v541, v542, v543, v544, v545, v546, v547, v548, v611;
    v15.setVAO(null);
    v517 = p01_04.location;
    v518 = v0[v517];
    if (!v518.buffer) {
     v8.enableVertexAttribArray(v517);
    }
    if (v518.type !== $3.dtype || v518.size !== 4 || v518.buffer !== $3 || v518.normalized !== false || v518.offset !== 0 || v518.stride !== 0) {
     v8.bindBuffer(34962, $3.buffer);
     v8.vertexAttribPointer(v517, 4, $3.dtype, false, 0, 0);
     v518.type = $3.dtype;
     v518.size = 4;
     v518.buffer = $3;
     v518.normalized = false;
     v518.offset = 0;
     v518.stride = 0;
    }
    v519 = p05_08.location;
    v520 = v0[v519];
    if (!v520.buffer) {
     v8.enableVertexAttribArray(v519);
    }
    if (v520.type !== $4.dtype || v520.size !== 4 || v520.buffer !== $4 || v520.normalized !== false || v520.offset !== 0 || v520.stride !== 0) {
     v8.bindBuffer(34962, $4.buffer);
     v8.vertexAttribPointer(v519, 4, $4.dtype, false, 0, 0);
     v520.type = $4.dtype;
     v520.size = 4;
     v520.buffer = $4;
     v520.normalized = false;
     v520.offset = 0;
     v520.stride = 0;
    }
    v521 = p09_12.location;
    v522 = v0[v521];
    if (!v522.buffer) {
     v8.enableVertexAttribArray(v521);
    }
    if (v522.type !== $5.dtype || v522.size !== 4 || v522.buffer !== $5 || v522.normalized !== false || v522.offset !== 0 || v522.stride !== 0) {
     v8.bindBuffer(34962, $5.buffer);
     v8.vertexAttribPointer(v521, 4, $5.dtype, false, 0, 0);
     v522.type = $5.dtype;
     v522.size = 4;
     v522.buffer = $5;
     v522.normalized = false;
     v522.offset = 0;
     v522.stride = 0;
    }
    v523 = p13_16.location;
    v524 = v0[v523];
    if (!v524.buffer) {
     v8.enableVertexAttribArray(v523);
    }
    if (v524.type !== $6.dtype || v524.size !== 4 || v524.buffer !== $6 || v524.normalized !== false || v524.offset !== 0 || v524.stride !== 0) {
     v8.bindBuffer(34962, $6.buffer);
     v8.vertexAttribPointer(v523, 4, $6.dtype, false, 0, 0);
     v524.type = $6.dtype;
     v524.size = 4;
     v524.buffer = $6;
     v524.normalized = false;
     v524.offset = 0;
     v524.stride = 0;
    }
    v525 = p17_20.location;
    v526 = v0[v525];
    if (!v526.buffer) {
     v8.enableVertexAttribArray(v525);
    }
    if (v526.type !== $7.dtype || v526.size !== 4 || v526.buffer !== $7 || v526.normalized !== false || v526.offset !== 0 || v526.stride !== 0) {
     v8.bindBuffer(34962, $7.buffer);
     v8.vertexAttribPointer(v525, 4, $7.dtype, false, 0, 0);
     v526.type = $7.dtype;
     v526.size = 4;
     v526.buffer = $7;
     v526.normalized = false;
     v526.offset = 0;
     v526.stride = 0;
    }
    v527 = p21_24.location;
    v528 = v0[v527];
    if (!v528.buffer) {
     v8.enableVertexAttribArray(v527);
    }
    if (v528.type !== $8.dtype || v528.size !== 4 || v528.buffer !== $8 || v528.normalized !== false || v528.offset !== 0 || v528.stride !== 0) {
     v8.bindBuffer(34962, $8.buffer);
     v8.vertexAttribPointer(v527, 4, $8.dtype, false, 0, 0);
     v528.type = $8.dtype;
     v528.size = 4;
     v528.buffer = $8;
     v528.normalized = false;
     v528.offset = 0;
     v528.stride = 0;
    }
    v529 = p25_28.location;
    v530 = v0[v529];
    if (!v530.buffer) {
     v8.enableVertexAttribArray(v529);
    }
    if (v530.type !== $9.dtype || v530.size !== 4 || v530.buffer !== $9 || v530.normalized !== false || v530.offset !== 0 || v530.stride !== 0) {
     v8.bindBuffer(34962, $9.buffer);
     v8.vertexAttribPointer(v529, 4, $9.dtype, false, 0, 0);
     v530.type = $9.dtype;
     v530.size = 4;
     v530.buffer = $9;
     v530.normalized = false;
     v530.offset = 0;
     v530.stride = 0;
    }
    v531 = p29_32.location;
    v532 = v0[v531];
    if (!v532.buffer) {
     v8.enableVertexAttribArray(v531);
    }
    if (v532.type !== $10.dtype || v532.size !== 4 || v532.buffer !== $10 || v532.normalized !== false || v532.offset !== 0 || v532.stride !== 0) {
     v8.bindBuffer(34962, $10.buffer);
     v8.vertexAttribPointer(v531, 4, $10.dtype, false, 0, 0);
     v532.type = $10.dtype;
     v532.size = 4;
     v532.buffer = $10;
     v532.normalized = false;
     v532.offset = 0;
     v532.stride = 0;
    }
    v533 = p33_36.location;
    v534 = v0[v533];
    if (!v534.buffer) {
     v8.enableVertexAttribArray(v533);
    }
    if (v534.type !== $11.dtype || v534.size !== 4 || v534.buffer !== $11 || v534.normalized !== false || v534.offset !== 0 || v534.stride !== 0) {
     v8.bindBuffer(34962, $11.buffer);
     v8.vertexAttribPointer(v533, 4, $11.dtype, false, 0, 0);
     v534.type = $11.dtype;
     v534.size = 4;
     v534.buffer = $11;
     v534.normalized = false;
     v534.offset = 0;
     v534.stride = 0;
    }
    v535 = p37_40.location;
    v536 = v0[v535];
    if (!v536.buffer) {
     v8.enableVertexAttribArray(v535);
    }
    if (v536.type !== $12.dtype || v536.size !== 4 || v536.buffer !== $12 || v536.normalized !== false || v536.offset !== 0 || v536.stride !== 0) {
     v8.bindBuffer(34962, $12.buffer);
     v8.vertexAttribPointer(v535, 4, $12.dtype, false, 0, 0);
     v536.type = $12.dtype;
     v536.size = 4;
     v536.buffer = $12;
     v536.normalized = false;
     v536.offset = 0;
     v536.stride = 0;
    }
    v537 = p41_44.location;
    v538 = v0[v537];
    if (!v538.buffer) {
     v8.enableVertexAttribArray(v537);
    }
    if (v538.type !== $13.dtype || v538.size !== 4 || v538.buffer !== $13 || v538.normalized !== false || v538.offset !== 0 || v538.stride !== 0) {
     v8.bindBuffer(34962, $13.buffer);
     v8.vertexAttribPointer(v537, 4, $13.dtype, false, 0, 0);
     v538.type = $13.dtype;
     v538.size = 4;
     v538.buffer = $13;
     v538.normalized = false;
     v538.offset = 0;
     v538.stride = 0;
    }
    v539 = p45_48.location;
    v540 = v0[v539];
    if (!v540.buffer) {
     v8.enableVertexAttribArray(v539);
    }
    if (v540.type !== $14.dtype || v540.size !== 4 || v540.buffer !== $14 || v540.normalized !== false || v540.offset !== 0 || v540.stride !== 0) {
     v8.bindBuffer(34962, $14.buffer);
     v8.vertexAttribPointer(v539, 4, $14.dtype, false, 0, 0);
     v540.type = $14.dtype;
     v540.size = 4;
     v540.buffer = $14;
     v540.normalized = false;
     v540.offset = 0;
     v540.stride = 0;
    }
    v541 = p49_52.location;
    v542 = v0[v541];
    if (!v542.buffer) {
     v8.enableVertexAttribArray(v541);
    }
    if (v542.type !== $15.dtype || v542.size !== 4 || v542.buffer !== $15 || v542.normalized !== false || v542.offset !== 0 || v542.stride !== 0) {
     v8.bindBuffer(34962, $15.buffer);
     v8.vertexAttribPointer(v541, 4, $15.dtype, false, 0, 0);
     v542.type = $15.dtype;
     v542.size = 4;
     v542.buffer = $15;
     v542.normalized = false;
     v542.offset = 0;
     v542.stride = 0;
    }
    v543 = p53_56.location;
    v544 = v0[v543];
    if (!v544.buffer) {
     v8.enableVertexAttribArray(v543);
    }
    if (v544.type !== $16.dtype || v544.size !== 4 || v544.buffer !== $16 || v544.normalized !== false || v544.offset !== 0 || v544.stride !== 0) {
     v8.bindBuffer(34962, $16.buffer);
     v8.vertexAttribPointer(v543, 4, $16.dtype, false, 0, 0);
     v544.type = $16.dtype;
     v544.size = 4;
     v544.buffer = $16;
     v544.normalized = false;
     v544.offset = 0;
     v544.stride = 0;
    }
    v545 = p57_60.location;
    v546 = v0[v545];
    if (!v546.buffer) {
     v8.enableVertexAttribArray(v545);
    }
    if (v546.type !== $17.dtype || v546.size !== 4 || v546.buffer !== $17 || v546.normalized !== false || v546.offset !== 0 || v546.stride !== 0) {
     v8.bindBuffer(34962, $17.buffer);
     v8.vertexAttribPointer(v545, 4, $17.dtype, false, 0, 0);
     v546.type = $17.dtype;
     v546.size = 4;
     v546.buffer = $17;
     v546.normalized = false;
     v546.offset = 0;
     v546.stride = 0;
    }
    v547 = colors.location;
    v548 = v0[v547];
    if (!v548.buffer) {
     v8.enableVertexAttribArray(v547);
    }
    if (v548.type !== $18.dtype || v548.size !== 4 || v548.buffer !== $18 || v548.normalized !== false || v548.offset !== 0 || v548.stride !== 0) {
     v8.bindBuffer(34962, $18.buffer);
     v8.vertexAttribPointer(v547, 4, $18.dtype, false, 0, 0);
     v548.type = $18.dtype;
     v548.size = 4;
     v548.buffer = $18;
     v548.normalized = false;
     v548.offset = 0;
     v548.stride = 0;
    }
    v8.uniform1i(palette.location, $38.bind());
    v611 = v4.elements;
    if (v611) {
     v8.bindBuffer(34963, v611.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v611 = v5.getElements(v15.currentVAO.elements);
     if (v611) v8.bindBuffer(34963, v611.buffer.buffer);
    }
    for (v497 = 0;
     v497 < a1;
     ++v497) {
     v498 = a0[v497];
     var v499, v500, v501, v502, v503, v504, v505, v506, v507, v508, v509, v510, v511, v512, v513, v514, v515, v516, v549, v551, v553, v555, v557, v559, v561, v563, v565, v567, v569, v571, v573, v575, v577, v579, v581, v582, v583, v584, v585, v586, v587, v588, v589, v590, v591, v592, v593, v594, v595, v596, v597, v598, v599, v600, v601, v602, v603, v604, v605, v606, v607, v608, v609, v610, v612, v613;
     v499 = v498['viewportHeight'];
     v47.height = v499;
     v500 = v498['viewportWidth'];
     v47.width = v500;
     v501 = v498['viewportX'];
     v47.x = v501;
     v502 = v498['viewportY'];
     v47.y = v502;
     v503 = v47.x | 0;
     v504 = v47.y | 0;
     v505 = 'width' in v47 ? v47.width | 0 : (v2.framebufferWidth - v503);
     v506 = 'height' in v47 ? v47.height | 0 : (v2.framebufferHeight - v504);
     v507 = v2.viewportWidth;
     v2.viewportWidth = v505;
     v508 = v2.viewportHeight;
     v2.viewportHeight = v506;
     v8.viewport(v503, v504, v505, v506);
     v39[0] = v503;
     v39[1] = v504;
     v39[2] = v505;
     v39[3] = v506;
     v509 = v498['scissorHeight'];
     v48.height = v509;
     v510 = v498['scissorWidth'];
     v48.width = v510;
     v511 = v498['scissorX'];
     v48.x = v511;
     v512 = v498['scissorY'];
     v48.y = v512;
     v513 = v48.x | 0;
     v514 = v48.y | 0;
     v515 = 'width' in v48 ? v48.width | 0 : (v2.framebufferWidth - v513);
     v516 = 'height' in v48 ? v48.height | 0 : (v2.framebufferHeight - v514);
     v8.scissor(v513, v514, v515, v516);
     v31[0] = v513;
     v31[1] = v514;
     v31[2] = v515;
     v31[3] = v516;
     v549 = v498['dim0A'];
     v8.uniformMatrix4fv(dim0A.location, false, (Array.isArray(v549) || v549 instanceof Float32Array) ? v549 : (v550[0] = v549[0], v550[1] = v549[1], v550[2] = v549[2], v550[3] = v549[3], v550[4] = v549[4], v550[5] = v549[5], v550[6] = v549[6], v550[7] = v549[7], v550[8] = v549[8], v550[9] = v549[9], v550[10] = v549[10], v550[11] = v549[11], v550[12] = v549[12], v550[13] = v549[13], v550[14] = v549[14], v550[15] = v549[15], v550));
     v551 = v498['dim1A'];
     v8.uniformMatrix4fv(dim1A.location, false, (Array.isArray(v551) || v551 instanceof Float32Array) ? v551 : (v552[0] = v551[0], v552[1] = v551[1], v552[2] = v551[2], v552[3] = v551[3], v552[4] = v551[4], v552[5] = v551[5], v552[6] = v551[6], v552[7] = v551[7], v552[8] = v551[8], v552[9] = v551[9], v552[10] = v551[10], v552[11] = v551[11], v552[12] = v551[12], v552[13] = v551[13], v552[14] = v551[14], v552[15] = v551[15], v552));
     v553 = v498['dim0B'];
     v8.uniformMatrix4fv(dim0B.location, false, (Array.isArray(v553) || v553 instanceof Float32Array) ? v553 : (v554[0] = v553[0], v554[1] = v553[1], v554[2] = v553[2], v554[3] = v553[3], v554[4] = v553[4], v554[5] = v553[5], v554[6] = v553[6], v554[7] = v553[7], v554[8] = v553[8], v554[9] = v553[9], v554[10] = v553[10], v554[11] = v553[11], v554[12] = v553[12], v554[13] = v553[13], v554[14] = v553[14], v554[15] = v553[15], v554));
     v555 = v498['dim1B'];
     v8.uniformMatrix4fv(dim1B.location, false, (Array.isArray(v555) || v555 instanceof Float32Array) ? v555 : (v556[0] = v555[0], v556[1] = v555[1], v556[2] = v555[2], v556[3] = v555[3], v556[4] = v555[4], v556[5] = v555[5], v556[6] = v555[6], v556[7] = v555[7], v556[8] = v555[8], v556[9] = v555[9], v556[10] = v555[10], v556[11] = v555[11], v556[12] = v555[12], v556[13] = v555[13], v556[14] = v555[14], v556[15] = v555[15], v556));
     v557 = v498['dim0C'];
     v8.uniformMatrix4fv(dim0C.location, false, (Array.isArray(v557) || v557 instanceof Float32Array) ? v557 : (v558[0] = v557[0], v558[1] = v557[1], v558[2] = v557[2], v558[3] = v557[3], v558[4] = v557[4], v558[5] = v557[5], v558[6] = v557[6], v558[7] = v557[7], v558[8] = v557[8], v558[9] = v557[9], v558[10] = v557[10], v558[11] = v557[11], v558[12] = v557[12], v558[13] = v557[13], v558[14] = v557[14], v558[15] = v557[15], v558));
     v559 = v498['dim1C'];
     v8.uniformMatrix4fv(dim1C.location, false, (Array.isArray(v559) || v559 instanceof Float32Array) ? v559 : (v560[0] = v559[0], v560[1] = v559[1], v560[2] = v559[2], v560[3] = v559[3], v560[4] = v559[4], v560[5] = v559[5], v560[6] = v559[6], v560[7] = v559[7], v560[8] = v559[8], v560[9] = v559[9], v560[10] = v559[10], v560[11] = v559[11], v560[12] = v559[12], v560[13] = v559[13], v560[14] = v559[14], v560[15] = v559[15], v560));
     v561 = v498['dim0D'];
     v8.uniformMatrix4fv(dim0D.location, false, (Array.isArray(v561) || v561 instanceof Float32Array) ? v561 : (v562[0] = v561[0], v562[1] = v561[1], v562[2] = v561[2], v562[3] = v561[3], v562[4] = v561[4], v562[5] = v561[5], v562[6] = v561[6], v562[7] = v561[7], v562[8] = v561[8], v562[9] = v561[9], v562[10] = v561[10], v562[11] = v561[11], v562[12] = v561[12], v562[13] = v561[13], v562[14] = v561[14], v562[15] = v561[15], v562));
     v563 = v498['dim1D'];
     v8.uniformMatrix4fv(dim1D.location, false, (Array.isArray(v563) || v563 instanceof Float32Array) ? v563 : (v564[0] = v563[0], v564[1] = v563[1], v564[2] = v563[2], v564[3] = v563[3], v564[4] = v563[4], v564[5] = v563[5], v564[6] = v563[6], v564[7] = v563[7], v564[8] = v563[8], v564[9] = v563[9], v564[10] = v563[10], v564[11] = v563[11], v564[12] = v563[12], v564[13] = v563[13], v564[14] = v563[14], v564[15] = v563[15], v564));
     v565 = v498['loA'];
     v8.uniformMatrix4fv(loA.location, false, (Array.isArray(v565) || v565 instanceof Float32Array) ? v565 : (v566[0] = v565[0], v566[1] = v565[1], v566[2] = v565[2], v566[3] = v565[3], v566[4] = v565[4], v566[5] = v565[5], v566[6] = v565[6], v566[7] = v565[7], v566[8] = v565[8], v566[9] = v565[9], v566[10] = v565[10], v566[11] = v565[11], v566[12] = v565[12], v566[13] = v565[13], v566[14] = v565[14], v566[15] = v565[15], v566));
     v567 = v498['hiA'];
     v8.uniformMatrix4fv(hiA.location, false, (Array.isArray(v567) || v567 instanceof Float32Array) ? v567 : (v568[0] = v567[0], v568[1] = v567[1], v568[2] = v567[2], v568[3] = v567[3], v568[4] = v567[4], v568[5] = v567[5], v568[6] = v567[6], v568[7] = v567[7], v568[8] = v567[8], v568[9] = v567[9], v568[10] = v567[10], v568[11] = v567[11], v568[12] = v567[12], v568[13] = v567[13], v568[14] = v567[14], v568[15] = v567[15], v568));
     v569 = v498['loB'];
     v8.uniformMatrix4fv(loB.location, false, (Array.isArray(v569) || v569 instanceof Float32Array) ? v569 : (v570[0] = v569[0], v570[1] = v569[1], v570[2] = v569[2], v570[3] = v569[3], v570[4] = v569[4], v570[5] = v569[5], v570[6] = v569[6], v570[7] = v569[7], v570[8] = v569[8], v570[9] = v569[9], v570[10] = v569[10], v570[11] = v569[11], v570[12] = v569[12], v570[13] = v569[13], v570[14] = v569[14], v570[15] = v569[15], v570));
     v571 = v498['hiB'];
     v8.uniformMatrix4fv(hiB.location, false, (Array.isArray(v571) || v571 instanceof Float32Array) ? v571 : (v572[0] = v571[0], v572[1] = v571[1], v572[2] = v571[2], v572[3] = v571[3], v572[4] = v571[4], v572[5] = v571[5], v572[6] = v571[6], v572[7] = v571[7], v572[8] = v571[8], v572[9] = v571[9], v572[10] = v571[10], v572[11] = v571[11], v572[12] = v571[12], v572[13] = v571[13], v572[14] = v571[14], v572[15] = v571[15], v572));
     v573 = v498['loC'];
     v8.uniformMatrix4fv(loC.location, false, (Array.isArray(v573) || v573 instanceof Float32Array) ? v573 : (v574[0] = v573[0], v574[1] = v573[1], v574[2] = v573[2], v574[3] = v573[3], v574[4] = v573[4], v574[5] = v573[5], v574[6] = v573[6], v574[7] = v573[7], v574[8] = v573[8], v574[9] = v573[9], v574[10] = v573[10], v574[11] = v573[11], v574[12] = v573[12], v574[13] = v573[13], v574[14] = v573[14], v574[15] = v573[15], v574));
     v575 = v498['hiC'];
     v8.uniformMatrix4fv(hiC.location, false, (Array.isArray(v575) || v575 instanceof Float32Array) ? v575 : (v576[0] = v575[0], v576[1] = v575[1], v576[2] = v575[2], v576[3] = v575[3], v576[4] = v575[4], v576[5] = v575[5], v576[6] = v575[6], v576[7] = v575[7], v576[8] = v575[8], v576[9] = v575[9], v576[10] = v575[10], v576[11] = v575[11], v576[12] = v575[12], v576[13] = v575[13], v576[14] = v575[14], v576[15] = v575[15], v576));
     v577 = v498['loD'];
     v8.uniformMatrix4fv(loD.location, false, (Array.isArray(v577) || v577 instanceof Float32Array) ? v577 : (v578[0] = v577[0], v578[1] = v577[1], v578[2] = v577[2], v578[3] = v577[3], v578[4] = v577[4], v578[5] = v577[5], v578[6] = v577[6], v578[7] = v577[7], v578[8] = v577[8], v578[9] = v577[9], v578[10] = v577[10], v578[11] = v577[11], v578[12] = v577[12], v578[13] = v577[13], v578[14] = v577[14], v578[15] = v577[15], v578));
     v579 = v498['hiD'];
     v8.uniformMatrix4fv(hiD.location, false, (Array.isArray(v579) || v579 instanceof Float32Array) ? v579 : (v580[0] = v579[0], v580[1] = v579[1], v580[2] = v579[2], v580[3] = v579[3], v580[4] = v579[4], v580[5] = v579[5], v580[6] = v579[6], v580[7] = v579[7], v580[8] = v579[8], v580[9] = v579[9], v580[10] = v579[10], v580[11] = v579[11], v580[12] = v579[12], v580[13] = v579[13], v580[14] = v579[14], v580[15] = v579[15], v580));
     v581 = v498['resolution'];
     v582 = v581[0];
     v584 = v581[1];
     if (!v497 || v583 !== v582 || v585 !== v584) {
      v583 = v582;
      v585 = v584;
      v8.uniform2f(resolution.location, v582, v584);
     }
     v586 = v498['viewBoxPos'];
     v587 = v586[0];
     v589 = v586[1];
     if (!v497 || v588 !== v587 || v590 !== v589) {
      v588 = v587;
      v590 = v589;
      v8.uniform2f(viewBoxPos.location, v587, v589);
     }
     v591 = v498['viewBoxSize'];
     v592 = v591[0];
     v594 = v591[1];
     if (!v497 || v593 !== v592 || v595 !== v594) {
      v593 = v592;
      v595 = v594;
      v8.uniform2f(viewBoxSize.location, v592, v594);
     }
     v596 = v498['maskHeight'];
     if (!v497 || v597 !== v596) {
      v597 = v596;
      v8.uniform1f(maskHeight.location, v596);
     }
     v598 = v498['drwLayer'];
     if (!v497 || v599 !== v598) {
      v599 = v598;
      v8.uniform1f(drwLayer.location, v598);
     }
     v600 = v498['contextColor'];
     v601 = v600[0];
     v603 = v600[1];
     v605 = v600[2];
     v607 = v600[3];
     if (!v497 || v602 !== v601 || v604 !== v603 || v606 !== v605 || v608 !== v607) {
      v602 = v601;
      v604 = v603;
      v606 = v605;
      v608 = v607;
      v8.uniform4f(contextColor.location, v601, v603, v605, v607);
     }
     v609 = v498['maskTexture'];
     if (v609 && v609._reglType === 'framebuffer') {
      v609 = v609.color[0];
     }
     v610 = v609._texture;
     v8.uniform1i(maskTexture.location, v610.bind());
     v612 = v498['offset'];
     v613 = v498['count'];
     if (v613) {
      if (v611) {
       v8.drawElements(1, v613, v611.type, v612 << ((v611.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(1, v612, v613);
      }
      v2.viewportWidth = v507;
      v2.viewportHeight = v508;
      v610.unbind();
     }
    }
    $38.unbind();
    v3.dirty = true;
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v49, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v127, v129, v131, v133, v135, v137, v139, v141, v143, v145, v147, v149, v151, v153, v155, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177;
    v49 = v7.next;
    if (v49 !== v7.cur) {
     if (v49) {
      v8.bindFramebuffer(36160, v49.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v49;
    }
    if (v3.dirty) {
     var v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74;
     v50 = v22[0];
     v51 = v22[1];
     v52 = v22[2];
     v53 = v22[3];
     if (v50 !== v23[0] || v51 !== v23[1] || v52 !== v23[2] || v53 !== v23[3]) {
      v8.colorMask(v50, v51, v52, v53);
      v23[0] = v50;
      v23[1] = v51;
      v23[2] = v52;
      v23[3] = v53;
     }
     v54 = v10.frontFace;
     if (v54 !== v3.frontFace) {
      v8.frontFace(v54);
      v3.frontFace = v54;
     }
     v55 = v10.polygonOffset_enable;
     if (v55 !== v3.polygonOffset_enable) {
      if (v55) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v55;
     }
     v56 = v26[0];
     v57 = v26[1];
     if (v56 !== v27[0] || v57 !== v27[1]) {
      v8.polygonOffset(v56, v57);
      v27[0] = v56;
      v27[1] = v57;
     }
     v58 = v10.sample_alpha;
     if (v58 !== v3.sample_alpha) {
      if (v58) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v58;
     }
     v59 = v10.sample_enable;
     if (v59 !== v3.sample_enable) {
      if (v59) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v59;
     }
     v60 = v28[0];
     v61 = v28[1];
     if (v60 !== v29[0] || v61 !== v29[1]) {
      v8.sampleCoverage(v60, v61);
      v29[0] = v60;
      v29[1] = v61;
     }
     v62 = v10.stencil_enable;
     if (v62 !== v3.stencil_enable) {
      if (v62) {
       v8.enable(2960);
      }
      else {
       v8.disable(2960);
      }
      v3.stencil_enable = v62;
     }
     v63 = v10.stencil_mask;
     if (v63 !== v3.stencil_mask) {
      v8.stencilMask(v63);
      v3.stencil_mask = v63;
     }
     v64 = v32[0];
     v65 = v32[1];
     v66 = v32[2];
     if (v64 !== v33[0] || v65 !== v33[1] || v66 !== v33[2]) {
      v8.stencilFunc(v64, v65, v66);
      v33[0] = v64;
      v33[1] = v65;
      v33[2] = v66;
     }
     v67 = v36[0];
     v68 = v36[1];
     v69 = v36[2];
     v70 = v36[3];
     if (v67 !== v37[0] || v68 !== v37[1] || v69 !== v37[2] || v70 !== v37[3]) {
      v8.stencilOpSeparate(v67, v68, v69, v70);
      v37[0] = v67;
      v37[1] = v68;
      v37[2] = v69;
      v37[3] = v70;
     }
     v71 = v34[0];
     v72 = v34[1];
     v73 = v34[2];
     v74 = v34[3];
     if (v71 !== v35[0] || v72 !== v35[1] || v73 !== v35[2] || v74 !== v35[3]) {
      v8.stencilOpSeparate(v71, v72, v73, v74);
      v35[0] = v71;
      v35[1] = v72;
      v35[2] = v73;
      v35[3] = v74;
     }
    }
    v75 = a0['viewportHeight'];
    v47.height = v75;
    v76 = a0['viewportWidth'];
    v47.width = v76;
    v77 = a0['viewportX'];
    v47.x = v77;
    v78 = a0['viewportY'];
    v47.y = v78;
    v79 = v47.x | 0;
    v80 = v47.y | 0;
    v81 = 'width' in v47 ? v47.width | 0 : (v2.framebufferWidth - v79);
    v82 = 'height' in v47 ? v47.height | 0 : (v2.framebufferHeight - v80);
    v83 = v2.viewportWidth;
    v2.viewportWidth = v81;
    v84 = v2.viewportHeight;
    v2.viewportHeight = v82;
    v8.viewport(v79, v80, v81, v82);
    v39[0] = v79;
    v39[1] = v80;
    v39[2] = v81;
    v39[3] = v82;
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.disable(3042);
    v3.blend_enable = false;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 1, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 1;
    v21[3] = 1;
    v8.enable(2884);
    v3.cull_enable = true;
    v8.cullFace(1029);
    v3.cull_face = 1029;
    v8.enable(2929);
    v3.depth_enable = true;
    v8.depthFunc(513);
    v3.depth_func = 513;
    v8.depthMask(true);
    v3.depth_mask = true;
    v8.depthRange(0, 1);
    v25[0] = 0;
    v25[1] = 1;
    v8.disable(3024);
    v3.dither = false;
    v8.lineWidth(2);
    v3.lineWidth = 2;
    v85 = a0['scissorHeight'];
    v48.height = v85;
    v86 = a0['scissorWidth'];
    v48.width = v86;
    v87 = a0['scissorX'];
    v48.x = v87;
    v88 = a0['scissorY'];
    v48.y = v88;
    v89 = v48.x | 0;
    v90 = v48.y | 0;
    v91 = 'width' in v48 ? v48.width | 0 : (v2.framebufferWidth - v89);
    v92 = 'height' in v48 ? v48.height | 0 : (v2.framebufferHeight - v90);
    v8.scissor(v89, v90, v91, v92);
    v31[0] = v89;
    v31[1] = v90;
    v31[2] = v91;
    v31[3] = v92;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.useProgram($2.program);
    v15.setVAO(null);
    v93 = p01_04.location;
    v94 = v0[v93];
    if (!v94.buffer) {
     v8.enableVertexAttribArray(v93);
    }
    if (v94.type !== $3.dtype || v94.size !== 4 || v94.buffer !== $3 || v94.normalized !== false || v94.offset !== 0 || v94.stride !== 0) {
     v8.bindBuffer(34962, $3.buffer);
     v8.vertexAttribPointer(v93, 4, $3.dtype, false, 0, 0);
     v94.type = $3.dtype;
     v94.size = 4;
     v94.buffer = $3;
     v94.normalized = false;
     v94.offset = 0;
     v94.stride = 0;
    }
    v95 = p05_08.location;
    v96 = v0[v95];
    if (!v96.buffer) {
     v8.enableVertexAttribArray(v95);
    }
    if (v96.type !== $4.dtype || v96.size !== 4 || v96.buffer !== $4 || v96.normalized !== false || v96.offset !== 0 || v96.stride !== 0) {
     v8.bindBuffer(34962, $4.buffer);
     v8.vertexAttribPointer(v95, 4, $4.dtype, false, 0, 0);
     v96.type = $4.dtype;
     v96.size = 4;
     v96.buffer = $4;
     v96.normalized = false;
     v96.offset = 0;
     v96.stride = 0;
    }
    v97 = p09_12.location;
    v98 = v0[v97];
    if (!v98.buffer) {
     v8.enableVertexAttribArray(v97);
    }
    if (v98.type !== $5.dtype || v98.size !== 4 || v98.buffer !== $5 || v98.normalized !== false || v98.offset !== 0 || v98.stride !== 0) {
     v8.bindBuffer(34962, $5.buffer);
     v8.vertexAttribPointer(v97, 4, $5.dtype, false, 0, 0);
     v98.type = $5.dtype;
     v98.size = 4;
     v98.buffer = $5;
     v98.normalized = false;
     v98.offset = 0;
     v98.stride = 0;
    }
    v99 = p13_16.location;
    v100 = v0[v99];
    if (!v100.buffer) {
     v8.enableVertexAttribArray(v99);
    }
    if (v100.type !== $6.dtype || v100.size !== 4 || v100.buffer !== $6 || v100.normalized !== false || v100.offset !== 0 || v100.stride !== 0) {
     v8.bindBuffer(34962, $6.buffer);
     v8.vertexAttribPointer(v99, 4, $6.dtype, false, 0, 0);
     v100.type = $6.dtype;
     v100.size = 4;
     v100.buffer = $6;
     v100.normalized = false;
     v100.offset = 0;
     v100.stride = 0;
    }
    v101 = p17_20.location;
    v102 = v0[v101];
    if (!v102.buffer) {
     v8.enableVertexAttribArray(v101);
    }
    if (v102.type !== $7.dtype || v102.size !== 4 || v102.buffer !== $7 || v102.normalized !== false || v102.offset !== 0 || v102.stride !== 0) {
     v8.bindBuffer(34962, $7.buffer);
     v8.vertexAttribPointer(v101, 4, $7.dtype, false, 0, 0);
     v102.type = $7.dtype;
     v102.size = 4;
     v102.buffer = $7;
     v102.normalized = false;
     v102.offset = 0;
     v102.stride = 0;
    }
    v103 = p21_24.location;
    v104 = v0[v103];
    if (!v104.buffer) {
     v8.enableVertexAttribArray(v103);
    }
    if (v104.type !== $8.dtype || v104.size !== 4 || v104.buffer !== $8 || v104.normalized !== false || v104.offset !== 0 || v104.stride !== 0) {
     v8.bindBuffer(34962, $8.buffer);
     v8.vertexAttribPointer(v103, 4, $8.dtype, false, 0, 0);
     v104.type = $8.dtype;
     v104.size = 4;
     v104.buffer = $8;
     v104.normalized = false;
     v104.offset = 0;
     v104.stride = 0;
    }
    v105 = p25_28.location;
    v106 = v0[v105];
    if (!v106.buffer) {
     v8.enableVertexAttribArray(v105);
    }
    if (v106.type !== $9.dtype || v106.size !== 4 || v106.buffer !== $9 || v106.normalized !== false || v106.offset !== 0 || v106.stride !== 0) {
     v8.bindBuffer(34962, $9.buffer);
     v8.vertexAttribPointer(v105, 4, $9.dtype, false, 0, 0);
     v106.type = $9.dtype;
     v106.size = 4;
     v106.buffer = $9;
     v106.normalized = false;
     v106.offset = 0;
     v106.stride = 0;
    }
    v107 = p29_32.location;
    v108 = v0[v107];
    if (!v108.buffer) {
     v8.enableVertexAttribArray(v107);
    }
    if (v108.type !== $10.dtype || v108.size !== 4 || v108.buffer !== $10 || v108.normalized !== false || v108.offset !== 0 || v108.stride !== 0) {
     v8.bindBuffer(34962, $10.buffer);
     v8.vertexAttribPointer(v107, 4, $10.dtype, false, 0, 0);
     v108.type = $10.dtype;
     v108.size = 4;
     v108.buffer = $10;
     v108.normalized = false;
     v108.offset = 0;
     v108.stride = 0;
    }
    v109 = p33_36.location;
    v110 = v0[v109];
    if (!v110.buffer) {
     v8.enableVertexAttribArray(v109);
    }
    if (v110.type !== $11.dtype || v110.size !== 4 || v110.buffer !== $11 || v110.normalized !== false || v110.offset !== 0 || v110.stride !== 0) {
     v8.bindBuffer(34962, $11.buffer);
     v8.vertexAttribPointer(v109, 4, $11.dtype, false, 0, 0);
     v110.type = $11.dtype;
     v110.size = 4;
     v110.buffer = $11;
     v110.normalized = false;
     v110.offset = 0;
     v110.stride = 0;
    }
    v111 = p37_40.location;
    v112 = v0[v111];
    if (!v112.buffer) {
     v8.enableVertexAttribArray(v111);
    }
    if (v112.type !== $12.dtype || v112.size !== 4 || v112.buffer !== $12 || v112.normalized !== false || v112.offset !== 0 || v112.stride !== 0) {
     v8.bindBuffer(34962, $12.buffer);
     v8.vertexAttribPointer(v111, 4, $12.dtype, false, 0, 0);
     v112.type = $12.dtype;
     v112.size = 4;
     v112.buffer = $12;
     v112.normalized = false;
     v112.offset = 0;
     v112.stride = 0;
    }
    v113 = p41_44.location;
    v114 = v0[v113];
    if (!v114.buffer) {
     v8.enableVertexAttribArray(v113);
    }
    if (v114.type !== $13.dtype || v114.size !== 4 || v114.buffer !== $13 || v114.normalized !== false || v114.offset !== 0 || v114.stride !== 0) {
     v8.bindBuffer(34962, $13.buffer);
     v8.vertexAttribPointer(v113, 4, $13.dtype, false, 0, 0);
     v114.type = $13.dtype;
     v114.size = 4;
     v114.buffer = $13;
     v114.normalized = false;
     v114.offset = 0;
     v114.stride = 0;
    }
    v115 = p45_48.location;
    v116 = v0[v115];
    if (!v116.buffer) {
     v8.enableVertexAttribArray(v115);
    }
    if (v116.type !== $14.dtype || v116.size !== 4 || v116.buffer !== $14 || v116.normalized !== false || v116.offset !== 0 || v116.stride !== 0) {
     v8.bindBuffer(34962, $14.buffer);
     v8.vertexAttribPointer(v115, 4, $14.dtype, false, 0, 0);
     v116.type = $14.dtype;
     v116.size = 4;
     v116.buffer = $14;
     v116.normalized = false;
     v116.offset = 0;
     v116.stride = 0;
    }
    v117 = p49_52.location;
    v118 = v0[v117];
    if (!v118.buffer) {
     v8.enableVertexAttribArray(v117);
    }
    if (v118.type !== $15.dtype || v118.size !== 4 || v118.buffer !== $15 || v118.normalized !== false || v118.offset !== 0 || v118.stride !== 0) {
     v8.bindBuffer(34962, $15.buffer);
     v8.vertexAttribPointer(v117, 4, $15.dtype, false, 0, 0);
     v118.type = $15.dtype;
     v118.size = 4;
     v118.buffer = $15;
     v118.normalized = false;
     v118.offset = 0;
     v118.stride = 0;
    }
    v119 = p53_56.location;
    v120 = v0[v119];
    if (!v120.buffer) {
     v8.enableVertexAttribArray(v119);
    }
    if (v120.type !== $16.dtype || v120.size !== 4 || v120.buffer !== $16 || v120.normalized !== false || v120.offset !== 0 || v120.stride !== 0) {
     v8.bindBuffer(34962, $16.buffer);
     v8.vertexAttribPointer(v119, 4, $16.dtype, false, 0, 0);
     v120.type = $16.dtype;
     v120.size = 4;
     v120.buffer = $16;
     v120.normalized = false;
     v120.offset = 0;
     v120.stride = 0;
    }
    v121 = p57_60.location;
    v122 = v0[v121];
    if (!v122.buffer) {
     v8.enableVertexAttribArray(v121);
    }
    if (v122.type !== $17.dtype || v122.size !== 4 || v122.buffer !== $17 || v122.normalized !== false || v122.offset !== 0 || v122.stride !== 0) {
     v8.bindBuffer(34962, $17.buffer);
     v8.vertexAttribPointer(v121, 4, $17.dtype, false, 0, 0);
     v122.type = $17.dtype;
     v122.size = 4;
     v122.buffer = $17;
     v122.normalized = false;
     v122.offset = 0;
     v122.stride = 0;
    }
    v123 = colors.location;
    v124 = v0[v123];
    if (!v124.buffer) {
     v8.enableVertexAttribArray(v123);
    }
    if (v124.type !== $18.dtype || v124.size !== 4 || v124.buffer !== $18 || v124.normalized !== false || v124.offset !== 0 || v124.stride !== 0) {
     v8.bindBuffer(34962, $18.buffer);
     v8.vertexAttribPointer(v123, 4, $18.dtype, false, 0, 0);
     v124.type = $18.dtype;
     v124.size = 4;
     v124.buffer = $18;
     v124.normalized = false;
     v124.offset = 0;
     v124.stride = 0;
    }
    v125 = a0['dim0A'];
    v8.uniformMatrix4fv(dim0A.location, false, (Array.isArray(v125) || v125 instanceof Float32Array) ? v125 : (v126[0] = v125[0], v126[1] = v125[1], v126[2] = v125[2], v126[3] = v125[3], v126[4] = v125[4], v126[5] = v125[5], v126[6] = v125[6], v126[7] = v125[7], v126[8] = v125[8], v126[9] = v125[9], v126[10] = v125[10], v126[11] = v125[11], v126[12] = v125[12], v126[13] = v125[13], v126[14] = v125[14], v126[15] = v125[15], v126));
    v127 = a0['dim1A'];
    v8.uniformMatrix4fv(dim1A.location, false, (Array.isArray(v127) || v127 instanceof Float32Array) ? v127 : (v128[0] = v127[0], v128[1] = v127[1], v128[2] = v127[2], v128[3] = v127[3], v128[4] = v127[4], v128[5] = v127[5], v128[6] = v127[6], v128[7] = v127[7], v128[8] = v127[8], v128[9] = v127[9], v128[10] = v127[10], v128[11] = v127[11], v128[12] = v127[12], v128[13] = v127[13], v128[14] = v127[14], v128[15] = v127[15], v128));
    v129 = a0['dim0B'];
    v8.uniformMatrix4fv(dim0B.location, false, (Array.isArray(v129) || v129 instanceof Float32Array) ? v129 : (v130[0] = v129[0], v130[1] = v129[1], v130[2] = v129[2], v130[3] = v129[3], v130[4] = v129[4], v130[5] = v129[5], v130[6] = v129[6], v130[7] = v129[7], v130[8] = v129[8], v130[9] = v129[9], v130[10] = v129[10], v130[11] = v129[11], v130[12] = v129[12], v130[13] = v129[13], v130[14] = v129[14], v130[15] = v129[15], v130));
    v131 = a0['dim1B'];
    v8.uniformMatrix4fv(dim1B.location, false, (Array.isArray(v131) || v131 instanceof Float32Array) ? v131 : (v132[0] = v131[0], v132[1] = v131[1], v132[2] = v131[2], v132[3] = v131[3], v132[4] = v131[4], v132[5] = v131[5], v132[6] = v131[6], v132[7] = v131[7], v132[8] = v131[8], v132[9] = v131[9], v132[10] = v131[10], v132[11] = v131[11], v132[12] = v131[12], v132[13] = v131[13], v132[14] = v131[14], v132[15] = v131[15], v132));
    v133 = a0['dim0C'];
    v8.uniformMatrix4fv(dim0C.location, false, (Array.isArray(v133) || v133 instanceof Float32Array) ? v133 : (v134[0] = v133[0], v134[1] = v133[1], v134[2] = v133[2], v134[3] = v133[3], v134[4] = v133[4], v134[5] = v133[5], v134[6] = v133[6], v134[7] = v133[7], v134[8] = v133[8], v134[9] = v133[9], v134[10] = v133[10], v134[11] = v133[11], v134[12] = v133[12], v134[13] = v133[13], v134[14] = v133[14], v134[15] = v133[15], v134));
    v135 = a0['dim1C'];
    v8.uniformMatrix4fv(dim1C.location, false, (Array.isArray(v135) || v135 instanceof Float32Array) ? v135 : (v136[0] = v135[0], v136[1] = v135[1], v136[2] = v135[2], v136[3] = v135[3], v136[4] = v135[4], v136[5] = v135[5], v136[6] = v135[6], v136[7] = v135[7], v136[8] = v135[8], v136[9] = v135[9], v136[10] = v135[10], v136[11] = v135[11], v136[12] = v135[12], v136[13] = v135[13], v136[14] = v135[14], v136[15] = v135[15], v136));
    v137 = a0['dim0D'];
    v8.uniformMatrix4fv(dim0D.location, false, (Array.isArray(v137) || v137 instanceof Float32Array) ? v137 : (v138[0] = v137[0], v138[1] = v137[1], v138[2] = v137[2], v138[3] = v137[3], v138[4] = v137[4], v138[5] = v137[5], v138[6] = v137[6], v138[7] = v137[7], v138[8] = v137[8], v138[9] = v137[9], v138[10] = v137[10], v138[11] = v137[11], v138[12] = v137[12], v138[13] = v137[13], v138[14] = v137[14], v138[15] = v137[15], v138));
    v139 = a0['dim1D'];
    v8.uniformMatrix4fv(dim1D.location, false, (Array.isArray(v139) || v139 instanceof Float32Array) ? v139 : (v140[0] = v139[0], v140[1] = v139[1], v140[2] = v139[2], v140[3] = v139[3], v140[4] = v139[4], v140[5] = v139[5], v140[6] = v139[6], v140[7] = v139[7], v140[8] = v139[8], v140[9] = v139[9], v140[10] = v139[10], v140[11] = v139[11], v140[12] = v139[12], v140[13] = v139[13], v140[14] = v139[14], v140[15] = v139[15], v140));
    v141 = a0['loA'];
    v8.uniformMatrix4fv(loA.location, false, (Array.isArray(v141) || v141 instanceof Float32Array) ? v141 : (v142[0] = v141[0], v142[1] = v141[1], v142[2] = v141[2], v142[3] = v141[3], v142[4] = v141[4], v142[5] = v141[5], v142[6] = v141[6], v142[7] = v141[7], v142[8] = v141[8], v142[9] = v141[9], v142[10] = v141[10], v142[11] = v141[11], v142[12] = v141[12], v142[13] = v141[13], v142[14] = v141[14], v142[15] = v141[15], v142));
    v143 = a0['hiA'];
    v8.uniformMatrix4fv(hiA.location, false, (Array.isArray(v143) || v143 instanceof Float32Array) ? v143 : (v144[0] = v143[0], v144[1] = v143[1], v144[2] = v143[2], v144[3] = v143[3], v144[4] = v143[4], v144[5] = v143[5], v144[6] = v143[6], v144[7] = v143[7], v144[8] = v143[8], v144[9] = v143[9], v144[10] = v143[10], v144[11] = v143[11], v144[12] = v143[12], v144[13] = v143[13], v144[14] = v143[14], v144[15] = v143[15], v144));
    v145 = a0['loB'];
    v8.uniformMatrix4fv(loB.location, false, (Array.isArray(v145) || v145 instanceof Float32Array) ? v145 : (v146[0] = v145[0], v146[1] = v145[1], v146[2] = v145[2], v146[3] = v145[3], v146[4] = v145[4], v146[5] = v145[5], v146[6] = v145[6], v146[7] = v145[7], v146[8] = v145[8], v146[9] = v145[9], v146[10] = v145[10], v146[11] = v145[11], v146[12] = v145[12], v146[13] = v145[13], v146[14] = v145[14], v146[15] = v145[15], v146));
    v147 = a0['hiB'];
    v8.uniformMatrix4fv(hiB.location, false, (Array.isArray(v147) || v147 instanceof Float32Array) ? v147 : (v148[0] = v147[0], v148[1] = v147[1], v148[2] = v147[2], v148[3] = v147[3], v148[4] = v147[4], v148[5] = v147[5], v148[6] = v147[6], v148[7] = v147[7], v148[8] = v147[8], v148[9] = v147[9], v148[10] = v147[10], v148[11] = v147[11], v148[12] = v147[12], v148[13] = v147[13], v148[14] = v147[14], v148[15] = v147[15], v148));
    v149 = a0['loC'];
    v8.uniformMatrix4fv(loC.location, false, (Array.isArray(v149) || v149 instanceof Float32Array) ? v149 : (v150[0] = v149[0], v150[1] = v149[1], v150[2] = v149[2], v150[3] = v149[3], v150[4] = v149[4], v150[5] = v149[5], v150[6] = v149[6], v150[7] = v149[7], v150[8] = v149[8], v150[9] = v149[9], v150[10] = v149[10], v150[11] = v149[11], v150[12] = v149[12], v150[13] = v149[13], v150[14] = v149[14], v150[15] = v149[15], v150));
    v151 = a0['hiC'];
    v8.uniformMatrix4fv(hiC.location, false, (Array.isArray(v151) || v151 instanceof Float32Array) ? v151 : (v152[0] = v151[0], v152[1] = v151[1], v152[2] = v151[2], v152[3] = v151[3], v152[4] = v151[4], v152[5] = v151[5], v152[6] = v151[6], v152[7] = v151[7], v152[8] = v151[8], v152[9] = v151[9], v152[10] = v151[10], v152[11] = v151[11], v152[12] = v151[12], v152[13] = v151[13], v152[14] = v151[14], v152[15] = v151[15], v152));
    v153 = a0['loD'];
    v8.uniformMatrix4fv(loD.location, false, (Array.isArray(v153) || v153 instanceof Float32Array) ? v153 : (v154[0] = v153[0], v154[1] = v153[1], v154[2] = v153[2], v154[3] = v153[3], v154[4] = v153[4], v154[5] = v153[5], v154[6] = v153[6], v154[7] = v153[7], v154[8] = v153[8], v154[9] = v153[9], v154[10] = v153[10], v154[11] = v153[11], v154[12] = v153[12], v154[13] = v153[13], v154[14] = v153[14], v154[15] = v153[15], v154));
    v155 = a0['hiD'];
    v8.uniformMatrix4fv(hiD.location, false, (Array.isArray(v155) || v155 instanceof Float32Array) ? v155 : (v156[0] = v155[0], v156[1] = v155[1], v156[2] = v155[2], v156[3] = v155[3], v156[4] = v155[4], v156[5] = v155[5], v156[6] = v155[6], v156[7] = v155[7], v156[8] = v155[8], v156[9] = v155[9], v156[10] = v155[10], v156[11] = v155[11], v156[12] = v155[12], v156[13] = v155[13], v156[14] = v155[14], v156[15] = v155[15], v156));
    v157 = a0['resolution'];
    v158 = v157[0];
    v159 = v157[1];
    v8.uniform2f(resolution.location, v158, v159);
    v160 = a0['viewBoxPos'];
    v161 = v160[0];
    v162 = v160[1];
    v8.uniform2f(viewBoxPos.location, v161, v162);
    v163 = a0['viewBoxSize'];
    v164 = v163[0];
    v165 = v163[1];
    v8.uniform2f(viewBoxSize.location, v164, v165);
    v166 = a0['maskHeight'];
    v8.uniform1f(maskHeight.location, v166);
    v167 = a0['drwLayer'];
    v8.uniform1f(drwLayer.location, v167);
    v168 = a0['contextColor'];
    v169 = v168[0];
    v170 = v168[1];
    v171 = v168[2];
    v172 = v168[3];
    v8.uniform4f(contextColor.location, v169, v170, v171, v172);
    v173 = a0['maskTexture'];
    if (v173 && v173._reglType === 'framebuffer') {
     v173 = v173.color[0];
    }
    v174 = v173._texture;
    v8.uniform1i(maskTexture.location, v174.bind());
    v8.uniform1i(palette.location, $19.bind());
    v175 = v4.elements;
    if (v175) {
     v8.bindBuffer(34963, v175.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v175 = v5.getElements(v15.currentVAO.elements);
     if (v175) v8.bindBuffer(34963, v175.buffer.buffer);
    }
    v176 = a0['offset'];
    v177 = a0['count'];
    if (v177) {
     if (v175) {
      v8.drawElements(1, v177, v175.type, v176 << ((v175.type - 5121) >> 1));
     }
     else {
      v8.drawArrays(1, v176, v177);
     }
     v3.dirty = true;
     v15.setVAO(null);
     v2.viewportWidth = v83;
     v2.viewportHeight = v84;
     v174.unbind();
     $19.unbind();
    }
   }
   , 'scope': function (a0, a1, a2) {
    var v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195, v196, v197, v198, v199, v200, v201, v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213, v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225, v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267, v268, v269, v270, v271, v272, v273, v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301, v302, v303, v304, v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360, v361, v362, v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387, v388, v389, v390, v391, v392, v393, v394, v395, v396, v397, v398, v399, v400, v401, v402, v403, v404, v405, v406, v407, v408, v409, v410, v411, v412, v413, v414, v415, v416, v417, v418, v419, v420, v421, v422, v423, v424, v425, v426, v427, v428, v429, v430, v431, v432, v433, v434, v435, v436, v437, v438, v439, v440, v441, v442, v443, v444, v445, v446, v447, v448, v449, v450, v451, v452, v453, v454, v455, v456, v457, v458, v459, v460, v461, v462, v463, v464, v465, v466, v467, v468, v469, v470;
    v178 = a0['viewportHeight'];
    v47.height = v178;
    v179 = a0['viewportWidth'];
    v47.width = v179;
    v180 = a0['viewportX'];
    v47.x = v180;
    v181 = a0['viewportY'];
    v47.y = v181;
    v182 = v47.x | 0;
    v183 = v47.y | 0;
    v184 = 'width' in v47 ? v47.width | 0 : (v2.framebufferWidth - v182);
    v185 = 'height' in v47 ? v47.height | 0 : (v2.framebufferHeight - v183);
    v186 = v2.viewportWidth;
    v2.viewportWidth = v184;
    v187 = v2.viewportHeight;
    v2.viewportHeight = v185;
    v188 = v38[0];
    v38[0] = v182;
    v189 = v38[1];
    v38[1] = v183;
    v190 = v38[2];
    v38[2] = v184;
    v191 = v38[3];
    v38[3] = v185;
    v192 = v16[0];
    v16[0] = 0;
    v193 = v16[1];
    v16[1] = 0;
    v194 = v16[2];
    v16[2] = 0;
    v195 = v16[3];
    v16[3] = 0;
    v196 = v10.blend_enable;
    v10.blend_enable = false;
    v197 = v18[0];
    v18[0] = 32774;
    v198 = v18[1];
    v18[1] = 32774;
    v199 = v20[0];
    v20[0] = 770;
    v200 = v20[1];
    v20[1] = 771;
    v201 = v20[2];
    v20[2] = 1;
    v202 = v20[3];
    v20[3] = 1;
    v203 = v10.cull_enable;
    v10.cull_enable = true;
    v204 = v10.cull_face;
    v10.cull_face = 1029;
    v205 = v10.depth_enable;
    v10.depth_enable = true;
    v206 = v10.depth_func;
    v10.depth_func = 513;
    v207 = v10.depth_mask;
    v10.depth_mask = true;
    v208 = v24[0];
    v24[0] = 0;
    v209 = v24[1];
    v24[1] = 1;
    v210 = v10.dither;
    v10.dither = false;
    v211 = v10.lineWidth;
    v10.lineWidth = 2;
    v212 = a0['scissorHeight'];
    v48.height = v212;
    v213 = a0['scissorWidth'];
    v48.width = v213;
    v214 = a0['scissorX'];
    v48.x = v214;
    v215 = a0['scissorY'];
    v48.y = v215;
    v216 = v48.x | 0;
    v217 = v48.y | 0;
    v218 = 'width' in v48 ? v48.width | 0 : (v2.framebufferWidth - v216);
    v219 = 'height' in v48 ? v48.height | 0 : (v2.framebufferHeight - v217);
    v220 = v30[0];
    v30[0] = v216;
    v221 = v30[1];
    v30[1] = v217;
    v222 = v30[2];
    v30[2] = v218;
    v223 = v30[3];
    v30[3] = v219;
    v224 = v10.scissor_enable;
    v10.scissor_enable = true;
    v225 = a0['offset'];
    v226 = v4.offset;
    v4.offset = v225;
    v227 = a0['count'];
    v228 = v4.count;
    v4.count = v227;
    v229 = v4.primitive;
    v4.primitive = 1;
    v230 = a0['contextColor'];
    v231 = v14[24];
    v14[24] = v230;
    v232 = a0['dim0A'];
    v233 = v14[3];
    v14[3] = v232;
    v234 = a0['dim0B'];
    v235 = v14[5];
    v14[5] = v234;
    v236 = a0['dim0C'];
    v237 = v14[7];
    v14[7] = v236;
    v238 = a0['dim0D'];
    v239 = v14[9];
    v14[9] = v238;
    v240 = a0['dim1A'];
    v241 = v14[4];
    v14[4] = v240;
    v242 = a0['dim1B'];
    v243 = v14[6];
    v14[6] = v242;
    v244 = a0['dim1C'];
    v245 = v14[8];
    v14[8] = v244;
    v246 = a0['dim1D'];
    v247 = v14[10];
    v14[10] = v246;
    v248 = a0['drwLayer'];
    v249 = v14[23];
    v14[23] = v248;
    v250 = a0['hiA'];
    v251 = v14[12];
    v14[12] = v250;
    v252 = a0['hiB'];
    v253 = v14[14];
    v14[14] = v252;
    v254 = a0['hiC'];
    v255 = v14[16];
    v14[16] = v254;
    v256 = a0['hiD'];
    v257 = v14[18];
    v14[18] = v256;
    v258 = a0['loA'];
    v259 = v14[11];
    v14[11] = v258;
    v260 = a0['loB'];
    v261 = v14[13];
    v14[13] = v260;
    v262 = a0['loC'];
    v263 = v14[15];
    v14[15] = v262;
    v264 = a0['loD'];
    v265 = v14[17];
    v14[17] = v264;
    v266 = a0['maskHeight'];
    v267 = v14[22];
    v14[22] = v266;
    v268 = a0['maskTexture'];
    v269 = v14[25];
    v14[25] = v268;
    v270 = v14[26];
    v14[26] = $20;
    v271 = a0['resolution'];
    v272 = v14[19];
    v14[19] = v271;
    v273 = a0['viewBoxPos'];
    v274 = v14[20];
    v14[20] = v273;
    v275 = a0['viewBoxSize'];
    v276 = v14[21];
    v14[21] = v275;
    v277 = $21.buffer;
    $21.buffer = $18;
    v278 = $21.divisor;
    $21.divisor = 0;
    v279 = $21.normalized;
    $21.normalized = false;
    v280 = $21.offset;
    $21.offset = 0;
    v281 = $21.size;
    $21.size = 0;
    v282 = $21.state;
    $21.state = 1;
    v283 = $21.stride;
    $21.stride = 0;
    v284 = $21.type;
    $21.type = $18.dtype;
    v285 = $21.w;
    $21.w = 0;
    v286 = $21.x;
    $21.x = 0;
    v287 = $21.y;
    $21.y = 0;
    v288 = $21.z;
    $21.z = 0;
    v289 = $22.buffer;
    $22.buffer = $3;
    v290 = $22.divisor;
    $22.divisor = 0;
    v291 = $22.normalized;
    $22.normalized = false;
    v292 = $22.offset;
    $22.offset = 0;
    v293 = $22.size;
    $22.size = 0;
    v294 = $22.state;
    $22.state = 1;
    v295 = $22.stride;
    $22.stride = 0;
    v296 = $22.type;
    $22.type = $3.dtype;
    v297 = $22.w;
    $22.w = 0;
    v298 = $22.x;
    $22.x = 0;
    v299 = $22.y;
    $22.y = 0;
    v300 = $22.z;
    $22.z = 0;
    v301 = $23.buffer;
    $23.buffer = $4;
    v302 = $23.divisor;
    $23.divisor = 0;
    v303 = $23.normalized;
    $23.normalized = false;
    v304 = $23.offset;
    $23.offset = 0;
    v305 = $23.size;
    $23.size = 0;
    v306 = $23.state;
    $23.state = 1;
    v307 = $23.stride;
    $23.stride = 0;
    v308 = $23.type;
    $23.type = $4.dtype;
    v309 = $23.w;
    $23.w = 0;
    v310 = $23.x;
    $23.x = 0;
    v311 = $23.y;
    $23.y = 0;
    v312 = $23.z;
    $23.z = 0;
    v313 = $24.buffer;
    $24.buffer = $5;
    v314 = $24.divisor;
    $24.divisor = 0;
    v315 = $24.normalized;
    $24.normalized = false;
    v316 = $24.offset;
    $24.offset = 0;
    v317 = $24.size;
    $24.size = 0;
    v318 = $24.state;
    $24.state = 1;
    v319 = $24.stride;
    $24.stride = 0;
    v320 = $24.type;
    $24.type = $5.dtype;
    v321 = $24.w;
    $24.w = 0;
    v322 = $24.x;
    $24.x = 0;
    v323 = $24.y;
    $24.y = 0;
    v324 = $24.z;
    $24.z = 0;
    v325 = $25.buffer;
    $25.buffer = $6;
    v326 = $25.divisor;
    $25.divisor = 0;
    v327 = $25.normalized;
    $25.normalized = false;
    v328 = $25.offset;
    $25.offset = 0;
    v329 = $25.size;
    $25.size = 0;
    v330 = $25.state;
    $25.state = 1;
    v331 = $25.stride;
    $25.stride = 0;
    v332 = $25.type;
    $25.type = $6.dtype;
    v333 = $25.w;
    $25.w = 0;
    v334 = $25.x;
    $25.x = 0;
    v335 = $25.y;
    $25.y = 0;
    v336 = $25.z;
    $25.z = 0;
    v337 = $26.buffer;
    $26.buffer = $7;
    v338 = $26.divisor;
    $26.divisor = 0;
    v339 = $26.normalized;
    $26.normalized = false;
    v340 = $26.offset;
    $26.offset = 0;
    v341 = $26.size;
    $26.size = 0;
    v342 = $26.state;
    $26.state = 1;
    v343 = $26.stride;
    $26.stride = 0;
    v344 = $26.type;
    $26.type = $7.dtype;
    v345 = $26.w;
    $26.w = 0;
    v346 = $26.x;
    $26.x = 0;
    v347 = $26.y;
    $26.y = 0;
    v348 = $26.z;
    $26.z = 0;
    v349 = $27.buffer;
    $27.buffer = $8;
    v350 = $27.divisor;
    $27.divisor = 0;
    v351 = $27.normalized;
    $27.normalized = false;
    v352 = $27.offset;
    $27.offset = 0;
    v353 = $27.size;
    $27.size = 0;
    v354 = $27.state;
    $27.state = 1;
    v355 = $27.stride;
    $27.stride = 0;
    v356 = $27.type;
    $27.type = $8.dtype;
    v357 = $27.w;
    $27.w = 0;
    v358 = $27.x;
    $27.x = 0;
    v359 = $27.y;
    $27.y = 0;
    v360 = $27.z;
    $27.z = 0;
    v361 = $28.buffer;
    $28.buffer = $9;
    v362 = $28.divisor;
    $28.divisor = 0;
    v363 = $28.normalized;
    $28.normalized = false;
    v364 = $28.offset;
    $28.offset = 0;
    v365 = $28.size;
    $28.size = 0;
    v366 = $28.state;
    $28.state = 1;
    v367 = $28.stride;
    $28.stride = 0;
    v368 = $28.type;
    $28.type = $9.dtype;
    v369 = $28.w;
    $28.w = 0;
    v370 = $28.x;
    $28.x = 0;
    v371 = $28.y;
    $28.y = 0;
    v372 = $28.z;
    $28.z = 0;
    v373 = $29.buffer;
    $29.buffer = $10;
    v374 = $29.divisor;
    $29.divisor = 0;
    v375 = $29.normalized;
    $29.normalized = false;
    v376 = $29.offset;
    $29.offset = 0;
    v377 = $29.size;
    $29.size = 0;
    v378 = $29.state;
    $29.state = 1;
    v379 = $29.stride;
    $29.stride = 0;
    v380 = $29.type;
    $29.type = $10.dtype;
    v381 = $29.w;
    $29.w = 0;
    v382 = $29.x;
    $29.x = 0;
    v383 = $29.y;
    $29.y = 0;
    v384 = $29.z;
    $29.z = 0;
    v385 = $30.buffer;
    $30.buffer = $11;
    v386 = $30.divisor;
    $30.divisor = 0;
    v387 = $30.normalized;
    $30.normalized = false;
    v388 = $30.offset;
    $30.offset = 0;
    v389 = $30.size;
    $30.size = 0;
    v390 = $30.state;
    $30.state = 1;
    v391 = $30.stride;
    $30.stride = 0;
    v392 = $30.type;
    $30.type = $11.dtype;
    v393 = $30.w;
    $30.w = 0;
    v394 = $30.x;
    $30.x = 0;
    v395 = $30.y;
    $30.y = 0;
    v396 = $30.z;
    $30.z = 0;
    v397 = $31.buffer;
    $31.buffer = $12;
    v398 = $31.divisor;
    $31.divisor = 0;
    v399 = $31.normalized;
    $31.normalized = false;
    v400 = $31.offset;
    $31.offset = 0;
    v401 = $31.size;
    $31.size = 0;
    v402 = $31.state;
    $31.state = 1;
    v403 = $31.stride;
    $31.stride = 0;
    v404 = $31.type;
    $31.type = $12.dtype;
    v405 = $31.w;
    $31.w = 0;
    v406 = $31.x;
    $31.x = 0;
    v407 = $31.y;
    $31.y = 0;
    v408 = $31.z;
    $31.z = 0;
    v409 = $32.buffer;
    $32.buffer = $13;
    v410 = $32.divisor;
    $32.divisor = 0;
    v411 = $32.normalized;
    $32.normalized = false;
    v412 = $32.offset;
    $32.offset = 0;
    v413 = $32.size;
    $32.size = 0;
    v414 = $32.state;
    $32.state = 1;
    v415 = $32.stride;
    $32.stride = 0;
    v416 = $32.type;
    $32.type = $13.dtype;
    v417 = $32.w;
    $32.w = 0;
    v418 = $32.x;
    $32.x = 0;
    v419 = $32.y;
    $32.y = 0;
    v420 = $32.z;
    $32.z = 0;
    v421 = $33.buffer;
    $33.buffer = $14;
    v422 = $33.divisor;
    $33.divisor = 0;
    v423 = $33.normalized;
    $33.normalized = false;
    v424 = $33.offset;
    $33.offset = 0;
    v425 = $33.size;
    $33.size = 0;
    v426 = $33.state;
    $33.state = 1;
    v427 = $33.stride;
    $33.stride = 0;
    v428 = $33.type;
    $33.type = $14.dtype;
    v429 = $33.w;
    $33.w = 0;
    v430 = $33.x;
    $33.x = 0;
    v431 = $33.y;
    $33.y = 0;
    v432 = $33.z;
    $33.z = 0;
    v433 = $34.buffer;
    $34.buffer = $15;
    v434 = $34.divisor;
    $34.divisor = 0;
    v435 = $34.normalized;
    $34.normalized = false;
    v436 = $34.offset;
    $34.offset = 0;
    v437 = $34.size;
    $34.size = 0;
    v438 = $34.state;
    $34.state = 1;
    v439 = $34.stride;
    $34.stride = 0;
    v440 = $34.type;
    $34.type = $15.dtype;
    v441 = $34.w;
    $34.w = 0;
    v442 = $34.x;
    $34.x = 0;
    v443 = $34.y;
    $34.y = 0;
    v444 = $34.z;
    $34.z = 0;
    v445 = $35.buffer;
    $35.buffer = $16;
    v446 = $35.divisor;
    $35.divisor = 0;
    v447 = $35.normalized;
    $35.normalized = false;
    v448 = $35.offset;
    $35.offset = 0;
    v449 = $35.size;
    $35.size = 0;
    v450 = $35.state;
    $35.state = 1;
    v451 = $35.stride;
    $35.stride = 0;
    v452 = $35.type;
    $35.type = $16.dtype;
    v453 = $35.w;
    $35.w = 0;
    v454 = $35.x;
    $35.x = 0;
    v455 = $35.y;
    $35.y = 0;
    v456 = $35.z;
    $35.z = 0;
    v457 = $36.buffer;
    $36.buffer = $17;
    v458 = $36.divisor;
    $36.divisor = 0;
    v459 = $36.normalized;
    $36.normalized = false;
    v460 = $36.offset;
    $36.offset = 0;
    v461 = $36.size;
    $36.size = 0;
    v462 = $36.state;
    $36.state = 1;
    v463 = $36.stride;
    $36.stride = 0;
    v464 = $36.type;
    $36.type = $17.dtype;
    v465 = $36.w;
    $36.w = 0;
    v466 = $36.x;
    $36.x = 0;
    v467 = $36.y;
    $36.y = 0;
    v468 = $36.z;
    $36.z = 0;
    v469 = v11.vert;
    v11.vert = 2;
    v470 = v11.frag;
    v11.frag = 1;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v186;
    v2.viewportHeight = v187;
    v38[0] = v188;
    v38[1] = v189;
    v38[2] = v190;
    v38[3] = v191;
    v16[0] = v192;
    v16[1] = v193;
    v16[2] = v194;
    v16[3] = v195;
    v10.blend_enable = v196;
    v18[0] = v197;
    v18[1] = v198;
    v20[0] = v199;
    v20[1] = v200;
    v20[2] = v201;
    v20[3] = v202;
    v10.cull_enable = v203;
    v10.cull_face = v204;
    v10.depth_enable = v205;
    v10.depth_func = v206;
    v10.depth_mask = v207;
    v24[0] = v208;
    v24[1] = v209;
    v10.dither = v210;
    v10.lineWidth = v211;
    v30[0] = v220;
    v30[1] = v221;
    v30[2] = v222;
    v30[3] = v223;
    v10.scissor_enable = v224;
    v4.offset = v226;
    v4.count = v228;
    v4.primitive = v229;
    v14[24] = v231;
    v14[3] = v233;
    v14[5] = v235;
    v14[7] = v237;
    v14[9] = v239;
    v14[4] = v241;
    v14[6] = v243;
    v14[8] = v245;
    v14[10] = v247;
    v14[23] = v249;
    v14[12] = v251;
    v14[14] = v253;
    v14[16] = v255;
    v14[18] = v257;
    v14[11] = v259;
    v14[13] = v261;
    v14[15] = v263;
    v14[17] = v265;
    v14[22] = v267;
    v14[25] = v269;
    v14[26] = v270;
    v14[19] = v272;
    v14[20] = v274;
    v14[21] = v276;
    $21.buffer = v277;
    $21.divisor = v278;
    $21.normalized = v279;
    $21.offset = v280;
    $21.size = v281;
    $21.state = v282;
    $21.stride = v283;
    $21.type = v284;
    $21.w = v285;
    $21.x = v286;
    $21.y = v287;
    $21.z = v288;
    $22.buffer = v289;
    $22.divisor = v290;
    $22.normalized = v291;
    $22.offset = v292;
    $22.size = v293;
    $22.state = v294;
    $22.stride = v295;
    $22.type = v296;
    $22.w = v297;
    $22.x = v298;
    $22.y = v299;
    $22.z = v300;
    $23.buffer = v301;
    $23.divisor = v302;
    $23.normalized = v303;
    $23.offset = v304;
    $23.size = v305;
    $23.state = v306;
    $23.stride = v307;
    $23.type = v308;
    $23.w = v309;
    $23.x = v310;
    $23.y = v311;
    $23.z = v312;
    $24.buffer = v313;
    $24.divisor = v314;
    $24.normalized = v315;
    $24.offset = v316;
    $24.size = v317;
    $24.state = v318;
    $24.stride = v319;
    $24.type = v320;
    $24.w = v321;
    $24.x = v322;
    $24.y = v323;
    $24.z = v324;
    $25.buffer = v325;
    $25.divisor = v326;
    $25.normalized = v327;
    $25.offset = v328;
    $25.size = v329;
    $25.state = v330;
    $25.stride = v331;
    $25.type = v332;
    $25.w = v333;
    $25.x = v334;
    $25.y = v335;
    $25.z = v336;
    $26.buffer = v337;
    $26.divisor = v338;
    $26.normalized = v339;
    $26.offset = v340;
    $26.size = v341;
    $26.state = v342;
    $26.stride = v343;
    $26.type = v344;
    $26.w = v345;
    $26.x = v346;
    $26.y = v347;
    $26.z = v348;
    $27.buffer = v349;
    $27.divisor = v350;
    $27.normalized = v351;
    $27.offset = v352;
    $27.size = v353;
    $27.state = v354;
    $27.stride = v355;
    $27.type = v356;
    $27.w = v357;
    $27.x = v358;
    $27.y = v359;
    $27.z = v360;
    $28.buffer = v361;
    $28.divisor = v362;
    $28.normalized = v363;
    $28.offset = v364;
    $28.size = v365;
    $28.state = v366;
    $28.stride = v367;
    $28.type = v368;
    $28.w = v369;
    $28.x = v370;
    $28.y = v371;
    $28.z = v372;
    $29.buffer = v373;
    $29.divisor = v374;
    $29.normalized = v375;
    $29.offset = v376;
    $29.size = v377;
    $29.state = v378;
    $29.stride = v379;
    $29.type = v380;
    $29.w = v381;
    $29.x = v382;
    $29.y = v383;
    $29.z = v384;
    $30.buffer = v385;
    $30.divisor = v386;
    $30.normalized = v387;
    $30.offset = v388;
    $30.size = v389;
    $30.state = v390;
    $30.stride = v391;
    $30.type = v392;
    $30.w = v393;
    $30.x = v394;
    $30.y = v395;
    $30.z = v396;
    $31.buffer = v397;
    $31.divisor = v398;
    $31.normalized = v399;
    $31.offset = v400;
    $31.size = v401;
    $31.state = v402;
    $31.stride = v403;
    $31.type = v404;
    $31.w = v405;
    $31.x = v406;
    $31.y = v407;
    $31.z = v408;
    $32.buffer = v409;
    $32.divisor = v410;
    $32.normalized = v411;
    $32.offset = v412;
    $32.size = v413;
    $32.state = v414;
    $32.stride = v415;
    $32.type = v416;
    $32.w = v417;
    $32.x = v418;
    $32.y = v419;
    $32.z = v420;
    $33.buffer = v421;
    $33.divisor = v422;
    $33.normalized = v423;
    $33.offset = v424;
    $33.size = v425;
    $33.state = v426;
    $33.stride = v427;
    $33.type = v428;
    $33.w = v429;
    $33.x = v430;
    $33.y = v431;
    $33.z = v432;
    $34.buffer = v433;
    $34.divisor = v434;
    $34.normalized = v435;
    $34.offset = v436;
    $34.size = v437;
    $34.state = v438;
    $34.stride = v439;
    $34.type = v440;
    $34.w = v441;
    $34.x = v442;
    $34.y = v443;
    $34.z = v444;
    $35.buffer = v445;
    $35.divisor = v446;
    $35.normalized = v447;
    $35.offset = v448;
    $35.size = v449;
    $35.state = v450;
    $35.stride = v451;
    $35.type = v452;
    $35.w = v453;
    $35.x = v454;
    $35.y = v455;
    $35.z = v456;
    $36.buffer = v457;
    $36.divisor = v458;
    $36.normalized = v459;
    $36.offset = v460;
    $36.size = v461;
    $36.state = v462;
    $36.stride = v463;
    $36.type = v464;
    $36.w = v465;
    $36.x = v466;
    $36.y = v467;
    $36.z = v468;
    v11.vert = v469;
    v11.frag = v470;
    v3.dirty = true;
   }
   ,
  }

 },
 '$1': function ($0, $1
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v74, v75, v76, v77, v78, v79, v80, v81, v88, v89, v94, v95, v96, v97, v98, v99, v100, v101, v104, v105, v106, v107, v108, v109;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v74 = v10.blend_color;
  v75 = v3.blend_color;
  v76 = v10.blend_equation;
  v77 = v3.blend_equation;
  v78 = v10.blend_func;
  v79 = v3.blend_func;
  v80 = v10.colorMask;
  v81 = v3.colorMask;
  v88 = v10.depth_range;
  v89 = v3.depth_range;
  v94 = v10.polygonOffset_offset;
  v95 = v3.polygonOffset_offset;
  v96 = v10.sample_coverage;
  v97 = v3.sample_coverage;
  v98 = v10.scissor_box;
  v99 = v3.scissor_box;
  v100 = v10.stencil_func;
  v101 = v3.stencil_func;
  v104 = v10.stencil_opBack;
  v105 = v3.stencil_opBack;
  v106 = v10.stencil_opFront;
  v107 = v3.stencil_opFront;
  v108 = v10.viewport;
  v109 = v3.viewport;
  return {
   'poll': function () {
    var v47;
    var v65, v66, v67, v68, v69, v70, v71, v72, v73, v82, v83, v84, v85, v86, v87, v90, v91, v92, v93, v102, v103;
    v3.dirty = false;
    v65 = v10.blend_enable;
    v66 = v10.cull_enable;
    v67 = v10.depth_enable;
    v68 = v10.dither;
    v69 = v10.polygonOffset_enable;
    v70 = v10.sample_alpha;
    v71 = v10.sample_enable;
    v72 = v10.scissor_enable;
    v73 = v10.stencil_enable;
    v82 = v10.cull_face;
    v83 = v3.cull_face;
    v84 = v10.depth_func;
    v85 = v3.depth_func;
    v86 = v10.depth_mask;
    v87 = v3.depth_mask;
    v90 = v10.frontFace;
    v91 = v3.frontFace;
    v92 = v10.lineWidth;
    v93 = v3.lineWidth;
    v102 = v10.stencil_mask;
    v103 = v3.stencil_mask;
    v47 = v7.next;
    if (v47 !== v7.cur) {
     if (v47) {
      v8.bindFramebuffer(36160, v47.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v47;
    }
    if (v65 !== v3.blend_enable) {
     if (v65) {
      v8.enable(3042)
     }
     else {
      v8.disable(3042)
     }
     v3.blend_enable = v65;
    }
    if (v66 !== v3.cull_enable) {
     if (v66) {
      v8.enable(2884)
     }
     else {
      v8.disable(2884)
     }
     v3.cull_enable = v66;
    }
    if (v67 !== v3.depth_enable) {
     if (v67) {
      v8.enable(2929)
     }
     else {
      v8.disable(2929)
     }
     v3.depth_enable = v67;
    }
    if (v68 !== v3.dither) {
     if (v68) {
      v8.enable(3024)
     }
     else {
      v8.disable(3024)
     }
     v3.dither = v68;
    }
    if (v69 !== v3.polygonOffset_enable) {
     if (v69) {
      v8.enable(32823)
     }
     else {
      v8.disable(32823)
     }
     v3.polygonOffset_enable = v69;
    }
    if (v70 !== v3.sample_alpha) {
     if (v70) {
      v8.enable(32926)
     }
     else {
      v8.disable(32926)
     }
     v3.sample_alpha = v70;
    }
    if (v71 !== v3.sample_enable) {
     if (v71) {
      v8.enable(32928)
     }
     else {
      v8.disable(32928)
     }
     v3.sample_enable = v71;
    }
    if (v72 !== v3.scissor_enable) {
     if (v72) {
      v8.enable(3089)
     }
     else {
      v8.disable(3089)
     }
     v3.scissor_enable = v72;
    }
    if (v73 !== v3.stencil_enable) {
     if (v73) {
      v8.enable(2960)
     }
     else {
      v8.disable(2960)
     }
     v3.stencil_enable = v73;
    }
    if (v74[0] !== v75[0] || v74[1] !== v75[1] || v74[2] !== v75[2] || v74[3] !== v75[3]) {
     v8.blendColor(v74[0], v74[1], v74[2], v74[3]);
     v75[0] = v74[0];
     v75[1] = v74[1];
     v75[2] = v74[2];
     v75[3] = v74[3];
    }
    if (v76[0] !== v77[0] || v76[1] !== v77[1]) {
     v8.blendEquationSeparate(v76[0], v76[1]);
     v77[0] = v76[0];
     v77[1] = v76[1];
    }
    if (v78[0] !== v79[0] || v78[1] !== v79[1] || v78[2] !== v79[2] || v78[3] !== v79[3]) {
     v8.blendFuncSeparate(v78[0], v78[1], v78[2], v78[3]);
     v79[0] = v78[0];
     v79[1] = v78[1];
     v79[2] = v78[2];
     v79[3] = v78[3];
    }
    if (v80[0] !== v81[0] || v80[1] !== v81[1] || v80[2] !== v81[2] || v80[3] !== v81[3]) {
     v8.colorMask(v80[0], v80[1], v80[2], v80[3]);
     v81[0] = v80[0];
     v81[1] = v80[1];
     v81[2] = v80[2];
     v81[3] = v80[3];
    }
    if (v82 !== v83) {
     v8.cullFace(v82);
     v3.cull_face = v82;
    }
    if (v84 !== v85) {
     v8.depthFunc(v84);
     v3.depth_func = v84;
    }
    if (v86 !== v87) {
     v8.depthMask(v86);
     v3.depth_mask = v86;
    }
    if (v88[0] !== v89[0] || v88[1] !== v89[1]) {
     v8.depthRange(v88[0], v88[1]);
     v89[0] = v88[0];
     v89[1] = v88[1];
    }
    if (v90 !== v91) {
     v8.frontFace(v90);
     v3.frontFace = v90;
    }
    if (v92 !== v93) {
     v8.lineWidth(v92);
     v3.lineWidth = v92;
    }
    if (v94[0] !== v95[0] || v94[1] !== v95[1]) {
     v8.polygonOffset(v94[0], v94[1]);
     v95[0] = v94[0];
     v95[1] = v94[1];
    }
    if (v96[0] !== v97[0] || v96[1] !== v97[1]) {
     v8.sampleCoverage(v96[0], v96[1]);
     v97[0] = v96[0];
     v97[1] = v96[1];
    }
    if (v98[0] !== v99[0] || v98[1] !== v99[1] || v98[2] !== v99[2] || v98[3] !== v99[3]) {
     v8.scissor(v98[0], v98[1], v98[2], v98[3]);
     v99[0] = v98[0];
     v99[1] = v98[1];
     v99[2] = v98[2];
     v99[3] = v98[3];
    }
    if (v100[0] !== v101[0] || v100[1] !== v101[1] || v100[2] !== v101[2]) {
     v8.stencilFunc(v100[0], v100[1], v100[2]);
     v101[0] = v100[0];
     v101[1] = v100[1];
     v101[2] = v100[2];
    }
    if (v102 !== v103) {
     v8.stencilMask(v102);
     v3.stencil_mask = v102;
    }
    if (v104[0] !== v105[0] || v104[1] !== v105[1] || v104[2] !== v105[2] || v104[3] !== v105[3]) {
     v8.stencilOpSeparate(v104[0], v104[1], v104[2], v104[3]);
     v105[0] = v104[0];
     v105[1] = v104[1];
     v105[2] = v104[2];
     v105[3] = v104[3];
    }
    if (v106[0] !== v107[0] || v106[1] !== v107[1] || v106[2] !== v107[2] || v106[3] !== v107[3]) {
     v8.stencilOpSeparate(v106[0], v106[1], v106[2], v106[3]);
     v107[0] = v106[0];
     v107[1] = v106[1];
     v107[2] = v106[2];
     v107[3] = v106[3];
    }
    if (v108[0] !== v109[0] || v108[1] !== v109[1] || v108[2] !== v109[2] || v108[3] !== v109[3]) {
     v8.viewport(v108[0], v108[1], v108[2], v108[3]);
     v109[0] = v108[0];
     v109[1] = v108[1];
     v109[2] = v108[2];
     v109[3] = v108[3];
    }
   }
   , 'refresh': function () {
    var v48, v49, v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64;
    var v65, v66, v67, v68, v69, v70, v71, v72, v73, v82, v83, v84, v85, v86, v87, v90, v91, v92, v93, v102, v103;
    v3.dirty = false;
    v65 = v10.blend_enable;
    v66 = v10.cull_enable;
    v67 = v10.depth_enable;
    v68 = v10.dither;
    v69 = v10.polygonOffset_enable;
    v70 = v10.sample_alpha;
    v71 = v10.sample_enable;
    v72 = v10.scissor_enable;
    v73 = v10.stencil_enable;
    v82 = v10.cull_face;
    v83 = v3.cull_face;
    v84 = v10.depth_func;
    v85 = v3.depth_func;
    v86 = v10.depth_mask;
    v87 = v3.depth_mask;
    v90 = v10.frontFace;
    v91 = v3.frontFace;
    v92 = v10.lineWidth;
    v93 = v3.lineWidth;
    v102 = v10.stencil_mask;
    v103 = v3.stencil_mask;
    v48 = v7.next;
    if (v48) {
     v8.bindFramebuffer(36160, v48.framebuffer);
    }
    else {
     v8.bindFramebuffer(36160, null);
    }
    v7.cur = v48;
    v49 = v0[0];
    if (v49.buffer) {
     v8.enableVertexAttribArray(0);
     v8.bindBuffer(34962, v49.buffer.buffer);
     v8.vertexAttribPointer(0, v49.size, v49.type, v49.normalized, v49.stride, v49.offset);
    }
    else {
     v8.disableVertexAttribArray(0);
     v8.vertexAttrib4f(0, v49.x, v49.y, v49.z, v49.w);
     v49.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(0, v49.divisor);
    v50 = v0[1];
    if (v50.buffer) {
     v8.enableVertexAttribArray(1);
     v8.bindBuffer(34962, v50.buffer.buffer);
     v8.vertexAttribPointer(1, v50.size, v50.type, v50.normalized, v50.stride, v50.offset);
    }
    else {
     v8.disableVertexAttribArray(1);
     v8.vertexAttrib4f(1, v50.x, v50.y, v50.z, v50.w);
     v50.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(1, v50.divisor);
    v51 = v0[2];
    if (v51.buffer) {
     v8.enableVertexAttribArray(2);
     v8.bindBuffer(34962, v51.buffer.buffer);
     v8.vertexAttribPointer(2, v51.size, v51.type, v51.normalized, v51.stride, v51.offset);
    }
    else {
     v8.disableVertexAttribArray(2);
     v8.vertexAttrib4f(2, v51.x, v51.y, v51.z, v51.w);
     v51.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(2, v51.divisor);
    v52 = v0[3];
    if (v52.buffer) {
     v8.enableVertexAttribArray(3);
     v8.bindBuffer(34962, v52.buffer.buffer);
     v8.vertexAttribPointer(3, v52.size, v52.type, v52.normalized, v52.stride, v52.offset);
    }
    else {
     v8.disableVertexAttribArray(3);
     v8.vertexAttrib4f(3, v52.x, v52.y, v52.z, v52.w);
     v52.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(3, v52.divisor);
    v53 = v0[4];
    if (v53.buffer) {
     v8.enableVertexAttribArray(4);
     v8.bindBuffer(34962, v53.buffer.buffer);
     v8.vertexAttribPointer(4, v53.size, v53.type, v53.normalized, v53.stride, v53.offset);
    }
    else {
     v8.disableVertexAttribArray(4);
     v8.vertexAttrib4f(4, v53.x, v53.y, v53.z, v53.w);
     v53.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(4, v53.divisor);
    v54 = v0[5];
    if (v54.buffer) {
     v8.enableVertexAttribArray(5);
     v8.bindBuffer(34962, v54.buffer.buffer);
     v8.vertexAttribPointer(5, v54.size, v54.type, v54.normalized, v54.stride, v54.offset);
    }
    else {
     v8.disableVertexAttribArray(5);
     v8.vertexAttrib4f(5, v54.x, v54.y, v54.z, v54.w);
     v54.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(5, v54.divisor);
    v55 = v0[6];
    if (v55.buffer) {
     v8.enableVertexAttribArray(6);
     v8.bindBuffer(34962, v55.buffer.buffer);
     v8.vertexAttribPointer(6, v55.size, v55.type, v55.normalized, v55.stride, v55.offset);
    }
    else {
     v8.disableVertexAttribArray(6);
     v8.vertexAttrib4f(6, v55.x, v55.y, v55.z, v55.w);
     v55.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(6, v55.divisor);
    v56 = v0[7];
    if (v56.buffer) {
     v8.enableVertexAttribArray(7);
     v8.bindBuffer(34962, v56.buffer.buffer);
     v8.vertexAttribPointer(7, v56.size, v56.type, v56.normalized, v56.stride, v56.offset);
    }
    else {
     v8.disableVertexAttribArray(7);
     v8.vertexAttrib4f(7, v56.x, v56.y, v56.z, v56.w);
     v56.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(7, v56.divisor);
    v57 = v0[8];
    if (v57.buffer) {
     v8.enableVertexAttribArray(8);
     v8.bindBuffer(34962, v57.buffer.buffer);
     v8.vertexAttribPointer(8, v57.size, v57.type, v57.normalized, v57.stride, v57.offset);
    }
    else {
     v8.disableVertexAttribArray(8);
     v8.vertexAttrib4f(8, v57.x, v57.y, v57.z, v57.w);
     v57.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(8, v57.divisor);
    v58 = v0[9];
    if (v58.buffer) {
     v8.enableVertexAttribArray(9);
     v8.bindBuffer(34962, v58.buffer.buffer);
     v8.vertexAttribPointer(9, v58.size, v58.type, v58.normalized, v58.stride, v58.offset);
    }
    else {
     v8.disableVertexAttribArray(9);
     v8.vertexAttrib4f(9, v58.x, v58.y, v58.z, v58.w);
     v58.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(9, v58.divisor);
    v59 = v0[10];
    if (v59.buffer) {
     v8.enableVertexAttribArray(10);
     v8.bindBuffer(34962, v59.buffer.buffer);
     v8.vertexAttribPointer(10, v59.size, v59.type, v59.normalized, v59.stride, v59.offset);
    }
    else {
     v8.disableVertexAttribArray(10);
     v8.vertexAttrib4f(10, v59.x, v59.y, v59.z, v59.w);
     v59.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(10, v59.divisor);
    v60 = v0[11];
    if (v60.buffer) {
     v8.enableVertexAttribArray(11);
     v8.bindBuffer(34962, v60.buffer.buffer);
     v8.vertexAttribPointer(11, v60.size, v60.type, v60.normalized, v60.stride, v60.offset);
    }
    else {
     v8.disableVertexAttribArray(11);
     v8.vertexAttrib4f(11, v60.x, v60.y, v60.z, v60.w);
     v60.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(11, v60.divisor);
    v61 = v0[12];
    if (v61.buffer) {
     v8.enableVertexAttribArray(12);
     v8.bindBuffer(34962, v61.buffer.buffer);
     v8.vertexAttribPointer(12, v61.size, v61.type, v61.normalized, v61.stride, v61.offset);
    }
    else {
     v8.disableVertexAttribArray(12);
     v8.vertexAttrib4f(12, v61.x, v61.y, v61.z, v61.w);
     v61.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(12, v61.divisor);
    v62 = v0[13];
    if (v62.buffer) {
     v8.enableVertexAttribArray(13);
     v8.bindBuffer(34962, v62.buffer.buffer);
     v8.vertexAttribPointer(13, v62.size, v62.type, v62.normalized, v62.stride, v62.offset);
    }
    else {
     v8.disableVertexAttribArray(13);
     v8.vertexAttrib4f(13, v62.x, v62.y, v62.z, v62.w);
     v62.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(13, v62.divisor);
    v63 = v0[14];
    if (v63.buffer) {
     v8.enableVertexAttribArray(14);
     v8.bindBuffer(34962, v63.buffer.buffer);
     v8.vertexAttribPointer(14, v63.size, v63.type, v63.normalized, v63.stride, v63.offset);
    }
    else {
     v8.disableVertexAttribArray(14);
     v8.vertexAttrib4f(14, v63.x, v63.y, v63.z, v63.w);
     v63.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(14, v63.divisor);
    v64 = v0[15];
    if (v64.buffer) {
     v8.enableVertexAttribArray(15);
     v8.bindBuffer(34962, v64.buffer.buffer);
     v8.vertexAttribPointer(15, v64.size, v64.type, v64.normalized, v64.stride, v64.offset);
    }
    else {
     v8.disableVertexAttribArray(15);
     v8.vertexAttrib4f(15, v64.x, v64.y, v64.z, v64.w);
     v64.buffer = null;
    }
    $1.vertexAttribDivisorANGLE(15, v64.divisor);
    v15.currentVAO = null;
    v15.setVAO(v15.targetVAO);
    if (v65) {
     v8.enable(3042)
    }
    else {
     v8.disable(3042)
    }
    v3.blend_enable = v65;
    if (v66) {
     v8.enable(2884)
    }
    else {
     v8.disable(2884)
    }
    v3.cull_enable = v66;
    if (v67) {
     v8.enable(2929)
    }
    else {
     v8.disable(2929)
    }
    v3.depth_enable = v67;
    if (v68) {
     v8.enable(3024)
    }
    else {
     v8.disable(3024)
    }
    v3.dither = v68;
    if (v69) {
     v8.enable(32823)
    }
    else {
     v8.disable(32823)
    }
    v3.polygonOffset_enable = v69;
    if (v70) {
     v8.enable(32926)
    }
    else {
     v8.disable(32926)
    }
    v3.sample_alpha = v70;
    if (v71) {
     v8.enable(32928)
    }
    else {
     v8.disable(32928)
    }
    v3.sample_enable = v71;
    if (v72) {
     v8.enable(3089)
    }
    else {
     v8.disable(3089)
    }
    v3.scissor_enable = v72;
    if (v73) {
     v8.enable(2960)
    }
    else {
     v8.disable(2960)
    }
    v3.stencil_enable = v73;
    v8.blendColor(v74[0], v74[1], v74[2], v74[3]);
    v75[0] = v74[0];
    v75[1] = v74[1];
    v75[2] = v74[2];
    v75[3] = v74[3];
    v8.blendEquationSeparate(v76[0], v76[1]);
    v77[0] = v76[0];
    v77[1] = v76[1];
    v8.blendFuncSeparate(v78[0], v78[1], v78[2], v78[3]);
    v79[0] = v78[0];
    v79[1] = v78[1];
    v79[2] = v78[2];
    v79[3] = v78[3];
    v8.colorMask(v80[0], v80[1], v80[2], v80[3]);
    v81[0] = v80[0];
    v81[1] = v80[1];
    v81[2] = v80[2];
    v81[3] = v80[3];
    v8.cullFace(v82);
    v3.cull_face = v82;
    v8.depthFunc(v84);
    v3.depth_func = v84;
    v8.depthMask(v86);
    v3.depth_mask = v86;
    v8.depthRange(v88[0], v88[1]);
    v89[0] = v88[0];
    v89[1] = v88[1];
    v8.frontFace(v90);
    v3.frontFace = v90;
    v8.lineWidth(v92);
    v3.lineWidth = v92;
    v8.polygonOffset(v94[0], v94[1]);
    v95[0] = v94[0];
    v95[1] = v94[1];
    v8.sampleCoverage(v96[0], v96[1]);
    v97[0] = v96[0];
    v97[1] = v96[1];
    v8.scissor(v98[0], v98[1], v98[2], v98[3]);
    v99[0] = v98[0];
    v99[1] = v98[1];
    v99[2] = v98[2];
    v99[3] = v98[3];
    v8.stencilFunc(v100[0], v100[1], v100[2]);
    v101[0] = v100[0];
    v101[1] = v100[1];
    v101[2] = v100[2];
    v8.stencilMask(v102);
    v3.stencil_mask = v102;
    v8.stencilOpSeparate(v104[0], v104[1], v104[2], v104[3]);
    v105[0] = v104[0];
    v105[1] = v104[1];
    v105[2] = v104[2];
    v105[3] = v104[3];
    v8.stencilOpSeparate(v106[0], v106[1], v106[2], v106[3]);
    v107[0] = v106[0];
    v107[1] = v106[1];
    v107[2] = v106[2];
    v107[3] = v106[3];
    v8.viewport(v108[0], v108[1], v108[2], v108[3]);
    v109[0] = v108[0];
    v109[1] = v108[1];
    v109[2] = v108[2];
    v109[3] = v108[3];
   }
   ,
  }

 },
 '$32,capOffset,capSize,color,direction,error,lineOffset,lineWidth,opacity,position,positionFract,scale,scaleFract,translate,translateFract,viewport': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, capOffset, capSize, color, direction, error, lineOffset, lineWidth, opacity, position, positionFract, scale, scaleFract, translate, translateFract, viewport
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48, v49, v50;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v47 = {
  }
   ;
  v47.buffer = $2;
  v47.divisor = 1;
  v48 = {
  }
   ;
  v48.buffer = $3;
  v48.divisor = 1;
  v49 = {
  }
   ;
  v49.buffer = $4;
  v49.divisor = 1;
  v50 = {
  }
   ;
  v50.buffer = $5;
  v50.divisor = 1;
  return {
   'batch': function (a0, a1) {
    var v393, v394, v428, v429, v430;
    v393 = v6.angle_instanced_arrays;
    v394 = v7.next;
    if (v394 !== v7.cur) {
     if (v394) {
      v8.bindFramebuffer(36160, v394.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v394;
    }
    if (v3.dirty) {
     var v395, v396, v397, v398, v399, v400, v401, v402, v403, v404, v405, v406, v407, v408, v409, v410, v411, v412, v413, v414, v415, v416, v417, v418, v419, v420, v421, v422, v423, v424, v425, v426, v427;
     v395 = v10.dither;
     if (v395 !== v3.dither) {
      if (v395) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v395;
     }
     v396 = v10.depth_func;
     if (v396 !== v3.depth_func) {
      v8.depthFunc(v396);
      v3.depth_func = v396;
     }
     v397 = v24[0];
     v398 = v24[1];
     if (v397 !== v25[0] || v398 !== v25[1]) {
      v8.depthRange(v397, v398);
      v25[0] = v397;
      v25[1] = v398;
     }
     v399 = v10.depth_mask;
     if (v399 !== v3.depth_mask) {
      v8.depthMask(v399);
      v3.depth_mask = v399;
     }
     v400 = v22[0];
     v401 = v22[1];
     v402 = v22[2];
     v403 = v22[3];
     if (v400 !== v23[0] || v401 !== v23[1] || v402 !== v23[2] || v403 !== v23[3]) {
      v8.colorMask(v400, v401, v402, v403);
      v23[0] = v400;
      v23[1] = v401;
      v23[2] = v402;
      v23[3] = v403;
     }
     v404 = v10.cull_enable;
     if (v404 !== v3.cull_enable) {
      if (v404) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v404;
     }
     v405 = v10.cull_face;
     if (v405 !== v3.cull_face) {
      v8.cullFace(v405);
      v3.cull_face = v405;
     }
     v406 = v10.frontFace;
     if (v406 !== v3.frontFace) {
      v8.frontFace(v406);
      v3.frontFace = v406;
     }
     v407 = v10.lineWidth;
     if (v407 !== v3.lineWidth) {
      v8.lineWidth(v407);
      v3.lineWidth = v407;
     }
     v408 = v10.polygonOffset_enable;
     if (v408 !== v3.polygonOffset_enable) {
      if (v408) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v408;
     }
     v409 = v26[0];
     v410 = v26[1];
     if (v409 !== v27[0] || v410 !== v27[1]) {
      v8.polygonOffset(v409, v410);
      v27[0] = v409;
      v27[1] = v410;
     }
     v411 = v10.sample_alpha;
     if (v411 !== v3.sample_alpha) {
      if (v411) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v411;
     }
     v412 = v10.sample_enable;
     if (v412 !== v3.sample_enable) {
      if (v412) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v412;
     }
     v413 = v28[0];
     v414 = v28[1];
     if (v413 !== v29[0] || v414 !== v29[1]) {
      v8.sampleCoverage(v413, v414);
      v29[0] = v413;
      v29[1] = v414;
     }
     v415 = v10.stencil_enable;
     if (v415 !== v3.stencil_enable) {
      if (v415) {
       v8.enable(2960);
      }
      else {
       v8.disable(2960);
      }
      v3.stencil_enable = v415;
     }
     v416 = v10.stencil_mask;
     if (v416 !== v3.stencil_mask) {
      v8.stencilMask(v416);
      v3.stencil_mask = v416;
     }
     v417 = v32[0];
     v418 = v32[1];
     v419 = v32[2];
     if (v417 !== v33[0] || v418 !== v33[1] || v419 !== v33[2]) {
      v8.stencilFunc(v417, v418, v419);
      v33[0] = v417;
      v33[1] = v418;
      v33[2] = v419;
     }
     v420 = v36[0];
     v421 = v36[1];
     v422 = v36[2];
     v423 = v36[3];
     if (v420 !== v37[0] || v421 !== v37[1] || v422 !== v37[2] || v423 !== v37[3]) {
      v8.stencilOpSeparate(v420, v421, v422, v423);
      v37[0] = v420;
      v37[1] = v421;
      v37[2] = v422;
      v37[3] = v423;
     }
     v424 = v34[0];
     v425 = v34[1];
     v426 = v34[2];
     v427 = v34[3];
     if (v424 !== v35[0] || v425 !== v35[1] || v426 !== v35[2] || v427 !== v35[3]) {
      v8.stencilOpSeparate(v424, v425, v426, v427);
      v35[0] = v424;
      v35[1] = v425;
      v35[2] = v426;
      v35[3] = v427;
     }
    }
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.useProgram($27.program);
    v428 = v6.angle_instanced_arrays;
    var v443, v444, v445, v446, v447, v448, v552, v553;
    v15.setVAO(null);
    v443 = direction.location;
    v444 = v0[v443];
    if (!v444.buffer) {
     v8.enableVertexAttribArray(v443);
    }
    if (v444.type !== 5126 || v444.size !== 2 || v444.buffer !== $11 || v444.normalized !== false || v444.offset !== 0 || v444.stride !== 24) {
     v8.bindBuffer(34962, $11.buffer);
     v8.vertexAttribPointer(v443, 2, 5126, false, 24, 0);
     v444.type = 5126;
     v444.size = 2;
     v444.buffer = $11;
     v444.normalized = false;
     v444.offset = 0;
     v444.stride = 24;
    }
    if (v444.divisor !== 0) {
     v428.vertexAttribDivisorANGLE(v443, 0);
     v444.divisor = 0;
    }
    v445 = lineOffset.location;
    v446 = v0[v445];
    if (!v446.buffer) {
     v8.enableVertexAttribArray(v445);
    }
    if (v446.type !== 5126 || v446.size !== 2 || v446.buffer !== $12 || v446.normalized !== false || v446.offset !== 8 || v446.stride !== 24) {
     v8.bindBuffer(34962, $12.buffer);
     v8.vertexAttribPointer(v445, 2, 5126, false, 24, 8);
     v446.type = 5126;
     v446.size = 2;
     v446.buffer = $12;
     v446.normalized = false;
     v446.offset = 8;
     v446.stride = 24;
    }
    if (v446.divisor !== 0) {
     v428.vertexAttribDivisorANGLE(v445, 0);
     v446.divisor = 0;
    }
    v447 = capOffset.location;
    v448 = v0[v447];
    if (!v448.buffer) {
     v8.enableVertexAttribArray(v447);
    }
    if (v448.type !== 5126 || v448.size !== 2 || v448.buffer !== $13 || v448.normalized !== false || v448.offset !== 16 || v448.stride !== 24) {
     v8.bindBuffer(34962, $13.buffer);
     v8.vertexAttribPointer(v447, 2, 5126, false, 24, 16);
     v448.type = 5126;
     v448.size = 2;
     v448.buffer = $13;
     v448.normalized = false;
     v448.offset = 16;
     v448.stride = 24;
    }
    if (v448.divisor !== 0) {
     v428.vertexAttribDivisorANGLE(v447, 0);
     v448.divisor = 0;
    }
    v552 = v4.elements;
    if (v552) {
     v8.bindBuffer(34963, v552.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v552 = v5.getElements(v15.currentVAO.elements);
     if (v552) v8.bindBuffer(34963, v552.buffer.buffer);
    }
    v553 = v4.offset;
    for (v429 = 0;
     v429 < a1;
     ++v429) {
     v430 = a0[v429];
     var v431, v432, v433, v434, v435, v436, v437, v438, v439, v440, v441, v442, v449, v450, v451, v452, v453, v454, v455, v456, v457, v458, v459, v460, v461, v462, v463, v464, v465, v466, v467, v468, v469, v470, v471, v472, v473, v474, v475, v476, v477, v478, v479, v480, v481, v482, v483, v484, v485, v486, v487, v488, v489, v490, v491, v492, v493, v494, v495, v496, v497, v498, v499, v500, v501, v502, v503, v504, v505, v506, v507, v508, v509, v510, v511, v512, v513, v514, v515, v516, v517, v518, v519, v520, v521, v522, v523, v524, v525, v526, v527, v528, v529, v530, v531, v532, v533, v534, v535, v536, v537, v538, v539, v540, v541, v542, v543, v544, v545, v546, v547, v548, v549, v550, v551, v554;
     v431 = v430['viewport'];
     v432 = v431.x | 0;
     v433 = v431.y | 0;
     v434 = 'width' in v431 ? v431.width | 0 : (v2.framebufferWidth - v432);
     v435 = 'height' in v431 ? v431.height | 0 : (v2.framebufferHeight - v433);
     v436 = v2.viewportWidth;
     v2.viewportWidth = v434;
     v437 = v2.viewportHeight;
     v2.viewportHeight = v435;
     v8.viewport(v432, v433, v434, v435);
     v39[0] = v432;
     v39[1] = v433;
     v39[2] = v434;
     v39[3] = v435;
     v438 = v430['viewport'];
     v439 = v438.x | 0;
     v440 = v438.y | 0;
     v441 = 'width' in v438 ? v438.width | 0 : (v2.framebufferWidth - v439);
     v442 = 'height' in v438 ? v438.height | 0 : (v2.framebufferHeight - v440);
     v8.scissor(v439, v440, v441, v442);
     v31[0] = v439;
     v31[1] = v440;
     v31[2] = v441;
     v31[3] = v442;
     v449 = $28.call(this, v2, v430, v429);
     v49.offset = v449;
     v450 = false;
     v451 = null;
     v452 = 0;
     v453 = false;
     v454 = 0;
     v455 = 0;
     v456 = 1;
     v457 = 0;
     v458 = 5126;
     v459 = 0;
     v460 = 0;
     v461 = 0;
     v462 = 0;
     if (v9(v49)) {
      v450 = true;
      v451 = v1.createStream(34962, v49);
      v458 = v451.dtype;
     }
     else {
      v451 = v1.getBuffer(v49);
      if (v451) {
       v458 = v451.dtype;
      }
      else if ('constant' in v49) {
       v456 = 2;
       if (typeof v49.constant === 'number') {
        v460 = v49.constant;
        v461 = v462 = v459 = 0;
       }
       else {
        v460 = v49.constant.length > 0 ? v49.constant[0] : 0;
        v461 = v49.constant.length > 1 ? v49.constant[1] : 0;
        v462 = v49.constant.length > 2 ? v49.constant[2] : 0;
        v459 = v49.constant.length > 3 ? v49.constant[3] : 0;
       }
      }
      else {
       if (v9(v49.buffer)) {
        v451 = v1.createStream(34962, v49.buffer);
       }
       else {
        v451 = v1.getBuffer(v49.buffer);
       }
       v458 = 'type' in v49 ? v43[v49.type] : v451.dtype;
       v453 = !!v49.normalized;
       v455 = v49.size | 0;
       v454 = v49.offset | 0;
       v457 = v49.stride | 0;
       v452 = v49.divisor | 0;
      }
     }
     v463 = position.location;
     v464 = v0[v463];
     if (v456 === 1) {
      if (!v464.buffer) {
       v8.enableVertexAttribArray(v463);
      }
      v465 = v455 || 2;
      if (v464.type !== v458 || v464.size !== v465 || v464.buffer !== v451 || v464.normalized !== v453 || v464.offset !== v454 || v464.stride !== v457) {
       v8.bindBuffer(34962, v451.buffer);
       v8.vertexAttribPointer(v463, v465, v458, v453, v457, v454);
       v464.type = v458;
       v464.size = v465;
       v464.buffer = v451;
       v464.normalized = v453;
       v464.offset = v454;
       v464.stride = v457;
      }
      if (v464.divisor !== v452) {
       v428.vertexAttribDivisorANGLE(v463, v452);
       v464.divisor = v452;
      }
     }
     else {
      if (v464.buffer) {
       v8.disableVertexAttribArray(v463);
       v464.buffer = null;
      }
      if (v464.x !== v460 || v464.y !== v461 || v464.z !== v462 || v464.w !== v459) {
       v8.vertexAttrib4f(v463, v460, v461, v462, v459);
       v464.x = v460;
       v464.y = v461;
       v464.z = v462;
       v464.w = v459;
      }
     }
     v466 = $29.call(this, v2, v430, v429);
     v50.offset = v466;
     v467 = false;
     v468 = null;
     v469 = 0;
     v470 = false;
     v471 = 0;
     v472 = 0;
     v473 = 1;
     v474 = 0;
     v475 = 5126;
     v476 = 0;
     v477 = 0;
     v478 = 0;
     v479 = 0;
     if (v9(v50)) {
      v467 = true;
      v468 = v1.createStream(34962, v50);
      v475 = v468.dtype;
     }
     else {
      v468 = v1.getBuffer(v50);
      if (v468) {
       v475 = v468.dtype;
      }
      else if ('constant' in v50) {
       v473 = 2;
       if (typeof v50.constant === 'number') {
        v477 = v50.constant;
        v478 = v479 = v476 = 0;
       }
       else {
        v477 = v50.constant.length > 0 ? v50.constant[0] : 0;
        v478 = v50.constant.length > 1 ? v50.constant[1] : 0;
        v479 = v50.constant.length > 2 ? v50.constant[2] : 0;
        v476 = v50.constant.length > 3 ? v50.constant[3] : 0;
       }
      }
      else {
       if (v9(v50.buffer)) {
        v468 = v1.createStream(34962, v50.buffer);
       }
       else {
        v468 = v1.getBuffer(v50.buffer);
       }
       v475 = 'type' in v50 ? v43[v50.type] : v468.dtype;
       v470 = !!v50.normalized;
       v472 = v50.size | 0;
       v471 = v50.offset | 0;
       v474 = v50.stride | 0;
       v469 = v50.divisor | 0;
      }
     }
     v480 = positionFract.location;
     v481 = v0[v480];
     if (v473 === 1) {
      if (!v481.buffer) {
       v8.enableVertexAttribArray(v480);
      }
      v482 = v472 || 2;
      if (v481.type !== v475 || v481.size !== v482 || v481.buffer !== v468 || v481.normalized !== v470 || v481.offset !== v471 || v481.stride !== v474) {
       v8.bindBuffer(34962, v468.buffer);
       v8.vertexAttribPointer(v480, v482, v475, v470, v474, v471);
       v481.type = v475;
       v481.size = v482;
       v481.buffer = v468;
       v481.normalized = v470;
       v481.offset = v471;
       v481.stride = v474;
      }
      if (v481.divisor !== v469) {
       v428.vertexAttribDivisorANGLE(v480, v469);
       v481.divisor = v469;
      }
     }
     else {
      if (v481.buffer) {
       v8.disableVertexAttribArray(v480);
       v481.buffer = null;
      }
      if (v481.x !== v477 || v481.y !== v478 || v481.z !== v479 || v481.w !== v476) {
       v8.vertexAttrib4f(v480, v477, v478, v479, v476);
       v481.x = v477;
       v481.y = v478;
       v481.z = v479;
       v481.w = v476;
      }
     }
     v483 = $30.call(this, v2, v430, v429);
     v48.offset = v483;
     v484 = false;
     v485 = null;
     v486 = 0;
     v487 = false;
     v488 = 0;
     v489 = 0;
     v490 = 1;
     v491 = 0;
     v492 = 5126;
     v493 = 0;
     v494 = 0;
     v495 = 0;
     v496 = 0;
     if (v9(v48)) {
      v484 = true;
      v485 = v1.createStream(34962, v48);
      v492 = v485.dtype;
     }
     else {
      v485 = v1.getBuffer(v48);
      if (v485) {
       v492 = v485.dtype;
      }
      else if ('constant' in v48) {
       v490 = 2;
       if (typeof v48.constant === 'number') {
        v494 = v48.constant;
        v495 = v496 = v493 = 0;
       }
       else {
        v494 = v48.constant.length > 0 ? v48.constant[0] : 0;
        v495 = v48.constant.length > 1 ? v48.constant[1] : 0;
        v496 = v48.constant.length > 2 ? v48.constant[2] : 0;
        v493 = v48.constant.length > 3 ? v48.constant[3] : 0;
       }
      }
      else {
       if (v9(v48.buffer)) {
        v485 = v1.createStream(34962, v48.buffer);
       }
       else {
        v485 = v1.getBuffer(v48.buffer);
       }
       v492 = 'type' in v48 ? v43[v48.type] : v485.dtype;
       v487 = !!v48.normalized;
       v489 = v48.size | 0;
       v488 = v48.offset | 0;
       v491 = v48.stride | 0;
       v486 = v48.divisor | 0;
      }
     }
     v497 = error.location;
     v498 = v0[v497];
     if (v490 === 1) {
      if (!v498.buffer) {
       v8.enableVertexAttribArray(v497);
      }
      v499 = v489 || 4;
      if (v498.type !== v492 || v498.size !== v499 || v498.buffer !== v485 || v498.normalized !== v487 || v498.offset !== v488 || v498.stride !== v491) {
       v8.bindBuffer(34962, v485.buffer);
       v8.vertexAttribPointer(v497, v499, v492, v487, v491, v488);
       v498.type = v492;
       v498.size = v499;
       v498.buffer = v485;
       v498.normalized = v487;
       v498.offset = v488;
       v498.stride = v491;
      }
      if (v498.divisor !== v486) {
       v428.vertexAttribDivisorANGLE(v497, v486);
       v498.divisor = v486;
      }
     }
     else {
      if (v498.buffer) {
       v8.disableVertexAttribArray(v497);
       v498.buffer = null;
      }
      if (v498.x !== v494 || v498.y !== v495 || v498.z !== v496 || v498.w !== v493) {
       v8.vertexAttrib4f(v497, v494, v495, v496, v493);
       v498.x = v494;
       v498.y = v495;
       v498.z = v496;
       v498.w = v493;
      }
     }
     v500 = $31.call(this, v2, v430, v429);
     v47.offset = v500;
     v501 = false;
     v502 = null;
     v503 = 0;
     v504 = false;
     v505 = 0;
     v506 = 0;
     v507 = 1;
     v508 = 0;
     v509 = 5126;
     v510 = 0;
     v511 = 0;
     v512 = 0;
     v513 = 0;
     if (v9(v47)) {
      v501 = true;
      v502 = v1.createStream(34962, v47);
      v509 = v502.dtype;
     }
     else {
      v502 = v1.getBuffer(v47);
      if (v502) {
       v509 = v502.dtype;
      }
      else if ('constant' in v47) {
       v507 = 2;
       if (typeof v47.constant === 'number') {
        v511 = v47.constant;
        v512 = v513 = v510 = 0;
       }
       else {
        v511 = v47.constant.length > 0 ? v47.constant[0] : 0;
        v512 = v47.constant.length > 1 ? v47.constant[1] : 0;
        v513 = v47.constant.length > 2 ? v47.constant[2] : 0;
        v510 = v47.constant.length > 3 ? v47.constant[3] : 0;
       }
      }
      else {
       if (v9(v47.buffer)) {
        v502 = v1.createStream(34962, v47.buffer);
       }
       else {
        v502 = v1.getBuffer(v47.buffer);
       }
       v509 = 'type' in v47 ? v43[v47.type] : v502.dtype;
       v504 = !!v47.normalized;
       v506 = v47.size | 0;
       v505 = v47.offset | 0;
       v508 = v47.stride | 0;
       v503 = v47.divisor | 0;
      }
     }
     v514 = color.location;
     v515 = v0[v514];
     if (v507 === 1) {
      if (!v515.buffer) {
       v8.enableVertexAttribArray(v514);
      }
      v516 = v506 || 4;
      if (v515.type !== v509 || v515.size !== v516 || v515.buffer !== v502 || v515.normalized !== v504 || v515.offset !== v505 || v515.stride !== v508) {
       v8.bindBuffer(34962, v502.buffer);
       v8.vertexAttribPointer(v514, v516, v509, v504, v508, v505);
       v515.type = v509;
       v515.size = v516;
       v515.buffer = v502;
       v515.normalized = v504;
       v515.offset = v505;
       v515.stride = v508;
      }
      if (v515.divisor !== v503) {
       v428.vertexAttribDivisorANGLE(v514, v503);
       v515.divisor = v503;
      }
     }
     else {
      if (v515.buffer) {
       v8.disableVertexAttribArray(v514);
       v515.buffer = null;
      }
      if (v515.x !== v511 || v515.y !== v512 || v515.z !== v513 || v515.w !== v510) {
       v8.vertexAttrib4f(v514, v511, v512, v513, v510);
       v515.x = v511;
       v515.y = v512;
       v515.z = v513;
       v515.w = v510;
      }
     }
     v517 = $32.call(this, v2, v430, v429);
     v518 = v517[0];
     v520 = v517[1];
     v522 = v517[2];
     v524 = v517[3];
     if (!v429 || v519 !== v518 || v521 !== v520 || v523 !== v522 || v525 !== v524) {
      v519 = v518;
      v521 = v520;
      v523 = v522;
      v525 = v524;
      v8.uniform4f(viewport.location, v518, v520, v522, v524);
     }
     v526 = v430['lineWidth'];
     if (!v429 || v527 !== v526) {
      v527 = v526;
      v8.uniform1f(lineWidth.location, v526);
     }
     v528 = v430['capSize'];
     if (!v429 || v529 !== v528) {
      v529 = v528;
      v8.uniform1f(capSize.location, v528);
     }
     v530 = v430['scale'];
     v531 = v530[0];
     v533 = v530[1];
     if (!v429 || v532 !== v531 || v534 !== v533) {
      v532 = v531;
      v534 = v533;
      v8.uniform2f(scale.location, v531, v533);
     }
     v535 = v430['scaleFract'];
     v536 = v535[0];
     v538 = v535[1];
     if (!v429 || v537 !== v536 || v539 !== v538) {
      v537 = v536;
      v539 = v538;
      v8.uniform2f(scaleFract.location, v536, v538);
     }
     v540 = v430['translate'];
     v541 = v540[0];
     v543 = v540[1];
     if (!v429 || v542 !== v541 || v544 !== v543) {
      v542 = v541;
      v544 = v543;
      v8.uniform2f(translate.location, v541, v543);
     }
     v545 = v430['translateFract'];
     v546 = v545[0];
     v548 = v545[1];
     if (!v429 || v547 !== v546 || v549 !== v548) {
      v547 = v546;
      v549 = v548;
      v8.uniform2f(translateFract.location, v546, v548);
     }
     v550 = v430['opacity'];
     if (!v429 || v551 !== v550) {
      v551 = v550;
      v8.uniform1f(opacity.location, v550);
     }
     v554 = v430['count'];
     if (v554 > 0) {
      if (v552) {
       v428.drawElementsInstancedANGLE(4, 36, v552.type, v553 << ((v552.type - 5121) >> 1), v554);
      }
      else {
       v428.drawArraysInstancedANGLE(4, v553, 36, v554);
      }
     }
     else if (v554 < 0) {
      if (v552) {
       v8.drawElements(4, 36, v552.type, v553 << ((v552.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(4, v553, 36);
      }
     }
     v2.viewportWidth = v436;
     v2.viewportHeight = v437;
     if (v450) {
      v1.destroyStream(v451);
     }
     if (v467) {
      v1.destroyStream(v468);
     }
     if (v484) {
      v1.destroyStream(v485);
     }
     if (v501) {
      v1.destroyStream(v502);
     }
    }
    v3.dirty = true;
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v51, v52, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153, v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177, v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195;
    v51 = v6.angle_instanced_arrays;
    v52 = v7.next;
    if (v52 !== v7.cur) {
     if (v52) {
      v8.bindFramebuffer(36160, v52.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v52;
    }
    if (v3.dirty) {
     var v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84, v85;
     v53 = v10.dither;
     if (v53 !== v3.dither) {
      if (v53) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v53;
     }
     v54 = v10.depth_func;
     if (v54 !== v3.depth_func) {
      v8.depthFunc(v54);
      v3.depth_func = v54;
     }
     v55 = v24[0];
     v56 = v24[1];
     if (v55 !== v25[0] || v56 !== v25[1]) {
      v8.depthRange(v55, v56);
      v25[0] = v55;
      v25[1] = v56;
     }
     v57 = v10.depth_mask;
     if (v57 !== v3.depth_mask) {
      v8.depthMask(v57);
      v3.depth_mask = v57;
     }
     v58 = v22[0];
     v59 = v22[1];
     v60 = v22[2];
     v61 = v22[3];
     if (v58 !== v23[0] || v59 !== v23[1] || v60 !== v23[2] || v61 !== v23[3]) {
      v8.colorMask(v58, v59, v60, v61);
      v23[0] = v58;
      v23[1] = v59;
      v23[2] = v60;
      v23[3] = v61;
     }
     v62 = v10.cull_enable;
     if (v62 !== v3.cull_enable) {
      if (v62) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v62;
     }
     v63 = v10.cull_face;
     if (v63 !== v3.cull_face) {
      v8.cullFace(v63);
      v3.cull_face = v63;
     }
     v64 = v10.frontFace;
     if (v64 !== v3.frontFace) {
      v8.frontFace(v64);
      v3.frontFace = v64;
     }
     v65 = v10.lineWidth;
     if (v65 !== v3.lineWidth) {
      v8.lineWidth(v65);
      v3.lineWidth = v65;
     }
     v66 = v10.polygonOffset_enable;
     if (v66 !== v3.polygonOffset_enable) {
      if (v66) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v66;
     }
     v67 = v26[0];
     v68 = v26[1];
     if (v67 !== v27[0] || v68 !== v27[1]) {
      v8.polygonOffset(v67, v68);
      v27[0] = v67;
      v27[1] = v68;
     }
     v69 = v10.sample_alpha;
     if (v69 !== v3.sample_alpha) {
      if (v69) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v69;
     }
     v70 = v10.sample_enable;
     if (v70 !== v3.sample_enable) {
      if (v70) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v70;
     }
     v71 = v28[0];
     v72 = v28[1];
     if (v71 !== v29[0] || v72 !== v29[1]) {
      v8.sampleCoverage(v71, v72);
      v29[0] = v71;
      v29[1] = v72;
     }
     v73 = v10.stencil_enable;
     if (v73 !== v3.stencil_enable) {
      if (v73) {
       v8.enable(2960);
      }
      else {
       v8.disable(2960);
      }
      v3.stencil_enable = v73;
     }
     v74 = v10.stencil_mask;
     if (v74 !== v3.stencil_mask) {
      v8.stencilMask(v74);
      v3.stencil_mask = v74;
     }
     v75 = v32[0];
     v76 = v32[1];
     v77 = v32[2];
     if (v75 !== v33[0] || v76 !== v33[1] || v77 !== v33[2]) {
      v8.stencilFunc(v75, v76, v77);
      v33[0] = v75;
      v33[1] = v76;
      v33[2] = v77;
     }
     v78 = v36[0];
     v79 = v36[1];
     v80 = v36[2];
     v81 = v36[3];
     if (v78 !== v37[0] || v79 !== v37[1] || v80 !== v37[2] || v81 !== v37[3]) {
      v8.stencilOpSeparate(v78, v79, v80, v81);
      v37[0] = v78;
      v37[1] = v79;
      v37[2] = v80;
      v37[3] = v81;
     }
     v82 = v34[0];
     v83 = v34[1];
     v84 = v34[2];
     v85 = v34[3];
     if (v82 !== v35[0] || v83 !== v35[1] || v84 !== v35[2] || v85 !== v35[3]) {
      v8.stencilOpSeparate(v82, v83, v84, v85);
      v35[0] = v82;
      v35[1] = v83;
      v35[2] = v84;
      v35[3] = v85;
     }
    }
    v86 = a0['viewport'];
    v87 = v86.x | 0;
    v88 = v86.y | 0;
    v89 = 'width' in v86 ? v86.width | 0 : (v2.framebufferWidth - v87);
    v90 = 'height' in v86 ? v86.height | 0 : (v2.framebufferHeight - v88);
    v91 = v2.viewportWidth;
    v2.viewportWidth = v89;
    v92 = v2.viewportHeight;
    v2.viewportHeight = v90;
    v8.viewport(v87, v88, v89, v90);
    v39[0] = v87;
    v39[1] = v88;
    v39[2] = v89;
    v39[3] = v90;
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v93 = a0['viewport'];
    v94 = v93.x | 0;
    v95 = v93.y | 0;
    v96 = 'width' in v93 ? v93.width | 0 : (v2.framebufferWidth - v94);
    v97 = 'height' in v93 ? v93.height | 0 : (v2.framebufferHeight - v95);
    v8.scissor(v94, v95, v96, v97);
    v31[0] = v94;
    v31[1] = v95;
    v31[2] = v96;
    v31[3] = v97;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.useProgram($6.program);
    v98 = v6.angle_instanced_arrays;
    v15.setVAO(null);
    v99 = $7.call(this, v2, a0, 0);
    v49.offset = v99;
    v100 = false;
    v101 = null;
    v102 = 0;
    v103 = false;
    v104 = 0;
    v105 = 0;
    v106 = 1;
    v107 = 0;
    v108 = 5126;
    v109 = 0;
    v110 = 0;
    v111 = 0;
    v112 = 0;
    if (v9(v49)) {
     v100 = true;
     v101 = v1.createStream(34962, v49);
     v108 = v101.dtype;
    }
    else {
     v101 = v1.getBuffer(v49);
     if (v101) {
      v108 = v101.dtype;
     }
     else if ('constant' in v49) {
      v106 = 2;
      if (typeof v49.constant === 'number') {
       v110 = v49.constant;
       v111 = v112 = v109 = 0;
      }
      else {
       v110 = v49.constant.length > 0 ? v49.constant[0] : 0;
       v111 = v49.constant.length > 1 ? v49.constant[1] : 0;
       v112 = v49.constant.length > 2 ? v49.constant[2] : 0;
       v109 = v49.constant.length > 3 ? v49.constant[3] : 0;
      }
     }
     else {
      if (v9(v49.buffer)) {
       v101 = v1.createStream(34962, v49.buffer);
      }
      else {
       v101 = v1.getBuffer(v49.buffer);
      }
      v108 = 'type' in v49 ? v43[v49.type] : v101.dtype;
      v103 = !!v49.normalized;
      v105 = v49.size | 0;
      v104 = v49.offset | 0;
      v107 = v49.stride | 0;
      v102 = v49.divisor | 0;
     }
    }
    v113 = position.location;
    v114 = v0[v113];
    if (v106 === 1) {
     if (!v114.buffer) {
      v8.enableVertexAttribArray(v113);
     }
     v115 = v105 || 2;
     if (v114.type !== v108 || v114.size !== v115 || v114.buffer !== v101 || v114.normalized !== v103 || v114.offset !== v104 || v114.stride !== v107) {
      v8.bindBuffer(34962, v101.buffer);
      v8.vertexAttribPointer(v113, v115, v108, v103, v107, v104);
      v114.type = v108;
      v114.size = v115;
      v114.buffer = v101;
      v114.normalized = v103;
      v114.offset = v104;
      v114.stride = v107;
     }
     if (v114.divisor !== v102) {
      v98.vertexAttribDivisorANGLE(v113, v102);
      v114.divisor = v102;
     }
    }
    else {
     if (v114.buffer) {
      v8.disableVertexAttribArray(v113);
      v114.buffer = null;
     }
     if (v114.x !== v110 || v114.y !== v111 || v114.z !== v112 || v114.w !== v109) {
      v8.vertexAttrib4f(v113, v110, v111, v112, v109);
      v114.x = v110;
      v114.y = v111;
      v114.z = v112;
      v114.w = v109;
     }
    }
    v116 = $8.call(this, v2, a0, 0);
    v50.offset = v116;
    v117 = false;
    v118 = null;
    v119 = 0;
    v120 = false;
    v121 = 0;
    v122 = 0;
    v123 = 1;
    v124 = 0;
    v125 = 5126;
    v126 = 0;
    v127 = 0;
    v128 = 0;
    v129 = 0;
    if (v9(v50)) {
     v117 = true;
     v118 = v1.createStream(34962, v50);
     v125 = v118.dtype;
    }
    else {
     v118 = v1.getBuffer(v50);
     if (v118) {
      v125 = v118.dtype;
     }
     else if ('constant' in v50) {
      v123 = 2;
      if (typeof v50.constant === 'number') {
       v127 = v50.constant;
       v128 = v129 = v126 = 0;
      }
      else {
       v127 = v50.constant.length > 0 ? v50.constant[0] : 0;
       v128 = v50.constant.length > 1 ? v50.constant[1] : 0;
       v129 = v50.constant.length > 2 ? v50.constant[2] : 0;
       v126 = v50.constant.length > 3 ? v50.constant[3] : 0;
      }
     }
     else {
      if (v9(v50.buffer)) {
       v118 = v1.createStream(34962, v50.buffer);
      }
      else {
       v118 = v1.getBuffer(v50.buffer);
      }
      v125 = 'type' in v50 ? v43[v50.type] : v118.dtype;
      v120 = !!v50.normalized;
      v122 = v50.size | 0;
      v121 = v50.offset | 0;
      v124 = v50.stride | 0;
      v119 = v50.divisor | 0;
     }
    }
    v130 = positionFract.location;
    v131 = v0[v130];
    if (v123 === 1) {
     if (!v131.buffer) {
      v8.enableVertexAttribArray(v130);
     }
     v132 = v122 || 2;
     if (v131.type !== v125 || v131.size !== v132 || v131.buffer !== v118 || v131.normalized !== v120 || v131.offset !== v121 || v131.stride !== v124) {
      v8.bindBuffer(34962, v118.buffer);
      v8.vertexAttribPointer(v130, v132, v125, v120, v124, v121);
      v131.type = v125;
      v131.size = v132;
      v131.buffer = v118;
      v131.normalized = v120;
      v131.offset = v121;
      v131.stride = v124;
     }
     if (v131.divisor !== v119) {
      v98.vertexAttribDivisorANGLE(v130, v119);
      v131.divisor = v119;
     }
    }
    else {
     if (v131.buffer) {
      v8.disableVertexAttribArray(v130);
      v131.buffer = null;
     }
     if (v131.x !== v127 || v131.y !== v128 || v131.z !== v129 || v131.w !== v126) {
      v8.vertexAttrib4f(v130, v127, v128, v129, v126);
      v131.x = v127;
      v131.y = v128;
      v131.z = v129;
      v131.w = v126;
     }
    }
    v133 = $9.call(this, v2, a0, 0);
    v48.offset = v133;
    v134 = false;
    v135 = null;
    v136 = 0;
    v137 = false;
    v138 = 0;
    v139 = 0;
    v140 = 1;
    v141 = 0;
    v142 = 5126;
    v143 = 0;
    v144 = 0;
    v145 = 0;
    v146 = 0;
    if (v9(v48)) {
     v134 = true;
     v135 = v1.createStream(34962, v48);
     v142 = v135.dtype;
    }
    else {
     v135 = v1.getBuffer(v48);
     if (v135) {
      v142 = v135.dtype;
     }
     else if ('constant' in v48) {
      v140 = 2;
      if (typeof v48.constant === 'number') {
       v144 = v48.constant;
       v145 = v146 = v143 = 0;
      }
      else {
       v144 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v145 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v146 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v143 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v135 = v1.createStream(34962, v48.buffer);
      }
      else {
       v135 = v1.getBuffer(v48.buffer);
      }
      v142 = 'type' in v48 ? v43[v48.type] : v135.dtype;
      v137 = !!v48.normalized;
      v139 = v48.size | 0;
      v138 = v48.offset | 0;
      v141 = v48.stride | 0;
      v136 = v48.divisor | 0;
     }
    }
    v147 = error.location;
    v148 = v0[v147];
    if (v140 === 1) {
     if (!v148.buffer) {
      v8.enableVertexAttribArray(v147);
     }
     v149 = v139 || 4;
     if (v148.type !== v142 || v148.size !== v149 || v148.buffer !== v135 || v148.normalized !== v137 || v148.offset !== v138 || v148.stride !== v141) {
      v8.bindBuffer(34962, v135.buffer);
      v8.vertexAttribPointer(v147, v149, v142, v137, v141, v138);
      v148.type = v142;
      v148.size = v149;
      v148.buffer = v135;
      v148.normalized = v137;
      v148.offset = v138;
      v148.stride = v141;
     }
     if (v148.divisor !== v136) {
      v98.vertexAttribDivisorANGLE(v147, v136);
      v148.divisor = v136;
     }
    }
    else {
     if (v148.buffer) {
      v8.disableVertexAttribArray(v147);
      v148.buffer = null;
     }
     if (v148.x !== v144 || v148.y !== v145 || v148.z !== v146 || v148.w !== v143) {
      v8.vertexAttrib4f(v147, v144, v145, v146, v143);
      v148.x = v144;
      v148.y = v145;
      v148.z = v146;
      v148.w = v143;
     }
    }
    v150 = $10.call(this, v2, a0, 0);
    v47.offset = v150;
    v151 = false;
    v152 = null;
    v153 = 0;
    v154 = false;
    v155 = 0;
    v156 = 0;
    v157 = 1;
    v158 = 0;
    v159 = 5126;
    v160 = 0;
    v161 = 0;
    v162 = 0;
    v163 = 0;
    if (v9(v47)) {
     v151 = true;
     v152 = v1.createStream(34962, v47);
     v159 = v152.dtype;
    }
    else {
     v152 = v1.getBuffer(v47);
     if (v152) {
      v159 = v152.dtype;
     }
     else if ('constant' in v47) {
      v157 = 2;
      if (typeof v47.constant === 'number') {
       v161 = v47.constant;
       v162 = v163 = v160 = 0;
      }
      else {
       v161 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v162 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v163 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v160 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v152 = v1.createStream(34962, v47.buffer);
      }
      else {
       v152 = v1.getBuffer(v47.buffer);
      }
      v159 = 'type' in v47 ? v43[v47.type] : v152.dtype;
      v154 = !!v47.normalized;
      v156 = v47.size | 0;
      v155 = v47.offset | 0;
      v158 = v47.stride | 0;
      v153 = v47.divisor | 0;
     }
    }
    v164 = color.location;
    v165 = v0[v164];
    if (v157 === 1) {
     if (!v165.buffer) {
      v8.enableVertexAttribArray(v164);
     }
     v166 = v156 || 4;
     if (v165.type !== v159 || v165.size !== v166 || v165.buffer !== v152 || v165.normalized !== v154 || v165.offset !== v155 || v165.stride !== v158) {
      v8.bindBuffer(34962, v152.buffer);
      v8.vertexAttribPointer(v164, v166, v159, v154, v158, v155);
      v165.type = v159;
      v165.size = v166;
      v165.buffer = v152;
      v165.normalized = v154;
      v165.offset = v155;
      v165.stride = v158;
     }
     if (v165.divisor !== v153) {
      v98.vertexAttribDivisorANGLE(v164, v153);
      v165.divisor = v153;
     }
    }
    else {
     if (v165.buffer) {
      v8.disableVertexAttribArray(v164);
      v165.buffer = null;
     }
     if (v165.x !== v161 || v165.y !== v162 || v165.z !== v163 || v165.w !== v160) {
      v8.vertexAttrib4f(v164, v161, v162, v163, v160);
      v165.x = v161;
      v165.y = v162;
      v165.z = v163;
      v165.w = v160;
     }
    }
    v167 = direction.location;
    v168 = v0[v167];
    if (!v168.buffer) {
     v8.enableVertexAttribArray(v167);
    }
    if (v168.type !== 5126 || v168.size !== 2 || v168.buffer !== $11 || v168.normalized !== false || v168.offset !== 0 || v168.stride !== 24) {
     v8.bindBuffer(34962, $11.buffer);
     v8.vertexAttribPointer(v167, 2, 5126, false, 24, 0);
     v168.type = 5126;
     v168.size = 2;
     v168.buffer = $11;
     v168.normalized = false;
     v168.offset = 0;
     v168.stride = 24;
    }
    if (v168.divisor !== 0) {
     v98.vertexAttribDivisorANGLE(v167, 0);
     v168.divisor = 0;
    }
    v169 = lineOffset.location;
    v170 = v0[v169];
    if (!v170.buffer) {
     v8.enableVertexAttribArray(v169);
    }
    if (v170.type !== 5126 || v170.size !== 2 || v170.buffer !== $12 || v170.normalized !== false || v170.offset !== 8 || v170.stride !== 24) {
     v8.bindBuffer(34962, $12.buffer);
     v8.vertexAttribPointer(v169, 2, 5126, false, 24, 8);
     v170.type = 5126;
     v170.size = 2;
     v170.buffer = $12;
     v170.normalized = false;
     v170.offset = 8;
     v170.stride = 24;
    }
    if (v170.divisor !== 0) {
     v98.vertexAttribDivisorANGLE(v169, 0);
     v170.divisor = 0;
    }
    v171 = capOffset.location;
    v172 = v0[v171];
    if (!v172.buffer) {
     v8.enableVertexAttribArray(v171);
    }
    if (v172.type !== 5126 || v172.size !== 2 || v172.buffer !== $13 || v172.normalized !== false || v172.offset !== 16 || v172.stride !== 24) {
     v8.bindBuffer(34962, $13.buffer);
     v8.vertexAttribPointer(v171, 2, 5126, false, 24, 16);
     v172.type = 5126;
     v172.size = 2;
     v172.buffer = $13;
     v172.normalized = false;
     v172.offset = 16;
     v172.stride = 24;
    }
    if (v172.divisor !== 0) {
     v98.vertexAttribDivisorANGLE(v171, 0);
     v172.divisor = 0;
    }
    v173 = $14.call(this, v2, a0, 0);
    v174 = v173[0];
    v175 = v173[1];
    v176 = v173[2];
    v177 = v173[3];
    v8.uniform4f(viewport.location, v174, v175, v176, v177);
    v178 = a0['lineWidth'];
    v8.uniform1f(lineWidth.location, v178);
    v179 = a0['capSize'];
    v8.uniform1f(capSize.location, v179);
    v180 = a0['scale'];
    v181 = v180[0];
    v182 = v180[1];
    v8.uniform2f(scale.location, v181, v182);
    v183 = a0['scaleFract'];
    v184 = v183[0];
    v185 = v183[1];
    v8.uniform2f(scaleFract.location, v184, v185);
    v186 = a0['translate'];
    v187 = v186[0];
    v188 = v186[1];
    v8.uniform2f(translate.location, v187, v188);
    v189 = a0['translateFract'];
    v190 = v189[0];
    v191 = v189[1];
    v8.uniform2f(translateFract.location, v190, v191);
    v192 = a0['opacity'];
    v8.uniform1f(opacity.location, v192);
    v193 = v4.elements;
    if (v193) {
     v8.bindBuffer(34963, v193.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v193 = v5.getElements(v15.currentVAO.elements);
     if (v193) v8.bindBuffer(34963, v193.buffer.buffer);
    }
    v194 = v4.offset;
    v195 = a0['count'];
    if (v195 > 0) {
     if (v193) {
      v98.drawElementsInstancedANGLE(4, 36, v193.type, v194 << ((v193.type - 5121) >> 1), v195);
     }
     else {
      v98.drawArraysInstancedANGLE(4, v194, 36, v195);
     }
    }
    else if (v195 < 0) {
     if (v193) {
      v8.drawElements(4, 36, v193.type, v194 << ((v193.type - 5121) >> 1));
     }
     else {
      v8.drawArrays(4, v194, 36);
     }
    }
    v3.dirty = true;
    v15.setVAO(null);
    v2.viewportWidth = v91;
    v2.viewportHeight = v92;
    if (v100) {
     v1.destroyStream(v101);
    }
    if (v117) {
     v1.destroyStream(v118);
    }
    if (v134) {
     v1.destroyStream(v135);
    }
    if (v151) {
     v1.destroyStream(v152);
    }
   }
   , 'scope': function (a0, a1, a2) {
    var v196, v197, v198, v199, v200, v201, v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213, v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225, v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267, v268, v269, v270, v271, v272, v273, v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301, v302, v303, v304, v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360, v361, v362, v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387, v388, v389, v390, v391, v392;
    v196 = a0['viewport'];
    v197 = v196.x | 0;
    v198 = v196.y | 0;
    v199 = 'width' in v196 ? v196.width | 0 : (v2.framebufferWidth - v197);
    v200 = 'height' in v196 ? v196.height | 0 : (v2.framebufferHeight - v198);
    v201 = v2.viewportWidth;
    v2.viewportWidth = v199;
    v202 = v2.viewportHeight;
    v2.viewportHeight = v200;
    v203 = v38[0];
    v38[0] = v197;
    v204 = v38[1];
    v38[1] = v198;
    v205 = v38[2];
    v38[2] = v199;
    v206 = v38[3];
    v38[3] = v200;
    v207 = v16[0];
    v16[0] = 0;
    v208 = v16[1];
    v16[1] = 0;
    v209 = v16[2];
    v16[2] = 0;
    v210 = v16[3];
    v16[3] = 0;
    v211 = v10.blend_enable;
    v10.blend_enable = true;
    v212 = v18[0];
    v18[0] = 32774;
    v213 = v18[1];
    v18[1] = 32774;
    v214 = v20[0];
    v20[0] = 770;
    v215 = v20[1];
    v20[1] = 771;
    v216 = v20[2];
    v20[2] = 773;
    v217 = v20[3];
    v20[3] = 1;
    v218 = v10.depth_enable;
    v10.depth_enable = false;
    v219 = a0['viewport'];
    v220 = v219.x | 0;
    v221 = v219.y | 0;
    v222 = 'width' in v219 ? v219.width | 0 : (v2.framebufferWidth - v220);
    v223 = 'height' in v219 ? v219.height | 0 : (v2.framebufferHeight - v221);
    v224 = v30[0];
    v30[0] = v220;
    v225 = v30[1];
    v30[1] = v221;
    v226 = v30[2];
    v30[2] = v222;
    v227 = v30[3];
    v30[3] = v223;
    v228 = v10.scissor_enable;
    v10.scissor_enable = true;
    v229 = v4.count;
    v4.count = 36;
    v230 = a0['count'];
    v231 = v4.instances;
    v4.instances = v230;
    v232 = v4.primitive;
    v4.primitive = 4;
    v233 = a0['capSize'];
    v234 = v14[5];
    v14[5] = v233;
    v235 = a0['lineWidth'];
    v236 = v14[4];
    v14[4] = v235;
    v237 = a0['opacity'];
    v238 = v14[10];
    v14[10] = v237;
    v239 = a0['range'];
    v240 = v14[18];
    v14[18] = v239;
    v241 = a0['scale'];
    v242 = v14[6];
    v14[6] = v241;
    v243 = a0['scaleFract'];
    v244 = v14[7];
    v14[7] = v243;
    v245 = a0['translate'];
    v246 = v14[8];
    v14[8] = v245;
    v247 = a0['translateFract'];
    v248 = v14[9];
    v14[9] = v247;
    v249 = $15.call(this, v2, a0, a2);
    v250 = v14[3];
    v14[3] = v249;
    v251 = $16.buffer;
    $16.buffer = $13;
    v252 = $16.divisor;
    $16.divisor = 0;
    v253 = $16.normalized;
    $16.normalized = false;
    v254 = $16.offset;
    $16.offset = 16;
    v255 = $16.size;
    $16.size = 0;
    v256 = $16.state;
    $16.state = 1;
    v257 = $16.stride;
    $16.stride = 24;
    v258 = $16.type;
    $16.type = 5126;
    v259 = $16.w;
    $16.w = 0;
    v260 = $16.x;
    $16.x = 0;
    v261 = $16.y;
    $16.y = 0;
    v262 = $16.z;
    $16.z = 0;
    v263 = $17.call(this, v2, a0, a2);
    v47.offset = v263;
    v264 = false;
    v265 = null;
    v266 = 0;
    v267 = false;
    v268 = 0;
    v269 = 0;
    v270 = 1;
    v271 = 0;
    v272 = 5126;
    v273 = 0;
    v274 = 0;
    v275 = 0;
    v276 = 0;
    if (v9(v47)) {
     v264 = true;
     v265 = v1.createStream(34962, v47);
     v272 = v265.dtype;
    }
    else {
     v265 = v1.getBuffer(v47);
     if (v265) {
      v272 = v265.dtype;
     }
     else if ('constant' in v47) {
      v270 = 2;
      if (typeof v47.constant === 'number') {
       v274 = v47.constant;
       v275 = v276 = v273 = 0;
      }
      else {
       v274 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v275 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v276 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v273 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v265 = v1.createStream(34962, v47.buffer);
      }
      else {
       v265 = v1.getBuffer(v47.buffer);
      }
      v272 = 'type' in v47 ? v43[v47.type] : v265.dtype;
      v267 = !!v47.normalized;
      v269 = v47.size | 0;
      v268 = v47.offset | 0;
      v271 = v47.stride | 0;
      v266 = v47.divisor | 0;
     }
    }
    v277 = $18.buffer;
    $18.buffer = v265;
    v278 = $18.divisor;
    $18.divisor = v266;
    v279 = $18.normalized;
    $18.normalized = v267;
    v280 = $18.offset;
    $18.offset = v268;
    v281 = $18.size;
    $18.size = v269;
    v282 = $18.state;
    $18.state = v270;
    v283 = $18.stride;
    $18.stride = v271;
    v284 = $18.type;
    $18.type = v272;
    v285 = $18.w;
    $18.w = v273;
    v286 = $18.x;
    $18.x = v274;
    v287 = $18.y;
    $18.y = v275;
    v288 = $18.z;
    $18.z = v276;
    v289 = $19.buffer;
    $19.buffer = $11;
    v290 = $19.divisor;
    $19.divisor = 0;
    v291 = $19.normalized;
    $19.normalized = false;
    v292 = $19.offset;
    $19.offset = 0;
    v293 = $19.size;
    $19.size = 0;
    v294 = $19.state;
    $19.state = 1;
    v295 = $19.stride;
    $19.stride = 24;
    v296 = $19.type;
    $19.type = 5126;
    v297 = $19.w;
    $19.w = 0;
    v298 = $19.x;
    $19.x = 0;
    v299 = $19.y;
    $19.y = 0;
    v300 = $19.z;
    $19.z = 0;
    v301 = $20.call(this, v2, a0, a2);
    v48.offset = v301;
    v302 = false;
    v303 = null;
    v304 = 0;
    v305 = false;
    v306 = 0;
    v307 = 0;
    v308 = 1;
    v309 = 0;
    v310 = 5126;
    v311 = 0;
    v312 = 0;
    v313 = 0;
    v314 = 0;
    if (v9(v48)) {
     v302 = true;
     v303 = v1.createStream(34962, v48);
     v310 = v303.dtype;
    }
    else {
     v303 = v1.getBuffer(v48);
     if (v303) {
      v310 = v303.dtype;
     }
     else if ('constant' in v48) {
      v308 = 2;
      if (typeof v48.constant === 'number') {
       v312 = v48.constant;
       v313 = v314 = v311 = 0;
      }
      else {
       v312 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v313 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v314 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v311 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v303 = v1.createStream(34962, v48.buffer);
      }
      else {
       v303 = v1.getBuffer(v48.buffer);
      }
      v310 = 'type' in v48 ? v43[v48.type] : v303.dtype;
      v305 = !!v48.normalized;
      v307 = v48.size | 0;
      v306 = v48.offset | 0;
      v309 = v48.stride | 0;
      v304 = v48.divisor | 0;
     }
    }
    v315 = $21.buffer;
    $21.buffer = v303;
    v316 = $21.divisor;
    $21.divisor = v304;
    v317 = $21.normalized;
    $21.normalized = v305;
    v318 = $21.offset;
    $21.offset = v306;
    v319 = $21.size;
    $21.size = v307;
    v320 = $21.state;
    $21.state = v308;
    v321 = $21.stride;
    $21.stride = v309;
    v322 = $21.type;
    $21.type = v310;
    v323 = $21.w;
    $21.w = v311;
    v324 = $21.x;
    $21.x = v312;
    v325 = $21.y;
    $21.y = v313;
    v326 = $21.z;
    $21.z = v314;
    v327 = $22.buffer;
    $22.buffer = $12;
    v328 = $22.divisor;
    $22.divisor = 0;
    v329 = $22.normalized;
    $22.normalized = false;
    v330 = $22.offset;
    $22.offset = 8;
    v331 = $22.size;
    $22.size = 0;
    v332 = $22.state;
    $22.state = 1;
    v333 = $22.stride;
    $22.stride = 24;
    v334 = $22.type;
    $22.type = 5126;
    v335 = $22.w;
    $22.w = 0;
    v336 = $22.x;
    $22.x = 0;
    v337 = $22.y;
    $22.y = 0;
    v338 = $22.z;
    $22.z = 0;
    v339 = $23.call(this, v2, a0, a2);
    v49.offset = v339;
    v340 = false;
    v341 = null;
    v342 = 0;
    v343 = false;
    v344 = 0;
    v345 = 0;
    v346 = 1;
    v347 = 0;
    v348 = 5126;
    v349 = 0;
    v350 = 0;
    v351 = 0;
    v352 = 0;
    if (v9(v49)) {
     v340 = true;
     v341 = v1.createStream(34962, v49);
     v348 = v341.dtype;
    }
    else {
     v341 = v1.getBuffer(v49);
     if (v341) {
      v348 = v341.dtype;
     }
     else if ('constant' in v49) {
      v346 = 2;
      if (typeof v49.constant === 'number') {
       v350 = v49.constant;
       v351 = v352 = v349 = 0;
      }
      else {
       v350 = v49.constant.length > 0 ? v49.constant[0] : 0;
       v351 = v49.constant.length > 1 ? v49.constant[1] : 0;
       v352 = v49.constant.length > 2 ? v49.constant[2] : 0;
       v349 = v49.constant.length > 3 ? v49.constant[3] : 0;
      }
     }
     else {
      if (v9(v49.buffer)) {
       v341 = v1.createStream(34962, v49.buffer);
      }
      else {
       v341 = v1.getBuffer(v49.buffer);
      }
      v348 = 'type' in v49 ? v43[v49.type] : v341.dtype;
      v343 = !!v49.normalized;
      v345 = v49.size | 0;
      v344 = v49.offset | 0;
      v347 = v49.stride | 0;
      v342 = v49.divisor | 0;
     }
    }
    v353 = $24.buffer;
    $24.buffer = v341;
    v354 = $24.divisor;
    $24.divisor = v342;
    v355 = $24.normalized;
    $24.normalized = v343;
    v356 = $24.offset;
    $24.offset = v344;
    v357 = $24.size;
    $24.size = v345;
    v358 = $24.state;
    $24.state = v346;
    v359 = $24.stride;
    $24.stride = v347;
    v360 = $24.type;
    $24.type = v348;
    v361 = $24.w;
    $24.w = v349;
    v362 = $24.x;
    $24.x = v350;
    v363 = $24.y;
    $24.y = v351;
    v364 = $24.z;
    $24.z = v352;
    v365 = $25.call(this, v2, a0, a2);
    v50.offset = v365;
    v366 = false;
    v367 = null;
    v368 = 0;
    v369 = false;
    v370 = 0;
    v371 = 0;
    v372 = 1;
    v373 = 0;
    v374 = 5126;
    v375 = 0;
    v376 = 0;
    v377 = 0;
    v378 = 0;
    if (v9(v50)) {
     v366 = true;
     v367 = v1.createStream(34962, v50);
     v374 = v367.dtype;
    }
    else {
     v367 = v1.getBuffer(v50);
     if (v367) {
      v374 = v367.dtype;
     }
     else if ('constant' in v50) {
      v372 = 2;
      if (typeof v50.constant === 'number') {
       v376 = v50.constant;
       v377 = v378 = v375 = 0;
      }
      else {
       v376 = v50.constant.length > 0 ? v50.constant[0] : 0;
       v377 = v50.constant.length > 1 ? v50.constant[1] : 0;
       v378 = v50.constant.length > 2 ? v50.constant[2] : 0;
       v375 = v50.constant.length > 3 ? v50.constant[3] : 0;
      }
     }
     else {
      if (v9(v50.buffer)) {
       v367 = v1.createStream(34962, v50.buffer);
      }
      else {
       v367 = v1.getBuffer(v50.buffer);
      }
      v374 = 'type' in v50 ? v43[v50.type] : v367.dtype;
      v369 = !!v50.normalized;
      v371 = v50.size | 0;
      v370 = v50.offset | 0;
      v373 = v50.stride | 0;
      v368 = v50.divisor | 0;
     }
    }
    v379 = $26.buffer;
    $26.buffer = v367;
    v380 = $26.divisor;
    $26.divisor = v368;
    v381 = $26.normalized;
    $26.normalized = v369;
    v382 = $26.offset;
    $26.offset = v370;
    v383 = $26.size;
    $26.size = v371;
    v384 = $26.state;
    $26.state = v372;
    v385 = $26.stride;
    $26.stride = v373;
    v386 = $26.type;
    $26.type = v374;
    v387 = $26.w;
    $26.w = v375;
    v388 = $26.x;
    $26.x = v376;
    v389 = $26.y;
    $26.y = v377;
    v390 = $26.z;
    $26.z = v378;
    v391 = v11.vert;
    v11.vert = 2;
    v392 = v11.frag;
    v11.frag = 1;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v201;
    v2.viewportHeight = v202;
    v38[0] = v203;
    v38[1] = v204;
    v38[2] = v205;
    v38[3] = v206;
    v16[0] = v207;
    v16[1] = v208;
    v16[2] = v209;
    v16[3] = v210;
    v10.blend_enable = v211;
    v18[0] = v212;
    v18[1] = v213;
    v20[0] = v214;
    v20[1] = v215;
    v20[2] = v216;
    v20[3] = v217;
    v10.depth_enable = v218;
    v30[0] = v224;
    v30[1] = v225;
    v30[2] = v226;
    v30[3] = v227;
    v10.scissor_enable = v228;
    v4.count = v229;
    v4.instances = v231;
    v4.primitive = v232;
    v14[5] = v234;
    v14[4] = v236;
    v14[10] = v238;
    v14[18] = v240;
    v14[6] = v242;
    v14[7] = v244;
    v14[8] = v246;
    v14[9] = v248;
    v14[3] = v250;
    $16.buffer = v251;
    $16.divisor = v252;
    $16.normalized = v253;
    $16.offset = v254;
    $16.size = v255;
    $16.state = v256;
    $16.stride = v257;
    $16.type = v258;
    $16.w = v259;
    $16.x = v260;
    $16.y = v261;
    $16.z = v262;
    if (v264) {
     v1.destroyStream(v265);
    }
    $18.buffer = v277;
    $18.divisor = v278;
    $18.normalized = v279;
    $18.offset = v280;
    $18.size = v281;
    $18.state = v282;
    $18.stride = v283;
    $18.type = v284;
    $18.w = v285;
    $18.x = v286;
    $18.y = v287;
    $18.z = v288;
    $19.buffer = v289;
    $19.divisor = v290;
    $19.normalized = v291;
    $19.offset = v292;
    $19.size = v293;
    $19.state = v294;
    $19.stride = v295;
    $19.type = v296;
    $19.w = v297;
    $19.x = v298;
    $19.y = v299;
    $19.z = v300;
    if (v302) {
     v1.destroyStream(v303);
    }
    $21.buffer = v315;
    $21.divisor = v316;
    $21.normalized = v317;
    $21.offset = v318;
    $21.size = v319;
    $21.state = v320;
    $21.stride = v321;
    $21.type = v322;
    $21.w = v323;
    $21.x = v324;
    $21.y = v325;
    $21.z = v326;
    $22.buffer = v327;
    $22.divisor = v328;
    $22.normalized = v329;
    $22.offset = v330;
    $22.size = v331;
    $22.state = v332;
    $22.stride = v333;
    $22.type = v334;
    $22.w = v335;
    $22.x = v336;
    $22.y = v337;
    $22.z = v338;
    if (v340) {
     v1.destroyStream(v341);
    }
    $24.buffer = v353;
    $24.divisor = v354;
    $24.normalized = v355;
    $24.offset = v356;
    $24.size = v357;
    $24.state = v358;
    $24.stride = v359;
    $24.type = v360;
    $24.w = v361;
    $24.x = v362;
    $24.y = v363;
    $24.z = v364;
    if (v366) {
     v1.destroyStream(v367);
    }
    $26.buffer = v379;
    $26.divisor = v380;
    $26.normalized = v381;
    $26.offset = v382;
    $26.size = v383;
    $26.state = v384;
    $26.stride = v385;
    $26.type = v386;
    $26.w = v387;
    $26.x = v388;
    $26.y = v389;
    $26.z = v390;
    v11.vert = v391;
    v11.frag = v392;
    v3.dirty = true;
   }
   ,
  }

 },
 '$19,aCoord,aCoordFract,bCoord,bCoordFract,color,dashLength,dashTexture,depth,lineEnd,lineTop,opacity,scale,scaleFract,thickness,translate,translateFract,viewport': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, aCoord, aCoordFract, bCoord, bCoordFract, color, dashLength, dashTexture, depth, lineEnd, lineTop, opacity, scale, scaleFract, thickness, translate, translateFract, viewport
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48, v49, v50, v51;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v47 = {
  }
   ;
  v47.divisor = 1;
  v47.offset = 8;
  v47.stride = 8;
  v48 = {
  }
   ;
  v48.divisor = 1;
  v48.offset = 8;
  v48.stride = 8;
  v49 = {
  }
   ;
  v49.divisor = 1;
  v49.offset = 16;
  v49.stride = 8;
  v50 = {
  }
   ;
  v50.divisor = 1;
  v50.offset = 16;
  v50.stride = 8;
  v51 = {
  }
   ;
  v51.divisor = 1;
  v51.offset = 0;
  v51.stride = 4;
  return {
   'batch': function (a0, a1) {
    var v438, v439, v472, v473, v474;
    v438 = v6.angle_instanced_arrays;
    v439 = v7.next;
    if (v439 !== v7.cur) {
     if (v439) {
      v8.bindFramebuffer(36160, v439.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v439;
    }
    if (v3.dirty) {
     var v440, v441, v442, v443, v444, v445, v446, v447, v448, v449, v450, v451, v452, v453, v454, v455, v456, v457, v458, v459, v460, v461, v462, v463, v464, v465, v466, v467, v468, v469, v470, v471;
     v440 = v10.dither;
     if (v440 !== v3.dither) {
      if (v440) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v440;
     }
     v441 = v10.depth_func;
     if (v441 !== v3.depth_func) {
      v8.depthFunc(v441);
      v3.depth_func = v441;
     }
     v442 = v24[0];
     v443 = v24[1];
     if (v442 !== v25[0] || v443 !== v25[1]) {
      v8.depthRange(v442, v443);
      v25[0] = v442;
      v25[1] = v443;
     }
     v444 = v10.depth_mask;
     if (v444 !== v3.depth_mask) {
      v8.depthMask(v444);
      v3.depth_mask = v444;
     }
     v445 = v22[0];
     v446 = v22[1];
     v447 = v22[2];
     v448 = v22[3];
     if (v445 !== v23[0] || v446 !== v23[1] || v447 !== v23[2] || v448 !== v23[3]) {
      v8.colorMask(v445, v446, v447, v448);
      v23[0] = v445;
      v23[1] = v446;
      v23[2] = v447;
      v23[3] = v448;
     }
     v449 = v10.cull_enable;
     if (v449 !== v3.cull_enable) {
      if (v449) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v449;
     }
     v450 = v10.cull_face;
     if (v450 !== v3.cull_face) {
      v8.cullFace(v450);
      v3.cull_face = v450;
     }
     v451 = v10.frontFace;
     if (v451 !== v3.frontFace) {
      v8.frontFace(v451);
      v3.frontFace = v451;
     }
     v452 = v10.lineWidth;
     if (v452 !== v3.lineWidth) {
      v8.lineWidth(v452);
      v3.lineWidth = v452;
     }
     v453 = v10.polygonOffset_enable;
     if (v453 !== v3.polygonOffset_enable) {
      if (v453) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v453;
     }
     v454 = v26[0];
     v455 = v26[1];
     if (v454 !== v27[0] || v455 !== v27[1]) {
      v8.polygonOffset(v454, v455);
      v27[0] = v454;
      v27[1] = v455;
     }
     v456 = v10.sample_alpha;
     if (v456 !== v3.sample_alpha) {
      if (v456) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v456;
     }
     v457 = v10.sample_enable;
     if (v457 !== v3.sample_enable) {
      if (v457) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v457;
     }
     v458 = v28[0];
     v459 = v28[1];
     if (v458 !== v29[0] || v459 !== v29[1]) {
      v8.sampleCoverage(v458, v459);
      v29[0] = v458;
      v29[1] = v459;
     }
     v460 = v10.stencil_mask;
     if (v460 !== v3.stencil_mask) {
      v8.stencilMask(v460);
      v3.stencil_mask = v460;
     }
     v461 = v32[0];
     v462 = v32[1];
     v463 = v32[2];
     if (v461 !== v33[0] || v462 !== v33[1] || v463 !== v33[2]) {
      v8.stencilFunc(v461, v462, v463);
      v33[0] = v461;
      v33[1] = v462;
      v33[2] = v463;
     }
     v464 = v36[0];
     v465 = v36[1];
     v466 = v36[2];
     v467 = v36[3];
     if (v464 !== v37[0] || v465 !== v37[1] || v466 !== v37[2] || v467 !== v37[3]) {
      v8.stencilOpSeparate(v464, v465, v466, v467);
      v37[0] = v464;
      v37[1] = v465;
      v37[2] = v466;
      v37[3] = v467;
     }
     v468 = v34[0];
     v469 = v34[1];
     v470 = v34[2];
     v471 = v34[3];
     if (v468 !== v35[0] || v469 !== v35[1] || v470 !== v35[2] || v471 !== v35[3]) {
      v8.stencilOpSeparate(v468, v469, v470, v471);
      v35[0] = v468;
      v35[1] = v469;
      v35[2] = v470;
      v35[3] = v471;
     }
    }
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($17.program);
    v472 = v6.angle_instanced_arrays;
    var v488, v489, v490, v491, v616;
    v15.setVAO(null);
    v488 = lineEnd.location;
    v489 = v0[v488];
    if (!v489.buffer) {
     v8.enableVertexAttribArray(v488);
    }
    if (v489.type !== 5126 || v489.size !== 1 || v489.buffer !== $4 || v489.normalized !== false || v489.offset !== 0 || v489.stride !== 8) {
     v8.bindBuffer(34962, $4.buffer);
     v8.vertexAttribPointer(v488, 1, 5126, false, 8, 0);
     v489.type = 5126;
     v489.size = 1;
     v489.buffer = $4;
     v489.normalized = false;
     v489.offset = 0;
     v489.stride = 8;
    }
    if (v489.divisor !== 0) {
     v472.vertexAttribDivisorANGLE(v488, 0);
     v489.divisor = 0;
    }
    v490 = lineTop.location;
    v491 = v0[v490];
    if (!v491.buffer) {
     v8.enableVertexAttribArray(v490);
    }
    if (v491.type !== 5126 || v491.size !== 1 || v491.buffer !== $5 || v491.normalized !== false || v491.offset !== 4 || v491.stride !== 8) {
     v8.bindBuffer(34962, $5.buffer);
     v8.vertexAttribPointer(v490, 1, 5126, false, 8, 4);
     v491.type = 5126;
     v491.size = 1;
     v491.buffer = $5;
     v491.normalized = false;
     v491.offset = 4;
     v491.stride = 8;
    }
    if (v491.divisor !== 0) {
     v472.vertexAttribDivisorANGLE(v490, 0);
     v491.divisor = 0;
    }
    v616 = v4.elements;
    if (v616) {
     v8.bindBuffer(34963, v616.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v616 = v5.getElements(v15.currentVAO.elements);
     if (v616) v8.bindBuffer(34963, v616.buffer.buffer);
    }
    for (v473 = 0;
     v473 < a1;
     ++v473) {
     v474 = a0[v473];
     var v475, v476, v477, v478, v479, v480, v481, v482, v483, v484, v485, v486, v487, v492, v493, v494, v495, v496, v497, v498, v499, v500, v501, v502, v503, v504, v505, v506, v507, v508, v509, v510, v511, v512, v513, v514, v515, v516, v517, v518, v519, v520, v521, v522, v523, v524, v525, v526, v527, v528, v529, v530, v531, v532, v533, v534, v535, v536, v537, v538, v539, v540, v541, v542, v543, v544, v545, v546, v547, v548, v549, v550, v551, v552, v553, v554, v555, v556, v557, v558, v559, v560, v561, v562, v563, v564, v565, v566, v567, v568, v569, v570, v571, v572, v573, v574, v575, v576, v577, v578, v579, v580, v581, v582, v583, v584, v585, v586, v587, v588, v589, v590, v591, v592, v593, v594, v595, v596, v597, v598, v599, v600, v601, v602, v603, v604, v605, v606, v607, v608, v609, v610, v611, v612, v613, v614, v615, v617;
     v475 = v474['viewport'];
     v476 = v475.x | 0;
     v477 = v475.y | 0;
     v478 = 'width' in v475 ? v475.width | 0 : (v2.framebufferWidth - v476);
     v479 = 'height' in v475 ? v475.height | 0 : (v2.framebufferHeight - v477);
     v480 = v2.viewportWidth;
     v2.viewportWidth = v478;
     v481 = v2.viewportHeight;
     v2.viewportHeight = v479;
     v8.viewport(v476, v477, v478, v479);
     v39[0] = v476;
     v39[1] = v477;
     v39[2] = v478;
     v39[3] = v479;
     v482 = $18.call(this, v2, v474, v473);
     if (v482) {
      v8.enable(2929);
     }
     else {
      v8.disable(2929);
     }
     v3.depth_enable = v482;
     v483 = v474['viewport'];
     v484 = v483.x | 0;
     v485 = v483.y | 0;
     v486 = 'width' in v483 ? v483.width | 0 : (v2.framebufferWidth - v484);
     v487 = 'height' in v483 ? v483.height | 0 : (v2.framebufferHeight - v485);
     v8.scissor(v484, v485, v486, v487);
     v31[0] = v484;
     v31[1] = v485;
     v31[2] = v486;
     v31[3] = v487;
     v492 = v474['positionBuffer'];
     v47.buffer = v492;
     v493 = false;
     v494 = null;
     v495 = 0;
     v496 = false;
     v497 = 0;
     v498 = 0;
     v499 = 1;
     v500 = 0;
     v501 = 5126;
     v502 = 0;
     v503 = 0;
     v504 = 0;
     v505 = 0;
     if (v9(v47)) {
      v493 = true;
      v494 = v1.createStream(34962, v47);
      v501 = v494.dtype;
     }
     else {
      v494 = v1.getBuffer(v47);
      if (v494) {
       v501 = v494.dtype;
      }
      else if ('constant' in v47) {
       v499 = 2;
       if (typeof v47.constant === 'number') {
        v503 = v47.constant;
        v504 = v505 = v502 = 0;
       }
       else {
        v503 = v47.constant.length > 0 ? v47.constant[0] : 0;
        v504 = v47.constant.length > 1 ? v47.constant[1] : 0;
        v505 = v47.constant.length > 2 ? v47.constant[2] : 0;
        v502 = v47.constant.length > 3 ? v47.constant[3] : 0;
       }
      }
      else {
       if (v9(v47.buffer)) {
        v494 = v1.createStream(34962, v47.buffer);
       }
       else {
        v494 = v1.getBuffer(v47.buffer);
       }
       v501 = 'type' in v47 ? v43[v47.type] : v494.dtype;
       v496 = !!v47.normalized;
       v498 = v47.size | 0;
       v497 = v47.offset | 0;
       v500 = v47.stride | 0;
       v495 = v47.divisor | 0;
      }
     }
     v506 = aCoord.location;
     v507 = v0[v506];
     if (v499 === 1) {
      if (!v507.buffer) {
       v8.enableVertexAttribArray(v506);
      }
      v508 = v498 || 2;
      if (v507.type !== v501 || v507.size !== v508 || v507.buffer !== v494 || v507.normalized !== v496 || v507.offset !== v497 || v507.stride !== v500) {
       v8.bindBuffer(34962, v494.buffer);
       v8.vertexAttribPointer(v506, v508, v501, v496, v500, v497);
       v507.type = v501;
       v507.size = v508;
       v507.buffer = v494;
       v507.normalized = v496;
       v507.offset = v497;
       v507.stride = v500;
      }
      if (v507.divisor !== v495) {
       v472.vertexAttribDivisorANGLE(v506, v495);
       v507.divisor = v495;
      }
     }
     else {
      if (v507.buffer) {
       v8.disableVertexAttribArray(v506);
       v507.buffer = null;
      }
      if (v507.x !== v503 || v507.y !== v504 || v507.z !== v505 || v507.w !== v502) {
       v8.vertexAttrib4f(v506, v503, v504, v505, v502);
       v507.x = v503;
       v507.y = v504;
       v507.z = v505;
       v507.w = v502;
      }
     }
     v509 = v474['positionBuffer'];
     v49.buffer = v509;
     v510 = false;
     v511 = null;
     v512 = 0;
     v513 = false;
     v514 = 0;
     v515 = 0;
     v516 = 1;
     v517 = 0;
     v518 = 5126;
     v519 = 0;
     v520 = 0;
     v521 = 0;
     v522 = 0;
     if (v9(v49)) {
      v510 = true;
      v511 = v1.createStream(34962, v49);
      v518 = v511.dtype;
     }
     else {
      v511 = v1.getBuffer(v49);
      if (v511) {
       v518 = v511.dtype;
      }
      else if ('constant' in v49) {
       v516 = 2;
       if (typeof v49.constant === 'number') {
        v520 = v49.constant;
        v521 = v522 = v519 = 0;
       }
       else {
        v520 = v49.constant.length > 0 ? v49.constant[0] : 0;
        v521 = v49.constant.length > 1 ? v49.constant[1] : 0;
        v522 = v49.constant.length > 2 ? v49.constant[2] : 0;
        v519 = v49.constant.length > 3 ? v49.constant[3] : 0;
       }
      }
      else {
       if (v9(v49.buffer)) {
        v511 = v1.createStream(34962, v49.buffer);
       }
       else {
        v511 = v1.getBuffer(v49.buffer);
       }
       v518 = 'type' in v49 ? v43[v49.type] : v511.dtype;
       v513 = !!v49.normalized;
       v515 = v49.size | 0;
       v514 = v49.offset | 0;
       v517 = v49.stride | 0;
       v512 = v49.divisor | 0;
      }
     }
     v523 = bCoord.location;
     v524 = v0[v523];
     if (v516 === 1) {
      if (!v524.buffer) {
       v8.enableVertexAttribArray(v523);
      }
      v525 = v515 || 2;
      if (v524.type !== v518 || v524.size !== v525 || v524.buffer !== v511 || v524.normalized !== v513 || v524.offset !== v514 || v524.stride !== v517) {
       v8.bindBuffer(34962, v511.buffer);
       v8.vertexAttribPointer(v523, v525, v518, v513, v517, v514);
       v524.type = v518;
       v524.size = v525;
       v524.buffer = v511;
       v524.normalized = v513;
       v524.offset = v514;
       v524.stride = v517;
      }
      if (v524.divisor !== v512) {
       v472.vertexAttribDivisorANGLE(v523, v512);
       v524.divisor = v512;
      }
     }
     else {
      if (v524.buffer) {
       v8.disableVertexAttribArray(v523);
       v524.buffer = null;
      }
      if (v524.x !== v520 || v524.y !== v521 || v524.z !== v522 || v524.w !== v519) {
       v8.vertexAttrib4f(v523, v520, v521, v522, v519);
       v524.x = v520;
       v524.y = v521;
       v524.z = v522;
       v524.w = v519;
      }
     }
     v526 = v474['positionFractBuffer'];
     v48.buffer = v526;
     v527 = false;
     v528 = null;
     v529 = 0;
     v530 = false;
     v531 = 0;
     v532 = 0;
     v533 = 1;
     v534 = 0;
     v535 = 5126;
     v536 = 0;
     v537 = 0;
     v538 = 0;
     v539 = 0;
     if (v9(v48)) {
      v527 = true;
      v528 = v1.createStream(34962, v48);
      v535 = v528.dtype;
     }
     else {
      v528 = v1.getBuffer(v48);
      if (v528) {
       v535 = v528.dtype;
      }
      else if ('constant' in v48) {
       v533 = 2;
       if (typeof v48.constant === 'number') {
        v537 = v48.constant;
        v538 = v539 = v536 = 0;
       }
       else {
        v537 = v48.constant.length > 0 ? v48.constant[0] : 0;
        v538 = v48.constant.length > 1 ? v48.constant[1] : 0;
        v539 = v48.constant.length > 2 ? v48.constant[2] : 0;
        v536 = v48.constant.length > 3 ? v48.constant[3] : 0;
       }
      }
      else {
       if (v9(v48.buffer)) {
        v528 = v1.createStream(34962, v48.buffer);
       }
       else {
        v528 = v1.getBuffer(v48.buffer);
       }
       v535 = 'type' in v48 ? v43[v48.type] : v528.dtype;
       v530 = !!v48.normalized;
       v532 = v48.size | 0;
       v531 = v48.offset | 0;
       v534 = v48.stride | 0;
       v529 = v48.divisor | 0;
      }
     }
     v540 = aCoordFract.location;
     v541 = v0[v540];
     if (v533 === 1) {
      if (!v541.buffer) {
       v8.enableVertexAttribArray(v540);
      }
      v542 = v532 || 2;
      if (v541.type !== v535 || v541.size !== v542 || v541.buffer !== v528 || v541.normalized !== v530 || v541.offset !== v531 || v541.stride !== v534) {
       v8.bindBuffer(34962, v528.buffer);
       v8.vertexAttribPointer(v540, v542, v535, v530, v534, v531);
       v541.type = v535;
       v541.size = v542;
       v541.buffer = v528;
       v541.normalized = v530;
       v541.offset = v531;
       v541.stride = v534;
      }
      if (v541.divisor !== v529) {
       v472.vertexAttribDivisorANGLE(v540, v529);
       v541.divisor = v529;
      }
     }
     else {
      if (v541.buffer) {
       v8.disableVertexAttribArray(v540);
       v541.buffer = null;
      }
      if (v541.x !== v537 || v541.y !== v538 || v541.z !== v539 || v541.w !== v536) {
       v8.vertexAttrib4f(v540, v537, v538, v539, v536);
       v541.x = v537;
       v541.y = v538;
       v541.z = v539;
       v541.w = v536;
      }
     }
     v543 = v474['positionFractBuffer'];
     v50.buffer = v543;
     v544 = false;
     v545 = null;
     v546 = 0;
     v547 = false;
     v548 = 0;
     v549 = 0;
     v550 = 1;
     v551 = 0;
     v552 = 5126;
     v553 = 0;
     v554 = 0;
     v555 = 0;
     v556 = 0;
     if (v9(v50)) {
      v544 = true;
      v545 = v1.createStream(34962, v50);
      v552 = v545.dtype;
     }
     else {
      v545 = v1.getBuffer(v50);
      if (v545) {
       v552 = v545.dtype;
      }
      else if ('constant' in v50) {
       v550 = 2;
       if (typeof v50.constant === 'number') {
        v554 = v50.constant;
        v555 = v556 = v553 = 0;
       }
       else {
        v554 = v50.constant.length > 0 ? v50.constant[0] : 0;
        v555 = v50.constant.length > 1 ? v50.constant[1] : 0;
        v556 = v50.constant.length > 2 ? v50.constant[2] : 0;
        v553 = v50.constant.length > 3 ? v50.constant[3] : 0;
       }
      }
      else {
       if (v9(v50.buffer)) {
        v545 = v1.createStream(34962, v50.buffer);
       }
       else {
        v545 = v1.getBuffer(v50.buffer);
       }
       v552 = 'type' in v50 ? v43[v50.type] : v545.dtype;
       v547 = !!v50.normalized;
       v549 = v50.size | 0;
       v548 = v50.offset | 0;
       v551 = v50.stride | 0;
       v546 = v50.divisor | 0;
      }
     }
     v557 = bCoordFract.location;
     v558 = v0[v557];
     if (v550 === 1) {
      if (!v558.buffer) {
       v8.enableVertexAttribArray(v557);
      }
      v559 = v549 || 2;
      if (v558.type !== v552 || v558.size !== v559 || v558.buffer !== v545 || v558.normalized !== v547 || v558.offset !== v548 || v558.stride !== v551) {
       v8.bindBuffer(34962, v545.buffer);
       v8.vertexAttribPointer(v557, v559, v552, v547, v551, v548);
       v558.type = v552;
       v558.size = v559;
       v558.buffer = v545;
       v558.normalized = v547;
       v558.offset = v548;
       v558.stride = v551;
      }
      if (v558.divisor !== v546) {
       v472.vertexAttribDivisorANGLE(v557, v546);
       v558.divisor = v546;
      }
     }
     else {
      if (v558.buffer) {
       v8.disableVertexAttribArray(v557);
       v558.buffer = null;
      }
      if (v558.x !== v554 || v558.y !== v555 || v558.z !== v556 || v558.w !== v553) {
       v8.vertexAttrib4f(v557, v554, v555, v556, v553);
       v558.x = v554;
       v558.y = v555;
       v558.z = v556;
       v558.w = v553;
      }
     }
     v560 = v474['colorBuffer'];
     v51.buffer = v560;
     v561 = false;
     v562 = null;
     v563 = 0;
     v564 = false;
     v565 = 0;
     v566 = 0;
     v567 = 1;
     v568 = 0;
     v569 = 5126;
     v570 = 0;
     v571 = 0;
     v572 = 0;
     v573 = 0;
     if (v9(v51)) {
      v561 = true;
      v562 = v1.createStream(34962, v51);
      v569 = v562.dtype;
     }
     else {
      v562 = v1.getBuffer(v51);
      if (v562) {
       v569 = v562.dtype;
      }
      else if ('constant' in v51) {
       v567 = 2;
       if (typeof v51.constant === 'number') {
        v571 = v51.constant;
        v572 = v573 = v570 = 0;
       }
       else {
        v571 = v51.constant.length > 0 ? v51.constant[0] : 0;
        v572 = v51.constant.length > 1 ? v51.constant[1] : 0;
        v573 = v51.constant.length > 2 ? v51.constant[2] : 0;
        v570 = v51.constant.length > 3 ? v51.constant[3] : 0;
       }
      }
      else {
       if (v9(v51.buffer)) {
        v562 = v1.createStream(34962, v51.buffer);
       }
       else {
        v562 = v1.getBuffer(v51.buffer);
       }
       v569 = 'type' in v51 ? v43[v51.type] : v562.dtype;
       v564 = !!v51.normalized;
       v566 = v51.size | 0;
       v565 = v51.offset | 0;
       v568 = v51.stride | 0;
       v563 = v51.divisor | 0;
      }
     }
     v574 = color.location;
     v575 = v0[v574];
     if (v567 === 1) {
      if (!v575.buffer) {
       v8.enableVertexAttribArray(v574);
      }
      v576 = v566 || 4;
      if (v575.type !== v569 || v575.size !== v576 || v575.buffer !== v562 || v575.normalized !== v564 || v575.offset !== v565 || v575.stride !== v568) {
       v8.bindBuffer(34962, v562.buffer);
       v8.vertexAttribPointer(v574, v576, v569, v564, v568, v565);
       v575.type = v569;
       v575.size = v576;
       v575.buffer = v562;
       v575.normalized = v564;
       v575.offset = v565;
       v575.stride = v568;
      }
      if (v575.divisor !== v563) {
       v472.vertexAttribDivisorANGLE(v574, v563);
       v575.divisor = v563;
      }
     }
     else {
      if (v575.buffer) {
       v8.disableVertexAttribArray(v574);
       v575.buffer = null;
      }
      if (v575.x !== v571 || v575.y !== v572 || v575.z !== v573 || v575.w !== v570) {
       v8.vertexAttrib4f(v574, v571, v572, v573, v570);
       v575.x = v571;
       v575.y = v572;
       v575.z = v573;
       v575.w = v570;
      }
     }
     v577 = v474['scale'];
     v578 = v577[0];
     v580 = v577[1];
     if (!v473 || v579 !== v578 || v581 !== v580) {
      v579 = v578;
      v581 = v580;
      v8.uniform2f(scale.location, v578, v580);
     }
     v582 = v474['scaleFract'];
     v583 = v582[0];
     v585 = v582[1];
     if (!v473 || v584 !== v583 || v586 !== v585) {
      v584 = v583;
      v586 = v585;
      v8.uniform2f(scaleFract.location, v583, v585);
     }
     v587 = v474['translate'];
     v588 = v587[0];
     v590 = v587[1];
     if (!v473 || v589 !== v588 || v591 !== v590) {
      v589 = v588;
      v591 = v590;
      v8.uniform2f(translate.location, v588, v590);
     }
     v592 = v474['translateFract'];
     v593 = v592[0];
     v595 = v592[1];
     if (!v473 || v594 !== v593 || v596 !== v595) {
      v594 = v593;
      v596 = v595;
      v8.uniform2f(translateFract.location, v593, v595);
     }
     v597 = v474['thickness'];
     if (!v473 || v598 !== v597) {
      v598 = v597;
      v8.uniform1f(thickness.location, v597);
     }
     v599 = v474['depth'];
     if (!v473 || v600 !== v599) {
      v600 = v599;
      v8.uniform1f(depth.location, v599);
     }
     v601 = $19.call(this, v2, v474, v473);
     v602 = v601[0];
     v604 = v601[1];
     v606 = v601[2];
     v608 = v601[3];
     if (!v473 || v603 !== v602 || v605 !== v604 || v607 !== v606 || v609 !== v608) {
      v603 = v602;
      v605 = v604;
      v607 = v606;
      v609 = v608;
      v8.uniform4f(viewport.location, v602, v604, v606, v608);
     }
     v610 = v474['dashLength'];
     if (!v473 || v611 !== v610) {
      v611 = v610;
      v8.uniform1f(dashLength.location, v610);
     }
     v612 = v474['opacity'];
     if (!v473 || v613 !== v612) {
      v613 = v612;
      v8.uniform1f(opacity.location, v612);
     }
     v614 = v474['dashTexture'];
     if (v614 && v614._reglType === 'framebuffer') {
      v614 = v614.color[0];
     }
     v615 = v614._texture;
     v8.uniform1i(dashTexture.location, v615.bind());
     v617 = v474['count'];
     if (v617 > 0) {
      if (v616) {
       v472.drawElementsInstancedANGLE(5, 4, v616.type, 0 << ((v616.type - 5121) >> 1), v617);
      }
      else {
       v472.drawArraysInstancedANGLE(5, 0, 4, v617);
      }
     }
     else if (v617 < 0) {
      if (v616) {
       v8.drawElements(5, 4, v616.type, 0 << ((v616.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(5, 0, 4);
      }
     }
     v2.viewportWidth = v480;
     v2.viewportHeight = v481;
     if (v493) {
      v1.destroyStream(v494);
     }
     if (v510) {
      v1.destroyStream(v511);
     }
     if (v527) {
      v1.destroyStream(v528);
     }
     if (v544) {
      v1.destroyStream(v545);
     }
     if (v561) {
      v1.destroyStream(v562);
     }
     v615.unbind();
    }
    v3.dirty = true;
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v52, v53, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153, v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177, v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195, v196, v197, v198, v199, v200, v201, v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213;
    v52 = v6.angle_instanced_arrays;
    v53 = v7.next;
    if (v53 !== v7.cur) {
     if (v53) {
      v8.bindFramebuffer(36160, v53.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v53;
    }
    if (v3.dirty) {
     var v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84, v85;
     v54 = v10.dither;
     if (v54 !== v3.dither) {
      if (v54) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v54;
     }
     v55 = v10.depth_func;
     if (v55 !== v3.depth_func) {
      v8.depthFunc(v55);
      v3.depth_func = v55;
     }
     v56 = v24[0];
     v57 = v24[1];
     if (v56 !== v25[0] || v57 !== v25[1]) {
      v8.depthRange(v56, v57);
      v25[0] = v56;
      v25[1] = v57;
     }
     v58 = v10.depth_mask;
     if (v58 !== v3.depth_mask) {
      v8.depthMask(v58);
      v3.depth_mask = v58;
     }
     v59 = v22[0];
     v60 = v22[1];
     v61 = v22[2];
     v62 = v22[3];
     if (v59 !== v23[0] || v60 !== v23[1] || v61 !== v23[2] || v62 !== v23[3]) {
      v8.colorMask(v59, v60, v61, v62);
      v23[0] = v59;
      v23[1] = v60;
      v23[2] = v61;
      v23[3] = v62;
     }
     v63 = v10.cull_enable;
     if (v63 !== v3.cull_enable) {
      if (v63) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v63;
     }
     v64 = v10.cull_face;
     if (v64 !== v3.cull_face) {
      v8.cullFace(v64);
      v3.cull_face = v64;
     }
     v65 = v10.frontFace;
     if (v65 !== v3.frontFace) {
      v8.frontFace(v65);
      v3.frontFace = v65;
     }
     v66 = v10.lineWidth;
     if (v66 !== v3.lineWidth) {
      v8.lineWidth(v66);
      v3.lineWidth = v66;
     }
     v67 = v10.polygonOffset_enable;
     if (v67 !== v3.polygonOffset_enable) {
      if (v67) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v67;
     }
     v68 = v26[0];
     v69 = v26[1];
     if (v68 !== v27[0] || v69 !== v27[1]) {
      v8.polygonOffset(v68, v69);
      v27[0] = v68;
      v27[1] = v69;
     }
     v70 = v10.sample_alpha;
     if (v70 !== v3.sample_alpha) {
      if (v70) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v70;
     }
     v71 = v10.sample_enable;
     if (v71 !== v3.sample_enable) {
      if (v71) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v71;
     }
     v72 = v28[0];
     v73 = v28[1];
     if (v72 !== v29[0] || v73 !== v29[1]) {
      v8.sampleCoverage(v72, v73);
      v29[0] = v72;
      v29[1] = v73;
     }
     v74 = v10.stencil_mask;
     if (v74 !== v3.stencil_mask) {
      v8.stencilMask(v74);
      v3.stencil_mask = v74;
     }
     v75 = v32[0];
     v76 = v32[1];
     v77 = v32[2];
     if (v75 !== v33[0] || v76 !== v33[1] || v77 !== v33[2]) {
      v8.stencilFunc(v75, v76, v77);
      v33[0] = v75;
      v33[1] = v76;
      v33[2] = v77;
     }
     v78 = v36[0];
     v79 = v36[1];
     v80 = v36[2];
     v81 = v36[3];
     if (v78 !== v37[0] || v79 !== v37[1] || v80 !== v37[2] || v81 !== v37[3]) {
      v8.stencilOpSeparate(v78, v79, v80, v81);
      v37[0] = v78;
      v37[1] = v79;
      v37[2] = v80;
      v37[3] = v81;
     }
     v82 = v34[0];
     v83 = v34[1];
     v84 = v34[2];
     v85 = v34[3];
     if (v82 !== v35[0] || v83 !== v35[1] || v84 !== v35[2] || v85 !== v35[3]) {
      v8.stencilOpSeparate(v82, v83, v84, v85);
      v35[0] = v82;
      v35[1] = v83;
      v35[2] = v84;
      v35[3] = v85;
     }
    }
    v86 = a0['viewport'];
    v87 = v86.x | 0;
    v88 = v86.y | 0;
    v89 = 'width' in v86 ? v86.width | 0 : (v2.framebufferWidth - v87);
    v90 = 'height' in v86 ? v86.height | 0 : (v2.framebufferHeight - v88);
    v91 = v2.viewportWidth;
    v2.viewportWidth = v89;
    v92 = v2.viewportHeight;
    v2.viewportHeight = v90;
    v8.viewport(v87, v88, v89, v90);
    v39[0] = v87;
    v39[1] = v88;
    v39[2] = v89;
    v39[3] = v90;
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v93 = $2.call(this, v2, a0, 0);
    if (v93) {
     v8.enable(2929);
    }
    else {
     v8.disable(2929);
    }
    v3.depth_enable = v93;
    v94 = a0['viewport'];
    v95 = v94.x | 0;
    v96 = v94.y | 0;
    v97 = 'width' in v94 ? v94.width | 0 : (v2.framebufferWidth - v95);
    v98 = 'height' in v94 ? v94.height | 0 : (v2.framebufferHeight - v96);
    v8.scissor(v95, v96, v97, v98);
    v31[0] = v95;
    v31[1] = v96;
    v31[2] = v97;
    v31[3] = v98;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($3.program);
    v99 = v6.angle_instanced_arrays;
    v15.setVAO(null);
    v100 = a0['positionBuffer'];
    v47.buffer = v100;
    v101 = false;
    v102 = null;
    v103 = 0;
    v104 = false;
    v105 = 0;
    v106 = 0;
    v107 = 1;
    v108 = 0;
    v109 = 5126;
    v110 = 0;
    v111 = 0;
    v112 = 0;
    v113 = 0;
    if (v9(v47)) {
     v101 = true;
     v102 = v1.createStream(34962, v47);
     v109 = v102.dtype;
    }
    else {
     v102 = v1.getBuffer(v47);
     if (v102) {
      v109 = v102.dtype;
     }
     else if ('constant' in v47) {
      v107 = 2;
      if (typeof v47.constant === 'number') {
       v111 = v47.constant;
       v112 = v113 = v110 = 0;
      }
      else {
       v111 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v112 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v113 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v110 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v102 = v1.createStream(34962, v47.buffer);
      }
      else {
       v102 = v1.getBuffer(v47.buffer);
      }
      v109 = 'type' in v47 ? v43[v47.type] : v102.dtype;
      v104 = !!v47.normalized;
      v106 = v47.size | 0;
      v105 = v47.offset | 0;
      v108 = v47.stride | 0;
      v103 = v47.divisor | 0;
     }
    }
    v114 = aCoord.location;
    v115 = v0[v114];
    if (v107 === 1) {
     if (!v115.buffer) {
      v8.enableVertexAttribArray(v114);
     }
     v116 = v106 || 2;
     if (v115.type !== v109 || v115.size !== v116 || v115.buffer !== v102 || v115.normalized !== v104 || v115.offset !== v105 || v115.stride !== v108) {
      v8.bindBuffer(34962, v102.buffer);
      v8.vertexAttribPointer(v114, v116, v109, v104, v108, v105);
      v115.type = v109;
      v115.size = v116;
      v115.buffer = v102;
      v115.normalized = v104;
      v115.offset = v105;
      v115.stride = v108;
     }
     if (v115.divisor !== v103) {
      v99.vertexAttribDivisorANGLE(v114, v103);
      v115.divisor = v103;
     }
    }
    else {
     if (v115.buffer) {
      v8.disableVertexAttribArray(v114);
      v115.buffer = null;
     }
     if (v115.x !== v111 || v115.y !== v112 || v115.z !== v113 || v115.w !== v110) {
      v8.vertexAttrib4f(v114, v111, v112, v113, v110);
      v115.x = v111;
      v115.y = v112;
      v115.z = v113;
      v115.w = v110;
     }
    }
    v117 = a0['positionBuffer'];
    v49.buffer = v117;
    v118 = false;
    v119 = null;
    v120 = 0;
    v121 = false;
    v122 = 0;
    v123 = 0;
    v124 = 1;
    v125 = 0;
    v126 = 5126;
    v127 = 0;
    v128 = 0;
    v129 = 0;
    v130 = 0;
    if (v9(v49)) {
     v118 = true;
     v119 = v1.createStream(34962, v49);
     v126 = v119.dtype;
    }
    else {
     v119 = v1.getBuffer(v49);
     if (v119) {
      v126 = v119.dtype;
     }
     else if ('constant' in v49) {
      v124 = 2;
      if (typeof v49.constant === 'number') {
       v128 = v49.constant;
       v129 = v130 = v127 = 0;
      }
      else {
       v128 = v49.constant.length > 0 ? v49.constant[0] : 0;
       v129 = v49.constant.length > 1 ? v49.constant[1] : 0;
       v130 = v49.constant.length > 2 ? v49.constant[2] : 0;
       v127 = v49.constant.length > 3 ? v49.constant[3] : 0;
      }
     }
     else {
      if (v9(v49.buffer)) {
       v119 = v1.createStream(34962, v49.buffer);
      }
      else {
       v119 = v1.getBuffer(v49.buffer);
      }
      v126 = 'type' in v49 ? v43[v49.type] : v119.dtype;
      v121 = !!v49.normalized;
      v123 = v49.size | 0;
      v122 = v49.offset | 0;
      v125 = v49.stride | 0;
      v120 = v49.divisor | 0;
     }
    }
    v131 = bCoord.location;
    v132 = v0[v131];
    if (v124 === 1) {
     if (!v132.buffer) {
      v8.enableVertexAttribArray(v131);
     }
     v133 = v123 || 2;
     if (v132.type !== v126 || v132.size !== v133 || v132.buffer !== v119 || v132.normalized !== v121 || v132.offset !== v122 || v132.stride !== v125) {
      v8.bindBuffer(34962, v119.buffer);
      v8.vertexAttribPointer(v131, v133, v126, v121, v125, v122);
      v132.type = v126;
      v132.size = v133;
      v132.buffer = v119;
      v132.normalized = v121;
      v132.offset = v122;
      v132.stride = v125;
     }
     if (v132.divisor !== v120) {
      v99.vertexAttribDivisorANGLE(v131, v120);
      v132.divisor = v120;
     }
    }
    else {
     if (v132.buffer) {
      v8.disableVertexAttribArray(v131);
      v132.buffer = null;
     }
     if (v132.x !== v128 || v132.y !== v129 || v132.z !== v130 || v132.w !== v127) {
      v8.vertexAttrib4f(v131, v128, v129, v130, v127);
      v132.x = v128;
      v132.y = v129;
      v132.z = v130;
      v132.w = v127;
     }
    }
    v134 = a0['positionFractBuffer'];
    v48.buffer = v134;
    v135 = false;
    v136 = null;
    v137 = 0;
    v138 = false;
    v139 = 0;
    v140 = 0;
    v141 = 1;
    v142 = 0;
    v143 = 5126;
    v144 = 0;
    v145 = 0;
    v146 = 0;
    v147 = 0;
    if (v9(v48)) {
     v135 = true;
     v136 = v1.createStream(34962, v48);
     v143 = v136.dtype;
    }
    else {
     v136 = v1.getBuffer(v48);
     if (v136) {
      v143 = v136.dtype;
     }
     else if ('constant' in v48) {
      v141 = 2;
      if (typeof v48.constant === 'number') {
       v145 = v48.constant;
       v146 = v147 = v144 = 0;
      }
      else {
       v145 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v146 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v147 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v144 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v136 = v1.createStream(34962, v48.buffer);
      }
      else {
       v136 = v1.getBuffer(v48.buffer);
      }
      v143 = 'type' in v48 ? v43[v48.type] : v136.dtype;
      v138 = !!v48.normalized;
      v140 = v48.size | 0;
      v139 = v48.offset | 0;
      v142 = v48.stride | 0;
      v137 = v48.divisor | 0;
     }
    }
    v148 = aCoordFract.location;
    v149 = v0[v148];
    if (v141 === 1) {
     if (!v149.buffer) {
      v8.enableVertexAttribArray(v148);
     }
     v150 = v140 || 2;
     if (v149.type !== v143 || v149.size !== v150 || v149.buffer !== v136 || v149.normalized !== v138 || v149.offset !== v139 || v149.stride !== v142) {
      v8.bindBuffer(34962, v136.buffer);
      v8.vertexAttribPointer(v148, v150, v143, v138, v142, v139);
      v149.type = v143;
      v149.size = v150;
      v149.buffer = v136;
      v149.normalized = v138;
      v149.offset = v139;
      v149.stride = v142;
     }
     if (v149.divisor !== v137) {
      v99.vertexAttribDivisorANGLE(v148, v137);
      v149.divisor = v137;
     }
    }
    else {
     if (v149.buffer) {
      v8.disableVertexAttribArray(v148);
      v149.buffer = null;
     }
     if (v149.x !== v145 || v149.y !== v146 || v149.z !== v147 || v149.w !== v144) {
      v8.vertexAttrib4f(v148, v145, v146, v147, v144);
      v149.x = v145;
      v149.y = v146;
      v149.z = v147;
      v149.w = v144;
     }
    }
    v151 = a0['positionFractBuffer'];
    v50.buffer = v151;
    v152 = false;
    v153 = null;
    v154 = 0;
    v155 = false;
    v156 = 0;
    v157 = 0;
    v158 = 1;
    v159 = 0;
    v160 = 5126;
    v161 = 0;
    v162 = 0;
    v163 = 0;
    v164 = 0;
    if (v9(v50)) {
     v152 = true;
     v153 = v1.createStream(34962, v50);
     v160 = v153.dtype;
    }
    else {
     v153 = v1.getBuffer(v50);
     if (v153) {
      v160 = v153.dtype;
     }
     else if ('constant' in v50) {
      v158 = 2;
      if (typeof v50.constant === 'number') {
       v162 = v50.constant;
       v163 = v164 = v161 = 0;
      }
      else {
       v162 = v50.constant.length > 0 ? v50.constant[0] : 0;
       v163 = v50.constant.length > 1 ? v50.constant[1] : 0;
       v164 = v50.constant.length > 2 ? v50.constant[2] : 0;
       v161 = v50.constant.length > 3 ? v50.constant[3] : 0;
      }
     }
     else {
      if (v9(v50.buffer)) {
       v153 = v1.createStream(34962, v50.buffer);
      }
      else {
       v153 = v1.getBuffer(v50.buffer);
      }
      v160 = 'type' in v50 ? v43[v50.type] : v153.dtype;
      v155 = !!v50.normalized;
      v157 = v50.size | 0;
      v156 = v50.offset | 0;
      v159 = v50.stride | 0;
      v154 = v50.divisor | 0;
     }
    }
    v165 = bCoordFract.location;
    v166 = v0[v165];
    if (v158 === 1) {
     if (!v166.buffer) {
      v8.enableVertexAttribArray(v165);
     }
     v167 = v157 || 2;
     if (v166.type !== v160 || v166.size !== v167 || v166.buffer !== v153 || v166.normalized !== v155 || v166.offset !== v156 || v166.stride !== v159) {
      v8.bindBuffer(34962, v153.buffer);
      v8.vertexAttribPointer(v165, v167, v160, v155, v159, v156);
      v166.type = v160;
      v166.size = v167;
      v166.buffer = v153;
      v166.normalized = v155;
      v166.offset = v156;
      v166.stride = v159;
     }
     if (v166.divisor !== v154) {
      v99.vertexAttribDivisorANGLE(v165, v154);
      v166.divisor = v154;
     }
    }
    else {
     if (v166.buffer) {
      v8.disableVertexAttribArray(v165);
      v166.buffer = null;
     }
     if (v166.x !== v162 || v166.y !== v163 || v166.z !== v164 || v166.w !== v161) {
      v8.vertexAttrib4f(v165, v162, v163, v164, v161);
      v166.x = v162;
      v166.y = v163;
      v166.z = v164;
      v166.w = v161;
     }
    }
    v168 = a0['colorBuffer'];
    v51.buffer = v168;
    v169 = false;
    v170 = null;
    v171 = 0;
    v172 = false;
    v173 = 0;
    v174 = 0;
    v175 = 1;
    v176 = 0;
    v177 = 5126;
    v178 = 0;
    v179 = 0;
    v180 = 0;
    v181 = 0;
    if (v9(v51)) {
     v169 = true;
     v170 = v1.createStream(34962, v51);
     v177 = v170.dtype;
    }
    else {
     v170 = v1.getBuffer(v51);
     if (v170) {
      v177 = v170.dtype;
     }
     else if ('constant' in v51) {
      v175 = 2;
      if (typeof v51.constant === 'number') {
       v179 = v51.constant;
       v180 = v181 = v178 = 0;
      }
      else {
       v179 = v51.constant.length > 0 ? v51.constant[0] : 0;
       v180 = v51.constant.length > 1 ? v51.constant[1] : 0;
       v181 = v51.constant.length > 2 ? v51.constant[2] : 0;
       v178 = v51.constant.length > 3 ? v51.constant[3] : 0;
      }
     }
     else {
      if (v9(v51.buffer)) {
       v170 = v1.createStream(34962, v51.buffer);
      }
      else {
       v170 = v1.getBuffer(v51.buffer);
      }
      v177 = 'type' in v51 ? v43[v51.type] : v170.dtype;
      v172 = !!v51.normalized;
      v174 = v51.size | 0;
      v173 = v51.offset | 0;
      v176 = v51.stride | 0;
      v171 = v51.divisor | 0;
     }
    }
    v182 = color.location;
    v183 = v0[v182];
    if (v175 === 1) {
     if (!v183.buffer) {
      v8.enableVertexAttribArray(v182);
     }
     v184 = v174 || 4;
     if (v183.type !== v177 || v183.size !== v184 || v183.buffer !== v170 || v183.normalized !== v172 || v183.offset !== v173 || v183.stride !== v176) {
      v8.bindBuffer(34962, v170.buffer);
      v8.vertexAttribPointer(v182, v184, v177, v172, v176, v173);
      v183.type = v177;
      v183.size = v184;
      v183.buffer = v170;
      v183.normalized = v172;
      v183.offset = v173;
      v183.stride = v176;
     }
     if (v183.divisor !== v171) {
      v99.vertexAttribDivisorANGLE(v182, v171);
      v183.divisor = v171;
     }
    }
    else {
     if (v183.buffer) {
      v8.disableVertexAttribArray(v182);
      v183.buffer = null;
     }
     if (v183.x !== v179 || v183.y !== v180 || v183.z !== v181 || v183.w !== v178) {
      v8.vertexAttrib4f(v182, v179, v180, v181, v178);
      v183.x = v179;
      v183.y = v180;
      v183.z = v181;
      v183.w = v178;
     }
    }
    v185 = lineEnd.location;
    v186 = v0[v185];
    if (!v186.buffer) {
     v8.enableVertexAttribArray(v185);
    }
    if (v186.type !== 5126 || v186.size !== 1 || v186.buffer !== $4 || v186.normalized !== false || v186.offset !== 0 || v186.stride !== 8) {
     v8.bindBuffer(34962, $4.buffer);
     v8.vertexAttribPointer(v185, 1, 5126, false, 8, 0);
     v186.type = 5126;
     v186.size = 1;
     v186.buffer = $4;
     v186.normalized = false;
     v186.offset = 0;
     v186.stride = 8;
    }
    if (v186.divisor !== 0) {
     v99.vertexAttribDivisorANGLE(v185, 0);
     v186.divisor = 0;
    }
    v187 = lineTop.location;
    v188 = v0[v187];
    if (!v188.buffer) {
     v8.enableVertexAttribArray(v187);
    }
    if (v188.type !== 5126 || v188.size !== 1 || v188.buffer !== $5 || v188.normalized !== false || v188.offset !== 4 || v188.stride !== 8) {
     v8.bindBuffer(34962, $5.buffer);
     v8.vertexAttribPointer(v187, 1, 5126, false, 8, 4);
     v188.type = 5126;
     v188.size = 1;
     v188.buffer = $5;
     v188.normalized = false;
     v188.offset = 4;
     v188.stride = 8;
    }
    if (v188.divisor !== 0) {
     v99.vertexAttribDivisorANGLE(v187, 0);
     v188.divisor = 0;
    }
    v189 = a0['scale'];
    v190 = v189[0];
    v191 = v189[1];
    v8.uniform2f(scale.location, v190, v191);
    v192 = a0['scaleFract'];
    v193 = v192[0];
    v194 = v192[1];
    v8.uniform2f(scaleFract.location, v193, v194);
    v195 = a0['translate'];
    v196 = v195[0];
    v197 = v195[1];
    v8.uniform2f(translate.location, v196, v197);
    v198 = a0['translateFract'];
    v199 = v198[0];
    v200 = v198[1];
    v8.uniform2f(translateFract.location, v199, v200);
    v201 = a0['thickness'];
    v8.uniform1f(thickness.location, v201);
    v202 = a0['depth'];
    v8.uniform1f(depth.location, v202);
    v203 = $6.call(this, v2, a0, 0);
    v204 = v203[0];
    v205 = v203[1];
    v206 = v203[2];
    v207 = v203[3];
    v8.uniform4f(viewport.location, v204, v205, v206, v207);
    v208 = a0['dashLength'];
    v8.uniform1f(dashLength.location, v208);
    v209 = a0['opacity'];
    v8.uniform1f(opacity.location, v209);
    v210 = a0['dashTexture'];
    if (v210 && v210._reglType === 'framebuffer') {
     v210 = v210.color[0];
    }
    v211 = v210._texture;
    v8.uniform1i(dashTexture.location, v211.bind());
    v212 = v4.elements;
    if (v212) {
     v8.bindBuffer(34963, v212.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v212 = v5.getElements(v15.currentVAO.elements);
     if (v212) v8.bindBuffer(34963, v212.buffer.buffer);
    }
    v213 = a0['count'];
    if (v213 > 0) {
     if (v212) {
      v99.drawElementsInstancedANGLE(5, 4, v212.type, 0 << ((v212.type - 5121) >> 1), v213);
     }
     else {
      v99.drawArraysInstancedANGLE(5, 0, 4, v213);
     }
    }
    else if (v213 < 0) {
     if (v212) {
      v8.drawElements(5, 4, v212.type, 0 << ((v212.type - 5121) >> 1));
     }
     else {
      v8.drawArrays(5, 0, 4);
     }
    }
    v3.dirty = true;
    v15.setVAO(null);
    v2.viewportWidth = v91;
    v2.viewportHeight = v92;
    if (v101) {
     v1.destroyStream(v102);
    }
    if (v118) {
     v1.destroyStream(v119);
    }
    if (v135) {
     v1.destroyStream(v136);
    }
    if (v152) {
     v1.destroyStream(v153);
    }
    if (v169) {
     v1.destroyStream(v170);
    }
    v211.unbind();
   }
   , 'scope': function (a0, a1, a2) {
    var v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225, v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267, v268, v269, v270, v271, v272, v273, v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301, v302, v303, v304, v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360, v361, v362, v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387, v388, v389, v390, v391, v392, v393, v394, v395, v396, v397, v398, v399, v400, v401, v402, v403, v404, v405, v406, v407, v408, v409, v410, v411, v412, v413, v414, v415, v416, v417, v418, v419, v420, v421, v422, v423, v424, v425, v426, v427, v428, v429, v430, v431, v432, v433, v434, v435, v436, v437;
    v214 = a0['viewport'];
    v215 = v214.x | 0;
    v216 = v214.y | 0;
    v217 = 'width' in v214 ? v214.width | 0 : (v2.framebufferWidth - v215);
    v218 = 'height' in v214 ? v214.height | 0 : (v2.framebufferHeight - v216);
    v219 = v2.viewportWidth;
    v2.viewportWidth = v217;
    v220 = v2.viewportHeight;
    v2.viewportHeight = v218;
    v221 = v38[0];
    v38[0] = v215;
    v222 = v38[1];
    v38[1] = v216;
    v223 = v38[2];
    v38[2] = v217;
    v224 = v38[3];
    v38[3] = v218;
    v225 = v16[0];
    v16[0] = 0;
    v226 = v16[1];
    v16[1] = 0;
    v227 = v16[2];
    v16[2] = 0;
    v228 = v16[3];
    v16[3] = 0;
    v229 = v10.blend_enable;
    v10.blend_enable = true;
    v230 = v18[0];
    v18[0] = 32774;
    v231 = v18[1];
    v18[1] = 32774;
    v232 = v20[0];
    v20[0] = 770;
    v233 = v20[1];
    v20[1] = 771;
    v234 = v20[2];
    v20[2] = 773;
    v235 = v20[3];
    v20[3] = 1;
    v236 = $7.call(this, v2, a0, a2);
    v237 = v10.depth_enable;
    v10.depth_enable = v236;
    v238 = a0['viewport'];
    v239 = v238.x | 0;
    v240 = v238.y | 0;
    v241 = 'width' in v238 ? v238.width | 0 : (v2.framebufferWidth - v239);
    v242 = 'height' in v238 ? v238.height | 0 : (v2.framebufferHeight - v240);
    v243 = v30[0];
    v30[0] = v239;
    v244 = v30[1];
    v30[1] = v240;
    v245 = v30[2];
    v30[2] = v241;
    v246 = v30[3];
    v30[3] = v242;
    v247 = v10.scissor_enable;
    v10.scissor_enable = true;
    v248 = v10.stencil_enable;
    v10.stencil_enable = false;
    v249 = v4.offset;
    v4.offset = 0;
    v250 = v4.count;
    v4.count = 4;
    v251 = a0['count'];
    v252 = v4.instances;
    v4.instances = v251;
    v253 = v4.primitive;
    v4.primitive = 5;
    v254 = a0['dashLength'];
    v255 = v14[23];
    v14[23] = v254;
    v256 = a0['dashTexture'];
    v257 = v14[24];
    v14[24] = v256;
    v258 = a0['depth'];
    v259 = v14[22];
    v14[22] = v258;
    v260 = a0['id'];
    v261 = v14[31];
    v14[31] = v260;
    v262 = a0['miterLimit'];
    v263 = v14[32];
    v14[32] = v262;
    v264 = $8.call(this, v2, a0, a2);
    v265 = v14[33];
    v14[33] = v264;
    v266 = a0['opacity'];
    v267 = v14[10];
    v14[10] = v266;
    v268 = v2['pixelRatio'];
    v269 = v14[34];
    v14[34] = v268;
    v270 = a0['scale'];
    v271 = v14[6];
    v14[6] = v270;
    v272 = a0['scaleFract'];
    v273 = v14[7];
    v14[7] = v272;
    v274 = a0['thickness'];
    v275 = v14[21];
    v14[21] = v274;
    v276 = a0['translate'];
    v277 = v14[8];
    v14[8] = v276;
    v278 = a0['translateFract'];
    v279 = v14[9];
    v14[9] = v278;
    v280 = $9.call(this, v2, a0, a2);
    v281 = v14[3];
    v14[3] = v280;
    v282 = a0['positionBuffer'];
    v47.buffer = v282;
    v283 = false;
    v284 = null;
    v285 = 0;
    v286 = false;
    v287 = 0;
    v288 = 0;
    v289 = 1;
    v290 = 0;
    v291 = 5126;
    v292 = 0;
    v293 = 0;
    v294 = 0;
    v295 = 0;
    if (v9(v47)) {
     v283 = true;
     v284 = v1.createStream(34962, v47);
     v291 = v284.dtype;
    }
    else {
     v284 = v1.getBuffer(v47);
     if (v284) {
      v291 = v284.dtype;
     }
     else if ('constant' in v47) {
      v289 = 2;
      if (typeof v47.constant === 'number') {
       v293 = v47.constant;
       v294 = v295 = v292 = 0;
      }
      else {
       v293 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v294 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v295 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v292 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v284 = v1.createStream(34962, v47.buffer);
      }
      else {
       v284 = v1.getBuffer(v47.buffer);
      }
      v291 = 'type' in v47 ? v43[v47.type] : v284.dtype;
      v286 = !!v47.normalized;
      v288 = v47.size | 0;
      v287 = v47.offset | 0;
      v290 = v47.stride | 0;
      v285 = v47.divisor | 0;
     }
    }
    v296 = $10.buffer;
    $10.buffer = v284;
    v297 = $10.divisor;
    $10.divisor = v285;
    v298 = $10.normalized;
    $10.normalized = v286;
    v299 = $10.offset;
    $10.offset = v287;
    v300 = $10.size;
    $10.size = v288;
    v301 = $10.state;
    $10.state = v289;
    v302 = $10.stride;
    $10.stride = v290;
    v303 = $10.type;
    $10.type = v291;
    v304 = $10.w;
    $10.w = v292;
    v305 = $10.x;
    $10.x = v293;
    v306 = $10.y;
    $10.y = v294;
    v307 = $10.z;
    $10.z = v295;
    v308 = a0['positionFractBuffer'];
    v48.buffer = v308;
    v309 = false;
    v310 = null;
    v311 = 0;
    v312 = false;
    v313 = 0;
    v314 = 0;
    v315 = 1;
    v316 = 0;
    v317 = 5126;
    v318 = 0;
    v319 = 0;
    v320 = 0;
    v321 = 0;
    if (v9(v48)) {
     v309 = true;
     v310 = v1.createStream(34962, v48);
     v317 = v310.dtype;
    }
    else {
     v310 = v1.getBuffer(v48);
     if (v310) {
      v317 = v310.dtype;
     }
     else if ('constant' in v48) {
      v315 = 2;
      if (typeof v48.constant === 'number') {
       v319 = v48.constant;
       v320 = v321 = v318 = 0;
      }
      else {
       v319 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v320 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v321 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v318 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v310 = v1.createStream(34962, v48.buffer);
      }
      else {
       v310 = v1.getBuffer(v48.buffer);
      }
      v317 = 'type' in v48 ? v43[v48.type] : v310.dtype;
      v312 = !!v48.normalized;
      v314 = v48.size | 0;
      v313 = v48.offset | 0;
      v316 = v48.stride | 0;
      v311 = v48.divisor | 0;
     }
    }
    v322 = $11.buffer;
    $11.buffer = v310;
    v323 = $11.divisor;
    $11.divisor = v311;
    v324 = $11.normalized;
    $11.normalized = v312;
    v325 = $11.offset;
    $11.offset = v313;
    v326 = $11.size;
    $11.size = v314;
    v327 = $11.state;
    $11.state = v315;
    v328 = $11.stride;
    $11.stride = v316;
    v329 = $11.type;
    $11.type = v317;
    v330 = $11.w;
    $11.w = v318;
    v331 = $11.x;
    $11.x = v319;
    v332 = $11.y;
    $11.y = v320;
    v333 = $11.z;
    $11.z = v321;
    v334 = a0['positionBuffer'];
    v49.buffer = v334;
    v335 = false;
    v336 = null;
    v337 = 0;
    v338 = false;
    v339 = 0;
    v340 = 0;
    v341 = 1;
    v342 = 0;
    v343 = 5126;
    v344 = 0;
    v345 = 0;
    v346 = 0;
    v347 = 0;
    if (v9(v49)) {
     v335 = true;
     v336 = v1.createStream(34962, v49);
     v343 = v336.dtype;
    }
    else {
     v336 = v1.getBuffer(v49);
     if (v336) {
      v343 = v336.dtype;
     }
     else if ('constant' in v49) {
      v341 = 2;
      if (typeof v49.constant === 'number') {
       v345 = v49.constant;
       v346 = v347 = v344 = 0;
      }
      else {
       v345 = v49.constant.length > 0 ? v49.constant[0] : 0;
       v346 = v49.constant.length > 1 ? v49.constant[1] : 0;
       v347 = v49.constant.length > 2 ? v49.constant[2] : 0;
       v344 = v49.constant.length > 3 ? v49.constant[3] : 0;
      }
     }
     else {
      if (v9(v49.buffer)) {
       v336 = v1.createStream(34962, v49.buffer);
      }
      else {
       v336 = v1.getBuffer(v49.buffer);
      }
      v343 = 'type' in v49 ? v43[v49.type] : v336.dtype;
      v338 = !!v49.normalized;
      v340 = v49.size | 0;
      v339 = v49.offset | 0;
      v342 = v49.stride | 0;
      v337 = v49.divisor | 0;
     }
    }
    v348 = $12.buffer;
    $12.buffer = v336;
    v349 = $12.divisor;
    $12.divisor = v337;
    v350 = $12.normalized;
    $12.normalized = v338;
    v351 = $12.offset;
    $12.offset = v339;
    v352 = $12.size;
    $12.size = v340;
    v353 = $12.state;
    $12.state = v341;
    v354 = $12.stride;
    $12.stride = v342;
    v355 = $12.type;
    $12.type = v343;
    v356 = $12.w;
    $12.w = v344;
    v357 = $12.x;
    $12.x = v345;
    v358 = $12.y;
    $12.y = v346;
    v359 = $12.z;
    $12.z = v347;
    v360 = a0['positionFractBuffer'];
    v50.buffer = v360;
    v361 = false;
    v362 = null;
    v363 = 0;
    v364 = false;
    v365 = 0;
    v366 = 0;
    v367 = 1;
    v368 = 0;
    v369 = 5126;
    v370 = 0;
    v371 = 0;
    v372 = 0;
    v373 = 0;
    if (v9(v50)) {
     v361 = true;
     v362 = v1.createStream(34962, v50);
     v369 = v362.dtype;
    }
    else {
     v362 = v1.getBuffer(v50);
     if (v362) {
      v369 = v362.dtype;
     }
     else if ('constant' in v50) {
      v367 = 2;
      if (typeof v50.constant === 'number') {
       v371 = v50.constant;
       v372 = v373 = v370 = 0;
      }
      else {
       v371 = v50.constant.length > 0 ? v50.constant[0] : 0;
       v372 = v50.constant.length > 1 ? v50.constant[1] : 0;
       v373 = v50.constant.length > 2 ? v50.constant[2] : 0;
       v370 = v50.constant.length > 3 ? v50.constant[3] : 0;
      }
     }
     else {
      if (v9(v50.buffer)) {
       v362 = v1.createStream(34962, v50.buffer);
      }
      else {
       v362 = v1.getBuffer(v50.buffer);
      }
      v369 = 'type' in v50 ? v43[v50.type] : v362.dtype;
      v364 = !!v50.normalized;
      v366 = v50.size | 0;
      v365 = v50.offset | 0;
      v368 = v50.stride | 0;
      v363 = v50.divisor | 0;
     }
    }
    v374 = $13.buffer;
    $13.buffer = v362;
    v375 = $13.divisor;
    $13.divisor = v363;
    v376 = $13.normalized;
    $13.normalized = v364;
    v377 = $13.offset;
    $13.offset = v365;
    v378 = $13.size;
    $13.size = v366;
    v379 = $13.state;
    $13.state = v367;
    v380 = $13.stride;
    $13.stride = v368;
    v381 = $13.type;
    $13.type = v369;
    v382 = $13.w;
    $13.w = v370;
    v383 = $13.x;
    $13.x = v371;
    v384 = $13.y;
    $13.y = v372;
    v385 = $13.z;
    $13.z = v373;
    v386 = a0['colorBuffer'];
    v51.buffer = v386;
    v387 = false;
    v388 = null;
    v389 = 0;
    v390 = false;
    v391 = 0;
    v392 = 0;
    v393 = 1;
    v394 = 0;
    v395 = 5126;
    v396 = 0;
    v397 = 0;
    v398 = 0;
    v399 = 0;
    if (v9(v51)) {
     v387 = true;
     v388 = v1.createStream(34962, v51);
     v395 = v388.dtype;
    }
    else {
     v388 = v1.getBuffer(v51);
     if (v388) {
      v395 = v388.dtype;
     }
     else if ('constant' in v51) {
      v393 = 2;
      if (typeof v51.constant === 'number') {
       v397 = v51.constant;
       v398 = v399 = v396 = 0;
      }
      else {
       v397 = v51.constant.length > 0 ? v51.constant[0] : 0;
       v398 = v51.constant.length > 1 ? v51.constant[1] : 0;
       v399 = v51.constant.length > 2 ? v51.constant[2] : 0;
       v396 = v51.constant.length > 3 ? v51.constant[3] : 0;
      }
     }
     else {
      if (v9(v51.buffer)) {
       v388 = v1.createStream(34962, v51.buffer);
      }
      else {
       v388 = v1.getBuffer(v51.buffer);
      }
      v395 = 'type' in v51 ? v43[v51.type] : v388.dtype;
      v390 = !!v51.normalized;
      v392 = v51.size | 0;
      v391 = v51.offset | 0;
      v394 = v51.stride | 0;
      v389 = v51.divisor | 0;
     }
    }
    v400 = $14.buffer;
    $14.buffer = v388;
    v401 = $14.divisor;
    $14.divisor = v389;
    v402 = $14.normalized;
    $14.normalized = v390;
    v403 = $14.offset;
    $14.offset = v391;
    v404 = $14.size;
    $14.size = v392;
    v405 = $14.state;
    $14.state = v393;
    v406 = $14.stride;
    $14.stride = v394;
    v407 = $14.type;
    $14.type = v395;
    v408 = $14.w;
    $14.w = v396;
    v409 = $14.x;
    $14.x = v397;
    v410 = $14.y;
    $14.y = v398;
    v411 = $14.z;
    $14.z = v399;
    v412 = $15.buffer;
    $15.buffer = $4;
    v413 = $15.divisor;
    $15.divisor = 0;
    v414 = $15.normalized;
    $15.normalized = false;
    v415 = $15.offset;
    $15.offset = 0;
    v416 = $15.size;
    $15.size = 0;
    v417 = $15.state;
    $15.state = 1;
    v418 = $15.stride;
    $15.stride = 8;
    v419 = $15.type;
    $15.type = 5126;
    v420 = $15.w;
    $15.w = 0;
    v421 = $15.x;
    $15.x = 0;
    v422 = $15.y;
    $15.y = 0;
    v423 = $15.z;
    $15.z = 0;
    v424 = $16.buffer;
    $16.buffer = $5;
    v425 = $16.divisor;
    $16.divisor = 0;
    v426 = $16.normalized;
    $16.normalized = false;
    v427 = $16.offset;
    $16.offset = 4;
    v428 = $16.size;
    $16.size = 0;
    v429 = $16.state;
    $16.state = 1;
    v430 = $16.stride;
    $16.stride = 8;
    v431 = $16.type;
    $16.type = 5126;
    v432 = $16.w;
    $16.w = 0;
    v433 = $16.x;
    $16.x = 0;
    v434 = $16.y;
    $16.y = 0;
    v435 = $16.z;
    $16.z = 0;
    v436 = v11.vert;
    v11.vert = 20;
    v437 = v11.frag;
    v11.frag = 19;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v219;
    v2.viewportHeight = v220;
    v38[0] = v221;
    v38[1] = v222;
    v38[2] = v223;
    v38[3] = v224;
    v16[0] = v225;
    v16[1] = v226;
    v16[2] = v227;
    v16[3] = v228;
    v10.blend_enable = v229;
    v18[0] = v230;
    v18[1] = v231;
    v20[0] = v232;
    v20[1] = v233;
    v20[2] = v234;
    v20[3] = v235;
    v10.depth_enable = v237;
    v30[0] = v243;
    v30[1] = v244;
    v30[2] = v245;
    v30[3] = v246;
    v10.scissor_enable = v247;
    v10.stencil_enable = v248;
    v4.offset = v249;
    v4.count = v250;
    v4.instances = v252;
    v4.primitive = v253;
    v14[23] = v255;
    v14[24] = v257;
    v14[22] = v259;
    v14[31] = v261;
    v14[32] = v263;
    v14[33] = v265;
    v14[10] = v267;
    v14[34] = v269;
    v14[6] = v271;
    v14[7] = v273;
    v14[21] = v275;
    v14[8] = v277;
    v14[9] = v279;
    v14[3] = v281;
    if (v283) {
     v1.destroyStream(v284);
    }
    $10.buffer = v296;
    $10.divisor = v297;
    $10.normalized = v298;
    $10.offset = v299;
    $10.size = v300;
    $10.state = v301;
    $10.stride = v302;
    $10.type = v303;
    $10.w = v304;
    $10.x = v305;
    $10.y = v306;
    $10.z = v307;
    if (v309) {
     v1.destroyStream(v310);
    }
    $11.buffer = v322;
    $11.divisor = v323;
    $11.normalized = v324;
    $11.offset = v325;
    $11.size = v326;
    $11.state = v327;
    $11.stride = v328;
    $11.type = v329;
    $11.w = v330;
    $11.x = v331;
    $11.y = v332;
    $11.z = v333;
    if (v335) {
     v1.destroyStream(v336);
    }
    $12.buffer = v348;
    $12.divisor = v349;
    $12.normalized = v350;
    $12.offset = v351;
    $12.size = v352;
    $12.state = v353;
    $12.stride = v354;
    $12.type = v355;
    $12.w = v356;
    $12.x = v357;
    $12.y = v358;
    $12.z = v359;
    if (v361) {
     v1.destroyStream(v362);
    }
    $13.buffer = v374;
    $13.divisor = v375;
    $13.normalized = v376;
    $13.offset = v377;
    $13.size = v378;
    $13.state = v379;
    $13.stride = v380;
    $13.type = v381;
    $13.w = v382;
    $13.x = v383;
    $13.y = v384;
    $13.z = v385;
    if (v387) {
     v1.destroyStream(v388);
    }
    $14.buffer = v400;
    $14.divisor = v401;
    $14.normalized = v402;
    $14.offset = v403;
    $14.size = v404;
    $14.state = v405;
    $14.stride = v406;
    $14.type = v407;
    $14.w = v408;
    $14.x = v409;
    $14.y = v410;
    $14.z = v411;
    $15.buffer = v412;
    $15.divisor = v413;
    $15.normalized = v414;
    $15.offset = v415;
    $15.size = v416;
    $15.state = v417;
    $15.stride = v418;
    $15.type = v419;
    $15.w = v420;
    $15.x = v421;
    $15.y = v422;
    $15.z = v423;
    $16.buffer = v424;
    $16.divisor = v425;
    $16.normalized = v426;
    $16.offset = v427;
    $16.size = v428;
    $16.state = v429;
    $16.stride = v430;
    $16.type = v431;
    $16.w = v432;
    $16.x = v433;
    $16.y = v434;
    $16.z = v435;
    v11.vert = v436;
    v11.frag = v437;
    v3.dirty = true;
   }
   ,
  }

 },
 '$22,aColor,aCoord,bColor,bCoord,dashLength,dashTexture,depth,lineEnd,lineTop,miterLimit,miterMode,nextCoord,opacity,prevCoord,scale,thickness,translate,viewport': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, aColor, aCoord, bColor, bCoord, dashLength, dashTexture, depth, lineEnd, lineTop, miterLimit, miterMode, nextCoord, opacity, prevCoord, scale, thickness, translate, viewport
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48, v49, v50, v51, v52;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v47 = {
  }
   ;
  v47.divisor = 1;
  v47.offset = 0;
  v47.stride = 4;
  v48 = {
  }
   ;
  v48.divisor = 1;
  v48.offset = 8;
  v48.stride = 8;
  v49 = {
  }
   ;
  v49.divisor = 1;
  v49.offset = 4;
  v49.stride = 4;
  v50 = {
  }
   ;
  v50.divisor = 1;
  v50.offset = 16;
  v50.stride = 8;
  v51 = {
  }
   ;
  v51.divisor = 1;
  v51.offset = 24;
  v51.stride = 8;
  v52 = {
  }
   ;
  v52.divisor = 1;
  v52.offset = 0;
  v52.stride = 8;
  return {
   'batch': function (a0, a1) {
    var v478, v479, v510, v511, v512;
    v478 = v6.angle_instanced_arrays;
    v479 = v7.next;
    if (v479 !== v7.cur) {
     if (v479) {
      v8.bindFramebuffer(36160, v479.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v479;
    }
    if (v3.dirty) {
     var v480, v481, v482, v483, v484, v485, v486, v487, v488, v489, v490, v491, v492, v493, v494, v495, v496, v497, v498, v499, v500, v501, v502, v503, v504, v505, v506, v507, v508, v509;
     v480 = v10.dither;
     if (v480 !== v3.dither) {
      if (v480) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v480;
     }
     v481 = v10.depth_func;
     if (v481 !== v3.depth_func) {
      v8.depthFunc(v481);
      v3.depth_func = v481;
     }
     v482 = v24[0];
     v483 = v24[1];
     if (v482 !== v25[0] || v483 !== v25[1]) {
      v8.depthRange(v482, v483);
      v25[0] = v482;
      v25[1] = v483;
     }
     v484 = v10.depth_mask;
     if (v484 !== v3.depth_mask) {
      v8.depthMask(v484);
      v3.depth_mask = v484;
     }
     v485 = v22[0];
     v486 = v22[1];
     v487 = v22[2];
     v488 = v22[3];
     if (v485 !== v23[0] || v486 !== v23[1] || v487 !== v23[2] || v488 !== v23[3]) {
      v8.colorMask(v485, v486, v487, v488);
      v23[0] = v485;
      v23[1] = v486;
      v23[2] = v487;
      v23[3] = v488;
     }
     v489 = v10.frontFace;
     if (v489 !== v3.frontFace) {
      v8.frontFace(v489);
      v3.frontFace = v489;
     }
     v490 = v10.lineWidth;
     if (v490 !== v3.lineWidth) {
      v8.lineWidth(v490);
      v3.lineWidth = v490;
     }
     v491 = v10.polygonOffset_enable;
     if (v491 !== v3.polygonOffset_enable) {
      if (v491) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v491;
     }
     v492 = v26[0];
     v493 = v26[1];
     if (v492 !== v27[0] || v493 !== v27[1]) {
      v8.polygonOffset(v492, v493);
      v27[0] = v492;
      v27[1] = v493;
     }
     v494 = v10.sample_alpha;
     if (v494 !== v3.sample_alpha) {
      if (v494) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v494;
     }
     v495 = v10.sample_enable;
     if (v495 !== v3.sample_enable) {
      if (v495) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v495;
     }
     v496 = v28[0];
     v497 = v28[1];
     if (v496 !== v29[0] || v497 !== v29[1]) {
      v8.sampleCoverage(v496, v497);
      v29[0] = v496;
      v29[1] = v497;
     }
     v498 = v10.stencil_mask;
     if (v498 !== v3.stencil_mask) {
      v8.stencilMask(v498);
      v3.stencil_mask = v498;
     }
     v499 = v32[0];
     v500 = v32[1];
     v501 = v32[2];
     if (v499 !== v33[0] || v500 !== v33[1] || v501 !== v33[2]) {
      v8.stencilFunc(v499, v500, v501);
      v33[0] = v499;
      v33[1] = v500;
      v33[2] = v501;
     }
     v502 = v36[0];
     v503 = v36[1];
     v504 = v36[2];
     v505 = v36[3];
     if (v502 !== v37[0] || v503 !== v37[1] || v504 !== v37[2] || v505 !== v37[3]) {
      v8.stencilOpSeparate(v502, v503, v504, v505);
      v37[0] = v502;
      v37[1] = v503;
      v37[2] = v504;
      v37[3] = v505;
     }
     v506 = v34[0];
     v507 = v34[1];
     v508 = v34[2];
     v509 = v34[3];
     if (v506 !== v35[0] || v507 !== v35[1] || v508 !== v35[2] || v509 !== v35[3]) {
      v8.stencilOpSeparate(v506, v507, v508, v509);
      v35[0] = v506;
      v35[1] = v507;
      v35[2] = v508;
      v35[3] = v509;
     }
    }
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.enable(2884);
    v3.cull_enable = true;
    v8.cullFace(1029);
    v3.cull_face = 1029;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($19.program);
    v510 = v6.angle_instanced_arrays;
    var v526, v527, v528, v529, v665;
    v15.setVAO(null);
    v526 = lineEnd.location;
    v527 = v0[v526];
    if (!v527.buffer) {
     v8.enableVertexAttribArray(v526);
    }
    if (v527.type !== 5126 || v527.size !== 1 || v527.buffer !== $4 || v527.normalized !== false || v527.offset !== 0 || v527.stride !== 8) {
     v8.bindBuffer(34962, $4.buffer);
     v8.vertexAttribPointer(v526, 1, 5126, false, 8, 0);
     v527.type = 5126;
     v527.size = 1;
     v527.buffer = $4;
     v527.normalized = false;
     v527.offset = 0;
     v527.stride = 8;
    }
    if (v527.divisor !== 0) {
     v510.vertexAttribDivisorANGLE(v526, 0);
     v527.divisor = 0;
    }
    v528 = lineTop.location;
    v529 = v0[v528];
    if (!v529.buffer) {
     v8.enableVertexAttribArray(v528);
    }
    if (v529.type !== 5126 || v529.size !== 1 || v529.buffer !== $5 || v529.normalized !== false || v529.offset !== 4 || v529.stride !== 8) {
     v8.bindBuffer(34962, $5.buffer);
     v8.vertexAttribPointer(v528, 1, 5126, false, 8, 4);
     v529.type = 5126;
     v529.size = 1;
     v529.buffer = $5;
     v529.normalized = false;
     v529.offset = 4;
     v529.stride = 8;
    }
    if (v529.divisor !== 0) {
     v510.vertexAttribDivisorANGLE(v528, 0);
     v529.divisor = 0;
    }
    v665 = v4.elements;
    if (v665) {
     v8.bindBuffer(34963, v665.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v665 = v5.getElements(v15.currentVAO.elements);
     if (v665) v8.bindBuffer(34963, v665.buffer.buffer);
    }
    for (v511 = 0;
     v511 < a1;
     ++v511) {
     v512 = a0[v511];
     var v513, v514, v515, v516, v517, v518, v519, v520, v521, v522, v523, v524, v525, v530, v531, v532, v533, v534, v535, v536, v537, v538, v539, v540, v541, v542, v543, v544, v545, v546, v547, v548, v549, v550, v551, v552, v553, v554, v555, v556, v557, v558, v559, v560, v561, v562, v563, v564, v565, v566, v567, v568, v569, v570, v571, v572, v573, v574, v575, v576, v577, v578, v579, v580, v581, v582, v583, v584, v585, v586, v587, v588, v589, v590, v591, v592, v593, v594, v595, v596, v597, v598, v599, v600, v601, v602, v603, v604, v605, v606, v607, v608, v609, v610, v611, v612, v613, v614, v615, v616, v617, v618, v619, v620, v621, v622, v623, v624, v625, v626, v627, v628, v629, v630, v631, v632, v633, v634, v635, v636, v637, v638, v639, v640, v641, v642, v643, v644, v645, v646, v647, v648, v649, v650, v651, v652, v653, v654, v655, v656, v657, v658, v659, v660, v661, v662, v663, v664, v666;
     v513 = v512['viewport'];
     v514 = v513.x | 0;
     v515 = v513.y | 0;
     v516 = 'width' in v513 ? v513.width | 0 : (v2.framebufferWidth - v514);
     v517 = 'height' in v513 ? v513.height | 0 : (v2.framebufferHeight - v515);
     v518 = v2.viewportWidth;
     v2.viewportWidth = v516;
     v519 = v2.viewportHeight;
     v2.viewportHeight = v517;
     v8.viewport(v514, v515, v516, v517);
     v39[0] = v514;
     v39[1] = v515;
     v39[2] = v516;
     v39[3] = v517;
     v520 = $20.call(this, v2, v512, v511);
     if (v520) {
      v8.enable(2929);
     }
     else {
      v8.disable(2929);
     }
     v3.depth_enable = v520;
     v521 = v512['viewport'];
     v522 = v521.x | 0;
     v523 = v521.y | 0;
     v524 = 'width' in v521 ? v521.width | 0 : (v2.framebufferWidth - v522);
     v525 = 'height' in v521 ? v521.height | 0 : (v2.framebufferHeight - v523);
     v8.scissor(v522, v523, v524, v525);
     v31[0] = v522;
     v31[1] = v523;
     v31[2] = v524;
     v31[3] = v525;
     v530 = v512['positionBuffer'];
     v48.buffer = v530;
     v531 = false;
     v532 = null;
     v533 = 0;
     v534 = false;
     v535 = 0;
     v536 = 0;
     v537 = 1;
     v538 = 0;
     v539 = 5126;
     v540 = 0;
     v541 = 0;
     v542 = 0;
     v543 = 0;
     if (v9(v48)) {
      v531 = true;
      v532 = v1.createStream(34962, v48);
      v539 = v532.dtype;
     }
     else {
      v532 = v1.getBuffer(v48);
      if (v532) {
       v539 = v532.dtype;
      }
      else if ('constant' in v48) {
       v537 = 2;
       if (typeof v48.constant === 'number') {
        v541 = v48.constant;
        v542 = v543 = v540 = 0;
       }
       else {
        v541 = v48.constant.length > 0 ? v48.constant[0] : 0;
        v542 = v48.constant.length > 1 ? v48.constant[1] : 0;
        v543 = v48.constant.length > 2 ? v48.constant[2] : 0;
        v540 = v48.constant.length > 3 ? v48.constant[3] : 0;
       }
      }
      else {
       if (v9(v48.buffer)) {
        v532 = v1.createStream(34962, v48.buffer);
       }
       else {
        v532 = v1.getBuffer(v48.buffer);
       }
       v539 = 'type' in v48 ? v43[v48.type] : v532.dtype;
       v534 = !!v48.normalized;
       v536 = v48.size | 0;
       v535 = v48.offset | 0;
       v538 = v48.stride | 0;
       v533 = v48.divisor | 0;
      }
     }
     v544 = aCoord.location;
     v545 = v0[v544];
     if (v537 === 1) {
      if (!v545.buffer) {
       v8.enableVertexAttribArray(v544);
      }
      v546 = v536 || 2;
      if (v545.type !== v539 || v545.size !== v546 || v545.buffer !== v532 || v545.normalized !== v534 || v545.offset !== v535 || v545.stride !== v538) {
       v8.bindBuffer(34962, v532.buffer);
       v8.vertexAttribPointer(v544, v546, v539, v534, v538, v535);
       v545.type = v539;
       v545.size = v546;
       v545.buffer = v532;
       v545.normalized = v534;
       v545.offset = v535;
       v545.stride = v538;
      }
      if (v545.divisor !== v533) {
       v510.vertexAttribDivisorANGLE(v544, v533);
       v545.divisor = v533;
      }
     }
     else {
      if (v545.buffer) {
       v8.disableVertexAttribArray(v544);
       v545.buffer = null;
      }
      if (v545.x !== v541 || v545.y !== v542 || v545.z !== v543 || v545.w !== v540) {
       v8.vertexAttrib4f(v544, v541, v542, v543, v540);
       v545.x = v541;
       v545.y = v542;
       v545.z = v543;
       v545.w = v540;
      }
     }
     v547 = v512['positionBuffer'];
     v50.buffer = v547;
     v548 = false;
     v549 = null;
     v550 = 0;
     v551 = false;
     v552 = 0;
     v553 = 0;
     v554 = 1;
     v555 = 0;
     v556 = 5126;
     v557 = 0;
     v558 = 0;
     v559 = 0;
     v560 = 0;
     if (v9(v50)) {
      v548 = true;
      v549 = v1.createStream(34962, v50);
      v556 = v549.dtype;
     }
     else {
      v549 = v1.getBuffer(v50);
      if (v549) {
       v556 = v549.dtype;
      }
      else if ('constant' in v50) {
       v554 = 2;
       if (typeof v50.constant === 'number') {
        v558 = v50.constant;
        v559 = v560 = v557 = 0;
       }
       else {
        v558 = v50.constant.length > 0 ? v50.constant[0] : 0;
        v559 = v50.constant.length > 1 ? v50.constant[1] : 0;
        v560 = v50.constant.length > 2 ? v50.constant[2] : 0;
        v557 = v50.constant.length > 3 ? v50.constant[3] : 0;
       }
      }
      else {
       if (v9(v50.buffer)) {
        v549 = v1.createStream(34962, v50.buffer);
       }
       else {
        v549 = v1.getBuffer(v50.buffer);
       }
       v556 = 'type' in v50 ? v43[v50.type] : v549.dtype;
       v551 = !!v50.normalized;
       v553 = v50.size | 0;
       v552 = v50.offset | 0;
       v555 = v50.stride | 0;
       v550 = v50.divisor | 0;
      }
     }
     v561 = bCoord.location;
     v562 = v0[v561];
     if (v554 === 1) {
      if (!v562.buffer) {
       v8.enableVertexAttribArray(v561);
      }
      v563 = v553 || 2;
      if (v562.type !== v556 || v562.size !== v563 || v562.buffer !== v549 || v562.normalized !== v551 || v562.offset !== v552 || v562.stride !== v555) {
       v8.bindBuffer(34962, v549.buffer);
       v8.vertexAttribPointer(v561, v563, v556, v551, v555, v552);
       v562.type = v556;
       v562.size = v563;
       v562.buffer = v549;
       v562.normalized = v551;
       v562.offset = v552;
       v562.stride = v555;
      }
      if (v562.divisor !== v550) {
       v510.vertexAttribDivisorANGLE(v561, v550);
       v562.divisor = v550;
      }
     }
     else {
      if (v562.buffer) {
       v8.disableVertexAttribArray(v561);
       v562.buffer = null;
      }
      if (v562.x !== v558 || v562.y !== v559 || v562.z !== v560 || v562.w !== v557) {
       v8.vertexAttrib4f(v561, v558, v559, v560, v557);
       v562.x = v558;
       v562.y = v559;
       v562.z = v560;
       v562.w = v557;
      }
     }
     v564 = v512['positionBuffer'];
     v51.buffer = v564;
     v565 = false;
     v566 = null;
     v567 = 0;
     v568 = false;
     v569 = 0;
     v570 = 0;
     v571 = 1;
     v572 = 0;
     v573 = 5126;
     v574 = 0;
     v575 = 0;
     v576 = 0;
     v577 = 0;
     if (v9(v51)) {
      v565 = true;
      v566 = v1.createStream(34962, v51);
      v573 = v566.dtype;
     }
     else {
      v566 = v1.getBuffer(v51);
      if (v566) {
       v573 = v566.dtype;
      }
      else if ('constant' in v51) {
       v571 = 2;
       if (typeof v51.constant === 'number') {
        v575 = v51.constant;
        v576 = v577 = v574 = 0;
       }
       else {
        v575 = v51.constant.length > 0 ? v51.constant[0] : 0;
        v576 = v51.constant.length > 1 ? v51.constant[1] : 0;
        v577 = v51.constant.length > 2 ? v51.constant[2] : 0;
        v574 = v51.constant.length > 3 ? v51.constant[3] : 0;
       }
      }
      else {
       if (v9(v51.buffer)) {
        v566 = v1.createStream(34962, v51.buffer);
       }
       else {
        v566 = v1.getBuffer(v51.buffer);
       }
       v573 = 'type' in v51 ? v43[v51.type] : v566.dtype;
       v568 = !!v51.normalized;
       v570 = v51.size | 0;
       v569 = v51.offset | 0;
       v572 = v51.stride | 0;
       v567 = v51.divisor | 0;
      }
     }
     v578 = nextCoord.location;
     v579 = v0[v578];
     if (v571 === 1) {
      if (!v579.buffer) {
       v8.enableVertexAttribArray(v578);
      }
      v580 = v570 || 2;
      if (v579.type !== v573 || v579.size !== v580 || v579.buffer !== v566 || v579.normalized !== v568 || v579.offset !== v569 || v579.stride !== v572) {
       v8.bindBuffer(34962, v566.buffer);
       v8.vertexAttribPointer(v578, v580, v573, v568, v572, v569);
       v579.type = v573;
       v579.size = v580;
       v579.buffer = v566;
       v579.normalized = v568;
       v579.offset = v569;
       v579.stride = v572;
      }
      if (v579.divisor !== v567) {
       v510.vertexAttribDivisorANGLE(v578, v567);
       v579.divisor = v567;
      }
     }
     else {
      if (v579.buffer) {
       v8.disableVertexAttribArray(v578);
       v579.buffer = null;
      }
      if (v579.x !== v575 || v579.y !== v576 || v579.z !== v577 || v579.w !== v574) {
       v8.vertexAttrib4f(v578, v575, v576, v577, v574);
       v579.x = v575;
       v579.y = v576;
       v579.z = v577;
       v579.w = v574;
      }
     }
     v581 = v512['positionBuffer'];
     v52.buffer = v581;
     v582 = false;
     v583 = null;
     v584 = 0;
     v585 = false;
     v586 = 0;
     v587 = 0;
     v588 = 1;
     v589 = 0;
     v590 = 5126;
     v591 = 0;
     v592 = 0;
     v593 = 0;
     v594 = 0;
     if (v9(v52)) {
      v582 = true;
      v583 = v1.createStream(34962, v52);
      v590 = v583.dtype;
     }
     else {
      v583 = v1.getBuffer(v52);
      if (v583) {
       v590 = v583.dtype;
      }
      else if ('constant' in v52) {
       v588 = 2;
       if (typeof v52.constant === 'number') {
        v592 = v52.constant;
        v593 = v594 = v591 = 0;
       }
       else {
        v592 = v52.constant.length > 0 ? v52.constant[0] : 0;
        v593 = v52.constant.length > 1 ? v52.constant[1] : 0;
        v594 = v52.constant.length > 2 ? v52.constant[2] : 0;
        v591 = v52.constant.length > 3 ? v52.constant[3] : 0;
       }
      }
      else {
       if (v9(v52.buffer)) {
        v583 = v1.createStream(34962, v52.buffer);
       }
       else {
        v583 = v1.getBuffer(v52.buffer);
       }
       v590 = 'type' in v52 ? v43[v52.type] : v583.dtype;
       v585 = !!v52.normalized;
       v587 = v52.size | 0;
       v586 = v52.offset | 0;
       v589 = v52.stride | 0;
       v584 = v52.divisor | 0;
      }
     }
     v595 = prevCoord.location;
     v596 = v0[v595];
     if (v588 === 1) {
      if (!v596.buffer) {
       v8.enableVertexAttribArray(v595);
      }
      v597 = v587 || 2;
      if (v596.type !== v590 || v596.size !== v597 || v596.buffer !== v583 || v596.normalized !== v585 || v596.offset !== v586 || v596.stride !== v589) {
       v8.bindBuffer(34962, v583.buffer);
       v8.vertexAttribPointer(v595, v597, v590, v585, v589, v586);
       v596.type = v590;
       v596.size = v597;
       v596.buffer = v583;
       v596.normalized = v585;
       v596.offset = v586;
       v596.stride = v589;
      }
      if (v596.divisor !== v584) {
       v510.vertexAttribDivisorANGLE(v595, v584);
       v596.divisor = v584;
      }
     }
     else {
      if (v596.buffer) {
       v8.disableVertexAttribArray(v595);
       v596.buffer = null;
      }
      if (v596.x !== v592 || v596.y !== v593 || v596.z !== v594 || v596.w !== v591) {
       v8.vertexAttrib4f(v595, v592, v593, v594, v591);
       v596.x = v592;
       v596.y = v593;
       v596.z = v594;
       v596.w = v591;
      }
     }
     v598 = v512['colorBuffer'];
     v47.buffer = v598;
     v599 = false;
     v600 = null;
     v601 = 0;
     v602 = false;
     v603 = 0;
     v604 = 0;
     v605 = 1;
     v606 = 0;
     v607 = 5126;
     v608 = 0;
     v609 = 0;
     v610 = 0;
     v611 = 0;
     if (v9(v47)) {
      v599 = true;
      v600 = v1.createStream(34962, v47);
      v607 = v600.dtype;
     }
     else {
      v600 = v1.getBuffer(v47);
      if (v600) {
       v607 = v600.dtype;
      }
      else if ('constant' in v47) {
       v605 = 2;
       if (typeof v47.constant === 'number') {
        v609 = v47.constant;
        v610 = v611 = v608 = 0;
       }
       else {
        v609 = v47.constant.length > 0 ? v47.constant[0] : 0;
        v610 = v47.constant.length > 1 ? v47.constant[1] : 0;
        v611 = v47.constant.length > 2 ? v47.constant[2] : 0;
        v608 = v47.constant.length > 3 ? v47.constant[3] : 0;
       }
      }
      else {
       if (v9(v47.buffer)) {
        v600 = v1.createStream(34962, v47.buffer);
       }
       else {
        v600 = v1.getBuffer(v47.buffer);
       }
       v607 = 'type' in v47 ? v43[v47.type] : v600.dtype;
       v602 = !!v47.normalized;
       v604 = v47.size | 0;
       v603 = v47.offset | 0;
       v606 = v47.stride | 0;
       v601 = v47.divisor | 0;
      }
     }
     v612 = aColor.location;
     v613 = v0[v612];
     if (v605 === 1) {
      if (!v613.buffer) {
       v8.enableVertexAttribArray(v612);
      }
      v614 = v604 || 4;
      if (v613.type !== v607 || v613.size !== v614 || v613.buffer !== v600 || v613.normalized !== v602 || v613.offset !== v603 || v613.stride !== v606) {
       v8.bindBuffer(34962, v600.buffer);
       v8.vertexAttribPointer(v612, v614, v607, v602, v606, v603);
       v613.type = v607;
       v613.size = v614;
       v613.buffer = v600;
       v613.normalized = v602;
       v613.offset = v603;
       v613.stride = v606;
      }
      if (v613.divisor !== v601) {
       v510.vertexAttribDivisorANGLE(v612, v601);
       v613.divisor = v601;
      }
     }
     else {
      if (v613.buffer) {
       v8.disableVertexAttribArray(v612);
       v613.buffer = null;
      }
      if (v613.x !== v609 || v613.y !== v610 || v613.z !== v611 || v613.w !== v608) {
       v8.vertexAttrib4f(v612, v609, v610, v611, v608);
       v613.x = v609;
       v613.y = v610;
       v613.z = v611;
       v613.w = v608;
      }
     }
     v615 = v512['colorBuffer'];
     v49.buffer = v615;
     v616 = false;
     v617 = null;
     v618 = 0;
     v619 = false;
     v620 = 0;
     v621 = 0;
     v622 = 1;
     v623 = 0;
     v624 = 5126;
     v625 = 0;
     v626 = 0;
     v627 = 0;
     v628 = 0;
     if (v9(v49)) {
      v616 = true;
      v617 = v1.createStream(34962, v49);
      v624 = v617.dtype;
     }
     else {
      v617 = v1.getBuffer(v49);
      if (v617) {
       v624 = v617.dtype;
      }
      else if ('constant' in v49) {
       v622 = 2;
       if (typeof v49.constant === 'number') {
        v626 = v49.constant;
        v627 = v628 = v625 = 0;
       }
       else {
        v626 = v49.constant.length > 0 ? v49.constant[0] : 0;
        v627 = v49.constant.length > 1 ? v49.constant[1] : 0;
        v628 = v49.constant.length > 2 ? v49.constant[2] : 0;
        v625 = v49.constant.length > 3 ? v49.constant[3] : 0;
       }
      }
      else {
       if (v9(v49.buffer)) {
        v617 = v1.createStream(34962, v49.buffer);
       }
       else {
        v617 = v1.getBuffer(v49.buffer);
       }
       v624 = 'type' in v49 ? v43[v49.type] : v617.dtype;
       v619 = !!v49.normalized;
       v621 = v49.size | 0;
       v620 = v49.offset | 0;
       v623 = v49.stride | 0;
       v618 = v49.divisor | 0;
      }
     }
     v629 = bColor.location;
     v630 = v0[v629];
     if (v622 === 1) {
      if (!v630.buffer) {
       v8.enableVertexAttribArray(v629);
      }
      v631 = v621 || 4;
      if (v630.type !== v624 || v630.size !== v631 || v630.buffer !== v617 || v630.normalized !== v619 || v630.offset !== v620 || v630.stride !== v623) {
       v8.bindBuffer(34962, v617.buffer);
       v8.vertexAttribPointer(v629, v631, v624, v619, v623, v620);
       v630.type = v624;
       v630.size = v631;
       v630.buffer = v617;
       v630.normalized = v619;
       v630.offset = v620;
       v630.stride = v623;
      }
      if (v630.divisor !== v618) {
       v510.vertexAttribDivisorANGLE(v629, v618);
       v630.divisor = v618;
      }
     }
     else {
      if (v630.buffer) {
       v8.disableVertexAttribArray(v629);
       v630.buffer = null;
      }
      if (v630.x !== v626 || v630.y !== v627 || v630.z !== v628 || v630.w !== v625) {
       v8.vertexAttrib4f(v629, v626, v627, v628, v625);
       v630.x = v626;
       v630.y = v627;
       v630.z = v628;
       v630.w = v625;
      }
     }
     v632 = v512['scale'];
     v633 = v632[0];
     v635 = v632[1];
     if (!v511 || v634 !== v633 || v636 !== v635) {
      v634 = v633;
      v636 = v635;
      v8.uniform2f(scale.location, v633, v635);
     }
     v637 = v512['translate'];
     v638 = v637[0];
     v640 = v637[1];
     if (!v511 || v639 !== v638 || v641 !== v640) {
      v639 = v638;
      v641 = v640;
      v8.uniform2f(translate.location, v638, v640);
     }
     v642 = v512['thickness'];
     if (!v511 || v643 !== v642) {
      v643 = v642;
      v8.uniform1f(thickness.location, v642);
     }
     v644 = v512['depth'];
     if (!v511 || v645 !== v644) {
      v645 = v644;
      v8.uniform1f(depth.location, v644);
     }
     v646 = $21.call(this, v2, v512, v511);
     v647 = v646[0];
     v649 = v646[1];
     v651 = v646[2];
     v653 = v646[3];
     if (!v511 || v648 !== v647 || v650 !== v649 || v652 !== v651 || v654 !== v653) {
      v648 = v647;
      v650 = v649;
      v652 = v651;
      v654 = v653;
      v8.uniform4f(viewport.location, v647, v649, v651, v653);
     }
     v655 = v512['miterLimit'];
     if (!v511 || v656 !== v655) {
      v656 = v655;
      v8.uniform1f(miterLimit.location, v655);
     }
     v657 = $22.call(this, v2, v512, v511);
     if (!v511 || v658 !== v657) {
      v658 = v657;
      v8.uniform1f(miterMode.location, v657);
     }
     v659 = v512['dashLength'];
     if (!v511 || v660 !== v659) {
      v660 = v659;
      v8.uniform1f(dashLength.location, v659);
     }
     v661 = v512['opacity'];
     if (!v511 || v662 !== v661) {
      v662 = v661;
      v8.uniform1f(opacity.location, v661);
     }
     v663 = v512['dashTexture'];
     if (v663 && v663._reglType === 'framebuffer') {
      v663 = v663.color[0];
     }
     v664 = v663._texture;
     v8.uniform1i(dashTexture.location, v664.bind());
     v666 = v512['count'];
     if (v666 > 0) {
      if (v665) {
       v510.drawElementsInstancedANGLE(5, 4, v665.type, 0 << ((v665.type - 5121) >> 1), v666);
      }
      else {
       v510.drawArraysInstancedANGLE(5, 0, 4, v666);
      }
     }
     else if (v666 < 0) {
      if (v665) {
       v8.drawElements(5, 4, v665.type, 0 << ((v665.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(5, 0, 4);
      }
     }
     v2.viewportWidth = v518;
     v2.viewportHeight = v519;
     if (v531) {
      v1.destroyStream(v532);
     }
     if (v548) {
      v1.destroyStream(v549);
     }
     if (v565) {
      v1.destroyStream(v566);
     }
     if (v582) {
      v1.destroyStream(v583);
     }
     if (v599) {
      v1.destroyStream(v600);
     }
     if (v616) {
      v1.destroyStream(v617);
     }
     v664.unbind();
    }
    v3.dirty = true;
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v53, v54, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153, v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177, v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195, v196, v197, v198, v199, v200, v201, v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213, v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225;
    v53 = v6.angle_instanced_arrays;
    v54 = v7.next;
    if (v54 !== v7.cur) {
     if (v54) {
      v8.bindFramebuffer(36160, v54.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v54;
    }
    if (v3.dirty) {
     var v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84;
     v55 = v10.dither;
     if (v55 !== v3.dither) {
      if (v55) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v55;
     }
     v56 = v10.depth_func;
     if (v56 !== v3.depth_func) {
      v8.depthFunc(v56);
      v3.depth_func = v56;
     }
     v57 = v24[0];
     v58 = v24[1];
     if (v57 !== v25[0] || v58 !== v25[1]) {
      v8.depthRange(v57, v58);
      v25[0] = v57;
      v25[1] = v58;
     }
     v59 = v10.depth_mask;
     if (v59 !== v3.depth_mask) {
      v8.depthMask(v59);
      v3.depth_mask = v59;
     }
     v60 = v22[0];
     v61 = v22[1];
     v62 = v22[2];
     v63 = v22[3];
     if (v60 !== v23[0] || v61 !== v23[1] || v62 !== v23[2] || v63 !== v23[3]) {
      v8.colorMask(v60, v61, v62, v63);
      v23[0] = v60;
      v23[1] = v61;
      v23[2] = v62;
      v23[3] = v63;
     }
     v64 = v10.frontFace;
     if (v64 !== v3.frontFace) {
      v8.frontFace(v64);
      v3.frontFace = v64;
     }
     v65 = v10.lineWidth;
     if (v65 !== v3.lineWidth) {
      v8.lineWidth(v65);
      v3.lineWidth = v65;
     }
     v66 = v10.polygonOffset_enable;
     if (v66 !== v3.polygonOffset_enable) {
      if (v66) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v66;
     }
     v67 = v26[0];
     v68 = v26[1];
     if (v67 !== v27[0] || v68 !== v27[1]) {
      v8.polygonOffset(v67, v68);
      v27[0] = v67;
      v27[1] = v68;
     }
     v69 = v10.sample_alpha;
     if (v69 !== v3.sample_alpha) {
      if (v69) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v69;
     }
     v70 = v10.sample_enable;
     if (v70 !== v3.sample_enable) {
      if (v70) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v70;
     }
     v71 = v28[0];
     v72 = v28[1];
     if (v71 !== v29[0] || v72 !== v29[1]) {
      v8.sampleCoverage(v71, v72);
      v29[0] = v71;
      v29[1] = v72;
     }
     v73 = v10.stencil_mask;
     if (v73 !== v3.stencil_mask) {
      v8.stencilMask(v73);
      v3.stencil_mask = v73;
     }
     v74 = v32[0];
     v75 = v32[1];
     v76 = v32[2];
     if (v74 !== v33[0] || v75 !== v33[1] || v76 !== v33[2]) {
      v8.stencilFunc(v74, v75, v76);
      v33[0] = v74;
      v33[1] = v75;
      v33[2] = v76;
     }
     v77 = v36[0];
     v78 = v36[1];
     v79 = v36[2];
     v80 = v36[3];
     if (v77 !== v37[0] || v78 !== v37[1] || v79 !== v37[2] || v80 !== v37[3]) {
      v8.stencilOpSeparate(v77, v78, v79, v80);
      v37[0] = v77;
      v37[1] = v78;
      v37[2] = v79;
      v37[3] = v80;
     }
     v81 = v34[0];
     v82 = v34[1];
     v83 = v34[2];
     v84 = v34[3];
     if (v81 !== v35[0] || v82 !== v35[1] || v83 !== v35[2] || v84 !== v35[3]) {
      v8.stencilOpSeparate(v81, v82, v83, v84);
      v35[0] = v81;
      v35[1] = v82;
      v35[2] = v83;
      v35[3] = v84;
     }
    }
    v85 = a0['viewport'];
    v86 = v85.x | 0;
    v87 = v85.y | 0;
    v88 = 'width' in v85 ? v85.width | 0 : (v2.framebufferWidth - v86);
    v89 = 'height' in v85 ? v85.height | 0 : (v2.framebufferHeight - v87);
    v90 = v2.viewportWidth;
    v2.viewportWidth = v88;
    v91 = v2.viewportHeight;
    v2.viewportHeight = v89;
    v8.viewport(v86, v87, v88, v89);
    v39[0] = v86;
    v39[1] = v87;
    v39[2] = v88;
    v39[3] = v89;
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.enable(2884);
    v3.cull_enable = true;
    v8.cullFace(1029);
    v3.cull_face = 1029;
    v92 = $2.call(this, v2, a0, 0);
    if (v92) {
     v8.enable(2929);
    }
    else {
     v8.disable(2929);
    }
    v3.depth_enable = v92;
    v93 = a0['viewport'];
    v94 = v93.x | 0;
    v95 = v93.y | 0;
    v96 = 'width' in v93 ? v93.width | 0 : (v2.framebufferWidth - v94);
    v97 = 'height' in v93 ? v93.height | 0 : (v2.framebufferHeight - v95);
    v8.scissor(v94, v95, v96, v97);
    v31[0] = v94;
    v31[1] = v95;
    v31[2] = v96;
    v31[3] = v97;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($3.program);
    v98 = v6.angle_instanced_arrays;
    v15.setVAO(null);
    v99 = a0['positionBuffer'];
    v48.buffer = v99;
    v100 = false;
    v101 = null;
    v102 = 0;
    v103 = false;
    v104 = 0;
    v105 = 0;
    v106 = 1;
    v107 = 0;
    v108 = 5126;
    v109 = 0;
    v110 = 0;
    v111 = 0;
    v112 = 0;
    if (v9(v48)) {
     v100 = true;
     v101 = v1.createStream(34962, v48);
     v108 = v101.dtype;
    }
    else {
     v101 = v1.getBuffer(v48);
     if (v101) {
      v108 = v101.dtype;
     }
     else if ('constant' in v48) {
      v106 = 2;
      if (typeof v48.constant === 'number') {
       v110 = v48.constant;
       v111 = v112 = v109 = 0;
      }
      else {
       v110 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v111 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v112 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v109 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v101 = v1.createStream(34962, v48.buffer);
      }
      else {
       v101 = v1.getBuffer(v48.buffer);
      }
      v108 = 'type' in v48 ? v43[v48.type] : v101.dtype;
      v103 = !!v48.normalized;
      v105 = v48.size | 0;
      v104 = v48.offset | 0;
      v107 = v48.stride | 0;
      v102 = v48.divisor | 0;
     }
    }
    v113 = aCoord.location;
    v114 = v0[v113];
    if (v106 === 1) {
     if (!v114.buffer) {
      v8.enableVertexAttribArray(v113);
     }
     v115 = v105 || 2;
     if (v114.type !== v108 || v114.size !== v115 || v114.buffer !== v101 || v114.normalized !== v103 || v114.offset !== v104 || v114.stride !== v107) {
      v8.bindBuffer(34962, v101.buffer);
      v8.vertexAttribPointer(v113, v115, v108, v103, v107, v104);
      v114.type = v108;
      v114.size = v115;
      v114.buffer = v101;
      v114.normalized = v103;
      v114.offset = v104;
      v114.stride = v107;
     }
     if (v114.divisor !== v102) {
      v98.vertexAttribDivisorANGLE(v113, v102);
      v114.divisor = v102;
     }
    }
    else {
     if (v114.buffer) {
      v8.disableVertexAttribArray(v113);
      v114.buffer = null;
     }
     if (v114.x !== v110 || v114.y !== v111 || v114.z !== v112 || v114.w !== v109) {
      v8.vertexAttrib4f(v113, v110, v111, v112, v109);
      v114.x = v110;
      v114.y = v111;
      v114.z = v112;
      v114.w = v109;
     }
    }
    v116 = a0['positionBuffer'];
    v50.buffer = v116;
    v117 = false;
    v118 = null;
    v119 = 0;
    v120 = false;
    v121 = 0;
    v122 = 0;
    v123 = 1;
    v124 = 0;
    v125 = 5126;
    v126 = 0;
    v127 = 0;
    v128 = 0;
    v129 = 0;
    if (v9(v50)) {
     v117 = true;
     v118 = v1.createStream(34962, v50);
     v125 = v118.dtype;
    }
    else {
     v118 = v1.getBuffer(v50);
     if (v118) {
      v125 = v118.dtype;
     }
     else if ('constant' in v50) {
      v123 = 2;
      if (typeof v50.constant === 'number') {
       v127 = v50.constant;
       v128 = v129 = v126 = 0;
      }
      else {
       v127 = v50.constant.length > 0 ? v50.constant[0] : 0;
       v128 = v50.constant.length > 1 ? v50.constant[1] : 0;
       v129 = v50.constant.length > 2 ? v50.constant[2] : 0;
       v126 = v50.constant.length > 3 ? v50.constant[3] : 0;
      }
     }
     else {
      if (v9(v50.buffer)) {
       v118 = v1.createStream(34962, v50.buffer);
      }
      else {
       v118 = v1.getBuffer(v50.buffer);
      }
      v125 = 'type' in v50 ? v43[v50.type] : v118.dtype;
      v120 = !!v50.normalized;
      v122 = v50.size | 0;
      v121 = v50.offset | 0;
      v124 = v50.stride | 0;
      v119 = v50.divisor | 0;
     }
    }
    v130 = bCoord.location;
    v131 = v0[v130];
    if (v123 === 1) {
     if (!v131.buffer) {
      v8.enableVertexAttribArray(v130);
     }
     v132 = v122 || 2;
     if (v131.type !== v125 || v131.size !== v132 || v131.buffer !== v118 || v131.normalized !== v120 || v131.offset !== v121 || v131.stride !== v124) {
      v8.bindBuffer(34962, v118.buffer);
      v8.vertexAttribPointer(v130, v132, v125, v120, v124, v121);
      v131.type = v125;
      v131.size = v132;
      v131.buffer = v118;
      v131.normalized = v120;
      v131.offset = v121;
      v131.stride = v124;
     }
     if (v131.divisor !== v119) {
      v98.vertexAttribDivisorANGLE(v130, v119);
      v131.divisor = v119;
     }
    }
    else {
     if (v131.buffer) {
      v8.disableVertexAttribArray(v130);
      v131.buffer = null;
     }
     if (v131.x !== v127 || v131.y !== v128 || v131.z !== v129 || v131.w !== v126) {
      v8.vertexAttrib4f(v130, v127, v128, v129, v126);
      v131.x = v127;
      v131.y = v128;
      v131.z = v129;
      v131.w = v126;
     }
    }
    v133 = a0['positionBuffer'];
    v51.buffer = v133;
    v134 = false;
    v135 = null;
    v136 = 0;
    v137 = false;
    v138 = 0;
    v139 = 0;
    v140 = 1;
    v141 = 0;
    v142 = 5126;
    v143 = 0;
    v144 = 0;
    v145 = 0;
    v146 = 0;
    if (v9(v51)) {
     v134 = true;
     v135 = v1.createStream(34962, v51);
     v142 = v135.dtype;
    }
    else {
     v135 = v1.getBuffer(v51);
     if (v135) {
      v142 = v135.dtype;
     }
     else if ('constant' in v51) {
      v140 = 2;
      if (typeof v51.constant === 'number') {
       v144 = v51.constant;
       v145 = v146 = v143 = 0;
      }
      else {
       v144 = v51.constant.length > 0 ? v51.constant[0] : 0;
       v145 = v51.constant.length > 1 ? v51.constant[1] : 0;
       v146 = v51.constant.length > 2 ? v51.constant[2] : 0;
       v143 = v51.constant.length > 3 ? v51.constant[3] : 0;
      }
     }
     else {
      if (v9(v51.buffer)) {
       v135 = v1.createStream(34962, v51.buffer);
      }
      else {
       v135 = v1.getBuffer(v51.buffer);
      }
      v142 = 'type' in v51 ? v43[v51.type] : v135.dtype;
      v137 = !!v51.normalized;
      v139 = v51.size | 0;
      v138 = v51.offset | 0;
      v141 = v51.stride | 0;
      v136 = v51.divisor | 0;
     }
    }
    v147 = nextCoord.location;
    v148 = v0[v147];
    if (v140 === 1) {
     if (!v148.buffer) {
      v8.enableVertexAttribArray(v147);
     }
     v149 = v139 || 2;
     if (v148.type !== v142 || v148.size !== v149 || v148.buffer !== v135 || v148.normalized !== v137 || v148.offset !== v138 || v148.stride !== v141) {
      v8.bindBuffer(34962, v135.buffer);
      v8.vertexAttribPointer(v147, v149, v142, v137, v141, v138);
      v148.type = v142;
      v148.size = v149;
      v148.buffer = v135;
      v148.normalized = v137;
      v148.offset = v138;
      v148.stride = v141;
     }
     if (v148.divisor !== v136) {
      v98.vertexAttribDivisorANGLE(v147, v136);
      v148.divisor = v136;
     }
    }
    else {
     if (v148.buffer) {
      v8.disableVertexAttribArray(v147);
      v148.buffer = null;
     }
     if (v148.x !== v144 || v148.y !== v145 || v148.z !== v146 || v148.w !== v143) {
      v8.vertexAttrib4f(v147, v144, v145, v146, v143);
      v148.x = v144;
      v148.y = v145;
      v148.z = v146;
      v148.w = v143;
     }
    }
    v150 = a0['positionBuffer'];
    v52.buffer = v150;
    v151 = false;
    v152 = null;
    v153 = 0;
    v154 = false;
    v155 = 0;
    v156 = 0;
    v157 = 1;
    v158 = 0;
    v159 = 5126;
    v160 = 0;
    v161 = 0;
    v162 = 0;
    v163 = 0;
    if (v9(v52)) {
     v151 = true;
     v152 = v1.createStream(34962, v52);
     v159 = v152.dtype;
    }
    else {
     v152 = v1.getBuffer(v52);
     if (v152) {
      v159 = v152.dtype;
     }
     else if ('constant' in v52) {
      v157 = 2;
      if (typeof v52.constant === 'number') {
       v161 = v52.constant;
       v162 = v163 = v160 = 0;
      }
      else {
       v161 = v52.constant.length > 0 ? v52.constant[0] : 0;
       v162 = v52.constant.length > 1 ? v52.constant[1] : 0;
       v163 = v52.constant.length > 2 ? v52.constant[2] : 0;
       v160 = v52.constant.length > 3 ? v52.constant[3] : 0;
      }
     }
     else {
      if (v9(v52.buffer)) {
       v152 = v1.createStream(34962, v52.buffer);
      }
      else {
       v152 = v1.getBuffer(v52.buffer);
      }
      v159 = 'type' in v52 ? v43[v52.type] : v152.dtype;
      v154 = !!v52.normalized;
      v156 = v52.size | 0;
      v155 = v52.offset | 0;
      v158 = v52.stride | 0;
      v153 = v52.divisor | 0;
     }
    }
    v164 = prevCoord.location;
    v165 = v0[v164];
    if (v157 === 1) {
     if (!v165.buffer) {
      v8.enableVertexAttribArray(v164);
     }
     v166 = v156 || 2;
     if (v165.type !== v159 || v165.size !== v166 || v165.buffer !== v152 || v165.normalized !== v154 || v165.offset !== v155 || v165.stride !== v158) {
      v8.bindBuffer(34962, v152.buffer);
      v8.vertexAttribPointer(v164, v166, v159, v154, v158, v155);
      v165.type = v159;
      v165.size = v166;
      v165.buffer = v152;
      v165.normalized = v154;
      v165.offset = v155;
      v165.stride = v158;
     }
     if (v165.divisor !== v153) {
      v98.vertexAttribDivisorANGLE(v164, v153);
      v165.divisor = v153;
     }
    }
    else {
     if (v165.buffer) {
      v8.disableVertexAttribArray(v164);
      v165.buffer = null;
     }
     if (v165.x !== v161 || v165.y !== v162 || v165.z !== v163 || v165.w !== v160) {
      v8.vertexAttrib4f(v164, v161, v162, v163, v160);
      v165.x = v161;
      v165.y = v162;
      v165.z = v163;
      v165.w = v160;
     }
    }
    v167 = a0['colorBuffer'];
    v47.buffer = v167;
    v168 = false;
    v169 = null;
    v170 = 0;
    v171 = false;
    v172 = 0;
    v173 = 0;
    v174 = 1;
    v175 = 0;
    v176 = 5126;
    v177 = 0;
    v178 = 0;
    v179 = 0;
    v180 = 0;
    if (v9(v47)) {
     v168 = true;
     v169 = v1.createStream(34962, v47);
     v176 = v169.dtype;
    }
    else {
     v169 = v1.getBuffer(v47);
     if (v169) {
      v176 = v169.dtype;
     }
     else if ('constant' in v47) {
      v174 = 2;
      if (typeof v47.constant === 'number') {
       v178 = v47.constant;
       v179 = v180 = v177 = 0;
      }
      else {
       v178 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v179 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v180 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v177 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v169 = v1.createStream(34962, v47.buffer);
      }
      else {
       v169 = v1.getBuffer(v47.buffer);
      }
      v176 = 'type' in v47 ? v43[v47.type] : v169.dtype;
      v171 = !!v47.normalized;
      v173 = v47.size | 0;
      v172 = v47.offset | 0;
      v175 = v47.stride | 0;
      v170 = v47.divisor | 0;
     }
    }
    v181 = aColor.location;
    v182 = v0[v181];
    if (v174 === 1) {
     if (!v182.buffer) {
      v8.enableVertexAttribArray(v181);
     }
     v183 = v173 || 4;
     if (v182.type !== v176 || v182.size !== v183 || v182.buffer !== v169 || v182.normalized !== v171 || v182.offset !== v172 || v182.stride !== v175) {
      v8.bindBuffer(34962, v169.buffer);
      v8.vertexAttribPointer(v181, v183, v176, v171, v175, v172);
      v182.type = v176;
      v182.size = v183;
      v182.buffer = v169;
      v182.normalized = v171;
      v182.offset = v172;
      v182.stride = v175;
     }
     if (v182.divisor !== v170) {
      v98.vertexAttribDivisorANGLE(v181, v170);
      v182.divisor = v170;
     }
    }
    else {
     if (v182.buffer) {
      v8.disableVertexAttribArray(v181);
      v182.buffer = null;
     }
     if (v182.x !== v178 || v182.y !== v179 || v182.z !== v180 || v182.w !== v177) {
      v8.vertexAttrib4f(v181, v178, v179, v180, v177);
      v182.x = v178;
      v182.y = v179;
      v182.z = v180;
      v182.w = v177;
     }
    }
    v184 = a0['colorBuffer'];
    v49.buffer = v184;
    v185 = false;
    v186 = null;
    v187 = 0;
    v188 = false;
    v189 = 0;
    v190 = 0;
    v191 = 1;
    v192 = 0;
    v193 = 5126;
    v194 = 0;
    v195 = 0;
    v196 = 0;
    v197 = 0;
    if (v9(v49)) {
     v185 = true;
     v186 = v1.createStream(34962, v49);
     v193 = v186.dtype;
    }
    else {
     v186 = v1.getBuffer(v49);
     if (v186) {
      v193 = v186.dtype;
     }
     else if ('constant' in v49) {
      v191 = 2;
      if (typeof v49.constant === 'number') {
       v195 = v49.constant;
       v196 = v197 = v194 = 0;
      }
      else {
       v195 = v49.constant.length > 0 ? v49.constant[0] : 0;
       v196 = v49.constant.length > 1 ? v49.constant[1] : 0;
       v197 = v49.constant.length > 2 ? v49.constant[2] : 0;
       v194 = v49.constant.length > 3 ? v49.constant[3] : 0;
      }
     }
     else {
      if (v9(v49.buffer)) {
       v186 = v1.createStream(34962, v49.buffer);
      }
      else {
       v186 = v1.getBuffer(v49.buffer);
      }
      v193 = 'type' in v49 ? v43[v49.type] : v186.dtype;
      v188 = !!v49.normalized;
      v190 = v49.size | 0;
      v189 = v49.offset | 0;
      v192 = v49.stride | 0;
      v187 = v49.divisor | 0;
     }
    }
    v198 = bColor.location;
    v199 = v0[v198];
    if (v191 === 1) {
     if (!v199.buffer) {
      v8.enableVertexAttribArray(v198);
     }
     v200 = v190 || 4;
     if (v199.type !== v193 || v199.size !== v200 || v199.buffer !== v186 || v199.normalized !== v188 || v199.offset !== v189 || v199.stride !== v192) {
      v8.bindBuffer(34962, v186.buffer);
      v8.vertexAttribPointer(v198, v200, v193, v188, v192, v189);
      v199.type = v193;
      v199.size = v200;
      v199.buffer = v186;
      v199.normalized = v188;
      v199.offset = v189;
      v199.stride = v192;
     }
     if (v199.divisor !== v187) {
      v98.vertexAttribDivisorANGLE(v198, v187);
      v199.divisor = v187;
     }
    }
    else {
     if (v199.buffer) {
      v8.disableVertexAttribArray(v198);
      v199.buffer = null;
     }
     if (v199.x !== v195 || v199.y !== v196 || v199.z !== v197 || v199.w !== v194) {
      v8.vertexAttrib4f(v198, v195, v196, v197, v194);
      v199.x = v195;
      v199.y = v196;
      v199.z = v197;
      v199.w = v194;
     }
    }
    v201 = lineEnd.location;
    v202 = v0[v201];
    if (!v202.buffer) {
     v8.enableVertexAttribArray(v201);
    }
    if (v202.type !== 5126 || v202.size !== 1 || v202.buffer !== $4 || v202.normalized !== false || v202.offset !== 0 || v202.stride !== 8) {
     v8.bindBuffer(34962, $4.buffer);
     v8.vertexAttribPointer(v201, 1, 5126, false, 8, 0);
     v202.type = 5126;
     v202.size = 1;
     v202.buffer = $4;
     v202.normalized = false;
     v202.offset = 0;
     v202.stride = 8;
    }
    if (v202.divisor !== 0) {
     v98.vertexAttribDivisorANGLE(v201, 0);
     v202.divisor = 0;
    }
    v203 = lineTop.location;
    v204 = v0[v203];
    if (!v204.buffer) {
     v8.enableVertexAttribArray(v203);
    }
    if (v204.type !== 5126 || v204.size !== 1 || v204.buffer !== $5 || v204.normalized !== false || v204.offset !== 4 || v204.stride !== 8) {
     v8.bindBuffer(34962, $5.buffer);
     v8.vertexAttribPointer(v203, 1, 5126, false, 8, 4);
     v204.type = 5126;
     v204.size = 1;
     v204.buffer = $5;
     v204.normalized = false;
     v204.offset = 4;
     v204.stride = 8;
    }
    if (v204.divisor !== 0) {
     v98.vertexAttribDivisorANGLE(v203, 0);
     v204.divisor = 0;
    }
    v205 = a0['scale'];
    v206 = v205[0];
    v207 = v205[1];
    v8.uniform2f(scale.location, v206, v207);
    v208 = a0['translate'];
    v209 = v208[0];
    v210 = v208[1];
    v8.uniform2f(translate.location, v209, v210);
    v211 = a0['thickness'];
    v8.uniform1f(thickness.location, v211);
    v212 = a0['depth'];
    v8.uniform1f(depth.location, v212);
    v213 = $6.call(this, v2, a0, 0);
    v214 = v213[0];
    v215 = v213[1];
    v216 = v213[2];
    v217 = v213[3];
    v8.uniform4f(viewport.location, v214, v215, v216, v217);
    v218 = a0['miterLimit'];
    v8.uniform1f(miterLimit.location, v218);
    v219 = $7.call(this, v2, a0, 0);
    v8.uniform1f(miterMode.location, v219);
    v220 = a0['dashLength'];
    v8.uniform1f(dashLength.location, v220);
    v221 = a0['opacity'];
    v8.uniform1f(opacity.location, v221);
    v222 = a0['dashTexture'];
    if (v222 && v222._reglType === 'framebuffer') {
     v222 = v222.color[0];
    }
    v223 = v222._texture;
    v8.uniform1i(dashTexture.location, v223.bind());
    v224 = v4.elements;
    if (v224) {
     v8.bindBuffer(34963, v224.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v224 = v5.getElements(v15.currentVAO.elements);
     if (v224) v8.bindBuffer(34963, v224.buffer.buffer);
    }
    v225 = a0['count'];
    if (v225 > 0) {
     if (v224) {
      v98.drawElementsInstancedANGLE(5, 4, v224.type, 0 << ((v224.type - 5121) >> 1), v225);
     }
     else {
      v98.drawArraysInstancedANGLE(5, 0, 4, v225);
     }
    }
    else if (v225 < 0) {
     if (v224) {
      v8.drawElements(5, 4, v224.type, 0 << ((v224.type - 5121) >> 1));
     }
     else {
      v8.drawArrays(5, 0, 4);
     }
    }
    v3.dirty = true;
    v15.setVAO(null);
    v2.viewportWidth = v90;
    v2.viewportHeight = v91;
    if (v100) {
     v1.destroyStream(v101);
    }
    if (v117) {
     v1.destroyStream(v118);
    }
    if (v134) {
     v1.destroyStream(v135);
    }
    if (v151) {
     v1.destroyStream(v152);
    }
    if (v168) {
     v1.destroyStream(v169);
    }
    if (v185) {
     v1.destroyStream(v186);
    }
    v223.unbind();
   }
   , 'scope': function (a0, a1, a2) {
    var v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267, v268, v269, v270, v271, v272, v273, v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301, v302, v303, v304, v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360, v361, v362, v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387, v388, v389, v390, v391, v392, v393, v394, v395, v396, v397, v398, v399, v400, v401, v402, v403, v404, v405, v406, v407, v408, v409, v410, v411, v412, v413, v414, v415, v416, v417, v418, v419, v420, v421, v422, v423, v424, v425, v426, v427, v428, v429, v430, v431, v432, v433, v434, v435, v436, v437, v438, v439, v440, v441, v442, v443, v444, v445, v446, v447, v448, v449, v450, v451, v452, v453, v454, v455, v456, v457, v458, v459, v460, v461, v462, v463, v464, v465, v466, v467, v468, v469, v470, v471, v472, v473, v474, v475, v476, v477;
    v226 = a0['viewport'];
    v227 = v226.x | 0;
    v228 = v226.y | 0;
    v229 = 'width' in v226 ? v226.width | 0 : (v2.framebufferWidth - v227);
    v230 = 'height' in v226 ? v226.height | 0 : (v2.framebufferHeight - v228);
    v231 = v2.viewportWidth;
    v2.viewportWidth = v229;
    v232 = v2.viewportHeight;
    v2.viewportHeight = v230;
    v233 = v38[0];
    v38[0] = v227;
    v234 = v38[1];
    v38[1] = v228;
    v235 = v38[2];
    v38[2] = v229;
    v236 = v38[3];
    v38[3] = v230;
    v237 = v16[0];
    v16[0] = 0;
    v238 = v16[1];
    v16[1] = 0;
    v239 = v16[2];
    v16[2] = 0;
    v240 = v16[3];
    v16[3] = 0;
    v241 = v10.blend_enable;
    v10.blend_enable = true;
    v242 = v18[0];
    v18[0] = 32774;
    v243 = v18[1];
    v18[1] = 32774;
    v244 = v20[0];
    v20[0] = 770;
    v245 = v20[1];
    v20[1] = 771;
    v246 = v20[2];
    v20[2] = 773;
    v247 = v20[3];
    v20[3] = 1;
    v248 = v10.cull_enable;
    v10.cull_enable = true;
    v249 = v10.cull_face;
    v10.cull_face = 1029;
    v250 = $8.call(this, v2, a0, a2);
    v251 = v10.depth_enable;
    v10.depth_enable = v250;
    v252 = a0['viewport'];
    v253 = v252.x | 0;
    v254 = v252.y | 0;
    v255 = 'width' in v252 ? v252.width | 0 : (v2.framebufferWidth - v253);
    v256 = 'height' in v252 ? v252.height | 0 : (v2.framebufferHeight - v254);
    v257 = v30[0];
    v30[0] = v253;
    v258 = v30[1];
    v30[1] = v254;
    v259 = v30[2];
    v30[2] = v255;
    v260 = v30[3];
    v30[3] = v256;
    v261 = v10.scissor_enable;
    v10.scissor_enable = true;
    v262 = v10.stencil_enable;
    v10.stencil_enable = false;
    v263 = v4.offset;
    v4.offset = 0;
    v264 = v4.count;
    v4.count = 4;
    v265 = a0['count'];
    v266 = v4.instances;
    v4.instances = v265;
    v267 = v4.primitive;
    v4.primitive = 5;
    v268 = a0['dashLength'];
    v269 = v14[23];
    v14[23] = v268;
    v270 = a0['dashTexture'];
    v271 = v14[24];
    v14[24] = v270;
    v272 = a0['depth'];
    v273 = v14[22];
    v14[22] = v272;
    v274 = a0['id'];
    v275 = v14[31];
    v14[31] = v274;
    v276 = a0['miterLimit'];
    v277 = v14[32];
    v14[32] = v276;
    v278 = $9.call(this, v2, a0, a2);
    v279 = v14[33];
    v14[33] = v278;
    v280 = a0['opacity'];
    v281 = v14[10];
    v14[10] = v280;
    v282 = v2['pixelRatio'];
    v283 = v14[34];
    v14[34] = v282;
    v284 = a0['scale'];
    v285 = v14[6];
    v14[6] = v284;
    v286 = a0['scaleFract'];
    v287 = v14[7];
    v14[7] = v286;
    v288 = a0['thickness'];
    v289 = v14[21];
    v14[21] = v288;
    v290 = a0['translate'];
    v291 = v14[8];
    v14[8] = v290;
    v292 = a0['translateFract'];
    v293 = v14[9];
    v14[9] = v292;
    v294 = $10.call(this, v2, a0, a2);
    v295 = v14[3];
    v14[3] = v294;
    v296 = a0['colorBuffer'];
    v47.buffer = v296;
    v297 = false;
    v298 = null;
    v299 = 0;
    v300 = false;
    v301 = 0;
    v302 = 0;
    v303 = 1;
    v304 = 0;
    v305 = 5126;
    v306 = 0;
    v307 = 0;
    v308 = 0;
    v309 = 0;
    if (v9(v47)) {
     v297 = true;
     v298 = v1.createStream(34962, v47);
     v305 = v298.dtype;
    }
    else {
     v298 = v1.getBuffer(v47);
     if (v298) {
      v305 = v298.dtype;
     }
     else if ('constant' in v47) {
      v303 = 2;
      if (typeof v47.constant === 'number') {
       v307 = v47.constant;
       v308 = v309 = v306 = 0;
      }
      else {
       v307 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v308 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v309 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v306 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v298 = v1.createStream(34962, v47.buffer);
      }
      else {
       v298 = v1.getBuffer(v47.buffer);
      }
      v305 = 'type' in v47 ? v43[v47.type] : v298.dtype;
      v300 = !!v47.normalized;
      v302 = v47.size | 0;
      v301 = v47.offset | 0;
      v304 = v47.stride | 0;
      v299 = v47.divisor | 0;
     }
    }
    v310 = $11.buffer;
    $11.buffer = v298;
    v311 = $11.divisor;
    $11.divisor = v299;
    v312 = $11.normalized;
    $11.normalized = v300;
    v313 = $11.offset;
    $11.offset = v301;
    v314 = $11.size;
    $11.size = v302;
    v315 = $11.state;
    $11.state = v303;
    v316 = $11.stride;
    $11.stride = v304;
    v317 = $11.type;
    $11.type = v305;
    v318 = $11.w;
    $11.w = v306;
    v319 = $11.x;
    $11.x = v307;
    v320 = $11.y;
    $11.y = v308;
    v321 = $11.z;
    $11.z = v309;
    v322 = a0['positionBuffer'];
    v48.buffer = v322;
    v323 = false;
    v324 = null;
    v325 = 0;
    v326 = false;
    v327 = 0;
    v328 = 0;
    v329 = 1;
    v330 = 0;
    v331 = 5126;
    v332 = 0;
    v333 = 0;
    v334 = 0;
    v335 = 0;
    if (v9(v48)) {
     v323 = true;
     v324 = v1.createStream(34962, v48);
     v331 = v324.dtype;
    }
    else {
     v324 = v1.getBuffer(v48);
     if (v324) {
      v331 = v324.dtype;
     }
     else if ('constant' in v48) {
      v329 = 2;
      if (typeof v48.constant === 'number') {
       v333 = v48.constant;
       v334 = v335 = v332 = 0;
      }
      else {
       v333 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v334 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v335 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v332 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v324 = v1.createStream(34962, v48.buffer);
      }
      else {
       v324 = v1.getBuffer(v48.buffer);
      }
      v331 = 'type' in v48 ? v43[v48.type] : v324.dtype;
      v326 = !!v48.normalized;
      v328 = v48.size | 0;
      v327 = v48.offset | 0;
      v330 = v48.stride | 0;
      v325 = v48.divisor | 0;
     }
    }
    v336 = $12.buffer;
    $12.buffer = v324;
    v337 = $12.divisor;
    $12.divisor = v325;
    v338 = $12.normalized;
    $12.normalized = v326;
    v339 = $12.offset;
    $12.offset = v327;
    v340 = $12.size;
    $12.size = v328;
    v341 = $12.state;
    $12.state = v329;
    v342 = $12.stride;
    $12.stride = v330;
    v343 = $12.type;
    $12.type = v331;
    v344 = $12.w;
    $12.w = v332;
    v345 = $12.x;
    $12.x = v333;
    v346 = $12.y;
    $12.y = v334;
    v347 = $12.z;
    $12.z = v335;
    v348 = a0['colorBuffer'];
    v49.buffer = v348;
    v349 = false;
    v350 = null;
    v351 = 0;
    v352 = false;
    v353 = 0;
    v354 = 0;
    v355 = 1;
    v356 = 0;
    v357 = 5126;
    v358 = 0;
    v359 = 0;
    v360 = 0;
    v361 = 0;
    if (v9(v49)) {
     v349 = true;
     v350 = v1.createStream(34962, v49);
     v357 = v350.dtype;
    }
    else {
     v350 = v1.getBuffer(v49);
     if (v350) {
      v357 = v350.dtype;
     }
     else if ('constant' in v49) {
      v355 = 2;
      if (typeof v49.constant === 'number') {
       v359 = v49.constant;
       v360 = v361 = v358 = 0;
      }
      else {
       v359 = v49.constant.length > 0 ? v49.constant[0] : 0;
       v360 = v49.constant.length > 1 ? v49.constant[1] : 0;
       v361 = v49.constant.length > 2 ? v49.constant[2] : 0;
       v358 = v49.constant.length > 3 ? v49.constant[3] : 0;
      }
     }
     else {
      if (v9(v49.buffer)) {
       v350 = v1.createStream(34962, v49.buffer);
      }
      else {
       v350 = v1.getBuffer(v49.buffer);
      }
      v357 = 'type' in v49 ? v43[v49.type] : v350.dtype;
      v352 = !!v49.normalized;
      v354 = v49.size | 0;
      v353 = v49.offset | 0;
      v356 = v49.stride | 0;
      v351 = v49.divisor | 0;
     }
    }
    v362 = $13.buffer;
    $13.buffer = v350;
    v363 = $13.divisor;
    $13.divisor = v351;
    v364 = $13.normalized;
    $13.normalized = v352;
    v365 = $13.offset;
    $13.offset = v353;
    v366 = $13.size;
    $13.size = v354;
    v367 = $13.state;
    $13.state = v355;
    v368 = $13.stride;
    $13.stride = v356;
    v369 = $13.type;
    $13.type = v357;
    v370 = $13.w;
    $13.w = v358;
    v371 = $13.x;
    $13.x = v359;
    v372 = $13.y;
    $13.y = v360;
    v373 = $13.z;
    $13.z = v361;
    v374 = a0['positionBuffer'];
    v50.buffer = v374;
    v375 = false;
    v376 = null;
    v377 = 0;
    v378 = false;
    v379 = 0;
    v380 = 0;
    v381 = 1;
    v382 = 0;
    v383 = 5126;
    v384 = 0;
    v385 = 0;
    v386 = 0;
    v387 = 0;
    if (v9(v50)) {
     v375 = true;
     v376 = v1.createStream(34962, v50);
     v383 = v376.dtype;
    }
    else {
     v376 = v1.getBuffer(v50);
     if (v376) {
      v383 = v376.dtype;
     }
     else if ('constant' in v50) {
      v381 = 2;
      if (typeof v50.constant === 'number') {
       v385 = v50.constant;
       v386 = v387 = v384 = 0;
      }
      else {
       v385 = v50.constant.length > 0 ? v50.constant[0] : 0;
       v386 = v50.constant.length > 1 ? v50.constant[1] : 0;
       v387 = v50.constant.length > 2 ? v50.constant[2] : 0;
       v384 = v50.constant.length > 3 ? v50.constant[3] : 0;
      }
     }
     else {
      if (v9(v50.buffer)) {
       v376 = v1.createStream(34962, v50.buffer);
      }
      else {
       v376 = v1.getBuffer(v50.buffer);
      }
      v383 = 'type' in v50 ? v43[v50.type] : v376.dtype;
      v378 = !!v50.normalized;
      v380 = v50.size | 0;
      v379 = v50.offset | 0;
      v382 = v50.stride | 0;
      v377 = v50.divisor | 0;
     }
    }
    v388 = $14.buffer;
    $14.buffer = v376;
    v389 = $14.divisor;
    $14.divisor = v377;
    v390 = $14.normalized;
    $14.normalized = v378;
    v391 = $14.offset;
    $14.offset = v379;
    v392 = $14.size;
    $14.size = v380;
    v393 = $14.state;
    $14.state = v381;
    v394 = $14.stride;
    $14.stride = v382;
    v395 = $14.type;
    $14.type = v383;
    v396 = $14.w;
    $14.w = v384;
    v397 = $14.x;
    $14.x = v385;
    v398 = $14.y;
    $14.y = v386;
    v399 = $14.z;
    $14.z = v387;
    v400 = $15.buffer;
    $15.buffer = $4;
    v401 = $15.divisor;
    $15.divisor = 0;
    v402 = $15.normalized;
    $15.normalized = false;
    v403 = $15.offset;
    $15.offset = 0;
    v404 = $15.size;
    $15.size = 0;
    v405 = $15.state;
    $15.state = 1;
    v406 = $15.stride;
    $15.stride = 8;
    v407 = $15.type;
    $15.type = 5126;
    v408 = $15.w;
    $15.w = 0;
    v409 = $15.x;
    $15.x = 0;
    v410 = $15.y;
    $15.y = 0;
    v411 = $15.z;
    $15.z = 0;
    v412 = $16.buffer;
    $16.buffer = $5;
    v413 = $16.divisor;
    $16.divisor = 0;
    v414 = $16.normalized;
    $16.normalized = false;
    v415 = $16.offset;
    $16.offset = 4;
    v416 = $16.size;
    $16.size = 0;
    v417 = $16.state;
    $16.state = 1;
    v418 = $16.stride;
    $16.stride = 8;
    v419 = $16.type;
    $16.type = 5126;
    v420 = $16.w;
    $16.w = 0;
    v421 = $16.x;
    $16.x = 0;
    v422 = $16.y;
    $16.y = 0;
    v423 = $16.z;
    $16.z = 0;
    v424 = a0['positionBuffer'];
    v51.buffer = v424;
    v425 = false;
    v426 = null;
    v427 = 0;
    v428 = false;
    v429 = 0;
    v430 = 0;
    v431 = 1;
    v432 = 0;
    v433 = 5126;
    v434 = 0;
    v435 = 0;
    v436 = 0;
    v437 = 0;
    if (v9(v51)) {
     v425 = true;
     v426 = v1.createStream(34962, v51);
     v433 = v426.dtype;
    }
    else {
     v426 = v1.getBuffer(v51);
     if (v426) {
      v433 = v426.dtype;
     }
     else if ('constant' in v51) {
      v431 = 2;
      if (typeof v51.constant === 'number') {
       v435 = v51.constant;
       v436 = v437 = v434 = 0;
      }
      else {
       v435 = v51.constant.length > 0 ? v51.constant[0] : 0;
       v436 = v51.constant.length > 1 ? v51.constant[1] : 0;
       v437 = v51.constant.length > 2 ? v51.constant[2] : 0;
       v434 = v51.constant.length > 3 ? v51.constant[3] : 0;
      }
     }
     else {
      if (v9(v51.buffer)) {
       v426 = v1.createStream(34962, v51.buffer);
      }
      else {
       v426 = v1.getBuffer(v51.buffer);
      }
      v433 = 'type' in v51 ? v43[v51.type] : v426.dtype;
      v428 = !!v51.normalized;
      v430 = v51.size | 0;
      v429 = v51.offset | 0;
      v432 = v51.stride | 0;
      v427 = v51.divisor | 0;
     }
    }
    v438 = $17.buffer;
    $17.buffer = v426;
    v439 = $17.divisor;
    $17.divisor = v427;
    v440 = $17.normalized;
    $17.normalized = v428;
    v441 = $17.offset;
    $17.offset = v429;
    v442 = $17.size;
    $17.size = v430;
    v443 = $17.state;
    $17.state = v431;
    v444 = $17.stride;
    $17.stride = v432;
    v445 = $17.type;
    $17.type = v433;
    v446 = $17.w;
    $17.w = v434;
    v447 = $17.x;
    $17.x = v435;
    v448 = $17.y;
    $17.y = v436;
    v449 = $17.z;
    $17.z = v437;
    v450 = a0['positionBuffer'];
    v52.buffer = v450;
    v451 = false;
    v452 = null;
    v453 = 0;
    v454 = false;
    v455 = 0;
    v456 = 0;
    v457 = 1;
    v458 = 0;
    v459 = 5126;
    v460 = 0;
    v461 = 0;
    v462 = 0;
    v463 = 0;
    if (v9(v52)) {
     v451 = true;
     v452 = v1.createStream(34962, v52);
     v459 = v452.dtype;
    }
    else {
     v452 = v1.getBuffer(v52);
     if (v452) {
      v459 = v452.dtype;
     }
     else if ('constant' in v52) {
      v457 = 2;
      if (typeof v52.constant === 'number') {
       v461 = v52.constant;
       v462 = v463 = v460 = 0;
      }
      else {
       v461 = v52.constant.length > 0 ? v52.constant[0] : 0;
       v462 = v52.constant.length > 1 ? v52.constant[1] : 0;
       v463 = v52.constant.length > 2 ? v52.constant[2] : 0;
       v460 = v52.constant.length > 3 ? v52.constant[3] : 0;
      }
     }
     else {
      if (v9(v52.buffer)) {
       v452 = v1.createStream(34962, v52.buffer);
      }
      else {
       v452 = v1.getBuffer(v52.buffer);
      }
      v459 = 'type' in v52 ? v43[v52.type] : v452.dtype;
      v454 = !!v52.normalized;
      v456 = v52.size | 0;
      v455 = v52.offset | 0;
      v458 = v52.stride | 0;
      v453 = v52.divisor | 0;
     }
    }
    v464 = $18.buffer;
    $18.buffer = v452;
    v465 = $18.divisor;
    $18.divisor = v453;
    v466 = $18.normalized;
    $18.normalized = v454;
    v467 = $18.offset;
    $18.offset = v455;
    v468 = $18.size;
    $18.size = v456;
    v469 = $18.state;
    $18.state = v457;
    v470 = $18.stride;
    $18.stride = v458;
    v471 = $18.type;
    $18.type = v459;
    v472 = $18.w;
    $18.w = v460;
    v473 = $18.x;
    $18.x = v461;
    v474 = $18.y;
    $18.y = v462;
    v475 = $18.z;
    $18.z = v463;
    v476 = v11.vert;
    v11.vert = 36;
    v477 = v11.frag;
    v11.frag = 35;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v231;
    v2.viewportHeight = v232;
    v38[0] = v233;
    v38[1] = v234;
    v38[2] = v235;
    v38[3] = v236;
    v16[0] = v237;
    v16[1] = v238;
    v16[2] = v239;
    v16[3] = v240;
    v10.blend_enable = v241;
    v18[0] = v242;
    v18[1] = v243;
    v20[0] = v244;
    v20[1] = v245;
    v20[2] = v246;
    v20[3] = v247;
    v10.cull_enable = v248;
    v10.cull_face = v249;
    v10.depth_enable = v251;
    v30[0] = v257;
    v30[1] = v258;
    v30[2] = v259;
    v30[3] = v260;
    v10.scissor_enable = v261;
    v10.stencil_enable = v262;
    v4.offset = v263;
    v4.count = v264;
    v4.instances = v266;
    v4.primitive = v267;
    v14[23] = v269;
    v14[24] = v271;
    v14[22] = v273;
    v14[31] = v275;
    v14[32] = v277;
    v14[33] = v279;
    v14[10] = v281;
    v14[34] = v283;
    v14[6] = v285;
    v14[7] = v287;
    v14[21] = v289;
    v14[8] = v291;
    v14[9] = v293;
    v14[3] = v295;
    if (v297) {
     v1.destroyStream(v298);
    }
    $11.buffer = v310;
    $11.divisor = v311;
    $11.normalized = v312;
    $11.offset = v313;
    $11.size = v314;
    $11.state = v315;
    $11.stride = v316;
    $11.type = v317;
    $11.w = v318;
    $11.x = v319;
    $11.y = v320;
    $11.z = v321;
    if (v323) {
     v1.destroyStream(v324);
    }
    $12.buffer = v336;
    $12.divisor = v337;
    $12.normalized = v338;
    $12.offset = v339;
    $12.size = v340;
    $12.state = v341;
    $12.stride = v342;
    $12.type = v343;
    $12.w = v344;
    $12.x = v345;
    $12.y = v346;
    $12.z = v347;
    if (v349) {
     v1.destroyStream(v350);
    }
    $13.buffer = v362;
    $13.divisor = v363;
    $13.normalized = v364;
    $13.offset = v365;
    $13.size = v366;
    $13.state = v367;
    $13.stride = v368;
    $13.type = v369;
    $13.w = v370;
    $13.x = v371;
    $13.y = v372;
    $13.z = v373;
    if (v375) {
     v1.destroyStream(v376);
    }
    $14.buffer = v388;
    $14.divisor = v389;
    $14.normalized = v390;
    $14.offset = v391;
    $14.size = v392;
    $14.state = v393;
    $14.stride = v394;
    $14.type = v395;
    $14.w = v396;
    $14.x = v397;
    $14.y = v398;
    $14.z = v399;
    $15.buffer = v400;
    $15.divisor = v401;
    $15.normalized = v402;
    $15.offset = v403;
    $15.size = v404;
    $15.state = v405;
    $15.stride = v406;
    $15.type = v407;
    $15.w = v408;
    $15.x = v409;
    $15.y = v410;
    $15.z = v411;
    $16.buffer = v412;
    $16.divisor = v413;
    $16.normalized = v414;
    $16.offset = v415;
    $16.size = v416;
    $16.state = v417;
    $16.stride = v418;
    $16.type = v419;
    $16.w = v420;
    $16.x = v421;
    $16.y = v422;
    $16.z = v423;
    if (v425) {
     v1.destroyStream(v426);
    }
    $17.buffer = v438;
    $17.divisor = v439;
    $17.normalized = v440;
    $17.offset = v441;
    $17.size = v442;
    $17.state = v443;
    $17.stride = v444;
    $17.type = v445;
    $17.w = v446;
    $17.x = v447;
    $17.y = v448;
    $17.z = v449;
    if (v451) {
     v1.destroyStream(v452);
    }
    $18.buffer = v464;
    $18.divisor = v465;
    $18.normalized = v466;
    $18.offset = v467;
    $18.size = v468;
    $18.state = v469;
    $18.stride = v470;
    $18.type = v471;
    $18.w = v472;
    $18.x = v473;
    $18.y = v474;
    $18.z = v475;
    v11.vert = v476;
    v11.frag = v477;
    v3.dirty = true;
   }
   ,
  }

 },
 '$9,color,id,opacity,position,positionFract,scale,scaleFract,translate,translateFract': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, color, id, opacity, position, positionFract, scale, scaleFract, translate, translateFract
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v47 = {
  }
   ;
  v47.offset = 8;
  v47.stride = 8;
  v48 = {
  }
   ;
  v48.offset = 8;
  v48.stride = 8;
  return {
   'batch': function (a0, a1) {
    var v268, v269, v302, v303, v304;
    v268 = v6.angle_instanced_arrays;
    v269 = v7.next;
    if (v269 !== v7.cur) {
     if (v269) {
      v8.bindFramebuffer(36160, v269.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v269;
    }
    if (v3.dirty) {
     var v270, v271, v272, v273, v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301;
     v270 = v10.dither;
     if (v270 !== v3.dither) {
      if (v270) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v270;
     }
     v271 = v10.depth_func;
     if (v271 !== v3.depth_func) {
      v8.depthFunc(v271);
      v3.depth_func = v271;
     }
     v272 = v24[0];
     v273 = v24[1];
     if (v272 !== v25[0] || v273 !== v25[1]) {
      v8.depthRange(v272, v273);
      v25[0] = v272;
      v25[1] = v273;
     }
     v274 = v10.depth_mask;
     if (v274 !== v3.depth_mask) {
      v8.depthMask(v274);
      v3.depth_mask = v274;
     }
     v275 = v22[0];
     v276 = v22[1];
     v277 = v22[2];
     v278 = v22[3];
     if (v275 !== v23[0] || v276 !== v23[1] || v277 !== v23[2] || v278 !== v23[3]) {
      v8.colorMask(v275, v276, v277, v278);
      v23[0] = v275;
      v23[1] = v276;
      v23[2] = v277;
      v23[3] = v278;
     }
     v279 = v10.cull_enable;
     if (v279 !== v3.cull_enable) {
      if (v279) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v279;
     }
     v280 = v10.cull_face;
     if (v280 !== v3.cull_face) {
      v8.cullFace(v280);
      v3.cull_face = v280;
     }
     v281 = v10.frontFace;
     if (v281 !== v3.frontFace) {
      v8.frontFace(v281);
      v3.frontFace = v281;
     }
     v282 = v10.lineWidth;
     if (v282 !== v3.lineWidth) {
      v8.lineWidth(v282);
      v3.lineWidth = v282;
     }
     v283 = v10.polygonOffset_enable;
     if (v283 !== v3.polygonOffset_enable) {
      if (v283) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v283;
     }
     v284 = v26[0];
     v285 = v26[1];
     if (v284 !== v27[0] || v285 !== v27[1]) {
      v8.polygonOffset(v284, v285);
      v27[0] = v284;
      v27[1] = v285;
     }
     v286 = v10.sample_alpha;
     if (v286 !== v3.sample_alpha) {
      if (v286) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v286;
     }
     v287 = v10.sample_enable;
     if (v287 !== v3.sample_enable) {
      if (v287) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v287;
     }
     v288 = v28[0];
     v289 = v28[1];
     if (v288 !== v29[0] || v289 !== v29[1]) {
      v8.sampleCoverage(v288, v289);
      v29[0] = v288;
      v29[1] = v289;
     }
     v290 = v10.stencil_mask;
     if (v290 !== v3.stencil_mask) {
      v8.stencilMask(v290);
      v3.stencil_mask = v290;
     }
     v291 = v32[0];
     v292 = v32[1];
     v293 = v32[2];
     if (v291 !== v33[0] || v292 !== v33[1] || v293 !== v33[2]) {
      v8.stencilFunc(v291, v292, v293);
      v33[0] = v291;
      v33[1] = v292;
      v33[2] = v293;
     }
     v294 = v36[0];
     v295 = v36[1];
     v296 = v36[2];
     v297 = v36[3];
     if (v294 !== v37[0] || v295 !== v37[1] || v296 !== v37[2] || v297 !== v37[3]) {
      v8.stencilOpSeparate(v294, v295, v296, v297);
      v37[0] = v294;
      v37[1] = v295;
      v37[2] = v296;
      v37[3] = v297;
     }
     v298 = v34[0];
     v299 = v34[1];
     v300 = v34[2];
     v301 = v34[3];
     if (v298 !== v35[0] || v299 !== v35[1] || v300 !== v35[2] || v301 !== v35[3]) {
      v8.stencilOpSeparate(v298, v299, v300, v301);
      v35[0] = v298;
      v35[1] = v299;
      v35[2] = v300;
      v35[3] = v301;
     }
    }
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($8.program);
    v302 = v6.angle_instanced_arrays;
    var v388;
    v15.setVAO(null);
    v388 = v4.instances;
    for (v303 = 0;
     v303 < a1;
     ++v303) {
     v304 = a0[v303];
     var v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360, v361, v362, v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387;
     v305 = v304['viewport'];
     v306 = v305.x | 0;
     v307 = v305.y | 0;
     v308 = 'width' in v305 ? v305.width | 0 : (v2.framebufferWidth - v306);
     v309 = 'height' in v305 ? v305.height | 0 : (v2.framebufferHeight - v307);
     v310 = v2.viewportWidth;
     v2.viewportWidth = v308;
     v311 = v2.viewportHeight;
     v2.viewportHeight = v309;
     v8.viewport(v306, v307, v308, v309);
     v39[0] = v306;
     v39[1] = v307;
     v39[2] = v308;
     v39[3] = v309;
     v312 = v304['viewport'];
     v313 = v312.x | 0;
     v314 = v312.y | 0;
     v315 = 'width' in v312 ? v312.width | 0 : (v2.framebufferWidth - v313);
     v316 = 'height' in v312 ? v312.height | 0 : (v2.framebufferHeight - v314);
     v8.scissor(v313, v314, v315, v316);
     v31[0] = v313;
     v31[1] = v314;
     v31[2] = v315;
     v31[3] = v316;
     v317 = v304['positionBuffer'];
     v47.buffer = v317;
     v318 = false;
     v319 = null;
     v320 = 0;
     v321 = false;
     v322 = 0;
     v323 = 0;
     v324 = 1;
     v325 = 0;
     v326 = 5126;
     v327 = 0;
     v328 = 0;
     v329 = 0;
     v330 = 0;
     if (v9(v47)) {
      v318 = true;
      v319 = v1.createStream(34962, v47);
      v326 = v319.dtype;
     }
     else {
      v319 = v1.getBuffer(v47);
      if (v319) {
       v326 = v319.dtype;
      }
      else if ('constant' in v47) {
       v324 = 2;
       if (typeof v47.constant === 'number') {
        v328 = v47.constant;
        v329 = v330 = v327 = 0;
       }
       else {
        v328 = v47.constant.length > 0 ? v47.constant[0] : 0;
        v329 = v47.constant.length > 1 ? v47.constant[1] : 0;
        v330 = v47.constant.length > 2 ? v47.constant[2] : 0;
        v327 = v47.constant.length > 3 ? v47.constant[3] : 0;
       }
      }
      else {
       if (v9(v47.buffer)) {
        v319 = v1.createStream(34962, v47.buffer);
       }
       else {
        v319 = v1.getBuffer(v47.buffer);
       }
       v326 = 'type' in v47 ? v43[v47.type] : v319.dtype;
       v321 = !!v47.normalized;
       v323 = v47.size | 0;
       v322 = v47.offset | 0;
       v325 = v47.stride | 0;
       v320 = v47.divisor | 0;
      }
     }
     v331 = position.location;
     v332 = v0[v331];
     if (v324 === 1) {
      if (!v332.buffer) {
       v8.enableVertexAttribArray(v331);
      }
      v333 = v323 || 2;
      if (v332.type !== v326 || v332.size !== v333 || v332.buffer !== v319 || v332.normalized !== v321 || v332.offset !== v322 || v332.stride !== v325) {
       v8.bindBuffer(34962, v319.buffer);
       v8.vertexAttribPointer(v331, v333, v326, v321, v325, v322);
       v332.type = v326;
       v332.size = v333;
       v332.buffer = v319;
       v332.normalized = v321;
       v332.offset = v322;
       v332.stride = v325;
      }
      if (v332.divisor !== v320) {
       v302.vertexAttribDivisorANGLE(v331, v320);
       v332.divisor = v320;
      }
     }
     else {
      if (v332.buffer) {
       v8.disableVertexAttribArray(v331);
       v332.buffer = null;
      }
      if (v332.x !== v328 || v332.y !== v329 || v332.z !== v330 || v332.w !== v327) {
       v8.vertexAttrib4f(v331, v328, v329, v330, v327);
       v332.x = v328;
       v332.y = v329;
       v332.z = v330;
       v332.w = v327;
      }
     }
     v334 = v304['positionFractBuffer'];
     v48.buffer = v334;
     v335 = false;
     v336 = null;
     v337 = 0;
     v338 = false;
     v339 = 0;
     v340 = 0;
     v341 = 1;
     v342 = 0;
     v343 = 5126;
     v344 = 0;
     v345 = 0;
     v346 = 0;
     v347 = 0;
     if (v9(v48)) {
      v335 = true;
      v336 = v1.createStream(34962, v48);
      v343 = v336.dtype;
     }
     else {
      v336 = v1.getBuffer(v48);
      if (v336) {
       v343 = v336.dtype;
      }
      else if ('constant' in v48) {
       v341 = 2;
       if (typeof v48.constant === 'number') {
        v345 = v48.constant;
        v346 = v347 = v344 = 0;
       }
       else {
        v345 = v48.constant.length > 0 ? v48.constant[0] : 0;
        v346 = v48.constant.length > 1 ? v48.constant[1] : 0;
        v347 = v48.constant.length > 2 ? v48.constant[2] : 0;
        v344 = v48.constant.length > 3 ? v48.constant[3] : 0;
       }
      }
      else {
       if (v9(v48.buffer)) {
        v336 = v1.createStream(34962, v48.buffer);
       }
       else {
        v336 = v1.getBuffer(v48.buffer);
       }
       v343 = 'type' in v48 ? v43[v48.type] : v336.dtype;
       v338 = !!v48.normalized;
       v340 = v48.size | 0;
       v339 = v48.offset | 0;
       v342 = v48.stride | 0;
       v337 = v48.divisor | 0;
      }
     }
     v348 = positionFract.location;
     v349 = v0[v348];
     if (v341 === 1) {
      if (!v349.buffer) {
       v8.enableVertexAttribArray(v348);
      }
      v350 = v340 || 2;
      if (v349.type !== v343 || v349.size !== v350 || v349.buffer !== v336 || v349.normalized !== v338 || v349.offset !== v339 || v349.stride !== v342) {
       v8.bindBuffer(34962, v336.buffer);
       v8.vertexAttribPointer(v348, v350, v343, v338, v342, v339);
       v349.type = v343;
       v349.size = v350;
       v349.buffer = v336;
       v349.normalized = v338;
       v349.offset = v339;
       v349.stride = v342;
      }
      if (v349.divisor !== v337) {
       v302.vertexAttribDivisorANGLE(v348, v337);
       v349.divisor = v337;
      }
     }
     else {
      if (v349.buffer) {
       v8.disableVertexAttribArray(v348);
       v349.buffer = null;
      }
      if (v349.x !== v345 || v349.y !== v346 || v349.z !== v347 || v349.w !== v344) {
       v8.vertexAttrib4f(v348, v345, v346, v347, v344);
       v349.x = v345;
       v349.y = v346;
       v349.z = v347;
       v349.w = v344;
      }
     }
     v351 = v304['fill'];
     v352 = v351[0];
     v354 = v351[1];
     v356 = v351[2];
     v358 = v351[3];
     if (!v303 || v353 !== v352 || v355 !== v354 || v357 !== v356 || v359 !== v358) {
      v353 = v352;
      v355 = v354;
      v357 = v356;
      v359 = v358;
      v8.uniform4f(color.location, v352, v354, v356, v358);
     }
     v360 = v304['scale'];
     v361 = v360[0];
     v363 = v360[1];
     if (!v303 || v362 !== v361 || v364 !== v363) {
      v362 = v361;
      v364 = v363;
      v8.uniform2f(scale.location, v361, v363);
     }
     v365 = v304['scaleFract'];
     v366 = v365[0];
     v368 = v365[1];
     if (!v303 || v367 !== v366 || v369 !== v368) {
      v367 = v366;
      v369 = v368;
      v8.uniform2f(scaleFract.location, v366, v368);
     }
     v370 = v304['translate'];
     v371 = v370[0];
     v373 = v370[1];
     if (!v303 || v372 !== v371 || v374 !== v373) {
      v372 = v371;
      v374 = v373;
      v8.uniform2f(translate.location, v371, v373);
     }
     v375 = v304['translateFract'];
     v376 = v375[0];
     v378 = v375[1];
     if (!v303 || v377 !== v376 || v379 !== v378) {
      v377 = v376;
      v379 = v378;
      v8.uniform2f(translateFract.location, v376, v378);
     }
     v380 = v304['id'];
     if (!v303 || v381 !== v380) {
      v381 = v380;
      v8.uniform1f(id.location, v380);
     }
     v382 = v304['opacity'];
     if (!v303 || v383 !== v382) {
      v383 = v382;
      v8.uniform1f(opacity.location, v382);
     }
     v384 = $9.call(this, v2, v304, v303);
     v385 = null;
     v386 = v9(v384);
     if (v386) {
      v385 = v5.createStream(v384);
     }
     else {
      v385 = v5.getElements(v384);
     }
     if (v385) v8.bindBuffer(34963, v385.buffer.buffer);
     v387 = v385 ? v385.vertCount : -1;
     if (v387) {
      if (v388 > 0) {
       if (v385) {
        v302.drawElementsInstancedANGLE(4, v387, v385.type, 0 << ((v385.type - 5121) >> 1), v388);
       }
       else {
        v302.drawArraysInstancedANGLE(4, 0, v387, v388);
       }
      }
      else if (v388 < 0) {
       if (v385) {
        v8.drawElements(4, v387, v385.type, 0 << ((v385.type - 5121) >> 1));
       }
       else {
        v8.drawArrays(4, 0, v387);
       }
      }
      v2.viewportWidth = v310;
      v2.viewportHeight = v311;
      if (v318) {
       v1.destroyStream(v319);
      }
      if (v335) {
       v1.destroyStream(v336);
      }
      if (v386) {
       v5.destroyStream(v385);
      }
     }
    }
    v3.dirty = true;
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v49, v50, v83, v84, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153;
    v49 = v6.angle_instanced_arrays;
    v50 = v7.next;
    if (v50 !== v7.cur) {
     if (v50) {
      v8.bindFramebuffer(36160, v50.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v50;
    }
    if (v3.dirty) {
     var v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82;
     v51 = v10.dither;
     if (v51 !== v3.dither) {
      if (v51) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v51;
     }
     v52 = v10.depth_func;
     if (v52 !== v3.depth_func) {
      v8.depthFunc(v52);
      v3.depth_func = v52;
     }
     v53 = v24[0];
     v54 = v24[1];
     if (v53 !== v25[0] || v54 !== v25[1]) {
      v8.depthRange(v53, v54);
      v25[0] = v53;
      v25[1] = v54;
     }
     v55 = v10.depth_mask;
     if (v55 !== v3.depth_mask) {
      v8.depthMask(v55);
      v3.depth_mask = v55;
     }
     v56 = v22[0];
     v57 = v22[1];
     v58 = v22[2];
     v59 = v22[3];
     if (v56 !== v23[0] || v57 !== v23[1] || v58 !== v23[2] || v59 !== v23[3]) {
      v8.colorMask(v56, v57, v58, v59);
      v23[0] = v56;
      v23[1] = v57;
      v23[2] = v58;
      v23[3] = v59;
     }
     v60 = v10.cull_enable;
     if (v60 !== v3.cull_enable) {
      if (v60) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v60;
     }
     v61 = v10.cull_face;
     if (v61 !== v3.cull_face) {
      v8.cullFace(v61);
      v3.cull_face = v61;
     }
     v62 = v10.frontFace;
     if (v62 !== v3.frontFace) {
      v8.frontFace(v62);
      v3.frontFace = v62;
     }
     v63 = v10.lineWidth;
     if (v63 !== v3.lineWidth) {
      v8.lineWidth(v63);
      v3.lineWidth = v63;
     }
     v64 = v10.polygonOffset_enable;
     if (v64 !== v3.polygonOffset_enable) {
      if (v64) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v64;
     }
     v65 = v26[0];
     v66 = v26[1];
     if (v65 !== v27[0] || v66 !== v27[1]) {
      v8.polygonOffset(v65, v66);
      v27[0] = v65;
      v27[1] = v66;
     }
     v67 = v10.sample_alpha;
     if (v67 !== v3.sample_alpha) {
      if (v67) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v67;
     }
     v68 = v10.sample_enable;
     if (v68 !== v3.sample_enable) {
      if (v68) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v68;
     }
     v69 = v28[0];
     v70 = v28[1];
     if (v69 !== v29[0] || v70 !== v29[1]) {
      v8.sampleCoverage(v69, v70);
      v29[0] = v69;
      v29[1] = v70;
     }
     v71 = v10.stencil_mask;
     if (v71 !== v3.stencil_mask) {
      v8.stencilMask(v71);
      v3.stencil_mask = v71;
     }
     v72 = v32[0];
     v73 = v32[1];
     v74 = v32[2];
     if (v72 !== v33[0] || v73 !== v33[1] || v74 !== v33[2]) {
      v8.stencilFunc(v72, v73, v74);
      v33[0] = v72;
      v33[1] = v73;
      v33[2] = v74;
     }
     v75 = v36[0];
     v76 = v36[1];
     v77 = v36[2];
     v78 = v36[3];
     if (v75 !== v37[0] || v76 !== v37[1] || v77 !== v37[2] || v78 !== v37[3]) {
      v8.stencilOpSeparate(v75, v76, v77, v78);
      v37[0] = v75;
      v37[1] = v76;
      v37[2] = v77;
      v37[3] = v78;
     }
     v79 = v34[0];
     v80 = v34[1];
     v81 = v34[2];
     v82 = v34[3];
     if (v79 !== v35[0] || v80 !== v35[1] || v81 !== v35[2] || v82 !== v35[3]) {
      v8.stencilOpSeparate(v79, v80, v81, v82);
      v35[0] = v79;
      v35[1] = v80;
      v35[2] = v81;
      v35[3] = v82;
     }
    }
    v83 = a0['viewport'];
    v84 = v83.x | 0;
    v85 = v83.y | 0;
    v86 = 'width' in v83 ? v83.width | 0 : (v2.framebufferWidth - v84);
    v87 = 'height' in v83 ? v83.height | 0 : (v2.framebufferHeight - v85);
    v88 = v2.viewportWidth;
    v2.viewportWidth = v86;
    v89 = v2.viewportHeight;
    v2.viewportHeight = v87;
    v8.viewport(v84, v85, v86, v87);
    v39[0] = v84;
    v39[1] = v85;
    v39[2] = v86;
    v39[3] = v87;
    v8.blendColor(0, 0, 0, 0);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 0;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendEquationSeparate(32774, 32774);
    v19[0] = 32774;
    v19[1] = 32774;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v90 = a0['viewport'];
    v91 = v90.x | 0;
    v92 = v90.y | 0;
    v93 = 'width' in v90 ? v90.width | 0 : (v2.framebufferWidth - v91);
    v94 = 'height' in v90 ? v90.height | 0 : (v2.framebufferHeight - v92);
    v8.scissor(v91, v92, v93, v94);
    v31[0] = v91;
    v31[1] = v92;
    v31[2] = v93;
    v31[3] = v94;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($2.program);
    v95 = v6.angle_instanced_arrays;
    v15.setVAO(null);
    v96 = a0['positionBuffer'];
    v47.buffer = v96;
    v97 = false;
    v98 = null;
    v99 = 0;
    v100 = false;
    v101 = 0;
    v102 = 0;
    v103 = 1;
    v104 = 0;
    v105 = 5126;
    v106 = 0;
    v107 = 0;
    v108 = 0;
    v109 = 0;
    if (v9(v47)) {
     v97 = true;
     v98 = v1.createStream(34962, v47);
     v105 = v98.dtype;
    }
    else {
     v98 = v1.getBuffer(v47);
     if (v98) {
      v105 = v98.dtype;
     }
     else if ('constant' in v47) {
      v103 = 2;
      if (typeof v47.constant === 'number') {
       v107 = v47.constant;
       v108 = v109 = v106 = 0;
      }
      else {
       v107 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v108 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v109 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v106 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v98 = v1.createStream(34962, v47.buffer);
      }
      else {
       v98 = v1.getBuffer(v47.buffer);
      }
      v105 = 'type' in v47 ? v43[v47.type] : v98.dtype;
      v100 = !!v47.normalized;
      v102 = v47.size | 0;
      v101 = v47.offset | 0;
      v104 = v47.stride | 0;
      v99 = v47.divisor | 0;
     }
    }
    v110 = position.location;
    v111 = v0[v110];
    if (v103 === 1) {
     if (!v111.buffer) {
      v8.enableVertexAttribArray(v110);
     }
     v112 = v102 || 2;
     if (v111.type !== v105 || v111.size !== v112 || v111.buffer !== v98 || v111.normalized !== v100 || v111.offset !== v101 || v111.stride !== v104) {
      v8.bindBuffer(34962, v98.buffer);
      v8.vertexAttribPointer(v110, v112, v105, v100, v104, v101);
      v111.type = v105;
      v111.size = v112;
      v111.buffer = v98;
      v111.normalized = v100;
      v111.offset = v101;
      v111.stride = v104;
     }
     if (v111.divisor !== v99) {
      v95.vertexAttribDivisorANGLE(v110, v99);
      v111.divisor = v99;
     }
    }
    else {
     if (v111.buffer) {
      v8.disableVertexAttribArray(v110);
      v111.buffer = null;
     }
     if (v111.x !== v107 || v111.y !== v108 || v111.z !== v109 || v111.w !== v106) {
      v8.vertexAttrib4f(v110, v107, v108, v109, v106);
      v111.x = v107;
      v111.y = v108;
      v111.z = v109;
      v111.w = v106;
     }
    }
    v113 = a0['positionFractBuffer'];
    v48.buffer = v113;
    v114 = false;
    v115 = null;
    v116 = 0;
    v117 = false;
    v118 = 0;
    v119 = 0;
    v120 = 1;
    v121 = 0;
    v122 = 5126;
    v123 = 0;
    v124 = 0;
    v125 = 0;
    v126 = 0;
    if (v9(v48)) {
     v114 = true;
     v115 = v1.createStream(34962, v48);
     v122 = v115.dtype;
    }
    else {
     v115 = v1.getBuffer(v48);
     if (v115) {
      v122 = v115.dtype;
     }
     else if ('constant' in v48) {
      v120 = 2;
      if (typeof v48.constant === 'number') {
       v124 = v48.constant;
       v125 = v126 = v123 = 0;
      }
      else {
       v124 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v125 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v126 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v123 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v115 = v1.createStream(34962, v48.buffer);
      }
      else {
       v115 = v1.getBuffer(v48.buffer);
      }
      v122 = 'type' in v48 ? v43[v48.type] : v115.dtype;
      v117 = !!v48.normalized;
      v119 = v48.size | 0;
      v118 = v48.offset | 0;
      v121 = v48.stride | 0;
      v116 = v48.divisor | 0;
     }
    }
    v127 = positionFract.location;
    v128 = v0[v127];
    if (v120 === 1) {
     if (!v128.buffer) {
      v8.enableVertexAttribArray(v127);
     }
     v129 = v119 || 2;
     if (v128.type !== v122 || v128.size !== v129 || v128.buffer !== v115 || v128.normalized !== v117 || v128.offset !== v118 || v128.stride !== v121) {
      v8.bindBuffer(34962, v115.buffer);
      v8.vertexAttribPointer(v127, v129, v122, v117, v121, v118);
      v128.type = v122;
      v128.size = v129;
      v128.buffer = v115;
      v128.normalized = v117;
      v128.offset = v118;
      v128.stride = v121;
     }
     if (v128.divisor !== v116) {
      v95.vertexAttribDivisorANGLE(v127, v116);
      v128.divisor = v116;
     }
    }
    else {
     if (v128.buffer) {
      v8.disableVertexAttribArray(v127);
      v128.buffer = null;
     }
     if (v128.x !== v124 || v128.y !== v125 || v128.z !== v126 || v128.w !== v123) {
      v8.vertexAttrib4f(v127, v124, v125, v126, v123);
      v128.x = v124;
      v128.y = v125;
      v128.z = v126;
      v128.w = v123;
     }
    }
    v130 = a0['fill'];
    v131 = v130[0];
    v132 = v130[1];
    v133 = v130[2];
    v134 = v130[3];
    v8.uniform4f(color.location, v131, v132, v133, v134);
    v135 = a0['scale'];
    v136 = v135[0];
    v137 = v135[1];
    v8.uniform2f(scale.location, v136, v137);
    v138 = a0['scaleFract'];
    v139 = v138[0];
    v140 = v138[1];
    v8.uniform2f(scaleFract.location, v139, v140);
    v141 = a0['translate'];
    v142 = v141[0];
    v143 = v141[1];
    v8.uniform2f(translate.location, v142, v143);
    v144 = a0['translateFract'];
    v145 = v144[0];
    v146 = v144[1];
    v8.uniform2f(translateFract.location, v145, v146);
    v147 = a0['id'];
    v8.uniform1f(id.location, v147);
    v148 = a0['opacity'];
    v8.uniform1f(opacity.location, v148);
    v149 = $3.call(this, v2, a0, 0);
    v150 = null;
    v151 = v9(v149);
    if (v151) {
     v150 = v5.createStream(v149);
    }
    else {
     v150 = v5.getElements(v149);
    }
    if (v150) v8.bindBuffer(34963, v150.buffer.buffer);
    v152 = v150 ? v150.vertCount : -1;
    if (v152) {
     v153 = v4.instances;
     if (v153 > 0) {
      if (v150) {
       v95.drawElementsInstancedANGLE(4, v152, v150.type, 0 << ((v150.type - 5121) >> 1), v153);
      }
      else {
       v95.drawArraysInstancedANGLE(4, 0, v152, v153);
      }
     }
     else if (v153 < 0) {
      if (v150) {
       v8.drawElements(4, v152, v150.type, 0 << ((v150.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(4, 0, v152);
      }
     }
     v3.dirty = true;
     v15.setVAO(null);
     v2.viewportWidth = v88;
     v2.viewportHeight = v89;
     if (v97) {
      v1.destroyStream(v98);
     }
     if (v114) {
      v1.destroyStream(v115);
     }
     if (v151) {
      v5.destroyStream(v150);
     }
    }
   }
   , 'scope': function (a0, a1, a2) {
    var v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177, v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195, v196, v197, v198, v199, v200, v201, v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213, v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225, v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267;
    v154 = a0['viewport'];
    v155 = v154.x | 0;
    v156 = v154.y | 0;
    v157 = 'width' in v154 ? v154.width | 0 : (v2.framebufferWidth - v155);
    v158 = 'height' in v154 ? v154.height | 0 : (v2.framebufferHeight - v156);
    v159 = v2.viewportWidth;
    v2.viewportWidth = v157;
    v160 = v2.viewportHeight;
    v2.viewportHeight = v158;
    v161 = v38[0];
    v38[0] = v155;
    v162 = v38[1];
    v38[1] = v156;
    v163 = v38[2];
    v38[2] = v157;
    v164 = v38[3];
    v38[3] = v158;
    v165 = v16[0];
    v16[0] = 0;
    v166 = v16[1];
    v16[1] = 0;
    v167 = v16[2];
    v16[2] = 0;
    v168 = v16[3];
    v16[3] = 0;
    v169 = v10.blend_enable;
    v10.blend_enable = true;
    v170 = v18[0];
    v18[0] = 32774;
    v171 = v18[1];
    v18[1] = 32774;
    v172 = v20[0];
    v20[0] = 770;
    v173 = v20[1];
    v20[1] = 771;
    v174 = v20[2];
    v20[2] = 773;
    v175 = v20[3];
    v20[3] = 1;
    v176 = v10.depth_enable;
    v10.depth_enable = false;
    v177 = a0['viewport'];
    v178 = v177.x | 0;
    v179 = v177.y | 0;
    v180 = 'width' in v177 ? v177.width | 0 : (v2.framebufferWidth - v178);
    v181 = 'height' in v177 ? v177.height | 0 : (v2.framebufferHeight - v179);
    v182 = v30[0];
    v30[0] = v178;
    v183 = v30[1];
    v30[1] = v179;
    v184 = v30[2];
    v30[2] = v180;
    v185 = v30[3];
    v30[3] = v181;
    v186 = v10.scissor_enable;
    v10.scissor_enable = true;
    v187 = v10.stencil_enable;
    v10.stencil_enable = false;
    v188 = $4.call(this, v2, a0, a2);
    v189 = null;
    v190 = v9(v188);
    if (v190) {
     v189 = v5.createStream(v188);
    }
    else {
     v189 = v5.getElements(v188);
    }
    v191 = v4.elements;
    v4.elements = v189;
    v192 = v4.offset;
    v4.offset = 0;
    v193 = v189 ? v189.vertCount : -1;
    v194 = v4.count;
    v4.count = v193;
    v195 = v4.primitive;
    v4.primitive = 4;
    v196 = a0['fill'];
    v197 = v14[14];
    v14[14] = v196;
    v198 = a0['id'];
    v199 = v14[31];
    v14[31] = v198;
    v200 = a0['opacity'];
    v201 = v14[10];
    v14[10] = v200;
    v202 = v2['pixelRatio'];
    v203 = v14[34];
    v14[34] = v202;
    v204 = a0['scale'];
    v205 = v14[6];
    v14[6] = v204;
    v206 = a0['scaleFract'];
    v207 = v14[7];
    v14[7] = v206;
    v208 = a0['translate'];
    v209 = v14[8];
    v14[8] = v208;
    v210 = a0['translateFract'];
    v211 = v14[9];
    v14[9] = v210;
    v212 = $5.call(this, v2, a0, a2);
    v213 = v14[3];
    v14[3] = v212;
    v214 = a0['positionBuffer'];
    v47.buffer = v214;
    v215 = false;
    v216 = null;
    v217 = 0;
    v218 = false;
    v219 = 0;
    v220 = 0;
    v221 = 1;
    v222 = 0;
    v223 = 5126;
    v224 = 0;
    v225 = 0;
    v226 = 0;
    v227 = 0;
    if (v9(v47)) {
     v215 = true;
     v216 = v1.createStream(34962, v47);
     v223 = v216.dtype;
    }
    else {
     v216 = v1.getBuffer(v47);
     if (v216) {
      v223 = v216.dtype;
     }
     else if ('constant' in v47) {
      v221 = 2;
      if (typeof v47.constant === 'number') {
       v225 = v47.constant;
       v226 = v227 = v224 = 0;
      }
      else {
       v225 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v226 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v227 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v224 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v216 = v1.createStream(34962, v47.buffer);
      }
      else {
       v216 = v1.getBuffer(v47.buffer);
      }
      v223 = 'type' in v47 ? v43[v47.type] : v216.dtype;
      v218 = !!v47.normalized;
      v220 = v47.size | 0;
      v219 = v47.offset | 0;
      v222 = v47.stride | 0;
      v217 = v47.divisor | 0;
     }
    }
    v228 = $6.buffer;
    $6.buffer = v216;
    v229 = $6.divisor;
    $6.divisor = v217;
    v230 = $6.normalized;
    $6.normalized = v218;
    v231 = $6.offset;
    $6.offset = v219;
    v232 = $6.size;
    $6.size = v220;
    v233 = $6.state;
    $6.state = v221;
    v234 = $6.stride;
    $6.stride = v222;
    v235 = $6.type;
    $6.type = v223;
    v236 = $6.w;
    $6.w = v224;
    v237 = $6.x;
    $6.x = v225;
    v238 = $6.y;
    $6.y = v226;
    v239 = $6.z;
    $6.z = v227;
    v240 = a0['positionFractBuffer'];
    v48.buffer = v240;
    v241 = false;
    v242 = null;
    v243 = 0;
    v244 = false;
    v245 = 0;
    v246 = 0;
    v247 = 1;
    v248 = 0;
    v249 = 5126;
    v250 = 0;
    v251 = 0;
    v252 = 0;
    v253 = 0;
    if (v9(v48)) {
     v241 = true;
     v242 = v1.createStream(34962, v48);
     v249 = v242.dtype;
    }
    else {
     v242 = v1.getBuffer(v48);
     if (v242) {
      v249 = v242.dtype;
     }
     else if ('constant' in v48) {
      v247 = 2;
      if (typeof v48.constant === 'number') {
       v251 = v48.constant;
       v252 = v253 = v250 = 0;
      }
      else {
       v251 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v252 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v253 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v250 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v242 = v1.createStream(34962, v48.buffer);
      }
      else {
       v242 = v1.getBuffer(v48.buffer);
      }
      v249 = 'type' in v48 ? v43[v48.type] : v242.dtype;
      v244 = !!v48.normalized;
      v246 = v48.size | 0;
      v245 = v48.offset | 0;
      v248 = v48.stride | 0;
      v243 = v48.divisor | 0;
     }
    }
    v254 = $7.buffer;
    $7.buffer = v242;
    v255 = $7.divisor;
    $7.divisor = v243;
    v256 = $7.normalized;
    $7.normalized = v244;
    v257 = $7.offset;
    $7.offset = v245;
    v258 = $7.size;
    $7.size = v246;
    v259 = $7.state;
    $7.state = v247;
    v260 = $7.stride;
    $7.stride = v248;
    v261 = $7.type;
    $7.type = v249;
    v262 = $7.w;
    $7.w = v250;
    v263 = $7.x;
    $7.x = v251;
    v264 = $7.y;
    $7.y = v252;
    v265 = $7.z;
    $7.z = v253;
    v266 = v11.vert;
    v11.vert = 42;
    v267 = v11.frag;
    v11.frag = 41;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v159;
    v2.viewportHeight = v160;
    v38[0] = v161;
    v38[1] = v162;
    v38[2] = v163;
    v38[3] = v164;
    v16[0] = v165;
    v16[1] = v166;
    v16[2] = v167;
    v16[3] = v168;
    v10.blend_enable = v169;
    v18[0] = v170;
    v18[1] = v171;
    v20[0] = v172;
    v20[1] = v173;
    v20[2] = v174;
    v20[3] = v175;
    v10.depth_enable = v176;
    v30[0] = v182;
    v30[1] = v183;
    v30[2] = v184;
    v30[3] = v185;
    v10.scissor_enable = v186;
    v10.stencil_enable = v187;
    if (v190) {
     v5.destroyStream(v189);
    }
    v4.elements = v191;
    v4.offset = v192;
    v4.count = v194;
    v4.primitive = v195;
    v14[14] = v197;
    v14[31] = v199;
    v14[10] = v201;
    v14[34] = v203;
    v14[6] = v205;
    v14[7] = v207;
    v14[8] = v209;
    v14[9] = v211;
    v14[3] = v213;
    if (v215) {
     v1.destroyStream(v216);
    }
    $6.buffer = v228;
    $6.divisor = v229;
    $6.normalized = v230;
    $6.offset = v231;
    $6.size = v232;
    $6.state = v233;
    $6.stride = v234;
    $6.type = v235;
    $6.w = v236;
    $6.x = v237;
    $6.y = v238;
    $6.z = v239;
    if (v241) {
     v1.destroyStream(v242);
    }
    $7.buffer = v254;
    $7.divisor = v255;
    $7.normalized = v256;
    $7.offset = v257;
    $7.size = v258;
    $7.state = v259;
    $7.stride = v260;
    $7.type = v261;
    $7.w = v262;
    $7.x = v263;
    $7.y = v264;
    $7.z = v265;
    v11.vert = v266;
    v11.frag = v267;
    v3.dirty = true;
   }
   ,
  }

 },
 '$45,borderColorId,borderSize,colorId,constPointSize,isActive,markerTexture,opacity,paletteSize,paletteTexture,pixelRatio,scale,scaleFract,size,translate,translateFract,x,xFract,y,yFract': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, borderColorId, borderSize, colorId, constPointSize, isActive, markerTexture, opacity, paletteSize, paletteTexture, pixelRatio, scale, scaleFract, size, translate, translateFract, x, xFract, y, yFract
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  return {
   'batch': function (a0, a1) {
    var v569, v570, v605, v606, v607;
    v569 = v6.angle_instanced_arrays;
    v570 = v7.next;
    if (v570 !== v7.cur) {
     if (v570) {
      v8.bindFramebuffer(36160, v570.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v570;
    }
    if (v3.dirty) {
     var v571, v572, v573, v574, v575, v576, v577, v578, v579, v580, v581, v582, v583, v584, v585, v586, v587, v588, v589, v590, v591, v592, v593, v594, v595, v596, v597, v598, v599, v600, v601, v602, v603, v604;
     v571 = v10.dither;
     if (v571 !== v3.dither) {
      if (v571) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v571;
     }
     v572 = v18[0];
     v573 = v18[1];
     if (v572 !== v19[0] || v573 !== v19[1]) {
      v8.blendEquationSeparate(v572, v573);
      v19[0] = v572;
      v19[1] = v573;
     }
     v574 = v10.depth_func;
     if (v574 !== v3.depth_func) {
      v8.depthFunc(v574);
      v3.depth_func = v574;
     }
     v575 = v24[0];
     v576 = v24[1];
     if (v575 !== v25[0] || v576 !== v25[1]) {
      v8.depthRange(v575, v576);
      v25[0] = v575;
      v25[1] = v576;
     }
     v577 = v10.depth_mask;
     if (v577 !== v3.depth_mask) {
      v8.depthMask(v577);
      v3.depth_mask = v577;
     }
     v578 = v22[0];
     v579 = v22[1];
     v580 = v22[2];
     v581 = v22[3];
     if (v578 !== v23[0] || v579 !== v23[1] || v580 !== v23[2] || v581 !== v23[3]) {
      v8.colorMask(v578, v579, v580, v581);
      v23[0] = v578;
      v23[1] = v579;
      v23[2] = v580;
      v23[3] = v581;
     }
     v582 = v10.cull_enable;
     if (v582 !== v3.cull_enable) {
      if (v582) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v582;
     }
     v583 = v10.cull_face;
     if (v583 !== v3.cull_face) {
      v8.cullFace(v583);
      v3.cull_face = v583;
     }
     v584 = v10.frontFace;
     if (v584 !== v3.frontFace) {
      v8.frontFace(v584);
      v3.frontFace = v584;
     }
     v585 = v10.lineWidth;
     if (v585 !== v3.lineWidth) {
      v8.lineWidth(v585);
      v3.lineWidth = v585;
     }
     v586 = v10.polygonOffset_enable;
     if (v586 !== v3.polygonOffset_enable) {
      if (v586) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v586;
     }
     v587 = v26[0];
     v588 = v26[1];
     if (v587 !== v27[0] || v588 !== v27[1]) {
      v8.polygonOffset(v587, v588);
      v27[0] = v587;
      v27[1] = v588;
     }
     v589 = v10.sample_alpha;
     if (v589 !== v3.sample_alpha) {
      if (v589) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v589;
     }
     v590 = v10.sample_enable;
     if (v590 !== v3.sample_enable) {
      if (v590) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v590;
     }
     v591 = v28[0];
     v592 = v28[1];
     if (v591 !== v29[0] || v592 !== v29[1]) {
      v8.sampleCoverage(v591, v592);
      v29[0] = v591;
      v29[1] = v592;
     }
     v593 = v10.stencil_mask;
     if (v593 !== v3.stencil_mask) {
      v8.stencilMask(v593);
      v3.stencil_mask = v593;
     }
     v594 = v32[0];
     v595 = v32[1];
     v596 = v32[2];
     if (v594 !== v33[0] || v595 !== v33[1] || v596 !== v33[2]) {
      v8.stencilFunc(v594, v595, v596);
      v33[0] = v594;
      v33[1] = v595;
      v33[2] = v596;
     }
     v597 = v36[0];
     v598 = v36[1];
     v599 = v36[2];
     v600 = v36[3];
     if (v597 !== v37[0] || v598 !== v37[1] || v599 !== v37[2] || v600 !== v37[3]) {
      v8.stencilOpSeparate(v597, v598, v599, v600);
      v37[0] = v597;
      v37[1] = v598;
      v37[2] = v599;
      v37[3] = v600;
     }
     v601 = v34[0];
     v602 = v34[1];
     v603 = v34[2];
     v604 = v34[3];
     if (v601 !== v35[0] || v602 !== v35[1] || v603 !== v35[2] || v604 !== v35[3]) {
      v8.stencilOpSeparate(v601, v602, v603, v604);
      v35[0] = v601;
      v35[1] = v602;
      v35[2] = v603;
      v35[3] = v604;
     }
    }
    v8.blendColor(0, 0, 0, 1);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 1;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($34.program);
    v605 = v6.angle_instanced_arrays;
    var v809;
    v15.setVAO(null);
    v8.uniform1i(constPointSize.location, false);
    v8.uniform1i(paletteTexture.location, $44.bind());
    v809 = v4.instances;
    for (v606 = 0;
     v606 < a1;
     ++v606) {
     v607 = a0[v606];
     var v608, v609, v610, v611, v612, v613, v614, v615, v616, v617, v618, v619, v620, v621, v622, v623, v624, v625, v626, v627, v628, v629, v630, v631, v632, v633, v634, v635, v636, v637, v638, v639, v640, v641, v642, v643, v644, v645, v646, v647, v648, v649, v650, v651, v652, v653, v654, v655, v656, v657, v658, v659, v660, v661, v662, v663, v664, v665, v666, v667, v668, v669, v670, v671, v672, v673, v674, v675, v676, v677, v678, v679, v680, v681, v682, v683, v684, v685, v686, v687, v688, v689, v690, v691, v692, v693, v694, v695, v696, v697, v698, v699, v700, v701, v702, v703, v704, v705, v706, v707, v708, v709, v710, v711, v712, v713, v714, v715, v716, v717, v718, v719, v720, v721, v722, v723, v724, v725, v726, v727, v728, v729, v730, v731, v732, v733, v734, v735, v736, v737, v738, v739, v740, v741, v742, v743, v744, v745, v746, v747, v748, v749, v750, v751, v752, v753, v754, v755, v756, v757, v758, v759, v760, v761, v762, v763, v764, v765, v766, v767, v768, v769, v770, v771, v772, v773, v774, v775, v776, v777, v778, v779, v780, v781, v782, v783, v784, v785, v786, v787, v788, v789, v790, v791, v792, v793, v794, v795, v796, v797, v798, v799, v800, v801, v802, v803, v804, v805, v806, v807, v808;
     v608 = v607['viewport'];
     v609 = v608.x | 0;
     v610 = v608.y | 0;
     v611 = 'width' in v608 ? v608.width | 0 : (v2.framebufferWidth - v609);
     v612 = 'height' in v608 ? v608.height | 0 : (v2.framebufferHeight - v610);
     v613 = v2.viewportWidth;
     v2.viewportWidth = v611;
     v614 = v2.viewportHeight;
     v2.viewportHeight = v612;
     v8.viewport(v609, v610, v611, v612);
     v39[0] = v609;
     v39[1] = v610;
     v39[2] = v611;
     v39[3] = v612;
     v615 = v607['viewport'];
     v616 = v615.x | 0;
     v617 = v615.y | 0;
     v618 = 'width' in v615 ? v615.width | 0 : (v2.framebufferWidth - v616);
     v619 = 'height' in v615 ? v615.height | 0 : (v2.framebufferHeight - v617);
     v8.scissor(v616, v617, v618, v619);
     v31[0] = v616;
     v31[1] = v617;
     v31[2] = v618;
     v31[3] = v619;
     v620 = $35.call(this, v2, v607, v606);
     v621 = false;
     v622 = null;
     v623 = 0;
     v624 = false;
     v625 = 0;
     v626 = 0;
     v627 = 1;
     v628 = 0;
     v629 = 5126;
     v630 = 0;
     v631 = 0;
     v632 = 0;
     v633 = 0;
     if (v9(v620)) {
      v621 = true;
      v622 = v1.createStream(34962, v620);
      v629 = v622.dtype;
     }
     else {
      v622 = v1.getBuffer(v620);
      if (v622) {
       v629 = v622.dtype;
      }
      else if ('constant' in v620) {
       v627 = 2;
       if (typeof v620.constant === 'number') {
        v631 = v620.constant;
        v632 = v633 = v630 = 0;
       }
       else {
        v631 = v620.constant.length > 0 ? v620.constant[0] : 0;
        v632 = v620.constant.length > 1 ? v620.constant[1] : 0;
        v633 = v620.constant.length > 2 ? v620.constant[2] : 0;
        v630 = v620.constant.length > 3 ? v620.constant[3] : 0;
       }
      }
      else {
       if (v9(v620.buffer)) {
        v622 = v1.createStream(34962, v620.buffer);
       }
       else {
        v622 = v1.getBuffer(v620.buffer);
       }
       v629 = 'type' in v620 ? v43[v620.type] : v622.dtype;
       v624 = !!v620.normalized;
       v626 = v620.size | 0;
       v625 = v620.offset | 0;
       v628 = v620.stride | 0;
       v623 = v620.divisor | 0;
      }
     }
     v634 = x.location;
     v635 = v0[v634];
     if (v627 === 1) {
      if (!v635.buffer) {
       v8.enableVertexAttribArray(v634);
      }
      v636 = v626 || 1;
      if (v635.type !== v629 || v635.size !== v636 || v635.buffer !== v622 || v635.normalized !== v624 || v635.offset !== v625 || v635.stride !== v628) {
       v8.bindBuffer(34962, v622.buffer);
       v8.vertexAttribPointer(v634, v636, v629, v624, v628, v625);
       v635.type = v629;
       v635.size = v636;
       v635.buffer = v622;
       v635.normalized = v624;
       v635.offset = v625;
       v635.stride = v628;
      }
      if (v635.divisor !== v623) {
       v605.vertexAttribDivisorANGLE(v634, v623);
       v635.divisor = v623;
      }
     }
     else {
      if (v635.buffer) {
       v8.disableVertexAttribArray(v634);
       v635.buffer = null;
      }
      if (v635.x !== v631 || v635.y !== v632 || v635.z !== v633 || v635.w !== v630) {
       v8.vertexAttrib4f(v634, v631, v632, v633, v630);
       v635.x = v631;
       v635.y = v632;
       v635.z = v633;
       v635.w = v630;
      }
     }
     v637 = $36.call(this, v2, v607, v606);
     v638 = false;
     v639 = null;
     v640 = 0;
     v641 = false;
     v642 = 0;
     v643 = 0;
     v644 = 1;
     v645 = 0;
     v646 = 5126;
     v647 = 0;
     v648 = 0;
     v649 = 0;
     v650 = 0;
     if (v9(v637)) {
      v638 = true;
      v639 = v1.createStream(34962, v637);
      v646 = v639.dtype;
     }
     else {
      v639 = v1.getBuffer(v637);
      if (v639) {
       v646 = v639.dtype;
      }
      else if ('constant' in v637) {
       v644 = 2;
       if (typeof v637.constant === 'number') {
        v648 = v637.constant;
        v649 = v650 = v647 = 0;
       }
       else {
        v648 = v637.constant.length > 0 ? v637.constant[0] : 0;
        v649 = v637.constant.length > 1 ? v637.constant[1] : 0;
        v650 = v637.constant.length > 2 ? v637.constant[2] : 0;
        v647 = v637.constant.length > 3 ? v637.constant[3] : 0;
       }
      }
      else {
       if (v9(v637.buffer)) {
        v639 = v1.createStream(34962, v637.buffer);
       }
       else {
        v639 = v1.getBuffer(v637.buffer);
       }
       v646 = 'type' in v637 ? v43[v637.type] : v639.dtype;
       v641 = !!v637.normalized;
       v643 = v637.size | 0;
       v642 = v637.offset | 0;
       v645 = v637.stride | 0;
       v640 = v637.divisor | 0;
      }
     }
     v651 = y.location;
     v652 = v0[v651];
     if (v644 === 1) {
      if (!v652.buffer) {
       v8.enableVertexAttribArray(v651);
      }
      v653 = v643 || 1;
      if (v652.type !== v646 || v652.size !== v653 || v652.buffer !== v639 || v652.normalized !== v641 || v652.offset !== v642 || v652.stride !== v645) {
       v8.bindBuffer(34962, v639.buffer);
       v8.vertexAttribPointer(v651, v653, v646, v641, v645, v642);
       v652.type = v646;
       v652.size = v653;
       v652.buffer = v639;
       v652.normalized = v641;
       v652.offset = v642;
       v652.stride = v645;
      }
      if (v652.divisor !== v640) {
       v605.vertexAttribDivisorANGLE(v651, v640);
       v652.divisor = v640;
      }
     }
     else {
      if (v652.buffer) {
       v8.disableVertexAttribArray(v651);
       v652.buffer = null;
      }
      if (v652.x !== v648 || v652.y !== v649 || v652.z !== v650 || v652.w !== v647) {
       v8.vertexAttrib4f(v651, v648, v649, v650, v647);
       v652.x = v648;
       v652.y = v649;
       v652.z = v650;
       v652.w = v647;
      }
     }
     v654 = $37.call(this, v2, v607, v606);
     v655 = false;
     v656 = null;
     v657 = 0;
     v658 = false;
     v659 = 0;
     v660 = 0;
     v661 = 1;
     v662 = 0;
     v663 = 5126;
     v664 = 0;
     v665 = 0;
     v666 = 0;
     v667 = 0;
     if (v9(v654)) {
      v655 = true;
      v656 = v1.createStream(34962, v654);
      v663 = v656.dtype;
     }
     else {
      v656 = v1.getBuffer(v654);
      if (v656) {
       v663 = v656.dtype;
      }
      else if ('constant' in v654) {
       v661 = 2;
       if (typeof v654.constant === 'number') {
        v665 = v654.constant;
        v666 = v667 = v664 = 0;
       }
       else {
        v665 = v654.constant.length > 0 ? v654.constant[0] : 0;
        v666 = v654.constant.length > 1 ? v654.constant[1] : 0;
        v667 = v654.constant.length > 2 ? v654.constant[2] : 0;
        v664 = v654.constant.length > 3 ? v654.constant[3] : 0;
       }
      }
      else {
       if (v9(v654.buffer)) {
        v656 = v1.createStream(34962, v654.buffer);
       }
       else {
        v656 = v1.getBuffer(v654.buffer);
       }
       v663 = 'type' in v654 ? v43[v654.type] : v656.dtype;
       v658 = !!v654.normalized;
       v660 = v654.size | 0;
       v659 = v654.offset | 0;
       v662 = v654.stride | 0;
       v657 = v654.divisor | 0;
      }
     }
     v668 = xFract.location;
     v669 = v0[v668];
     if (v661 === 1) {
      if (!v669.buffer) {
       v8.enableVertexAttribArray(v668);
      }
      v670 = v660 || 1;
      if (v669.type !== v663 || v669.size !== v670 || v669.buffer !== v656 || v669.normalized !== v658 || v669.offset !== v659 || v669.stride !== v662) {
       v8.bindBuffer(34962, v656.buffer);
       v8.vertexAttribPointer(v668, v670, v663, v658, v662, v659);
       v669.type = v663;
       v669.size = v670;
       v669.buffer = v656;
       v669.normalized = v658;
       v669.offset = v659;
       v669.stride = v662;
      }
      if (v669.divisor !== v657) {
       v605.vertexAttribDivisorANGLE(v668, v657);
       v669.divisor = v657;
      }
     }
     else {
      if (v669.buffer) {
       v8.disableVertexAttribArray(v668);
       v669.buffer = null;
      }
      if (v669.x !== v665 || v669.y !== v666 || v669.z !== v667 || v669.w !== v664) {
       v8.vertexAttrib4f(v668, v665, v666, v667, v664);
       v669.x = v665;
       v669.y = v666;
       v669.z = v667;
       v669.w = v664;
      }
     }
     v671 = $38.call(this, v2, v607, v606);
     v672 = false;
     v673 = null;
     v674 = 0;
     v675 = false;
     v676 = 0;
     v677 = 0;
     v678 = 1;
     v679 = 0;
     v680 = 5126;
     v681 = 0;
     v682 = 0;
     v683 = 0;
     v684 = 0;
     if (v9(v671)) {
      v672 = true;
      v673 = v1.createStream(34962, v671);
      v680 = v673.dtype;
     }
     else {
      v673 = v1.getBuffer(v671);
      if (v673) {
       v680 = v673.dtype;
      }
      else if ('constant' in v671) {
       v678 = 2;
       if (typeof v671.constant === 'number') {
        v682 = v671.constant;
        v683 = v684 = v681 = 0;
       }
       else {
        v682 = v671.constant.length > 0 ? v671.constant[0] : 0;
        v683 = v671.constant.length > 1 ? v671.constant[1] : 0;
        v684 = v671.constant.length > 2 ? v671.constant[2] : 0;
        v681 = v671.constant.length > 3 ? v671.constant[3] : 0;
       }
      }
      else {
       if (v9(v671.buffer)) {
        v673 = v1.createStream(34962, v671.buffer);
       }
       else {
        v673 = v1.getBuffer(v671.buffer);
       }
       v680 = 'type' in v671 ? v43[v671.type] : v673.dtype;
       v675 = !!v671.normalized;
       v677 = v671.size | 0;
       v676 = v671.offset | 0;
       v679 = v671.stride | 0;
       v674 = v671.divisor | 0;
      }
     }
     v685 = yFract.location;
     v686 = v0[v685];
     if (v678 === 1) {
      if (!v686.buffer) {
       v8.enableVertexAttribArray(v685);
      }
      v687 = v677 || 1;
      if (v686.type !== v680 || v686.size !== v687 || v686.buffer !== v673 || v686.normalized !== v675 || v686.offset !== v676 || v686.stride !== v679) {
       v8.bindBuffer(34962, v673.buffer);
       v8.vertexAttribPointer(v685, v687, v680, v675, v679, v676);
       v686.type = v680;
       v686.size = v687;
       v686.buffer = v673;
       v686.normalized = v675;
       v686.offset = v676;
       v686.stride = v679;
      }
      if (v686.divisor !== v674) {
       v605.vertexAttribDivisorANGLE(v685, v674);
       v686.divisor = v674;
      }
     }
     else {
      if (v686.buffer) {
       v8.disableVertexAttribArray(v685);
       v686.buffer = null;
      }
      if (v686.x !== v682 || v686.y !== v683 || v686.z !== v684 || v686.w !== v681) {
       v8.vertexAttrib4f(v685, v682, v683, v684, v681);
       v686.x = v682;
       v686.y = v683;
       v686.z = v684;
       v686.w = v681;
      }
     }
     v688 = $39.call(this, v2, v607, v606);
     v689 = false;
     v690 = null;
     v691 = 0;
     v692 = false;
     v693 = 0;
     v694 = 0;
     v695 = 1;
     v696 = 0;
     v697 = 5126;
     v698 = 0;
     v699 = 0;
     v700 = 0;
     v701 = 0;
     if (v9(v688)) {
      v689 = true;
      v690 = v1.createStream(34962, v688);
      v697 = v690.dtype;
     }
     else {
      v690 = v1.getBuffer(v688);
      if (v690) {
       v697 = v690.dtype;
      }
      else if ('constant' in v688) {
       v695 = 2;
       if (typeof v688.constant === 'number') {
        v699 = v688.constant;
        v700 = v701 = v698 = 0;
       }
       else {
        v699 = v688.constant.length > 0 ? v688.constant[0] : 0;
        v700 = v688.constant.length > 1 ? v688.constant[1] : 0;
        v701 = v688.constant.length > 2 ? v688.constant[2] : 0;
        v698 = v688.constant.length > 3 ? v688.constant[3] : 0;
       }
      }
      else {
       if (v9(v688.buffer)) {
        v690 = v1.createStream(34962, v688.buffer);
       }
       else {
        v690 = v1.getBuffer(v688.buffer);
       }
       v697 = 'type' in v688 ? v43[v688.type] : v690.dtype;
       v692 = !!v688.normalized;
       v694 = v688.size | 0;
       v693 = v688.offset | 0;
       v696 = v688.stride | 0;
       v691 = v688.divisor | 0;
      }
     }
     v702 = size.location;
     v703 = v0[v702];
     if (v695 === 1) {
      if (!v703.buffer) {
       v8.enableVertexAttribArray(v702);
      }
      v704 = v694 || 1;
      if (v703.type !== v697 || v703.size !== v704 || v703.buffer !== v690 || v703.normalized !== v692 || v703.offset !== v693 || v703.stride !== v696) {
       v8.bindBuffer(34962, v690.buffer);
       v8.vertexAttribPointer(v702, v704, v697, v692, v696, v693);
       v703.type = v697;
       v703.size = v704;
       v703.buffer = v690;
       v703.normalized = v692;
       v703.offset = v693;
       v703.stride = v696;
      }
      if (v703.divisor !== v691) {
       v605.vertexAttribDivisorANGLE(v702, v691);
       v703.divisor = v691;
      }
     }
     else {
      if (v703.buffer) {
       v8.disableVertexAttribArray(v702);
       v703.buffer = null;
      }
      if (v703.x !== v699 || v703.y !== v700 || v703.z !== v701 || v703.w !== v698) {
       v8.vertexAttrib4f(v702, v699, v700, v701, v698);
       v703.x = v699;
       v703.y = v700;
       v703.z = v701;
       v703.w = v698;
      }
     }
     v705 = $40.call(this, v2, v607, v606);
     v706 = false;
     v707 = null;
     v708 = 0;
     v709 = false;
     v710 = 0;
     v711 = 0;
     v712 = 1;
     v713 = 0;
     v714 = 5126;
     v715 = 0;
     v716 = 0;
     v717 = 0;
     v718 = 0;
     if (v9(v705)) {
      v706 = true;
      v707 = v1.createStream(34962, v705);
      v714 = v707.dtype;
     }
     else {
      v707 = v1.getBuffer(v705);
      if (v707) {
       v714 = v707.dtype;
      }
      else if ('constant' in v705) {
       v712 = 2;
       if (typeof v705.constant === 'number') {
        v716 = v705.constant;
        v717 = v718 = v715 = 0;
       }
       else {
        v716 = v705.constant.length > 0 ? v705.constant[0] : 0;
        v717 = v705.constant.length > 1 ? v705.constant[1] : 0;
        v718 = v705.constant.length > 2 ? v705.constant[2] : 0;
        v715 = v705.constant.length > 3 ? v705.constant[3] : 0;
       }
      }
      else {
       if (v9(v705.buffer)) {
        v707 = v1.createStream(34962, v705.buffer);
       }
       else {
        v707 = v1.getBuffer(v705.buffer);
       }
       v714 = 'type' in v705 ? v43[v705.type] : v707.dtype;
       v709 = !!v705.normalized;
       v711 = v705.size | 0;
       v710 = v705.offset | 0;
       v713 = v705.stride | 0;
       v708 = v705.divisor | 0;
      }
     }
     v719 = borderSize.location;
     v720 = v0[v719];
     if (v712 === 1) {
      if (!v720.buffer) {
       v8.enableVertexAttribArray(v719);
      }
      v721 = v711 || 1;
      if (v720.type !== v714 || v720.size !== v721 || v720.buffer !== v707 || v720.normalized !== v709 || v720.offset !== v710 || v720.stride !== v713) {
       v8.bindBuffer(34962, v707.buffer);
       v8.vertexAttribPointer(v719, v721, v714, v709, v713, v710);
       v720.type = v714;
       v720.size = v721;
       v720.buffer = v707;
       v720.normalized = v709;
       v720.offset = v710;
       v720.stride = v713;
      }
      if (v720.divisor !== v708) {
       v605.vertexAttribDivisorANGLE(v719, v708);
       v720.divisor = v708;
      }
     }
     else {
      if (v720.buffer) {
       v8.disableVertexAttribArray(v719);
       v720.buffer = null;
      }
      if (v720.x !== v716 || v720.y !== v717 || v720.z !== v718 || v720.w !== v715) {
       v8.vertexAttrib4f(v719, v716, v717, v718, v715);
       v720.x = v716;
       v720.y = v717;
       v720.z = v718;
       v720.w = v715;
      }
     }
     v722 = $41.call(this, v2, v607, v606);
     v723 = false;
     v724 = null;
     v725 = 0;
     v726 = false;
     v727 = 0;
     v728 = 0;
     v729 = 1;
     v730 = 0;
     v731 = 5126;
     v732 = 0;
     v733 = 0;
     v734 = 0;
     v735 = 0;
     if (v9(v722)) {
      v723 = true;
      v724 = v1.createStream(34962, v722);
      v731 = v724.dtype;
     }
     else {
      v724 = v1.getBuffer(v722);
      if (v724) {
       v731 = v724.dtype;
      }
      else if ('constant' in v722) {
       v729 = 2;
       if (typeof v722.constant === 'number') {
        v733 = v722.constant;
        v734 = v735 = v732 = 0;
       }
       else {
        v733 = v722.constant.length > 0 ? v722.constant[0] : 0;
        v734 = v722.constant.length > 1 ? v722.constant[1] : 0;
        v735 = v722.constant.length > 2 ? v722.constant[2] : 0;
        v732 = v722.constant.length > 3 ? v722.constant[3] : 0;
       }
      }
      else {
       if (v9(v722.buffer)) {
        v724 = v1.createStream(34962, v722.buffer);
       }
       else {
        v724 = v1.getBuffer(v722.buffer);
       }
       v731 = 'type' in v722 ? v43[v722.type] : v724.dtype;
       v726 = !!v722.normalized;
       v728 = v722.size | 0;
       v727 = v722.offset | 0;
       v730 = v722.stride | 0;
       v725 = v722.divisor | 0;
      }
     }
     v736 = colorId.location;
     v737 = v0[v736];
     if (v729 === 1) {
      if (!v737.buffer) {
       v8.enableVertexAttribArray(v736);
      }
      v738 = v728 || 4;
      if (v737.type !== v731 || v737.size !== v738 || v737.buffer !== v724 || v737.normalized !== v726 || v737.offset !== v727 || v737.stride !== v730) {
       v8.bindBuffer(34962, v724.buffer);
       v8.vertexAttribPointer(v736, v738, v731, v726, v730, v727);
       v737.type = v731;
       v737.size = v738;
       v737.buffer = v724;
       v737.normalized = v726;
       v737.offset = v727;
       v737.stride = v730;
      }
      if (v737.divisor !== v725) {
       v605.vertexAttribDivisorANGLE(v736, v725);
       v737.divisor = v725;
      }
     }
     else {
      if (v737.buffer) {
       v8.disableVertexAttribArray(v736);
       v737.buffer = null;
      }
      if (v737.x !== v733 || v737.y !== v734 || v737.z !== v735 || v737.w !== v732) {
       v8.vertexAttrib4f(v736, v733, v734, v735, v732);
       v737.x = v733;
       v737.y = v734;
       v737.z = v735;
       v737.w = v732;
      }
     }
     v739 = $42.call(this, v2, v607, v606);
     v740 = false;
     v741 = null;
     v742 = 0;
     v743 = false;
     v744 = 0;
     v745 = 0;
     v746 = 1;
     v747 = 0;
     v748 = 5126;
     v749 = 0;
     v750 = 0;
     v751 = 0;
     v752 = 0;
     if (v9(v739)) {
      v740 = true;
      v741 = v1.createStream(34962, v739);
      v748 = v741.dtype;
     }
     else {
      v741 = v1.getBuffer(v739);
      if (v741) {
       v748 = v741.dtype;
      }
      else if ('constant' in v739) {
       v746 = 2;
       if (typeof v739.constant === 'number') {
        v750 = v739.constant;
        v751 = v752 = v749 = 0;
       }
       else {
        v750 = v739.constant.length > 0 ? v739.constant[0] : 0;
        v751 = v739.constant.length > 1 ? v739.constant[1] : 0;
        v752 = v739.constant.length > 2 ? v739.constant[2] : 0;
        v749 = v739.constant.length > 3 ? v739.constant[3] : 0;
       }
      }
      else {
       if (v9(v739.buffer)) {
        v741 = v1.createStream(34962, v739.buffer);
       }
       else {
        v741 = v1.getBuffer(v739.buffer);
       }
       v748 = 'type' in v739 ? v43[v739.type] : v741.dtype;
       v743 = !!v739.normalized;
       v745 = v739.size | 0;
       v744 = v739.offset | 0;
       v747 = v739.stride | 0;
       v742 = v739.divisor | 0;
      }
     }
     v753 = borderColorId.location;
     v754 = v0[v753];
     if (v746 === 1) {
      if (!v754.buffer) {
       v8.enableVertexAttribArray(v753);
      }
      v755 = v745 || 4;
      if (v754.type !== v748 || v754.size !== v755 || v754.buffer !== v741 || v754.normalized !== v743 || v754.offset !== v744 || v754.stride !== v747) {
       v8.bindBuffer(34962, v741.buffer);
       v8.vertexAttribPointer(v753, v755, v748, v743, v747, v744);
       v754.type = v748;
       v754.size = v755;
       v754.buffer = v741;
       v754.normalized = v743;
       v754.offset = v744;
       v754.stride = v747;
      }
      if (v754.divisor !== v742) {
       v605.vertexAttribDivisorANGLE(v753, v742);
       v754.divisor = v742;
      }
     }
     else {
      if (v754.buffer) {
       v8.disableVertexAttribArray(v753);
       v754.buffer = null;
      }
      if (v754.x !== v750 || v754.y !== v751 || v754.z !== v752 || v754.w !== v749) {
       v8.vertexAttrib4f(v753, v750, v751, v752, v749);
       v754.x = v750;
       v754.y = v751;
       v754.z = v752;
       v754.w = v749;
      }
     }
     v756 = $43.call(this, v2, v607, v606);
     v757 = false;
     v758 = null;
     v759 = 0;
     v760 = false;
     v761 = 0;
     v762 = 0;
     v763 = 1;
     v764 = 0;
     v765 = 5126;
     v766 = 0;
     v767 = 0;
     v768 = 0;
     v769 = 0;
     if (v9(v756)) {
      v757 = true;
      v758 = v1.createStream(34962, v756);
      v765 = v758.dtype;
     }
     else {
      v758 = v1.getBuffer(v756);
      if (v758) {
       v765 = v758.dtype;
      }
      else if ('constant' in v756) {
       v763 = 2;
       if (typeof v756.constant === 'number') {
        v767 = v756.constant;
        v768 = v769 = v766 = 0;
       }
       else {
        v767 = v756.constant.length > 0 ? v756.constant[0] : 0;
        v768 = v756.constant.length > 1 ? v756.constant[1] : 0;
        v769 = v756.constant.length > 2 ? v756.constant[2] : 0;
        v766 = v756.constant.length > 3 ? v756.constant[3] : 0;
       }
      }
      else {
       if (v9(v756.buffer)) {
        v758 = v1.createStream(34962, v756.buffer);
       }
       else {
        v758 = v1.getBuffer(v756.buffer);
       }
       v765 = 'type' in v756 ? v43[v756.type] : v758.dtype;
       v760 = !!v756.normalized;
       v762 = v756.size | 0;
       v761 = v756.offset | 0;
       v764 = v756.stride | 0;
       v759 = v756.divisor | 0;
      }
     }
     v770 = isActive.location;
     v771 = v0[v770];
     if (v763 === 1) {
      if (!v771.buffer) {
       v8.enableVertexAttribArray(v770);
      }
      v772 = v762 || 1;
      if (v771.type !== v765 || v771.size !== v772 || v771.buffer !== v758 || v771.normalized !== v760 || v771.offset !== v761 || v771.stride !== v764) {
       v8.bindBuffer(34962, v758.buffer);
       v8.vertexAttribPointer(v770, v772, v765, v760, v764, v761);
       v771.type = v765;
       v771.size = v772;
       v771.buffer = v758;
       v771.normalized = v760;
       v771.offset = v761;
       v771.stride = v764;
      }
      if (v771.divisor !== v759) {
       v605.vertexAttribDivisorANGLE(v770, v759);
       v771.divisor = v759;
      }
     }
     else {
      if (v771.buffer) {
       v8.disableVertexAttribArray(v770);
       v771.buffer = null;
      }
      if (v771.x !== v767 || v771.y !== v768 || v771.z !== v769 || v771.w !== v766) {
       v8.vertexAttrib4f(v770, v767, v768, v769, v766);
       v771.x = v767;
       v771.y = v768;
       v771.z = v769;
       v771.w = v766;
      }
     }
     v773 = v2['pixelRatio'];
     if (!v606 || v774 !== v773) {
      v774 = v773;
      v8.uniform1f(pixelRatio.location, v773);
     }
     v775 = v607['scale'];
     v776 = v775[0];
     v778 = v775[1];
     if (!v606 || v777 !== v776 || v779 !== v778) {
      v777 = v776;
      v779 = v778;
      v8.uniform2f(scale.location, v776, v778);
     }
     v780 = v607['scaleFract'];
     v781 = v780[0];
     v783 = v780[1];
     if (!v606 || v782 !== v781 || v784 !== v783) {
      v782 = v781;
      v784 = v783;
      v8.uniform2f(scaleFract.location, v781, v783);
     }
     v785 = v607['translate'];
     v786 = v785[0];
     v788 = v785[1];
     if (!v606 || v787 !== v786 || v789 !== v788) {
      v787 = v786;
      v789 = v788;
      v8.uniform2f(translate.location, v786, v788);
     }
     v790 = v607['translateFract'];
     v791 = v790[0];
     v793 = v790[1];
     if (!v606 || v792 !== v791 || v794 !== v793) {
      v792 = v791;
      v794 = v793;
      v8.uniform2f(translateFract.location, v791, v793);
     }
     v795 = $45.call(this, v2, v607, v606);
     v796 = v795[0];
     v798 = v795[1];
     if (!v606 || v797 !== v796 || v799 !== v798) {
      v797 = v796;
      v799 = v798;
      v8.uniform2f(paletteSize.location, v796, v798);
     }
     v800 = v607['opacity'];
     if (!v606 || v801 !== v800) {
      v801 = v800;
      v8.uniform1f(opacity.location, v800);
     }
     v802 = v607['markerTexture'];
     if (v802 && v802._reglType === 'framebuffer') {
      v802 = v802.color[0];
     }
     v803 = v802._texture;
     v8.uniform1i(markerTexture.location, v803.bind());
     v804 = v607['elements'];
     v805 = null;
     v806 = v9(v804);
     if (v806) {
      v805 = v5.createStream(v804);
     }
     else {
      v805 = v5.getElements(v804);
     }
     if (v805) v8.bindBuffer(34963, v805.buffer.buffer);
     v807 = v607['offset'];
     v808 = v607['count'];
     if (v808) {
      if (v809 > 0) {
       if (v805) {
        v605.drawElementsInstancedANGLE(0, v808, v805.type, v807 << ((v805.type - 5121) >> 1), v809);
       }
       else {
        v605.drawArraysInstancedANGLE(0, v807, v808, v809);
       }
      }
      else if (v809 < 0) {
       if (v805) {
        v8.drawElements(0, v808, v805.type, v807 << ((v805.type - 5121) >> 1));
       }
       else {
        v8.drawArrays(0, v807, v808);
       }
      }
      v2.viewportWidth = v613;
      v2.viewportHeight = v614;
      if (v621) {
       v1.destroyStream(v622);
      }
      if (v638) {
       v1.destroyStream(v639);
      }
      if (v655) {
       v1.destroyStream(v656);
      }
      if (v672) {
       v1.destroyStream(v673);
      }
      if (v689) {
       v1.destroyStream(v690);
      }
      if (v706) {
       v1.destroyStream(v707);
      }
      if (v723) {
       v1.destroyStream(v724);
      }
      if (v740) {
       v1.destroyStream(v741);
      }
      if (v757) {
       v1.destroyStream(v758);
      }
      v803.unbind();
      if (v806) {
       v5.destroyStream(v805);
      }
     }
    }
    $44.unbind();
    v3.dirty = true;
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v47, v48, v83, v84, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153, v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177, v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195, v196, v197, v198, v199, v200, v201, v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213, v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225, v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267, v268, v269, v270, v271, v272, v273;
    v47 = v6.angle_instanced_arrays;
    v48 = v7.next;
    if (v48 !== v7.cur) {
     if (v48) {
      v8.bindFramebuffer(36160, v48.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v48;
    }
    if (v3.dirty) {
     var v49, v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82;
     v49 = v10.dither;
     if (v49 !== v3.dither) {
      if (v49) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v49;
     }
     v50 = v18[0];
     v51 = v18[1];
     if (v50 !== v19[0] || v51 !== v19[1]) {
      v8.blendEquationSeparate(v50, v51);
      v19[0] = v50;
      v19[1] = v51;
     }
     v52 = v10.depth_func;
     if (v52 !== v3.depth_func) {
      v8.depthFunc(v52);
      v3.depth_func = v52;
     }
     v53 = v24[0];
     v54 = v24[1];
     if (v53 !== v25[0] || v54 !== v25[1]) {
      v8.depthRange(v53, v54);
      v25[0] = v53;
      v25[1] = v54;
     }
     v55 = v10.depth_mask;
     if (v55 !== v3.depth_mask) {
      v8.depthMask(v55);
      v3.depth_mask = v55;
     }
     v56 = v22[0];
     v57 = v22[1];
     v58 = v22[2];
     v59 = v22[3];
     if (v56 !== v23[0] || v57 !== v23[1] || v58 !== v23[2] || v59 !== v23[3]) {
      v8.colorMask(v56, v57, v58, v59);
      v23[0] = v56;
      v23[1] = v57;
      v23[2] = v58;
      v23[3] = v59;
     }
     v60 = v10.cull_enable;
     if (v60 !== v3.cull_enable) {
      if (v60) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v60;
     }
     v61 = v10.cull_face;
     if (v61 !== v3.cull_face) {
      v8.cullFace(v61);
      v3.cull_face = v61;
     }
     v62 = v10.frontFace;
     if (v62 !== v3.frontFace) {
      v8.frontFace(v62);
      v3.frontFace = v62;
     }
     v63 = v10.lineWidth;
     if (v63 !== v3.lineWidth) {
      v8.lineWidth(v63);
      v3.lineWidth = v63;
     }
     v64 = v10.polygonOffset_enable;
     if (v64 !== v3.polygonOffset_enable) {
      if (v64) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v64;
     }
     v65 = v26[0];
     v66 = v26[1];
     if (v65 !== v27[0] || v66 !== v27[1]) {
      v8.polygonOffset(v65, v66);
      v27[0] = v65;
      v27[1] = v66;
     }
     v67 = v10.sample_alpha;
     if (v67 !== v3.sample_alpha) {
      if (v67) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v67;
     }
     v68 = v10.sample_enable;
     if (v68 !== v3.sample_enable) {
      if (v68) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v68;
     }
     v69 = v28[0];
     v70 = v28[1];
     if (v69 !== v29[0] || v70 !== v29[1]) {
      v8.sampleCoverage(v69, v70);
      v29[0] = v69;
      v29[1] = v70;
     }
     v71 = v10.stencil_mask;
     if (v71 !== v3.stencil_mask) {
      v8.stencilMask(v71);
      v3.stencil_mask = v71;
     }
     v72 = v32[0];
     v73 = v32[1];
     v74 = v32[2];
     if (v72 !== v33[0] || v73 !== v33[1] || v74 !== v33[2]) {
      v8.stencilFunc(v72, v73, v74);
      v33[0] = v72;
      v33[1] = v73;
      v33[2] = v74;
     }
     v75 = v36[0];
     v76 = v36[1];
     v77 = v36[2];
     v78 = v36[3];
     if (v75 !== v37[0] || v76 !== v37[1] || v77 !== v37[2] || v78 !== v37[3]) {
      v8.stencilOpSeparate(v75, v76, v77, v78);
      v37[0] = v75;
      v37[1] = v76;
      v37[2] = v77;
      v37[3] = v78;
     }
     v79 = v34[0];
     v80 = v34[1];
     v81 = v34[2];
     v82 = v34[3];
     if (v79 !== v35[0] || v80 !== v35[1] || v81 !== v35[2] || v82 !== v35[3]) {
      v8.stencilOpSeparate(v79, v80, v81, v82);
      v35[0] = v79;
      v35[1] = v80;
      v35[2] = v81;
      v35[3] = v82;
     }
    }
    v83 = a0['viewport'];
    v84 = v83.x | 0;
    v85 = v83.y | 0;
    v86 = 'width' in v83 ? v83.width | 0 : (v2.framebufferWidth - v84);
    v87 = 'height' in v83 ? v83.height | 0 : (v2.framebufferHeight - v85);
    v88 = v2.viewportWidth;
    v2.viewportWidth = v86;
    v89 = v2.viewportHeight;
    v2.viewportHeight = v87;
    v8.viewport(v84, v85, v86, v87);
    v39[0] = v84;
    v39[1] = v85;
    v39[2] = v86;
    v39[3] = v87;
    v8.blendColor(0, 0, 0, 1);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 1;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v90 = a0['viewport'];
    v91 = v90.x | 0;
    v92 = v90.y | 0;
    v93 = 'width' in v90 ? v90.width | 0 : (v2.framebufferWidth - v91);
    v94 = 'height' in v90 ? v90.height | 0 : (v2.framebufferHeight - v92);
    v8.scissor(v91, v92, v93, v94);
    v31[0] = v91;
    v31[1] = v92;
    v31[2] = v93;
    v31[3] = v94;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($2.program);
    v95 = v6.angle_instanced_arrays;
    v15.setVAO(null);
    v96 = $3.call(this, v2, a0, 0);
    v97 = false;
    v98 = null;
    v99 = 0;
    v100 = false;
    v101 = 0;
    v102 = 0;
    v103 = 1;
    v104 = 0;
    v105 = 5126;
    v106 = 0;
    v107 = 0;
    v108 = 0;
    v109 = 0;
    if (v9(v96)) {
     v97 = true;
     v98 = v1.createStream(34962, v96);
     v105 = v98.dtype;
    }
    else {
     v98 = v1.getBuffer(v96);
     if (v98) {
      v105 = v98.dtype;
     }
     else if ('constant' in v96) {
      v103 = 2;
      if (typeof v96.constant === 'number') {
       v107 = v96.constant;
       v108 = v109 = v106 = 0;
      }
      else {
       v107 = v96.constant.length > 0 ? v96.constant[0] : 0;
       v108 = v96.constant.length > 1 ? v96.constant[1] : 0;
       v109 = v96.constant.length > 2 ? v96.constant[2] : 0;
       v106 = v96.constant.length > 3 ? v96.constant[3] : 0;
      }
     }
     else {
      if (v9(v96.buffer)) {
       v98 = v1.createStream(34962, v96.buffer);
      }
      else {
       v98 = v1.getBuffer(v96.buffer);
      }
      v105 = 'type' in v96 ? v43[v96.type] : v98.dtype;
      v100 = !!v96.normalized;
      v102 = v96.size | 0;
      v101 = v96.offset | 0;
      v104 = v96.stride | 0;
      v99 = v96.divisor | 0;
     }
    }
    v110 = x.location;
    v111 = v0[v110];
    if (v103 === 1) {
     if (!v111.buffer) {
      v8.enableVertexAttribArray(v110);
     }
     v112 = v102 || 1;
     if (v111.type !== v105 || v111.size !== v112 || v111.buffer !== v98 || v111.normalized !== v100 || v111.offset !== v101 || v111.stride !== v104) {
      v8.bindBuffer(34962, v98.buffer);
      v8.vertexAttribPointer(v110, v112, v105, v100, v104, v101);
      v111.type = v105;
      v111.size = v112;
      v111.buffer = v98;
      v111.normalized = v100;
      v111.offset = v101;
      v111.stride = v104;
     }
     if (v111.divisor !== v99) {
      v95.vertexAttribDivisorANGLE(v110, v99);
      v111.divisor = v99;
     }
    }
    else {
     if (v111.buffer) {
      v8.disableVertexAttribArray(v110);
      v111.buffer = null;
     }
     if (v111.x !== v107 || v111.y !== v108 || v111.z !== v109 || v111.w !== v106) {
      v8.vertexAttrib4f(v110, v107, v108, v109, v106);
      v111.x = v107;
      v111.y = v108;
      v111.z = v109;
      v111.w = v106;
     }
    }
    v113 = $4.call(this, v2, a0, 0);
    v114 = false;
    v115 = null;
    v116 = 0;
    v117 = false;
    v118 = 0;
    v119 = 0;
    v120 = 1;
    v121 = 0;
    v122 = 5126;
    v123 = 0;
    v124 = 0;
    v125 = 0;
    v126 = 0;
    if (v9(v113)) {
     v114 = true;
     v115 = v1.createStream(34962, v113);
     v122 = v115.dtype;
    }
    else {
     v115 = v1.getBuffer(v113);
     if (v115) {
      v122 = v115.dtype;
     }
     else if ('constant' in v113) {
      v120 = 2;
      if (typeof v113.constant === 'number') {
       v124 = v113.constant;
       v125 = v126 = v123 = 0;
      }
      else {
       v124 = v113.constant.length > 0 ? v113.constant[0] : 0;
       v125 = v113.constant.length > 1 ? v113.constant[1] : 0;
       v126 = v113.constant.length > 2 ? v113.constant[2] : 0;
       v123 = v113.constant.length > 3 ? v113.constant[3] : 0;
      }
     }
     else {
      if (v9(v113.buffer)) {
       v115 = v1.createStream(34962, v113.buffer);
      }
      else {
       v115 = v1.getBuffer(v113.buffer);
      }
      v122 = 'type' in v113 ? v43[v113.type] : v115.dtype;
      v117 = !!v113.normalized;
      v119 = v113.size | 0;
      v118 = v113.offset | 0;
      v121 = v113.stride | 0;
      v116 = v113.divisor | 0;
     }
    }
    v127 = y.location;
    v128 = v0[v127];
    if (v120 === 1) {
     if (!v128.buffer) {
      v8.enableVertexAttribArray(v127);
     }
     v129 = v119 || 1;
     if (v128.type !== v122 || v128.size !== v129 || v128.buffer !== v115 || v128.normalized !== v117 || v128.offset !== v118 || v128.stride !== v121) {
      v8.bindBuffer(34962, v115.buffer);
      v8.vertexAttribPointer(v127, v129, v122, v117, v121, v118);
      v128.type = v122;
      v128.size = v129;
      v128.buffer = v115;
      v128.normalized = v117;
      v128.offset = v118;
      v128.stride = v121;
     }
     if (v128.divisor !== v116) {
      v95.vertexAttribDivisorANGLE(v127, v116);
      v128.divisor = v116;
     }
    }
    else {
     if (v128.buffer) {
      v8.disableVertexAttribArray(v127);
      v128.buffer = null;
     }
     if (v128.x !== v124 || v128.y !== v125 || v128.z !== v126 || v128.w !== v123) {
      v8.vertexAttrib4f(v127, v124, v125, v126, v123);
      v128.x = v124;
      v128.y = v125;
      v128.z = v126;
      v128.w = v123;
     }
    }
    v130 = $5.call(this, v2, a0, 0);
    v131 = false;
    v132 = null;
    v133 = 0;
    v134 = false;
    v135 = 0;
    v136 = 0;
    v137 = 1;
    v138 = 0;
    v139 = 5126;
    v140 = 0;
    v141 = 0;
    v142 = 0;
    v143 = 0;
    if (v9(v130)) {
     v131 = true;
     v132 = v1.createStream(34962, v130);
     v139 = v132.dtype;
    }
    else {
     v132 = v1.getBuffer(v130);
     if (v132) {
      v139 = v132.dtype;
     }
     else if ('constant' in v130) {
      v137 = 2;
      if (typeof v130.constant === 'number') {
       v141 = v130.constant;
       v142 = v143 = v140 = 0;
      }
      else {
       v141 = v130.constant.length > 0 ? v130.constant[0] : 0;
       v142 = v130.constant.length > 1 ? v130.constant[1] : 0;
       v143 = v130.constant.length > 2 ? v130.constant[2] : 0;
       v140 = v130.constant.length > 3 ? v130.constant[3] : 0;
      }
     }
     else {
      if (v9(v130.buffer)) {
       v132 = v1.createStream(34962, v130.buffer);
      }
      else {
       v132 = v1.getBuffer(v130.buffer);
      }
      v139 = 'type' in v130 ? v43[v130.type] : v132.dtype;
      v134 = !!v130.normalized;
      v136 = v130.size | 0;
      v135 = v130.offset | 0;
      v138 = v130.stride | 0;
      v133 = v130.divisor | 0;
     }
    }
    v144 = xFract.location;
    v145 = v0[v144];
    if (v137 === 1) {
     if (!v145.buffer) {
      v8.enableVertexAttribArray(v144);
     }
     v146 = v136 || 1;
     if (v145.type !== v139 || v145.size !== v146 || v145.buffer !== v132 || v145.normalized !== v134 || v145.offset !== v135 || v145.stride !== v138) {
      v8.bindBuffer(34962, v132.buffer);
      v8.vertexAttribPointer(v144, v146, v139, v134, v138, v135);
      v145.type = v139;
      v145.size = v146;
      v145.buffer = v132;
      v145.normalized = v134;
      v145.offset = v135;
      v145.stride = v138;
     }
     if (v145.divisor !== v133) {
      v95.vertexAttribDivisorANGLE(v144, v133);
      v145.divisor = v133;
     }
    }
    else {
     if (v145.buffer) {
      v8.disableVertexAttribArray(v144);
      v145.buffer = null;
     }
     if (v145.x !== v141 || v145.y !== v142 || v145.z !== v143 || v145.w !== v140) {
      v8.vertexAttrib4f(v144, v141, v142, v143, v140);
      v145.x = v141;
      v145.y = v142;
      v145.z = v143;
      v145.w = v140;
     }
    }
    v147 = $6.call(this, v2, a0, 0);
    v148 = false;
    v149 = null;
    v150 = 0;
    v151 = false;
    v152 = 0;
    v153 = 0;
    v154 = 1;
    v155 = 0;
    v156 = 5126;
    v157 = 0;
    v158 = 0;
    v159 = 0;
    v160 = 0;
    if (v9(v147)) {
     v148 = true;
     v149 = v1.createStream(34962, v147);
     v156 = v149.dtype;
    }
    else {
     v149 = v1.getBuffer(v147);
     if (v149) {
      v156 = v149.dtype;
     }
     else if ('constant' in v147) {
      v154 = 2;
      if (typeof v147.constant === 'number') {
       v158 = v147.constant;
       v159 = v160 = v157 = 0;
      }
      else {
       v158 = v147.constant.length > 0 ? v147.constant[0] : 0;
       v159 = v147.constant.length > 1 ? v147.constant[1] : 0;
       v160 = v147.constant.length > 2 ? v147.constant[2] : 0;
       v157 = v147.constant.length > 3 ? v147.constant[3] : 0;
      }
     }
     else {
      if (v9(v147.buffer)) {
       v149 = v1.createStream(34962, v147.buffer);
      }
      else {
       v149 = v1.getBuffer(v147.buffer);
      }
      v156 = 'type' in v147 ? v43[v147.type] : v149.dtype;
      v151 = !!v147.normalized;
      v153 = v147.size | 0;
      v152 = v147.offset | 0;
      v155 = v147.stride | 0;
      v150 = v147.divisor | 0;
     }
    }
    v161 = yFract.location;
    v162 = v0[v161];
    if (v154 === 1) {
     if (!v162.buffer) {
      v8.enableVertexAttribArray(v161);
     }
     v163 = v153 || 1;
     if (v162.type !== v156 || v162.size !== v163 || v162.buffer !== v149 || v162.normalized !== v151 || v162.offset !== v152 || v162.stride !== v155) {
      v8.bindBuffer(34962, v149.buffer);
      v8.vertexAttribPointer(v161, v163, v156, v151, v155, v152);
      v162.type = v156;
      v162.size = v163;
      v162.buffer = v149;
      v162.normalized = v151;
      v162.offset = v152;
      v162.stride = v155;
     }
     if (v162.divisor !== v150) {
      v95.vertexAttribDivisorANGLE(v161, v150);
      v162.divisor = v150;
     }
    }
    else {
     if (v162.buffer) {
      v8.disableVertexAttribArray(v161);
      v162.buffer = null;
     }
     if (v162.x !== v158 || v162.y !== v159 || v162.z !== v160 || v162.w !== v157) {
      v8.vertexAttrib4f(v161, v158, v159, v160, v157);
      v162.x = v158;
      v162.y = v159;
      v162.z = v160;
      v162.w = v157;
     }
    }
    v164 = $7.call(this, v2, a0, 0);
    v165 = false;
    v166 = null;
    v167 = 0;
    v168 = false;
    v169 = 0;
    v170 = 0;
    v171 = 1;
    v172 = 0;
    v173 = 5126;
    v174 = 0;
    v175 = 0;
    v176 = 0;
    v177 = 0;
    if (v9(v164)) {
     v165 = true;
     v166 = v1.createStream(34962, v164);
     v173 = v166.dtype;
    }
    else {
     v166 = v1.getBuffer(v164);
     if (v166) {
      v173 = v166.dtype;
     }
     else if ('constant' in v164) {
      v171 = 2;
      if (typeof v164.constant === 'number') {
       v175 = v164.constant;
       v176 = v177 = v174 = 0;
      }
      else {
       v175 = v164.constant.length > 0 ? v164.constant[0] : 0;
       v176 = v164.constant.length > 1 ? v164.constant[1] : 0;
       v177 = v164.constant.length > 2 ? v164.constant[2] : 0;
       v174 = v164.constant.length > 3 ? v164.constant[3] : 0;
      }
     }
     else {
      if (v9(v164.buffer)) {
       v166 = v1.createStream(34962, v164.buffer);
      }
      else {
       v166 = v1.getBuffer(v164.buffer);
      }
      v173 = 'type' in v164 ? v43[v164.type] : v166.dtype;
      v168 = !!v164.normalized;
      v170 = v164.size | 0;
      v169 = v164.offset | 0;
      v172 = v164.stride | 0;
      v167 = v164.divisor | 0;
     }
    }
    v178 = size.location;
    v179 = v0[v178];
    if (v171 === 1) {
     if (!v179.buffer) {
      v8.enableVertexAttribArray(v178);
     }
     v180 = v170 || 1;
     if (v179.type !== v173 || v179.size !== v180 || v179.buffer !== v166 || v179.normalized !== v168 || v179.offset !== v169 || v179.stride !== v172) {
      v8.bindBuffer(34962, v166.buffer);
      v8.vertexAttribPointer(v178, v180, v173, v168, v172, v169);
      v179.type = v173;
      v179.size = v180;
      v179.buffer = v166;
      v179.normalized = v168;
      v179.offset = v169;
      v179.stride = v172;
     }
     if (v179.divisor !== v167) {
      v95.vertexAttribDivisorANGLE(v178, v167);
      v179.divisor = v167;
     }
    }
    else {
     if (v179.buffer) {
      v8.disableVertexAttribArray(v178);
      v179.buffer = null;
     }
     if (v179.x !== v175 || v179.y !== v176 || v179.z !== v177 || v179.w !== v174) {
      v8.vertexAttrib4f(v178, v175, v176, v177, v174);
      v179.x = v175;
      v179.y = v176;
      v179.z = v177;
      v179.w = v174;
     }
    }
    v181 = $8.call(this, v2, a0, 0);
    v182 = false;
    v183 = null;
    v184 = 0;
    v185 = false;
    v186 = 0;
    v187 = 0;
    v188 = 1;
    v189 = 0;
    v190 = 5126;
    v191 = 0;
    v192 = 0;
    v193 = 0;
    v194 = 0;
    if (v9(v181)) {
     v182 = true;
     v183 = v1.createStream(34962, v181);
     v190 = v183.dtype;
    }
    else {
     v183 = v1.getBuffer(v181);
     if (v183) {
      v190 = v183.dtype;
     }
     else if ('constant' in v181) {
      v188 = 2;
      if (typeof v181.constant === 'number') {
       v192 = v181.constant;
       v193 = v194 = v191 = 0;
      }
      else {
       v192 = v181.constant.length > 0 ? v181.constant[0] : 0;
       v193 = v181.constant.length > 1 ? v181.constant[1] : 0;
       v194 = v181.constant.length > 2 ? v181.constant[2] : 0;
       v191 = v181.constant.length > 3 ? v181.constant[3] : 0;
      }
     }
     else {
      if (v9(v181.buffer)) {
       v183 = v1.createStream(34962, v181.buffer);
      }
      else {
       v183 = v1.getBuffer(v181.buffer);
      }
      v190 = 'type' in v181 ? v43[v181.type] : v183.dtype;
      v185 = !!v181.normalized;
      v187 = v181.size | 0;
      v186 = v181.offset | 0;
      v189 = v181.stride | 0;
      v184 = v181.divisor | 0;
     }
    }
    v195 = borderSize.location;
    v196 = v0[v195];
    if (v188 === 1) {
     if (!v196.buffer) {
      v8.enableVertexAttribArray(v195);
     }
     v197 = v187 || 1;
     if (v196.type !== v190 || v196.size !== v197 || v196.buffer !== v183 || v196.normalized !== v185 || v196.offset !== v186 || v196.stride !== v189) {
      v8.bindBuffer(34962, v183.buffer);
      v8.vertexAttribPointer(v195, v197, v190, v185, v189, v186);
      v196.type = v190;
      v196.size = v197;
      v196.buffer = v183;
      v196.normalized = v185;
      v196.offset = v186;
      v196.stride = v189;
     }
     if (v196.divisor !== v184) {
      v95.vertexAttribDivisorANGLE(v195, v184);
      v196.divisor = v184;
     }
    }
    else {
     if (v196.buffer) {
      v8.disableVertexAttribArray(v195);
      v196.buffer = null;
     }
     if (v196.x !== v192 || v196.y !== v193 || v196.z !== v194 || v196.w !== v191) {
      v8.vertexAttrib4f(v195, v192, v193, v194, v191);
      v196.x = v192;
      v196.y = v193;
      v196.z = v194;
      v196.w = v191;
     }
    }
    v198 = $9.call(this, v2, a0, 0);
    v199 = false;
    v200 = null;
    v201 = 0;
    v202 = false;
    v203 = 0;
    v204 = 0;
    v205 = 1;
    v206 = 0;
    v207 = 5126;
    v208 = 0;
    v209 = 0;
    v210 = 0;
    v211 = 0;
    if (v9(v198)) {
     v199 = true;
     v200 = v1.createStream(34962, v198);
     v207 = v200.dtype;
    }
    else {
     v200 = v1.getBuffer(v198);
     if (v200) {
      v207 = v200.dtype;
     }
     else if ('constant' in v198) {
      v205 = 2;
      if (typeof v198.constant === 'number') {
       v209 = v198.constant;
       v210 = v211 = v208 = 0;
      }
      else {
       v209 = v198.constant.length > 0 ? v198.constant[0] : 0;
       v210 = v198.constant.length > 1 ? v198.constant[1] : 0;
       v211 = v198.constant.length > 2 ? v198.constant[2] : 0;
       v208 = v198.constant.length > 3 ? v198.constant[3] : 0;
      }
     }
     else {
      if (v9(v198.buffer)) {
       v200 = v1.createStream(34962, v198.buffer);
      }
      else {
       v200 = v1.getBuffer(v198.buffer);
      }
      v207 = 'type' in v198 ? v43[v198.type] : v200.dtype;
      v202 = !!v198.normalized;
      v204 = v198.size | 0;
      v203 = v198.offset | 0;
      v206 = v198.stride | 0;
      v201 = v198.divisor | 0;
     }
    }
    v212 = colorId.location;
    v213 = v0[v212];
    if (v205 === 1) {
     if (!v213.buffer) {
      v8.enableVertexAttribArray(v212);
     }
     v214 = v204 || 4;
     if (v213.type !== v207 || v213.size !== v214 || v213.buffer !== v200 || v213.normalized !== v202 || v213.offset !== v203 || v213.stride !== v206) {
      v8.bindBuffer(34962, v200.buffer);
      v8.vertexAttribPointer(v212, v214, v207, v202, v206, v203);
      v213.type = v207;
      v213.size = v214;
      v213.buffer = v200;
      v213.normalized = v202;
      v213.offset = v203;
      v213.stride = v206;
     }
     if (v213.divisor !== v201) {
      v95.vertexAttribDivisorANGLE(v212, v201);
      v213.divisor = v201;
     }
    }
    else {
     if (v213.buffer) {
      v8.disableVertexAttribArray(v212);
      v213.buffer = null;
     }
     if (v213.x !== v209 || v213.y !== v210 || v213.z !== v211 || v213.w !== v208) {
      v8.vertexAttrib4f(v212, v209, v210, v211, v208);
      v213.x = v209;
      v213.y = v210;
      v213.z = v211;
      v213.w = v208;
     }
    }
    v215 = $10.call(this, v2, a0, 0);
    v216 = false;
    v217 = null;
    v218 = 0;
    v219 = false;
    v220 = 0;
    v221 = 0;
    v222 = 1;
    v223 = 0;
    v224 = 5126;
    v225 = 0;
    v226 = 0;
    v227 = 0;
    v228 = 0;
    if (v9(v215)) {
     v216 = true;
     v217 = v1.createStream(34962, v215);
     v224 = v217.dtype;
    }
    else {
     v217 = v1.getBuffer(v215);
     if (v217) {
      v224 = v217.dtype;
     }
     else if ('constant' in v215) {
      v222 = 2;
      if (typeof v215.constant === 'number') {
       v226 = v215.constant;
       v227 = v228 = v225 = 0;
      }
      else {
       v226 = v215.constant.length > 0 ? v215.constant[0] : 0;
       v227 = v215.constant.length > 1 ? v215.constant[1] : 0;
       v228 = v215.constant.length > 2 ? v215.constant[2] : 0;
       v225 = v215.constant.length > 3 ? v215.constant[3] : 0;
      }
     }
     else {
      if (v9(v215.buffer)) {
       v217 = v1.createStream(34962, v215.buffer);
      }
      else {
       v217 = v1.getBuffer(v215.buffer);
      }
      v224 = 'type' in v215 ? v43[v215.type] : v217.dtype;
      v219 = !!v215.normalized;
      v221 = v215.size | 0;
      v220 = v215.offset | 0;
      v223 = v215.stride | 0;
      v218 = v215.divisor | 0;
     }
    }
    v229 = borderColorId.location;
    v230 = v0[v229];
    if (v222 === 1) {
     if (!v230.buffer) {
      v8.enableVertexAttribArray(v229);
     }
     v231 = v221 || 4;
     if (v230.type !== v224 || v230.size !== v231 || v230.buffer !== v217 || v230.normalized !== v219 || v230.offset !== v220 || v230.stride !== v223) {
      v8.bindBuffer(34962, v217.buffer);
      v8.vertexAttribPointer(v229, v231, v224, v219, v223, v220);
      v230.type = v224;
      v230.size = v231;
      v230.buffer = v217;
      v230.normalized = v219;
      v230.offset = v220;
      v230.stride = v223;
     }
     if (v230.divisor !== v218) {
      v95.vertexAttribDivisorANGLE(v229, v218);
      v230.divisor = v218;
     }
    }
    else {
     if (v230.buffer) {
      v8.disableVertexAttribArray(v229);
      v230.buffer = null;
     }
     if (v230.x !== v226 || v230.y !== v227 || v230.z !== v228 || v230.w !== v225) {
      v8.vertexAttrib4f(v229, v226, v227, v228, v225);
      v230.x = v226;
      v230.y = v227;
      v230.z = v228;
      v230.w = v225;
     }
    }
    v232 = $11.call(this, v2, a0, 0);
    v233 = false;
    v234 = null;
    v235 = 0;
    v236 = false;
    v237 = 0;
    v238 = 0;
    v239 = 1;
    v240 = 0;
    v241 = 5126;
    v242 = 0;
    v243 = 0;
    v244 = 0;
    v245 = 0;
    if (v9(v232)) {
     v233 = true;
     v234 = v1.createStream(34962, v232);
     v241 = v234.dtype;
    }
    else {
     v234 = v1.getBuffer(v232);
     if (v234) {
      v241 = v234.dtype;
     }
     else if ('constant' in v232) {
      v239 = 2;
      if (typeof v232.constant === 'number') {
       v243 = v232.constant;
       v244 = v245 = v242 = 0;
      }
      else {
       v243 = v232.constant.length > 0 ? v232.constant[0] : 0;
       v244 = v232.constant.length > 1 ? v232.constant[1] : 0;
       v245 = v232.constant.length > 2 ? v232.constant[2] : 0;
       v242 = v232.constant.length > 3 ? v232.constant[3] : 0;
      }
     }
     else {
      if (v9(v232.buffer)) {
       v234 = v1.createStream(34962, v232.buffer);
      }
      else {
       v234 = v1.getBuffer(v232.buffer);
      }
      v241 = 'type' in v232 ? v43[v232.type] : v234.dtype;
      v236 = !!v232.normalized;
      v238 = v232.size | 0;
      v237 = v232.offset | 0;
      v240 = v232.stride | 0;
      v235 = v232.divisor | 0;
     }
    }
    v246 = isActive.location;
    v247 = v0[v246];
    if (v239 === 1) {
     if (!v247.buffer) {
      v8.enableVertexAttribArray(v246);
     }
     v248 = v238 || 1;
     if (v247.type !== v241 || v247.size !== v248 || v247.buffer !== v234 || v247.normalized !== v236 || v247.offset !== v237 || v247.stride !== v240) {
      v8.bindBuffer(34962, v234.buffer);
      v8.vertexAttribPointer(v246, v248, v241, v236, v240, v237);
      v247.type = v241;
      v247.size = v248;
      v247.buffer = v234;
      v247.normalized = v236;
      v247.offset = v237;
      v247.stride = v240;
     }
     if (v247.divisor !== v235) {
      v95.vertexAttribDivisorANGLE(v246, v235);
      v247.divisor = v235;
     }
    }
    else {
     if (v247.buffer) {
      v8.disableVertexAttribArray(v246);
      v247.buffer = null;
     }
     if (v247.x !== v243 || v247.y !== v244 || v247.z !== v245 || v247.w !== v242) {
      v8.vertexAttrib4f(v246, v243, v244, v245, v242);
      v247.x = v243;
      v247.y = v244;
      v247.z = v245;
      v247.w = v242;
     }
    }
    v8.uniform1i(constPointSize.location, false);
    v249 = v2['pixelRatio'];
    v8.uniform1f(pixelRatio.location, v249);
    v250 = a0['scale'];
    v251 = v250[0];
    v252 = v250[1];
    v8.uniform2f(scale.location, v251, v252);
    v253 = a0['scaleFract'];
    v254 = v253[0];
    v255 = v253[1];
    v8.uniform2f(scaleFract.location, v254, v255);
    v256 = a0['translate'];
    v257 = v256[0];
    v258 = v256[1];
    v8.uniform2f(translate.location, v257, v258);
    v259 = a0['translateFract'];
    v260 = v259[0];
    v261 = v259[1];
    v8.uniform2f(translateFract.location, v260, v261);
    v262 = $12.call(this, v2, a0, 0);
    v263 = v262[0];
    v264 = v262[1];
    v8.uniform2f(paletteSize.location, v263, v264);
    v265 = a0['opacity'];
    v8.uniform1f(opacity.location, v265);
    v8.uniform1i(paletteTexture.location, $13.bind());
    v266 = a0['markerTexture'];
    if (v266 && v266._reglType === 'framebuffer') {
     v266 = v266.color[0];
    }
    v267 = v266._texture;
    v8.uniform1i(markerTexture.location, v267.bind());
    v268 = a0['elements'];
    v269 = null;
    v270 = v9(v268);
    if (v270) {
     v269 = v5.createStream(v268);
    }
    else {
     v269 = v5.getElements(v268);
    }
    if (v269) v8.bindBuffer(34963, v269.buffer.buffer);
    v271 = a0['offset'];
    v272 = a0['count'];
    if (v272) {
     v273 = v4.instances;
     if (v273 > 0) {
      if (v269) {
       v95.drawElementsInstancedANGLE(0, v272, v269.type, v271 << ((v269.type - 5121) >> 1), v273);
      }
      else {
       v95.drawArraysInstancedANGLE(0, v271, v272, v273);
      }
     }
     else if (v273 < 0) {
      if (v269) {
       v8.drawElements(0, v272, v269.type, v271 << ((v269.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(0, v271, v272);
      }
     }
     v3.dirty = true;
     v15.setVAO(null);
     v2.viewportWidth = v88;
     v2.viewportHeight = v89;
     if (v97) {
      v1.destroyStream(v98);
     }
     if (v114) {
      v1.destroyStream(v115);
     }
     if (v131) {
      v1.destroyStream(v132);
     }
     if (v148) {
      v1.destroyStream(v149);
     }
     if (v165) {
      v1.destroyStream(v166);
     }
     if (v182) {
      v1.destroyStream(v183);
     }
     if (v199) {
      v1.destroyStream(v200);
     }
     if (v216) {
      v1.destroyStream(v217);
     }
     if (v233) {
      v1.destroyStream(v234);
     }
     $13.unbind();
     v267.unbind();
     if (v270) {
      v5.destroyStream(v269);
     }
    }
   }
   , 'scope': function (a0, a1, a2) {
    var v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301, v302, v303, v304, v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360, v361, v362, v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387, v388, v389, v390, v391, v392, v393, v394, v395, v396, v397, v398, v399, v400, v401, v402, v403, v404, v405, v406, v407, v408, v409, v410, v411, v412, v413, v414, v415, v416, v417, v418, v419, v420, v421, v422, v423, v424, v425, v426, v427, v428, v429, v430, v431, v432, v433, v434, v435, v436, v437, v438, v439, v440, v441, v442, v443, v444, v445, v446, v447, v448, v449, v450, v451, v452, v453, v454, v455, v456, v457, v458, v459, v460, v461, v462, v463, v464, v465, v466, v467, v468, v469, v470, v471, v472, v473, v474, v475, v476, v477, v478, v479, v480, v481, v482, v483, v484, v485, v486, v487, v488, v489, v490, v491, v492, v493, v494, v495, v496, v497, v498, v499, v500, v501, v502, v503, v504, v505, v506, v507, v508, v509, v510, v511, v512, v513, v514, v515, v516, v517, v518, v519, v520, v521, v522, v523, v524, v525, v526, v527, v528, v529, v530, v531, v532, v533, v534, v535, v536, v537, v538, v539, v540, v541, v542, v543, v544, v545, v546, v547, v548, v549, v550, v551, v552, v553, v554, v555, v556, v557, v558, v559, v560, v561, v562, v563, v564, v565, v566, v567, v568;
    v274 = a0['viewport'];
    v275 = v274.x | 0;
    v276 = v274.y | 0;
    v277 = 'width' in v274 ? v274.width | 0 : (v2.framebufferWidth - v275);
    v278 = 'height' in v274 ? v274.height | 0 : (v2.framebufferHeight - v276);
    v279 = v2.viewportWidth;
    v2.viewportWidth = v277;
    v280 = v2.viewportHeight;
    v2.viewportHeight = v278;
    v281 = v38[0];
    v38[0] = v275;
    v282 = v38[1];
    v38[1] = v276;
    v283 = v38[2];
    v38[2] = v277;
    v284 = v38[3];
    v38[3] = v278;
    v285 = v16[0];
    v16[0] = 0;
    v286 = v16[1];
    v16[1] = 0;
    v287 = v16[2];
    v16[2] = 0;
    v288 = v16[3];
    v16[3] = 1;
    v289 = v10.blend_enable;
    v10.blend_enable = true;
    v290 = v20[0];
    v20[0] = 770;
    v291 = v20[1];
    v20[1] = 771;
    v292 = v20[2];
    v20[2] = 773;
    v293 = v20[3];
    v20[3] = 1;
    v294 = v10.depth_enable;
    v10.depth_enable = false;
    v295 = a0['viewport'];
    v296 = v295.x | 0;
    v297 = v295.y | 0;
    v298 = 'width' in v295 ? v295.width | 0 : (v2.framebufferWidth - v296);
    v299 = 'height' in v295 ? v295.height | 0 : (v2.framebufferHeight - v297);
    v300 = v30[0];
    v30[0] = v296;
    v301 = v30[1];
    v30[1] = v297;
    v302 = v30[2];
    v30[2] = v298;
    v303 = v30[3];
    v30[3] = v299;
    v304 = v10.scissor_enable;
    v10.scissor_enable = true;
    v305 = v10.stencil_enable;
    v10.stencil_enable = false;
    v306 = a0['elements'];
    v307 = null;
    v308 = v9(v306);
    if (v308) {
     v307 = v5.createStream(v306);
    }
    else {
     v307 = v5.getElements(v306);
    }
    v309 = v4.elements;
    v4.elements = v307;
    v310 = a0['offset'];
    v311 = v4.offset;
    v4.offset = v310;
    v312 = a0['count'];
    v313 = v4.count;
    v4.count = v312;
    v314 = v4.primitive;
    v4.primitive = 0;
    v315 = v14[45];
    v14[45] = false;
    v316 = a0['markerTexture'];
    v317 = v14[48];
    v14[48] = v316;
    v318 = a0['opacity'];
    v319 = v14[10];
    v14[10] = v318;
    v320 = $14.call(this, v2, a0, a2);
    v321 = v14[46];
    v14[46] = v320;
    v322 = v14[47];
    v14[47] = $15;
    v323 = v2['pixelRatio'];
    v324 = v14[34];
    v14[34] = v323;
    v325 = a0['scale'];
    v326 = v14[6];
    v14[6] = v325;
    v327 = a0['scaleFract'];
    v328 = v14[7];
    v14[7] = v327;
    v329 = a0['translate'];
    v330 = v14[8];
    v14[8] = v329;
    v331 = a0['translateFract'];
    v332 = v14[9];
    v14[9] = v331;
    v333 = $16.call(this, v2, a0, a2);
    v334 = false;
    v335 = null;
    v336 = 0;
    v337 = false;
    v338 = 0;
    v339 = 0;
    v340 = 1;
    v341 = 0;
    v342 = 5126;
    v343 = 0;
    v344 = 0;
    v345 = 0;
    v346 = 0;
    if (v9(v333)) {
     v334 = true;
     v335 = v1.createStream(34962, v333);
     v342 = v335.dtype;
    }
    else {
     v335 = v1.getBuffer(v333);
     if (v335) {
      v342 = v335.dtype;
     }
     else if ('constant' in v333) {
      v340 = 2;
      if (typeof v333.constant === 'number') {
       v344 = v333.constant;
       v345 = v346 = v343 = 0;
      }
      else {
       v344 = v333.constant.length > 0 ? v333.constant[0] : 0;
       v345 = v333.constant.length > 1 ? v333.constant[1] : 0;
       v346 = v333.constant.length > 2 ? v333.constant[2] : 0;
       v343 = v333.constant.length > 3 ? v333.constant[3] : 0;
      }
     }
     else {
      if (v9(v333.buffer)) {
       v335 = v1.createStream(34962, v333.buffer);
      }
      else {
       v335 = v1.getBuffer(v333.buffer);
      }
      v342 = 'type' in v333 ? v43[v333.type] : v335.dtype;
      v337 = !!v333.normalized;
      v339 = v333.size | 0;
      v338 = v333.offset | 0;
      v341 = v333.stride | 0;
      v336 = v333.divisor | 0;
     }
    }
    v347 = $17.buffer;
    $17.buffer = v335;
    v348 = $17.divisor;
    $17.divisor = v336;
    v349 = $17.normalized;
    $17.normalized = v337;
    v350 = $17.offset;
    $17.offset = v338;
    v351 = $17.size;
    $17.size = v339;
    v352 = $17.state;
    $17.state = v340;
    v353 = $17.stride;
    $17.stride = v341;
    v354 = $17.type;
    $17.type = v342;
    v355 = $17.w;
    $17.w = v343;
    v356 = $17.x;
    $17.x = v344;
    v357 = $17.y;
    $17.y = v345;
    v358 = $17.z;
    $17.z = v346;
    v359 = $18.call(this, v2, a0, a2);
    v360 = false;
    v361 = null;
    v362 = 0;
    v363 = false;
    v364 = 0;
    v365 = 0;
    v366 = 1;
    v367 = 0;
    v368 = 5126;
    v369 = 0;
    v370 = 0;
    v371 = 0;
    v372 = 0;
    if (v9(v359)) {
     v360 = true;
     v361 = v1.createStream(34962, v359);
     v368 = v361.dtype;
    }
    else {
     v361 = v1.getBuffer(v359);
     if (v361) {
      v368 = v361.dtype;
     }
     else if ('constant' in v359) {
      v366 = 2;
      if (typeof v359.constant === 'number') {
       v370 = v359.constant;
       v371 = v372 = v369 = 0;
      }
      else {
       v370 = v359.constant.length > 0 ? v359.constant[0] : 0;
       v371 = v359.constant.length > 1 ? v359.constant[1] : 0;
       v372 = v359.constant.length > 2 ? v359.constant[2] : 0;
       v369 = v359.constant.length > 3 ? v359.constant[3] : 0;
      }
     }
     else {
      if (v9(v359.buffer)) {
       v361 = v1.createStream(34962, v359.buffer);
      }
      else {
       v361 = v1.getBuffer(v359.buffer);
      }
      v368 = 'type' in v359 ? v43[v359.type] : v361.dtype;
      v363 = !!v359.normalized;
      v365 = v359.size | 0;
      v364 = v359.offset | 0;
      v367 = v359.stride | 0;
      v362 = v359.divisor | 0;
     }
    }
    v373 = $19.buffer;
    $19.buffer = v361;
    v374 = $19.divisor;
    $19.divisor = v362;
    v375 = $19.normalized;
    $19.normalized = v363;
    v376 = $19.offset;
    $19.offset = v364;
    v377 = $19.size;
    $19.size = v365;
    v378 = $19.state;
    $19.state = v366;
    v379 = $19.stride;
    $19.stride = v367;
    v380 = $19.type;
    $19.type = v368;
    v381 = $19.w;
    $19.w = v369;
    v382 = $19.x;
    $19.x = v370;
    v383 = $19.y;
    $19.y = v371;
    v384 = $19.z;
    $19.z = v372;
    v385 = $20.call(this, v2, a0, a2);
    v386 = false;
    v387 = null;
    v388 = 0;
    v389 = false;
    v390 = 0;
    v391 = 0;
    v392 = 1;
    v393 = 0;
    v394 = 5126;
    v395 = 0;
    v396 = 0;
    v397 = 0;
    v398 = 0;
    if (v9(v385)) {
     v386 = true;
     v387 = v1.createStream(34962, v385);
     v394 = v387.dtype;
    }
    else {
     v387 = v1.getBuffer(v385);
     if (v387) {
      v394 = v387.dtype;
     }
     else if ('constant' in v385) {
      v392 = 2;
      if (typeof v385.constant === 'number') {
       v396 = v385.constant;
       v397 = v398 = v395 = 0;
      }
      else {
       v396 = v385.constant.length > 0 ? v385.constant[0] : 0;
       v397 = v385.constant.length > 1 ? v385.constant[1] : 0;
       v398 = v385.constant.length > 2 ? v385.constant[2] : 0;
       v395 = v385.constant.length > 3 ? v385.constant[3] : 0;
      }
     }
     else {
      if (v9(v385.buffer)) {
       v387 = v1.createStream(34962, v385.buffer);
      }
      else {
       v387 = v1.getBuffer(v385.buffer);
      }
      v394 = 'type' in v385 ? v43[v385.type] : v387.dtype;
      v389 = !!v385.normalized;
      v391 = v385.size | 0;
      v390 = v385.offset | 0;
      v393 = v385.stride | 0;
      v388 = v385.divisor | 0;
     }
    }
    v399 = $21.buffer;
    $21.buffer = v387;
    v400 = $21.divisor;
    $21.divisor = v388;
    v401 = $21.normalized;
    $21.normalized = v389;
    v402 = $21.offset;
    $21.offset = v390;
    v403 = $21.size;
    $21.size = v391;
    v404 = $21.state;
    $21.state = v392;
    v405 = $21.stride;
    $21.stride = v393;
    v406 = $21.type;
    $21.type = v394;
    v407 = $21.w;
    $21.w = v395;
    v408 = $21.x;
    $21.x = v396;
    v409 = $21.y;
    $21.y = v397;
    v410 = $21.z;
    $21.z = v398;
    v411 = $22.call(this, v2, a0, a2);
    v412 = false;
    v413 = null;
    v414 = 0;
    v415 = false;
    v416 = 0;
    v417 = 0;
    v418 = 1;
    v419 = 0;
    v420 = 5126;
    v421 = 0;
    v422 = 0;
    v423 = 0;
    v424 = 0;
    if (v9(v411)) {
     v412 = true;
     v413 = v1.createStream(34962, v411);
     v420 = v413.dtype;
    }
    else {
     v413 = v1.getBuffer(v411);
     if (v413) {
      v420 = v413.dtype;
     }
     else if ('constant' in v411) {
      v418 = 2;
      if (typeof v411.constant === 'number') {
       v422 = v411.constant;
       v423 = v424 = v421 = 0;
      }
      else {
       v422 = v411.constant.length > 0 ? v411.constant[0] : 0;
       v423 = v411.constant.length > 1 ? v411.constant[1] : 0;
       v424 = v411.constant.length > 2 ? v411.constant[2] : 0;
       v421 = v411.constant.length > 3 ? v411.constant[3] : 0;
      }
     }
     else {
      if (v9(v411.buffer)) {
       v413 = v1.createStream(34962, v411.buffer);
      }
      else {
       v413 = v1.getBuffer(v411.buffer);
      }
      v420 = 'type' in v411 ? v43[v411.type] : v413.dtype;
      v415 = !!v411.normalized;
      v417 = v411.size | 0;
      v416 = v411.offset | 0;
      v419 = v411.stride | 0;
      v414 = v411.divisor | 0;
     }
    }
    v425 = $23.buffer;
    $23.buffer = v413;
    v426 = $23.divisor;
    $23.divisor = v414;
    v427 = $23.normalized;
    $23.normalized = v415;
    v428 = $23.offset;
    $23.offset = v416;
    v429 = $23.size;
    $23.size = v417;
    v430 = $23.state;
    $23.state = v418;
    v431 = $23.stride;
    $23.stride = v419;
    v432 = $23.type;
    $23.type = v420;
    v433 = $23.w;
    $23.w = v421;
    v434 = $23.x;
    $23.x = v422;
    v435 = $23.y;
    $23.y = v423;
    v436 = $23.z;
    $23.z = v424;
    v437 = $24.call(this, v2, a0, a2);
    v438 = false;
    v439 = null;
    v440 = 0;
    v441 = false;
    v442 = 0;
    v443 = 0;
    v444 = 1;
    v445 = 0;
    v446 = 5126;
    v447 = 0;
    v448 = 0;
    v449 = 0;
    v450 = 0;
    if (v9(v437)) {
     v438 = true;
     v439 = v1.createStream(34962, v437);
     v446 = v439.dtype;
    }
    else {
     v439 = v1.getBuffer(v437);
     if (v439) {
      v446 = v439.dtype;
     }
     else if ('constant' in v437) {
      v444 = 2;
      if (typeof v437.constant === 'number') {
       v448 = v437.constant;
       v449 = v450 = v447 = 0;
      }
      else {
       v448 = v437.constant.length > 0 ? v437.constant[0] : 0;
       v449 = v437.constant.length > 1 ? v437.constant[1] : 0;
       v450 = v437.constant.length > 2 ? v437.constant[2] : 0;
       v447 = v437.constant.length > 3 ? v437.constant[3] : 0;
      }
     }
     else {
      if (v9(v437.buffer)) {
       v439 = v1.createStream(34962, v437.buffer);
      }
      else {
       v439 = v1.getBuffer(v437.buffer);
      }
      v446 = 'type' in v437 ? v43[v437.type] : v439.dtype;
      v441 = !!v437.normalized;
      v443 = v437.size | 0;
      v442 = v437.offset | 0;
      v445 = v437.stride | 0;
      v440 = v437.divisor | 0;
     }
    }
    v451 = $25.buffer;
    $25.buffer = v439;
    v452 = $25.divisor;
    $25.divisor = v440;
    v453 = $25.normalized;
    $25.normalized = v441;
    v454 = $25.offset;
    $25.offset = v442;
    v455 = $25.size;
    $25.size = v443;
    v456 = $25.state;
    $25.state = v444;
    v457 = $25.stride;
    $25.stride = v445;
    v458 = $25.type;
    $25.type = v446;
    v459 = $25.w;
    $25.w = v447;
    v460 = $25.x;
    $25.x = v448;
    v461 = $25.y;
    $25.y = v449;
    v462 = $25.z;
    $25.z = v450;
    v463 = $26.call(this, v2, a0, a2);
    v464 = false;
    v465 = null;
    v466 = 0;
    v467 = false;
    v468 = 0;
    v469 = 0;
    v470 = 1;
    v471 = 0;
    v472 = 5126;
    v473 = 0;
    v474 = 0;
    v475 = 0;
    v476 = 0;
    if (v9(v463)) {
     v464 = true;
     v465 = v1.createStream(34962, v463);
     v472 = v465.dtype;
    }
    else {
     v465 = v1.getBuffer(v463);
     if (v465) {
      v472 = v465.dtype;
     }
     else if ('constant' in v463) {
      v470 = 2;
      if (typeof v463.constant === 'number') {
       v474 = v463.constant;
       v475 = v476 = v473 = 0;
      }
      else {
       v474 = v463.constant.length > 0 ? v463.constant[0] : 0;
       v475 = v463.constant.length > 1 ? v463.constant[1] : 0;
       v476 = v463.constant.length > 2 ? v463.constant[2] : 0;
       v473 = v463.constant.length > 3 ? v463.constant[3] : 0;
      }
     }
     else {
      if (v9(v463.buffer)) {
       v465 = v1.createStream(34962, v463.buffer);
      }
      else {
       v465 = v1.getBuffer(v463.buffer);
      }
      v472 = 'type' in v463 ? v43[v463.type] : v465.dtype;
      v467 = !!v463.normalized;
      v469 = v463.size | 0;
      v468 = v463.offset | 0;
      v471 = v463.stride | 0;
      v466 = v463.divisor | 0;
     }
    }
    v477 = $27.buffer;
    $27.buffer = v465;
    v478 = $27.divisor;
    $27.divisor = v466;
    v479 = $27.normalized;
    $27.normalized = v467;
    v480 = $27.offset;
    $27.offset = v468;
    v481 = $27.size;
    $27.size = v469;
    v482 = $27.state;
    $27.state = v470;
    v483 = $27.stride;
    $27.stride = v471;
    v484 = $27.type;
    $27.type = v472;
    v485 = $27.w;
    $27.w = v473;
    v486 = $27.x;
    $27.x = v474;
    v487 = $27.y;
    $27.y = v475;
    v488 = $27.z;
    $27.z = v476;
    v489 = $28.call(this, v2, a0, a2);
    v490 = false;
    v491 = null;
    v492 = 0;
    v493 = false;
    v494 = 0;
    v495 = 0;
    v496 = 1;
    v497 = 0;
    v498 = 5126;
    v499 = 0;
    v500 = 0;
    v501 = 0;
    v502 = 0;
    if (v9(v489)) {
     v490 = true;
     v491 = v1.createStream(34962, v489);
     v498 = v491.dtype;
    }
    else {
     v491 = v1.getBuffer(v489);
     if (v491) {
      v498 = v491.dtype;
     }
     else if ('constant' in v489) {
      v496 = 2;
      if (typeof v489.constant === 'number') {
       v500 = v489.constant;
       v501 = v502 = v499 = 0;
      }
      else {
       v500 = v489.constant.length > 0 ? v489.constant[0] : 0;
       v501 = v489.constant.length > 1 ? v489.constant[1] : 0;
       v502 = v489.constant.length > 2 ? v489.constant[2] : 0;
       v499 = v489.constant.length > 3 ? v489.constant[3] : 0;
      }
     }
     else {
      if (v9(v489.buffer)) {
       v491 = v1.createStream(34962, v489.buffer);
      }
      else {
       v491 = v1.getBuffer(v489.buffer);
      }
      v498 = 'type' in v489 ? v43[v489.type] : v491.dtype;
      v493 = !!v489.normalized;
      v495 = v489.size | 0;
      v494 = v489.offset | 0;
      v497 = v489.stride | 0;
      v492 = v489.divisor | 0;
     }
    }
    v503 = $29.buffer;
    $29.buffer = v491;
    v504 = $29.divisor;
    $29.divisor = v492;
    v505 = $29.normalized;
    $29.normalized = v493;
    v506 = $29.offset;
    $29.offset = v494;
    v507 = $29.size;
    $29.size = v495;
    v508 = $29.state;
    $29.state = v496;
    v509 = $29.stride;
    $29.stride = v497;
    v510 = $29.type;
    $29.type = v498;
    v511 = $29.w;
    $29.w = v499;
    v512 = $29.x;
    $29.x = v500;
    v513 = $29.y;
    $29.y = v501;
    v514 = $29.z;
    $29.z = v502;
    v515 = $30.call(this, v2, a0, a2);
    v516 = false;
    v517 = null;
    v518 = 0;
    v519 = false;
    v520 = 0;
    v521 = 0;
    v522 = 1;
    v523 = 0;
    v524 = 5126;
    v525 = 0;
    v526 = 0;
    v527 = 0;
    v528 = 0;
    if (v9(v515)) {
     v516 = true;
     v517 = v1.createStream(34962, v515);
     v524 = v517.dtype;
    }
    else {
     v517 = v1.getBuffer(v515);
     if (v517) {
      v524 = v517.dtype;
     }
     else if ('constant' in v515) {
      v522 = 2;
      if (typeof v515.constant === 'number') {
       v526 = v515.constant;
       v527 = v528 = v525 = 0;
      }
      else {
       v526 = v515.constant.length > 0 ? v515.constant[0] : 0;
       v527 = v515.constant.length > 1 ? v515.constant[1] : 0;
       v528 = v515.constant.length > 2 ? v515.constant[2] : 0;
       v525 = v515.constant.length > 3 ? v515.constant[3] : 0;
      }
     }
     else {
      if (v9(v515.buffer)) {
       v517 = v1.createStream(34962, v515.buffer);
      }
      else {
       v517 = v1.getBuffer(v515.buffer);
      }
      v524 = 'type' in v515 ? v43[v515.type] : v517.dtype;
      v519 = !!v515.normalized;
      v521 = v515.size | 0;
      v520 = v515.offset | 0;
      v523 = v515.stride | 0;
      v518 = v515.divisor | 0;
     }
    }
    v529 = $31.buffer;
    $31.buffer = v517;
    v530 = $31.divisor;
    $31.divisor = v518;
    v531 = $31.normalized;
    $31.normalized = v519;
    v532 = $31.offset;
    $31.offset = v520;
    v533 = $31.size;
    $31.size = v521;
    v534 = $31.state;
    $31.state = v522;
    v535 = $31.stride;
    $31.stride = v523;
    v536 = $31.type;
    $31.type = v524;
    v537 = $31.w;
    $31.w = v525;
    v538 = $31.x;
    $31.x = v526;
    v539 = $31.y;
    $31.y = v527;
    v540 = $31.z;
    $31.z = v528;
    v541 = $32.call(this, v2, a0, a2);
    v542 = false;
    v543 = null;
    v544 = 0;
    v545 = false;
    v546 = 0;
    v547 = 0;
    v548 = 1;
    v549 = 0;
    v550 = 5126;
    v551 = 0;
    v552 = 0;
    v553 = 0;
    v554 = 0;
    if (v9(v541)) {
     v542 = true;
     v543 = v1.createStream(34962, v541);
     v550 = v543.dtype;
    }
    else {
     v543 = v1.getBuffer(v541);
     if (v543) {
      v550 = v543.dtype;
     }
     else if ('constant' in v541) {
      v548 = 2;
      if (typeof v541.constant === 'number') {
       v552 = v541.constant;
       v553 = v554 = v551 = 0;
      }
      else {
       v552 = v541.constant.length > 0 ? v541.constant[0] : 0;
       v553 = v541.constant.length > 1 ? v541.constant[1] : 0;
       v554 = v541.constant.length > 2 ? v541.constant[2] : 0;
       v551 = v541.constant.length > 3 ? v541.constant[3] : 0;
      }
     }
     else {
      if (v9(v541.buffer)) {
       v543 = v1.createStream(34962, v541.buffer);
      }
      else {
       v543 = v1.getBuffer(v541.buffer);
      }
      v550 = 'type' in v541 ? v43[v541.type] : v543.dtype;
      v545 = !!v541.normalized;
      v547 = v541.size | 0;
      v546 = v541.offset | 0;
      v549 = v541.stride | 0;
      v544 = v541.divisor | 0;
     }
    }
    v555 = $33.buffer;
    $33.buffer = v543;
    v556 = $33.divisor;
    $33.divisor = v544;
    v557 = $33.normalized;
    $33.normalized = v545;
    v558 = $33.offset;
    $33.offset = v546;
    v559 = $33.size;
    $33.size = v547;
    v560 = $33.state;
    $33.state = v548;
    v561 = $33.stride;
    $33.stride = v549;
    v562 = $33.type;
    $33.type = v550;
    v563 = $33.w;
    $33.w = v551;
    v564 = $33.x;
    $33.x = v552;
    v565 = $33.y;
    $33.y = v553;
    v566 = $33.z;
    $33.z = v554;
    v567 = v11.vert;
    v11.vert = 44;
    v568 = v11.frag;
    v11.frag = 43;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v279;
    v2.viewportHeight = v280;
    v38[0] = v281;
    v38[1] = v282;
    v38[2] = v283;
    v38[3] = v284;
    v16[0] = v285;
    v16[1] = v286;
    v16[2] = v287;
    v16[3] = v288;
    v10.blend_enable = v289;
    v20[0] = v290;
    v20[1] = v291;
    v20[2] = v292;
    v20[3] = v293;
    v10.depth_enable = v294;
    v30[0] = v300;
    v30[1] = v301;
    v30[2] = v302;
    v30[3] = v303;
    v10.scissor_enable = v304;
    v10.stencil_enable = v305;
    if (v308) {
     v5.destroyStream(v307);
    }
    v4.elements = v309;
    v4.offset = v311;
    v4.count = v313;
    v4.primitive = v314;
    v14[45] = v315;
    v14[48] = v317;
    v14[10] = v319;
    v14[46] = v321;
    v14[47] = v322;
    v14[34] = v324;
    v14[6] = v326;
    v14[7] = v328;
    v14[8] = v330;
    v14[9] = v332;
    if (v334) {
     v1.destroyStream(v335);
    }
    $17.buffer = v347;
    $17.divisor = v348;
    $17.normalized = v349;
    $17.offset = v350;
    $17.size = v351;
    $17.state = v352;
    $17.stride = v353;
    $17.type = v354;
    $17.w = v355;
    $17.x = v356;
    $17.y = v357;
    $17.z = v358;
    if (v360) {
     v1.destroyStream(v361);
    }
    $19.buffer = v373;
    $19.divisor = v374;
    $19.normalized = v375;
    $19.offset = v376;
    $19.size = v377;
    $19.state = v378;
    $19.stride = v379;
    $19.type = v380;
    $19.w = v381;
    $19.x = v382;
    $19.y = v383;
    $19.z = v384;
    if (v386) {
     v1.destroyStream(v387);
    }
    $21.buffer = v399;
    $21.divisor = v400;
    $21.normalized = v401;
    $21.offset = v402;
    $21.size = v403;
    $21.state = v404;
    $21.stride = v405;
    $21.type = v406;
    $21.w = v407;
    $21.x = v408;
    $21.y = v409;
    $21.z = v410;
    if (v412) {
     v1.destroyStream(v413);
    }
    $23.buffer = v425;
    $23.divisor = v426;
    $23.normalized = v427;
    $23.offset = v428;
    $23.size = v429;
    $23.state = v430;
    $23.stride = v431;
    $23.type = v432;
    $23.w = v433;
    $23.x = v434;
    $23.y = v435;
    $23.z = v436;
    if (v438) {
     v1.destroyStream(v439);
    }
    $25.buffer = v451;
    $25.divisor = v452;
    $25.normalized = v453;
    $25.offset = v454;
    $25.size = v455;
    $25.state = v456;
    $25.stride = v457;
    $25.type = v458;
    $25.w = v459;
    $25.x = v460;
    $25.y = v461;
    $25.z = v462;
    if (v464) {
     v1.destroyStream(v465);
    }
    $27.buffer = v477;
    $27.divisor = v478;
    $27.normalized = v479;
    $27.offset = v480;
    $27.size = v481;
    $27.state = v482;
    $27.stride = v483;
    $27.type = v484;
    $27.w = v485;
    $27.x = v486;
    $27.y = v487;
    $27.z = v488;
    if (v490) {
     v1.destroyStream(v491);
    }
    $29.buffer = v503;
    $29.divisor = v504;
    $29.normalized = v505;
    $29.offset = v506;
    $29.size = v507;
    $29.state = v508;
    $29.stride = v509;
    $29.type = v510;
    $29.w = v511;
    $29.x = v512;
    $29.y = v513;
    $29.z = v514;
    if (v516) {
     v1.destroyStream(v517);
    }
    $31.buffer = v529;
    $31.divisor = v530;
    $31.normalized = v531;
    $31.offset = v532;
    $31.size = v533;
    $31.state = v534;
    $31.stride = v535;
    $31.type = v536;
    $31.w = v537;
    $31.x = v538;
    $31.y = v539;
    $31.z = v540;
    if (v542) {
     v1.destroyStream(v543);
    }
    $33.buffer = v555;
    $33.divisor = v556;
    $33.normalized = v557;
    $33.offset = v558;
    $33.size = v559;
    $33.state = v560;
    $33.stride = v561;
    $33.type = v562;
    $33.w = v563;
    $33.x = v564;
    $33.y = v565;
    $33.z = v566;
    v11.vert = v567;
    v11.frag = v568;
    v3.dirty = true;
   }
   ,
  }

 },
 '$45,borderColorId,borderSize,colorId,constPointSize,isActive,opacity,paletteSize,paletteTexture,pixelRatio,scale,scaleFract,size,translate,translateFract,x,xFract,y,yFract': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, borderColorId, borderSize, colorId, constPointSize, isActive, opacity, paletteSize, paletteTexture, pixelRatio, scale, scaleFract, size, translate, translateFract, x, xFract, y, yFract
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  return {
   'batch': function (a0, a1) {
    var v567, v568, v603, v604, v605;
    v567 = v6.angle_instanced_arrays;
    v568 = v7.next;
    if (v568 !== v7.cur) {
     if (v568) {
      v8.bindFramebuffer(36160, v568.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v568;
    }
    if (v3.dirty) {
     var v569, v570, v571, v572, v573, v574, v575, v576, v577, v578, v579, v580, v581, v582, v583, v584, v585, v586, v587, v588, v589, v590, v591, v592, v593, v594, v595, v596, v597, v598, v599, v600, v601, v602;
     v569 = v10.dither;
     if (v569 !== v3.dither) {
      if (v569) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v569;
     }
     v570 = v18[0];
     v571 = v18[1];
     if (v570 !== v19[0] || v571 !== v19[1]) {
      v8.blendEquationSeparate(v570, v571);
      v19[0] = v570;
      v19[1] = v571;
     }
     v572 = v10.depth_func;
     if (v572 !== v3.depth_func) {
      v8.depthFunc(v572);
      v3.depth_func = v572;
     }
     v573 = v24[0];
     v574 = v24[1];
     if (v573 !== v25[0] || v574 !== v25[1]) {
      v8.depthRange(v573, v574);
      v25[0] = v573;
      v25[1] = v574;
     }
     v575 = v10.depth_mask;
     if (v575 !== v3.depth_mask) {
      v8.depthMask(v575);
      v3.depth_mask = v575;
     }
     v576 = v22[0];
     v577 = v22[1];
     v578 = v22[2];
     v579 = v22[3];
     if (v576 !== v23[0] || v577 !== v23[1] || v578 !== v23[2] || v579 !== v23[3]) {
      v8.colorMask(v576, v577, v578, v579);
      v23[0] = v576;
      v23[1] = v577;
      v23[2] = v578;
      v23[3] = v579;
     }
     v580 = v10.cull_enable;
     if (v580 !== v3.cull_enable) {
      if (v580) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v580;
     }
     v581 = v10.cull_face;
     if (v581 !== v3.cull_face) {
      v8.cullFace(v581);
      v3.cull_face = v581;
     }
     v582 = v10.frontFace;
     if (v582 !== v3.frontFace) {
      v8.frontFace(v582);
      v3.frontFace = v582;
     }
     v583 = v10.lineWidth;
     if (v583 !== v3.lineWidth) {
      v8.lineWidth(v583);
      v3.lineWidth = v583;
     }
     v584 = v10.polygonOffset_enable;
     if (v584 !== v3.polygonOffset_enable) {
      if (v584) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v584;
     }
     v585 = v26[0];
     v586 = v26[1];
     if (v585 !== v27[0] || v586 !== v27[1]) {
      v8.polygonOffset(v585, v586);
      v27[0] = v585;
      v27[1] = v586;
     }
     v587 = v10.sample_alpha;
     if (v587 !== v3.sample_alpha) {
      if (v587) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v587;
     }
     v588 = v10.sample_enable;
     if (v588 !== v3.sample_enable) {
      if (v588) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v588;
     }
     v589 = v28[0];
     v590 = v28[1];
     if (v589 !== v29[0] || v590 !== v29[1]) {
      v8.sampleCoverage(v589, v590);
      v29[0] = v589;
      v29[1] = v590;
     }
     v591 = v10.stencil_mask;
     if (v591 !== v3.stencil_mask) {
      v8.stencilMask(v591);
      v3.stencil_mask = v591;
     }
     v592 = v32[0];
     v593 = v32[1];
     v594 = v32[2];
     if (v592 !== v33[0] || v593 !== v33[1] || v594 !== v33[2]) {
      v8.stencilFunc(v592, v593, v594);
      v33[0] = v592;
      v33[1] = v593;
      v33[2] = v594;
     }
     v595 = v36[0];
     v596 = v36[1];
     v597 = v36[2];
     v598 = v36[3];
     if (v595 !== v37[0] || v596 !== v37[1] || v597 !== v37[2] || v598 !== v37[3]) {
      v8.stencilOpSeparate(v595, v596, v597, v598);
      v37[0] = v595;
      v37[1] = v596;
      v37[2] = v597;
      v37[3] = v598;
     }
     v599 = v34[0];
     v600 = v34[1];
     v601 = v34[2];
     v602 = v34[3];
     if (v599 !== v35[0] || v600 !== v35[1] || v601 !== v35[2] || v602 !== v35[3]) {
      v8.stencilOpSeparate(v599, v600, v601, v602);
      v35[0] = v599;
      v35[1] = v600;
      v35[2] = v601;
      v35[3] = v602;
     }
    }
    v8.blendColor(0, 0, 0, 1);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 1;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($34.program);
    v603 = v6.angle_instanced_arrays;
    var v805;
    v15.setVAO(null);
    v8.uniform1i(constPointSize.location, false);
    v8.uniform1i(paletteTexture.location, $44.bind());
    v805 = v4.instances;
    for (v604 = 0;
     v604 < a1;
     ++v604) {
     v605 = a0[v604];
     var v606, v607, v608, v609, v610, v611, v612, v613, v614, v615, v616, v617, v618, v619, v620, v621, v622, v623, v624, v625, v626, v627, v628, v629, v630, v631, v632, v633, v634, v635, v636, v637, v638, v639, v640, v641, v642, v643, v644, v645, v646, v647, v648, v649, v650, v651, v652, v653, v654, v655, v656, v657, v658, v659, v660, v661, v662, v663, v664, v665, v666, v667, v668, v669, v670, v671, v672, v673, v674, v675, v676, v677, v678, v679, v680, v681, v682, v683, v684, v685, v686, v687, v688, v689, v690, v691, v692, v693, v694, v695, v696, v697, v698, v699, v700, v701, v702, v703, v704, v705, v706, v707, v708, v709, v710, v711, v712, v713, v714, v715, v716, v717, v718, v719, v720, v721, v722, v723, v724, v725, v726, v727, v728, v729, v730, v731, v732, v733, v734, v735, v736, v737, v738, v739, v740, v741, v742, v743, v744, v745, v746, v747, v748, v749, v750, v751, v752, v753, v754, v755, v756, v757, v758, v759, v760, v761, v762, v763, v764, v765, v766, v767, v768, v769, v770, v771, v772, v773, v774, v775, v776, v777, v778, v779, v780, v781, v782, v783, v784, v785, v786, v787, v788, v789, v790, v791, v792, v793, v794, v795, v796, v797, v798, v799, v800, v801, v802, v803, v804;
     v606 = v605['viewport'];
     v607 = v606.x | 0;
     v608 = v606.y | 0;
     v609 = 'width' in v606 ? v606.width | 0 : (v2.framebufferWidth - v607);
     v610 = 'height' in v606 ? v606.height | 0 : (v2.framebufferHeight - v608);
     v611 = v2.viewportWidth;
     v2.viewportWidth = v609;
     v612 = v2.viewportHeight;
     v2.viewportHeight = v610;
     v8.viewport(v607, v608, v609, v610);
     v39[0] = v607;
     v39[1] = v608;
     v39[2] = v609;
     v39[3] = v610;
     v613 = v605['viewport'];
     v614 = v613.x | 0;
     v615 = v613.y | 0;
     v616 = 'width' in v613 ? v613.width | 0 : (v2.framebufferWidth - v614);
     v617 = 'height' in v613 ? v613.height | 0 : (v2.framebufferHeight - v615);
     v8.scissor(v614, v615, v616, v617);
     v31[0] = v614;
     v31[1] = v615;
     v31[2] = v616;
     v31[3] = v617;
     v618 = $35.call(this, v2, v605, v604);
     v619 = false;
     v620 = null;
     v621 = 0;
     v622 = false;
     v623 = 0;
     v624 = 0;
     v625 = 1;
     v626 = 0;
     v627 = 5126;
     v628 = 0;
     v629 = 0;
     v630 = 0;
     v631 = 0;
     if (v9(v618)) {
      v619 = true;
      v620 = v1.createStream(34962, v618);
      v627 = v620.dtype;
     }
     else {
      v620 = v1.getBuffer(v618);
      if (v620) {
       v627 = v620.dtype;
      }
      else if ('constant' in v618) {
       v625 = 2;
       if (typeof v618.constant === 'number') {
        v629 = v618.constant;
        v630 = v631 = v628 = 0;
       }
       else {
        v629 = v618.constant.length > 0 ? v618.constant[0] : 0;
        v630 = v618.constant.length > 1 ? v618.constant[1] : 0;
        v631 = v618.constant.length > 2 ? v618.constant[2] : 0;
        v628 = v618.constant.length > 3 ? v618.constant[3] : 0;
       }
      }
      else {
       if (v9(v618.buffer)) {
        v620 = v1.createStream(34962, v618.buffer);
       }
       else {
        v620 = v1.getBuffer(v618.buffer);
       }
       v627 = 'type' in v618 ? v43[v618.type] : v620.dtype;
       v622 = !!v618.normalized;
       v624 = v618.size | 0;
       v623 = v618.offset | 0;
       v626 = v618.stride | 0;
       v621 = v618.divisor | 0;
      }
     }
     v632 = x.location;
     v633 = v0[v632];
     if (v625 === 1) {
      if (!v633.buffer) {
       v8.enableVertexAttribArray(v632);
      }
      v634 = v624 || 1;
      if (v633.type !== v627 || v633.size !== v634 || v633.buffer !== v620 || v633.normalized !== v622 || v633.offset !== v623 || v633.stride !== v626) {
       v8.bindBuffer(34962, v620.buffer);
       v8.vertexAttribPointer(v632, v634, v627, v622, v626, v623);
       v633.type = v627;
       v633.size = v634;
       v633.buffer = v620;
       v633.normalized = v622;
       v633.offset = v623;
       v633.stride = v626;
      }
      if (v633.divisor !== v621) {
       v603.vertexAttribDivisorANGLE(v632, v621);
       v633.divisor = v621;
      }
     }
     else {
      if (v633.buffer) {
       v8.disableVertexAttribArray(v632);
       v633.buffer = null;
      }
      if (v633.x !== v629 || v633.y !== v630 || v633.z !== v631 || v633.w !== v628) {
       v8.vertexAttrib4f(v632, v629, v630, v631, v628);
       v633.x = v629;
       v633.y = v630;
       v633.z = v631;
       v633.w = v628;
      }
     }
     v635 = $36.call(this, v2, v605, v604);
     v636 = false;
     v637 = null;
     v638 = 0;
     v639 = false;
     v640 = 0;
     v641 = 0;
     v642 = 1;
     v643 = 0;
     v644 = 5126;
     v645 = 0;
     v646 = 0;
     v647 = 0;
     v648 = 0;
     if (v9(v635)) {
      v636 = true;
      v637 = v1.createStream(34962, v635);
      v644 = v637.dtype;
     }
     else {
      v637 = v1.getBuffer(v635);
      if (v637) {
       v644 = v637.dtype;
      }
      else if ('constant' in v635) {
       v642 = 2;
       if (typeof v635.constant === 'number') {
        v646 = v635.constant;
        v647 = v648 = v645 = 0;
       }
       else {
        v646 = v635.constant.length > 0 ? v635.constant[0] : 0;
        v647 = v635.constant.length > 1 ? v635.constant[1] : 0;
        v648 = v635.constant.length > 2 ? v635.constant[2] : 0;
        v645 = v635.constant.length > 3 ? v635.constant[3] : 0;
       }
      }
      else {
       if (v9(v635.buffer)) {
        v637 = v1.createStream(34962, v635.buffer);
       }
       else {
        v637 = v1.getBuffer(v635.buffer);
       }
       v644 = 'type' in v635 ? v43[v635.type] : v637.dtype;
       v639 = !!v635.normalized;
       v641 = v635.size | 0;
       v640 = v635.offset | 0;
       v643 = v635.stride | 0;
       v638 = v635.divisor | 0;
      }
     }
     v649 = y.location;
     v650 = v0[v649];
     if (v642 === 1) {
      if (!v650.buffer) {
       v8.enableVertexAttribArray(v649);
      }
      v651 = v641 || 1;
      if (v650.type !== v644 || v650.size !== v651 || v650.buffer !== v637 || v650.normalized !== v639 || v650.offset !== v640 || v650.stride !== v643) {
       v8.bindBuffer(34962, v637.buffer);
       v8.vertexAttribPointer(v649, v651, v644, v639, v643, v640);
       v650.type = v644;
       v650.size = v651;
       v650.buffer = v637;
       v650.normalized = v639;
       v650.offset = v640;
       v650.stride = v643;
      }
      if (v650.divisor !== v638) {
       v603.vertexAttribDivisorANGLE(v649, v638);
       v650.divisor = v638;
      }
     }
     else {
      if (v650.buffer) {
       v8.disableVertexAttribArray(v649);
       v650.buffer = null;
      }
      if (v650.x !== v646 || v650.y !== v647 || v650.z !== v648 || v650.w !== v645) {
       v8.vertexAttrib4f(v649, v646, v647, v648, v645);
       v650.x = v646;
       v650.y = v647;
       v650.z = v648;
       v650.w = v645;
      }
     }
     v652 = $37.call(this, v2, v605, v604);
     v653 = false;
     v654 = null;
     v655 = 0;
     v656 = false;
     v657 = 0;
     v658 = 0;
     v659 = 1;
     v660 = 0;
     v661 = 5126;
     v662 = 0;
     v663 = 0;
     v664 = 0;
     v665 = 0;
     if (v9(v652)) {
      v653 = true;
      v654 = v1.createStream(34962, v652);
      v661 = v654.dtype;
     }
     else {
      v654 = v1.getBuffer(v652);
      if (v654) {
       v661 = v654.dtype;
      }
      else if ('constant' in v652) {
       v659 = 2;
       if (typeof v652.constant === 'number') {
        v663 = v652.constant;
        v664 = v665 = v662 = 0;
       }
       else {
        v663 = v652.constant.length > 0 ? v652.constant[0] : 0;
        v664 = v652.constant.length > 1 ? v652.constant[1] : 0;
        v665 = v652.constant.length > 2 ? v652.constant[2] : 0;
        v662 = v652.constant.length > 3 ? v652.constant[3] : 0;
       }
      }
      else {
       if (v9(v652.buffer)) {
        v654 = v1.createStream(34962, v652.buffer);
       }
       else {
        v654 = v1.getBuffer(v652.buffer);
       }
       v661 = 'type' in v652 ? v43[v652.type] : v654.dtype;
       v656 = !!v652.normalized;
       v658 = v652.size | 0;
       v657 = v652.offset | 0;
       v660 = v652.stride | 0;
       v655 = v652.divisor | 0;
      }
     }
     v666 = xFract.location;
     v667 = v0[v666];
     if (v659 === 1) {
      if (!v667.buffer) {
       v8.enableVertexAttribArray(v666);
      }
      v668 = v658 || 1;
      if (v667.type !== v661 || v667.size !== v668 || v667.buffer !== v654 || v667.normalized !== v656 || v667.offset !== v657 || v667.stride !== v660) {
       v8.bindBuffer(34962, v654.buffer);
       v8.vertexAttribPointer(v666, v668, v661, v656, v660, v657);
       v667.type = v661;
       v667.size = v668;
       v667.buffer = v654;
       v667.normalized = v656;
       v667.offset = v657;
       v667.stride = v660;
      }
      if (v667.divisor !== v655) {
       v603.vertexAttribDivisorANGLE(v666, v655);
       v667.divisor = v655;
      }
     }
     else {
      if (v667.buffer) {
       v8.disableVertexAttribArray(v666);
       v667.buffer = null;
      }
      if (v667.x !== v663 || v667.y !== v664 || v667.z !== v665 || v667.w !== v662) {
       v8.vertexAttrib4f(v666, v663, v664, v665, v662);
       v667.x = v663;
       v667.y = v664;
       v667.z = v665;
       v667.w = v662;
      }
     }
     v669 = $38.call(this, v2, v605, v604);
     v670 = false;
     v671 = null;
     v672 = 0;
     v673 = false;
     v674 = 0;
     v675 = 0;
     v676 = 1;
     v677 = 0;
     v678 = 5126;
     v679 = 0;
     v680 = 0;
     v681 = 0;
     v682 = 0;
     if (v9(v669)) {
      v670 = true;
      v671 = v1.createStream(34962, v669);
      v678 = v671.dtype;
     }
     else {
      v671 = v1.getBuffer(v669);
      if (v671) {
       v678 = v671.dtype;
      }
      else if ('constant' in v669) {
       v676 = 2;
       if (typeof v669.constant === 'number') {
        v680 = v669.constant;
        v681 = v682 = v679 = 0;
       }
       else {
        v680 = v669.constant.length > 0 ? v669.constant[0] : 0;
        v681 = v669.constant.length > 1 ? v669.constant[1] : 0;
        v682 = v669.constant.length > 2 ? v669.constant[2] : 0;
        v679 = v669.constant.length > 3 ? v669.constant[3] : 0;
       }
      }
      else {
       if (v9(v669.buffer)) {
        v671 = v1.createStream(34962, v669.buffer);
       }
       else {
        v671 = v1.getBuffer(v669.buffer);
       }
       v678 = 'type' in v669 ? v43[v669.type] : v671.dtype;
       v673 = !!v669.normalized;
       v675 = v669.size | 0;
       v674 = v669.offset | 0;
       v677 = v669.stride | 0;
       v672 = v669.divisor | 0;
      }
     }
     v683 = yFract.location;
     v684 = v0[v683];
     if (v676 === 1) {
      if (!v684.buffer) {
       v8.enableVertexAttribArray(v683);
      }
      v685 = v675 || 1;
      if (v684.type !== v678 || v684.size !== v685 || v684.buffer !== v671 || v684.normalized !== v673 || v684.offset !== v674 || v684.stride !== v677) {
       v8.bindBuffer(34962, v671.buffer);
       v8.vertexAttribPointer(v683, v685, v678, v673, v677, v674);
       v684.type = v678;
       v684.size = v685;
       v684.buffer = v671;
       v684.normalized = v673;
       v684.offset = v674;
       v684.stride = v677;
      }
      if (v684.divisor !== v672) {
       v603.vertexAttribDivisorANGLE(v683, v672);
       v684.divisor = v672;
      }
     }
     else {
      if (v684.buffer) {
       v8.disableVertexAttribArray(v683);
       v684.buffer = null;
      }
      if (v684.x !== v680 || v684.y !== v681 || v684.z !== v682 || v684.w !== v679) {
       v8.vertexAttrib4f(v683, v680, v681, v682, v679);
       v684.x = v680;
       v684.y = v681;
       v684.z = v682;
       v684.w = v679;
      }
     }
     v686 = $39.call(this, v2, v605, v604);
     v687 = false;
     v688 = null;
     v689 = 0;
     v690 = false;
     v691 = 0;
     v692 = 0;
     v693 = 1;
     v694 = 0;
     v695 = 5126;
     v696 = 0;
     v697 = 0;
     v698 = 0;
     v699 = 0;
     if (v9(v686)) {
      v687 = true;
      v688 = v1.createStream(34962, v686);
      v695 = v688.dtype;
     }
     else {
      v688 = v1.getBuffer(v686);
      if (v688) {
       v695 = v688.dtype;
      }
      else if ('constant' in v686) {
       v693 = 2;
       if (typeof v686.constant === 'number') {
        v697 = v686.constant;
        v698 = v699 = v696 = 0;
       }
       else {
        v697 = v686.constant.length > 0 ? v686.constant[0] : 0;
        v698 = v686.constant.length > 1 ? v686.constant[1] : 0;
        v699 = v686.constant.length > 2 ? v686.constant[2] : 0;
        v696 = v686.constant.length > 3 ? v686.constant[3] : 0;
       }
      }
      else {
       if (v9(v686.buffer)) {
        v688 = v1.createStream(34962, v686.buffer);
       }
       else {
        v688 = v1.getBuffer(v686.buffer);
       }
       v695 = 'type' in v686 ? v43[v686.type] : v688.dtype;
       v690 = !!v686.normalized;
       v692 = v686.size | 0;
       v691 = v686.offset | 0;
       v694 = v686.stride | 0;
       v689 = v686.divisor | 0;
      }
     }
     v700 = size.location;
     v701 = v0[v700];
     if (v693 === 1) {
      if (!v701.buffer) {
       v8.enableVertexAttribArray(v700);
      }
      v702 = v692 || 1;
      if (v701.type !== v695 || v701.size !== v702 || v701.buffer !== v688 || v701.normalized !== v690 || v701.offset !== v691 || v701.stride !== v694) {
       v8.bindBuffer(34962, v688.buffer);
       v8.vertexAttribPointer(v700, v702, v695, v690, v694, v691);
       v701.type = v695;
       v701.size = v702;
       v701.buffer = v688;
       v701.normalized = v690;
       v701.offset = v691;
       v701.stride = v694;
      }
      if (v701.divisor !== v689) {
       v603.vertexAttribDivisorANGLE(v700, v689);
       v701.divisor = v689;
      }
     }
     else {
      if (v701.buffer) {
       v8.disableVertexAttribArray(v700);
       v701.buffer = null;
      }
      if (v701.x !== v697 || v701.y !== v698 || v701.z !== v699 || v701.w !== v696) {
       v8.vertexAttrib4f(v700, v697, v698, v699, v696);
       v701.x = v697;
       v701.y = v698;
       v701.z = v699;
       v701.w = v696;
      }
     }
     v703 = $40.call(this, v2, v605, v604);
     v704 = false;
     v705 = null;
     v706 = 0;
     v707 = false;
     v708 = 0;
     v709 = 0;
     v710 = 1;
     v711 = 0;
     v712 = 5126;
     v713 = 0;
     v714 = 0;
     v715 = 0;
     v716 = 0;
     if (v9(v703)) {
      v704 = true;
      v705 = v1.createStream(34962, v703);
      v712 = v705.dtype;
     }
     else {
      v705 = v1.getBuffer(v703);
      if (v705) {
       v712 = v705.dtype;
      }
      else if ('constant' in v703) {
       v710 = 2;
       if (typeof v703.constant === 'number') {
        v714 = v703.constant;
        v715 = v716 = v713 = 0;
       }
       else {
        v714 = v703.constant.length > 0 ? v703.constant[0] : 0;
        v715 = v703.constant.length > 1 ? v703.constant[1] : 0;
        v716 = v703.constant.length > 2 ? v703.constant[2] : 0;
        v713 = v703.constant.length > 3 ? v703.constant[3] : 0;
       }
      }
      else {
       if (v9(v703.buffer)) {
        v705 = v1.createStream(34962, v703.buffer);
       }
       else {
        v705 = v1.getBuffer(v703.buffer);
       }
       v712 = 'type' in v703 ? v43[v703.type] : v705.dtype;
       v707 = !!v703.normalized;
       v709 = v703.size | 0;
       v708 = v703.offset | 0;
       v711 = v703.stride | 0;
       v706 = v703.divisor | 0;
      }
     }
     v717 = borderSize.location;
     v718 = v0[v717];
     if (v710 === 1) {
      if (!v718.buffer) {
       v8.enableVertexAttribArray(v717);
      }
      v719 = v709 || 1;
      if (v718.type !== v712 || v718.size !== v719 || v718.buffer !== v705 || v718.normalized !== v707 || v718.offset !== v708 || v718.stride !== v711) {
       v8.bindBuffer(34962, v705.buffer);
       v8.vertexAttribPointer(v717, v719, v712, v707, v711, v708);
       v718.type = v712;
       v718.size = v719;
       v718.buffer = v705;
       v718.normalized = v707;
       v718.offset = v708;
       v718.stride = v711;
      }
      if (v718.divisor !== v706) {
       v603.vertexAttribDivisorANGLE(v717, v706);
       v718.divisor = v706;
      }
     }
     else {
      if (v718.buffer) {
       v8.disableVertexAttribArray(v717);
       v718.buffer = null;
      }
      if (v718.x !== v714 || v718.y !== v715 || v718.z !== v716 || v718.w !== v713) {
       v8.vertexAttrib4f(v717, v714, v715, v716, v713);
       v718.x = v714;
       v718.y = v715;
       v718.z = v716;
       v718.w = v713;
      }
     }
     v720 = $41.call(this, v2, v605, v604);
     v721 = false;
     v722 = null;
     v723 = 0;
     v724 = false;
     v725 = 0;
     v726 = 0;
     v727 = 1;
     v728 = 0;
     v729 = 5126;
     v730 = 0;
     v731 = 0;
     v732 = 0;
     v733 = 0;
     if (v9(v720)) {
      v721 = true;
      v722 = v1.createStream(34962, v720);
      v729 = v722.dtype;
     }
     else {
      v722 = v1.getBuffer(v720);
      if (v722) {
       v729 = v722.dtype;
      }
      else if ('constant' in v720) {
       v727 = 2;
       if (typeof v720.constant === 'number') {
        v731 = v720.constant;
        v732 = v733 = v730 = 0;
       }
       else {
        v731 = v720.constant.length > 0 ? v720.constant[0] : 0;
        v732 = v720.constant.length > 1 ? v720.constant[1] : 0;
        v733 = v720.constant.length > 2 ? v720.constant[2] : 0;
        v730 = v720.constant.length > 3 ? v720.constant[3] : 0;
       }
      }
      else {
       if (v9(v720.buffer)) {
        v722 = v1.createStream(34962, v720.buffer);
       }
       else {
        v722 = v1.getBuffer(v720.buffer);
       }
       v729 = 'type' in v720 ? v43[v720.type] : v722.dtype;
       v724 = !!v720.normalized;
       v726 = v720.size | 0;
       v725 = v720.offset | 0;
       v728 = v720.stride | 0;
       v723 = v720.divisor | 0;
      }
     }
     v734 = colorId.location;
     v735 = v0[v734];
     if (v727 === 1) {
      if (!v735.buffer) {
       v8.enableVertexAttribArray(v734);
      }
      v736 = v726 || 4;
      if (v735.type !== v729 || v735.size !== v736 || v735.buffer !== v722 || v735.normalized !== v724 || v735.offset !== v725 || v735.stride !== v728) {
       v8.bindBuffer(34962, v722.buffer);
       v8.vertexAttribPointer(v734, v736, v729, v724, v728, v725);
       v735.type = v729;
       v735.size = v736;
       v735.buffer = v722;
       v735.normalized = v724;
       v735.offset = v725;
       v735.stride = v728;
      }
      if (v735.divisor !== v723) {
       v603.vertexAttribDivisorANGLE(v734, v723);
       v735.divisor = v723;
      }
     }
     else {
      if (v735.buffer) {
       v8.disableVertexAttribArray(v734);
       v735.buffer = null;
      }
      if (v735.x !== v731 || v735.y !== v732 || v735.z !== v733 || v735.w !== v730) {
       v8.vertexAttrib4f(v734, v731, v732, v733, v730);
       v735.x = v731;
       v735.y = v732;
       v735.z = v733;
       v735.w = v730;
      }
     }
     v737 = $42.call(this, v2, v605, v604);
     v738 = false;
     v739 = null;
     v740 = 0;
     v741 = false;
     v742 = 0;
     v743 = 0;
     v744 = 1;
     v745 = 0;
     v746 = 5126;
     v747 = 0;
     v748 = 0;
     v749 = 0;
     v750 = 0;
     if (v9(v737)) {
      v738 = true;
      v739 = v1.createStream(34962, v737);
      v746 = v739.dtype;
     }
     else {
      v739 = v1.getBuffer(v737);
      if (v739) {
       v746 = v739.dtype;
      }
      else if ('constant' in v737) {
       v744 = 2;
       if (typeof v737.constant === 'number') {
        v748 = v737.constant;
        v749 = v750 = v747 = 0;
       }
       else {
        v748 = v737.constant.length > 0 ? v737.constant[0] : 0;
        v749 = v737.constant.length > 1 ? v737.constant[1] : 0;
        v750 = v737.constant.length > 2 ? v737.constant[2] : 0;
        v747 = v737.constant.length > 3 ? v737.constant[3] : 0;
       }
      }
      else {
       if (v9(v737.buffer)) {
        v739 = v1.createStream(34962, v737.buffer);
       }
       else {
        v739 = v1.getBuffer(v737.buffer);
       }
       v746 = 'type' in v737 ? v43[v737.type] : v739.dtype;
       v741 = !!v737.normalized;
       v743 = v737.size | 0;
       v742 = v737.offset | 0;
       v745 = v737.stride | 0;
       v740 = v737.divisor | 0;
      }
     }
     v751 = borderColorId.location;
     v752 = v0[v751];
     if (v744 === 1) {
      if (!v752.buffer) {
       v8.enableVertexAttribArray(v751);
      }
      v753 = v743 || 4;
      if (v752.type !== v746 || v752.size !== v753 || v752.buffer !== v739 || v752.normalized !== v741 || v752.offset !== v742 || v752.stride !== v745) {
       v8.bindBuffer(34962, v739.buffer);
       v8.vertexAttribPointer(v751, v753, v746, v741, v745, v742);
       v752.type = v746;
       v752.size = v753;
       v752.buffer = v739;
       v752.normalized = v741;
       v752.offset = v742;
       v752.stride = v745;
      }
      if (v752.divisor !== v740) {
       v603.vertexAttribDivisorANGLE(v751, v740);
       v752.divisor = v740;
      }
     }
     else {
      if (v752.buffer) {
       v8.disableVertexAttribArray(v751);
       v752.buffer = null;
      }
      if (v752.x !== v748 || v752.y !== v749 || v752.z !== v750 || v752.w !== v747) {
       v8.vertexAttrib4f(v751, v748, v749, v750, v747);
       v752.x = v748;
       v752.y = v749;
       v752.z = v750;
       v752.w = v747;
      }
     }
     v754 = $43.call(this, v2, v605, v604);
     v755 = false;
     v756 = null;
     v757 = 0;
     v758 = false;
     v759 = 0;
     v760 = 0;
     v761 = 1;
     v762 = 0;
     v763 = 5126;
     v764 = 0;
     v765 = 0;
     v766 = 0;
     v767 = 0;
     if (v9(v754)) {
      v755 = true;
      v756 = v1.createStream(34962, v754);
      v763 = v756.dtype;
     }
     else {
      v756 = v1.getBuffer(v754);
      if (v756) {
       v763 = v756.dtype;
      }
      else if ('constant' in v754) {
       v761 = 2;
       if (typeof v754.constant === 'number') {
        v765 = v754.constant;
        v766 = v767 = v764 = 0;
       }
       else {
        v765 = v754.constant.length > 0 ? v754.constant[0] : 0;
        v766 = v754.constant.length > 1 ? v754.constant[1] : 0;
        v767 = v754.constant.length > 2 ? v754.constant[2] : 0;
        v764 = v754.constant.length > 3 ? v754.constant[3] : 0;
       }
      }
      else {
       if (v9(v754.buffer)) {
        v756 = v1.createStream(34962, v754.buffer);
       }
       else {
        v756 = v1.getBuffer(v754.buffer);
       }
       v763 = 'type' in v754 ? v43[v754.type] : v756.dtype;
       v758 = !!v754.normalized;
       v760 = v754.size | 0;
       v759 = v754.offset | 0;
       v762 = v754.stride | 0;
       v757 = v754.divisor | 0;
      }
     }
     v768 = isActive.location;
     v769 = v0[v768];
     if (v761 === 1) {
      if (!v769.buffer) {
       v8.enableVertexAttribArray(v768);
      }
      v770 = v760 || 1;
      if (v769.type !== v763 || v769.size !== v770 || v769.buffer !== v756 || v769.normalized !== v758 || v769.offset !== v759 || v769.stride !== v762) {
       v8.bindBuffer(34962, v756.buffer);
       v8.vertexAttribPointer(v768, v770, v763, v758, v762, v759);
       v769.type = v763;
       v769.size = v770;
       v769.buffer = v756;
       v769.normalized = v758;
       v769.offset = v759;
       v769.stride = v762;
      }
      if (v769.divisor !== v757) {
       v603.vertexAttribDivisorANGLE(v768, v757);
       v769.divisor = v757;
      }
     }
     else {
      if (v769.buffer) {
       v8.disableVertexAttribArray(v768);
       v769.buffer = null;
      }
      if (v769.x !== v765 || v769.y !== v766 || v769.z !== v767 || v769.w !== v764) {
       v8.vertexAttrib4f(v768, v765, v766, v767, v764);
       v769.x = v765;
       v769.y = v766;
       v769.z = v767;
       v769.w = v764;
      }
     }
     v771 = v2['pixelRatio'];
     if (!v604 || v772 !== v771) {
      v772 = v771;
      v8.uniform1f(pixelRatio.location, v771);
     }
     v773 = $45.call(this, v2, v605, v604);
     v774 = v773[0];
     v776 = v773[1];
     if (!v604 || v775 !== v774 || v777 !== v776) {
      v775 = v774;
      v777 = v776;
      v8.uniform2f(paletteSize.location, v774, v776);
     }
     v778 = v605['scale'];
     v779 = v778[0];
     v781 = v778[1];
     if (!v604 || v780 !== v779 || v782 !== v781) {
      v780 = v779;
      v782 = v781;
      v8.uniform2f(scale.location, v779, v781);
     }
     v783 = v605['scaleFract'];
     v784 = v783[0];
     v786 = v783[1];
     if (!v604 || v785 !== v784 || v787 !== v786) {
      v785 = v784;
      v787 = v786;
      v8.uniform2f(scaleFract.location, v784, v786);
     }
     v788 = v605['translate'];
     v789 = v788[0];
     v791 = v788[1];
     if (!v604 || v790 !== v789 || v792 !== v791) {
      v790 = v789;
      v792 = v791;
      v8.uniform2f(translate.location, v789, v791);
     }
     v793 = v605['translateFract'];
     v794 = v793[0];
     v796 = v793[1];
     if (!v604 || v795 !== v794 || v797 !== v796) {
      v795 = v794;
      v797 = v796;
      v8.uniform2f(translateFract.location, v794, v796);
     }
     v798 = v605['opacity'];
     if (!v604 || v799 !== v798) {
      v799 = v798;
      v8.uniform1f(opacity.location, v798);
     }
     v800 = v605['elements'];
     v801 = null;
     v802 = v9(v800);
     if (v802) {
      v801 = v5.createStream(v800);
     }
     else {
      v801 = v5.getElements(v800);
     }
     if (v801) v8.bindBuffer(34963, v801.buffer.buffer);
     v803 = v605['offset'];
     v804 = v605['count'];
     if (v804) {
      if (v805 > 0) {
       if (v801) {
        v603.drawElementsInstancedANGLE(0, v804, v801.type, v803 << ((v801.type - 5121) >> 1), v805);
       }
       else {
        v603.drawArraysInstancedANGLE(0, v803, v804, v805);
       }
      }
      else if (v805 < 0) {
       if (v801) {
        v8.drawElements(0, v804, v801.type, v803 << ((v801.type - 5121) >> 1));
       }
       else {
        v8.drawArrays(0, v803, v804);
       }
      }
      v2.viewportWidth = v611;
      v2.viewportHeight = v612;
      if (v619) {
       v1.destroyStream(v620);
      }
      if (v636) {
       v1.destroyStream(v637);
      }
      if (v653) {
       v1.destroyStream(v654);
      }
      if (v670) {
       v1.destroyStream(v671);
      }
      if (v687) {
       v1.destroyStream(v688);
      }
      if (v704) {
       v1.destroyStream(v705);
      }
      if (v721) {
       v1.destroyStream(v722);
      }
      if (v738) {
       v1.destroyStream(v739);
      }
      if (v755) {
       v1.destroyStream(v756);
      }
      if (v802) {
       v5.destroyStream(v801);
      }
     }
    }
    $44.unbind();
    v3.dirty = true;
    v15.setVAO(null);
   }
   , 'draw': function (a0) {
    var v47, v48, v83, v84, v85, v86, v87, v88, v89, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153, v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177, v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195, v196, v197, v198, v199, v200, v201, v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213, v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225, v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267, v268, v269, v270, v271;
    v47 = v6.angle_instanced_arrays;
    v48 = v7.next;
    if (v48 !== v7.cur) {
     if (v48) {
      v8.bindFramebuffer(36160, v48.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v48;
    }
    if (v3.dirty) {
     var v49, v50, v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82;
     v49 = v10.dither;
     if (v49 !== v3.dither) {
      if (v49) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v49;
     }
     v50 = v18[0];
     v51 = v18[1];
     if (v50 !== v19[0] || v51 !== v19[1]) {
      v8.blendEquationSeparate(v50, v51);
      v19[0] = v50;
      v19[1] = v51;
     }
     v52 = v10.depth_func;
     if (v52 !== v3.depth_func) {
      v8.depthFunc(v52);
      v3.depth_func = v52;
     }
     v53 = v24[0];
     v54 = v24[1];
     if (v53 !== v25[0] || v54 !== v25[1]) {
      v8.depthRange(v53, v54);
      v25[0] = v53;
      v25[1] = v54;
     }
     v55 = v10.depth_mask;
     if (v55 !== v3.depth_mask) {
      v8.depthMask(v55);
      v3.depth_mask = v55;
     }
     v56 = v22[0];
     v57 = v22[1];
     v58 = v22[2];
     v59 = v22[3];
     if (v56 !== v23[0] || v57 !== v23[1] || v58 !== v23[2] || v59 !== v23[3]) {
      v8.colorMask(v56, v57, v58, v59);
      v23[0] = v56;
      v23[1] = v57;
      v23[2] = v58;
      v23[3] = v59;
     }
     v60 = v10.cull_enable;
     if (v60 !== v3.cull_enable) {
      if (v60) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v60;
     }
     v61 = v10.cull_face;
     if (v61 !== v3.cull_face) {
      v8.cullFace(v61);
      v3.cull_face = v61;
     }
     v62 = v10.frontFace;
     if (v62 !== v3.frontFace) {
      v8.frontFace(v62);
      v3.frontFace = v62;
     }
     v63 = v10.lineWidth;
     if (v63 !== v3.lineWidth) {
      v8.lineWidth(v63);
      v3.lineWidth = v63;
     }
     v64 = v10.polygonOffset_enable;
     if (v64 !== v3.polygonOffset_enable) {
      if (v64) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v64;
     }
     v65 = v26[0];
     v66 = v26[1];
     if (v65 !== v27[0] || v66 !== v27[1]) {
      v8.polygonOffset(v65, v66);
      v27[0] = v65;
      v27[1] = v66;
     }
     v67 = v10.sample_alpha;
     if (v67 !== v3.sample_alpha) {
      if (v67) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v67;
     }
     v68 = v10.sample_enable;
     if (v68 !== v3.sample_enable) {
      if (v68) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v68;
     }
     v69 = v28[0];
     v70 = v28[1];
     if (v69 !== v29[0] || v70 !== v29[1]) {
      v8.sampleCoverage(v69, v70);
      v29[0] = v69;
      v29[1] = v70;
     }
     v71 = v10.stencil_mask;
     if (v71 !== v3.stencil_mask) {
      v8.stencilMask(v71);
      v3.stencil_mask = v71;
     }
     v72 = v32[0];
     v73 = v32[1];
     v74 = v32[2];
     if (v72 !== v33[0] || v73 !== v33[1] || v74 !== v33[2]) {
      v8.stencilFunc(v72, v73, v74);
      v33[0] = v72;
      v33[1] = v73;
      v33[2] = v74;
     }
     v75 = v36[0];
     v76 = v36[1];
     v77 = v36[2];
     v78 = v36[3];
     if (v75 !== v37[0] || v76 !== v37[1] || v77 !== v37[2] || v78 !== v37[3]) {
      v8.stencilOpSeparate(v75, v76, v77, v78);
      v37[0] = v75;
      v37[1] = v76;
      v37[2] = v77;
      v37[3] = v78;
     }
     v79 = v34[0];
     v80 = v34[1];
     v81 = v34[2];
     v82 = v34[3];
     if (v79 !== v35[0] || v80 !== v35[1] || v81 !== v35[2] || v82 !== v35[3]) {
      v8.stencilOpSeparate(v79, v80, v81, v82);
      v35[0] = v79;
      v35[1] = v80;
      v35[2] = v81;
      v35[3] = v82;
     }
    }
    v83 = a0['viewport'];
    v84 = v83.x | 0;
    v85 = v83.y | 0;
    v86 = 'width' in v83 ? v83.width | 0 : (v2.framebufferWidth - v84);
    v87 = 'height' in v83 ? v83.height | 0 : (v2.framebufferHeight - v85);
    v88 = v2.viewportWidth;
    v2.viewportWidth = v86;
    v89 = v2.viewportHeight;
    v2.viewportHeight = v87;
    v8.viewport(v84, v85, v86, v87);
    v39[0] = v84;
    v39[1] = v85;
    v39[2] = v86;
    v39[3] = v87;
    v8.blendColor(0, 0, 0, 1);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 1;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v90 = a0['viewport'];
    v91 = v90.x | 0;
    v92 = v90.y | 0;
    v93 = 'width' in v90 ? v90.width | 0 : (v2.framebufferWidth - v91);
    v94 = 'height' in v90 ? v90.height | 0 : (v2.framebufferHeight - v92);
    v8.scissor(v91, v92, v93, v94);
    v31[0] = v91;
    v31[1] = v92;
    v31[2] = v93;
    v31[3] = v94;
    v8.enable(3089);
    v3.scissor_enable = true;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($2.program);
    v95 = v6.angle_instanced_arrays;
    v15.setVAO(null);
    v96 = $3.call(this, v2, a0, 0);
    v97 = false;
    v98 = null;
    v99 = 0;
    v100 = false;
    v101 = 0;
    v102 = 0;
    v103 = 1;
    v104 = 0;
    v105 = 5126;
    v106 = 0;
    v107 = 0;
    v108 = 0;
    v109 = 0;
    if (v9(v96)) {
     v97 = true;
     v98 = v1.createStream(34962, v96);
     v105 = v98.dtype;
    }
    else {
     v98 = v1.getBuffer(v96);
     if (v98) {
      v105 = v98.dtype;
     }
     else if ('constant' in v96) {
      v103 = 2;
      if (typeof v96.constant === 'number') {
       v107 = v96.constant;
       v108 = v109 = v106 = 0;
      }
      else {
       v107 = v96.constant.length > 0 ? v96.constant[0] : 0;
       v108 = v96.constant.length > 1 ? v96.constant[1] : 0;
       v109 = v96.constant.length > 2 ? v96.constant[2] : 0;
       v106 = v96.constant.length > 3 ? v96.constant[3] : 0;
      }
     }
     else {
      if (v9(v96.buffer)) {
       v98 = v1.createStream(34962, v96.buffer);
      }
      else {
       v98 = v1.getBuffer(v96.buffer);
      }
      v105 = 'type' in v96 ? v43[v96.type] : v98.dtype;
      v100 = !!v96.normalized;
      v102 = v96.size | 0;
      v101 = v96.offset | 0;
      v104 = v96.stride | 0;
      v99 = v96.divisor | 0;
     }
    }
    v110 = x.location;
    v111 = v0[v110];
    if (v103 === 1) {
     if (!v111.buffer) {
      v8.enableVertexAttribArray(v110);
     }
     v112 = v102 || 1;
     if (v111.type !== v105 || v111.size !== v112 || v111.buffer !== v98 || v111.normalized !== v100 || v111.offset !== v101 || v111.stride !== v104) {
      v8.bindBuffer(34962, v98.buffer);
      v8.vertexAttribPointer(v110, v112, v105, v100, v104, v101);
      v111.type = v105;
      v111.size = v112;
      v111.buffer = v98;
      v111.normalized = v100;
      v111.offset = v101;
      v111.stride = v104;
     }
     if (v111.divisor !== v99) {
      v95.vertexAttribDivisorANGLE(v110, v99);
      v111.divisor = v99;
     }
    }
    else {
     if (v111.buffer) {
      v8.disableVertexAttribArray(v110);
      v111.buffer = null;
     }
     if (v111.x !== v107 || v111.y !== v108 || v111.z !== v109 || v111.w !== v106) {
      v8.vertexAttrib4f(v110, v107, v108, v109, v106);
      v111.x = v107;
      v111.y = v108;
      v111.z = v109;
      v111.w = v106;
     }
    }
    v113 = $4.call(this, v2, a0, 0);
    v114 = false;
    v115 = null;
    v116 = 0;
    v117 = false;
    v118 = 0;
    v119 = 0;
    v120 = 1;
    v121 = 0;
    v122 = 5126;
    v123 = 0;
    v124 = 0;
    v125 = 0;
    v126 = 0;
    if (v9(v113)) {
     v114 = true;
     v115 = v1.createStream(34962, v113);
     v122 = v115.dtype;
    }
    else {
     v115 = v1.getBuffer(v113);
     if (v115) {
      v122 = v115.dtype;
     }
     else if ('constant' in v113) {
      v120 = 2;
      if (typeof v113.constant === 'number') {
       v124 = v113.constant;
       v125 = v126 = v123 = 0;
      }
      else {
       v124 = v113.constant.length > 0 ? v113.constant[0] : 0;
       v125 = v113.constant.length > 1 ? v113.constant[1] : 0;
       v126 = v113.constant.length > 2 ? v113.constant[2] : 0;
       v123 = v113.constant.length > 3 ? v113.constant[3] : 0;
      }
     }
     else {
      if (v9(v113.buffer)) {
       v115 = v1.createStream(34962, v113.buffer);
      }
      else {
       v115 = v1.getBuffer(v113.buffer);
      }
      v122 = 'type' in v113 ? v43[v113.type] : v115.dtype;
      v117 = !!v113.normalized;
      v119 = v113.size | 0;
      v118 = v113.offset | 0;
      v121 = v113.stride | 0;
      v116 = v113.divisor | 0;
     }
    }
    v127 = y.location;
    v128 = v0[v127];
    if (v120 === 1) {
     if (!v128.buffer) {
      v8.enableVertexAttribArray(v127);
     }
     v129 = v119 || 1;
     if (v128.type !== v122 || v128.size !== v129 || v128.buffer !== v115 || v128.normalized !== v117 || v128.offset !== v118 || v128.stride !== v121) {
      v8.bindBuffer(34962, v115.buffer);
      v8.vertexAttribPointer(v127, v129, v122, v117, v121, v118);
      v128.type = v122;
      v128.size = v129;
      v128.buffer = v115;
      v128.normalized = v117;
      v128.offset = v118;
      v128.stride = v121;
     }
     if (v128.divisor !== v116) {
      v95.vertexAttribDivisorANGLE(v127, v116);
      v128.divisor = v116;
     }
    }
    else {
     if (v128.buffer) {
      v8.disableVertexAttribArray(v127);
      v128.buffer = null;
     }
     if (v128.x !== v124 || v128.y !== v125 || v128.z !== v126 || v128.w !== v123) {
      v8.vertexAttrib4f(v127, v124, v125, v126, v123);
      v128.x = v124;
      v128.y = v125;
      v128.z = v126;
      v128.w = v123;
     }
    }
    v130 = $5.call(this, v2, a0, 0);
    v131 = false;
    v132 = null;
    v133 = 0;
    v134 = false;
    v135 = 0;
    v136 = 0;
    v137 = 1;
    v138 = 0;
    v139 = 5126;
    v140 = 0;
    v141 = 0;
    v142 = 0;
    v143 = 0;
    if (v9(v130)) {
     v131 = true;
     v132 = v1.createStream(34962, v130);
     v139 = v132.dtype;
    }
    else {
     v132 = v1.getBuffer(v130);
     if (v132) {
      v139 = v132.dtype;
     }
     else if ('constant' in v130) {
      v137 = 2;
      if (typeof v130.constant === 'number') {
       v141 = v130.constant;
       v142 = v143 = v140 = 0;
      }
      else {
       v141 = v130.constant.length > 0 ? v130.constant[0] : 0;
       v142 = v130.constant.length > 1 ? v130.constant[1] : 0;
       v143 = v130.constant.length > 2 ? v130.constant[2] : 0;
       v140 = v130.constant.length > 3 ? v130.constant[3] : 0;
      }
     }
     else {
      if (v9(v130.buffer)) {
       v132 = v1.createStream(34962, v130.buffer);
      }
      else {
       v132 = v1.getBuffer(v130.buffer);
      }
      v139 = 'type' in v130 ? v43[v130.type] : v132.dtype;
      v134 = !!v130.normalized;
      v136 = v130.size | 0;
      v135 = v130.offset | 0;
      v138 = v130.stride | 0;
      v133 = v130.divisor | 0;
     }
    }
    v144 = xFract.location;
    v145 = v0[v144];
    if (v137 === 1) {
     if (!v145.buffer) {
      v8.enableVertexAttribArray(v144);
     }
     v146 = v136 || 1;
     if (v145.type !== v139 || v145.size !== v146 || v145.buffer !== v132 || v145.normalized !== v134 || v145.offset !== v135 || v145.stride !== v138) {
      v8.bindBuffer(34962, v132.buffer);
      v8.vertexAttribPointer(v144, v146, v139, v134, v138, v135);
      v145.type = v139;
      v145.size = v146;
      v145.buffer = v132;
      v145.normalized = v134;
      v145.offset = v135;
      v145.stride = v138;
     }
     if (v145.divisor !== v133) {
      v95.vertexAttribDivisorANGLE(v144, v133);
      v145.divisor = v133;
     }
    }
    else {
     if (v145.buffer) {
      v8.disableVertexAttribArray(v144);
      v145.buffer = null;
     }
     if (v145.x !== v141 || v145.y !== v142 || v145.z !== v143 || v145.w !== v140) {
      v8.vertexAttrib4f(v144, v141, v142, v143, v140);
      v145.x = v141;
      v145.y = v142;
      v145.z = v143;
      v145.w = v140;
     }
    }
    v147 = $6.call(this, v2, a0, 0);
    v148 = false;
    v149 = null;
    v150 = 0;
    v151 = false;
    v152 = 0;
    v153 = 0;
    v154 = 1;
    v155 = 0;
    v156 = 5126;
    v157 = 0;
    v158 = 0;
    v159 = 0;
    v160 = 0;
    if (v9(v147)) {
     v148 = true;
     v149 = v1.createStream(34962, v147);
     v156 = v149.dtype;
    }
    else {
     v149 = v1.getBuffer(v147);
     if (v149) {
      v156 = v149.dtype;
     }
     else if ('constant' in v147) {
      v154 = 2;
      if (typeof v147.constant === 'number') {
       v158 = v147.constant;
       v159 = v160 = v157 = 0;
      }
      else {
       v158 = v147.constant.length > 0 ? v147.constant[0] : 0;
       v159 = v147.constant.length > 1 ? v147.constant[1] : 0;
       v160 = v147.constant.length > 2 ? v147.constant[2] : 0;
       v157 = v147.constant.length > 3 ? v147.constant[3] : 0;
      }
     }
     else {
      if (v9(v147.buffer)) {
       v149 = v1.createStream(34962, v147.buffer);
      }
      else {
       v149 = v1.getBuffer(v147.buffer);
      }
      v156 = 'type' in v147 ? v43[v147.type] : v149.dtype;
      v151 = !!v147.normalized;
      v153 = v147.size | 0;
      v152 = v147.offset | 0;
      v155 = v147.stride | 0;
      v150 = v147.divisor | 0;
     }
    }
    v161 = yFract.location;
    v162 = v0[v161];
    if (v154 === 1) {
     if (!v162.buffer) {
      v8.enableVertexAttribArray(v161);
     }
     v163 = v153 || 1;
     if (v162.type !== v156 || v162.size !== v163 || v162.buffer !== v149 || v162.normalized !== v151 || v162.offset !== v152 || v162.stride !== v155) {
      v8.bindBuffer(34962, v149.buffer);
      v8.vertexAttribPointer(v161, v163, v156, v151, v155, v152);
      v162.type = v156;
      v162.size = v163;
      v162.buffer = v149;
      v162.normalized = v151;
      v162.offset = v152;
      v162.stride = v155;
     }
     if (v162.divisor !== v150) {
      v95.vertexAttribDivisorANGLE(v161, v150);
      v162.divisor = v150;
     }
    }
    else {
     if (v162.buffer) {
      v8.disableVertexAttribArray(v161);
      v162.buffer = null;
     }
     if (v162.x !== v158 || v162.y !== v159 || v162.z !== v160 || v162.w !== v157) {
      v8.vertexAttrib4f(v161, v158, v159, v160, v157);
      v162.x = v158;
      v162.y = v159;
      v162.z = v160;
      v162.w = v157;
     }
    }
    v164 = $7.call(this, v2, a0, 0);
    v165 = false;
    v166 = null;
    v167 = 0;
    v168 = false;
    v169 = 0;
    v170 = 0;
    v171 = 1;
    v172 = 0;
    v173 = 5126;
    v174 = 0;
    v175 = 0;
    v176 = 0;
    v177 = 0;
    if (v9(v164)) {
     v165 = true;
     v166 = v1.createStream(34962, v164);
     v173 = v166.dtype;
    }
    else {
     v166 = v1.getBuffer(v164);
     if (v166) {
      v173 = v166.dtype;
     }
     else if ('constant' in v164) {
      v171 = 2;
      if (typeof v164.constant === 'number') {
       v175 = v164.constant;
       v176 = v177 = v174 = 0;
      }
      else {
       v175 = v164.constant.length > 0 ? v164.constant[0] : 0;
       v176 = v164.constant.length > 1 ? v164.constant[1] : 0;
       v177 = v164.constant.length > 2 ? v164.constant[2] : 0;
       v174 = v164.constant.length > 3 ? v164.constant[3] : 0;
      }
     }
     else {
      if (v9(v164.buffer)) {
       v166 = v1.createStream(34962, v164.buffer);
      }
      else {
       v166 = v1.getBuffer(v164.buffer);
      }
      v173 = 'type' in v164 ? v43[v164.type] : v166.dtype;
      v168 = !!v164.normalized;
      v170 = v164.size | 0;
      v169 = v164.offset | 0;
      v172 = v164.stride | 0;
      v167 = v164.divisor | 0;
     }
    }
    v178 = size.location;
    v179 = v0[v178];
    if (v171 === 1) {
     if (!v179.buffer) {
      v8.enableVertexAttribArray(v178);
     }
     v180 = v170 || 1;
     if (v179.type !== v173 || v179.size !== v180 || v179.buffer !== v166 || v179.normalized !== v168 || v179.offset !== v169 || v179.stride !== v172) {
      v8.bindBuffer(34962, v166.buffer);
      v8.vertexAttribPointer(v178, v180, v173, v168, v172, v169);
      v179.type = v173;
      v179.size = v180;
      v179.buffer = v166;
      v179.normalized = v168;
      v179.offset = v169;
      v179.stride = v172;
     }
     if (v179.divisor !== v167) {
      v95.vertexAttribDivisorANGLE(v178, v167);
      v179.divisor = v167;
     }
    }
    else {
     if (v179.buffer) {
      v8.disableVertexAttribArray(v178);
      v179.buffer = null;
     }
     if (v179.x !== v175 || v179.y !== v176 || v179.z !== v177 || v179.w !== v174) {
      v8.vertexAttrib4f(v178, v175, v176, v177, v174);
      v179.x = v175;
      v179.y = v176;
      v179.z = v177;
      v179.w = v174;
     }
    }
    v181 = $8.call(this, v2, a0, 0);
    v182 = false;
    v183 = null;
    v184 = 0;
    v185 = false;
    v186 = 0;
    v187 = 0;
    v188 = 1;
    v189 = 0;
    v190 = 5126;
    v191 = 0;
    v192 = 0;
    v193 = 0;
    v194 = 0;
    if (v9(v181)) {
     v182 = true;
     v183 = v1.createStream(34962, v181);
     v190 = v183.dtype;
    }
    else {
     v183 = v1.getBuffer(v181);
     if (v183) {
      v190 = v183.dtype;
     }
     else if ('constant' in v181) {
      v188 = 2;
      if (typeof v181.constant === 'number') {
       v192 = v181.constant;
       v193 = v194 = v191 = 0;
      }
      else {
       v192 = v181.constant.length > 0 ? v181.constant[0] : 0;
       v193 = v181.constant.length > 1 ? v181.constant[1] : 0;
       v194 = v181.constant.length > 2 ? v181.constant[2] : 0;
       v191 = v181.constant.length > 3 ? v181.constant[3] : 0;
      }
     }
     else {
      if (v9(v181.buffer)) {
       v183 = v1.createStream(34962, v181.buffer);
      }
      else {
       v183 = v1.getBuffer(v181.buffer);
      }
      v190 = 'type' in v181 ? v43[v181.type] : v183.dtype;
      v185 = !!v181.normalized;
      v187 = v181.size | 0;
      v186 = v181.offset | 0;
      v189 = v181.stride | 0;
      v184 = v181.divisor | 0;
     }
    }
    v195 = borderSize.location;
    v196 = v0[v195];
    if (v188 === 1) {
     if (!v196.buffer) {
      v8.enableVertexAttribArray(v195);
     }
     v197 = v187 || 1;
     if (v196.type !== v190 || v196.size !== v197 || v196.buffer !== v183 || v196.normalized !== v185 || v196.offset !== v186 || v196.stride !== v189) {
      v8.bindBuffer(34962, v183.buffer);
      v8.vertexAttribPointer(v195, v197, v190, v185, v189, v186);
      v196.type = v190;
      v196.size = v197;
      v196.buffer = v183;
      v196.normalized = v185;
      v196.offset = v186;
      v196.stride = v189;
     }
     if (v196.divisor !== v184) {
      v95.vertexAttribDivisorANGLE(v195, v184);
      v196.divisor = v184;
     }
    }
    else {
     if (v196.buffer) {
      v8.disableVertexAttribArray(v195);
      v196.buffer = null;
     }
     if (v196.x !== v192 || v196.y !== v193 || v196.z !== v194 || v196.w !== v191) {
      v8.vertexAttrib4f(v195, v192, v193, v194, v191);
      v196.x = v192;
      v196.y = v193;
      v196.z = v194;
      v196.w = v191;
     }
    }
    v198 = $9.call(this, v2, a0, 0);
    v199 = false;
    v200 = null;
    v201 = 0;
    v202 = false;
    v203 = 0;
    v204 = 0;
    v205 = 1;
    v206 = 0;
    v207 = 5126;
    v208 = 0;
    v209 = 0;
    v210 = 0;
    v211 = 0;
    if (v9(v198)) {
     v199 = true;
     v200 = v1.createStream(34962, v198);
     v207 = v200.dtype;
    }
    else {
     v200 = v1.getBuffer(v198);
     if (v200) {
      v207 = v200.dtype;
     }
     else if ('constant' in v198) {
      v205 = 2;
      if (typeof v198.constant === 'number') {
       v209 = v198.constant;
       v210 = v211 = v208 = 0;
      }
      else {
       v209 = v198.constant.length > 0 ? v198.constant[0] : 0;
       v210 = v198.constant.length > 1 ? v198.constant[1] : 0;
       v211 = v198.constant.length > 2 ? v198.constant[2] : 0;
       v208 = v198.constant.length > 3 ? v198.constant[3] : 0;
      }
     }
     else {
      if (v9(v198.buffer)) {
       v200 = v1.createStream(34962, v198.buffer);
      }
      else {
       v200 = v1.getBuffer(v198.buffer);
      }
      v207 = 'type' in v198 ? v43[v198.type] : v200.dtype;
      v202 = !!v198.normalized;
      v204 = v198.size | 0;
      v203 = v198.offset | 0;
      v206 = v198.stride | 0;
      v201 = v198.divisor | 0;
     }
    }
    v212 = colorId.location;
    v213 = v0[v212];
    if (v205 === 1) {
     if (!v213.buffer) {
      v8.enableVertexAttribArray(v212);
     }
     v214 = v204 || 4;
     if (v213.type !== v207 || v213.size !== v214 || v213.buffer !== v200 || v213.normalized !== v202 || v213.offset !== v203 || v213.stride !== v206) {
      v8.bindBuffer(34962, v200.buffer);
      v8.vertexAttribPointer(v212, v214, v207, v202, v206, v203);
      v213.type = v207;
      v213.size = v214;
      v213.buffer = v200;
      v213.normalized = v202;
      v213.offset = v203;
      v213.stride = v206;
     }
     if (v213.divisor !== v201) {
      v95.vertexAttribDivisorANGLE(v212, v201);
      v213.divisor = v201;
     }
    }
    else {
     if (v213.buffer) {
      v8.disableVertexAttribArray(v212);
      v213.buffer = null;
     }
     if (v213.x !== v209 || v213.y !== v210 || v213.z !== v211 || v213.w !== v208) {
      v8.vertexAttrib4f(v212, v209, v210, v211, v208);
      v213.x = v209;
      v213.y = v210;
      v213.z = v211;
      v213.w = v208;
     }
    }
    v215 = $10.call(this, v2, a0, 0);
    v216 = false;
    v217 = null;
    v218 = 0;
    v219 = false;
    v220 = 0;
    v221 = 0;
    v222 = 1;
    v223 = 0;
    v224 = 5126;
    v225 = 0;
    v226 = 0;
    v227 = 0;
    v228 = 0;
    if (v9(v215)) {
     v216 = true;
     v217 = v1.createStream(34962, v215);
     v224 = v217.dtype;
    }
    else {
     v217 = v1.getBuffer(v215);
     if (v217) {
      v224 = v217.dtype;
     }
     else if ('constant' in v215) {
      v222 = 2;
      if (typeof v215.constant === 'number') {
       v226 = v215.constant;
       v227 = v228 = v225 = 0;
      }
      else {
       v226 = v215.constant.length > 0 ? v215.constant[0] : 0;
       v227 = v215.constant.length > 1 ? v215.constant[1] : 0;
       v228 = v215.constant.length > 2 ? v215.constant[2] : 0;
       v225 = v215.constant.length > 3 ? v215.constant[3] : 0;
      }
     }
     else {
      if (v9(v215.buffer)) {
       v217 = v1.createStream(34962, v215.buffer);
      }
      else {
       v217 = v1.getBuffer(v215.buffer);
      }
      v224 = 'type' in v215 ? v43[v215.type] : v217.dtype;
      v219 = !!v215.normalized;
      v221 = v215.size | 0;
      v220 = v215.offset | 0;
      v223 = v215.stride | 0;
      v218 = v215.divisor | 0;
     }
    }
    v229 = borderColorId.location;
    v230 = v0[v229];
    if (v222 === 1) {
     if (!v230.buffer) {
      v8.enableVertexAttribArray(v229);
     }
     v231 = v221 || 4;
     if (v230.type !== v224 || v230.size !== v231 || v230.buffer !== v217 || v230.normalized !== v219 || v230.offset !== v220 || v230.stride !== v223) {
      v8.bindBuffer(34962, v217.buffer);
      v8.vertexAttribPointer(v229, v231, v224, v219, v223, v220);
      v230.type = v224;
      v230.size = v231;
      v230.buffer = v217;
      v230.normalized = v219;
      v230.offset = v220;
      v230.stride = v223;
     }
     if (v230.divisor !== v218) {
      v95.vertexAttribDivisorANGLE(v229, v218);
      v230.divisor = v218;
     }
    }
    else {
     if (v230.buffer) {
      v8.disableVertexAttribArray(v229);
      v230.buffer = null;
     }
     if (v230.x !== v226 || v230.y !== v227 || v230.z !== v228 || v230.w !== v225) {
      v8.vertexAttrib4f(v229, v226, v227, v228, v225);
      v230.x = v226;
      v230.y = v227;
      v230.z = v228;
      v230.w = v225;
     }
    }
    v232 = $11.call(this, v2, a0, 0);
    v233 = false;
    v234 = null;
    v235 = 0;
    v236 = false;
    v237 = 0;
    v238 = 0;
    v239 = 1;
    v240 = 0;
    v241 = 5126;
    v242 = 0;
    v243 = 0;
    v244 = 0;
    v245 = 0;
    if (v9(v232)) {
     v233 = true;
     v234 = v1.createStream(34962, v232);
     v241 = v234.dtype;
    }
    else {
     v234 = v1.getBuffer(v232);
     if (v234) {
      v241 = v234.dtype;
     }
     else if ('constant' in v232) {
      v239 = 2;
      if (typeof v232.constant === 'number') {
       v243 = v232.constant;
       v244 = v245 = v242 = 0;
      }
      else {
       v243 = v232.constant.length > 0 ? v232.constant[0] : 0;
       v244 = v232.constant.length > 1 ? v232.constant[1] : 0;
       v245 = v232.constant.length > 2 ? v232.constant[2] : 0;
       v242 = v232.constant.length > 3 ? v232.constant[3] : 0;
      }
     }
     else {
      if (v9(v232.buffer)) {
       v234 = v1.createStream(34962, v232.buffer);
      }
      else {
       v234 = v1.getBuffer(v232.buffer);
      }
      v241 = 'type' in v232 ? v43[v232.type] : v234.dtype;
      v236 = !!v232.normalized;
      v238 = v232.size | 0;
      v237 = v232.offset | 0;
      v240 = v232.stride | 0;
      v235 = v232.divisor | 0;
     }
    }
    v246 = isActive.location;
    v247 = v0[v246];
    if (v239 === 1) {
     if (!v247.buffer) {
      v8.enableVertexAttribArray(v246);
     }
     v248 = v238 || 1;
     if (v247.type !== v241 || v247.size !== v248 || v247.buffer !== v234 || v247.normalized !== v236 || v247.offset !== v237 || v247.stride !== v240) {
      v8.bindBuffer(34962, v234.buffer);
      v8.vertexAttribPointer(v246, v248, v241, v236, v240, v237);
      v247.type = v241;
      v247.size = v248;
      v247.buffer = v234;
      v247.normalized = v236;
      v247.offset = v237;
      v247.stride = v240;
     }
     if (v247.divisor !== v235) {
      v95.vertexAttribDivisorANGLE(v246, v235);
      v247.divisor = v235;
     }
    }
    else {
     if (v247.buffer) {
      v8.disableVertexAttribArray(v246);
      v247.buffer = null;
     }
     if (v247.x !== v243 || v247.y !== v244 || v247.z !== v245 || v247.w !== v242) {
      v8.vertexAttrib4f(v246, v243, v244, v245, v242);
      v247.x = v243;
      v247.y = v244;
      v247.z = v245;
      v247.w = v242;
     }
    }
    v8.uniform1i(constPointSize.location, false);
    v249 = v2['pixelRatio'];
    v8.uniform1f(pixelRatio.location, v249);
    v250 = $12.call(this, v2, a0, 0);
    v251 = v250[0];
    v252 = v250[1];
    v8.uniform2f(paletteSize.location, v251, v252);
    v253 = a0['scale'];
    v254 = v253[0];
    v255 = v253[1];
    v8.uniform2f(scale.location, v254, v255);
    v256 = a0['scaleFract'];
    v257 = v256[0];
    v258 = v256[1];
    v8.uniform2f(scaleFract.location, v257, v258);
    v259 = a0['translate'];
    v260 = v259[0];
    v261 = v259[1];
    v8.uniform2f(translate.location, v260, v261);
    v262 = a0['translateFract'];
    v263 = v262[0];
    v264 = v262[1];
    v8.uniform2f(translateFract.location, v263, v264);
    v265 = a0['opacity'];
    v8.uniform1f(opacity.location, v265);
    v8.uniform1i(paletteTexture.location, $13.bind());
    v266 = a0['elements'];
    v267 = null;
    v268 = v9(v266);
    if (v268) {
     v267 = v5.createStream(v266);
    }
    else {
     v267 = v5.getElements(v266);
    }
    if (v267) v8.bindBuffer(34963, v267.buffer.buffer);
    v269 = a0['offset'];
    v270 = a0['count'];
    if (v270) {
     v271 = v4.instances;
     if (v271 > 0) {
      if (v267) {
       v95.drawElementsInstancedANGLE(0, v270, v267.type, v269 << ((v267.type - 5121) >> 1), v271);
      }
      else {
       v95.drawArraysInstancedANGLE(0, v269, v270, v271);
      }
     }
     else if (v271 < 0) {
      if (v267) {
       v8.drawElements(0, v270, v267.type, v269 << ((v267.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(0, v269, v270);
      }
     }
     v3.dirty = true;
     v15.setVAO(null);
     v2.viewportWidth = v88;
     v2.viewportHeight = v89;
     if (v97) {
      v1.destroyStream(v98);
     }
     if (v114) {
      v1.destroyStream(v115);
     }
     if (v131) {
      v1.destroyStream(v132);
     }
     if (v148) {
      v1.destroyStream(v149);
     }
     if (v165) {
      v1.destroyStream(v166);
     }
     if (v182) {
      v1.destroyStream(v183);
     }
     if (v199) {
      v1.destroyStream(v200);
     }
     if (v216) {
      v1.destroyStream(v217);
     }
     if (v233) {
      v1.destroyStream(v234);
     }
     $13.unbind();
     if (v268) {
      v5.destroyStream(v267);
     }
    }
   }
   , 'scope': function (a0, a1, a2) {
    var v272, v273, v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301, v302, v303, v304, v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360, v361, v362, v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387, v388, v389, v390, v391, v392, v393, v394, v395, v396, v397, v398, v399, v400, v401, v402, v403, v404, v405, v406, v407, v408, v409, v410, v411, v412, v413, v414, v415, v416, v417, v418, v419, v420, v421, v422, v423, v424, v425, v426, v427, v428, v429, v430, v431, v432, v433, v434, v435, v436, v437, v438, v439, v440, v441, v442, v443, v444, v445, v446, v447, v448, v449, v450, v451, v452, v453, v454, v455, v456, v457, v458, v459, v460, v461, v462, v463, v464, v465, v466, v467, v468, v469, v470, v471, v472, v473, v474, v475, v476, v477, v478, v479, v480, v481, v482, v483, v484, v485, v486, v487, v488, v489, v490, v491, v492, v493, v494, v495, v496, v497, v498, v499, v500, v501, v502, v503, v504, v505, v506, v507, v508, v509, v510, v511, v512, v513, v514, v515, v516, v517, v518, v519, v520, v521, v522, v523, v524, v525, v526, v527, v528, v529, v530, v531, v532, v533, v534, v535, v536, v537, v538, v539, v540, v541, v542, v543, v544, v545, v546, v547, v548, v549, v550, v551, v552, v553, v554, v555, v556, v557, v558, v559, v560, v561, v562, v563, v564, v565, v566;
    v272 = a0['viewport'];
    v273 = v272.x | 0;
    v274 = v272.y | 0;
    v275 = 'width' in v272 ? v272.width | 0 : (v2.framebufferWidth - v273);
    v276 = 'height' in v272 ? v272.height | 0 : (v2.framebufferHeight - v274);
    v277 = v2.viewportWidth;
    v2.viewportWidth = v275;
    v278 = v2.viewportHeight;
    v2.viewportHeight = v276;
    v279 = v38[0];
    v38[0] = v273;
    v280 = v38[1];
    v38[1] = v274;
    v281 = v38[2];
    v38[2] = v275;
    v282 = v38[3];
    v38[3] = v276;
    v283 = v16[0];
    v16[0] = 0;
    v284 = v16[1];
    v16[1] = 0;
    v285 = v16[2];
    v16[2] = 0;
    v286 = v16[3];
    v16[3] = 1;
    v287 = v10.blend_enable;
    v10.blend_enable = true;
    v288 = v20[0];
    v20[0] = 770;
    v289 = v20[1];
    v20[1] = 771;
    v290 = v20[2];
    v20[2] = 773;
    v291 = v20[3];
    v20[3] = 1;
    v292 = v10.depth_enable;
    v10.depth_enable = false;
    v293 = a0['viewport'];
    v294 = v293.x | 0;
    v295 = v293.y | 0;
    v296 = 'width' in v293 ? v293.width | 0 : (v2.framebufferWidth - v294);
    v297 = 'height' in v293 ? v293.height | 0 : (v2.framebufferHeight - v295);
    v298 = v30[0];
    v30[0] = v294;
    v299 = v30[1];
    v30[1] = v295;
    v300 = v30[2];
    v30[2] = v296;
    v301 = v30[3];
    v30[3] = v297;
    v302 = v10.scissor_enable;
    v10.scissor_enable = true;
    v303 = v10.stencil_enable;
    v10.stencil_enable = false;
    v304 = a0['elements'];
    v305 = null;
    v306 = v9(v304);
    if (v306) {
     v305 = v5.createStream(v304);
    }
    else {
     v305 = v5.getElements(v304);
    }
    v307 = v4.elements;
    v4.elements = v305;
    v308 = a0['offset'];
    v309 = v4.offset;
    v4.offset = v308;
    v310 = a0['count'];
    v311 = v4.count;
    v4.count = v310;
    v312 = v4.primitive;
    v4.primitive = 0;
    v313 = v14[45];
    v14[45] = false;
    v314 = a0['markerTexture'];
    v315 = v14[48];
    v14[48] = v314;
    v316 = a0['opacity'];
    v317 = v14[10];
    v14[10] = v316;
    v318 = $14.call(this, v2, a0, a2);
    v319 = v14[46];
    v14[46] = v318;
    v320 = v14[47];
    v14[47] = $15;
    v321 = v2['pixelRatio'];
    v322 = v14[34];
    v14[34] = v321;
    v323 = a0['scale'];
    v324 = v14[6];
    v14[6] = v323;
    v325 = a0['scaleFract'];
    v326 = v14[7];
    v14[7] = v325;
    v327 = a0['translate'];
    v328 = v14[8];
    v14[8] = v327;
    v329 = a0['translateFract'];
    v330 = v14[9];
    v14[9] = v329;
    v331 = $16.call(this, v2, a0, a2);
    v332 = false;
    v333 = null;
    v334 = 0;
    v335 = false;
    v336 = 0;
    v337 = 0;
    v338 = 1;
    v339 = 0;
    v340 = 5126;
    v341 = 0;
    v342 = 0;
    v343 = 0;
    v344 = 0;
    if (v9(v331)) {
     v332 = true;
     v333 = v1.createStream(34962, v331);
     v340 = v333.dtype;
    }
    else {
     v333 = v1.getBuffer(v331);
     if (v333) {
      v340 = v333.dtype;
     }
     else if ('constant' in v331) {
      v338 = 2;
      if (typeof v331.constant === 'number') {
       v342 = v331.constant;
       v343 = v344 = v341 = 0;
      }
      else {
       v342 = v331.constant.length > 0 ? v331.constant[0] : 0;
       v343 = v331.constant.length > 1 ? v331.constant[1] : 0;
       v344 = v331.constant.length > 2 ? v331.constant[2] : 0;
       v341 = v331.constant.length > 3 ? v331.constant[3] : 0;
      }
     }
     else {
      if (v9(v331.buffer)) {
       v333 = v1.createStream(34962, v331.buffer);
      }
      else {
       v333 = v1.getBuffer(v331.buffer);
      }
      v340 = 'type' in v331 ? v43[v331.type] : v333.dtype;
      v335 = !!v331.normalized;
      v337 = v331.size | 0;
      v336 = v331.offset | 0;
      v339 = v331.stride | 0;
      v334 = v331.divisor | 0;
     }
    }
    v345 = $17.buffer;
    $17.buffer = v333;
    v346 = $17.divisor;
    $17.divisor = v334;
    v347 = $17.normalized;
    $17.normalized = v335;
    v348 = $17.offset;
    $17.offset = v336;
    v349 = $17.size;
    $17.size = v337;
    v350 = $17.state;
    $17.state = v338;
    v351 = $17.stride;
    $17.stride = v339;
    v352 = $17.type;
    $17.type = v340;
    v353 = $17.w;
    $17.w = v341;
    v354 = $17.x;
    $17.x = v342;
    v355 = $17.y;
    $17.y = v343;
    v356 = $17.z;
    $17.z = v344;
    v357 = $18.call(this, v2, a0, a2);
    v358 = false;
    v359 = null;
    v360 = 0;
    v361 = false;
    v362 = 0;
    v363 = 0;
    v364 = 1;
    v365 = 0;
    v366 = 5126;
    v367 = 0;
    v368 = 0;
    v369 = 0;
    v370 = 0;
    if (v9(v357)) {
     v358 = true;
     v359 = v1.createStream(34962, v357);
     v366 = v359.dtype;
    }
    else {
     v359 = v1.getBuffer(v357);
     if (v359) {
      v366 = v359.dtype;
     }
     else if ('constant' in v357) {
      v364 = 2;
      if (typeof v357.constant === 'number') {
       v368 = v357.constant;
       v369 = v370 = v367 = 0;
      }
      else {
       v368 = v357.constant.length > 0 ? v357.constant[0] : 0;
       v369 = v357.constant.length > 1 ? v357.constant[1] : 0;
       v370 = v357.constant.length > 2 ? v357.constant[2] : 0;
       v367 = v357.constant.length > 3 ? v357.constant[3] : 0;
      }
     }
     else {
      if (v9(v357.buffer)) {
       v359 = v1.createStream(34962, v357.buffer);
      }
      else {
       v359 = v1.getBuffer(v357.buffer);
      }
      v366 = 'type' in v357 ? v43[v357.type] : v359.dtype;
      v361 = !!v357.normalized;
      v363 = v357.size | 0;
      v362 = v357.offset | 0;
      v365 = v357.stride | 0;
      v360 = v357.divisor | 0;
     }
    }
    v371 = $19.buffer;
    $19.buffer = v359;
    v372 = $19.divisor;
    $19.divisor = v360;
    v373 = $19.normalized;
    $19.normalized = v361;
    v374 = $19.offset;
    $19.offset = v362;
    v375 = $19.size;
    $19.size = v363;
    v376 = $19.state;
    $19.state = v364;
    v377 = $19.stride;
    $19.stride = v365;
    v378 = $19.type;
    $19.type = v366;
    v379 = $19.w;
    $19.w = v367;
    v380 = $19.x;
    $19.x = v368;
    v381 = $19.y;
    $19.y = v369;
    v382 = $19.z;
    $19.z = v370;
    v383 = $20.call(this, v2, a0, a2);
    v384 = false;
    v385 = null;
    v386 = 0;
    v387 = false;
    v388 = 0;
    v389 = 0;
    v390 = 1;
    v391 = 0;
    v392 = 5126;
    v393 = 0;
    v394 = 0;
    v395 = 0;
    v396 = 0;
    if (v9(v383)) {
     v384 = true;
     v385 = v1.createStream(34962, v383);
     v392 = v385.dtype;
    }
    else {
     v385 = v1.getBuffer(v383);
     if (v385) {
      v392 = v385.dtype;
     }
     else if ('constant' in v383) {
      v390 = 2;
      if (typeof v383.constant === 'number') {
       v394 = v383.constant;
       v395 = v396 = v393 = 0;
      }
      else {
       v394 = v383.constant.length > 0 ? v383.constant[0] : 0;
       v395 = v383.constant.length > 1 ? v383.constant[1] : 0;
       v396 = v383.constant.length > 2 ? v383.constant[2] : 0;
       v393 = v383.constant.length > 3 ? v383.constant[3] : 0;
      }
     }
     else {
      if (v9(v383.buffer)) {
       v385 = v1.createStream(34962, v383.buffer);
      }
      else {
       v385 = v1.getBuffer(v383.buffer);
      }
      v392 = 'type' in v383 ? v43[v383.type] : v385.dtype;
      v387 = !!v383.normalized;
      v389 = v383.size | 0;
      v388 = v383.offset | 0;
      v391 = v383.stride | 0;
      v386 = v383.divisor | 0;
     }
    }
    v397 = $21.buffer;
    $21.buffer = v385;
    v398 = $21.divisor;
    $21.divisor = v386;
    v399 = $21.normalized;
    $21.normalized = v387;
    v400 = $21.offset;
    $21.offset = v388;
    v401 = $21.size;
    $21.size = v389;
    v402 = $21.state;
    $21.state = v390;
    v403 = $21.stride;
    $21.stride = v391;
    v404 = $21.type;
    $21.type = v392;
    v405 = $21.w;
    $21.w = v393;
    v406 = $21.x;
    $21.x = v394;
    v407 = $21.y;
    $21.y = v395;
    v408 = $21.z;
    $21.z = v396;
    v409 = $22.call(this, v2, a0, a2);
    v410 = false;
    v411 = null;
    v412 = 0;
    v413 = false;
    v414 = 0;
    v415 = 0;
    v416 = 1;
    v417 = 0;
    v418 = 5126;
    v419 = 0;
    v420 = 0;
    v421 = 0;
    v422 = 0;
    if (v9(v409)) {
     v410 = true;
     v411 = v1.createStream(34962, v409);
     v418 = v411.dtype;
    }
    else {
     v411 = v1.getBuffer(v409);
     if (v411) {
      v418 = v411.dtype;
     }
     else if ('constant' in v409) {
      v416 = 2;
      if (typeof v409.constant === 'number') {
       v420 = v409.constant;
       v421 = v422 = v419 = 0;
      }
      else {
       v420 = v409.constant.length > 0 ? v409.constant[0] : 0;
       v421 = v409.constant.length > 1 ? v409.constant[1] : 0;
       v422 = v409.constant.length > 2 ? v409.constant[2] : 0;
       v419 = v409.constant.length > 3 ? v409.constant[3] : 0;
      }
     }
     else {
      if (v9(v409.buffer)) {
       v411 = v1.createStream(34962, v409.buffer);
      }
      else {
       v411 = v1.getBuffer(v409.buffer);
      }
      v418 = 'type' in v409 ? v43[v409.type] : v411.dtype;
      v413 = !!v409.normalized;
      v415 = v409.size | 0;
      v414 = v409.offset | 0;
      v417 = v409.stride | 0;
      v412 = v409.divisor | 0;
     }
    }
    v423 = $23.buffer;
    $23.buffer = v411;
    v424 = $23.divisor;
    $23.divisor = v412;
    v425 = $23.normalized;
    $23.normalized = v413;
    v426 = $23.offset;
    $23.offset = v414;
    v427 = $23.size;
    $23.size = v415;
    v428 = $23.state;
    $23.state = v416;
    v429 = $23.stride;
    $23.stride = v417;
    v430 = $23.type;
    $23.type = v418;
    v431 = $23.w;
    $23.w = v419;
    v432 = $23.x;
    $23.x = v420;
    v433 = $23.y;
    $23.y = v421;
    v434 = $23.z;
    $23.z = v422;
    v435 = $24.call(this, v2, a0, a2);
    v436 = false;
    v437 = null;
    v438 = 0;
    v439 = false;
    v440 = 0;
    v441 = 0;
    v442 = 1;
    v443 = 0;
    v444 = 5126;
    v445 = 0;
    v446 = 0;
    v447 = 0;
    v448 = 0;
    if (v9(v435)) {
     v436 = true;
     v437 = v1.createStream(34962, v435);
     v444 = v437.dtype;
    }
    else {
     v437 = v1.getBuffer(v435);
     if (v437) {
      v444 = v437.dtype;
     }
     else if ('constant' in v435) {
      v442 = 2;
      if (typeof v435.constant === 'number') {
       v446 = v435.constant;
       v447 = v448 = v445 = 0;
      }
      else {
       v446 = v435.constant.length > 0 ? v435.constant[0] : 0;
       v447 = v435.constant.length > 1 ? v435.constant[1] : 0;
       v448 = v435.constant.length > 2 ? v435.constant[2] : 0;
       v445 = v435.constant.length > 3 ? v435.constant[3] : 0;
      }
     }
     else {
      if (v9(v435.buffer)) {
       v437 = v1.createStream(34962, v435.buffer);
      }
      else {
       v437 = v1.getBuffer(v435.buffer);
      }
      v444 = 'type' in v435 ? v43[v435.type] : v437.dtype;
      v439 = !!v435.normalized;
      v441 = v435.size | 0;
      v440 = v435.offset | 0;
      v443 = v435.stride | 0;
      v438 = v435.divisor | 0;
     }
    }
    v449 = $25.buffer;
    $25.buffer = v437;
    v450 = $25.divisor;
    $25.divisor = v438;
    v451 = $25.normalized;
    $25.normalized = v439;
    v452 = $25.offset;
    $25.offset = v440;
    v453 = $25.size;
    $25.size = v441;
    v454 = $25.state;
    $25.state = v442;
    v455 = $25.stride;
    $25.stride = v443;
    v456 = $25.type;
    $25.type = v444;
    v457 = $25.w;
    $25.w = v445;
    v458 = $25.x;
    $25.x = v446;
    v459 = $25.y;
    $25.y = v447;
    v460 = $25.z;
    $25.z = v448;
    v461 = $26.call(this, v2, a0, a2);
    v462 = false;
    v463 = null;
    v464 = 0;
    v465 = false;
    v466 = 0;
    v467 = 0;
    v468 = 1;
    v469 = 0;
    v470 = 5126;
    v471 = 0;
    v472 = 0;
    v473 = 0;
    v474 = 0;
    if (v9(v461)) {
     v462 = true;
     v463 = v1.createStream(34962, v461);
     v470 = v463.dtype;
    }
    else {
     v463 = v1.getBuffer(v461);
     if (v463) {
      v470 = v463.dtype;
     }
     else if ('constant' in v461) {
      v468 = 2;
      if (typeof v461.constant === 'number') {
       v472 = v461.constant;
       v473 = v474 = v471 = 0;
      }
      else {
       v472 = v461.constant.length > 0 ? v461.constant[0] : 0;
       v473 = v461.constant.length > 1 ? v461.constant[1] : 0;
       v474 = v461.constant.length > 2 ? v461.constant[2] : 0;
       v471 = v461.constant.length > 3 ? v461.constant[3] : 0;
      }
     }
     else {
      if (v9(v461.buffer)) {
       v463 = v1.createStream(34962, v461.buffer);
      }
      else {
       v463 = v1.getBuffer(v461.buffer);
      }
      v470 = 'type' in v461 ? v43[v461.type] : v463.dtype;
      v465 = !!v461.normalized;
      v467 = v461.size | 0;
      v466 = v461.offset | 0;
      v469 = v461.stride | 0;
      v464 = v461.divisor | 0;
     }
    }
    v475 = $27.buffer;
    $27.buffer = v463;
    v476 = $27.divisor;
    $27.divisor = v464;
    v477 = $27.normalized;
    $27.normalized = v465;
    v478 = $27.offset;
    $27.offset = v466;
    v479 = $27.size;
    $27.size = v467;
    v480 = $27.state;
    $27.state = v468;
    v481 = $27.stride;
    $27.stride = v469;
    v482 = $27.type;
    $27.type = v470;
    v483 = $27.w;
    $27.w = v471;
    v484 = $27.x;
    $27.x = v472;
    v485 = $27.y;
    $27.y = v473;
    v486 = $27.z;
    $27.z = v474;
    v487 = $28.call(this, v2, a0, a2);
    v488 = false;
    v489 = null;
    v490 = 0;
    v491 = false;
    v492 = 0;
    v493 = 0;
    v494 = 1;
    v495 = 0;
    v496 = 5126;
    v497 = 0;
    v498 = 0;
    v499 = 0;
    v500 = 0;
    if (v9(v487)) {
     v488 = true;
     v489 = v1.createStream(34962, v487);
     v496 = v489.dtype;
    }
    else {
     v489 = v1.getBuffer(v487);
     if (v489) {
      v496 = v489.dtype;
     }
     else if ('constant' in v487) {
      v494 = 2;
      if (typeof v487.constant === 'number') {
       v498 = v487.constant;
       v499 = v500 = v497 = 0;
      }
      else {
       v498 = v487.constant.length > 0 ? v487.constant[0] : 0;
       v499 = v487.constant.length > 1 ? v487.constant[1] : 0;
       v500 = v487.constant.length > 2 ? v487.constant[2] : 0;
       v497 = v487.constant.length > 3 ? v487.constant[3] : 0;
      }
     }
     else {
      if (v9(v487.buffer)) {
       v489 = v1.createStream(34962, v487.buffer);
      }
      else {
       v489 = v1.getBuffer(v487.buffer);
      }
      v496 = 'type' in v487 ? v43[v487.type] : v489.dtype;
      v491 = !!v487.normalized;
      v493 = v487.size | 0;
      v492 = v487.offset | 0;
      v495 = v487.stride | 0;
      v490 = v487.divisor | 0;
     }
    }
    v501 = $29.buffer;
    $29.buffer = v489;
    v502 = $29.divisor;
    $29.divisor = v490;
    v503 = $29.normalized;
    $29.normalized = v491;
    v504 = $29.offset;
    $29.offset = v492;
    v505 = $29.size;
    $29.size = v493;
    v506 = $29.state;
    $29.state = v494;
    v507 = $29.stride;
    $29.stride = v495;
    v508 = $29.type;
    $29.type = v496;
    v509 = $29.w;
    $29.w = v497;
    v510 = $29.x;
    $29.x = v498;
    v511 = $29.y;
    $29.y = v499;
    v512 = $29.z;
    $29.z = v500;
    v513 = $30.call(this, v2, a0, a2);
    v514 = false;
    v515 = null;
    v516 = 0;
    v517 = false;
    v518 = 0;
    v519 = 0;
    v520 = 1;
    v521 = 0;
    v522 = 5126;
    v523 = 0;
    v524 = 0;
    v525 = 0;
    v526 = 0;
    if (v9(v513)) {
     v514 = true;
     v515 = v1.createStream(34962, v513);
     v522 = v515.dtype;
    }
    else {
     v515 = v1.getBuffer(v513);
     if (v515) {
      v522 = v515.dtype;
     }
     else if ('constant' in v513) {
      v520 = 2;
      if (typeof v513.constant === 'number') {
       v524 = v513.constant;
       v525 = v526 = v523 = 0;
      }
      else {
       v524 = v513.constant.length > 0 ? v513.constant[0] : 0;
       v525 = v513.constant.length > 1 ? v513.constant[1] : 0;
       v526 = v513.constant.length > 2 ? v513.constant[2] : 0;
       v523 = v513.constant.length > 3 ? v513.constant[3] : 0;
      }
     }
     else {
      if (v9(v513.buffer)) {
       v515 = v1.createStream(34962, v513.buffer);
      }
      else {
       v515 = v1.getBuffer(v513.buffer);
      }
      v522 = 'type' in v513 ? v43[v513.type] : v515.dtype;
      v517 = !!v513.normalized;
      v519 = v513.size | 0;
      v518 = v513.offset | 0;
      v521 = v513.stride | 0;
      v516 = v513.divisor | 0;
     }
    }
    v527 = $31.buffer;
    $31.buffer = v515;
    v528 = $31.divisor;
    $31.divisor = v516;
    v529 = $31.normalized;
    $31.normalized = v517;
    v530 = $31.offset;
    $31.offset = v518;
    v531 = $31.size;
    $31.size = v519;
    v532 = $31.state;
    $31.state = v520;
    v533 = $31.stride;
    $31.stride = v521;
    v534 = $31.type;
    $31.type = v522;
    v535 = $31.w;
    $31.w = v523;
    v536 = $31.x;
    $31.x = v524;
    v537 = $31.y;
    $31.y = v525;
    v538 = $31.z;
    $31.z = v526;
    v539 = $32.call(this, v2, a0, a2);
    v540 = false;
    v541 = null;
    v542 = 0;
    v543 = false;
    v544 = 0;
    v545 = 0;
    v546 = 1;
    v547 = 0;
    v548 = 5126;
    v549 = 0;
    v550 = 0;
    v551 = 0;
    v552 = 0;
    if (v9(v539)) {
     v540 = true;
     v541 = v1.createStream(34962, v539);
     v548 = v541.dtype;
    }
    else {
     v541 = v1.getBuffer(v539);
     if (v541) {
      v548 = v541.dtype;
     }
     else if ('constant' in v539) {
      v546 = 2;
      if (typeof v539.constant === 'number') {
       v550 = v539.constant;
       v551 = v552 = v549 = 0;
      }
      else {
       v550 = v539.constant.length > 0 ? v539.constant[0] : 0;
       v551 = v539.constant.length > 1 ? v539.constant[1] : 0;
       v552 = v539.constant.length > 2 ? v539.constant[2] : 0;
       v549 = v539.constant.length > 3 ? v539.constant[3] : 0;
      }
     }
     else {
      if (v9(v539.buffer)) {
       v541 = v1.createStream(34962, v539.buffer);
      }
      else {
       v541 = v1.getBuffer(v539.buffer);
      }
      v548 = 'type' in v539 ? v43[v539.type] : v541.dtype;
      v543 = !!v539.normalized;
      v545 = v539.size | 0;
      v544 = v539.offset | 0;
      v547 = v539.stride | 0;
      v542 = v539.divisor | 0;
     }
    }
    v553 = $33.buffer;
    $33.buffer = v541;
    v554 = $33.divisor;
    $33.divisor = v542;
    v555 = $33.normalized;
    $33.normalized = v543;
    v556 = $33.offset;
    $33.offset = v544;
    v557 = $33.size;
    $33.size = v545;
    v558 = $33.state;
    $33.state = v546;
    v559 = $33.stride;
    $33.stride = v547;
    v560 = $33.type;
    $33.type = v548;
    v561 = $33.w;
    $33.w = v549;
    v562 = $33.x;
    $33.x = v550;
    v563 = $33.y;
    $33.y = v551;
    v564 = $33.z;
    $33.z = v552;
    v565 = v11.vert;
    v11.vert = 59;
    v566 = v11.frag;
    v11.frag = 58;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v277;
    v2.viewportHeight = v278;
    v38[0] = v279;
    v38[1] = v280;
    v38[2] = v281;
    v38[3] = v282;
    v16[0] = v283;
    v16[1] = v284;
    v16[2] = v285;
    v16[3] = v286;
    v10.blend_enable = v287;
    v20[0] = v288;
    v20[1] = v289;
    v20[2] = v290;
    v20[3] = v291;
    v10.depth_enable = v292;
    v30[0] = v298;
    v30[1] = v299;
    v30[2] = v300;
    v30[3] = v301;
    v10.scissor_enable = v302;
    v10.stencil_enable = v303;
    if (v306) {
     v5.destroyStream(v305);
    }
    v4.elements = v307;
    v4.offset = v309;
    v4.count = v311;
    v4.primitive = v312;
    v14[45] = v313;
    v14[48] = v315;
    v14[10] = v317;
    v14[46] = v319;
    v14[47] = v320;
    v14[34] = v322;
    v14[6] = v324;
    v14[7] = v326;
    v14[8] = v328;
    v14[9] = v330;
    if (v332) {
     v1.destroyStream(v333);
    }
    $17.buffer = v345;
    $17.divisor = v346;
    $17.normalized = v347;
    $17.offset = v348;
    $17.size = v349;
    $17.state = v350;
    $17.stride = v351;
    $17.type = v352;
    $17.w = v353;
    $17.x = v354;
    $17.y = v355;
    $17.z = v356;
    if (v358) {
     v1.destroyStream(v359);
    }
    $19.buffer = v371;
    $19.divisor = v372;
    $19.normalized = v373;
    $19.offset = v374;
    $19.size = v375;
    $19.state = v376;
    $19.stride = v377;
    $19.type = v378;
    $19.w = v379;
    $19.x = v380;
    $19.y = v381;
    $19.z = v382;
    if (v384) {
     v1.destroyStream(v385);
    }
    $21.buffer = v397;
    $21.divisor = v398;
    $21.normalized = v399;
    $21.offset = v400;
    $21.size = v401;
    $21.state = v402;
    $21.stride = v403;
    $21.type = v404;
    $21.w = v405;
    $21.x = v406;
    $21.y = v407;
    $21.z = v408;
    if (v410) {
     v1.destroyStream(v411);
    }
    $23.buffer = v423;
    $23.divisor = v424;
    $23.normalized = v425;
    $23.offset = v426;
    $23.size = v427;
    $23.state = v428;
    $23.stride = v429;
    $23.type = v430;
    $23.w = v431;
    $23.x = v432;
    $23.y = v433;
    $23.z = v434;
    if (v436) {
     v1.destroyStream(v437);
    }
    $25.buffer = v449;
    $25.divisor = v450;
    $25.normalized = v451;
    $25.offset = v452;
    $25.size = v453;
    $25.state = v454;
    $25.stride = v455;
    $25.type = v456;
    $25.w = v457;
    $25.x = v458;
    $25.y = v459;
    $25.z = v460;
    if (v462) {
     v1.destroyStream(v463);
    }
    $27.buffer = v475;
    $27.divisor = v476;
    $27.normalized = v477;
    $27.offset = v478;
    $27.size = v479;
    $27.state = v480;
    $27.stride = v481;
    $27.type = v482;
    $27.w = v483;
    $27.x = v484;
    $27.y = v485;
    $27.z = v486;
    if (v488) {
     v1.destroyStream(v489);
    }
    $29.buffer = v501;
    $29.divisor = v502;
    $29.normalized = v503;
    $29.offset = v504;
    $29.size = v505;
    $29.state = v506;
    $29.stride = v507;
    $29.type = v508;
    $29.w = v509;
    $29.x = v510;
    $29.y = v511;
    $29.z = v512;
    if (v514) {
     v1.destroyStream(v515);
    }
    $31.buffer = v527;
    $31.divisor = v528;
    $31.normalized = v529;
    $31.offset = v530;
    $31.size = v531;
    $31.state = v532;
    $31.stride = v533;
    $31.type = v534;
    $31.w = v535;
    $31.x = v536;
    $31.y = v537;
    $31.z = v538;
    if (v540) {
     v1.destroyStream(v541);
    }
    $33.buffer = v553;
    $33.divisor = v554;
    $33.normalized = v555;
    $33.offset = v556;
    $33.size = v557;
    $33.state = v558;
    $33.stride = v559;
    $33.type = v560;
    $33.w = v561;
    $33.x = v562;
    $33.y = v563;
    $33.z = v564;
    v11.vert = v565;
    v11.frag = v566;
    v3.dirty = true;
   }
   ,
  }

 },
 '$22,align,atlas,atlasDim,atlasSize,baseline,char,charOffset,charStep,color,em,opacity,position,positionOffset,scale,translate,viewport,width': function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, align, atlas, atlasDim, atlasSize, baseline, char, charOffset, charStep, color, em, opacity, position, positionOffset, scale, translate, viewport, width
 ) {
  'use strict';
  var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21, v22, v23, v24, v25, v26, v27, v28, v29, v30, v31, v32, v33, v34, v35, v36, v37, v38, v39, v40, v41, v42, v43, v44, v45, v46, v47, v48;
  v0 = $0.attributes;
  v1 = $0.buffer;
  v2 = $0.context;
  v3 = $0.current;
  v4 = $0.draw;
  v5 = $0.elements;
  v6 = $0.extensions;
  v7 = $0.framebuffer;
  v8 = $0.gl;
  v9 = $0.isBufferArgs;
  v10 = $0.next;
  v11 = $0.shader;
  v12 = $0.strings;
  v13 = $0.timer;
  v14 = $0.uniforms;
  v15 = $0.vao;
  v16 = v10.blend_color;
  v17 = v3.blend_color;
  v18 = v10.blend_equation;
  v19 = v3.blend_equation;
  v20 = v10.blend_func;
  v21 = v3.blend_func;
  v22 = v10.colorMask;
  v23 = v3.colorMask;
  v24 = v10.depth_range;
  v25 = v3.depth_range;
  v26 = v10.polygonOffset_offset;
  v27 = v3.polygonOffset_offset;
  v28 = v10.sample_coverage;
  v29 = v3.sample_coverage;
  v30 = v10.scissor_box;
  v31 = v3.scissor_box;
  v32 = v10.stencil_func;
  v33 = v3.stencil_func;
  v34 = v10.stencil_opBack;
  v35 = v3.stencil_opBack;
  v36 = v10.stencil_opFront;
  v37 = v3.stencil_opFront;
  v38 = v10.viewport;
  v39 = v3.viewport;
  v40 = {
   'add': 32774, 'subtract': 32778, 'reverse subtract': 32779
  }
   ;
  v41 = {
   '0': 0, '1': 1, 'zero': 0, 'one': 1, 'src color': 768, 'one minus src color': 769, 'src alpha': 770, 'one minus src alpha': 771, 'dst color': 774, 'one minus dst color': 775, 'dst alpha': 772, 'one minus dst alpha': 773, 'constant color': 32769, 'one minus constant color': 32770, 'constant alpha': 32771, 'one minus constant alpha': 32772, 'src alpha saturate': 776
  }
   ;
  v42 = {
   'never': 512, 'less': 513, '<': 513, 'equal': 514, '=': 514, '==': 514, '===': 514, 'lequal': 515, '<=': 515, 'greater': 516, '>': 516, 'notequal': 517, '!=': 517, '!==': 517, 'gequal': 518, '>=': 518, 'always': 519
  }
   ;
  v43 = {
   'int8': 5120, 'int16': 5122, 'int32': 5124, 'uint8': 5121, 'uint16': 5123, 'uint32': 5125, 'float': 5126, 'float32': 5126
  }
   ;
  v44 = {
   'cw': 2304, 'ccw': 2305
  }
   ;
  v45 = {
   'points': 0, 'point': 0, 'lines': 1, 'line': 1, 'triangles': 4, 'triangle': 4, 'line loop': 2, 'line strip': 3, 'triangle strip': 5, 'triangle fan': 6
  }
   ;
  v46 = {
   '0': 0, 'zero': 0, 'keep': 7680, 'replace': 7681, 'increment': 7682, 'decrement': 7683, 'increment wrap': 34055, 'decrement wrap': 34056, 'invert': 5386
  }
   ;
  v47 = {
  }
   ;
  v47.offset = 4;
  v47.stride = 8;
  v48 = {
  }
   ;
  v48.offset = 0;
  v48.stride = 8;
  return {
   'batch': function (a0, a1) {
    var v361, v362, v402, v403, v404, v405, v406, v407, v408, v409, v410, v411;
    v361 = v6.angle_instanced_arrays;
    v362 = v7.next;
    if (v362 !== v7.cur) {
     if (v362) {
      v8.bindFramebuffer(36160, v362.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v362;
    }
    if (v3.dirty) {
     var v363, v364, v365, v366, v367, v368, v369, v370, v371, v372, v373, v374, v375, v376, v377, v378, v379, v380, v381, v382, v383, v384, v385, v386, v387, v388, v389, v390, v391, v392, v393, v394, v395, v396, v397, v398, v399, v400, v401;
     v363 = v10.dither;
     if (v363 !== v3.dither) {
      if (v363) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v363;
     }
     v364 = v18[0];
     v365 = v18[1];
     if (v364 !== v19[0] || v365 !== v19[1]) {
      v8.blendEquationSeparate(v364, v365);
      v19[0] = v364;
      v19[1] = v365;
     }
     v366 = v10.depth_func;
     if (v366 !== v3.depth_func) {
      v8.depthFunc(v366);
      v3.depth_func = v366;
     }
     v367 = v24[0];
     v368 = v24[1];
     if (v367 !== v25[0] || v368 !== v25[1]) {
      v8.depthRange(v367, v368);
      v25[0] = v367;
      v25[1] = v368;
     }
     v369 = v10.depth_mask;
     if (v369 !== v3.depth_mask) {
      v8.depthMask(v369);
      v3.depth_mask = v369;
     }
     v370 = v22[0];
     v371 = v22[1];
     v372 = v22[2];
     v373 = v22[3];
     if (v370 !== v23[0] || v371 !== v23[1] || v372 !== v23[2] || v373 !== v23[3]) {
      v8.colorMask(v370, v371, v372, v373);
      v23[0] = v370;
      v23[1] = v371;
      v23[2] = v372;
      v23[3] = v373;
     }
     v374 = v10.cull_enable;
     if (v374 !== v3.cull_enable) {
      if (v374) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v374;
     }
     v375 = v10.cull_face;
     if (v375 !== v3.cull_face) {
      v8.cullFace(v375);
      v3.cull_face = v375;
     }
     v376 = v10.frontFace;
     if (v376 !== v3.frontFace) {
      v8.frontFace(v376);
      v3.frontFace = v376;
     }
     v377 = v10.lineWidth;
     if (v377 !== v3.lineWidth) {
      v8.lineWidth(v377);
      v3.lineWidth = v377;
     }
     v378 = v10.polygonOffset_enable;
     if (v378 !== v3.polygonOffset_enable) {
      if (v378) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v378;
     }
     v379 = v26[0];
     v380 = v26[1];
     if (v379 !== v27[0] || v380 !== v27[1]) {
      v8.polygonOffset(v379, v380);
      v27[0] = v379;
      v27[1] = v380;
     }
     v381 = v10.sample_alpha;
     if (v381 !== v3.sample_alpha) {
      if (v381) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v381;
     }
     v382 = v10.sample_enable;
     if (v382 !== v3.sample_enable) {
      if (v382) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v382;
     }
     v383 = v28[0];
     v384 = v28[1];
     if (v383 !== v29[0] || v384 !== v29[1]) {
      v8.sampleCoverage(v383, v384);
      v29[0] = v383;
      v29[1] = v384;
     }
     v385 = v10.stencil_mask;
     if (v385 !== v3.stencil_mask) {
      v8.stencilMask(v385);
      v3.stencil_mask = v385;
     }
     v386 = v32[0];
     v387 = v32[1];
     v388 = v32[2];
     if (v386 !== v33[0] || v387 !== v33[1] || v388 !== v33[2]) {
      v8.stencilFunc(v386, v387, v388);
      v33[0] = v386;
      v33[1] = v387;
      v33[2] = v388;
     }
     v389 = v36[0];
     v390 = v36[1];
     v391 = v36[2];
     v392 = v36[3];
     if (v389 !== v37[0] || v390 !== v37[1] || v391 !== v37[2] || v392 !== v37[3]) {
      v8.stencilOpSeparate(v389, v390, v391, v392);
      v37[0] = v389;
      v37[1] = v390;
      v37[2] = v391;
      v37[3] = v392;
     }
     v393 = v34[0];
     v394 = v34[1];
     v395 = v34[2];
     v396 = v34[3];
     if (v393 !== v35[0] || v394 !== v35[1] || v395 !== v35[2] || v396 !== v35[3]) {
      v8.stencilOpSeparate(v393, v394, v395, v396);
      v35[0] = v393;
      v35[1] = v394;
      v35[2] = v395;
      v35[3] = v396;
     }
     v397 = v10.scissor_enable;
     if (v397 !== v3.scissor_enable) {
      if (v397) {
       v8.enable(3089);
      }
      else {
       v8.disable(3089);
      }
      v3.scissor_enable = v397;
     }
     v398 = v30[0];
     v399 = v30[1];
     v400 = v30[2];
     v401 = v30[3];
     if (v398 !== v31[0] || v399 !== v31[1] || v400 !== v31[2] || v401 !== v31[3]) {
      v8.scissor(v398, v399, v400, v401);
      v31[0] = v398;
      v31[1] = v399;
      v31[2] = v400;
      v31[3] = v401;
     }
    }
    v402 = this['viewport'];
    v403 = v402.x | 0;
    v404 = v402.y | 0;
    v405 = 'width' in v402 ? v402.width | 0 : (v2.framebufferWidth - v403);
    v406 = 'height' in v402 ? v402.height | 0 : (v2.framebufferHeight - v404);
    v407 = v2.viewportWidth;
    v2.viewportWidth = v405;
    v408 = v2.viewportHeight;
    v2.viewportHeight = v406;
    v8.viewport(v403, v404, v405, v406);
    v39[0] = v403;
    v39[1] = v404;
    v39[2] = v405;
    v39[3] = v406;
    v8.blendColor(0, 0, 0, 1);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 1;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($17.program);
    v409 = v6.angle_instanced_arrays;
    var v412, v413, v414, v415, v416, v417, v418, v419, v420, v421, v422, v423, v424, v425, v426, v427, v428, v429, v430, v431, v432, v433, v434, v435, v436, v437, v438, v439, v440, v441, v442, v443, v444, v445, v446, v447, v448, v449, v450, v451, v452, v453, v454, v455, v456, v457, v458, v459, v460, v461, v462, v463, v464, v465, v466, v467, v468, v469, v470, v471, v472, v473, v474, v475, v476, v477, v478, v479, v480, v481, v482, v483, v484, v485, v486, v487, v488, v489, v490, v527, v530;
    v15.setVAO(null);
    v412 = this['sizeBuffer'];
    v48.buffer = v412;
    v413 = false;
    v414 = null;
    v415 = 0;
    v416 = false;
    v417 = 0;
    v418 = 0;
    v419 = 1;
    v420 = 0;
    v421 = 5126;
    v422 = 0;
    v423 = 0;
    v424 = 0;
    v425 = 0;
    if (v9(v48)) {
     v413 = true;
     v414 = v1.createStream(34962, v48);
     v421 = v414.dtype;
    }
    else {
     v414 = v1.getBuffer(v48);
     if (v414) {
      v421 = v414.dtype;
     }
     else if ('constant' in v48) {
      v419 = 2;
      if (typeof v48.constant === 'number') {
       v423 = v48.constant;
       v424 = v425 = v422 = 0;
      }
      else {
       v423 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v424 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v425 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v422 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v414 = v1.createStream(34962, v48.buffer);
      }
      else {
       v414 = v1.getBuffer(v48.buffer);
      }
      v421 = 'type' in v48 ? v43[v48.type] : v414.dtype;
      v416 = !!v48.normalized;
      v418 = v48.size | 0;
      v417 = v48.offset | 0;
      v420 = v48.stride | 0;
      v415 = v48.divisor | 0;
     }
    }
    v426 = width.location;
    v427 = v0[v426];
    if (v419 === 1) {
     if (!v427.buffer) {
      v8.enableVertexAttribArray(v426);
     }
     v428 = v418 || 1;
     if (v427.type !== v421 || v427.size !== v428 || v427.buffer !== v414 || v427.normalized !== v416 || v427.offset !== v417 || v427.stride !== v420) {
      v8.bindBuffer(34962, v414.buffer);
      v8.vertexAttribPointer(v426, v428, v421, v416, v420, v417);
      v427.type = v421;
      v427.size = v428;
      v427.buffer = v414;
      v427.normalized = v416;
      v427.offset = v417;
      v427.stride = v420;
     }
     if (v427.divisor !== v415) {
      v409.vertexAttribDivisorANGLE(v426, v415);
      v427.divisor = v415;
     }
    }
    else {
     if (v427.buffer) {
      v8.disableVertexAttribArray(v426);
      v427.buffer = null;
     }
     if (v427.x !== v423 || v427.y !== v424 || v427.z !== v425 || v427.w !== v422) {
      v8.vertexAttrib4f(v426, v423, v424, v425, v422);
      v427.x = v423;
      v427.y = v424;
      v427.z = v425;
      v427.w = v422;
     }
    }
    v429 = this['sizeBuffer'];
    v47.buffer = v429;
    v430 = false;
    v431 = null;
    v432 = 0;
    v433 = false;
    v434 = 0;
    v435 = 0;
    v436 = 1;
    v437 = 0;
    v438 = 5126;
    v439 = 0;
    v440 = 0;
    v441 = 0;
    v442 = 0;
    if (v9(v47)) {
     v430 = true;
     v431 = v1.createStream(34962, v47);
     v438 = v431.dtype;
    }
    else {
     v431 = v1.getBuffer(v47);
     if (v431) {
      v438 = v431.dtype;
     }
     else if ('constant' in v47) {
      v436 = 2;
      if (typeof v47.constant === 'number') {
       v440 = v47.constant;
       v441 = v442 = v439 = 0;
      }
      else {
       v440 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v441 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v442 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v439 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v431 = v1.createStream(34962, v47.buffer);
      }
      else {
       v431 = v1.getBuffer(v47.buffer);
      }
      v438 = 'type' in v47 ? v43[v47.type] : v431.dtype;
      v433 = !!v47.normalized;
      v435 = v47.size | 0;
      v434 = v47.offset | 0;
      v437 = v47.stride | 0;
      v432 = v47.divisor | 0;
     }
    }
    v443 = charOffset.location;
    v444 = v0[v443];
    if (v436 === 1) {
     if (!v444.buffer) {
      v8.enableVertexAttribArray(v443);
     }
     v445 = v435 || 1;
     if (v444.type !== v438 || v444.size !== v445 || v444.buffer !== v431 || v444.normalized !== v433 || v444.offset !== v434 || v444.stride !== v437) {
      v8.bindBuffer(34962, v431.buffer);
      v8.vertexAttribPointer(v443, v445, v438, v433, v437, v434);
      v444.type = v438;
      v444.size = v445;
      v444.buffer = v431;
      v444.normalized = v433;
      v444.offset = v434;
      v444.stride = v437;
     }
     if (v444.divisor !== v432) {
      v409.vertexAttribDivisorANGLE(v443, v432);
      v444.divisor = v432;
     }
    }
    else {
     if (v444.buffer) {
      v8.disableVertexAttribArray(v443);
      v444.buffer = null;
     }
     if (v444.x !== v440 || v444.y !== v441 || v444.z !== v442 || v444.w !== v439) {
      v8.vertexAttrib4f(v443, v440, v441, v442, v439);
      v444.x = v440;
      v444.y = v441;
      v444.z = v442;
      v444.w = v439;
     }
    }
    v446 = this['charBuffer'];
    v447 = false;
    v448 = null;
    v449 = 0;
    v450 = false;
    v451 = 0;
    v452 = 0;
    v453 = 1;
    v454 = 0;
    v455 = 5126;
    v456 = 0;
    v457 = 0;
    v458 = 0;
    v459 = 0;
    if (v9(v446)) {
     v447 = true;
     v448 = v1.createStream(34962, v446);
     v455 = v448.dtype;
    }
    else {
     v448 = v1.getBuffer(v446);
     if (v448) {
      v455 = v448.dtype;
     }
     else if ('constant' in v446) {
      v453 = 2;
      if (typeof v446.constant === 'number') {
       v457 = v446.constant;
       v458 = v459 = v456 = 0;
      }
      else {
       v457 = v446.constant.length > 0 ? v446.constant[0] : 0;
       v458 = v446.constant.length > 1 ? v446.constant[1] : 0;
       v459 = v446.constant.length > 2 ? v446.constant[2] : 0;
       v456 = v446.constant.length > 3 ? v446.constant[3] : 0;
      }
     }
     else {
      if (v9(v446.buffer)) {
       v448 = v1.createStream(34962, v446.buffer);
      }
      else {
       v448 = v1.getBuffer(v446.buffer);
      }
      v455 = 'type' in v446 ? v43[v446.type] : v448.dtype;
      v450 = !!v446.normalized;
      v452 = v446.size | 0;
      v451 = v446.offset | 0;
      v454 = v446.stride | 0;
      v449 = v446.divisor | 0;
     }
    }
    v460 = char.location;
    v461 = v0[v460];
    if (v453 === 1) {
     if (!v461.buffer) {
      v8.enableVertexAttribArray(v460);
     }
     v462 = v452 || 1;
     if (v461.type !== v455 || v461.size !== v462 || v461.buffer !== v448 || v461.normalized !== v450 || v461.offset !== v451 || v461.stride !== v454) {
      v8.bindBuffer(34962, v448.buffer);
      v8.vertexAttribPointer(v460, v462, v455, v450, v454, v451);
      v461.type = v455;
      v461.size = v462;
      v461.buffer = v448;
      v461.normalized = v450;
      v461.offset = v451;
      v461.stride = v454;
     }
     if (v461.divisor !== v449) {
      v409.vertexAttribDivisorANGLE(v460, v449);
      v461.divisor = v449;
     }
    }
    else {
     if (v461.buffer) {
      v8.disableVertexAttribArray(v460);
      v461.buffer = null;
     }
     if (v461.x !== v457 || v461.y !== v458 || v461.z !== v459 || v461.w !== v456) {
      v8.vertexAttrib4f(v460, v457, v458, v459, v456);
      v461.x = v457;
      v461.y = v458;
      v461.z = v459;
      v461.w = v456;
     }
    }
    v463 = this['position'];
    v464 = false;
    v465 = null;
    v466 = 0;
    v467 = false;
    v468 = 0;
    v469 = 0;
    v470 = 1;
    v471 = 0;
    v472 = 5126;
    v473 = 0;
    v474 = 0;
    v475 = 0;
    v476 = 0;
    if (v9(v463)) {
     v464 = true;
     v465 = v1.createStream(34962, v463);
     v472 = v465.dtype;
    }
    else {
     v465 = v1.getBuffer(v463);
     if (v465) {
      v472 = v465.dtype;
     }
     else if ('constant' in v463) {
      v470 = 2;
      if (typeof v463.constant === 'number') {
       v474 = v463.constant;
       v475 = v476 = v473 = 0;
      }
      else {
       v474 = v463.constant.length > 0 ? v463.constant[0] : 0;
       v475 = v463.constant.length > 1 ? v463.constant[1] : 0;
       v476 = v463.constant.length > 2 ? v463.constant[2] : 0;
       v473 = v463.constant.length > 3 ? v463.constant[3] : 0;
      }
     }
     else {
      if (v9(v463.buffer)) {
       v465 = v1.createStream(34962, v463.buffer);
      }
      else {
       v465 = v1.getBuffer(v463.buffer);
      }
      v472 = 'type' in v463 ? v43[v463.type] : v465.dtype;
      v467 = !!v463.normalized;
      v469 = v463.size | 0;
      v468 = v463.offset | 0;
      v471 = v463.stride | 0;
      v466 = v463.divisor | 0;
     }
    }
    v477 = position.location;
    v478 = v0[v477];
    if (v470 === 1) {
     if (!v478.buffer) {
      v8.enableVertexAttribArray(v477);
     }
     v479 = v469 || 2;
     if (v478.type !== v472 || v478.size !== v479 || v478.buffer !== v465 || v478.normalized !== v467 || v478.offset !== v468 || v478.stride !== v471) {
      v8.bindBuffer(34962, v465.buffer);
      v8.vertexAttribPointer(v477, v479, v472, v467, v471, v468);
      v478.type = v472;
      v478.size = v479;
      v478.buffer = v465;
      v478.normalized = v467;
      v478.offset = v468;
      v478.stride = v471;
     }
     if (v478.divisor !== v466) {
      v409.vertexAttribDivisorANGLE(v477, v466);
      v478.divisor = v466;
     }
    }
    else {
     if (v478.buffer) {
      v8.disableVertexAttribArray(v477);
      v478.buffer = null;
     }
     if (v478.x !== v474 || v478.y !== v475 || v478.z !== v476 || v478.w !== v473) {
      v8.vertexAttrib4f(v477, v474, v475, v476, v473);
      v478.x = v474;
      v478.y = v475;
      v478.z = v476;
      v478.w = v473;
     }
    }
    v480 = this['viewportArray'];
    v481 = v480[0];
    v482 = v480[1];
    v483 = v480[2];
    v484 = v480[3];
    v8.uniform4f(viewport.location, v481, v482, v483, v484);
    v485 = this['scale'];
    v486 = v485[0];
    v487 = v485[1];
    v8.uniform2f(scale.location, v486, v487);
    v488 = this['translate'];
    v489 = v488[0];
    v490 = v488[1];
    v8.uniform2f(translate.location, v489, v490);
    v527 = v4.elements;
    if (v527) {
     v8.bindBuffer(34963, v527.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v527 = v5.getElements(v15.currentVAO.elements);
     if (v527) v8.bindBuffer(34963, v527.buffer.buffer);
    }
    v530 = v4.instances;
    for (v410 = 0;
     v410 < a1;
     ++v410) {
     v411 = a0[v410];
     var v491, v492, v493, v494, v495, v496, v497, v498, v499, v500, v501, v502, v503, v504, v505, v506, v507, v508, v509, v510, v511, v512, v513, v514, v515, v516, v517, v518, v519, v520, v521, v522, v523, v524, v525, v526, v528, v529;
     v491 = $18.call(this, v2, v411, v410);
     if (!v410 || v492 !== v491) {
      v492 = v491;
      v8.uniform1f(charStep.location, v491);
     }
     v493 = $19.call(this, v2, v411, v410);
     if (!v410 || v494 !== v493) {
      v494 = v493;
      v8.uniform1f(em.location, v493);
     }
     v495 = v411['align'];
     if (!v410 || v496 !== v495) {
      v496 = v495;
      v8.uniform1f(align.location, v495);
     }
     v497 = v411['baseline'];
     if (!v410 || v498 !== v497) {
      v498 = v497;
      v8.uniform1f(baseline.location, v497);
     }
     v499 = v411['color'];
     v500 = v499[0];
     v502 = v499[1];
     v504 = v499[2];
     v506 = v499[3];
     if (!v410 || v501 !== v500 || v503 !== v502 || v505 !== v504 || v507 !== v506) {
      v501 = v500;
      v503 = v502;
      v505 = v504;
      v507 = v506;
      v8.uniform4f(color.location, v500, v502, v504, v506);
     }
     v508 = $20.call(this, v2, v411, v410);
     v509 = v508[0];
     v511 = v508[1];
     if (!v410 || v510 !== v509 || v512 !== v511) {
      v510 = v509;
      v512 = v511;
      v8.uniform2f(atlasSize.location, v509, v511);
     }
     v513 = $21.call(this, v2, v411, v410);
     v514 = v513[0];
     v516 = v513[1];
     if (!v410 || v515 !== v514 || v517 !== v516) {
      v515 = v514;
      v517 = v516;
      v8.uniform2f(atlasDim.location, v514, v516);
     }
     v518 = v411['positionOffset'];
     v519 = v518[0];
     v521 = v518[1];
     if (!v410 || v520 !== v519 || v522 !== v521) {
      v520 = v519;
      v522 = v521;
      v8.uniform2f(positionOffset.location, v519, v521);
     }
     v523 = v411['opacity'];
     if (!v410 || v524 !== v523) {
      v524 = v523;
      v8.uniform1f(opacity.location, v523);
     }
     v525 = $22.call(this, v2, v411, v410);
     if (v525 && v525._reglType === 'framebuffer') {
      v525 = v525.color[0];
     }
     v526 = v525._texture;
     v8.uniform1i(atlas.location, v526.bind());
     v528 = v411['offset'];
     v529 = v411['count'];
     if (v529) {
      if (v530 > 0) {
       if (v527) {
        v409.drawElementsInstancedANGLE(0, v529, v527.type, v528 << ((v527.type - 5121) >> 1), v530);
       }
       else {
        v409.drawArraysInstancedANGLE(0, v528, v529, v530);
       }
      }
      else if (v530 < 0) {
       if (v527) {
        v8.drawElements(0, v529, v527.type, v528 << ((v527.type - 5121) >> 1));
       }
       else {
        v8.drawArrays(0, v528, v529);
       }
      }
      v526.unbind();
     }
    }
    if (v413) {
     v1.destroyStream(v414);
    }
    if (v430) {
     v1.destroyStream(v431);
    }
    if (v447) {
     v1.destroyStream(v448);
    }
    if (v464) {
     v1.destroyStream(v465);
    }
    v3.dirty = true;
    v15.setVAO(null);
    v2.viewportWidth = v407;
    v2.viewportHeight = v408;
   }
   , 'draw': function (a0) {
    var v49, v50, v90, v91, v92, v93, v94, v95, v96, v97, v98, v99, v100, v101, v102, v103, v104, v105, v106, v107, v108, v109, v110, v111, v112, v113, v114, v115, v116, v117, v118, v119, v120, v121, v122, v123, v124, v125, v126, v127, v128, v129, v130, v131, v132, v133, v134, v135, v136, v137, v138, v139, v140, v141, v142, v143, v144, v145, v146, v147, v148, v149, v150, v151, v152, v153, v154, v155, v156, v157, v158, v159, v160, v161, v162, v163, v164, v165, v166, v167, v168, v169, v170, v171, v172, v173, v174, v175, v176, v177, v178, v179, v180, v181, v182, v183, v184, v185, v186, v187, v188, v189, v190, v191, v192, v193, v194, v195, v196, v197, v198, v199, v200, v201;
    v49 = v6.angle_instanced_arrays;
    v50 = v7.next;
    if (v50 !== v7.cur) {
     if (v50) {
      v8.bindFramebuffer(36160, v50.framebuffer);
     }
     else {
      v8.bindFramebuffer(36160, null);
     }
     v7.cur = v50;
    }
    if (v3.dirty) {
     var v51, v52, v53, v54, v55, v56, v57, v58, v59, v60, v61, v62, v63, v64, v65, v66, v67, v68, v69, v70, v71, v72, v73, v74, v75, v76, v77, v78, v79, v80, v81, v82, v83, v84, v85, v86, v87, v88, v89;
     v51 = v10.dither;
     if (v51 !== v3.dither) {
      if (v51) {
       v8.enable(3024);
      }
      else {
       v8.disable(3024);
      }
      v3.dither = v51;
     }
     v52 = v18[0];
     v53 = v18[1];
     if (v52 !== v19[0] || v53 !== v19[1]) {
      v8.blendEquationSeparate(v52, v53);
      v19[0] = v52;
      v19[1] = v53;
     }
     v54 = v10.depth_func;
     if (v54 !== v3.depth_func) {
      v8.depthFunc(v54);
      v3.depth_func = v54;
     }
     v55 = v24[0];
     v56 = v24[1];
     if (v55 !== v25[0] || v56 !== v25[1]) {
      v8.depthRange(v55, v56);
      v25[0] = v55;
      v25[1] = v56;
     }
     v57 = v10.depth_mask;
     if (v57 !== v3.depth_mask) {
      v8.depthMask(v57);
      v3.depth_mask = v57;
     }
     v58 = v22[0];
     v59 = v22[1];
     v60 = v22[2];
     v61 = v22[3];
     if (v58 !== v23[0] || v59 !== v23[1] || v60 !== v23[2] || v61 !== v23[3]) {
      v8.colorMask(v58, v59, v60, v61);
      v23[0] = v58;
      v23[1] = v59;
      v23[2] = v60;
      v23[3] = v61;
     }
     v62 = v10.cull_enable;
     if (v62 !== v3.cull_enable) {
      if (v62) {
       v8.enable(2884);
      }
      else {
       v8.disable(2884);
      }
      v3.cull_enable = v62;
     }
     v63 = v10.cull_face;
     if (v63 !== v3.cull_face) {
      v8.cullFace(v63);
      v3.cull_face = v63;
     }
     v64 = v10.frontFace;
     if (v64 !== v3.frontFace) {
      v8.frontFace(v64);
      v3.frontFace = v64;
     }
     v65 = v10.lineWidth;
     if (v65 !== v3.lineWidth) {
      v8.lineWidth(v65);
      v3.lineWidth = v65;
     }
     v66 = v10.polygonOffset_enable;
     if (v66 !== v3.polygonOffset_enable) {
      if (v66) {
       v8.enable(32823);
      }
      else {
       v8.disable(32823);
      }
      v3.polygonOffset_enable = v66;
     }
     v67 = v26[0];
     v68 = v26[1];
     if (v67 !== v27[0] || v68 !== v27[1]) {
      v8.polygonOffset(v67, v68);
      v27[0] = v67;
      v27[1] = v68;
     }
     v69 = v10.sample_alpha;
     if (v69 !== v3.sample_alpha) {
      if (v69) {
       v8.enable(32926);
      }
      else {
       v8.disable(32926);
      }
      v3.sample_alpha = v69;
     }
     v70 = v10.sample_enable;
     if (v70 !== v3.sample_enable) {
      if (v70) {
       v8.enable(32928);
      }
      else {
       v8.disable(32928);
      }
      v3.sample_enable = v70;
     }
     v71 = v28[0];
     v72 = v28[1];
     if (v71 !== v29[0] || v72 !== v29[1]) {
      v8.sampleCoverage(v71, v72);
      v29[0] = v71;
      v29[1] = v72;
     }
     v73 = v10.stencil_mask;
     if (v73 !== v3.stencil_mask) {
      v8.stencilMask(v73);
      v3.stencil_mask = v73;
     }
     v74 = v32[0];
     v75 = v32[1];
     v76 = v32[2];
     if (v74 !== v33[0] || v75 !== v33[1] || v76 !== v33[2]) {
      v8.stencilFunc(v74, v75, v76);
      v33[0] = v74;
      v33[1] = v75;
      v33[2] = v76;
     }
     v77 = v36[0];
     v78 = v36[1];
     v79 = v36[2];
     v80 = v36[3];
     if (v77 !== v37[0] || v78 !== v37[1] || v79 !== v37[2] || v80 !== v37[3]) {
      v8.stencilOpSeparate(v77, v78, v79, v80);
      v37[0] = v77;
      v37[1] = v78;
      v37[2] = v79;
      v37[3] = v80;
     }
     v81 = v34[0];
     v82 = v34[1];
     v83 = v34[2];
     v84 = v34[3];
     if (v81 !== v35[0] || v82 !== v35[1] || v83 !== v35[2] || v84 !== v35[3]) {
      v8.stencilOpSeparate(v81, v82, v83, v84);
      v35[0] = v81;
      v35[1] = v82;
      v35[2] = v83;
      v35[3] = v84;
     }
     v85 = v10.scissor_enable;
     if (v85 !== v3.scissor_enable) {
      if (v85) {
       v8.enable(3089);
      }
      else {
       v8.disable(3089);
      }
      v3.scissor_enable = v85;
     }
     v86 = v30[0];
     v87 = v30[1];
     v88 = v30[2];
     v89 = v30[3];
     if (v86 !== v31[0] || v87 !== v31[1] || v88 !== v31[2] || v89 !== v31[3]) {
      v8.scissor(v86, v87, v88, v89);
      v31[0] = v86;
      v31[1] = v87;
      v31[2] = v88;
      v31[3] = v89;
     }
    }
    v90 = this['viewport'];
    v91 = v90.x | 0;
    v92 = v90.y | 0;
    v93 = 'width' in v90 ? v90.width | 0 : (v2.framebufferWidth - v91);
    v94 = 'height' in v90 ? v90.height | 0 : (v2.framebufferHeight - v92);
    v95 = v2.viewportWidth;
    v2.viewportWidth = v93;
    v96 = v2.viewportHeight;
    v2.viewportHeight = v94;
    v8.viewport(v91, v92, v93, v94);
    v39[0] = v91;
    v39[1] = v92;
    v39[2] = v93;
    v39[3] = v94;
    v8.blendColor(0, 0, 0, 1);
    v17[0] = 0;
    v17[1] = 0;
    v17[2] = 0;
    v17[3] = 1;
    v8.enable(3042);
    v3.blend_enable = true;
    v8.blendFuncSeparate(770, 771, 773, 1);
    v21[0] = 770;
    v21[1] = 771;
    v21[2] = 773;
    v21[3] = 1;
    v8.disable(2929);
    v3.depth_enable = false;
    v8.disable(2960);
    v3.stencil_enable = false;
    v8.useProgram($2.program);
    v97 = v6.angle_instanced_arrays;
    v15.setVAO(null);
    v98 = this['sizeBuffer'];
    v48.buffer = v98;
    v99 = false;
    v100 = null;
    v101 = 0;
    v102 = false;
    v103 = 0;
    v104 = 0;
    v105 = 1;
    v106 = 0;
    v107 = 5126;
    v108 = 0;
    v109 = 0;
    v110 = 0;
    v111 = 0;
    if (v9(v48)) {
     v99 = true;
     v100 = v1.createStream(34962, v48);
     v107 = v100.dtype;
    }
    else {
     v100 = v1.getBuffer(v48);
     if (v100) {
      v107 = v100.dtype;
     }
     else if ('constant' in v48) {
      v105 = 2;
      if (typeof v48.constant === 'number') {
       v109 = v48.constant;
       v110 = v111 = v108 = 0;
      }
      else {
       v109 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v110 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v111 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v108 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v100 = v1.createStream(34962, v48.buffer);
      }
      else {
       v100 = v1.getBuffer(v48.buffer);
      }
      v107 = 'type' in v48 ? v43[v48.type] : v100.dtype;
      v102 = !!v48.normalized;
      v104 = v48.size | 0;
      v103 = v48.offset | 0;
      v106 = v48.stride | 0;
      v101 = v48.divisor | 0;
     }
    }
    v112 = width.location;
    v113 = v0[v112];
    if (v105 === 1) {
     if (!v113.buffer) {
      v8.enableVertexAttribArray(v112);
     }
     v114 = v104 || 1;
     if (v113.type !== v107 || v113.size !== v114 || v113.buffer !== v100 || v113.normalized !== v102 || v113.offset !== v103 || v113.stride !== v106) {
      v8.bindBuffer(34962, v100.buffer);
      v8.vertexAttribPointer(v112, v114, v107, v102, v106, v103);
      v113.type = v107;
      v113.size = v114;
      v113.buffer = v100;
      v113.normalized = v102;
      v113.offset = v103;
      v113.stride = v106;
     }
     if (v113.divisor !== v101) {
      v97.vertexAttribDivisorANGLE(v112, v101);
      v113.divisor = v101;
     }
    }
    else {
     if (v113.buffer) {
      v8.disableVertexAttribArray(v112);
      v113.buffer = null;
     }
     if (v113.x !== v109 || v113.y !== v110 || v113.z !== v111 || v113.w !== v108) {
      v8.vertexAttrib4f(v112, v109, v110, v111, v108);
      v113.x = v109;
      v113.y = v110;
      v113.z = v111;
      v113.w = v108;
     }
    }
    v115 = this['sizeBuffer'];
    v47.buffer = v115;
    v116 = false;
    v117 = null;
    v118 = 0;
    v119 = false;
    v120 = 0;
    v121 = 0;
    v122 = 1;
    v123 = 0;
    v124 = 5126;
    v125 = 0;
    v126 = 0;
    v127 = 0;
    v128 = 0;
    if (v9(v47)) {
     v116 = true;
     v117 = v1.createStream(34962, v47);
     v124 = v117.dtype;
    }
    else {
     v117 = v1.getBuffer(v47);
     if (v117) {
      v124 = v117.dtype;
     }
     else if ('constant' in v47) {
      v122 = 2;
      if (typeof v47.constant === 'number') {
       v126 = v47.constant;
       v127 = v128 = v125 = 0;
      }
      else {
       v126 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v127 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v128 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v125 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v117 = v1.createStream(34962, v47.buffer);
      }
      else {
       v117 = v1.getBuffer(v47.buffer);
      }
      v124 = 'type' in v47 ? v43[v47.type] : v117.dtype;
      v119 = !!v47.normalized;
      v121 = v47.size | 0;
      v120 = v47.offset | 0;
      v123 = v47.stride | 0;
      v118 = v47.divisor | 0;
     }
    }
    v129 = charOffset.location;
    v130 = v0[v129];
    if (v122 === 1) {
     if (!v130.buffer) {
      v8.enableVertexAttribArray(v129);
     }
     v131 = v121 || 1;
     if (v130.type !== v124 || v130.size !== v131 || v130.buffer !== v117 || v130.normalized !== v119 || v130.offset !== v120 || v130.stride !== v123) {
      v8.bindBuffer(34962, v117.buffer);
      v8.vertexAttribPointer(v129, v131, v124, v119, v123, v120);
      v130.type = v124;
      v130.size = v131;
      v130.buffer = v117;
      v130.normalized = v119;
      v130.offset = v120;
      v130.stride = v123;
     }
     if (v130.divisor !== v118) {
      v97.vertexAttribDivisorANGLE(v129, v118);
      v130.divisor = v118;
     }
    }
    else {
     if (v130.buffer) {
      v8.disableVertexAttribArray(v129);
      v130.buffer = null;
     }
     if (v130.x !== v126 || v130.y !== v127 || v130.z !== v128 || v130.w !== v125) {
      v8.vertexAttrib4f(v129, v126, v127, v128, v125);
      v130.x = v126;
      v130.y = v127;
      v130.z = v128;
      v130.w = v125;
     }
    }
    v132 = this['charBuffer'];
    v133 = false;
    v134 = null;
    v135 = 0;
    v136 = false;
    v137 = 0;
    v138 = 0;
    v139 = 1;
    v140 = 0;
    v141 = 5126;
    v142 = 0;
    v143 = 0;
    v144 = 0;
    v145 = 0;
    if (v9(v132)) {
     v133 = true;
     v134 = v1.createStream(34962, v132);
     v141 = v134.dtype;
    }
    else {
     v134 = v1.getBuffer(v132);
     if (v134) {
      v141 = v134.dtype;
     }
     else if ('constant' in v132) {
      v139 = 2;
      if (typeof v132.constant === 'number') {
       v143 = v132.constant;
       v144 = v145 = v142 = 0;
      }
      else {
       v143 = v132.constant.length > 0 ? v132.constant[0] : 0;
       v144 = v132.constant.length > 1 ? v132.constant[1] : 0;
       v145 = v132.constant.length > 2 ? v132.constant[2] : 0;
       v142 = v132.constant.length > 3 ? v132.constant[3] : 0;
      }
     }
     else {
      if (v9(v132.buffer)) {
       v134 = v1.createStream(34962, v132.buffer);
      }
      else {
       v134 = v1.getBuffer(v132.buffer);
      }
      v141 = 'type' in v132 ? v43[v132.type] : v134.dtype;
      v136 = !!v132.normalized;
      v138 = v132.size | 0;
      v137 = v132.offset | 0;
      v140 = v132.stride | 0;
      v135 = v132.divisor | 0;
     }
    }
    v146 = char.location;
    v147 = v0[v146];
    if (v139 === 1) {
     if (!v147.buffer) {
      v8.enableVertexAttribArray(v146);
     }
     v148 = v138 || 1;
     if (v147.type !== v141 || v147.size !== v148 || v147.buffer !== v134 || v147.normalized !== v136 || v147.offset !== v137 || v147.stride !== v140) {
      v8.bindBuffer(34962, v134.buffer);
      v8.vertexAttribPointer(v146, v148, v141, v136, v140, v137);
      v147.type = v141;
      v147.size = v148;
      v147.buffer = v134;
      v147.normalized = v136;
      v147.offset = v137;
      v147.stride = v140;
     }
     if (v147.divisor !== v135) {
      v97.vertexAttribDivisorANGLE(v146, v135);
      v147.divisor = v135;
     }
    }
    else {
     if (v147.buffer) {
      v8.disableVertexAttribArray(v146);
      v147.buffer = null;
     }
     if (v147.x !== v143 || v147.y !== v144 || v147.z !== v145 || v147.w !== v142) {
      v8.vertexAttrib4f(v146, v143, v144, v145, v142);
      v147.x = v143;
      v147.y = v144;
      v147.z = v145;
      v147.w = v142;
     }
    }
    v149 = this['position'];
    v150 = false;
    v151 = null;
    v152 = 0;
    v153 = false;
    v154 = 0;
    v155 = 0;
    v156 = 1;
    v157 = 0;
    v158 = 5126;
    v159 = 0;
    v160 = 0;
    v161 = 0;
    v162 = 0;
    if (v9(v149)) {
     v150 = true;
     v151 = v1.createStream(34962, v149);
     v158 = v151.dtype;
    }
    else {
     v151 = v1.getBuffer(v149);
     if (v151) {
      v158 = v151.dtype;
     }
     else if ('constant' in v149) {
      v156 = 2;
      if (typeof v149.constant === 'number') {
       v160 = v149.constant;
       v161 = v162 = v159 = 0;
      }
      else {
       v160 = v149.constant.length > 0 ? v149.constant[0] : 0;
       v161 = v149.constant.length > 1 ? v149.constant[1] : 0;
       v162 = v149.constant.length > 2 ? v149.constant[2] : 0;
       v159 = v149.constant.length > 3 ? v149.constant[3] : 0;
      }
     }
     else {
      if (v9(v149.buffer)) {
       v151 = v1.createStream(34962, v149.buffer);
      }
      else {
       v151 = v1.getBuffer(v149.buffer);
      }
      v158 = 'type' in v149 ? v43[v149.type] : v151.dtype;
      v153 = !!v149.normalized;
      v155 = v149.size | 0;
      v154 = v149.offset | 0;
      v157 = v149.stride | 0;
      v152 = v149.divisor | 0;
     }
    }
    v163 = position.location;
    v164 = v0[v163];
    if (v156 === 1) {
     if (!v164.buffer) {
      v8.enableVertexAttribArray(v163);
     }
     v165 = v155 || 2;
     if (v164.type !== v158 || v164.size !== v165 || v164.buffer !== v151 || v164.normalized !== v153 || v164.offset !== v154 || v164.stride !== v157) {
      v8.bindBuffer(34962, v151.buffer);
      v8.vertexAttribPointer(v163, v165, v158, v153, v157, v154);
      v164.type = v158;
      v164.size = v165;
      v164.buffer = v151;
      v164.normalized = v153;
      v164.offset = v154;
      v164.stride = v157;
     }
     if (v164.divisor !== v152) {
      v97.vertexAttribDivisorANGLE(v163, v152);
      v164.divisor = v152;
     }
    }
    else {
     if (v164.buffer) {
      v8.disableVertexAttribArray(v163);
      v164.buffer = null;
     }
     if (v164.x !== v160 || v164.y !== v161 || v164.z !== v162 || v164.w !== v159) {
      v8.vertexAttrib4f(v163, v160, v161, v162, v159);
      v164.x = v160;
      v164.y = v161;
      v164.z = v162;
      v164.w = v159;
     }
    }
    v166 = $3.call(this, v2, a0, 0);
    v8.uniform1f(charStep.location, v166);
    v167 = $4.call(this, v2, a0, 0);
    v8.uniform1f(em.location, v167);
    v168 = a0['align'];
    v8.uniform1f(align.location, v168);
    v169 = a0['baseline'];
    v8.uniform1f(baseline.location, v169);
    v170 = this['viewportArray'];
    v171 = v170[0];
    v172 = v170[1];
    v173 = v170[2];
    v174 = v170[3];
    v8.uniform4f(viewport.location, v171, v172, v173, v174);
    v175 = a0['color'];
    v176 = v175[0];
    v177 = v175[1];
    v178 = v175[2];
    v179 = v175[3];
    v8.uniform4f(color.location, v176, v177, v178, v179);
    v180 = $5.call(this, v2, a0, 0);
    v181 = v180[0];
    v182 = v180[1];
    v8.uniform2f(atlasSize.location, v181, v182);
    v183 = $6.call(this, v2, a0, 0);
    v184 = v183[0];
    v185 = v183[1];
    v8.uniform2f(atlasDim.location, v184, v185);
    v186 = this['scale'];
    v187 = v186[0];
    v188 = v186[1];
    v8.uniform2f(scale.location, v187, v188);
    v189 = this['translate'];
    v190 = v189[0];
    v191 = v189[1];
    v8.uniform2f(translate.location, v190, v191);
    v192 = a0['positionOffset'];
    v193 = v192[0];
    v194 = v192[1];
    v8.uniform2f(positionOffset.location, v193, v194);
    v195 = a0['opacity'];
    v8.uniform1f(opacity.location, v195);
    v196 = $7.call(this, v2, a0, 0);
    if (v196 && v196._reglType === 'framebuffer') {
     v196 = v196.color[0];
    }
    v197 = v196._texture;
    v8.uniform1i(atlas.location, v197.bind());
    v198 = v4.elements;
    if (v198) {
     v8.bindBuffer(34963, v198.buffer.buffer);
    }
    else if (v15.currentVAO) {
     v198 = v5.getElements(v15.currentVAO.elements);
     if (v198) v8.bindBuffer(34963, v198.buffer.buffer);
    }
    v199 = a0['offset'];
    v200 = a0['count'];
    if (v200) {
     v201 = v4.instances;
     if (v201 > 0) {
      if (v198) {
       v97.drawElementsInstancedANGLE(0, v200, v198.type, v199 << ((v198.type - 5121) >> 1), v201);
      }
      else {
       v97.drawArraysInstancedANGLE(0, v199, v200, v201);
      }
     }
     else if (v201 < 0) {
      if (v198) {
       v8.drawElements(0, v200, v198.type, v199 << ((v198.type - 5121) >> 1));
      }
      else {
       v8.drawArrays(0, v199, v200);
      }
     }
     v3.dirty = true;
     v15.setVAO(null);
     v2.viewportWidth = v95;
     v2.viewportHeight = v96;
     if (v99) {
      v1.destroyStream(v100);
     }
     if (v116) {
      v1.destroyStream(v117);
     }
     if (v133) {
      v1.destroyStream(v134);
     }
     if (v150) {
      v1.destroyStream(v151);
     }
     v197.unbind();
    }
   }
   , 'scope': function (a0, a1, a2) {
    var v202, v203, v204, v205, v206, v207, v208, v209, v210, v211, v212, v213, v214, v215, v216, v217, v218, v219, v220, v221, v222, v223, v224, v225, v226, v227, v228, v229, v230, v231, v232, v233, v234, v235, v236, v237, v238, v239, v240, v241, v242, v243, v244, v245, v246, v247, v248, v249, v250, v251, v252, v253, v254, v255, v256, v257, v258, v259, v260, v261, v262, v263, v264, v265, v266, v267, v268, v269, v270, v271, v272, v273, v274, v275, v276, v277, v278, v279, v280, v281, v282, v283, v284, v285, v286, v287, v288, v289, v290, v291, v292, v293, v294, v295, v296, v297, v298, v299, v300, v301, v302, v303, v304, v305, v306, v307, v308, v309, v310, v311, v312, v313, v314, v315, v316, v317, v318, v319, v320, v321, v322, v323, v324, v325, v326, v327, v328, v329, v330, v331, v332, v333, v334, v335, v336, v337, v338, v339, v340, v341, v342, v343, v344, v345, v346, v347, v348, v349, v350, v351, v352, v353, v354, v355, v356, v357, v358, v359, v360;
    v202 = this['viewport'];
    v203 = v202.x | 0;
    v204 = v202.y | 0;
    v205 = 'width' in v202 ? v202.width | 0 : (v2.framebufferWidth - v203);
    v206 = 'height' in v202 ? v202.height | 0 : (v2.framebufferHeight - v204);
    v207 = v2.viewportWidth;
    v2.viewportWidth = v205;
    v208 = v2.viewportHeight;
    v2.viewportHeight = v206;
    v209 = v38[0];
    v38[0] = v203;
    v210 = v38[1];
    v38[1] = v204;
    v211 = v38[2];
    v38[2] = v205;
    v212 = v38[3];
    v38[3] = v206;
    v213 = v16[0];
    v16[0] = 0;
    v214 = v16[1];
    v16[1] = 0;
    v215 = v16[2];
    v16[2] = 0;
    v216 = v16[3];
    v16[3] = 1;
    v217 = v10.blend_enable;
    v10.blend_enable = true;
    v218 = v20[0];
    v20[0] = 770;
    v219 = v20[1];
    v20[1] = 771;
    v220 = v20[2];
    v20[2] = 773;
    v221 = v20[3];
    v20[3] = 1;
    v222 = v10.depth_enable;
    v10.depth_enable = false;
    v223 = v10.stencil_enable;
    v10.stencil_enable = false;
    v224 = a0['offset'];
    v225 = v4.offset;
    v4.offset = v224;
    v226 = a0['count'];
    v227 = v4.count;
    v4.count = v226;
    v228 = v4.primitive;
    v4.primitive = 0;
    v229 = a0['align'];
    v230 = v14[64];
    v14[64] = v229;
    v231 = $8.call(this, v2, a0, a2);
    v232 = v14[69];
    v14[69] = v231;
    v233 = $9.call(this, v2, a0, a2);
    v234 = v14[67];
    v14[67] = v233;
    v235 = $10.call(this, v2, a0, a2);
    v236 = v14[66];
    v14[66] = v235;
    v237 = a0['baseline'];
    v238 = v14[65];
    v14[65] = v237;
    v239 = $11.call(this, v2, a0, a2);
    v240 = v14[62];
    v14[62] = v239;
    v241 = a0['color'];
    v242 = v14[14];
    v14[14] = v241;
    v243 = $12.call(this, v2, a0, a2);
    v244 = v14[63];
    v14[63] = v243;
    v245 = a0['opacity'];
    v246 = v14[10];
    v14[10] = v245;
    v247 = a0['positionOffset'];
    v248 = v14[68];
    v14[68] = v247;
    v249 = this['scale'];
    v250 = v14[6];
    v14[6] = v249;
    v251 = this['translate'];
    v252 = v14[8];
    v14[8] = v251;
    v253 = this['viewportArray'];
    v254 = v14[3];
    v14[3] = v253;
    v255 = this['charBuffer'];
    v256 = false;
    v257 = null;
    v258 = 0;
    v259 = false;
    v260 = 0;
    v261 = 0;
    v262 = 1;
    v263 = 0;
    v264 = 5126;
    v265 = 0;
    v266 = 0;
    v267 = 0;
    v268 = 0;
    if (v9(v255)) {
     v256 = true;
     v257 = v1.createStream(34962, v255);
     v264 = v257.dtype;
    }
    else {
     v257 = v1.getBuffer(v255);
     if (v257) {
      v264 = v257.dtype;
     }
     else if ('constant' in v255) {
      v262 = 2;
      if (typeof v255.constant === 'number') {
       v266 = v255.constant;
       v267 = v268 = v265 = 0;
      }
      else {
       v266 = v255.constant.length > 0 ? v255.constant[0] : 0;
       v267 = v255.constant.length > 1 ? v255.constant[1] : 0;
       v268 = v255.constant.length > 2 ? v255.constant[2] : 0;
       v265 = v255.constant.length > 3 ? v255.constant[3] : 0;
      }
     }
     else {
      if (v9(v255.buffer)) {
       v257 = v1.createStream(34962, v255.buffer);
      }
      else {
       v257 = v1.getBuffer(v255.buffer);
      }
      v264 = 'type' in v255 ? v43[v255.type] : v257.dtype;
      v259 = !!v255.normalized;
      v261 = v255.size | 0;
      v260 = v255.offset | 0;
      v263 = v255.stride | 0;
      v258 = v255.divisor | 0;
     }
    }
    v269 = $13.buffer;
    $13.buffer = v257;
    v270 = $13.divisor;
    $13.divisor = v258;
    v271 = $13.normalized;
    $13.normalized = v259;
    v272 = $13.offset;
    $13.offset = v260;
    v273 = $13.size;
    $13.size = v261;
    v274 = $13.state;
    $13.state = v262;
    v275 = $13.stride;
    $13.stride = v263;
    v276 = $13.type;
    $13.type = v264;
    v277 = $13.w;
    $13.w = v265;
    v278 = $13.x;
    $13.x = v266;
    v279 = $13.y;
    $13.y = v267;
    v280 = $13.z;
    $13.z = v268;
    v281 = this['sizeBuffer'];
    v47.buffer = v281;
    v282 = false;
    v283 = null;
    v284 = 0;
    v285 = false;
    v286 = 0;
    v287 = 0;
    v288 = 1;
    v289 = 0;
    v290 = 5126;
    v291 = 0;
    v292 = 0;
    v293 = 0;
    v294 = 0;
    if (v9(v47)) {
     v282 = true;
     v283 = v1.createStream(34962, v47);
     v290 = v283.dtype;
    }
    else {
     v283 = v1.getBuffer(v47);
     if (v283) {
      v290 = v283.dtype;
     }
     else if ('constant' in v47) {
      v288 = 2;
      if (typeof v47.constant === 'number') {
       v292 = v47.constant;
       v293 = v294 = v291 = 0;
      }
      else {
       v292 = v47.constant.length > 0 ? v47.constant[0] : 0;
       v293 = v47.constant.length > 1 ? v47.constant[1] : 0;
       v294 = v47.constant.length > 2 ? v47.constant[2] : 0;
       v291 = v47.constant.length > 3 ? v47.constant[3] : 0;
      }
     }
     else {
      if (v9(v47.buffer)) {
       v283 = v1.createStream(34962, v47.buffer);
      }
      else {
       v283 = v1.getBuffer(v47.buffer);
      }
      v290 = 'type' in v47 ? v43[v47.type] : v283.dtype;
      v285 = !!v47.normalized;
      v287 = v47.size | 0;
      v286 = v47.offset | 0;
      v289 = v47.stride | 0;
      v284 = v47.divisor | 0;
     }
    }
    v295 = $14.buffer;
    $14.buffer = v283;
    v296 = $14.divisor;
    $14.divisor = v284;
    v297 = $14.normalized;
    $14.normalized = v285;
    v298 = $14.offset;
    $14.offset = v286;
    v299 = $14.size;
    $14.size = v287;
    v300 = $14.state;
    $14.state = v288;
    v301 = $14.stride;
    $14.stride = v289;
    v302 = $14.type;
    $14.type = v290;
    v303 = $14.w;
    $14.w = v291;
    v304 = $14.x;
    $14.x = v292;
    v305 = $14.y;
    $14.y = v293;
    v306 = $14.z;
    $14.z = v294;
    v307 = this['position'];
    v308 = false;
    v309 = null;
    v310 = 0;
    v311 = false;
    v312 = 0;
    v313 = 0;
    v314 = 1;
    v315 = 0;
    v316 = 5126;
    v317 = 0;
    v318 = 0;
    v319 = 0;
    v320 = 0;
    if (v9(v307)) {
     v308 = true;
     v309 = v1.createStream(34962, v307);
     v316 = v309.dtype;
    }
    else {
     v309 = v1.getBuffer(v307);
     if (v309) {
      v316 = v309.dtype;
     }
     else if ('constant' in v307) {
      v314 = 2;
      if (typeof v307.constant === 'number') {
       v318 = v307.constant;
       v319 = v320 = v317 = 0;
      }
      else {
       v318 = v307.constant.length > 0 ? v307.constant[0] : 0;
       v319 = v307.constant.length > 1 ? v307.constant[1] : 0;
       v320 = v307.constant.length > 2 ? v307.constant[2] : 0;
       v317 = v307.constant.length > 3 ? v307.constant[3] : 0;
      }
     }
     else {
      if (v9(v307.buffer)) {
       v309 = v1.createStream(34962, v307.buffer);
      }
      else {
       v309 = v1.getBuffer(v307.buffer);
      }
      v316 = 'type' in v307 ? v43[v307.type] : v309.dtype;
      v311 = !!v307.normalized;
      v313 = v307.size | 0;
      v312 = v307.offset | 0;
      v315 = v307.stride | 0;
      v310 = v307.divisor | 0;
     }
    }
    v321 = $15.buffer;
    $15.buffer = v309;
    v322 = $15.divisor;
    $15.divisor = v310;
    v323 = $15.normalized;
    $15.normalized = v311;
    v324 = $15.offset;
    $15.offset = v312;
    v325 = $15.size;
    $15.size = v313;
    v326 = $15.state;
    $15.state = v314;
    v327 = $15.stride;
    $15.stride = v315;
    v328 = $15.type;
    $15.type = v316;
    v329 = $15.w;
    $15.w = v317;
    v330 = $15.x;
    $15.x = v318;
    v331 = $15.y;
    $15.y = v319;
    v332 = $15.z;
    $15.z = v320;
    v333 = this['sizeBuffer'];
    v48.buffer = v333;
    v334 = false;
    v335 = null;
    v336 = 0;
    v337 = false;
    v338 = 0;
    v339 = 0;
    v340 = 1;
    v341 = 0;
    v342 = 5126;
    v343 = 0;
    v344 = 0;
    v345 = 0;
    v346 = 0;
    if (v9(v48)) {
     v334 = true;
     v335 = v1.createStream(34962, v48);
     v342 = v335.dtype;
    }
    else {
     v335 = v1.getBuffer(v48);
     if (v335) {
      v342 = v335.dtype;
     }
     else if ('constant' in v48) {
      v340 = 2;
      if (typeof v48.constant === 'number') {
       v344 = v48.constant;
       v345 = v346 = v343 = 0;
      }
      else {
       v344 = v48.constant.length > 0 ? v48.constant[0] : 0;
       v345 = v48.constant.length > 1 ? v48.constant[1] : 0;
       v346 = v48.constant.length > 2 ? v48.constant[2] : 0;
       v343 = v48.constant.length > 3 ? v48.constant[3] : 0;
      }
     }
     else {
      if (v9(v48.buffer)) {
       v335 = v1.createStream(34962, v48.buffer);
      }
      else {
       v335 = v1.getBuffer(v48.buffer);
      }
      v342 = 'type' in v48 ? v43[v48.type] : v335.dtype;
      v337 = !!v48.normalized;
      v339 = v48.size | 0;
      v338 = v48.offset | 0;
      v341 = v48.stride | 0;
      v336 = v48.divisor | 0;
     }
    }
    v347 = $16.buffer;
    $16.buffer = v335;
    v348 = $16.divisor;
    $16.divisor = v336;
    v349 = $16.normalized;
    $16.normalized = v337;
    v350 = $16.offset;
    $16.offset = v338;
    v351 = $16.size;
    $16.size = v339;
    v352 = $16.state;
    $16.state = v340;
    v353 = $16.stride;
    $16.stride = v341;
    v354 = $16.type;
    $16.type = v342;
    v355 = $16.w;
    $16.w = v343;
    v356 = $16.x;
    $16.x = v344;
    v357 = $16.y;
    $16.y = v345;
    v358 = $16.z;
    $16.z = v346;
    v359 = v11.vert;
    v11.vert = 61;
    v360 = v11.frag;
    v11.frag = 60;
    v3.dirty = true;
    a1(v2, a0, a2);
    v2.viewportWidth = v207;
    v2.viewportHeight = v208;
    v38[0] = v209;
    v38[1] = v210;
    v38[2] = v211;
    v38[3] = v212;
    v16[0] = v213;
    v16[1] = v214;
    v16[2] = v215;
    v16[3] = v216;
    v10.blend_enable = v217;
    v20[0] = v218;
    v20[1] = v219;
    v20[2] = v220;
    v20[3] = v221;
    v10.depth_enable = v222;
    v10.stencil_enable = v223;
    v4.offset = v225;
    v4.count = v227;
    v4.primitive = v228;
    v14[64] = v230;
    v14[69] = v232;
    v14[67] = v234;
    v14[66] = v236;
    v14[65] = v238;
    v14[62] = v240;
    v14[14] = v242;
    v14[63] = v244;
    v14[10] = v246;
    v14[68] = v248;
    v14[6] = v250;
    v14[8] = v252;
    v14[3] = v254;
    if (v256) {
     v1.destroyStream(v257);
    }
    $13.buffer = v269;
    $13.divisor = v270;
    $13.normalized = v271;
    $13.offset = v272;
    $13.size = v273;
    $13.state = v274;
    $13.stride = v275;
    $13.type = v276;
    $13.w = v277;
    $13.x = v278;
    $13.y = v279;
    $13.z = v280;
    if (v282) {
     v1.destroyStream(v283);
    }
    $14.buffer = v295;
    $14.divisor = v296;
    $14.normalized = v297;
    $14.offset = v298;
    $14.size = v299;
    $14.state = v300;
    $14.stride = v301;
    $14.type = v302;
    $14.w = v303;
    $14.x = v304;
    $14.y = v305;
    $14.z = v306;
    if (v308) {
     v1.destroyStream(v309);
    }
    $15.buffer = v321;
    $15.divisor = v322;
    $15.normalized = v323;
    $15.offset = v324;
    $15.size = v325;
    $15.state = v326;
    $15.stride = v327;
    $15.type = v328;
    $15.w = v329;
    $15.x = v330;
    $15.y = v331;
    $15.z = v332;
    if (v334) {
     v1.destroyStream(v335);
    }
    $16.buffer = v347;
    $16.divisor = v348;
    $16.normalized = v349;
    $16.offset = v350;
    $16.size = v351;
    $16.state = v352;
    $16.stride = v353;
    $16.type = v354;
    $16.w = v355;
    $16.x = v356;
    $16.y = v357;
    $16.z = v358;
    v11.vert = v359;
    v11.frag = v360;
    v3.dirty = true;
   }
   ,
  }

 }
}
