<script>
// Added by Verrazzano
import { cleanUp, set, get } from '@/utils/object';
import {
  CONFIG_MAP, SECRET, NODE, SERVICE, PVC, SERVICE_ACCOUNT
} from '@/config/types';
import Tab from '@/components/Tabbed/Tab';
import CreateEditView from '@/mixins/create-edit-view';
import { allHash } from '@/utils/promise';
import LabeledSelect from '@/components/form/LabeledSelect';
import LabeledInput from '@/components/form/LabeledInput';
import ServiceNameSelect from '@/components/form/ServiceNameSelect';
import HealthCheck from '@/components/form/HealthCheck';
import Security from '@/components/form/Security';
import Loading from '@/components/Loading';
import Networking from '@/components/form/Networking';
import { _EDIT, _CREATE, _VIEW } from '@/config/query-params';
import WorkloadPorts from '@/components/form/WorkloadPorts';
import ContainerResourceLimit from '@/components/ContainerResourceLimit';
import Tabbed from '@/components/Tabbed';
import { mapGetters } from 'vuex';
import Tolerations from '@/components/form/Tolerations';
import Command from '@/components/form/Command';
import LifecycleHooks from '@/components/form/LifecycleHooks';
import Storage from '@/edit/workload/storage';
import { removeObject } from '@/utils/array';
import { BEFORE_SAVE_HOOKS } from '@/mixins/child-hook';
import Affinity from '@/components/verrazzano/Affinity';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import NotSetPlaceholder from '@/mixins/verrazzano/not-set-placeholder';

const TAB_WEIGHT_MAP = {
  general:              99,
  healthCheck:          98,
  networking:           96,
  scheduling:           94,
  resources:            93,
  upgrading:            92,
  securityContext:      91,
  storage:              90,
};

