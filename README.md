# TrustPartner

B2B 차량 · 사고처리 관리 ERP 모바일 애플리케이션

렌터카 법인 및 사고처리 업체의 차량 관리 및 계약 처리 업무를  
모바일 환경에서 수행할 수 있도록 개발된 **React Native 기반 ERP 서비스**입니다.

---

# 📊 Project Summary

- 개발 기간 : **2025.09 – 2026.01**
- 프로젝트 유형 : **Team Project**
- 팀 구성 : **PM 1 · App Frontend 1 · Web Frontend 1 · Backend 4**
- 담당 역할 : **Mobile Frontend Developer**

---

# 📖 Project Overview

TrustPartner는 렌터카 법인과 사고처리 업체가 사용하는  
**차량 관리 및 계약 처리 ERP 시스템**입니다.

차량 상태, 사용자 권한, 계약 진행 단계에 따라  
업무 흐름이 달라지는 구조를 기반으로

- 차량 관리
- 배차 처리
- 계약서 작성
- 사고 차량 처리

등의 업무를 모바일 환경에서 수행할 수 있도록 설계된 서비스입니다.

---

# 🚀 Key Features

- 차량 상태 및 사용자 권한 기반 기능 분기
- 일반 / 보험 / 교체 계약서 작성 Step Form 시스템
- React Query 기반 계약서 생성 및 임시저장 기능
- Presigned URL 기반 계약서 이미지 업로드
- SignatureCanvas 기반 전자 서명 입력
- 계약서 임시저장 및 재진입 기능
- 차량 상태 관리 및 배차 처리 기능

---

# 👨‍💻 My Role (Mobile Frontend)

React Native 기반 **모바일 프론트엔드 개발 담당**

### 주요 구현 기능

- ERP 모바일 UI 구조 설계 및 화면 구현
- 차량 상태 및 사용자 권한 기반 기능 분기 로직 구현
- 일반 / 보험 / 교체 계약서 작성 Step Form 플로우 구현
- React Query 기반 계약서 생성 및 임시저장 로직 구현
- Zustand 기반 전역 상태 관리 구조 설계
- Presigned URL 기반 이미지 업로드 기능 구현
- SignatureCanvas 기반 서명 입력 기능 구현

---

# ⚙️ Key Implementation

## 차량 상태 및 권한 기반 기능 분기

차량 상태와 사용자 권한에 따라  
가능한 기능과 계약서 작성 흐름이 달라지는 구조였습니다.

이를 위해

- 차량 상태
- 사용자 역할
- 계약 진행 상태

를 기준으로 기능을 분기하는 로직을 구현했습니다.

이를 통해 사용자 역할과 차량 상태에 따라  
적절한 계약서 작성 및 배차 처리 흐름이 동작하도록 구성했습니다.

---

## 계약서 작성 Step Form 구조

일반 / 보험 / 교체 계약서 3종에 대해  
각각 다른 입력 필드와 작성 흐름이 필요했습니다.

이를 해결하기 위해

- 단계형 Step Form UI 구조 설계
- 계약서 생성 → 작성 → 저장 흐름 구현
- 기존 계약서 재진입 로직 구현

을 통해 복잡한 계약서 작성 과정을  
단계별 입력 흐름으로 구성했습니다.

---

## Presigned URL 기반 이미지 업로드

계약서 작성 과정에서는

- 차량 사진
- 계약서 사진
- 고객 서명

이미지를 함께 저장해야 했습니다.

이를 위해

1️⃣ 서버에서 업로드 URL 발급  
2️⃣ 클라이언트에서 S3 직접 업로드  
3️⃣ 업로드 완료 후 계약서 저장 API 호출  

구조로 이미지 업로드 흐름을 구현했습니다.

이를 통해 이미지 업로드와 계약 데이터 저장을  
분리된 흐름으로 안정적으로 처리할 수 있도록 구성했습니다.

---

# 📊 Contract Flow

차량 선택부터 계약 저장까지의 전체 흐름

Vehicle 선택  
↓  
계약서 타입 선택 (일반 / 보험 / 교체)  
↓  
Step Form 입력  
↓  
차량 계약/사진 업로드  
↓  
고객 서명 입력  
↓  
Presigned URL 기반 이미지 업로드  
↓  
계약서 저장

