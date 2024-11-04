'use client'

import { useState, useCallback } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onFinish = useCallback(async (values: { identifier: string; password: string }) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: values.identifier,
        password: values.password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        message.success('Login successful')
        router.push('/')
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Form
          name="login"
          className="mt-8 space-y-6"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="identifier"
            rules={[{ required: true, message: 'Please input your Username or Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username or Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}