export default {
  components: {
    Loading,
    LabeledSelect,
    LabeledInput,
    ServiceNameSelect,
    Tabbed,
    Tab,
    Networking,
    HealthCheck,
    Security,
    WorkloadPorts,
    ContainerResourceLimit,
    Tolerations,
    Command,
    LifecycleHooks,
    Storage,
    Affinity,
  },

  mixins: [CreateEditView, VerrazzanoHelper, NotSetPlaceholder],

  props: {
    value: {
      type:     Object,
      required: true
    },

    mode: {
      type:    String,
      default: 'create'
    }
  },

  async fetch() {
    const requests = {
      configMaps: this.$store.dispatch('cluster/findAll', { type: CONFIG_MAP }),
      nodes:      this.$store.dispatch('cluster/findAll', { type: NODE }),
      services:   this.$store.dispatch('cluster/findAll', { type: SERVICE }),
      pvcs:       this.$store.dispatch('cluster/findAll', { type: PVC }),
      sas:        this.$store.dispatch('cluster/findAll', { type: SERVICE_ACCOUNT })
    };

    if ( this.$store.getters['cluster/schemaFor'](SECRET) ) {
      requests.secrets = this.$store.dispatch('cluster/findAll', { type: SECRET });
    }

    const hash = await allHash(requests);

    this.servicesOwned = []; /* await this.value.getServicesOwned(); */

    this.allSecrets = hash.secrets || [];
    this.allConfigMaps = hash.configMaps;
    this.allNodes = hash.nodes.map(node => node.id);
    this.allServices = hash.services;
    this.pvcs = hash.pvcs;
    this.sas = hash.sas;
  },

  data() {
    let type = this.$route.params.resource;
    const createSidecar = !!this.$route.query.sidecar;

    if (type === 'workload') {
      type = null;
    }

    if (!this.value.spec) {
      this.value.spec = {};
    }

    const spec = this.value.spec;
    let container;
    const podTemplateSpec = spec?.workload?.spec?.deploymentTemplate?.podSpec;

    let containers = podTemplateSpec?.containers || [];
    const initContainers = podTemplateSpec?.initContainers || [];
    const ephemeralContainers = podTemplateSpec?.ephemeralContainers || [];

    if (this.mode === _CREATE || this.mode === _VIEW || (!createSidecar && !this.value.hasSidecars)) {
      if (containers.length > 0) {
        container = containers[0];
      } else if (initContainers.length > 0) {
        container = initContainers[0];
      } else if (ephemeralContainers.length > 0) {
        container = ephemeralContainers[0];
      }
    } else {
      const allContainers = [...podTemplateSpec.initContainers, ...podTemplateSpec.containers, ...podTemplateSpec.ephemeralContainers];

      if (this.$route.query.init) {
        podTemplateSpec.initContainers.push({ imagePullPolicy: 'Always', name: `container-${ allContainers.length }` });
        containers = podTemplateSpec.initContainers;
      }
      if (createSidecar) {
        container = { imagePullPolicy: 'Always', name: `container-${ allContainers.length }` };
        containers.push(container);
      } else {
        container = containers[0];
      }
    }

    this.container = container;

    return {
      allConfigMaps:     [],
      allNodes:          null,
      allSecrets:        [],
      allServices:       [],
      name:              this.value?.metadata?.name || null,
      pvcs:              [],
      sas:               [],
      showTabs:          false,
      pullPolicyOptions: ['Always', 'IfNotPresent', 'Never'],
      spec,
      type,
      servicesOwned:     [],
      servicesToRemove:    [],
      portsForServices:  [],
      container,
      containerChange:   0,
      podFsGroup:        podTemplateSpec?.securityContext?.fsGroup,
      savePvcHookName:   'savePvcHook',
      tabWeightMap:      TAB_WEIGHT_MAP,
    };
  },

  computed: {

    containerKind: {
      get() {
        if (this.isEphemeralContainer) {
          return 'ephemeral';
        } else if (this.isInitContainer) {
          return 'init';
        } else {
          return 'standard';
        }
      },
      set() {}
    },

    isEdit() {
      return this.mode === _EDIT;
    },

    isInitContainer: {
      get() {
        const self = this;

        if (!this.podTemplateSpec.initContainers) {
          return false;
        }

        return this.podTemplateSpec.initContainers.findIndex((e) => {
          const r = e === self.container;

          return r;
        } ) !== -1;
      },
      set(newInitContainer) {

      }
    },

    isEphemeralContainer: {
      get() {
        const self = this;

        if (!this.podTemplateSpec.ephemeralContainers) {
          return false;
        }

        return this.podTemplateSpec.ephemeralContainers.findIndex((e) => {
          const r = e === self.container;

          return r;
        } ) !== -1;
      },
      set(newEphemeralContainer) {

      }
    },

    podTemplateSpec: {
      get() {
        return this.spec?.workload?.spec?.deploymentTemplate?.podSpec || {};
      },
      set(neu) {
        this.$set(this.spec.workload.spec.deploymentTemplate, 'podSpec', neu);
      }
    },

    allContainers() {
      const containers = this.podTemplateSpec?.containers || [];
      const initContainers = this.podTemplateSpec?.initContainers || [];
      const ephemeralContainers = this.podTempSpec?.ephemeralContainers || [];

      return [...containers, ...initContainers, ...ephemeralContainers];
    },

    flatResources: {
      get() {
        const { limits = {}, requests = {} } = this.container.resources || {};
        const { cpu:limitsCpu, memory:limitsMemory } = limits;
        const { cpu:requestsCpu, memory:requestsMemory } = requests;

        return {
          limitsCpu, limitsMemory, requestsCpu, requestsMemory
        };
      },
      set(neu) {
        const {
          limitsCpu, limitsMemory, requestsCpu, requestsMemory
        } = neu;

        const out = {
          requests: {
            cpu:    requestsCpu,
            memory: requestsMemory
          },
          limits: {
            cpu:    limitsCpu,
            memory: limitsMemory
          }
        };

        this.$set(this.container, 'resources', cleanUp(out));
      }
    },

    healthCheck: {
      get() {
        const { readinessProbe, livenessProbe, startupProbe } = this.container;

        return {
          readinessProbe, livenessProbe, startupProbe
        };
      },
      set(neu) {
        Object.assign(this.container, neu);
      }
    },

    schema() {
      return this.$store.getters['cluster/schemaFor'](this.type);
    },

    namespacedSecrets() {
      const namespace = this.value?.metadata?.namespace;

      if (namespace) {
        return this.allSecrets.filter(
          secret => secret.metadata.namespace === namespace
        );
      } else {
        return this.allSecrets;
      }
    },

    namespacedConfigMaps() {
      const namespace = this.value?.metadata?.namespace;

      if (namespace) {
        return this.allConfigMaps.filter(
          configMap => configMap.metadata.namespace === namespace
        );
      } else {
        return this.allConfigMaps;
      }
    },

    namespacedServiceNames() {
      const { namespace } = this.value?.metadata;

      if (namespace) {
        return this.sas.filter(
          serviceName => serviceName.metadata.namespace === namespace
        );
      } else {
        return this.sas;
      }
    },

    containerOptions() {
      return this.allContainers;
    },

    ...mapGetters({ t: 'i18n/t' })
  },

  methods: {
    updateContainerKind(neu) {
      if (!this.container) {
        return;
      }

      this.containerKind = neu;
      const containers = this.podTemplateSpec.containers || [];
      const initContainers = this.podTemplateSpec.initContainers || [];
      const ephemeralContainers = this.podTemplateSpec.ephemeralContainers || [];

      if (this.isInitContainer) {
        if (neu === 'init') {
          return;
        }
        removeObject(initContainers, this.container);
      } else if (this.isEphemeralContainer) {
        if (neu === 'ephemeral') {
          return;
        }
        removeObject(ephemeralContainers, this.container);
      } else {
        if (neu === 'standard') {
          return;
        }
        removeObject(containers, this.container);
      }

      switch (neu) {
      case 'standard':
        break;
      case 'init':
        initContainers.push(this.container);

        if (!this.podTemplateSpec.initContainers) {
          set(this.spec, 'workload.spec.deploymentTemplate.podSpec.initContainers', initContainers);
        }
        break;
      case 'ephemeral':
        ephemeralContainers.push(this.container);
        if (!this.podTemplateSpec.ephemeralContainers) {
          set(this.spec, 'workload.spec.deploymentTemplate.podSpec.ephemeralContainers', ephemeralContainers);
        }
        break;
      default:
        containers.push(this.container);

        if (!this.podTemplateSpec.containers) {
          set(this.spec, 'workload.spec.deploymentTemplate.podSpec.containers', containers);
        }
      }
    },

    fixPodSecurityContext(podTempSpec) {
      if (this.podFsGroup) {
        podTempSpec.securityContext = podTempSpec?.securityContext || {};
        podTempSpec.securityContext.fsGroup = this.podFsGroup;
      } else {
        if (podTempSpec.securityContext?.fsGroup) {
          delete podTempSpec.securityContext.fsGroup;
        }
        if (Object.keys(podTempSpec.securityContext || {}).length === 0) {
          delete podTempSpec.securityContext;
        }
      }
    },

    selectType(type) {
      if (!this.type && type) {
        this.$router.replace({ params: { resource: type } });
      } else {
        this.type = type;
      }
    },

    selectContainer(container) {
      this.container = container;
      this.containerChange++;
    },

    addContainer() {
      let nameNumber = this.allContainers.length;
      const allNames = this.allContainers.reduce((names, each) => {
        names.push(each.name);

        return names;
      }, []);

      while (allNames.includes(`container-${ nameNumber }`)) {
        nameNumber++;
      }
      const container = { name: `container-${ nameNumber }` };

      if (!this.podTemplateSpec.containers) {
        set(this.spec, 'workload.spec.deploymentTemplate.podSpec.containers', [container]);
      } else {
        this.podTemplateSpec.containers.push(container);
      }
      this.selectContainer(container);
    },

    removeContainer(container) {
      if (this.podTemplateSpec.initContainers && this.podTemplateSpec.initContainers.findIndex(e => e === container) !== -1) {
        removeObject(this.podTemplateSpec.initContainers, container);
      }

      if (this.podTemplateSpec.containers && this.podTemplateSpec.containers.findIndex(e => e === container) !== -1) {
        removeObject(this.podTemplateSpec.containers, container);
      }

      this.selectContainer(this.allContainers.length > 0 ? this.allContainers[0] : undefined);
    },

    updateInitContainer(neu) {
      if (!this.container) {
        return;
      }
      const containers = this.podTemplateSpec.containers;

      if (neu) {
        if (!this.podTemplateSpec.initContainers) {
          this.podTemplateSpec.initContainers = [];
        }
        this.podTemplateSpec.initContainers.push(this.container);

        removeObject(containers, this.container);
      } else {
        const initContainers = this.podTemplateSpec.initContainers;

        removeObject(initContainers, this.container);
        containers.push(this.container);
      }
    },
    clearPvcFormState(hookName) {
      // On the `closePvcForm` event, remove the
      // before save hook to prevent the PVC from
      // being created. Use the PVC's unique ID to distinguish
      // between hooks for different PVCs.
      if (this[BEFORE_SAVE_HOOKS]) {
        this.unregisterBeforeSaveHook(hookName);
      }
    },

    updateServiceAccount(neu) {
      if (neu) {
        this.podTemplateSpec.serviceAccount = neu;
        this.podTemplateSpec.serviceAccountName = neu;
      } else {
        // Note - both have to be removed in order for removal to work
        delete this.podTemplateSpec.serviceAccount;
        delete this.podTemplateSpec.serviceAccountName;
      }
    },
    get,
    set
  },

};
</script>

