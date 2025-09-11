// Configuration Templates - Enhanced with O-RAN, NB-IoT, V2X and NTN templates
window.ConfigTemplates = {
  // NTN Templates
  ntn: {
    basic_geo: {
      name: "Basic GEO NTN",
      description: "GEO satellite NTN configuration with constant delay",
      amf: { addr: "127.0.0.1", port: 38412, bind_addr: "127.0.0.1" },
      ru_sdr: { device_driver: "uhd", device_args: "type=b200", srate: 23.04 },
      cell_cfg: { 
        dl_arfcn: 3732480, 
        band: 256, 
        channel_bandwidth_MHz: 20,
        ntn: {
          enabled: true,
          satellite_type: "GEO",
          propagation_delay_ms: 270,
          doppler_shift_hz: 0,
          harq_enabled: false,
          sib19_enabled: true
        }
      },
      log: { filename: "/tmp/ntn_geo.log", all_level: "info" }
    },
    meo_satellite: {
      name: "MEO Satellite",
      description: "MEO satellite configuration with variable delay",
      cell_cfg: { 
        dl_arfcn: 3732480, 
        band: 256, 
        channel_bandwidth_MHz: 20,
        ntn: {
          enabled: true,
          satellite_type: "MEO",
          propagation_delay_ms: 50,
          doppler_shift_hz: 2000,
          harq_enabled: true,
          sib19_enabled: true,
          timing_advance_enabled: true
        }
      },
      log: { filename: "/tmp/ntn_meo.log", all_level: "debug" }
    },
    leo_satellite: {
      name: "LEO Satellite",
      description: "LEO satellite configuration with high Doppler",
      cell_cfg: { 
        dl_arfcn: 3732480, 
        band: 256, 
        ntn: {
          enabled: true,
          satellite_type: "LEO",
          propagation_delay_ms: 5,
          doppler_shift_hz: 8000,
          harq_enabled: true,
          sib19_enabled: true
        }
      },
      log: { filename: "/tmp/ntn_leo.log", all_level: "debug" }
    }
  },

  // V2X Templates
  v2x: {
    basic_cv2x: {
      name: "Basic C-V2X",
      description: "Standard C-V2X configuration for testing",
      rf: { dl_earfcn: 54890, tx_gain: 60, rx_gain: 40, device_name: "uhd" },
      cell: { n_prb: 50, bandwidth_MHz: 10 },
      v2x: { 
        enabled: true,
        mode: "mode4",
        sidelink_freq: 5905000000,
        resource_pool: 0,
        sync_source: "gnss",
        pssch_enabled: true,
        pscch_enabled: true,
        pc5_interface: true
      },
      log: { all_level: "info", filename: "/tmp/v2x.log" }
    }
  },

  // NB-IoT Templates
  nbiot: {
    basic_nbiot: {
      name: "Basic NB-IoT",
      description: "Standard NB-IoT configuration for testing",
      rf: { dl_earfcn: 3350, tx_gain: 60, rx_gain: 40, device_name: "uhd" },
      cell: { n_prb: 1, phich_length: "normal", phich_resources: "1/6" },
      nbiot: { 
        enabled: true,
        inband_carrier: true,
        anchor_carrier: true,
        nprach_cp_length: "normal",
        nprach_detect_threshold: 40,
        max_nprach_preamble_attempts: 10
      },
      log: { all_level: "info", filename: "/tmp/nbiot.log" }
    }
  },

  // Existing templates
  gnb: {
    basic_5g_nr: {
      name: "Basic 5G NR",
      description: "Standard 5G gNodeB configuration",
      amf: { addr: "127.0.0.1", port: 38412, bind_addr: "127.0.0.1" },
      ru_sdr: { device_driver: "uhd", device_args: "type=b200", srate: 23.04 },
      cell_cfg: { dl_arfcn: 632628, band: 78, channel_bandwidth_MHz: 20 },
      log: { filename: "/tmp/gnb.log", all_level: "warning" }
    }
  },

  enb: {
    basic_lte: {
      name: "Basic LTE",
      description: "Standard LTE eNodeB configuration",
      enb: { enb_id: "0x19B", mcc: "001", mnc: "01", mme_addr: "127.0.0.1" },
      rf: { dl_earfcn: 3350, tx_gain: 80, rx_gain: 40, device_name: "uhd" },
      log: { all_level: "warning", filename: "/tmp/enb.log" }
    }
  },

  core: {
    basic_5g_core: {
      name: "Basic 5G Core",
      description: "Standard 5G core network configuration",
      amf: { sbi: { addr: "127.0.0.1", port: 7777 }, ngap: { addr: "127.0.0.1" } },
      smf: { sbi: { addr: "127.0.0.1", port: 7777 } },
      log: { all_level: "info", filename: "/tmp/core.log" }
    }
  },

  ims: {
    basic_ims: {
      name: "Basic IMS",
      description: "IMS core configuration",
      kamailio: { listen: "udp:127.0.0.1:5060", alias: "ims.local" },
      log: { all_level: "info", filename: "/tmp/ims.log" }
    }
  }
};
