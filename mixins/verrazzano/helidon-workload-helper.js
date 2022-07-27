// Added by Verrazzano
import OamComponentHelper from '~/mixins/verrazzano/oam-component-helper';

export default {
  mixins:   [OamComponentHelper],
  computed: {
    workloadDeploymentTemplate: {
      get() {
        return this.get(this.value, 'spec.workload.spec.deploymentTemplate');
      },
      set(neu) {
        this.set(this.value, 'spec.workload.spec.deploymentTemplate', neu);
      }
    },
    workloadDeploymentTemplateMetadata: {
      get() {
        return this.get(this.value, 'spec.workload.spec.deploymentTemplate.metadata');
      },
      set(neu) {
        this.set(this.value, 'spec.workload.spec.deploymentTemplate.metadata', neu);
      }
    },
  },
  methods: {
    getWorkloadDeploymentTemplateField(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.${ fieldName }` : 'spec.workload.spec.deploymentTemplate';

      return this.getField(pathName);
    },
    getWorkloadDeploymentTemplateMetadataField(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.metadata.${ fieldName }` : 'spec.workload.spec.deploymentTemplate.metadata';

      return this.getField(pathName);
    },
    getWorkloadDeploymentTemplateNotSetPlaceholder(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.${ fieldName }` : 'spec.workload.spec.deploymentTemplate';

      return this.getNotSetPlaceholder(this.value, pathName);
    },
    getWorkloadDeploymentTemplateMetadataNotSetPlaceholder(fieldName) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.metadata.${ fieldName }` : 'spec.workload.spec.deploymentTemplate.metadata';

      return this.getNotSetPlaceholder(this.value, pathName);
    },
    setWorkloadDeploymentTemplateField(fieldName, value) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.${ fieldName }` : 'spec.workload.spec.deploymentTemplate';

      this.setField(pathName, value);
    },
    setWorkloadDeploymentTemplateFieldIfNotEmpty(fieldName, value) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.${ fieldName }` : 'spec.workload.spec.deploymentTemplate';

      this.setFieldIfNotEmpty(pathName, value);
    },
    setWorkloadDeploymentTemplateMetadataField(fieldName, value) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.metadata.${ fieldName }` : 'spec.workload.spec.deploymentTemplate.metadata';

      this.setField(pathName, value);
    },
    setWorkloadDeploymentTemplateMetadataFieldIfNotEmpty(fieldName, value) {
      const pathName = fieldName ? `spec.workload.spec.deploymentTemplate.metadata.${ fieldName }` : 'spec.workload.spec.deploymentTemplate.metadata';

      this.setFieldIfNotEmpty(pathName, value);
    },
  }
};
