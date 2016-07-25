import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ColaboradoresController } from '../../../api/Colaboradores/controller.js';
import { Message } from '../../utils/message';
import { formGen } from '../../utils/formGenerator';
import { UtilsView } from '../../utils/ViewUtils';
import './Colaboradores.html';

let template;

Template.Colaboradores.onCreated(() => {
  template = Template.instance();
  template.data.canUserInsert = ColaboradoresController.canUserDo('insert');
  UtilsView.applySubscribe(ColaboradoresController, 'view', template, '', function () {
      }
  );

});
Template.Colaboradores.onRendered(() => {
  template = Template.instance();

});
Template.Colaboradores.helpers({});

Template.ColaboradoresAdd.onRendered(() => {
  //Jquery Validation - https://jqueryvalidation.org/validate

  formGen.formRender('formContext', true, ColaboradoresController, 'insert', '', 'formTag');

  // Set options for cropper plugin

  var $image = $(".image-crop > img")
  $($image).cropper({
    aspectRatio: 1.1,
    preview: ".img-preview",
    background: true,
    done: function (data) {
      // Output the result data for cropping image.
    }
  });

  var $inputImage = $("#inputImage");
  if (window.FileReader) {
    $inputImage.change(function () {
      var fileReader = new FileReader(),
          files = this.files,
          file;

      if (!files.length) {
        return;
      }

      file = files[0];

      if (/^image\/\w+$/.test(file.type)) {
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
          $inputImage.val("");
          $image.cropper("reset", true).cropper("replace", this.result);
        };
      } else {
        showMessage("Please choose an image file.");
      }
    });
  } else {
    $inputImage.addClass("hide");
  }

  $("#salvar").click(function () {
    window.open($image.cropper("getDataURL"));
  });
  $("#zoomIn").click(function () {
    $image.cropper("zoom", 0.1);
  });
  $("#zoomOut").click(function () {
    $image.cropper("zoom", -0.1);
  });
  $("#rotateLeft").click(function () {
    $image.cropper("rotate", 45);
  });
  $("#rotateRight").click(function () {
    $image.cropper("rotate", -45);
  });
  $("#setDrag").click(function () {
    $image.cropper("setDragMode", "crop");
  });
  $("#moveUp").click(function () {
    $image.cropper("move", 0, -10);
  });
  $("#moveDown").click(function () {
    $image.cropper("move", 0, 10);
  });
  $("#moveLeft").click(function () {
    $image.cropper("move", -10, 0);
  });
  $("#moveRight").click(function () {
    $image.cropper("move", 10, 0);
  });

  $('#myModal').modal('show');

});
Template.ColaboradoresAdd.events({
  'click a[id="testeModal"]': function () {
    UtilsView.showModalWithTemplateHTML("<div>Ola</div>", {});
  },

  //Eventos do template de inserção
  'submit form'(event, templateInstance){
    event.preventDefault();
    const ColaboradoresData = formGen.getFormData(ColaboradoresController, 'insert', templateInstance);

    ColaboradoresController.insert(ColaboradoresData, (error, data) => {
      if (error) {
        Message.showErro(error);

      } else {
        Message.showSuccessNotification(' inserido com sucesso!');
        FlowRouter.go('/ColaboradoresView/' + data);
      }

    });
  }
});

Template.ColaboradoresView.onCreated(() => {
  let template = Template.instance();
  let id = FlowRouter.getParam('_id');
  template.data.canUserUpdate = ColaboradoresController.canUserDo('update');
  template.data.canUserRemove = ColaboradoresController.canUserDo('remove');
  template.data.canUserAccessActions = ColaboradoresController.canUserDo('update') || ColaboradoresController.canUserDo('remove');

  UtilsView.applySubscribe(ColaboradoresController, 'view', template, id, ()=> {
    template.collectionData = ColaboradoresController.get({ _id: id });
    formGen.formViewRender('formContext', ColaboradoresController, 'view', id);
  });

});
Template.ColaboradoresView.onRendered(() => {

});
Template.ColaboradoresView.helpers({
  'collectionData': () => {
    let id = FlowRouter.getParam('_id');
    return ColaboradoresController.get({ _id: id });
  },
});

Template.ColaboradoresView.events({

  //Eventos do template de inserção
  'click #linkExcluir'(event, template) {
    let sel = event.target;
    let id = sel.getAttribute('value');

    Message.showConfirmation('Remover o Colaboradores?', 'Não é possível recuperar um Colaboradores removido!',
        'Sim, remover!', (erro, confirm) => {
          if (confirm) {
            ColaboradoresController.remove(id, (error, data) => {
              if (error) {
                Message.showErro(error);

              } else {
                FlowRouter.go('Colaboradores');
                Message.showSuccessNotification('O Colaboradores foi removido com sucesso!');
              }
            });
          }
        });
  },
});

Template.ColaboradoresEdit.onCreated(() => {
  let template = Template.instance();
  let id = FlowRouter.getParam('_id');

  UtilsView.applySubscribe(ColaboradoresController, 'update', template, id, ()=> {
    template.collectionData = ColaboradoresController.get({ _id: id });
    formGen.formRender('formContext', true, ColaboradoresController, 'update', id, 'formTag');
  });

});
Template.ColaboradoresEdit.onRendered(() => {

});
Template.ColaboradoresEdit.helpers({
  'collectionData': () => {
    let id = FlowRouter.getParam('_id');
    return ColaboradoresController.get({ _id: id });
  },
});
Template.ColaboradoresEdit.events({

  //Eventos do template de inserção
  'submit form'(event, template) {
    event.preventDefault();
    const id = FlowRouter.getParam('_id');
    const ColaboradoresData = formGen.getFormData(ColaboradoresController, 'update', template);

    ColaboradoresController.update(id, ColaboradoresData, (error, data) => {
      if (error) {
        Message.showErro(error);

      } else {
        Message.showSuccessNotification('O Cliente foi atualizado com sucesso!');
        FlowRouter.go('/ColaboradoresView/' + id);
      }

    });
  },
});

Template.ColaboradoresList.onCreated(() => {
  template = Template.instance();
  UtilsView.applySubscribe(ColaboradoresController, 'tableview', template, '', function () {
  });
});

let dataTableData = function () {

  return ColaboradoresController.getAll().fetch();

};

let optionsObject = UtilsView.getDataTableConfig(ColaboradoresController, 'tableview');

Template.ColaboradoresList.helpers({
  reactiveDataFunction: function () {

    return dataTableData;
  },
  optionsObject: optionsObject,
});
Template.ColaboradoresList.onRendered(() => {

});
Template.ColaboradoresList.events({});