<template>
  <Loading v-if="$fetchState.pending" />

  <form v-else>
    <div class="container-row">
      <div class="col span-4">
        <LabeledSelect
          v-if="containerOptions.length > 0"
          :value="container"
          option-label="name"
          :label="t('workload.container.titles.container')"
          :options="containerOptions"
          @input="selectContainer"
        />
      </div>
      <div v-if="!isView" class="col">
        <button type="button" class="btn role-tertiary add" @click="addContainer">
          {{ t('verrazzano.components.config.labels.addContainer') }}
        </button>
      </div>
      <div v-if="allContainers.length > 0 && !isView" class="col">
        <button type="button" class="btn-sm role-link" :disabled="!container" @click="removeContainer(container)">
          {{ t('workload.container.removeContainer') }}
        </button>
      </div>
    </div>

    <Tabbed v-if="container" :key="containerChange" :side-tabs="true">
      <Tab :label="t('workload.container.titles.general')" name="general" :weight="tabWeightMap['general']">
        <div>
          <div :style="{'align-items':'center'}" class="row mb-20">
            <div class="col span-6">
              <LabeledInput v-model="container.name" :mode="mode" :label="t('workload.container.containerName')" :placeholder="getNotSetPlaceholder(value, 'container.name')" />
            </div>
            <div class="col span-6">
              <LabeledSelect
                v-model="containerKind"
                :label="t('verrazzano.VerrazzanoHelidonWorkload.config.fields.container.kind')"
                :options="[{value:'standard', label: t('verrazzano.VerrazzanoHelidonWorkload.config.types.containerKind.standard')},
                           {value: 'init', label: t('verrazzano.VerrazzanoHelidonWorkload.config.types.containerKind.init')},
                           {value:'ephemeral', label: t('verrazzano.VerrazzanoHelidonWorkload.config.types.containerKind.ephemeral')}]"
                @input="updateContainerKind($event)"
              />
            </div>
          </div>
          <h3>{{ t('workload.container.titles.image') }}</h3>
          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model.trim="container.image"
                :mode="mode"
                :label="t('workload.container.image')"
                :placeholder="t('generic.placeholder', {text: 'nginx:latest'}, true)"
                required
              />
            </div>
            <div class="col span-6">
              <LabeledSelect
                v-model="container.imagePullPolicy"
                :label="t('workload.container.imagePullPolicy')"
                :options="pullPolicyOptions"
                :mode="mode"
                :placeholder="getNotSetPlaceholder(value.container, 'imagePullPolicy')"
              />
            </div>
          </div>
        </div>

        <div class="spacer"></div>
        <div>
          <h3>{{ t('workload.container.titles.ports') }}</h3>
          <div class="row">
            <WorkloadPorts v-model="container.ports" :name="value.metadata.name" :services="servicesOwned" :mode="mode" />
          </div>
        </div>

        <div class="spacer"></div>
        <div>
          <h3>{{ t('workload.container.titles.command') }}</h3>
          <Command v-model="container" :secrets="namespacedSecrets" :config-maps="namespacedConfigMaps" :mode="mode" />
        </div>
        <ServiceNameSelect
          :value="podTemplateSpec.serviceAccountName"
          :mode="mode"
          :select-label="t('workload.serviceAccountName.label')"
          :select-placeholder="t('workload.serviceAccountName.label')"
          :options="namespacedServiceNames"
          option-label="metadata.name"
          :placeholder="getNotSetPlaceholder(value.podTemplateSpec, 'serviceAccountName')"
          @input="updateServiceAccount"
        />

        <div class="spacer"></div>
        <div>
          <h3>{{ t('workload.container.titles.lifecycle') }}</h3>
          <LifecycleHooks v-model="container.lifecycle" :mode="mode" />
        </div>
      </Tab>
      <Tab :label="t('workload.storage.title')" name="storage" :weight="tabWeightMap['storage']">
        <Storage
          v-model="podTemplateSpec"
          :namespace="value.metadata.namespace"
          :register-before-hook="registerBeforeHook"
          :mode="mode"
          :secrets="namespacedSecrets"
          :config-maps="namespacedConfigMaps"
          :container="container"
          :save-pvc-hook-name="savePvcHookName"
          @removePvcForm="clearPvcFormState"
        />
      </Tab>
      <Tab :label="t('workload.container.titles.resources')" name="resources" :weight="tabWeightMap['resources']">
        <h3 class="mb-10">
          <t k="workload.scheduling.titles.limits" />
        </h3>
        <ContainerResourceLimit v-model="flatResources" :mode="mode" :show-tip="false" />
        <template>
          <div class="spacer"></div>
          <div>
            <h3 class="mb-10">
              <t k="workload.scheduling.titles.tolerations" />
            </h3>
            <div class="row">
              <Tolerations v-model="podTemplateSpec.tolerations" :mode="mode" />
            </div>
          </div>

          <div>
            <div class="spacer"></div>
            <h3 class="mb-10">
              <t k="workload.scheduling.titles.priority" />
            </h3>
            <div class="row">
              <div class="col span-6">
                <LabeledInput
                  v-model.number="podTemplateSpec.priority"
                  :mode="mode"
                  :label="t('workload.scheduling.priority.priority')"
                  :placeholder="getNotSetPlaceholder(value.podTemplateSpec, 'priority')"
                />
              </div>
              <div class="col span-6">
                <LabeledInput
                  v-model="podTemplateSpec.priorityClassname"
                  :mode="mode"
                  :label="t('workload.scheduling.priority.className')"
                  :placeholder="getNotSetPlaceholder(value.podTemplateSpec, 'priorityClassname')"
                />
              </div>
            </div>
          </div>
        </template>
      </Tab>
      <Tab :label="t('verrazzano.components.config.titles.scheduling')" name="scheduling" :weight="tabWeightMap['scheduling']">
        <Affinity
          :mode="mode"
          :value="getField('spec.workload.spec.deploymentTemplate.podSpec.affinity')"
          @input="setFieldIfNotEmpty('spec.workload.spec.deploymentTemplate.podSpec.affinity', $event)"
        />
      </Tab>
      <Tab v-if="!isInitContainer" :label="t('workload.container.titles.healthCheck')" name="healthCheck" :weight="tabWeightMap['healthCheck']">
        <HealthCheck v-model="healthCheck" :mode="mode" />
      </Tab>
      <Tab :label="t('workload.container.titles.securityContext')" name="securityContext" :weight="tabWeightMap['securityContext']">
        <Security v-model="container.securityContext" :mode="mode" />
        <div class="spacer"></div>
        <div>
          <h3>{{ t('workload.container.security.podFsGroup') }}</h3>
          <div class="row">
            <div class="col span-6">
              <LabeledInput
                v-model.number="podFsGroup"
                type="number"
                :mode="mode"
                :label="t('workload.container.security.fsGroup')"
                :placeholder="getNotSetPlaceholder(value, 'podFsGroup')"
              />
            </div>
          </div>
        </div>
      </Tab>
      <Tab :label="t('workload.container.titles.networking')" name="networking" :weight="tabWeightMap['networking']">
        <Networking v-model="podTemplateSpec" :mode="mode" />
      </Tab>
    </Tabbed>
  </form>
</template>

<style lang='scss'>
.container-row{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.type-placeholder{
  color: white;
    font-size: 2.5em;
    height: 100%;
    width: 100%;
    background-color: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
}

.type-description{
  color: var(--input-label)
}

.next-dropdown{
  display: inline-block;
}
</style>
