// Added by Verrazzano
import BaseVerrazzanoHelper from '~/mixins/verrazzano/base-verrazzano-helper';
import NavigationHelper from '~/mixins/verrazzano/navigation-helper';

export default {
  mixins:   [BaseVerrazzanoHelper, NavigationHelper],
  computed: {
    workloadTemplateSpec: {
      get() {
        return this.get(this.value, 'spec.workload.spec.template.spec');
      },
      set(neu) {
        this.set(this.value, 'spec.workload.spec.template.spec', neu);
      },
    },
    workloadTemplateMetadata: {
      get() {
        return this.get(this.value, 'spec.workload.spec.template.metadata');
      },
      set(neu) {
        this.set(this.value, 'spec.workload.spec.template.metadata', neu);
      },
    },
  },
  methods: {
    getWorkloadMetadataField(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.template.metadata.${ fieldName }` : 'spec.workload.spec.template.metadata';

      return this.getField(pathName);
    },
    getWorkloadSpecField(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      return this.getField(pathName);
    },
    getWorkloadSpecListField(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      return this.getListField(pathName);
    },
    getWorkloadMetadataNotSetPlaceholder(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.template.metadata.${ fieldName }` : 'spec.workload.spec.template.metadata';

      return this.getNotSetPlaceholder(this.value, pathName);
    },
    getWorkloadSpecNotSetPlaceholder(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      return this.getNotSetPlaceholder(this.value, pathName);
    },
    setWorkloadMetadataField(fieldName, neu) {
      const pathName = fieldName ? `spec.workload.spec.template.metadata.${ fieldName }` : 'spec.workload.spec.template.metadata';

      this.setField(pathName, neu);
    },
    setWorkloadSpecField(fieldName, neu) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      this.setField(pathName, neu);
    },
    setWorkloadSpecBooleanField(fieldName, neu) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      this.setBooleanField(pathName, neu);
    },
    setWorkloadSpecNumberField(fieldName, neu) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      this.setNumberField(pathName, neu);
    },
    setWorkloadSpecFieldIfNotEmpty(fieldName, neu) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      this.setFieldIfNotEmpty(pathName, neu);
      this.$emit('input', this.value);
    },
    showWorkloadSpecListRemoveButton(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.template.spec.${ fieldName }` : 'spec.workload.spec.template.spec';

      return this.showListRemoveButton(pathName);
    },
  }
};
