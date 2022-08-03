<script>
// Added by Verrazzano
import DeploymentStrategy from '@/components/verrazzano/DeploymentStrategy.vue';
import Labels from '@/components/verrazzano/Labels';
import LabeledInput from '@/components/form/LabeledInput.vue';
import HelidonWorkloadHelper from '@/mixins/verrazzano/helidon-workload-helper';
import TreeTabbed from '@/components/verrazzano/TreeTabbed';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import PodSpec from '@/components/verrazzano/PodSpec';
export default {
  name:       'CruVerrazzanoHelidonWorkload',
  components: {
    DeploymentStrategy, TreeTabbed, TreeTab, PodSpec, Labels, LabeledInput
  },

  mixins: [HelidonWorkloadHelper],

  props:    {
    mode: {
      type:    String,
      default: 'create'
    },
    value: {
      type:     Object,
      required: true
    },
  },

  methods: {
    initSpec() {
      this.$set(this.value, 'spec', {
        workload: {
          apiVersion: this.verrazzanoComponentApiVersion,
          kind:       'VerrazzanoHelidonWorkload',
          spec:       { deploymentTemplate: { podSpec: { } } }
        }
      });
    },
  },

};
</script>

<template>
  <div>
    <form>
      <TreeTabbed :side-tabs="false">
        <template #nestedTabs>
          <TreeTab :label="t('verrazzano.common.tabs.workload')" name="workload">
            <template #default>
              <div class="row">
                <div class="col span-4">
                  <LabeledInput
                    :value="getWorkloadMetadataField('name')"
                    :mode="mode"
                    :placeholder="getWorkloadMetadataNotSetPlaceholder('name')"
                    :label="t('verrazzano.helidon.fields.workloadName')"
                    @input="setWorkloadMetadataFieldIfNotEmpty('name', $event)"
                  />
                </div>
              </div>
              <div class="spacer" />
              <div>
                <Labels v-model="workloadMetadata" :mode="mode" />
              </div>
            </template>
          </TreeTab>

          <TreeTab :label="t('verrazzano.helidon.tabs.deployment')" name="deployment">
            <template #default>
              <div class="row">
                <div class="col span-4">
                  <LabeledInput
                    :value="getWorkloadDeploymentTemplateMetadataField('name')"
                    :mode="mode"
                    :placeholder="getWorkloadDeploymentTemplateMetadataNotSetPlaceholder('name')"
                    :label="t('verrazzano.helidon.fields.deploymentTemplateName')"
                    @input="setWorkloadDeploymentTemplateMetadataField('name', $event)"
                  />
                </div>
              </div>
              <div class="spacer" />
              <div>
                <Labels v-model="workloadDeploymentTemplateMetadata" :mode="mode" />
              </div>
            </template>
            <template #nestedTabs>
              <TreeTab :label="t('verrazzano.helidon.tabs.strategy')" name="strategy">
                <DeploymentStrategy
                  :value="getWorkloadDeploymentTemplateField('strategy')"
                  :mode="mode"
                  @input="setFieldIfNotEmpty('strategy', $event)"
                />
              </TreeTab>
              <TreeTab :label="t('verrazzano.helidon.tabs.podSpec')" name="podSpec">
                <PodSpec
                  :value="getWorkloadDeploymentTemplateField('podSpec')"
                  :mode="mode"
                  :namespaced-object="value"
                  @input="setWorkloadDeploymentTemplateField('podSpec', $event)"
                />
              </TreeTab>
            </template>
          </TreeTab>
        </template>
      </TreeTabbed>
    </form>
  </div>
</template>
