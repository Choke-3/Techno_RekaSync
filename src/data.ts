import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'lumina-branding',
    title: 'Lumina Branding',
    clientName: 'Sarah Johnson',
    clientEmail: 'contact@studiobloom.com',
    description: 'Developing a comprehensive brand identity including logo design, color palette, and visual guidelines. The aesthetic focuses on minimalist, high-contrast directions to establish a strong market presence.',
    status: 'Active',
    createdDate: '14 May 2026',
    team: ['JS', 'AL', '+3'],
    assets: [
      {
        id: 'lumina-asset-1',
        title: 'Neon Synth',
        category: 'Minimalist',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaTf4HuhqgW2wtkbFSgjArIUwIxAYwD8Vr_0o2dBy62ELnhNmBRyL3qaHvlHkpGRQjwcfejDROX9yjQlkfME-NBYiFQ_ne-5enDgDclDqJXlVppx7iXUaHYNR458jmmBzP0zek3XKWurcgPyQHZ50kjQnIfkE3yX_smIxeceAduFIQ_XMZXHpZAdG-yrX5G0Pj-bWaozZeDxcGD8MfXASMMCPovSAwb3ggmenkYcCkiKcuAwyRny5XcPqdB_fUH447nI0M_vRmuX4',
        loveCount: 114,
        skipCount: 7,
        totalSwipes: 121
      },
      {
        id: 'lumina-asset-2',
        title: 'Prism Glass',
        category: 'Minimalist',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsZPyKINk-7tefZ8IiPBxSub7VJcYV2y-eSzlmbbFlReD3FS1dDUxPxSu7DwPc9Mr-0gRe3tt1pNbczXCHUglMild6eUw3D8qbyxHrwvQCx-qF60VOAnidP82y_OU3ik_4SAOsCUMwRocOCeMW9m3rxUlsAfM4se9EoeO-Mz1FfBGt80utIVJqWPVkC6bjWeCZq6lUrxO9TZbLtStuQO5HfJkiSFU33zkLCT4yr47hsDDXRo1BXw3JnrwHl-91uQhInj0-aAUGhKA',
        loveCount: 106,
        skipCount: 15,
        totalSwipes: 121
      },
      {
        id: 'lumina-asset-3',
        title: 'Grid Horizon',
        category: 'Technical',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgMewkBk_qyLfL57LEeADT3AY6lqe4U6XGoaUauwDMrp1yW49Plo1nwCA65f7waiM1s9rOLD_yexfmc_fsLJa_hguKxacYwmkKQL7oIDc0ZxyRpig4jE9ln5eGDc_RRScRfUd8VBblv0eLFCOzcDBcqZs8RCMl2LvfmF6g_lQ6j5CJ0-cwBF2u9GjL_Ol3Ks-1YiKGFRqBIYxz1tnzAc9sxJkR0GZqV1L_ueqXznGk-VMSmHLItKtWGUr58UEm9HrjWsphaA3Jiv4',
        loveCount: 75,
        skipCount: 46,
        totalSwipes: 121
      },
      {
        id: 'lumina-asset-4',
        title: 'Mercury Wave',
        category: 'Minimalist',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd9w5hMxPSgJgFzpd_OuzMxBsssWVWBXA8F9Z3WRu9yAddvC_AJGppInY-ivoe0SCmTYcce6skb-upBAZECH7ws0wOMHBPBPsT7tu-kAD9Nj5LRU2ZDcZ-AV7O5w8pVJGRq5Uw5ynvt3SWN9P0IVUTS7Q2b6nTU_Kpw_rg1vjbMhOOth6Mcm2QJj_lpjaW-NnSl1guN9ow3EID4Bi5dzI-xDk6B4sLZEO4Qs9_rmHsB9KPdwTqVuH5iKjQo5UeA8g5w87h0E3UrLk',
        loveCount: 102,
        skipCount: 19,
        totalSwipes: 121
      },
      {
        id: 'lumina-asset-5',
        title: 'Node Cluster',
        category: 'Cyber',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXeSELmlSa4ISuM5p8BIARgBIwSGKsuI9F-ddFNQZBwb5sE2793KkGh1zLXHTJjln8mfey6MwLPXKASFK6YDWyRdtQAcUaFFwrmJtzTYLtIXIolw9eV6yWBGyGWjrrO5pV467Hyp2GCZAf7TMY6sJNsg-IfX4oPZhm8l_iTVRqV4yyeDsTAz8kwlPfV_Q-8iDqLxR0B6PzmnnMLZW4QfPzEcEIMWai9WeuoasUvx_P6sCUsXxcgBdWWXsa424UbODbLYDWCyiLYPo',
        loveCount: 54,
        skipCount: 67,
        totalSwipes: 121
      }
    ]
  },
  {
    id: 'echo-app-ui',
    title: 'Echo App UI',
    clientName: 'Michael Chen',
    clientEmail: 'michael@echotech.io',
    description: 'Mobile and tablet app layout concept design aiming at busy professionals. Designed a high contrast system prioritizing instant accessibility of user workflows.',
    status: 'Completed',
    createdDate: '28 Apr 2026',
    team: ['MC', 'AL'],
    assets: [
      {
        id: 'echo-asset-1',
        title: 'Echo Main View',
        category: 'Mobile UI',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaTf4HuhqgW2wtkbFSgjArIUwIxAYwD8Vr_0o2dBy62ELnhNmBRyL3qaHvlHkpGRQjwcfejDROX9yjQlkfME-NBYiFQ_ne-5enDgDclDqJXlVppx7iXUaHYNR458jmmBzP0zek3XKWurcgPyQHZ50kjQnIfkE3yX_smIxeceAduFIQ_XMZXHpZAdG-yrX5G0Pj-bWaozZeDxcGD8MfXASMMCPovSAwb3ggmenkYcCkiKcuAwyRny5XcPqdB_fUH447nI0M_vRmuX4',
        loveCount: 41,
        skipCount: 4,
        totalSwipes: 45
      }
    ]
  },
  {
    id: 'project-xray',
    title: 'Project X-Ray',
    clientName: 'Internal Team',
    clientEmail: 'internal@rekasync.io',
    description: 'Internal experimentation and prototype sandbox layout for custom widgets and real-time visualization frameworks.',
    status: 'Archived',
    createdDate: '12 Jan 2026',
    team: ['AL', 'JS', 'ML'],
    assets: []
  }
];
