# Case Study: KIMS Centralized Valet System

### Scaling Campus-Wide Automotive Logistics via a Hub-and-Spoke Architecture

---

## Executive Summary

The **KIMS Centralized Valet System** is a high-performance, enterprise-grade logistics solution designed to streamline, track, and optimize high-volume valet parking operations across an expansive campus. By transitioning from fragmented manual tracking to a highly coordinated **Hub-and-Spoke model**, the platform ensures real-time vehicle tracking, optimized driver workflows, and a frictionless experience for visitors.

* **Role:** Lead Mobile Application & Web Developer
* **Architecture:** Multi-tenant Hub-and-Spoke (Desktop Central Control + Tablet Field Operations)
* **Key Focus:** Real-time state synchronization, optimized tablet UI/UX, and driver assignment algorithms.

---

## The Challenge

Large-scale medical and commercial campuses face volatile traffic influxes, leading to bottlenecks at drop-off zones, delayed vehicle retrieval times, and tracking inefficiencies. The core challenges identified during the discovery phase included:

* **Communication Gaps:** Lack of real-time coordination between central entry points (Hubs) and distributed parking zones (Spokes).
* **State Tracking Visibility:** Difficulty in tracking the precise lifecycle of a vehicle from intake to key-storage, parking, and ultimate retrieval.
* **Driver Inefficiencies:** Suboptimal driver allocation, leading to increased vehicle turnaround times and idling.

---

## System Architecture: The Hub-and-Spoke Model

To solve these operational bottlenecks, the system was designed around a centralized, synchronized architecture split cleanly across operational layers:



### 1. The Desktop Hub (Central Control)

A web-based portal dedicated to high-level oversight, gate management, master key-box assignments, and financial/payment policy audits.

### 2. The Tablet Spokes (Field Operations)

A high-fidelity, performance-optimized mobile/tablet application deployed directly to operators in the field. This layer handles rapid vehicle intake, real-time status updates, driver assignments, and instant field notifications.

---

## Core Features & Technical Implementation

### Valet Lifecycle & State Management

Vehicles transition through strict, deterministic states to maintain data integrity across the network. The tablet app relies on a reactive UI to update operators instantly as vehicle statuses change.

| State | Responsibility | Trigger Action |
| --- | --- | --- |
| **Intake / Token Generated** | Hub / Entry Spoke | Customer hands over vehicle; SMS notification triggered to owner. |
| **Driver Assigned** | System / Operator | Dispatch of field driver to the vehicle. |
| **Parked & Logged** | Field Spoke | Driver parks car, logs exact bay coordinates, and secures keys. |
| **Retrieval Requested(car call)** | Customer / Hub | Digital or manual request initiated; car status moves to dispatch. |
| **Handed Over** | Exit Spoke | Verification of payment/token; vehicle returned to owner. |

### Optimized Field UI & Performance

Because field operators work in fast-paced, high-glare outdoor environments, the mobile/tablet application prioritized high-contrast, minimalist design principles:

* **Touch Target Optimization:** Oversized interactive components designed to minimize input errors by operators wearing gloves or moving quickly.

* **Automated SMS Workflow:** Immediate, automated text alerts sent to customers upon intake and retrieval readiness, reducing vehicle dwell time at the exit gate.



---

## Results & Operational Impact

Following initial deployment and structured trial runs, the platform achieved significant operational enhancements:

> **Key Performance Indicators:**
> * **Turnaround Efficiency:** Significantly reduced average vehicle retrieval times through deterministic driver routing and precise bay mapping.

> * **User Adoption:** Delivered a frictionless learning curve for field staff via a streamlined, ultra-clean mobile layout that stripped out visual noise in favor of high-priority actions.
> 
>