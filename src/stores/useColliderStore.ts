import type { Object3D } from 'three'
import { create } from 'zustand'

export type ColliderData = { kind: 'laser' } | { kind: 'blocker' } | { kind: 'socket'; socketIndex: number }

interface ColliderState {
  /** Every object that stops a laser beam, read every frame by the lasers (non-reactively). */
  colliders: Object3D[]
  addCollider: (collider: Object3D) => void
  removeCollider: (collider: Object3D) => void
}

export const useColliderStore = create<ColliderState>()((set) => ({
  colliders: [],
  addCollider: (collider) => set((state) => ({ colliders: [...state.colliders, collider] })),
  removeCollider: (collider) => set((state) => ({ colliders: state.colliders.filter((c) => c !== collider) })),
}))

export const getColliderData = (collider: Object3D) => collider.userData as ColliderData