---

# 🧠 Technical Highlights

### React Query 기반 계약 저장 로직

계약서 저장 과정에서는

1. 서버에서 Presigned URL 발급  
2. 클라이언트에서 이미지 업로드  
3. 업로드된 fileKey와 함께 계약 데이터 저장  

순서로 처리하도록 구현했습니다.

```ts
const mutation = useMutation({
  mutationFn: async ({
    contractId,
    payload,
    contractPhotos,
    signaturePhoto,
  }) => {

    const uploadUrls = await getContractUploadUrls(contractId);

    const contractPhotoKeys: string[] = [];
    let customerSignatureKey: string | undefined;

    // 계약 사진 업로드
    for (let i = 0; i < contractPhotos.length; i++) {
      const slot = uploadUrls.contractPhotos[i];

      await uploadImageToS3(slot.uploadUrl, contractPhotos[i].uri);

      contractPhotoKeys.push(slot.fileKey);
    }

    // 서명 업로드
    if (signaturePhoto) {
      const signSlot = uploadUrls.signaturePhoto;

      await uploadImageToS3(signSlot.uploadUrl, signaturePhoto.uri);

      customerSignatureKey = signSlot.fileKey;
    }

    // 계약서 저장
    await saveInsuranceContract(contractId, {
      ...payload,
      contractPhotoKeys,
      customerSignatureKey,
    });
  },
});
```
이 구조를 통해
- 이미지 업로드와 계약 데이터 저장을 분리하고
- 대용량 파일 업로드를 서버 부하 없이 처리할 수 있도록 구현했습니다.

# 📱 App Screens

<table>
<tr>
<td align="center">
<img width="250" height="2532" alt="Image" src="https://github.com/user-attachments/assets/8cd63fcc-b62b-4ae3-8174-78486023b597" />
</td>
<td align="center">
<img width="250" height="2532" alt="Image" src="https://github.com/user-attachments/assets/1833c523-9f47-4d44-96fd-d45f4bfb1feb" />
</td>
</tr>
<tr>
<td align="center">
<img width="250" height="2532" alt="Image" src="https://github.com/user-attachments/assets/96c37a8e-79a7-4f7d-a9fb-b86a7c3a1366" />
</td>
<td align="center">
<img width="250" height="2532" alt="Image" src="https://github.com/user-attachments/assets/b7ce115a-2218-4cf1-af1c-fb2b7b177654" />
</td>
<td align="center">
<img width="250" height="2532" alt="Image" src="https://github.com/user-attachments/assets/df6c87de-1051-4c8b-b4a4-bfdf47712325" />
</td>
</tr>
</table>

---
# 🗂 Project Structure

프로젝트는 기능 단위 구조와 도메인 기반 상태 관리를 기준으로 구성했습니다.

```
src
├─ api           # API 요청 로직 (기능 단위로 분리)
├─ assets        # 이미지 및 정적 리소스
├─ components    # 공통 UI 컴포넌트
├─ config        # 앱 설정
├─ constants     # 상수 관리
├─ hooks         # React Query 및 커스텀 훅
├─ mock          # 테스트용 Mock 데이터
├─ navigations   # React Navigation 설정
├─ screens       # 화면 단위 컴포넌트
├─ states        # 사용자 / 인증 등 도메인 상태 관리 (Zustand)
├─ stores        # 모달 / 검색 등 UI 상태 관리 (Zustand)
├─ types         # TypeScript 타입 정의
└─ utils         # 공통 유틸 함수
```
 ---

# 🛠 Tech Stack

### Frontend

- React Native
- TypeScript
- React Query
- Zustand
- Axios
- React Navigation

---

# 📌 Repository Note

이 레포지토리는 TrustPartner ERP 프로젝트의  
**React Native 기반 모바일 프론트엔드 코드 레포지토리입니다.**

프로젝트는 실제 클라이언트 서비스를 목표로 개발되었으며  
개발 막바지 단계에서 프로젝트 진행이 중단되어  
일부 개선 이슈가 남아 있는 상태입니다.
