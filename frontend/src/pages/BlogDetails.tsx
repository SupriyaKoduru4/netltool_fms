import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBlogByIdQuery } from '../services/api/blogSlice';
import OptionsContainer from '../components/UI/OptionsContainer';

interface Blog {
  _id?: string;
  id?: number;
  title?: string;
  content?: string;
  summary?: string;

}

function BlogDetails() {
  return (
    <div>
      
    </div>
  )
}

export default BlogDetails

